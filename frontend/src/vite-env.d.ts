/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Mapbox GL public access token */
  readonly VITE_MAPBOX_TOKEN: string;
  /**
   * Production backend API base URL (no trailing slash).
   * Example: https://your-VayuSangam-api.onrender.com
   * Leave unset in local dev — Vite will proxy /api to localhost:8000.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
