# HyBlend — Regime-Aware Multi-Model Forecast Blending System
### Ministry of Earth Sciences (MoES) / NCMRWF, Government of India
**Smart India Hackathon 2026 | Problem Statement: SIH26081 | Theme: Disaster Management**

---

## 🌟 Executive Summary & One-Line Positioning
> *"Which model should we trust — for this place, this lead time, this weather situation — and what evidence supports that decision?"*

**HyBlend** is a decision-support and adaptive gating engine built for the **National Centre for Medium Range Weather Forecasting (NCMRWF)** and the **Ministry of Earth Sciences (MoES)**. It dynamically combines physical numerical weather prediction (NWP) models, high-resolution regional ensembles, and AI foundation models into a unified, reliable, and calibrated consensus forecast.

---

## 🏛️ Upstream Model Ingestion Roster

HyBlend ingests and benchmarks existing upstream forecasts across four computational categories:

- **Physical NWP**:
  - `NCMRWF Mithuna-FS`: 12 km operational South Asian monsoon dynamical core (NCUM-G lineage).
  - `ECMWF IFS/HRES`: 9 km global deterministic physical reference.
  - `NOAA GFS`: 0.25° (~28 km) global deterministic model (FV3 core).
- **Probabilistic & Regional Ensembles**:
  - `NCMRWF NEPS-R`: 4 km convection-permitting regional ensemble specialized for orographic precipitation.
  - `NCMRWF NEPS-G`: 12 km global ensemble (23 members).
  - `NOAA GEFS`: 0.25° global ensemble (31 members).
- **AI Foundation Models**:
  - `GraphCast` (Google DeepMind): 0.25° icosahedral graph neural network.
  - `Pangu-Weather` (Huawei Cloud): 3D Earth-specific vision transformer.
  - `ECMWF AIFS`: 28 km operational data-driven model.
  - `FourCastNet` (NVIDIA): Adaptive Fourier Neural Operator.
  - `GenCast` (DeepMind): Evaluated for probabilistic generative diffusion extension.
- **Related Mission Mausam System**:
  - `IITM Pune BharatFS`: 6 km regional system integrated via standardized ingestion adapter.

---

## ⚙️ Three-Layer Blending Architecture & Fallback Ladder

1. **Layer 1 — Skill-Weighted Average (Day-1 Baseline)**:
   $$\text{weight}_i = \frac{1 / \text{error}_i}{\sum_j (1 / \text{error}_j)}$$
   Evaluated using trailing 30-day CRPS (rainfall) and RMSE (temperature/wind).

2. **Layer 2 — LightGBM Adaptive Gating Engine (Core Decision Engine)**:
   - Gradient boosted decision trees conditioned on: `{model forecast, stratum trailing skill, IMD subdivision, seasonal phase, lead-time bucket, regime label, inter-model disagreement}`.
   - Outputs softmax-normalized weights across all 36 IMD meteorological subdivisions.

3. **Layer 3 — Extreme-Event Exceedance Gate (Brier-Calibrated)**:
   - Separate Brier-calibrated weights for IMD's 3-tier rainfall ladder:
     - **Heavy Rainfall**: $P(R_{24h} \ge 64.5\text{ mm})$
     - **Very Heavy Rainfall**: $P(R_{24h} \ge 115.6\text{ mm})$
     - **Extremely Heavy Rainfall**: $P(R_{24h} \ge 204.5\text{ mm})$
   - Plus configurable **Severe Heatwave** ($T_{max} \ge 45.0^\circ\text{C}$) and **Damaging Gale Wind** ($\ge 65\text{ km/h}$) tracks.
   - Evaluated with Reliability Diagrams, Brier Score, POD, FAR, and CSI.

4. **Transparent Governance & Fallback State**:
   - $\text{Skill Gain} = 1 - \frac{\text{Error}_{\text{blend}}}{\text{Error}_{\text{best single model}}}$ (with 95% bootstrap confidence intervals).
   - If $\text{Skill Gain} \le 0$ or non-significant, the system visibly falls back to the leading individual model without penalty.

---

## 🗺️ 6 Hand-Anchored Weather Regimes
1. `Active Monsoon`: Strong Findlater jet, heavy coastal convergence.
2. `Break Monsoon`: Trough shifted to Himalayan foothills, suppressed central rains.
3. `Western-Disturbance Winter`: Subtropical jet streaks, snow in Himalayas, cold waves in NW.
4. `Pre-Monsoon Heatwave`: Dry continental advection (Loo), anticyclonic subsidence.
5. `Post-Monsoon Cyclone Influence`: High SSTs, low vertical shear, coastal surge risk.
6. `Normal / Climatological Baseline`: Diurnal convective equilibrium.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run
```bash
# 1. Clone repository
git clone https://github.com/BuiltDifferent2026/AI-NWP.git
cd AI-NWP

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build production bundle
npm run build
```

---

## 📦 Tech Stack
- **Frontend Core**: React 18, TypeScript, Vite
- **Mapping & Geospatial**: Mapbox GL JS (Satellite Streets & Dark Weather) + Leaflet / SVG Topology
- **Styling**: Vanilla CSS GovTech Design System (MoES / NCMRWF compliant)
- **Icons**: Lucide React
- **Data Verification Truth**: ERA5 Reanalysis + IMD 0.25° Gridded Station Observations

---

## 👥 Built for Smart India Hackathon 2026
- **Organization**: Ministry of Earth Sciences (MoES) / NCMRWF, Govt. of India
- **Problem Statement**: SIH26081 (Disaster Management)
