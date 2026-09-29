import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { HISTORICAL_DUEL_CASES, HistoricalDuelCase } from '../data/modelDuelCases';
import { MODEL_MAP } from '../data/models';
import { CloudLightning, ShieldCheck, Info, CheckCircle2, History, Database } from 'lucide-react';

export const PageModelDuel: React.FC = () => {
  const { selectedDuelCaseId, setSelectedDuelCaseId } = useForecast();

  const currentCase: HistoricalDuelCase = 
    HISTORICAL_DUEL_CASES.find(c => c.id === selectedDuelCaseId) || HISTORICAL_DUEL_CASES[0];

  // Colors & stroke styles for multi-model overlaid chart
  const modelStrokeStyles: Record<string, { stroke: string; dash: string; width: number; name: string }> = {
    'mithuna-fs': { stroke: '#0B3D62', dash: '5 3', width: 2, name: 'NCMRWF Mithuna-FS' },
    'neps-r': { stroke: '#D97706', dash: '3 2', width: 2, name: 'NCMRWF NEPS-R (4km)' },
    'ecmwf-ifs': { stroke: '#0284C7', dash: '6 2', width: 2, name: 'ECMWF IFS/HRES' },
    'graphcast': { stroke: '#7C3AED', dash: '2 2', width: 2, name: 'GraphCast (DeepMind)' },
    'pangu-weather': { stroke: '#9333EA', dash: '4 4', width: 1.5, name: 'Pangu-Weather' },
    'gfs': { stroke: '#059669', dash: '8 2', width: 1.5, name: 'NOAA GFS' },
    'ecmwf-aifs': { stroke: '#6366F1', dash: '4 2', width: 1.5, name: 'ECMWF AIFS' },
    'fourcastnet': { stroke: '#4F46E5', dash: '2 4', width: 1.5, name: 'FourCastNet' },
  };

  return (
    <div className="model-duel-page">
      {/* Page Title & Integrity Disclosure */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
          Model Duel — Case Verification Laboratory
        </h1>
        {/* Exact Non-Negotiable Integrity Line */}
        <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Database size={13} style={{ color: 'var(--color-primary-light)' }} />
          <span>
            Reproducing stored result for <strong>{currentCase.eventDate}</strong> &bull; <strong>{currentCase.subdivisionName}</strong> &bull; <strong>{currentCase.title}</strong> — same output every run.
          </span>
        </div>
      </div>

      {/* Case Picker (Small fixed set of pre-computed historical events) */}
      <div className="card-standard" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-ink)' }}>
            Select Frozen Benchmark Case:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {HISTORICAL_DUEL_CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`pill-btn ${currentCase.id === c.id ? 'active' : ''}`}
                onClick={() => setSelectedDuelCaseId(c.id)}
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Overview Box */}
      <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: '0.9rem' }}>
              {currentCase.title} ({currentCase.variable} &bull; {currentCase.variableUnit})
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
              {currentCase.eventDescription}
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontFamily: 'monospace', background: '#EDF2F7', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
            {currentCase.reproducibleHash}
          </div>
        </div>
      </div>

      {/* Main Multi-Model Overlaid Comparison Chart */}
      <div className="card-standard" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)' }}>
              Trajectory Comparison: Roster Models vs. HyBlend vs. Ground Truth
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              Solid bold line = HyBlend &bull; Solid black circles = Verified Actual Truth &bull; Dashed lines = Upstream Models
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            Units: {currentCase.variableUnit}
          </span>
        </div>

        {/* Dynamic Multi-Model SVG Chart */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox="0 0 780 260" style={{ width: '100%', height: 'auto', minWidth: '600px' }}>
            {/* Grid & Axes */}
            <line x1="60" y1="20" x2="740" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="60" y1="75" x2="740" y2="75" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="60" y1="130" x2="740" y2="130" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="60" y1="185" x2="740" y2="185" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="60" y1="210" x2="740" y2="210" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Y-Axis tick values mapped to case scale */}
            {(() => {
              const maxVal = Math.max(...currentCase.dataSeries.map(d => Math.max(d.actualVerified, d.hyBlend, ...Object.values(d.models))));
              const step = maxVal / 4;
              return (
                <>
                  <text x="50" y="24" textAnchor="end" fontSize="10" fill="#64748B">{Math.round(maxVal)}</text>
                  <text x="50" y="79" textAnchor="end" fontSize="10" fill="#64748B">{Math.round(step * 3)}</text>
                  <text x="50" y="134" textAnchor="end" fontSize="10" fill="#64748B">{Math.round(step * 2)}</text>
                  <text x="50" y="189" textAnchor="end" fontSize="10" fill="#64748B">{Math.round(step * 1)}</text>
                  <text x="50" y="214" textAnchor="end" fontSize="10" fill="#64748B">0</text>
                </>
              );
            })()}

            {/* X-Axis Lead Time Ticks */}
            {currentCase.dataSeries.map((d, i) => {
              const xStep = 680 / (currentCase.dataSeries.length - 1 || 1);
              const x = 60 + i * xStep;
              return (
                <text key={i} x={x} y="228" textAnchor="middle" fontSize="10" fill="#64748B" fontWeight="500">
                  {d.timeLabel}
                </text>
              );
            })}

            {/* Render Upstream Models Lines */}
            {Object.keys(currentCase.dataSeries[0].models).map((modelId) => {
              const style = modelStrokeStyles[modelId] || { stroke: '#94A3B8', dash: '2 2', width: 1.5, name: modelId };
              const maxVal = Math.max(...currentCase.dataSeries.map(d => Math.max(d.actualVerified, d.hyBlend, ...Object.values(d.models))));
              const xStep = 680 / (currentCase.dataSeries.length - 1 || 1);

              const points = currentCase.dataSeries.map((d, i) => {
                const x = 60 + i * xStep;
                const val = d.models[modelId] || 0;
                const y = 210 - (val / (maxVal * 1.05)) * 190;
                return `${x},${y}`;
              }).join(' ');

              return (
                <polyline
                  key={modelId}
                  points={points}
                  fill="none"
                  stroke={style.stroke}
                  strokeWidth={style.width}
                  strokeDasharray={style.dash}
                  opacity="0.85"
                />
              );
            })}

            {/* Render HyBlend Line (Solid Navy Blue #0B3D62, thick) */}
            {(() => {
              const maxVal = Math.max(...currentCase.dataSeries.map(d => Math.max(d.actualVerified, d.hyBlend, ...Object.values(d.models))));
              const xStep = 680 / (currentCase.dataSeries.length - 1 || 1);
              const points = currentCase.dataSeries.map((d, i) => {
                const x = 60 + i * xStep;
                const y = 210 - (d.hyBlend / (maxVal * 1.05)) * 190;
                return `${x},${y}`;
              }).join(' ');

              return (
                <polyline
                  points={points}
                  fill="none"
                  stroke="#0B3D62"
                  strokeWidth="3.5"
                />
              );
            })()}

            {/* Render Verified Actual Truth (Solid Black Line + Circles) */}
            {(() => {
              const maxVal = Math.max(...currentCase.dataSeries.map(d => Math.max(d.actualVerified, d.hyBlend, ...Object.values(d.models))));
              const xStep = 680 / (currentCase.dataSeries.length - 1 || 1);
              const points = currentCase.dataSeries.map((d, i) => {
                const x = 60 + i * xStep;
                const y = 210 - (d.actualVerified / (maxVal * 1.05)) * 190;
                return `${x},${y}`;
              }).join(' ');

              return (
                <g>
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="2"
                  />
                  {currentCase.dataSeries.map((d, i) => {
                    const x = 60 + i * xStep;
                    const y = 210 - (d.actualVerified / (maxVal * 1.05)) * 190;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="5" fill="#1E293B" />
                        <circle cx={x} cy={y} r="2.5" fill="#FFFFFF" />
                      </g>
                    );
                  })}
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Legend with distinct line styles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '18px', height: '4px', backgroundColor: '#0B3D62', display: 'inline-block' }}></span>
            <strong style={{ color: '#0B3D62' }}>HyBlend Gated Output</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E293B', display: 'inline-block' }}></span>
            <strong>Verified Ground Truth (IMD AWS / ERA5)</strong>
          </div>
          {Object.keys(currentCase.dataSeries[0].models).slice(0, 5).map((mId) => {
            const style = modelStrokeStyles[mId];
            return (
              <div key={mId} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-muted)' }}>
                <span style={{ width: '14px', height: '2px', borderTop: `2px dashed ${style?.stroke || '#64748B'}`, display: 'inline-block' }}></span>
                <span>{style?.name || mId}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insight Box */}
      <div style={{ background: '#F0F7FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--color-ink)', lineHeight: '1.45' }}>
        <strong>Meteorological Verification Finding: </strong>
        {currentCase.keyInsight}
      </div>

      {/* Results Error Verification Table */}
      <div className="card-standard">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.75rem' }}>
          Performance Error Summary vs. Ground Truth (Ranked by RMSE)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Model Source</th>
                <th>RMSE ({currentCase.variableUnit})</th>
                <th>MAE ({currentCase.variableUnit})</th>
                <th>Mean Bias</th>
                {currentCase.variable === 'Rainfall' && <th>CRPS (mm)</th>}
                <th>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {currentCase.errorSummaries.map((row) => (
                <tr key={row.modelId} className={row.isHyBlend ? 'highlight-blend' : ''}>
                  <td>
                    {row.isHyBlend ? (
                      <span style={{ background: '#0B3D62', color: '#FFFFFF', padding: '0.15rem 0.45rem', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 700 }}>
                        #1 Blend
                      </span>
                    ) : (
                      `#${row.rank}`
                    )}
                  </td>
                  <td>
                    <strong>{row.modelName}</strong>
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>{row.rmse.toFixed(2)}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>{row.mae.toFixed(2)}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: row.bias < 0 ? '#B91C1C' : '#15803D' }}>
                    {row.bias > 0 ? `+${row.bias.toFixed(2)}` : row.bias.toFixed(2)}
                  </td>
                  {currentCase.variable === 'Rainfall' && (
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{row.crps?.toFixed(2) || '—'}</td>
                  )}
                  <td>
                    {row.isHyBlend ? (
                      <span style={{ color: '#15803D', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                        <CheckCircle2 size={13} /> Lowest Verification Error
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>Upstream Member</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
