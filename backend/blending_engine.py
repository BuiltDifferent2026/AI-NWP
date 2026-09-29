import numpy as np
import pandas as pd
from typing import Dict, Any, Optional
from .models_loader import registry

VALID_TEMP_REGIONS = [
    'west_coast_or_western_india', 
    'east_coast_or_bay', 
    'northeast_or_east', 
    'northwest_or_gangetic', 
    'himalayan_north'
]

VALID_TEMP_REGIMES = [
    'normal', 
    'monsoon_background', 
    'monsoon_transition_high_disagreement', 
    'pre_monsoon_heat', 
    'post_monsoon_disturbed'
]

VALID_WIND_REGIONS = [
    'East_Coast_Bay_of_Bengal', 
    'Northeast_India', 
    'Northwest_India', 
    'West_Coast_Arabian_Sea'
]

VALID_WIND_REGIMES = [
    'monsoon_background', 
    'normal', 
    'post_monsoon_disturbed', 
    'pre_monsoon_heat'
]

def softmax(logits: np.ndarray) -> np.ndarray:
    e = np.exp(logits - np.max(logits))
    return e / np.sum(e)

def blend_temperature(
    hres: float,
    pangu: float,
    ens: float,
    lead_hours: int = 72,
    latitude: float = 19.0,
    longitude: float = 73.0,
    month: int = 7,
    region_zone: str = "west_coast_or_western_india",
    regime: str = "normal",
    hres_skill_mae: float = 1.055,
    pangu_skill_mae: float = 0.633,
    ens_skill_mae: float = 1.063,
    hres_skill_bias: float = -0.495,
    pangu_skill_bias: float = -0.175,
    ens_skill_bias: float = -0.779
) -> Dict[str, Any]:
    """
    Computes adaptive LightGBM gating weights for 2m Temperature.
    Formula: y_hat = sum(w_i * f_i), where w_i = softmax(-beta * predicted_error_i)
    """
    # Safe categorical normalization
    if region_zone not in VALID_TEMP_REGIONS:
        region_zone = "west_coast_or_western_india"
    if regime not in VALID_TEMP_REGIMES:
        regime = "normal"

    f_mean = (hres + pangu + ens) / 3.0
    f_std = float(np.std([hres, pangu, ens]))
    f_spread = max(hres, pangu, ens) - min(hres, pangu, ens)
    m_sin = float(np.sin(2 * np.pi * month / 12.0))
    m_cos = float(np.cos(2 * np.pi * month / 12.0))

    # Relative skill ratios
    best_mae = min(hres_skill_mae, pangu_skill_mae, ens_skill_mae)
    hres_rel = hres_skill_mae / best_mae if best_mae > 0 else 1.0
    pangu_rel = pangu_skill_mae / best_mae if best_mae > 0 else 1.0
    ens_rel = ens_skill_mae / best_mae if best_mae > 0 else 1.0

    features_dict = {
        'hres': hres,
        'pangu': pangu,
        'ens': ens,
        'forecast_mean': f_mean,
        'forecast_std': f_std,
        'forecast_spread': f_spread,
        'latitude': latitude,
        'longitude': longitude,
        'lead_hours': lead_hours,
        'month_sin': m_sin,
        'month_cos': m_cos,
        'hres_skill_mae': hres_skill_mae,
        'pangu_skill_mae': pangu_skill_mae,
        'ens_skill_mae': ens_skill_mae,
        'hres_skill_bias': hres_skill_bias,
        'pangu_skill_bias': pangu_skill_bias,
        'ens_skill_bias': ens_skill_bias,
        'hres_relative_skill': hres_rel,
        'pangu_relative_skill': pangu_rel,
        'ens_relative_skill': ens_rel,
        'region_zone': region_zone,
        'regime': regime
    }

    df = pd.DataFrame([features_dict])
    for col in ['region_zone', 'regime']:
        df[col] = df[col].astype('category')

    gates = registry.temp_gates
    err_hres = float(gates['hres'].predict(df)[0])
    err_pangu = float(gates['pangu'].predict(df)[0])
    err_ens = float(gates['ens'].predict(df)[0])

    errors = np.array([err_hres, err_pangu, err_ens])
    beta = 3.0  # trained temperature beta
    logits = -beta * errors
    weights = softmax(logits)

    w_hres, w_pangu, w_ens = float(weights[0]), float(weights[1]), float(weights[2])
    blended_value = w_hres * hres + w_pangu * pangu + w_ens * ens

    # Fallback policy: at 24h lead time, empirical evaluation showed Pangu is superior
    fallback_active = (lead_hours == 24)
    best_single = "Pangu-Weather"
    issued_value = pangu if fallback_active else blended_value

    dominant_key = ["HRES", "Pangu-Weather", "IFS ENS Mean"][int(np.argmax(weights))]

    # Confidence rating based on inter-model spread
    if f_spread < 1.0:
        conf_label = "High Agreement"
        spread_index = 0.25
    elif f_spread < 2.5:
        conf_label = "Moderate Spread"
        spread_index = 0.45
    else:
        conf_label = "High Disagreement"
        spread_index = 0.75

    return {
        "variable": "temperature",
        "unit": "°C",
        "inputs": {
            "hres": hres,
            "pangu": pangu,
            "ens": ens
        },
        "predicted_errors": {
            "hres": err_hres,
            "pangu": err_pangu,
            "ens": err_ens
        },
        "weights": {
            "hres": w_hres,
            "pangu": w_pangu,
            "ens": w_ens
        },
        "blended_value": round(blended_value, 2),
        "issued_value": round(issued_value, 2),
        "dominant_model": dominant_key,
        "fallback_active": fallback_active,
        "fallback_model": best_single if fallback_active else None,
        "fallback_reason": "Single best model (Pangu-Weather) outscores blend at 24h horizon (-1.14% gain) — fallback policy engaged." if fallback_active else None,
        "confidence": {
            "label": conf_label,
            "spread_c": round(f_spread, 2),
            "spread_index": spread_index
        },
        "context": {
            "lead_hours": lead_hours,
            "region_zone": region_zone,
            "regime": regime
        }
    }

