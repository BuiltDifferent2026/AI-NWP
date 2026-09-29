"""
HyBlend Backend Application
FastAPI service exposing live prediction, model verification scorecards,
weight maps, and historical replay evaluations based on real trained models.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.health import router as health_router
from .routes.metrics import router as metrics_router
from .routes.weights import router as weights_router
from .routes.replay import router as replay_router
from .routes.blend import router as blend_router
from .models_loader import registry

app = FastAPI(
    title="HyBlend - AI-NWP Blending API",
    description="Backend API powering the HyBlend Multi-Model Forecast Blending System for MoES/NCMRWF",
    version="1.0.0"
)

# Enable CORS for local Vite frontend dev server and production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(health_router)
app.include_router(metrics_router)
app.include_router(weights_router)
app.include_router(replay_router)
app.include_router(blend_router)

@app.on_event("startup")
async def startup_event():
    # Preload models into memory on startup
    registry.load_all()
    print("HyBlend models and evaluation datasets initialized successfully.")

@app.get("/")
def root():
    return {
        "message": "HyBlend Backend API is operational.",
        "documentation": "/docs",
        "health": "/api/health"
    }
