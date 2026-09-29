import json
import pickle
import joblib
from typing import Dict, Any, Optional
import pandas as pd
from pathlib import Path
from . import config

class ModelsRegistry:
    def __init__(self):
        self._rainfall_model = None
        self._temp_hres_gate = None
        self._temp_pangu_gate = None
        self._temp_ens_gate = None
        self._wind_hres_gate = None
        self._wind_pangu_gate = None
        self._wind_ens_gate = None
        self._json_cache: Dict[str, Any] = {}

    def _read_json(self, path: Path) -> Any:
        path_str = str(path)
        if path_str not in self._json_cache:
            if path.exists():
                with open(path, "r", encoding="utf-8") as f:
                    self._json_cache[path_str] = json.load(f)
            else:
                self._json_cache[path_str] = None
        return self._json_cache[path_str]

    @property
    def rainfall_model(self):
        if self._rainfall_model is None and config.RAINFALL_MODEL_PATH.exists():
            with open(config.RAINFALL_MODEL_PATH, "rb") as f:
                self._rainfall_model = pickle.load(f)
        return self._rainfall_model

    @property
    def temp_gates(self):
        if self._temp_hres_gate is None:
            self._temp_hres_gate = joblib.load(config.TEMP_HRES_GATE_PATH)
            self._temp_pangu_gate = joblib.load(config.TEMP_PANGU_GATE_PATH)
            self._temp_ens_gate = joblib.load(config.TEMP_ENS_GATE_PATH)
        return {
            "hres": self._temp_hres_gate,
            "pangu": self._temp_pangu_gate,
            "ens": self._temp_ens_gate
        }

    @property
    def wind_gates(self):
        if self._wind_hres_gate is None:
            self._wind_hres_gate = joblib.load(config.WIND_HRES_GATE_PATH)
            self._wind_pangu_gate = joblib.load(config.WIND_PANGU_GATE_PATH)
            self._wind_ens_gate = joblib.load(config.WIND_ENS_GATE_PATH)
        return {
            "hres": self._wind_hres_gate,
            "pangu": self._wind_pangu_gate,
            "ens": self._wind_ens_gate
        }

    def load_all(self):
        """Preloads all ML models into memory at startup."""
        _ = self.rainfall_model
        _ = self.temp_gates
        _ = self.wind_gates
        return True

    # JSON Data Accessors
    def get_temperature_metadata(self) -> Dict[str, Any]:
        return self._read_json(config.TEMP_META_PATH) or {}

    def get_temperature_overall_metrics(self) -> Dict[str, Any]:
        return self._read_json(config.TEMP_OVERALL_METRICS_PATH) or {}

    def get_temperature_lead_metrics(self) -> Dict[str, Any]:
        return self._read_json(config.TEMP_LEAD_METRICS_PATH) or {}

    def get_temperature_weight_map(self) -> Dict[str, Any]:
        return self._read_json(config.TEMP_WEIGHT_MAP_PATH) or {}

    def get_temperature_stratum_metrics(self) -> list:
        return self._read_json(config.TEMP_STRATUM_METRICS_PATH) or []

    def get_temperature_historical_replay(self) -> Dict[str, Any]:
        return self._read_json(config.TEMP_REPLAY_PATH) or {}

    def get_wind_metadata(self) -> Dict[str, Any]:
        return self._read_json(config.WIND_META_PATH) or {}

    def get_wind_overall_metrics(self) -> Dict[str, Any]:
        return self._read_json(config.WIND_OVERALL_METRICS_PATH) or {}

    def get_wind_lead_metrics(self) -> Dict[str, Any]:
        return self._read_json(config.WIND_LEAD_METRICS_PATH) or {}

    def get_wind_weight_map(self) -> Dict[str, Any]:
        return self._read_json(config.WIND_WEIGHT_MAP_PATH) or {}

    def get_wind_stratum_metrics(self) -> list:
        return self._read_json(config.WIND_STRATUM_METRICS_PATH) or []

    def get_wind_historical_replay(self) -> Dict[str, Any]:
        return self._read_json(config.WIND_REPLAY_PATH) or {}

    def get_rainfall_overall_metrics(self) -> Dict[str, Any]:
        return self._read_json(config.RAINFALL_OVERALL_METRICS_PATH) or {}

    def get_rainfall_lead_metrics(self) -> Dict[str, Any]:
        return self._read_json(config.RAINFALL_LEAD_METRICS_PATH) or {}

    def get_rainfall_weight_map(self) -> Dict[str, Any]:
        return self._read_json(config.RAINFALL_WEIGHT_MAP_PATH) or {}

    def get_rainfall_historical_replay(self, limit: int = 100) -> list:
        data = self._read_json(config.RAINFALL_REPLAY_PATH) or []
        return data[:limit]

# Singleton instance
registry = ModelsRegistry()