def blend_wind(
    hres: float,
    pangu: float,
    ens: float,
    lead_hours: int = 72,
    latitude: float = 15.0,
    longitude: float = 80.0,
    month: int = 7,
    region_zone: str = "East_Coast_Bay_of_Bengal",
    regime: str = "normal",
    hres_skill_mae: float = 1.749,
    pangu_skill_mae: float = 1.426,
    ens_skill_mae: float = 1.611,
    hres_skill_bias: float = 0.028,
    pangu_skill_bias: float = -0.002,
    ens_skill_bias: float = 0.020
) -> Dict[str, Any]:
    """
    Computes adaptive LightGBM gating weights for 10m Wind Speed.
    Formula: y_hat = sum(w_i * f_i), where w_i = softmax(-beta * predicted_error_i)
    """
    if region_zone not in VALID_WIND_REGIONS:
        region_zone = "East_Coast_Bay_of_Bengal"
    if regime not in VALID_WIND_REGIMES:
        regime = "normal"

    f_mean = (hres + pangu + ens) / 3.0
    f_std = float(np.std([hres, pangu, ens]))
    f_range = max(hres, pangu, ens) - min(hres, pangu, ens)
    m_sin = float(np.sin(2 * np.pi * month / 12.0))
    m_cos = float(np.cos(2 * np.pi * month / 12.0))

    features_dict = {
        'lead_hours': lead_hours,
        'latitude': latitude,
        'longitude': longitude,
        'hres': hres,
        'pangu': pangu,
        'ens': ens,
        'hres_skill_mae': hres_skill_mae,
        'pangu_skill_mae': pangu_skill_mae,
        'ens_skill_mae': ens_skill_mae,
        'hres_skill_bias': hres_skill_bias,
        'pangu_skill_bias': pangu_skill_bias,
        'ens_skill_bias': ens_skill_bias,
        'hres_skill_n': 1000,
        'pangu_skill_n': 1000,
        'ens_skill_n': 1000,
        'month_sin': m_sin,
        'month_cos': m_cos,
        'forecast_mean': f_mean,
        'forecast_std': f_std,
        'forecast_range': f_range,
        'truth_minus_mean': 0.0,
        'region_zone': region_zone,
        'regime': regime
    }

    df = pd.DataFrame([features_dict])
    for col in ['region_zone', 'regime']:
        df[col] = df[col].astype('category')

    gates = registry.wind_gates
    err_hres = float(gates['hres'].predict(df)[0])
    err_pangu = float(gates['pangu'].predict(df)[0])
    err_ens = float(gates['ens'].predict(df)[0])

    errors = np.array([err_hres, err_pangu, err_ens])
    beta = 2.0  # trained wind beta
    logits = -beta * errors
    weights = softmax(logits)

    w_hres, w_pangu, w_ens = float(weights[0]), float(weights[1]), float(weights[2])
    blended_value = max(0.0, w_hres * hres + w_pangu * pangu + w_ens * ens)

    dominant_key = ["HRES", "Pangu-Weather", "IFS ENS Mean"][int(np.argmax(weights))]

    return {
        "variable": "wind",
        "unit": "m/s",
        "inputs": {
            "hres": hres,
            "pangu": pangu,
            "ens": ens
        },
        "predicted_errors": {
            "hres": err_hres,
            "pangu": err_pangu,
            "ens": err_ens
        },
        "weights": {
            "hres": w_hres,
            "pangu": w_pangu,
            "ens": w_ens
        },
        "blended_value": round(blended_value, 2),
        "issued_value": round(blended_value, 2),
        "dominant_model": dominant_key,
        "fallback_active": False,
        "confidence": {
            "label": "Low Spread" if f_range < 2.0 else "High Disagreement",
            "spread_mps": round(f_range, 2)
        },
        "context": {
            "lead_hours": lead_hours,
            "region_zone": region_zone,
            "regime": regime
        }
    }

