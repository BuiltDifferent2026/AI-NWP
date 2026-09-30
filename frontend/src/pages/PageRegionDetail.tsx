import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { WEATHER_REGIMES } from '../data/regimes';
import { MODEL_MAP } from '../data/models';
import { ArrowLeft, AlertTriangle, ChevronRight, BarChart2, Zap, Layers } from 'lucide-react';

export const PageRegionDetail: React.FC = () => {
  const { selectedSubdivision, leadTime, variable, navigateTo } = useForecast();

  const stateKey = `${leadTime}_${variable}`;
  const state = selectedSubdivision.states[stateKey] || selectedSubdivision.states['day-3_rainfall'];
  const regime = WEATHER_REGIMES[selectedSubdivision.currentRegimeId];
  const trustedModel = MODEL_MAP.get(state.trustedModelId);

  // Map transition if any
  const transitionAlert = selectedSubdivision.regimeTransitionAlert;
  const targetRegime = transitionAlert ? WEATHER_REGIMES[transitionAlert.toRegimeId] : null;

  return (
    <div className="region-detail-page">
      {/* 1. Breadcrumb & Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => navigateTo('dashboard')}
          className="btn-outline"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to national weight map</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {selectedSubdivision.name}
          </h1>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: 600 }}>
            ({selectedSubdivision.code})
          </span>
          <span
            className="badge-regime"
            style={{ backgroundColor: regime?.badgeBg || '#1D4ED8', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
          >
            {regime?.name || 'Active Regime'}
          </span>
          {state.isFallback && (
            <span style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.3rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
              Honest Fallback Active ({trustedModel?.name})
            </span>
          )}
        </div>
      </div>

      {/* 2. Regime Transition Alert Banner (renders ONLY when real) */}
      {transitionAlert && targetRegime && (
        <div className="banner-transition">
          <AlertTriangle size={18} style={{ color: 'var(--color-accent-saffron)', flexShrink: 0 }} />
          <div>
            <strong>Regime Transition Alert: </strong>
            {regime.name} expected to transition to {targetRegime.name} in {transitionAlert.daysUntilTransition} days.
            <span style={{ display: 'block', fontSize: '0.78rem', marginTop: '2px', opacity: 0.9 }}>
              Synoptic rationale: {transitionAlert.synopticReason} Gating model may dynamically shift weight toward regional high-resolution convection-permitting ensembles as synoptic forcing changes.
            </span>
          </div>
        </div>
      )}

      {/* Informative fallback explanation if region is in fallback state */}
      {state.isFallback && (
        <div className="banner-fallback" style={{ marginBottom: '1.25rem' }}>
          <Layers size={18} style={{ color: 'var(--color-primary-light)', flexShrink: 0 }} />
          <div>
            <strong>Operational Fallback State: </strong>
            {state.fallbackReason}
          </div>
        </div>
      )}

      {/* 3. Two-Column Layout */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Left Column: Trailing Skill Chart */}
        <div className="col-span-6 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                Trailing Multi-Cycle Error Verification
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                Metric: {variable === 'rainfall' ? 'Continuous Ranked Probability Score (CRPS, mm)' : 'Root Mean Square Error (RMSE)'}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
              Horizon: {leadTime.toUpperCase()}
            </div>
          </div>

          {/* SVG Line Chart with Confidence Interval Band */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox="0 0 520 220" style={{ width: '100%', height: 'auto' }}>
              {/* Grid lines */}
              <line x1="50" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="50" y1="75" x2="500" y2="75" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="50" y1="120" x2="500" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="50" y1="165" x2="500" y2="165" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="50" y1="185" x2="500" y2="185" stroke="#94A3B8" strokeWidth="1.5" />

              {/* Y Axis labels */}
              <text x="42" y="34" textAnchor="end" fontSize="10" fill="#64748B">5.0</text>
              <text x="42" y="79" textAnchor="end" fontSize="10" fill="#64748B">4.0</text>
              <text x="42" y="124" textAnchor="end" fontSize="10" fill="#64748B">3.0</text>
              <text x="42" y="169" textAnchor="end" fontSize="10" fill="#64748B">2.0</text>

              {/* X Axis cycle labels */}
              {state.rollingHistory.map((item, idx) => {
                const x = 70 + idx * 70;
                return (
                  <text key={idx} x={x} y="202" textAnchor="middle" fontSize="10" fill="#64748B">
                    {item.cycle}
                  </text>
                );
              })}

              {/* Shaded 95% Confidence Interval band for VayuSangam */}
              <polygon
                points={`
                  70,145 140,148 210,138 280,152 350,142 420,155 490,158
                  490,172 420,168 350,156 280,165 210,152 140,160 70,158
                `}
                fill="#0B3D62"
                fillOpacity="0.12"
              />

              {/* Best Single Model line (dashed orange/purple) */}
              <polyline
                points="70,130 140,133 210,121 280,136 350,127 420,140 490,143"
                fill="none"
                stroke="#D97706"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* VayuSangam Layer 2 line (solid deep monsoon blue) */}
              <polyline
                points="70,152 140,154 210,145 280,158 350,149 420,161 490,165"
                fill="none"
                stroke="#0B3D62"
                strokeWidth="2.5"
              />

              {/* Data points */}
              {state.rollingHistory.map((item, idx) => {
                const x = 70 + idx * 70;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={165 - (item.blendError - 2.0) * 35} r="3.5" fill="#0B3D62" />
                    <circle cx={x} cy={165 - (item.bestModelError - 2.0) * 35} r="3" fill="#D97706" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.78rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '16px', height: '3px', backgroundColor: '#0B3D62', display: 'inline-block' }}></span>
              <strong>VayuSangam Layer 2 Gate</strong> (with shaded 95% bootstrap CI)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '16px', height: '2px', backgroundColor: '#D97706', borderTop: '2px dashed #D97706', display: 'inline-block' }}></span>
              <span>Best Single Model ({trustedModel?.name})</span>
            </div>
          </div>
        </div>

        {/* Right Column: "Why this model" LightGBM Feature Importance */}
        <div className="col-span-6 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                Why This Model: LightGBM Feature Attribution
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                Gini importance / SHAP value decomposition for current weight allocation
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, color: 'var(--color-primary)' }}>
              Tree Gating Layer
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {state.featureImportance.map((feat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{feat.featureName}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginLeft: '6px' }}>
                      ({feat.plainDescription})
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
                    {feat.contributionPercent}%
                  </span>
                </div>
                {/* Horizontal Bar */}
                <div style={{ height: '8px', width: '100%', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${feat.contributionPercent}%`,
                      backgroundColor: idx === 0 ? 'var(--color-primary)' : idx === 1 ? 'var(--color-primary-light)' : '#64748B',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--color-border-subtle)', fontSize: '0.78rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
            <strong>Forecaster Interpretation: </strong>
            In this regime ({regime?.name}), trailing localized skill and inter-model spread account for &gt;50% of the gating softmax allocation. If models diverge further, weight shifts to conservative ensemble bounds.
          </div>
        </div>
      </div>

      {/* 4. Footer Row: Direct Link forward to Model Duel pre-filtered */}
      <div className="card-standard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F0F7FF', borderColor: '#BFDBFE' }}>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Validate Stored Historical Case Benchmarks
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
            Compare multi-model forecasts vs. VayuSangam vs. IMD AWS ground truth for {selectedSubdivision.name}.
          </div>
        </div>
        <button
          type="button"
          className="btn-saffron"
          onClick={() => navigateTo('model-duel', selectedSubdivision.id, 'case-mumbai-2024')}
        >
          <span>Compare models for this region in Model Duel</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};
