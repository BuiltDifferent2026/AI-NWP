import os
from pathlib import Path

# config.py lives at backend/config.py
_BACKEND_DIR = Path(__file__).resolve().parent        # .../backend/
_REPO_ROOT   = _BACKEND_DIR.parent                    # .../AI-NWP/

# Resolution priority:
#   1. DATA_DIR env var (explicit override — useful for Docker / custom paths)
#   2. backend/data/   (works when Render Root Directory = backend/)
#   3. <repo_root>/data/ (works when Render Root Directory = repo root)
_data_env = os.environ.get("DATA_DIR")
if _data_env:
    DATA_DIR = Path(_data_env).resolve()
elif (_BACKEND_DIR / "data").exists():
    DATA_DIR = _BACKEND_DIR / "data"   # backend/data/ — preferred for Render backend-root deploys
else:
    DATA_DIR = _REPO_ROOT / "data"     # repo-root/data/ — fallback for monorepo deploys

if not DATA_DIR.exists():
    raise RuntimeError(
        f"Data directory not found. Tried:\n"
        f"  1. DATA_DIR env var: {_data_env!r}\n"
        f"  2. backend/data/: {_BACKEND_DIR / 'data'}\n"
        f"  3. repo-root/data/: {_REPO_ROOT / 'data'}"
    )

# Model file paths
RAINFALL_MODEL_PATH = DATA_DIR / "rainfall_model.pkl"

TEMP_HRES_GATE_PATH = DATA_DIR / "temperature_hres_error_gate_lightgbm.joblib"
TEMP_PANGU_GATE_PATH = DATA_DIR / "temperature_pangu_error_gate_lightgbm.joblib"
TEMP_ENS_GATE_PATH = DATA_DIR / "temperature_ens_error_gate_lightgbm.joblib"
TEMP_META_PATH = DATA_DIR / "temperature_gate_metadata.json"
TEMP_OVERALL_METRICS_PATH = DATA_DIR / "temperature_overall_metrics.json"
TEMP_LEAD_METRICS_PATH = DATA_DIR / "temperature_lead_metrics.json"
TEMP_WEIGHT_MAP_PATH = DATA_DIR / "temperature_weight_map.json"
TEMP_STRATUM_METRICS_PATH = DATA_DIR / "temperature_stratum_metrics.json"
TEMP_REPLAY_PATH = DATA_DIR / "temperature_historical_replay.json"

WIND_HRES_GATE_PATH = DATA_DIR / "wind_hres_error_gate_lightgbm.joblib"
WIND_PANGU_GATE_PATH = DATA_DIR / "wind_pangu_error_gate_lightgbm.joblib"
WIND_ENS_GATE_PATH = DATA_DIR / "wind_ens_error_gate_lightgbm.joblib"
WIND_META_PATH = DATA_DIR / "wind_gate_metadata.json"
WIND_OVERALL_METRICS_PATH = DATA_DIR / "wind_overall_metrics.json"
WIND_LEAD_METRICS_PATH = DATA_DIR / "wind_lead_metrics.json"
WIND_WEIGHT_MAP_PATH = DATA_DIR / "wind_weight_map.json"
WIND_STRATUM_METRICS_PATH = DATA_DIR / "wind_stratum_metrics.json"
WIND_REPLAY_PATH = DATA_DIR / "wind_historical_replay.json"

RAINFALL_OVERALL_METRICS_PATH = DATA_DIR / "rainfall_overall_metrics.json"
RAINFALL_LEAD_METRICS_PATH = DATA_DIR / "rainfall_lead_metrics.json"
RAINFALL_WEIGHT_MAP_PATH = DATA_DIR / "rainfall_weight_map.json"
RAINFALL_REPLAY_PATH = DATA_DIR / "rainfall_historical_replay.json"
RAINFALL_STRATUM_CSV_PATH = DATA_DIR / "rainfall_stratum_metrics.csv"