def blend_rainfall(
    hres_rain_mm: float,
    latitude: float = 19.6875,
    longitude: float = 73.125,
    month: int = 7,
    day: int = 15,
    hour: int = 12
) -> Dict[str, Any]:
    """
    Predicts calibrated rainfall using the trained LightGBM rainfall model.
    Model was trained with hres_rain in meters and outputs actual_rain in meters.
    """
    model = registry.rainfall_model
    hres_m = hres_rain_mm / 1000.0  # convert mm to meters for model

    df = pd.DataFrame([{
        'hres_rain': hres_m,
        'latitude': latitude,
        'longitude': longitude,
        'month': month,
        'day': day,
        'hour': hour
    }])

    pred_m = float(model.predict(df)[0]) if model else hres_m
    pred_mm = max(0.0, pred_m * 1000.0)

    # IMD Extreme Rain Categories
    if pred_mm >= 204.5:
        severity = "Extremely Heavy Rain (Red Alert)"
        severity_code = "extreme"
    elif pred_mm >= 115.6:
        severity = "Very Heavy Rain (Orange Alert)"
        severity_code = "very_heavy"
    elif pred_mm >= 64.5:
        severity = "Heavy Rain (Yellow Watch)"
        severity_code = "heavy"
    else:
        severity = "Moderate / Normal (Green)"
        severity_code = "normal"

    return {
        "variable": "rainfall",
        "unit": "mm",
        "hres_input_mm": round(hres_rain_mm, 2),
        "blended_value": round(pred_mm, 2),
        "issued_value": round(pred_mm, 2),
        "severity": severity,
        "severity_code": severity_code,
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "datetime": {
            "month": month,
            "day": day,
            "hour": hour
        }
    }
