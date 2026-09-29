import React, { useState, useEffect } from 'react';
import { useForecast } from '../context/ForecastContext';
import { IndiaMap } from '../components/IndiaMap';
import { LiveBlendingSimulator } from '../components/LiveBlendingSimulator';
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
  Sparkles,
  Activity,
  Zap,
  HelpCircle
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
  const [rightPanelTab, setRightPanelTab] = useState<'point-forecast' | 'adaptive-weights' | 'attribution'>('point-forecast');
  const [pointVarTab, setPointVarTab] = useState<'rainfall' | 'temperature' | 'wind'>('rainfall');

  const timelineSteps = [
    { label: 'Now', hours: 0 },
    { label: '+24h', hours: 24 },
    { label: '+48h', hours: 48 },
    { label: '+72h', hours: 72 },
    { label: '+96h', hours: 96 },
    { label: '+120h', hours: 120 }
  ];

  // Synchronize internal variable tab with global ForecastContext
  useEffect(() => {
    if (variable === 'rainfall' || variable === 'temperature' || variable === 'wind') {
      setPointVarTab(variable as any);
    }
  }, [variable]);

  const handleSelectVarTab = (tab: 'rainfall' | 'temperature' | 'wind') => {
    setPointVarTab(tab);
    setVariable(tab);
  };

  // Automated Timeline Simulation Loop (Steps through horizons)
  useEffect(() => {
    if (!isPlayingTimeline) return;

    const timer = setInterval(() => {
      setTimelineStepHours(prev => {
        const sequence = [0, 24, 48, 72, 96, 120];
        const nextIdx = (sequence.indexOf(prev) + 1) % sequence.length;
        const nextHours = sequence[nextIdx];

        if (nextHours <= 24) setLeadTime('day-1');
        else if (nextHours <= 72) setLeadTime('day-3');
        else if (nextHours <= 120) setLeadTime('day-5');
        else setLeadTime('day-7');

        return nextHours;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [isPlayingTimeline, setTimelineStepHours, setLeadTime]);

  const handlePlayToggle = () => {
    setIsPlayingTimeline(!isPlayingTimeline);
  };

  const handleSelectTimelineStep = (hours: number) => {
    setTimelineStepHours(hours);
    if (hours <= 24) setLeadTime('day-1');
    else if (hours <= 72) setLeadTime('day-3');
    else if (hours <= 120) setLeadTime('day-5');
    else setLeadTime('day-7');
  };

  // Scroll to Sandbox helper
  const scrollToSandbox = () => {
    const el = document.getElementById('live-blending-sandbox');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic point forecast generator based on selected subdivision, variable, and timeline hours
  const calculatePointForecast = () => {
    const hours = timelineStepHours;
    const zone = selectedSubdivision.zone;

    if (pointVarTab === 'rainfall') {
      let base = 28;
      if (zone === 'Peninsula') base = 48;
      else if (zone === 'NorthEast') base = 42;
      else if (zone === 'Central' || zone === 'East') base = 24;
      else if (zone === 'NorthWest') base = 3;

      const factor = hours === 0 ? 0.35 : hours === 24 ? 0.75 : hours === 48 ? 1.25 : hours === 72 ? 1.55 : hours === 96 ? 1.10 : 0.65;
      const val = Math.round(base * factor);
      const p10 = Math.max(0, Math.round(val * 0.6));
      const p90 = Math.round(val * 1.55);
      const probHeavy = Math.min(96, Math.max(4, Math.round((val / 85) * 88)));

      return {
        headline: `${val} mm`,
        label: `Blended Rainfall (+${hours}h Lead)`,
        range: `${p10} – ${p90} mm`,
        stat2Label: 'Prob > 64.5mm',
        stat2Val: `${probHeavy}%`,
        stat2Sub: val > 64.5 ? 'IMD Heavy Rain Alert' : 'Moderate Rainfall',
        stat3Label: 'Mean Wind',
        stat3Val: `${Math.round(14 + (val / 10))} km/h`,
        stat3Sub: zone === 'Peninsula' ? 'WSW (Coastal Surge)' : 'Variable',
        confidence: hours <= 24 ? 'High Confidence (89%)' : hours <= 72 ? 'Medium Confidence (74%)' : 'Caution / High Spread (58%)',
        confidenceColor: hours <= 24 ? '#15803D' : hours <= 72 ? '#D97706' : '#DC2626',
        confidenceBg: hours <= 24 ? '#DCFCE7' : hours <= 72 ? '#FEF3C7' : '#FEE2E2',
        weights: hours <= 24 
          ? [
              { name: 'Pangu-Weather (AI)', pct: 38, color: '#9333EA' },
              { name: 'IFS HRES (Physical 9km)', pct: 32, color: '#0284C7' },
              { name: 'NEPS-R (NCMRWF 4km)', pct: 20, color: '#2563EB' },
              { name: 'IFS ENS Mean', pct: 10, color: '#D97706' }
            ]
          : hours <= 72
          ? [
              { name: 'NEPS-R (NCMRWF 4km)', pct: 36, color: '#2563EB' },
              { name: 'NCUM-G (NCMRWF 12km)', pct: 28, color: '#059669' },
              { name: 'ECMWF IFS (9km)', pct: 18, color: '#0284C7' },
              { name: 'Pangu-Weather (AI)', pct: 10, color: '#9333EA' },
              { name: 'IFS ENS Mean', pct: 8, color: '#D97706' }
            ]
          : [
              { name: 'IFS ENS Mean (Ensemble)', pct: 36, color: '#D97706' },
              { name: 'HyBlend GBDT Prior', pct: 26, color: '#2563EB' },
              { name: 'ECMWF IFS (9km)', pct: 20, color: '#0284C7' },
              { name: 'Pangu-Weather (AI)', pct: 18, color: '#9333EA' }
            ]
      };
    } else if (pointVarTab === 'temperature') {
      let base = 32.5;
      if (zone === 'NorthWest' || zone === 'Central') base = 39.2;
      else if (zone === 'North') base = 18.4;
      else if (zone === 'Peninsula') base = 31.0;

      const delta = hours === 0 ? -1.8 : hours === 24 ? 0.8 : hours === 48 ? 2.6 : hours === 72 ? 3.8 : hours === 96 ? 2.4 : 0.5;
      const val = Number((base + delta).toFixed(1));
      const p10 = (val - 1.6).toFixed(1);
      const p90 = (val + 1.9).toFixed(1);
      const probHeat = val >= 42.0 ? Math.min(94, Math.round(((val - 40) / 6) * 100)) : Math.round((val / 45) * 20);

      return {
        headline: `${val} °C`,
        label: `Blended 2m Temperature (+${hours}h Lead)`,
        range: `${p10} – ${p90} °C`,
        stat2Label: 'Prob > 42.0°C',
        stat2Val: `${probHeat}%`,
        stat2Sub: val >= 42.0 ? 'Heatwave Criteria Met' : 'Normal / Below Heatwave',
        stat3Label: 'Relative Humidity',
        stat3Sub: zone === 'NorthWest' ? 'Hyper-Arid Advection' : 'Maritime Airflow',
        stat3Val: zone === 'NorthWest' ? '24%' : '68%',
        confidence: hours <= 24 ? 'High Confidence (92%)' : hours <= 72 ? 'Medium Confidence (82%)' : 'Caution / Spread (64%)',
        confidenceColor: hours <= 24 ? '#15803D' : hours <= 72 ? '#D97706' : '#DC2626',
        confidenceBg: hours <= 24 ? '#DCFCE7' : hours <= 72 ? '#FEF3C7' : '#FEE2E2',
        weights: hours <= 24 
          ? [
              { name: 'Pangu-Weather (AI Baseline)', pct: 44, color: '#9333EA' },
              { name: 'IFS HRES (Physical NWP)', pct: 34, color: '#0284C7' },
              { name: 'IFS ENS Mean', pct: 22, color: '#D97706' }
            ]
          : hours <= 72
          ? [
              { name: 'Pangu-Weather (AI)', pct: 40, color: '#9333EA' },
              { name: 'HyBlend GBDT Gate', pct: 35, color: '#2563EB' },
              { name: 'IFS ENS Mean', pct: 25, color: '#D97706' }
            ]
          : [
              { name: 'HyBlend GBDT Gate', pct: 45, color: '#2563EB' },
              { name: 'IFS ENS Mean', pct: 35, color: '#D97706' },
              { name: 'Pangu-Weather (AI)', pct: 20, color: '#9333EA' }
            ]
      };
    } else {
      let base = 18;
      if (zone === 'Peninsula' || zone === 'East' || zone === 'Islands') base = 36;
      else if (zone === 'NorthWest') base = 16;
      else if (zone === 'North') base = 12;

      const factor = hours === 0 ? 0.6 : hours === 24 ? 1.0 : hours === 48 ? 1.5 : hours === 72 ? 1.8 : hours === 96 ? 1.3 : 0.8;
      const val = Math.round(base * factor);
      const p10 = Math.max(5, Math.round(val * 0.7));
      const p90 = Math.round(val * 1.45);
      const probGale = Math.min(95, Math.max(5, Math.round((val / 75) * 85)));

      return {
        headline: `${val} km/h`,
        label: `Blended 10m Wind Speed (+${hours}h Lead)`,
        range: `${p10} – ${p90} km/h`,
        stat2Label: 'Prob > 50 km/h',
        stat2Val: `${probGale}%`,
        stat2Sub: val > 50 ? 'Gale Force Warning' : 'Normal Gradient',
        stat3Label: 'Peak Gusts',
        stat3Val: `${Math.round(val * 1.35)} km/h`,
        stat3Sub: zone === 'Peninsula' ? 'Squally Surge' : 'Moderate Gusts',
        confidence: hours <= 24 ? 'High Confidence (88%)' : hours <= 72 ? 'Medium Confidence (76%)' : 'Caution / High Spread (59%)',
        confidenceColor: hours <= 24 ? '#15803D' : hours <= 72 ? '#D97706' : '#DC2626',
        confidenceBg: hours <= 24 ? '#DCFCE7' : hours <= 72 ? '#FEF3C7' : '#FEE2E2',
        weights: hours <= 24
          ? [
              { name: 'Pangu-Weather (AI)', pct: 46, color: '#9333EA' },
              { name: 'IFS HRES (Physical)', pct: 32, color: '#0284C7' },
              { name: 'IFS ENS Mean', pct: 22, color: '#D97706' }
            ]
          : hours <= 72
          ? [
              { name: 'HyBlend Softmax Gate', pct: 52, color: '#2563EB' },
              { name: 'Pangu-Weather (AI)', pct: 28, color: '#9333EA' },
              { name: 'IFS ENS Mean', pct: 20, color: '#D97706' }
            ]
          : [
              { name: 'HyBlend Softmax Gate', pct: 58, color: '#2563EB' },
              { name: 'IFS ENS Mean', pct: 28, color: '#D97706' },
              { name: 'Pangu-Weather (AI)', pct: 14, color: '#9333EA' }
            ]
      };
    }
  };

  const pointData = calculatePointForecast();

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
            Home &gt; Forecast &amp; Blending Studio
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            Forecast &amp; Adaptive Blending Studio
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
            Unified operational studio for spatial multi-model fusion, dynamic weight gating, and real-time LightGBM inference.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary-blue"
            onClick={scrollToSandbox}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
          >
            <Zap size={14} />
            <span>Launch Inference Sandbox</span>
          </button>

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
            className="btn-secondary"
            onClick={() => navigateTo('about')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', fontSize: '0.78rem', background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, color: 'var(--color-ink)' }}
          >
            <BookOpen size={14} />
            <span>Methodology</span>
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

      {/* 3. Main Operational Studio: Interactive Map (Col 7) + Inspector (Col 5) */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Left Map Panel */}
        <div className="col-span-7 card-standard" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-ink)' }}>
                {activeMapMode === 'blend' && `Blended Forecast (+${timelineStepHours}h Horizon)`}
                {activeMapMode === 'weights' && `Spatial Gating Weights: ${getRosterModelName(selectedRosterModel)}`}
                {activeMapMode === 'agreement' && `Inter-Model Agreement Spread (+${timelineStepHours}h)`}
                {activeMapMode === 'confidence' && `Forecast Confidence Index (+${timelineStepHours}h)`}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                {activeMapMode === 'blend' && 'Softmax-weighted multi-model spatial prediction'}
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
            <div className="map-legend-overlay">
              {activeMapMode === 'weights' ? (
                <>
                  <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--color-ink)' }}>Weight Share</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#1E3A8A' }}></span> &gt; 50% Primary</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#2563EB' }}></span> 35 – 50% High</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#60A5FA' }}></span> 20 – 35% Med</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#BFDBFE' }}></span> 10 – 20% Low</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#F1F5F9' }}></span> &lt; 10% Min</div>
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

          {/* Active Simulation Indicator Banner */}
          {isPlayingTimeline && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.45rem 0.85rem',
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 600 }}>
                <Activity size={14} className="animate-spin" />
                <span>SIMULATION ACTIVE &bull; Advancing forecast horizon across India (+{timelineStepHours}h)</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#1E40AF', fontWeight: 700, background: '#DBEAFE', padding: '2px 8px', borderRadius: '10px' }}>
                Horizon: +{timelineStepHours}h / 120h
              </span>
            </div>
          )}

          {/* Timeline Scrubber */}
          <div style={{ marginTop: '0.75rem', background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <button
              type="button"
              onClick={handlePlayToggle}
              title={isPlayingTimeline ? 'Pause Forecast Simulation' : 'Play Forecast Simulation (+0h to +120h)'}
              style={{ 
                width: '34px', 
                height: '34px', 
                borderRadius: '50%', 
                background: isPlayingTimeline ? '#DC2626' : '#2563EB', 
                color: '#FFFFFF', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0,
                boxShadow: isPlayingTimeline ? '0 0 12px rgba(220, 38, 38, 0.5)' : '0 2px 6px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              {isPlayingTimeline ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: '2px' }} />}
            </button>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '3px', background: '#CBD5E1', zIndex: 1, transform: 'translateY(-50%)' }} />
              
              {timelineSteps.map((step) => {
                const isSelected = timelineStepHours === step.hours;
                return (
                  <button
                    key={step.hours}
                    type="button"
                    onClick={() => handleSelectTimelineStep(step.hours)}
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
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
                      transition: 'all 0.15s ease'
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

        {/* Right Panel: Integrated Studio Inspector */}
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

            {/* 3 Main Tabs for Right Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '4px', marginBottom: '0.85rem' }}>
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
                Weights
              </button>
              <button
                type="button"
                className={`pill-btn ${rightPanelTab === 'attribution' ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '0.35rem', textAlign: 'center' }}
                onClick={() => setRightPanelTab('attribution')}
              >
                Attribution
              </button>
            </div>

            {rightPanelTab === 'point-forecast' && (
              <>
                {/* Variable sub-tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    className={`pill-btn ${pointVarTab === 'rainfall' ? 'active' : ''}`}
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    onClick={() => handleSelectVarTab('rainfall')}
                  >
                    Rainfall
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${pointVarTab === 'temperature' ? 'active' : ''}`}
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    onClick={() => handleSelectVarTab('temperature')}
                  >
                    Temperature
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${pointVarTab === 'wind' ? 'active' : ''}`}
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    onClick={() => handleSelectVarTab('wind')}
                  >
                    Wind
                  </button>
                </div>

                {/* Headline forecast value */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                      {pointData.headline}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '3px' }}>
                      {pointData.label}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', background: pointData.confidenceBg, color: pointData.confidenceColor, padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700, border: `1px solid ${pointData.confidenceColor}33` }}>
                      {pointData.confidence}
                    </span>
                  </div>
                </div>

                {/* Secondary Point Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.85rem', fontSize: '0.72rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ color: 'var(--color-muted)' }}>Forecast range</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-ink)' }}>{pointData.range}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>(P10 – P90)</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ color: 'var(--color-muted)' }}>{pointData.stat2Label}</div>
                    <div style={{ fontWeight: 700, color: '#D97706' }}>{pointData.stat2Val}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>{pointData.stat2Sub}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ color: 'var(--color-muted)' }}>{pointData.stat3Label}</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{pointData.stat3Val}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>{pointData.stat3Sub}</div>
                  </div>
                </div>

                {/* Point Model Contribution */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.4rem' }}>
                    Model Contribution in Blend ({selectedSubdivision.name} &bull; +{timelineStepHours}h)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem' }}>
                    {pointData.weights.map((m, i) => (
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
            )}

            {rightPanelTab === 'adaptive-weights' && (
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

                    <polyline points="35,60 95,46 155,38 215,36 275,44 335,50" fill="none" stroke="#2563EB" strokeWidth="2.2" />
                    <polyline points="35,50 95,54 155,58 215,60 275,64 335,68" fill="none" stroke="#059669" strokeWidth="1.8" strokeDasharray="3 2" />
                    <polyline points="35,70 95,68 155,66 215,68 275,66 335,64" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeDasharray="3 2" />
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

            {rightPanelTab === 'attribution' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.1rem' }}>
                  Gating Decision Rationale ({selectedSubdivision.name})
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>Historical Stratum Skill</span>
                    <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>High</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
                    High historical correlation with IMD AWS observations in local orographic terrain.
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>Regime Match</span>
                    <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>High</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
                    Active synoptic regime aligns with trained cluster where high-res ensembles minimize phase error.
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>Model Agreement Spread</span>
                    <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>Moderate</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
                    Physical NWP and AI members exhibit core alignment with variance in localized peak intensities.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary-blue"
                  onClick={scrollToSandbox}
                  style={{ marginTop: '0.5rem', justifyContent: 'center', fontSize: '0.75rem', padding: '0.45rem' }}
                >
                  <Zap size={13} />
                  <span>Test In Live Sandbox</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Middle Section: Forecast Timeline Chart + Model Comparison Bar + Assimilation Runs */}
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

        {/* Operational Assimilation Runs */}
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

      {/* 5. Live Meta-Model Inference Sandbox (Direct LightGBM + FastAPI Engine) */}
      <LiveBlendingSimulator />

      {/* 6. Synoptic Weather Regime Influence & Regional Preferences */}
      <div className="grid-12" style={{ marginTop: '1.5rem' }}>
        {/* Weather Regime Influence */}
        <div className="col-span-6 card-standard">
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.75rem' }}>
            Weather Regime Influence on Blending Weights
          </span>

          <div className="responsive-grid-3">
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
