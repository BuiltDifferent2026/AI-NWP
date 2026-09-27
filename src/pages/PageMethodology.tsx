import React from 'react';
import { UPSTREAM_MODELS } from '../data/models';
import { Layers, GitCommit, Database, Cpu, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PageMethodology: React.FC = () => {
  const physicalModels = UPSTREAM_MODELS.filter(m => m.category === 'Physical NWP');
  const ensembleModels = UPSTREAM_MODELS.filter(m => m.category === 'Ensembles');
  const aiModels = UPSTREAM_MODELS.filter(m => m.category === 'AI Foundation Models');
  const externalModels = UPSTREAM_MODELS.filter(m => m.category === 'Related Operational Systems');

  return (
    <div className="methodology-page">
      {/* Title & Core Positioning */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
          System Methodology & Scientific Architecture
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', maxWidth: '85ch' }}>
          HyBlend is a decision-support and adaptive gating engine built for MoES / NCMRWF. It answers the fundamental operational question: <em>"Which model should we trust — for this place, this lead time, this weather situation — and what evidence supports that decision?"</em>
        </p>
      </div>

      {/* 1. Model Progression Ladder (Real visual horizontal sequential markers) */}
      <div className="card-standard" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
          The Model Progression Ladder
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
          HyBlend validates its performance against four explicit progression tiers to guarantee that increased model complexity yields statistically verified skill gain:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
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

      {/* 2. Ingested Upstream Model Roster */}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
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

          {/* External / Mission Mausam Note */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Mission Mausam Operational Ecosystem
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              {externalModels.map(m => (
                <div key={m.id} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '4px', padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#92400E' }}>{m.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#B45309', margin: '2px 0' }}>{m.institution} &bull; {m.resolution}</div>
                  <div style={{ fontSize: '0.78rem', color: '#78350F', marginTop: '4px' }}>
                    {m.notes} <em>(Ingested as an external source via standardized NetCDF/GRIB2 bridge).</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Data Ingestion & Ground Truth Verification Path */}
      <div className="card-standard" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
          Data Pipeline & Reproducible Verification
        </h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-ink)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p>
            <strong>Prototype Data Sources: </strong>
            For this hackathon prototype, upstream forecasts are ingested from ECMWF/WeatherBench 2 and Open-Meteo historical archive APIs. Verification ground truth is derived from ERA5 reanalysis and IMD 0.25° gridded observation products along with AWS station records.
          </p>
          <p>
            <strong>Operational NCMRWF Integration Architecture: </strong>
            A model-agnostic ingestion adapter is designed to plug directly into NCMRWF’s high-performance computing infrastructure (Mithuna-FS / Arunika clusters) via standardized NetCDF4/Zarr pipelines once operational security clearance is granted.
          </p>
        </div>
      </div>

      {/* 4. Future Extensions (Plain honest list of what is NOT built yet) */}
      <div className="card-standard" style={{ background: '#F8FAFC', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
          Planned Future Extensions (Not Yet Ingested / Deployed)
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
          In adherence to scientific transparency, the following components represent future research tracks rather than active production features in this prototype:
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
          <li>
            <strong>Human-in-the-Loop Forecaster Override Interface: </strong>
            Forecaster synoptic weight adjustments with active logging and audit trails for IMD duty officers.
          </li>
        </ul>
      </div>
    </div>
  );
};
