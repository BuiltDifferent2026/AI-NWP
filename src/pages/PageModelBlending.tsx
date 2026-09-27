import React, { useState } from 'react';
import { useForecast } from '../context/ForecastContext';
import { IndiaMap } from '../components/IndiaMap';
import { UPSTREAM_MODELS } from '../data/models';
import { 
  GitMerge, 
  TrendingUp, 
  CloudSun, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sliders,
  Layers
} from 'lucide-react';

export const PageModelBlending: React.FC = () => {
  const { selectedSubdivision, leadTime, variable, navigateTo } = useForecast();
  const [selectedRosterModel, setSelectedRosterModel] = useState<string>('neps-r');

  return (
    <div className="model-blending-view">
      {/* 1. Header & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.2rem' }}>
            Home &gt; Model Blending
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            Model Blending & Adaptive Weights
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
            Dynamic model weights based on region, season, lead time and weather regime for optimal forecast blending.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary-blue"
          onClick={() => navigateTo('about')}
        >
          <BookOpen size={15} />
          <span>View Methodology</span>
        </button>
      </div>

      {/* 2. Top Row: Spatial Model Weight Map (Col 7) + Overall Contribution & Evolution (Col 5) */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Spatial Map */}
        <div className="col-span-7 card-standard" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
                Spatial Model Weight Distribution
              </span>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                Showing softmax normalized weight per subdivision
              </div>
            </div>

            <select
              value={selectedRosterModel}
              onChange={(e) => setSelectedRosterModel(e.target.value)}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#F8FAFC', fontWeight: 600, color: 'var(--color-primary)' }}
            >
              <option value="neps-r">Select: NEPS-R (NCMRWF)</option>
              <option value="mithuna-fs">Select: NCUM-G Mithuna (NCMRWF)</option>
              <option value="ecmwf-ifs">Select: ECMWF IFS/HRES</option>
              <option value="ecmwf-aifs">Select: ECMWF AIFS</option>
              <option value="gfs">Select: NOAA GFS</option>
              <option value="graphcast">Select: GraphCast (DeepMind)</option>
            </select>
          </div>

          <div style={{ flex: 1, minHeight: '380px' }}>
            <IndiaMap />
          </div>
        </div>

        {/* Overall Model Contribution & Evolution Curves */}
        <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Overall Contribution */}
          <div className="card-standard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
                Overall Model Contribution (India Average)
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>72h Lead</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
              {[
                { name: 'NEPS (NCMRWF)', pct: 34, color: '#2563EB' },
                { name: 'NCUM (NCMRWF)', pct: 26, color: '#059669' },
                { name: 'ECMWF IFS', pct: 18, color: '#7C3AED' },
                { name: 'ECMWF AIFS', pct: 12, color: '#F59E0B' },
                { name: 'GFS (NOAA)', pct: 7, color: '#64748B' },
                { name: 'Others', pct: 3, color: '#94A3B8' },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                    <span style={{ fontWeight: 500 }}>{m.name}</span>
                    <strong style={{ color: 'var(--color-ink)' }}>{m.pct}%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${m.pct * 2.8}%`, height: '100%', background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Weight Evolution over Lead Time */}
          <div className="card-standard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
                Model Weight Evolution ({selectedSubdivision.name})
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>0h – 120h</span>
            </div>

            <svg viewBox="0 0 380 130" style={{ width: '100%', height: 'auto' }}>
              <line x1="30" y1="15" x2="360" y2="15" stroke="#E2E8F0" strokeDasharray="2 2" />
              <line x1="30" y1="55" x2="360" y2="55" stroke="#E2E8F0" strokeDasharray="2 2" />
              <line x1="30" y1="95" x2="360" y2="95" stroke="#94A3B8" strokeWidth="1" />

              <text x="25" y="19" textAnchor="end" fontSize="8" fill="#64748B">80%</text>
              <text x="25" y="59" textAnchor="end" fontSize="8" fill="#64748B">40%</text>
              <text x="25" y="99" textAnchor="end" fontSize="8" fill="#64748B">0%</text>

              <text x="40" y="110" textAnchor="middle" fontSize="8" fill="#64748B">0h</text>
              <text x="100" y="110" textAnchor="middle" fontSize="8" fill="#64748B">24h</text>
              <text x="160" y="110" textAnchor="middle" fontSize="8" fill="#64748B">48h</text>
              <text x="220" y="110" textAnchor="middle" fontSize="8" fill="#2563EB" fontWeight="700">72h</text>
              <text x="280" y="110" textAnchor="middle" fontSize="8" fill="#64748B">96h</text>
              <text x="340" y="110" textAnchor="middle" fontSize="8" fill="#64748B">120h</text>

              {/* NEPS line (curves upward then stays high) */}
              <polyline points="40,65 100,50 160,42 220,40 280,48 340,55" fill="none" stroke="#2563EB" strokeWidth="2.5" />
              {/* NCUM line */}
              <polyline points="40,55 100,58 160,62 220,65 280,68 340,72" fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" />
              {/* IFS line */}
              <polyline points="40,75 100,72 160,70 220,72 280,70 340,68" fill="none" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4 2" />
              {/* AIFS line */}
              <polyline points="40,85 100,80 160,78 220,76 280,72 340,65" fill="none" stroke="#F59E0B" strokeWidth="2" />
            </svg>

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{ color: '#2563EB', fontWeight: 600 }}>● NEPS</span>
              <span style={{ color: '#059669' }}>● NCUM</span>
              <span style={{ color: '#7C3AED' }}>● IFS</span>
              <span style={{ color: '#F59E0B' }}>● AIFS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. "Why this model has highest weight here?" Attribution Cards */}
      <div className="card-standard" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.85rem' }}>
          Why NEPS / Convection Ensemble Has Highest Weight in {selectedSubdivision.name}?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Historical Skill</span>
              <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>High</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
              Strong past performance for orographic rainfall in active monsoon over western coastal ghats.
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Regime Similarity</span>
              <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>High</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
              Current synoptic state (vigorous offshore trough) matches historical high-skill training clusters.
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Model Agreement</span>
              <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>Moderate</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
              Consistent core convective signal with AIFS and NCUM, moderate variance on extreme tail.
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Lead-Time Skill</span>
              <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>High</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
              Minimal phase drift and high spatial sharpness at 72h lead horizon for peninsular domain.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Weather Regime Influence & Regional Preferences */}
      <div className="grid-12">
        {/* Weather Regime Influence */}
        <div className="col-span-6 card-standard">
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.75rem' }}>
            Weather Regime Influence on Model Weights
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)', padding: '0.65rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1D4ED8', marginBottom: '2px' }}>Active Monsoon</div>
              <div style={{ fontSize: '0.7rem', color: '#1E40AF', lineHeight: '1.3' }}>Dominant over western and central India. High weight on NEPS-R (4km).</div>
            </div>

            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 'var(--radius-sm)', padding: '0.65rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#B45309', marginBottom: '2px' }}>Break Monsoon</div>
              <div style={{ fontSize: '0.7rem', color: '#92400E', lineHeight: '1.3' }}>Suppressed convection, higher weight on ECMWF IFS and GraphCast.</div>
            </div>

            <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 'var(--radius-sm)', padding: '0.65rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#6D28D9', marginBottom: '2px' }}>Cyclonic Influence</div>
              <div style={{ fontSize: '0.7rem', color: '#5B21B6', lineHeight: '1.3' }}>High track uncertainty over east coast. Ensembles down-weighted if spread &gt; 0.6.</div>
            </div>
          </div>
        </div>

        {/* Regional Model Preference */}
        <div className="col-span-6 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
              Regional Model Preference (NEPS Gating Share)
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600 }}>By Geographic Zone</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
            {[
              { zone: 'Northeast India (Orographic)', pct: 62 },
              { zone: 'Western Ghats (Coastal Convergence)', pct: 58 },
              { zone: 'East India (Bay of Bengal)', pct: 41 },
              { zone: 'Central India (Monsoon Trough)', pct: 33 },
              { zone: 'Northwest India (Plains / Arid)', pct: 28 },
              { zone: 'Peninsular India (Interior)', pct: 36 },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '180px', color: 'var(--color-ink)', fontWeight: 500 }}>{row.zone}</span>
                <div style={{ flex: 1, height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${row.pct}%`, height: '100%', background: '#2563EB' }} />
                </div>
                <span style={{ width: '35px', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)' }}>{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
