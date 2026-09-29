from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from ..blending_engine import blend_temperature, blend_wind, blend_rainfall

router = APIRouter(prefix="/api/blend", tags=["blend"])

class BlendRequest(BaseModel):
    variable: str = Field("temperature", description="Weather variable: temperature, wind, or rainfall")
    hres: float = Field(28.5, description="IFS HRES forecast value")
    pangu: Optional[float] = Field(27.2, description="Pangu-Weather AI forecast value")
    ens: Optional[float] = Field(27.9, description="IFS ENS Mean forecast value")
    hres_rain_mm: Optional[float] = Field(15.0, description="HRES rainfall input in mm (for rainfall variable)")
    lead_hours: int = Field(72, description="Forecast lead time in hours: 24, 72, 120, 168")
    latitude: float = Field(19.0, description="Target location latitude")
    longitude: float = Field(73.0, description="Target location longitude")
    month: int = Field(7, description="Month of year (1-12)")
    day: int = Field(15, description="Day of month (1-31)")
    hour: int = Field(12, description="Hour of day (0, 6, 12, 18 UTC)")
    region_zone: Optional[str] = Field("west_coast_or_western_india", description="Indian meteorological zone")
    regime: Optional[str] = Field("normal", description="Synoptic weather regime")

@router.post("/predict")
def predict_blend(req: BlendRequest):
    """
    Executes live multi-model forecast blending using the trained LightGBM error gating models.
    """
    var = req.variable.lower()

    if var == "temperature":
        pangu = req.pangu if req.pangu is not None else req.hres - 0.5
        ens = req.ens if req.ens is not None else req.hres - 0.2
        return blend_temperature(
            hres=req.hres,
            pangu=pangu,
            ens=ens,
            lead_hours=req.lead_hours,
            latitude=req.latitude,
            longitude=req.longitude,
            month=req.month,
            region_zone=req.region_zone or "west_coast_or_western_india",
            regime=req.regime or "normal"
        )
    elif var == "wind":
        pangu = req.pangu if req.pangu is not None else req.hres - 1.2
        ens = req.ens if req.ens is not None else req.hres - 0.8
        return blend_wind(
            hres=req.hres,
            pangu=pangu,
            ens=ens,
            lead_hours=req.lead_hours,
            latitude=req.latitude,
            longitude=req.longitude,
            month=req.month,
            region_zone=req.region_zone or "West_Coast_Arabian_Sea",
            regime=req.regime or "normal"
        )
    elif var == "rainfall":
        rain_input = req.hres_rain_mm if req.hres_rain_mm is not None else req.hres
        return blend_rainfall(
            hres_rain_mm=rain_input,
            latitude=req.latitude,
            longitude=req.longitude,
            month=req.month,
            day=req.day,
            hour=req.hour
        )
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported variable: {req.variable}. Choose temperature, wind, or rainfall.")
