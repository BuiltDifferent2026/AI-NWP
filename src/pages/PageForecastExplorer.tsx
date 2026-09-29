import React, { useState } from 'react';
import { useForecast } from '../context/ForecastContext';
import { IndiaMap } from '../components/IndiaMap';
import { UPSTREAM_MODELS } from '../data/models';
import { 
  Play, 
  Pause, 
  Layers, 
  CloudRain, 
  Thermometer, 
  Wind, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Star,
  ExternalLink,
  Info,
  GitMerge,
  BookOpen,
  Sliders,
  ShieldAlert,
  ArrowRight,
  BarChart2,
  Sparkles
} from 'lucide-react';

export const PageForecastExplorer: React.FC = () => {
  const { 
    selectedSubdivision, 
    leadTime, 
    setLeadTime, 
    variable, 
    setVariable, 
    timelineStepHours, 
    setTimelineStepHours,
    isPlayingTimeline,
    setIsPlayingTimeline,
    navigateTo 
  } = useForecast();

  // Map display modes
  const [activeMapMode, setActiveMapMode] = useState<'blend' | 'weights' | 'agreement' | 'confidence'>('blend');
  const [selectedRosterModel, setSelectedRosterModel] = useState<string>('neps-r');
  
  // Right panel tab
  const [rightPanelTab, setRightPanelTab] = useState<'point-forecast' | 'adaptive-weights'>('point-forecast');
  const [pointVarTab, setPointVarTab] = useState<'rainfall' | 'temperature' | 'wind'>('rainfall');

  const timelineSteps = [
    { label: 'Now', hours: 0 },
    { label: '+24h', hours: 24 },
    { label: '+48h', hours: 48 },
    { label: '+72h', hours: 72 },
    { label: '+96h', hours: 96 },
    { label: '+120h', hours: 120 }
  ];

  const handlePlayToggle = () => {
    setIsPlayingTimeline(!isPlayingTimeline);
  };

  const getRosterModelName = (id: string) => {
    switch (id) {
      case 'neps-r': return 'NEPS-R (NCMRWF 4km)';
      case 'mithuna-fs': return 'NCUM-G Mithuna (NCMRWF 12km)';
      case 'ecmwf-ifs': return 'ECMWF IFS / HRES (9km)';
      case 'ecmwf-aifs': return 'ECMWF AIFS (AI Ensemble)';
      case 'gfs': return 'NOAA GFS (0.25°)';
      case 'graphcast': return 'GraphCast (DeepMind)';
      default: return 'NEPS-R (NCMRWF)';
    }
  };

  return (
    <div className="forecast-explorer-view">
      {/* 1. Header & Title with Navigation Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.2rem' }}>
            Home &gt; Forecast Explorer &amp; Model Blending
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            Forecast Explorer &amp; Adaptive Model Blending
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
            Multi-model ensemble fusion, spatial weight gating, and calibrated point forecasts across India.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigateTo('verification-lab')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', fontSize: '0.78rem', background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, color: 'var(--color-ink)' }}
          >
            <BarChart2 size={14} color="var(--color-primary)" />
            <span>Verification Lab</span>
          </button>

          <button
            type="button"
            className="btn-primary-blue"
            onClick={() => navigateTo('about')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', fontSize: '0.78rem', background: 'var(--color-primary)', color: '#FFFFFF', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}
          >
            <BookOpen size={14} />
            <span>Blending Methodology</span>
          </button>
        </div>
      </div>

      {/* 2. Top Controls & Mode Switcher Bar */}
      <div className="card-standard" style={{ padding: '0.65rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: '#FFFFFF' }}>
        {/* Map Overlay Mode Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginRight: '0.25rem' }}>
            Map Layer:
          </span>
          
          <button
            type="button"
            className={`pill-btn ${activeMapMode === 'blend' ? 'active' : ''}`}
            onClick={() => setActiveMapMode('blend')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <Sparkles size={13} />
            <span>Blended Forecast</span>
          </button>

          <button
            type="button"
            className={`pill-btn ${activeMapMode === 'weights' ? 'active' : ''}`}
            onClick={() => setActiveMapMode('weights')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <GitMerge size={13} />
            <span>Spatial Model Weights</span>
          </button>

          <button
            type="button"
            className={`pill-btn ${activeMapMode === 'agreement' ? 'active' : ''}`}
            onClick={() => setActiveMapMode('agreement')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <Sliders size={13} />
            <span>Model Agreement</span>
          </button>

          <button
            type="button"
            className={`pill-btn ${activeMapMode === 'confidence' ? 'active' : ''}`}
            onClick={() => setActiveMapMode('confidence')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <ShieldAlert size={13} />
            <span>Confidence Level</span>
          </button>
        </div>

        {/* Model Selector when Weights Mode is Active */}
        {activeMapMode === 'weights' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 600 }}>Upstream Model:</span>
            <select
              value={selectedRosterModel}
              onChange={(e) => setSelectedRosterModel(e.target.value)}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', border: '1px solid var(--color-primary)', borderRadius: '4px', background: '#EFF6FF', fontWeight: 700, color: 'var(--color-primary)' }}
            >
              <option value="neps-r">NEPS-R (NCMRWF 4km)</option>
              <option value="mithuna-fs">NCUM-G Mithuna (NCMRWF 12km)</option>
              <option value="ecmwf-ifs">ECMWF IFS / HRES (9km)</option>
              <option value="ecmwf-aifs">ECMWF AIFS (AI Ensemble)</option>
              <option value="gfs">NOAA GFS (0.25°)</option>
              <option value="graphcast">GraphCast (DeepMind)</option>
            </select>
          </div>
        )}
      </div>

      {/* 3. Main Workspace: Interactive Map (Col 7/8) + Point / Blending Stats (Col 5/4) */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Left Map Panel */}
        <div className="col-span-7 card-standard" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-ink)' }}>
                {activeMapMode === 'blend' && `Blended Rainfall Forecast (+${timelineStepHours}h Horizon)`}
                {activeMapMode === 'weights' && `Spatial Gating Weights: ${getRosterModelName(selectedRosterModel)}`}
                {activeMapMode === 'agreement' && `Inter-Model Agreement Spread (+${timelineStepHours}h)`}
                {activeMapMode === 'confidence' && `Forecast Confidence Index (+${timelineStepHours}h)`}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                {activeMapMode === 'blend' && 'Softmax weighted multi-model spatial precipitation'}
                {activeMapMode === 'weights' && 'Adaptive weight allocation per meteorological subdivision'}
                {activeMapMode === 'agreement' && 'Ensemble standard deviation and model consensus'}
                {activeMapMode === 'confidence' && 'Physics-informed reliability & regime certainty'}
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', background: '#F1F5F9', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 600, color: 'var(--color-primary)' }}>
              Selected: {selectedSubdivision.name}
            </div>
          </div>

          {/* Interactive Subdivision Map */}
          <div style={{ position: 'relative', flex: 1, minHeight: '430px' }}>
            <IndiaMap />

            {/* Contextual Legend overlay */}
            <div 
              style={{
                position: 'absolute',
                right: '15px',
                top: '60px',
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem 0.6rem',
                fontSize: '0.68rem',
                boxShadow: 'var(--shadow-card)',
                zIndex: 10
              }}
            >
              {activeMapMode === 'weights' ? (
                <>
                  <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--color-ink)' }}>Weight Share</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#1E3A8A' }}></span> &gt; 50% Primary</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#2563EB' }}></span> 35 – 50% High</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#60A5FA' }}></span> 20 – 35% Med</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#BFDBFE' }}></span> 10 – 20% Low</div>
                    <div style={{ display: 'center', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#F1F5F9' }}></span> &lt; 10% Min</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--color-ink)' }}>Rainfall (mm)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#D64545' }}></span> 200+</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#F08A3C' }}></span> 100</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#F2C230' }}></span> 50</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#2E9E4F' }}></span> 25</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#0284C7' }}></span> 10</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#0B3D62' }}></span> 5</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#E2E8F0' }}></span> 0</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div style={{ marginTop: '0.75rem', background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <button
              type="button"
              onClick={handlePlayToggle}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              {isPlayingTimeline ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
            </button>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '3px', background: '#CBD5E1', zIndex: 1, transform: 'translateY(-50%)' }} />
              
              {timelineSteps.map((step) => {
                const isSelected = timelineStepHours === step.hours;
                return (
                  <button
                    key={step.hours}
                    type="button"
                    onClick={() => setTimelineStepHours(step.hours)}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      background: isSelected ? '#2563EB' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--color-muted)',
                      border: isSelected ? '2px solid #2563EB' : '2px solid #94A3B8',
                      borderRadius: '12px',
                      padding: '0.15rem 0.5rem',
                      fontSize: '0.72rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textAlign: 'right', flexShrink: 0 }}>
              <div>Valid Cycle:</div>
              <strong style={{ color: 'var(--color-ink)' }}>26 Sep 2026, 12 UTC</strong>
            </div>
          </div>
        </div>

        {/* Right Panel: Integrated Point Forecast & Adaptive Blending Weights */}
        <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-standard" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Subdivision Title Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 600 }}>Subdivision Analysis</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {selectedSubdivision.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                  Centroid: {selectedSubdivision.mapCoords.cx}°E, {selectedSubdivision.mapCoords.cy}°N &bull; Lead: +{timelineStepHours}h
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('explainability', selectedSubdivision.id)}
                style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.68rem', color: '#1D4ED8', fontWeight: 600, cursor: 'pointer' }}
              >
                Deep Explainability →
              </button>
            </div>

            {/* Main Tabs for Right Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '4px', marginBottom: '0.85rem' }}>
              <button
                type="button"
                className={`pill-btn ${rightPanelTab === 'point-forecast' ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '0.35rem', textAlign: 'center' }}
                onClick={() => setRightPanelTab('point-forecast')}
              >
                Point Forecast
              </button>
              <button
                type="button"
                className={`pill-btn ${rightPanelTab === 'adaptive-weights' ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '0.35rem', textAlign: 'center' }}
                onClick={() => setRightPanelTab('adaptive-weights')}
              >
                Adaptive Weights
              </button>
            </div>

            {rightPanelTab === 'point-forecast' ? (
              <>
                {/* Variable sub-tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    className={`pill-btn ${pointVarTab === 'rainfall' ? 'active' : ''}`}
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    onClick={() => setPointVarTab('rainfall')}
                  >
                    Rainfall
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${pointVarTab === 'temperature' ? 'active' : ''}`}
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    onClick={() => setPointVarTab('temperature')}
                  >
                    Temperature
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${pointVarTab === 'wind' ? 'active' : ''}`}
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    onClick={() => setPointVarTab('wind')}
                  >
                    Wind
                  </button>
                </div>

                {/* Headline forecast value */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                      {pointVarTab === 'rainfall' ? '78 mm' : pointVarTab === 'temperature' ? '28.4 °C' : '22 km/h'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '3px' }}>
                      Blended Forecast (+{timelineStepHours}h Lead)
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700, border: '1px solid #BBF7D0' }}>
                      Medium Confidence
                    </span>
                  </div>
                </div>

                {/* Secondary Point Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.85rem', fontSize: '0.72rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ color: 'var(--color-muted)' }}>Forecast range</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-ink)' }}>42 – 127 mm</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>(P10 – P90)</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ color: 'var(--color-muted)' }}>Prob &gt; 64.5mm</div>
                    <div style={{ fontWeight: 700, color: '#D97706' }}>78%</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>IMD Heavy Rain</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ color: 'var(--color-muted)' }}>Mean Wind</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>18 km/h</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>WSW (Offshore)</div>
                  </div>
                </div>

                {/* Point Model Contribution */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.4rem' }}>
                    Model Contribution in Blend ({selectedSubdivision.name})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem' }}>
                    {[
                      { name: 'NEPS-R (NCMRWF 4km)', pct: 36, color: '#2563EB' },
                      { name: 'NCUM-G (NCMRWF 12km)', pct: 28, color: '#059669' },
                      { name: 'ECMWF IFS (9km)', pct: 18, color: '#7C3AED' },
                      { name: 'ECMWF AIFS (AI)', pct: 10, color: '#F59E0B' },
                      { name: 'NOAA GFS (0.25°)', pct: 8, color: '#64748B' },
                    ].map((m, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                          <span style={{ fontWeight: 500 }}>{m.name}</span>
                          <strong>{m.pct}%</strong>
                        </div>
                        <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${m.pct}%`, height: '100%', background: m.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Overall National vs Local Contribution */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                      Overall Contribution (India vs {selectedSubdivision.name})
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>+72h Lead</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem' }}>
                    {[
                      { name: 'NEPS-R (Convection Ensemble)', localPct: 36, indiaPct: 34, color: '#2563EB' },
                      { name: 'NCUM-G (Deterministic Global)', localPct: 28, indiaPct: 26, color: '#059669' },
                      { name: 'ECMWF IFS (Physics Global)', localPct: 18, indiaPct: 18, color: '#7C3AED' },
                      { name: 'ECMWF AIFS (Data-Driven AI)', localPct: 10, indiaPct: 12, color: '#F59E0B' },
                      { name: 'NOAA GFS & GraphCast', localPct: 8, indiaPct: 10, color: '#64748B' },
                    ].map((m, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                          <span style={{ fontWeight: 500 }}>{m.name}</span>
                          <span style={{ fontWeight: 700, color: m.color }}>{m.localPct}% <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>({m.indiaPct}% Nat.)</span></span>
                        </div>
                        <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${m.localPct}%`, height: '100%', background: m.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Weight Evolution over Lead Time */}
                <div style={{ marginTop: 'auto', background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-ink)' }}>
                      Weight Evolution (0h – 120h Lead)
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: 600 }}>{selectedSubdivision.name}</span>
                  </div>

                  <svg viewBox="0 0 360 110" style={{ width: '100%', height: 'auto' }}>
                    <line x1="25" y1="15" x2="345" y2="15" stroke="#E2E8F0" strokeDasharray="2 2" />
                    <line x1="25" y1="50" x2="345" y2="50" stroke="#E2E8F0" strokeDasharray="2 2" />
                    <line x1="25" y1="85" x2="345" y2="85" stroke="#94A3B8" strokeWidth="1" />

                    <text x="20" y="18" textAnchor="end" fontSize="7.5" fill="#64748B">80%</text>
                    <text x="20" y="53" textAnchor="end" fontSize="7.5" fill="#64748B">40%</text>
                    <text x="20" y="88" textAnchor="end" fontSize="7.5" fill="#64748B">0%</text>

                    <text x="35" y="98" textAnchor="middle" fontSize="7.5" fill="#64748B">0h</text>
                    <text x="95" y="98" textAnchor="middle" fontSize="7.5" fill="#64748B">24h</text>
                    <text x="155" y="98" textAnchor="middle" fontSize="7.5" fill="#64748B">48h</text>
                    <text x="215" y="98" textAnchor="middle" fontSize="7.5" fill="#2563EB" fontWeight="700">72h</text>
                    <text x="275" y="98" textAnchor="middle" fontSize="7.5" fill="#64748B">96h</text>
                    <text x="335" y="98" textAnchor="middle" fontSize="7.5" fill="#64748B">120h</text>

                    {/* NEPS line */}
                    <polyline points="35,60 95,46 155,38 215,36 275,44 335,50" fill="none" stroke="#2563EB" strokeWidth="2.2" />
                    {/* NCUM line */}
                    <polyline points="35,50 95,54 155,58 215,60 275,64 335,68" fill="none" stroke="#059669" strokeWidth="1.8" strokeDasharray="3 2" />
                    {/* IFS line */}
                    <polyline points="35,70 95,68 155,66 215,68 275,66 335,64" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeDasharray="3 2" />
                    {/* AIFS line */}
                    <polyline points="35,80 95,76 155,74 215,72 275,68 335,62" fill="none" stroke="#F59E0B" strokeWidth="1.8" />
                  </svg>

                  <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.65rem', color: 'var(--color-muted)', marginTop: '2px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#2563EB', fontWeight: 600 }}>● NEPS (4km)</span>
                    <span style={{ color: '#059669' }}>● NCUM (12km)</span>
                    <span style={{ color: '#7C3AED' }}>● IFS (9km)</span>
                    <span style={{ color: '#F59E0B' }}>● AIFS (AI)</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Middle Section: Forecast Timeline Chart + Model Comparison Bar + Attribution Gating */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Forecast Timeline */}
        <div className="col-span-4 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
              Forecast Timeline ({selectedSubdivision.name})
            </span>
            <button
              type="button"
              onClick={() => navigateTo('explainability', selectedSubdivision.id)}
              style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Explain &rarr;
            </button>
          </div>

          <svg viewBox="0 0 380 140" style={{ width: '100%', height: 'auto' }}>
            <line x1="30" y1="20" x2="360" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="30" y1="60" x2="360" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="30" y1="100" x2="360" y2="100" stroke="#94A3B8" strokeWidth="1" />

            <text x="25" y="24" textAnchor="end" fontSize="8" fill="#64748B">150</text>
            <text x="25" y="64" textAnchor="end" fontSize="8" fill="#64748B">75</text>
            <text x="25" y="104" textAnchor="end" fontSize="8" fill="#64748B">0</text>

            <text x="45" y="115" textAnchor="middle" fontSize="8" fill="#64748B">Now</text>
            <text x="105" y="115" textAnchor="middle" fontSize="8" fill="#64748B">+24h</text>
            <text x="165" y="115" textAnchor="middle" fontSize="8" fill="#64748B">+48h</text>
            <text x="225" y="115" textAnchor="middle" fontSize="8" fill="#2563EB" fontWeight="700">+72h</text>
            <text x="285" y="115" textAnchor="middle" fontSize="8" fill="#64748B">+96h</text>
            <text x="345" y="115" textAnchor="middle" fontSize="8" fill="#64748B">+120h</text>

            {/* P10 - P90 Uncertainty Shaded Band */}
            <polygon
              points="45,95 105,85 165,65 225,30 285,55 345,75 345,95 285,85 225,65 165,85 105,95 45,100"
              fill="#2563EB"
              fillOpacity="0.15"
            />

            {/* Mean Line */}
            <polyline
              points="45,98 105,90 165,75 225,48 285,70 345,85"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.2"
            />
            <circle cx="225" cy="48" r="3.5" fill="#2563EB" />
          </svg>

          <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '3px', background: '#2563EB' }}></span> Blended Mean
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: '#2563EB', opacity: 0.2 }}></span> P10–P90 Range
            </div>
          </div>
        </div>

        {/* Model Comparison Bar Chart */}
        <div className="col-span-4 card-standard">
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.75rem' }}>
            Model Forecast Spread ({selectedSubdivision.name}, mm)
          </span>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '115px', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB' }}>78</div>
              <div style={{ width: '26px', height: '62px', background: '#2563EB', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-ink)', fontWeight: 700, marginTop: '4px' }}>Blend</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#059669' }}>62</div>
              <div style={{ width: '26px', height: '48px', background: '#059669', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '4px' }}>NCUM</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#7C3AED' }}>105</div>
              <div style={{ width: '26px', height: '84px', background: '#7C3AED', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '4px' }}>NEPS</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#F59E0B' }}>58</div>
              <div style={{ width: '26px', height: '44px', background: '#F59E0B', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '4px' }}>IFS</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>46</div>
              <div style={{ width: '26px', height: '36px', background: '#64748B', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '4px' }}>GFS</div>
            </div>
          </div>
        </div>

        {/* Recent Forecast Runs */}
        <div className="col-span-4 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
              Operational Assimilation Runs
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>UTC Cycles</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.55rem', background: '#F0FDF4', borderRadius: '4px', border: '1px solid #DCFCE7' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#166534' }}>26 Sep, 12 UTC</div>
                <div style={{ fontSize: '0.68rem', color: '#15803D' }}>T+72h blend active</div>
              </div>
              <span style={{ background: '#22C55E', color: '#FFFFFF', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                ● Latest
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.55rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>26 Sep, 06 UTC</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>T+72h completed</div>
              </div>
              <CheckCircle2 size={13} color="#059669" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.55rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>25 Sep, 12 UTC</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>Archived run</div>
              </div>
              <CheckCircle2 size={13} color="#059669" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. "Why this model has highest weight here?" Attribution Gating Cards */}
      <div className="card-standard" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.85rem' }}>
          Adaptive Gating Attribution: Why NEPS-R Has Primary Weight (36%) in {selectedSubdivision.name}?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Historical Skill</span>
              <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>High</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
              Consistently captures steep coastal orography and heavy monsoon rainfall episodes across western peninsular India.
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Regime Similarity</span>
              <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>High</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
              Current offshore trough cluster closely matches high-accuracy training regimes in the adaptive LightGBM gating model.
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Model Agreement</span>
              <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>Moderate</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
              Strong spatial agreement with ECMWF AIFS and NCUM on primary convective core; moderate tail variance.
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Lead-Time Skill</span>
              <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>High</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
              Low phase error and high spatial sharpness maintained at the 72h lead horizon without over-smoothing.
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Row: Weather Regime Influence & Regional Preferences */}
      <div className="grid-12">
        {/* Weather Regime Influence */}
        <div className="col-span-6 card-standard">
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.75rem' }}>
            Weather Regime Influence on Blending Weights
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
              Regional Model Preference (NEPS-R Gating Share)
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
