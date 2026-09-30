"""
Render deployment entrypoint for VayuSangam Backend.
Uvicorn is invoked directly by the Render start command.
This file allows `uvicorn main:app` at the repo root-level call from backend/.
"""

from backend.app import app  # noqa: F401 – re-export for uvicorn

__all__ = ["app"]
