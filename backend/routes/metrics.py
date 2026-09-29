from fastapi import APIRouter, Query
from typing import Optional
from ..models_loader import registry

router = APIRouter(prefix="/api/metrics", tags=["metrics"])

@router.get("/overall")
def get_overall_metrics(variable: Optional[str] = Query("all")):
    """
    Returns empirical verification metrics directly from the evaluated models.
    """
    temp_overall = registry.get_temperature_overall_metrics()
    wind_overall = registry.get_wind_overall_metrics()
    rain_overall = registry.get_rainfall_overall_metrics()

    if variable == "temperature":
        return temp_overall
    elif variable == "wind":
        return wind_overall
    elif variable == "rainfall":
        return rain_overall

    return {
        "temperature": temp_overall,
        "wind": wind_overall,
        "rainfall": rain_overall
    }

@router.get("/lead-time")
def get_lead_metrics(variable: Optional[str] = Query("all")):
    """
    Returns verification error across lead horizons (+24h, +72h, +120h, +168h),
    including fallback triggers.
    """
    temp_lead = registry.get_temperature_lead_metrics()
    wind_lead = registry.get_wind_lead_metrics()
    rain_lead = registry.get_rainfall_lead_metrics()

    if variable == "temperature":
        return temp_lead
    elif variable == "wind":
        return wind_lead
    elif variable == "rainfall":
        return rain_lead

    return {
        "temperature": temp_lead,
        "wind": wind_lead,
        "rainfall": rain_lead
    }

@router.get("/stratum")
def get_stratum_metrics(variable: str = Query("temperature")):
    """
    Returns detailed spatial stratum metrics across Indian climate zones.
    """
    if variable == "temperature":
        return registry.get_temperature_stratum_metrics()
    elif variable == "wind":
        return registry.get_wind_stratum_metrics()
    else:
        return registry.get_temperature_stratum_metrics()
