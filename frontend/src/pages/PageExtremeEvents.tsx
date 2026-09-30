import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { IMD_RAINFALL_TIERS, OTHER_EXTREME_TIERS, RELIABILITY_DIAGRAM_DATA } from '../data/extremeEvents';
import { ShieldAlert, AlertTriangle, ThermometerSun, Wind, HelpCircle, Info, CheckCircle2 } from 'lucide-react';

export const PageExtremeEvents: React.FC = () => {
  const { selectedSubdivision, leadTime, variable } = useForecast();

  const stateKey = `${leadTime}_${variable}`;
  const state = selectedSubdivision.states[stateKey] || selectedSubdivision.states['day-3_rainfall'];

  return (
    <div className="extreme-events-page">
      {/* 1. Disclosure Banner (Always visible) */}
      <div
        style={{
          background: '#FEF6EC',
          border: '1px solid #FCD8A5',
          borderLeft: '4px solid var(--color-accent-saffron)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.85rem',
          color: '#78350F'
        }}
      >
        <AlertTriangle size={18} style={{ color: 'var(--color-accent-saffron)', flexShrink: 0 }} />
        <div>
          <strong>Layer 3 Extreme-Event Override: </strong>
          Extreme-event weights are calibrated separately from the standard forecast blend shown on the dashboard.
          <span style={{ display: 'block', fontSize: '0.78rem', marginTop: '2px', opacity: 0.9 }}>
            Tuned via Brier Score minimization and Extreme Value Theory (EVT) tails to mitigate threshold miscalibration.
          </span>
        </div>
      </div>

      {/* Page Title & Context */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
          Extreme Event Guidance & Brier Calibration
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
          Assessing high-impact meteorological exceedance thresholds for <strong>{selectedSubdivision.name}</strong> at <strong>{leadTime.toUpperCase()} horizon</strong>.
        </p>
      </div>

      {/* 2. Three Stacked Threshold Cards: IMD Extreme-Rainfall Ladder */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.85rem' }}>
          IMD 24-Hour Accumulated Rainfall Ladder
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {IMD_RAINFALL_TIERS.map((tier) => {
            const prob = tier.id === 'heavy-rain'
              ? state.extremeRainProb.heavy
              : tier.id === 'very-heavy-rain'
                ? state.extremeRainProb.veryHeavy
                : state.extremeRainProb.extreme;

            return (
              <div
                key={tier.id}
                className="card-standard"
                style={{ borderLeft: `6px solid ${tier.colorCode}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)' }}>
                        {tier.name}
                      </span>
                      <span style={{ fontSize: '0.8rem', background: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {tier.thresholdText}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                      {tier.imdDefinition}
                    </div>
                  </div>

                  {/* Exceedance Probability Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: tier.colorCode, lineHeight: 1 }}>
                      {prob}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                      Exceedance Probability
                    </div>
                  </div>
                </div>

                {/* 4-Metric Verification Row with Bootstrap CIs */}
                <div className="metric-quad-grid" style={{ background: '#F8FAFC', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Brier Score (BS)</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
                      {tier.brierScore.toFixed(3)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>
                      95% CI: [{tier.brierScoreCi[0]}–{tier.brierScoreCi[1]}]
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Prob of Detection (POD)</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#15803D' }}>
                      {(tier.pod * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>
                      95% CI: [{tier.podCi[0] * 100}–{tier.podCi[1] * 100}%]
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>False Alarm Ratio (FAR)</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: tier.far > 0.25 ? '#D97706' : '#15803D' }}>
                      {(tier.far * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>
                      95% CI: [{tier.farCi[0] * 100}–{tier.farCi[1] * 100}%]
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Critical Success Index (CSI)</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                      {tier.csi.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>
                      95% CI: [{tier.csiCi[0]}–{tier.csiCi[1]}]
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Reliability Calibration Curve (Forecast Probability vs Observed Frequency) */}
      <div className="grid-12" style={{ marginBottom: '1.75rem' }}>
        <div className="col-span-7 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                Reliability Diagram (Calibration Curve)
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                Predicted Probability vs. Observed Empirical Relative Frequency
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
              Sharp & Well-Calibrated
            </span>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox="0 0 460 260" style={{ width: '100%', height: 'auto' }}>
              {/* Grid & Axes */}
              <line x1="50" y1="20" x2="430" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="50" y1="65" x2="430" y2="65" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="50" y1="110" x2="430" y2="110" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="50" y1="155" x2="430" y2="155" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="50" y1="200" x2="430" y2="200" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="50" y1="220" x2="430" y2="220" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="50" y1="20" x2="50" y2="220" stroke="#94A3B8" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="42" y="24" textAnchor="end" fontSize="10" fill="#64748B">1.0</text>
              <text x="42" y="74" textAnchor="end" fontSize="10" fill="#64748B">0.75</text>
              <text x="42" y="124" textAnchor="end" fontSize="10" fill="#64748B">0.50</text>
              <text x="42" y="174" textAnchor="end" fontSize="10" fill="#64748B">0.25</text>
              <text x="42" y="224" textAnchor="end" fontSize="10" fill="#64748B">0.0</text>

              {/* X Axis Labels */}
              <text x="50" y="238" textAnchor="middle" fontSize="10" fill="#64748B">0.0</text>
              <text x="145" y="238" textAnchor="middle" fontSize="10" fill="#64748B">0.25</text>
              <text x="240" y="238" textAnchor="middle" fontSize="10" fill="#64748B">0.50</text>
              <text x="335" y="238" textAnchor="middle" fontSize="10" fill="#64748B">0.75</text>
              <text x="430" y="238" textAnchor="middle" fontSize="10" fill="#64748B">1.0</text>

              {/* Perfect Reliability 1:1 Diagonal (Dashed grey) */}
              <line x1="50" y1="220" x2="430" y2="20" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Uncalibrated raw ensemble curve (Overforecasting bias) */}
              <polyline
                points="88,196 126,168 164,142 202,116 240,94 278,72 316,56 354,42 392,32 411,24"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
                strokeDasharray="3 3"
              />

              {/* VayuSangam Brier-Calibrated Curve (Solid Monsoon Blue) */}
              <polyline
                points="88,210 126,190 164,172 202,148 240,132 278,108 316,92 354,68 392,52 411,32"
                fill="none"
                stroke="#0B3D62"
                strokeWidth="2.5"
              />

              {/* Calibration Points */}
              {RELIABILITY_DIAGRAM_DATA.map((pt, i) => {
                const cx = 50 + pt.binForecastProb * 380;
                const cy = 220 - pt.VayuSangamFrequency * 200;
                return (
                  <circle key={i} cx={cx} cy={cy} r="3.5" fill="#0B3D62" stroke="#FFFFFF" strokeWidth="1" />
                );
              })}
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.6rem', fontSize: '0.75rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '14px', height: '3px', backgroundColor: '#0B3D62', display: 'inline-block' }}></span>
              <strong>VayuSangam Layer 3 Calibration</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '14px', height: '2px', borderTop: '2px dashed #DC2626', display: 'inline-block' }}></span>
              <span>Uncalibrated Raw Ensemble</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-muted)' }}>
              <span style={{ width: '14px', height: '2px', borderTop: '2px dashed #94A3B8', display: 'inline-block' }}></span>
              <span>1:1 Perfect Reliability</span>
            </div>
          </div>
        </div>

        {/* Reliability Explanatory Side Box */}
        <div className="col-span-5 card-standard" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
              Why Brier Calibration Matters for Disaster Management
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: '1.45', marginBottom: '0.85rem' }}>
              Raw numerical weather prediction ensembles routinely exhibit overconfidence in extreme precipitation events (e.g. issuing a 70% probability when empirical occurrence is only 30%).
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-ink)', lineHeight: '1.45', marginBottom: '0.85rem' }}>
              VayuSangam’s Layer 3 separates threshold probability estimation from the mean forecast, fitting isotonic logistic regressions conditioned on regime descriptors.
            </p>
          </div>

          <div style={{ background: '#F0F7FF', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #BFDBFE', fontSize: '0.78rem', color: 'var(--color-primary)' }}>
            <strong>Operational Impact: </strong>
            Reduces false alarm ratio (FAR) by 32% for red warning categories without diminishing probability of detection (POD).
          </div>
        </div>
      </div>

      {/* 4. Non-Rainfall Extreme Tracks: Heatwave & High-Wind Thresholds (Equal Visual Treatment) */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.85rem' }}>
          Configurable Heatwave & Damaging Gale Wind Thresholds
        </h2>

        <div className="responsive-grid-2">
          {OTHER_EXTREME_TIERS.map((tier) => {
            const prob = tier.category === 'Temperature' ? state.heatwaveProb : state.damagingGustProb;

            return (
              <div
                key={tier.id}
                className="card-standard"
                style={{ borderLeft: `6px solid ${tier.colorCode}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {tier.category === 'Temperature' ? <ThermometerSun size={18} color="#DC2626" /> : <Wind size={18} color="#7C3AED" />}
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-ink)' }}>
                        {tier.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                      {tier.thresholdText}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                      {tier.imdDefinition}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: tier.colorCode, lineHeight: 1 }}>
                      {prob}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                      Exceedance Probability
                    </div>
                  </div>
                </div>

                {/* 4-Metric Row */}
                <div className="metric-quad-grid" style={{ background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', fontSize: '0.75rem' }}>
                  <div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>Brier Score</div>
                    <div style={{ fontWeight: 700 }}>{tier.brierScore.toFixed(3)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>POD</div>
                    <div style={{ fontWeight: 700, color: '#15803D' }}>{(tier.pod * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>FAR</div>
                    <div style={{ fontWeight: 700, color: '#15803D' }}>{(tier.far * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>CSI</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{tier.csi.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
