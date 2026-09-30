"""
VayuSangam Backend Application
FastAPI service exposing live prediction, model verification scorecards,
weight maps, and historical replay evaluations based on real trained models.

Supports two run modes:
  1. Render (rootDir=backend): uvicorn app:app — imports are absolute within backend/
  2. Repo root:                uvicorn main:app — backend is a package, imports are relative
"""

import os
import importlib
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ── Resolve imports whether we are running as a package (relative) or as a
#    standalone module (absolute). Render runs from backend/ so `backend` is
#    not on sys.path as a package — we must use absolute imports there.
_this_dir = Path(__file__).resolve().parent
if str(_this_dir) not in sys.path:
    sys.path.insert(0, str(_this_dir))

# Dynamic import that works in both modes
def _import(module_path: str, attr: str):
    try:
        # Try relative-style first (running as backend package from repo root)
        mod = importlib.import_module(f".{module_path}", package="backend")
    except ImportError:
        # Absolute import (running as standalone module from backend/ dir on Render)
        mod = importlib.import_module(module_path)
    return getattr(mod, attr)

health_router  = _import("routes.health",   "router")
metrics_router = _import("routes.metrics",  "router")
weights_router = _import("routes.weights",  "router")
replay_router  = _import("routes.replay",   "router")
blend_router   = _import("routes.blend",    "router")
registry       = _import("models_loader",   "registry")

# ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="VayuSangam - AI-NWP Blending API",
    description="Backend API powering the VayuSangam Multi-Model Forecast Blending System for MoES/NCMRWF",
    version="1.0.0"
)

# ── CORS ──────────────────────────────────────────────────────
# In production set ALLOWED_ORIGINS env var in the Render dashboard.
# Example: https://VayuSangam.vercel.app,https://www.VayuSangam.in
_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
allowed_origins = [o.strip() for o in _origins_env.split(",") if o.strip()]

# Always allow local dev servers
allowed_origins += [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
]

if not _origins_env:
    # No production origins configured — allow all (safe for dev, set it before going live)
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────
app.include_router(health_router)
app.include_router(metrics_router)
app.include_router(weights_router)
app.include_router(replay_router)
app.include_router(blend_router)

@app.on_event("startup")
async def startup_event():
    registry.load_all()
    print(f"VayuSangam models initialized. DATA_DIR: {_import('config', 'DATA_DIR')}")

@app.get("/")
def root():
    return {
        "message": "VayuSangam Backend API is operational.",
        "documentation": "/docs",
        "health": "/api/health"
    }
