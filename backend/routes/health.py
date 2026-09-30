from fastapi import APIRouter
from ..models_loader import registry

router = APIRouter(prefix="/api", tags=["health"])

@router.get("/health")
def get_health():
    temp_loaded = bool(registry.temp_gates)
    wind_loaded = bool(registry.wind_gates)
    rain_loaded = registry.rainfall_model is not None

    return {
        "status": "healthy",
        "service": "VayuSangam NWP/AI Forecast Blending Engine",
        "version": "1.0.0",
        "models_status": {
            "temperature_error_gates": temp_loaded,
            "wind_error_gates": wind_loaded,
            "rainfall_calibrator": rain_loaded
        },
        "data_mode": "historical_replay_eval",
        "methodology": "Adaptive Softmax Error-Gated GBDT Meta-Model"
    }
