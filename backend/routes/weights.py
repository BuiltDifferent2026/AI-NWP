from fastapi import APIRouter, Query
from typing import Optional
from ..models_loader import registry

router = APIRouter(prefix="/api/weights", tags=["weights"])

@router.get("/map")
def get_weight_map(
    variable: str = Query("temperature"),
    lead_hours: Optional[int] = Query(None),
    regime: Optional[str] = Query(None)
):
    """
    Returns spatial adaptive weight allocations per region and regime.
    """
    if variable == "wind":
        data = registry.get_wind_weight_map()
    else:
        data = registry.get_temperature_weight_map()

    records = data.get("records", [])

    if lead_hours is not None:
        records = [r for r in records if r.get("lead_hours") == lead_hours]
    if regime is not None:
        records = [r for r in records if r.get("regime") == regime]

    return {
        "variable": data.get("variable", variable),
        "data_mode": data.get("data_mode", "historical_replay"),
        "total_records": len(records),
        "records": records
    }

@router.get("/importance")
def get_feature_importance():
    """
    Returns feature importance for the rainfall calibration model.
    """
    rain_importance = registry.get_rainfall_weight_map()
    return {
        "rainfall_features": rain_importance
    }
