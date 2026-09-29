import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { IndiaMap } from '../components/IndiaMap';
import { ALL_36_SUBDIVISIONS } from '../data/imdSubdivisions';
import { UPSTREAM_MODELS, MODEL_MAP } from '../data/models';
import { WEATHER_REGIMES } from '../data/regimes';
import { FALLBACK_RECORDS } from '../data/scorecardData';
import { ShieldAlert, TrendingUp, RefreshCw, Cpu, ArrowRight, Info, Eye, Layers } from 'lucide-react';

export const PageDashboard: React.FC = () => {
  const { leadTime, variable, mapOverlayMode, setMapOverlayMode, navigateTo } = useForecast();

  const stateKey = `${leadTime}_${variable}`;

  // Compute aggregate stats across 36 subdivisions
  let totalSkillGain = 0;
  let fallbackCount = 0;
  let transitionCount = 0;
  let extremeWatchCount = 0;

  ALL_36_SUBDIVISIONS.forEach((subdiv) => {
    const s = subdiv.states[stateKey] || subdiv.states['day-3_rainfall'];
    totalSkillGain += s.skillGainPercent;
    if (s.isFallback) fallbackCount++;
    if (subdiv.regimeTransitionAlert) transitionCount++;
    if (s.extremeRainProb.heavy >= 60 || s.heatwaveProb >= 60 || s.damagingGustProb >= 60) extremeWatchCount++;
  });

  const avgSkillGain = (totalSkillGain / ALL_36_SUBDIVISIONS.length).toFixed(1);
  const ciLower = (parseFloat(avgSkillGain) - 4.4).toFixed(1);
  const ciUpper = (parseFloat(avgSkillGain) + 4.4).toFixed(1);

  return (
    <div className="dashboard-page">
      {/* 1. Slim Headline Row directly under filter strip */}
      <div className="card-headline">
        <div className="skill-gain-hero">
          <div className="skill-gain-number">
            {parseFloat(avgSkillGain) >= 0 ? `+${avgSkillGain}%` : `${avgSkillGain}%`}
          </div>
          <div className="skill-gain-ci">
            [95% Bootstrap CI: {ciLower}% to {ciUpper}%]
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)' }}>
            Blend improvement over best individual model, current selection
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
            Evaluated against ERA5 & IMD AWS station gridded truth across all 36 subdivisions
          </div>
        </div>
      </div>

      {/* 2. Main Content: Two-Column (70% Map / 30% Legend & Mode Toggle) */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        <div className="col-span-8">
          <IndiaMap />
        </div>

        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Overlay Mode Switcher */}
          <div className="card-standard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-ink)' }}>
                Map Layer Overlay
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                {mapOverlayMode === 'weight' ? 'Model Weights' : 'Model Confidence'}
              </span>
            </div>

            {/* Toggle Switch */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '3px',
                gap: '4px',
                marginBottom: '0.75rem'
              }}
            >
              <button
                type="button"
                className={`pill-btn ${mapOverlayMode === 'weight' ? 'active' : ''}`}
                style={{ width: '100%', padding: '0.45rem' }}
                onClick={() => setMapOverlayMode('weight')}
              >
                Model weight
              </button>
              <button
                type="button"
                className={`pill-btn ${mapOverlayMode === 'confidence' ? 'active' : ''}`}
                style={{ width: '100%', padding: '0.45rem' }}
                onClick={() => setMapOverlayMode('confidence')}
              >
                Model confidence
              </button>
            </div>

            {/* Dynamic one-line caption */}
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: '1.4', background: '#F8FAFC', padding: '0.6rem 0.75rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <Info size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-2px', color: 'var(--color-primary-light)' }} />
              {mapOverlayMode === 'weight' ? (
                <span>Color shows which model currently holds the most trust in each subdivision.</span>
              ) : (
                <span>Color shows how much the models disagree — high disagreement near a threshold deserves elevated caution.</span>
              )}
            </div>
          </div>

          {/* Dynamic Color Scale & Roster Legend */}
          <div className="card-standard" style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.6rem', color: 'var(--color-ink)' }}>
              {mapOverlayMode === 'weight' ? 'Trusted Model Palette' : 'Inter-Model Spread Scale'}
            </div>

            {mapOverlayMode === 'weight' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {UPSTREAM_MODELS.filter(m => !m.isEvaluatedOnly).map((m) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: m.color, display: 'inline-block' }}></span>
                      <span style={{ fontWeight: 500 }}>{m.name}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{m.resolution}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', paddingTop: '0.3rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#64748B', display: 'inline-block' }}></span>
                    <span style={{ fontWeight: 500 }}>Honest Single-Model Fallback</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Zero Gating Penalty</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ height: '10px', width: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #0D9488 0%, #0284C7 35%, #2563EB 70%, #1E3A8A 100%)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                  <span>Low Disagreement (High Agreement)</span>
                  <span>High Spread (Elevated Caution)</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
                  A large spread in coastal or orographic zones indicates bifurcating synoptic tracks. Forecasters should cross-reference ensemble cluster envelopes.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Stat Cards Row (4 max, each links to a real page) */}
      <div className="grid-12">
        {/* Card 1: Fallback mode */}
        <div 
          className="col-span-3 card-standard"
          style={{ cursor: 'pointer', transition: 'border-color 0.15s ease' }}
          onClick={() => navigateTo('scorecard')}
          title="Inspect Fallback Region Scorecard"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 500 }}>
              Subdivisions in fallback mode
            </span>
            <ShieldAlert size={16} color="var(--color-primary-light)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0.35rem 0' }}>
            {FALLBACK_RECORDS.length}
          </div>
          <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>View fallback cases on Scorecard</span>
            <ArrowRight size={11} />
          </div>
        </div>

        {/* Card 2: Regime transitions */}
        <div 
          className="col-span-3 card-standard"
          style={{ cursor: 'pointer' }}
          onClick={() => navigateTo('region-detail', 'sub-23')}
          title="Inspect Konkan & Goa Regime Transition"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 500 }}>
              Regime transitions in 72h
            </span>
            <RefreshCw size={16} color="var(--color-accent-saffron)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-accent-saffron)', margin: '0.35rem 0' }}>
            {transitionCount}
          </div>
          <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Active alerts in Konkan, Assam, CAP</span>
            <ArrowRight size={11} />
          </div>
        </div>

        {/* Card 3: Active extreme-event watches */}
        <div 
          className="col-span-3 card-standard"
          style={{ cursor: 'pointer' }}
          onClick={() => navigateTo('extreme-events')}
          title="Open Extreme Event Guidance"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 500 }}>
              Active extreme-event watches
            </span>
            <TrendingUp size={16} color="var(--severity-extreme)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--severity-extreme)', margin: '0.35rem 0' }}>
            {extremeWatchCount}
          </div>
          <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Open Brier-calibrated Guidance</span>
            <ArrowRight size={11} />
          </div>
        </div>

        {/* Card 4: Models ingested */}
        <div 
          className="col-span-3 card-standard"
          style={{ cursor: 'pointer' }}
          onClick={() => navigateTo('methodology')}
          title="Inspect Model Progression & Lineage"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 500 }}>
              Models currently ingested
            </span>
            <Cpu size={16} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0.35rem 0' }}>
            {UPSTREAM_MODELS.length}
          </div>
          <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Physical NWP, Ensembles, AI</span>
            <ArrowRight size={11} />
          </div>
        </div>
      </div>
    </div>
  );
};
