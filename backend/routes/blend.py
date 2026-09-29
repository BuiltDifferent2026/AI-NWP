from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from ..blending_engine import blend_temperature, blend_wind, blend_rainfall

router = APIRouter(prefix="/api/blend", tags=["blend"])

class BlendRequest(BaseModel):
    variable: str = Field("temperature", description="Weather variable: temperature, wind, or rainfall")
    hres: Optional[float] = Field(None, description="IFS HRES forecast value")
    hres_forecast: Optional[float] = Field(None, description="Alias for hres")
    pangu: Optional[float] = Field(None, description="Pangu-Weather AI forecast value")
    pangu_forecast: Optional[float] = Field(None, description="Alias for pangu")
    ens: Optional[float] = Field(None, description="IFS ENS Mean forecast value")
    ens_forecast: Optional[float] = Field(None, description="Alias for ens")
    hres_rain_mm: Optional[float] = Field(None, description="HRES rainfall input in mm")
    lead_hours: Optional[int] = Field(None, description="Forecast lead time in hours")
    lead_time_hours: Optional[int] = Field(None, description="Alias for lead_hours")
    latitude: float = Field(19.07, description="Target location latitude")
    longitude: float = Field(72.87, description="Target location longitude")
    month: int = Field(7, description="Month of year (1-12)")
    day: int = Field(15, description="Day of month (1-31)")
    hour: int = Field(12, description="Hour of day (0, 6, 12, 18 UTC)")
    region_zone: Optional[str] = Field("west_coast_or_western_india", description="Indian meteorological zone")
    regime: Optional[str] = Field("normal", description="Synoptic weather regime")

def normalize_regime(regime_input: Optional[str]) -> str:
    if not regime_input:
        return "normal"
    r = regime_input.lower().replace("-", "_")
    if "heat" in r:
        return "pre_monsoon_heat"
    if "break" in r:
        return "monsoon_transition_high_disagreement"
    if "cyclone" in r or "disturb" in r:
        return "post_monsoon_disturbed"
    if "monsoon" in r:
        return "monsoon_background"
    return "normal"

def normalize_temp_region(region_input: Optional[str]) -> str:
    if not region_input:
        return "west_coast_or_western_india"
    r = region_input.lower().replace("-", "_")
    if "bay" in r or "east_coast" in r:
        return "east_coast_or_bay"
    if "northeast" in r:
        return "northeast_or_east"
    if "gangetic" in r or "northwest" in r or "plain" in r:
        return "northwest_or_gangetic"
    if "himalaya" in r or "north" in r:
        return "himalayan_north"
    return "west_coast_or_western_india"

def normalize_wind_region(region_input: Optional[str]) -> str:
    if not region_input:
        return "West_Coast_Arabian_Sea"
    r = region_input.lower().replace("-", "_")
    if "bay" in r or "east" in r:
        return "East_Coast_Bay_of_Bengal"
    if "northeast" in r:
        return "Northeast_India"
    if "northwest" in r:
        return "Northwest_India"
    return "West_Coast_Arabian_Sea"

@router.post("/predict")
def predict_blend(req: BlendRequest):
    """
    Executes live multi-model forecast blending using the trained LightGBM error gating models.
    """
    var = req.variable.lower()

    # Extract inputs with aliases
    hres_val = req.hres if req.hres is not None else (req.hres_forecast if req.hres_forecast is not None else 28.5)
    pangu_val = req.pangu if req.pangu is not None else (req.pangu_forecast if req.pangu_forecast is not None else (hres_val - 0.5))
    ens_val = req.ens if req.ens is not None else (req.ens_forecast if req.ens_forecast is not None else (hres_val - 0.2))
    lead_hours_val = req.lead_hours if req.lead_hours is not None else (req.lead_time_hours if req.lead_time_hours is not None else 72)

    norm_regime = normalize_regime(req.regime)

    if var == "temperature":
        norm_region = normalize_temp_region(req.region_zone)
        return blend_temperature(
            hres=float(hres_val),
            pangu=float(pangu_val),
            ens=float(ens_val),
            lead_hours=int(lead_hours_val),
            latitude=float(req.latitude),
            longitude=float(req.longitude),
            month=int(req.month),
            region_zone=norm_region,
            regime=norm_regime
        )
    elif var == "wind":
        norm_region = normalize_wind_region(req.region_zone)
        return blend_wind(
            hres=float(hres_val),
            pangu=float(pangu_val),
            ens=float(ens_val),
            lead_hours=int(lead_hours_val),
            latitude=float(req.latitude),
            longitude=float(req.longitude),
            month=int(req.month),
            region_zone=norm_region,
            regime=norm_regime
        )
    elif var == "rainfall":
        rain_input = req.hres_rain_mm if req.hres_rain_mm is not None else (req.hres_forecast if req.hres_forecast is not None else (req.hres if req.hres is not None else 15.0))
        return blend_rainfall(
            hres_rain_mm=float(rain_input),
            latitude=float(req.latitude),
            longitude=float(req.longitude),
            month=int(req.month),
            day=int(req.day),
            hour=int(req.hour)
        )
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported variable: {req.variable}. Choose temperature, wind, or rainfall.")

