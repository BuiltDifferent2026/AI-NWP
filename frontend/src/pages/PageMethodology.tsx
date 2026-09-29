import React from 'react';
import { UPSTREAM_MODELS } from '../data/models';
import { 
  Layers, 
  GitCommit, 
  Database, 
  Cpu, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Target, 
  HelpCircle,
  BookOpen
} from 'lucide-react';

export const PageMethodology: React.FC = () => {
  const physicalModels = UPSTREAM_MODELS.filter(m => m.category === 'Physical NWP');
  const ensembleModels = UPSTREAM_MODELS.filter(m => m.category === 'Ensembles');
  const aiModels = UPSTREAM_MODELS.filter(m => m.category === 'AI Foundation Models');
  const externalModels = UPSTREAM_MODELS.filter(m => m.category === 'Related Operational Systems');

  const experiments = [
    { id: 'EXP-001', name: 'Equal Weight Baseline', vars: 'Rain, Temp, Wind', period: '2020–2022', status: 'Completed', result: 'Base CRPS 4.28mm' },
    { id: 'EXP-002', name: 'Historical Skill Weighting (Layer 1)', vars: 'Rain', period: '2020–2022', status: 'Completed', result: '+7.7% skill gain' },
    { id: 'EXP-003', name: 'Regional Stratum Adaptive Weights', vars: 'Rain, Temp', period: '2020–2023', status: 'Completed', result: '+12.4% skill gain' },
    { id: 'EXP-004', name: 'Contextual Gating (LightGBM)', vars: 'Rain, Temp, Wind', period: '2021–2023', status: 'Completed', result: '+18.0% skill gain' },
    { id: 'EXP-005', name: '+ Inter-Model Disagreement & Regime', vars: 'Rain, Wind', period: '2021–2024', status: 'Completed', result: 'Sharper extreme detection' },
    { id: 'EXP-006', name: 'Probabilistic Brier Calibration', vars: 'Rain, Temp', period: '2022–2024', status: 'Completed', result: '32% FAR reduction' },
    { id: 'EXP-007', name: 'Extreme Event EVT Evaluation', vars: 'Extreme Rain, Heat', period: '2020–2024', status: 'Validated', result: '95% Bootstrap CI' },
  ];

  return (
    <div className="methodology-page">
      {/* Title & Core Positioning */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
          System Methodology &amp; Scientific Architecture
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', maxWidth: '85ch' }}>
          HyBlend is a decision-support and adaptive gating engine built for MoES / NCMRWF. It answers the fundamental operational question: <em>"Which model should we trust — for this place, this lead time, this weather situation — and what evidence supports that decision?"</em>
        </p>
      </div>

      {/* 1. Model Progression Ladder */}
      <div className="card-standard" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
          The Model Progression Ladder
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
          HyBlend validates its performance against four explicit progression tiers to guarantee that increased model complexity yields statistically verified skill gain:
        </p>

        <div className="responsive-grid-4">
          {/* Step 1 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#CBD5E1', color: '#1F2933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                1
              </span>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
                Equal-Weight Average
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', flex: 1, lineHeight: '1.4' }}>
              Simple arithmetic mean of all ingested members. Provides an unweighted ensemble baseline.
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#64748B', fontWeight: 600, borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.4rem' }}>
              Baseline CRPS: 4.28 mm
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#94A3B8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                2
              </span>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
                Skill-Weighted (Layer 1)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', flex: 1, lineHeight: '1.4' }}>
              Inverse-error weighting using trailing 30-day CRPS (rainfall) or RMSE (temp/wind): <em>w_i = (1/error_i) / Σ(1/error_j)</em>.
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#64748B', fontWeight: 600, borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.4rem' }}>
              Baseline CRPS: 3.95 mm (+7.7%)
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary-light)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                3
              </span>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
                Linear Stacking Baseline
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', flex: 1, lineHeight: '1.4' }}>
              Constrained Ridge/Lasso multi-model regression to check linear capacity limits under stationary climatological assumptions.
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#64748B', fontWeight: 600, borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.4rem' }}>
              Baseline CRPS: 3.58 mm (+16.3%)
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ background: '#F0F7FF', border: '2px solid #BFDBFE', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                4
              </span>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                LightGBM Gate (Layer 2)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-ink)', flex: 1, lineHeight: '1.4' }}>
              Non-linear gradient boosted tree gating conditioned on region, regime, lead-time bucket, and cross-model spread.
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700, borderTop: '1px solid #BFDBFE', paddingTop: '0.4rem' }}>
              Production CRPS: 3.12 mm (+27.1%)
            </div>
          </div>
        </div>
      </div>

      {/* 2. Research Goals & Questions */}
      <div className="grid-12" style={{ marginBottom: '2rem' }}>
        <div className="col-span-5 card-standard" style={{ background: '#F0F7FF', border: '1px solid #BFDBFE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Target size={18} color="#1D4ED8" />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E40AF' }}>
              Scientific Objective
            </h2>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#1E3A8A', lineHeight: '1.5' }}>
            To develop and rigorously evaluate an adaptive multi-model forecast blending framework that optimally combines operational numerical weather prediction (NCMRWF NCUM/NEPS, ECMWF, GFS) and AI foundation models (GraphCast, AIFS, Pangu) conditioned on Indian meteorological regimes and local terrain.
          </p>
        </div>

        <div className="col-span-7 card-standard">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <HelpCircle size={18} color="var(--color-primary)" />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-ink)' }}>
              Key Research Questions Addressed
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
            <div style={{ background: '#F8FAFC', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <strong style={{ color: '#2563EB' }}>RQ1: </strong>
              Does regime-conditioned dynamic weighting beat any single model across lead times?
            </div>
            <div style={{ background: '#F8FAFC', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <strong style={{ color: '#2563EB' }}>RQ2: </strong>
              How does AI vs. physical NWP skill partition between plains and orographic Western Ghats?
            </div>
            <div style={{ background: '#F8FAFC', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <strong style={{ color: '#2563EB' }}>RQ3: </strong>
              Can separate Brier threshold calibration improve early extreme-event detection?
            </div>
            <div style={{ background: '#F8FAFC', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <strong style={{ color: '#2563EB' }}>RQ4: </strong>
              Does cross-model disagreement spread provide an actionable uncertainty signal?
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ingested Upstream Model Roster */}
      <div className="card-standard" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.35rem' }}>
          Upstream Model Ingestion Roster
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
          HyBlend operates on standardized ingestion adapters across three major computational paradigms. These are <strong>existing upstream forecast sources we ingest</strong> — not models created from scratch:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Physical NWP */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Physical Deterministic NWP
            </h3>
            <div className="responsive-grid-3">
              {physicalModels.map(m => (
                <div key={m.id} style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>{m.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', margin: '2px 0' }}>{m.institution} &bull; {m.resolution}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>{m.lineage}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ensembles */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Probabilistic & Regional Ensembles
            </h3>
            <div className="responsive-grid-3">
              {ensembleModels.map(m => (
                <div key={m.id} style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>{m.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', margin: '2px 0' }}>{m.institution} &bull; {m.resolution}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>{m.lineage}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Foundation Models */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              AI Foundation Models
            </h3>
            <div className="responsive-grid-3">
              {aiModels.map(m => (
                <div key={m.id} style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ink)' }}>{m.name}</span>
                    {m.isEvaluatedOnly && (
                      <span style={{ fontSize: '0.65rem', background: '#EDE9FE', color: '#6D28D9', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                        Evaluation
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', margin: '2px 0' }}>{m.institution} &bull; {m.resolution}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>{m.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Operational Pipeline & Trained Model Artifacts */}
      <div className="card-standard" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.35rem' }}>
          Operational Blending Pipeline &amp; Trained Model Artifacts
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
          Production artifacts trained on 2020–2024 meteorological archives, evaluated on out-of-sample test splits, and served by the live backend:
        </p>

        <div className="grid-12" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Pipeline Steps (Col 7) */}
          <div className="col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              {
                num: '01',
                title: 'Data Ingestion & Physical Consistency Safeguard',
                desc: 'Ingests deterministic NWP (IFS HRES), ensemble mean (IFS ENS), and AI models (Pangu-Weather). Physical checks reject non-negative precipitation and unphysical wind vectors.',
                status: 'Passing (100%)'
              },
              {
                num: '02',
                title: 'Contextual Feature Construction',
                desc: 'Maps each forecast point to {Lead Time, Geographic Zone, Synoptic Regime, Inter-Model Disagreement Spread}. Categorical dtypes preserved for LightGBM alignment.',
                status: 'Passing (100%)'
              },
              {
                num: '03',
                title: 'Conditional Error Gating (LightGBM)',
                desc: 'Parallel LightGBM regressors predict conditional MAE (ê_HRES, ê_Pangu, ê_ENS). Weights derived via inverse-exponential softmax w_i = exp(-β · ê_i) / Σ exp(-β · ê_j).',
                status: 'Passing (100%)'
              },
              {
                num: '04',
                title: 'Governance & Honest Fallback Layer',
                desc: 'If skill gain over best single model is negative or within non-significant bootstrap band, system bypasses blend and issues best single model directly (e.g., T+24h Fallback to Pangu).',
                status: 'Active Governance'
              }
            ].map((step, i) => (
              <div key={i} style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.65rem 0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)' }}>{step.num}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-ink)' }}>{step.title}</span>
                  </div>
                  <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '3px', fontWeight: 600 }}>
                    {step.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Model Artifacts (Col 5) */}
          <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.65rem 0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  temperature_*_error_gate_lightgbm.joblib
                </span>
                <span style={{ fontSize: '0.65rem', color: '#166534', background: '#DCFCE7', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                  Loaded (3 Models)
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                Separate LightGBM gates for HRES, Pangu, ENS &bull; Skill Gain: +9.54% [8.28%, 10.77%]
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.65rem 0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  wind_*_error_gate_lightgbm.joblib
                </span>
                <span style={{ fontSize: '0.65rem', color: '#166534', background: '#DCFCE7', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                  Loaded (3 Models)
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                Wind speed gates with β=2.0 &bull; Skill Gain: +52.59% [52.19%, 52.98%]
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.65rem 0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  rainfall_model.pkl
                </span>
                <span style={{ fontSize: '0.65rem', color: '#166534', background: '#DCFCE7', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                  Loaded (LGBMRegressor)
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                Precipitation calibration &bull; R² = 0.916 &bull; MAE: 0.103 mm &bull; RMSE: 0.206 mm
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.65rem 0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--color-ink)' }}>
                  Evaluation Datasets (data/)
                </span>
                <span style={{ fontSize: '0.65rem', color: '#2563EB', background: '#EFF6FF', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                  6 Files Active
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>
                temperature_evaluation_test_set.json, wind_evaluation_test_set.json, rainfall_model_metrics.json
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Planned Future Extensions */}
      <div className="card-standard" style={{ background: '#F8FAFC', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
          Planned Future Extensions (MoES / NCMRWF Roadmap)
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
          In adherence to scientific transparency, the following components represent future research tracks:
        </p>

        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.825rem', color: '#334155', lineHeight: '1.6' }}>
          <li>
            <strong>Terrain-Aware Topographic Sub-Grid Blending: </strong>
            Downscaling to 1 km using high-resolution SRTM digital elevation models to resolve Western Ghats and Himalayan slope precipitation gradients.
          </li>
          <li>
            <strong>Full Probabilistic Generative Diffusion Layer: </strong>
            Direct integration of generative diffusion models (e.g. GenCast) to output calibrated probabilistic ensembles rather than deterministic point blends.
          </li>
          <li>
            <strong>Data-Driven Unsupervised Regime Clustering: </strong>
            Transitioning from hand-anchored meteorological taxonomy to continuous autoencoded atmospheric state latent spaces.
          </li>
          <li>
            <strong>NCMRWF High-Performance Live HPC Daemon: </strong>
            Automated assimilation cron daemon for real-time Mithuna-FS GRIB2 push broadcasts on supercomputer Arunika.
          </li>
        </ul>
      </div>
    </div>
  );
};
