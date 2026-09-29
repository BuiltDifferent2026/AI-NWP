# HyBlend — Frontend Application

This directory contains the complete client-side application for **HyBlend** (Regime-Aware Multi-Model Forecast Blending System), built for the **National Centre for Medium Range Weather Forecasting (NCMRWF)** and the **Ministry of Earth Sciences (MoES)**.

---

## 🏗️ Architecture Overview

The HyBlend frontend is a high-performance single-page application built with **React 19**, **TypeScript**, and **Vite**, featuring interactive geospatial mapping (Mapbox GL + Leaflet) and live inference integration with the FastAPI LightGBM backend.

```
frontend/
├── public/                 # Static assets, GeoJSON maps, topologies, icons
├── src/
│   ├── components/         # Reusable GovTech UI widgets & visualizations
│   │   ├── IndiaMap.tsx              # Interactive SVG/Choropleth subdivision map
│   │   ├── LiveBlendingSimulator.tsx # Real-time slider & model parameter simulator
│   │   ├── MetricComparisonChart.tsx # Multi-model bar & radar comparisons
│   │   ├── Navbar.tsx                # MoES / NCMRWF header banner & quick links
│   │   ├── RegimeClassificationMatrix.tsx # Synoptic weather regime classifier
│   │   ├── ReliabilityDiagram.tsx    # Brier calibration & reliability curves
│   │   ├── ScorecardSummary.tsx      # Reactive forest plot & skill gain scorecards
│   │   ├── Sidebar.tsx               # Minimal collapsible navigation & status footer
│   │   ├── SubdivisionalDetailModal.tsx # Deep-dive drilldown for 36 IMD subdivisions
│   │   ├── TopLeadTimeHorizon.tsx    # D+1 to D+10 synoptic lead-time selector
│   │   └── VerificationTruthTable.tsx # Historical truth vs blend comparison table
│   ├── context/            # Global application state
│   │   └── ForecastContext.tsx       # Lead time, variable, regime, selected subdivision
│   ├── data/               # Baseline data, IMD subdivision registries, fallback weights
│   │   └── mockData.ts
│   ├── pages/              # Primary route views
│   │   ├── PageAdaptiveBlending.tsx  # Dynamic gating weights & loss surface analysis
│   │   ├── PageAdminAudit.tsx        # Model governance, audit trail & fallback status
│   │   ├── PageDiagnostics.tsx       # System health, memory, and latency metrics
│   │   ├── PageDocumentation.tsx     # Full scientific methodology & MoES references
│   │   ├── PageExtremeEvents.tsx     # 3-tier rainfall ladder & severe hazard alerts
│   │   ├── PageForecastExplorer.tsx  # Main command center: map, metrics, scorecard
│   │   ├── PageRegimeMatrix.tsx      # Synoptic regime classifier & transitions
│   │   └── PageSandboxSimulator.tsx  # Counterfactual what-if perturbation simulator
│   ├── services/           # Backend API integration
│   │   └── api.ts                    # FastAPI client with offline fallback resilience
│   ├── App.tsx             # Root router with clean URL navigation (?page=...)
│   ├── index.css           # GovTech Design System (HSL tokens, dark theme, animations)
│   └── main.tsx            # Application entrypoint
├── index.html              # HTML5 entrypoint with Google Fonts
├── package.json            # Frontend dependencies & build scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build config with reverse-proxy to FastAPI backend
└── README.md               # This documentation file
```

---

## ⚡ Tech Stack

- **Core**: React 19, TypeScript (~6.0), Vite 8
- **Icons**: Lucide React
- **Geospatial**: Mapbox GL JS, Leaflet, Custom SVG IMD 36-Subdivision Choropleth
- **Design System**: Vanilla CSS with MoES/NCMRWF GovTech design language (navy `#030712`, emerald `#10b981`, amber `#f59e0b`, crimson `#ef4444`)
- **Type Safety**: Strict TypeScript with zero runtime overhead

---

## 🔌 Backend Integration & API Proxy

The frontend communicates with the FastAPI backend (`backend/app.py`) running on `http://127.0.0.1:8000`.

In development, Vite automatically reverse-proxies `/api` requests to avoid CORS and port-binding issues:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### Endpoints Consumed (`src/services/api.ts`)

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & model status |
| `/api/metadata` | `GET` | Upstream model inventory & training metadata |
| `/api/eval/summary` | `GET` | Verified evaluation metrics (+9.54% temp, +52.59% wind skill gains) |
| `/api/blend/predict` | `POST` | Live inference across 36 subdivisions with LightGBM gating weights |
| `/api/subdivisions` | `GET` | IMD 36 meteorological subdivisions registry |

> **Offline Resilience**: If the Python backend is temporarily offline, `src/services/api.ts` gracefully degrades to local calibrated baseline estimates so the UI never displays broken states.

---

## 🚀 Scripts & Development

Run these scripts from inside the `frontend/` directory (or use root delegation via `npm run <script>` from project root):

```bash
# Install dependencies
npm install

# Start Vite dev server on http://localhost:5173
npm run dev

# TypeScript typecheck and compile production bundle to dist/
npm run build

# Preview the compiled production build
npm run preview
```

---

## 🧭 Navigation & URL State

The application uses clean query parameter routing (`?page=forecast`, `?page=extremes`, `?page=blending`, etc.) synchronized with the browser history:
- Refreshing the page preserves the active view.
- Back and forward browser buttons work seamlessly without requiring heavy third-party routing dependencies.
- State (`selectedVariable`, `activeLeadDay`, `activeRegime`, `selectedSubdivision`) is coordinated centrally via `ForecastContext`.
