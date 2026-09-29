from fastapi import APIRouter, Query
from ..models_loader import registry

router = APIRouter(prefix="/api/replay", tags=["replay"])

@router.get("/cases")
def get_historical_cases():
    """
    Returns verified historical model duel cases comparing physical NWP,
    AI weather model (Pangu-Weather), Ensemble mean, and the HyBlend result
    against verified ground truth (ERA5).
    """
    temp_case = registry.get_temperature_historical_replay()
    wind_case = registry.get_wind_historical_replay()
    rain_series = registry.get_rainfall_historical_replay(limit=5)

    return {
        "cases": [
            {
                "id": "case-temp-himalayan",
                "title": temp_case.get("title", "Temperature Forecast Duel"),
                "variable": "Temperature",
                "unit": "°C",
                "context": temp_case.get("context", {}),
                "observation": temp_case.get("observation", {}),
                "forecasts": temp_case.get("forecasts", {}),
                "confidence": temp_case.get("confidence", {}),
                "reasoning": temp_case.get("reasoning", []),
                "fallback_active": temp_case.get("fallback_active", False)
            },
            {
                "id": "case-wind-cyclone",
                "title": wind_case.get("title", "Wind Speed Duel (Bay of Bengal)"),
                "variable": "Wind",
                "unit": "m/s",
                "context": wind_case.get("context", {}),
                "observation": wind_case.get("observation", {}),
                "forecasts": wind_case.get("forecasts", {}),
                "confidence": wind_case.get("confidence", {}),
                "reasoning": wind_case.get("reasoning", []),
                "fallback_active": wind_case.get("fallback_active", False)
            }
        ]
    }

@router.get("/timeseries")
def get_rainfall_timeseries(limit: int = Query(60, ge=1, le=500)):
    """
    Returns time series of verified actual vs HyBlend predicted rainfall.
    """
    data = registry.get_rainfall_historical_replay(limit=limit)
    return {
        "variable": "rainfall",
        "unit": "mm",
        "count": len(data),
        "data": [
            {
                "time": item.get("time"),
                "actual_mm": round(item.get("actual", 0.0) * 1000.0, 3),
                "predicted_mm": max(0.0, round(item.get("predicted", 0.0) * 1000.0, 3))
            }
            for item in data
        ]
    }
