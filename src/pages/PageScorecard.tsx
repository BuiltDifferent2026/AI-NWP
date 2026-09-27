import React, { useState } from 'react';
import { useForecast } from '../context/ForecastContext';
import { ALL_36_SUBDIVISIONS } from '../data/imdSubdivisions';
import { NATIONAL_STRATUM_SUMMARY, FALLBACK_RECORDS } from '../data/scorecardData';
import { MODEL_MAP } from '../data/models';
import { WEATHER_REGIMES } from '../data/regimes';
import { ShieldCheck, ArrowUpDown, Info, ExternalLink, ChevronRight, HelpCircle } from 'lucide-react';

export const PageScorecard: React.FC = () => {
  const { leadTime, variable, navigateTo } = useForecast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'skillGain' | 'spread'>('skillGain');
  const [sortAsc, setSortAsc] = useState(false);

  const stateKey = `${leadTime}_${variable}`;

  // Filter and sort subdivisions
  const filteredSubdivisions = ALL_36_SUBDIVISIONS.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.code.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const sA = a.states[stateKey] || a.states['day-3_rainfall'];
    const sB = b.states[stateKey] || b.states['day-3_rainfall'];

    if (sortBy === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'skillGain') {
      return sortAsc ? sA.skillGainPercent - sB.skillGainPercent : sB.skillGainPercent - sA.skillGainPercent;
    } else {
      return sortAsc ? sA.disagreementSpreadIndex - sB.disagreementSpreadIndex : sB.disagreementSpreadIndex - sA.disagreementSpreadIndex;
    }
  });

  return (
    <div className="scorecard-page">
      {/* 1. Page Title & Explainer */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
          Skill Scorecard & Verification Matrix
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', maxWidth: '85ch' }}>
          How the blend performs against every honest alternative, per region and lead time — including when it doesn't win. All error metrics carry 95% bootstrap confidence intervals evaluated against ground truth.
        </p>
      </div>

      {/* 2. Primary Benchmark Chart: Stratum & Baseline Comparison with Bootstrap Confidence Intervals */}
      <div className="card-standard" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)' }}>
              National Skill Score Gain vs. Honest Alternatives
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              Evaluated across 1,080 forecast cycles &bull; Showing mean improvement (%) with 95% bootstrap confidence intervals
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            Selected Horizon: {leadTime.toUpperCase()}
          </span>
        </div>

        {/* SVG Grouped Bar Chart with Bootstrap Error Bars */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox="0 0 740 220" style={{ width: '100%', height: 'auto', minWidth: '600px' }}>
            {/* Zero line */}
            <line x1="180" y1="130" x2="700" y2="130" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="180" y1="30" x2="180" y2="190" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Grid ticks for percentage skill gain */}
            <line x1="280" y1="30" x2="280" y2="190" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="380" y1="30" x2="380" y2="190" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="480" y1="30" x2="480" y2="190" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="580" y1="30" x2="580" y2="190" stroke="#E2E8F0" strokeDasharray="3 3" />

            <text x="180" y="205" textAnchor="middle" fontSize="10" fill="#64748B">-20%</text>
            <text x="280" y="205" textAnchor="middle" fontSize="10" fill="#64748B">-10%</text>
            <text x="380" y="205" textAnchor="middle" fontSize="10" fill="#64748B">0% (Baseline)</text>
            <text x="480" y="205" textAnchor="middle" fontSize="10" fill="#64748B">+10%</text>
            <text x="580" y="205" textAnchor="middle" fontSize="10" fill="#64748B">+20%</text>

            {/* Render 5 Benchmark Rows with Bootstrap Error Bars */}
            {NATIONAL_STRATUM_SUMMARY.methodologyComparison.slice(0, 5).map((row, idx) => {
              const y = 45 + idx * 30;
              // Map 0% to x = 380. 10% = 100px width.
              const barStart = row.overallSkillGain >= 0 ? 380 : 380 + (row.overallSkillGain * 10);
              const barWidth = Math.abs(row.overallSkillGain * 10);

              const ciLeft = 380 + (row.gainCi[0] * 10);
              const ciRight = 380 + (row.gainCi[1] * 10);

              const isHyBlend = idx === 0;

              return (
                <g key={idx}>
                  {/* Label */}
                  <text
                    x="170"
                    y={y + 11}
                    textAnchor="end"
                    fontSize="10.5"
                    fontWeight={isHyBlend ? '700' : '500'}
                    fill={isHyBlend ? '#0B3D62' : '#334155'}
                  >
                    {row.methodName}
                  </text>

                  {/* Bar */}
                  {row.overallSkillGain !== 0 && (
                    <rect
                      x={barStart}
                      y={y}
                      width={barWidth}
                      height="16"
                      fill={isHyBlend ? '#0B3D62' : row.overallSkillGain > 0 ? '#059669' : '#94A3B8'}
                      rx="2"
                      opacity={isHyBlend ? 1.0 : 0.8}
                    />
                  )}

                  {/* Bootstrap CI Error Bar (Whisker) */}
                  {row.gainCi[0] !== row.gainCi[1] && (
                    <g>
                      {/* Whisker Line */}
                      <line
                        x1={ciLeft}
                        y1={y + 8}
                        x2={ciRight}
                        y2={y + 8}
                        stroke={isHyBlend ? '#E9A23B' : '#475569'}
                        strokeWidth="2"
                      />
                      {/* Left Cap */}
                      <line
                        x1={ciLeft}
                        y1={y + 4}
                        x2={ciLeft}
                        y2={y + 12}
                        stroke={isHyBlend ? '#E9A23B' : '#475569'}
                        strokeWidth="1.5"
                      />
                      {/* Right Cap */}
                      <line
                        x1={ciRight}
                        y1={y + 4}
                        x2={ciRight}
                        y2={y + 12}
                        stroke={isHyBlend ? '#E9A23B' : '#475569'}
                        strokeWidth="1.5"
                      />
                    </g>
                  )}

                  {/* Value Text */}
                  <text
                    x={Math.max(barStart + barWidth + 12, ciRight + 8)}
                    y={y + 12}
                    fontSize="10"
                    fontWeight={isHyBlend ? '700' : '600'}
                    fill={isHyBlend ? '#0B3D62' : '#475569'}
                  >
                    {row.overallSkillGain >= 0 ? `+${row.overallSkillGain}%` : `${row.overallSkillGain}%`}
                    <tspan fontSize="8.5" fill="#64748B" fontWeight="400" dx="4">
                      [{row.gainCi[0]}% to {row.gainCi[1]}%]
                    </tspan>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '2px', backgroundColor: '#E9A23B', display: 'inline-block' }}></span>
            <span>Whisker brackets indicate 95% bootstrap confidence intervals (B = 2,000 resamples)</span>
          </div>
        </div>
      </div>

      {/* 3. Dedicated Fallback Regions Panel (Styled as Informative Honesty Feature) */}
      <div className="card-standard" style={{ marginBottom: '1.5rem', background: '#F8FAFC', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Info size={16} color="var(--color-primary-light)" />
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-ink)' }}>
            Transparent Fallback Governance & Stratum Exceptions
          </h2>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.85rem', lineHeight: '1.4' }}>
          HyBlend employs strict fallback gates: when the gating ensemble fails to significantly beat the best individual upstream model within a 95% bootstrap confidence band, the system explicitly bypasses the blend and delegates directly to the single top-performing model.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {FALLBACK_RECORDS.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderLeft: '4px solid #64748B',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: '0.85rem' }}>
                  {item.subdivisionName} &bull; {item.leadTime} &bull; {item.variable}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                  {item.reason}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', background: '#F1F5F9', color: 'var(--color-primary)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 600, border: '1px solid var(--color-border-subtle)' }}>
                  Active Output: {item.activeFallbackModel}
                </span>
                <button
                  type="button"
                  onClick={() => navigateTo('region-detail', item.subdivisionId)}
                  className="btn-outline"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                  <span>Inspect</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Complete 36 IMD Subdivisions Verification Matrix Table */}
      <div className="card-standard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)' }}>
              36 IMD Meteorological Subdivisions Scorecard
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              Current Stratum: {leadTime.toUpperCase()} horizon &bull; {variable.toUpperCase()}
            </div>
          </div>

          {/* Search bar & Sorter */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Filter subdivision..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                width: '180px'
              }}
            />
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                if (sortBy === 'skillGain') setSortAsc(!sortAsc);
                else { setSortBy('skillGain'); setSortAsc(false); }
              }}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              <ArrowUpDown size={12} />
              <span>Sort by Gain</span>
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subdivision</th>
                <th>Zone</th>
                <th>Active Regime</th>
                <th>Top Gated Source</th>
                <th>Skill Gain vs Best Single</th>
                <th>95% Bootstrap CI</th>
                <th>Spread Index</th>
                <th>System Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubdivisions.map((subdiv) => {
                const s = subdiv.states[stateKey] || subdiv.states['day-3_rainfall'];
                const regime = WEATHER_REGIMES[subdiv.currentRegimeId];
                const model = MODEL_MAP.get(s.trustedModelId);

                return (
                  <tr key={subdiv.id}>
                    <td>
                      <strong>{subdiv.name}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginLeft: '4px' }}>
                        [{subdiv.code}]
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>{subdiv.zone}</td>
                    <td>
                      <span
                        className="badge-regime"
                        style={{ backgroundColor: regime?.badgeBg || '#1D4ED8', fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
                      >
                        {regime?.shortLabel}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, fontSize: '0.8rem' }}>
                        {model?.name || s.trustedModelId}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: s.skillGainPercent >= 0 ? '#15803D' : '#B91C1C', fontVariantNumeric: 'tabular-nums' }}>
                        {s.skillGainPercent >= 0 ? `+${s.skillGainPercent}%` : `${s.skillGainPercent}%`}
                      </strong>
                    </td>
                    <td style={{ color: 'var(--color-muted)', fontSize: '0.78rem', fontVariantNumeric: 'tabular-nums' }}>
                      [{s.skillGainCiLower}% to {s.skillGainCiUpper}%]
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '40px', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${s.disagreementSpreadIndex * 100}%`, height: '100%', background: s.disagreementSpreadIndex > 0.5 ? '#2563EB' : '#0D9488' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                          {(s.disagreementSpreadIndex * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      {s.isFallback ? (
                        <span style={{ color: '#475569', fontSize: '0.72rem', background: '#F1F5F9', padding: '0.15rem 0.45rem', borderRadius: '3px', fontWeight: 600, border: '1px solid #CBD5E1' }}>
                          Fallback Active
                        </span>
                      ) : (
                        <span style={{ color: '#15803D', fontSize: '0.72rem', background: '#DCFCE7', padding: '0.15rem 0.45rem', borderRadius: '3px', fontWeight: 600 }}>
                          LightGBM Gate
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => navigateTo('region-detail', subdiv.id)}
                        className="btn-outline"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
