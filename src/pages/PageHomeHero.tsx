import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { 
  ArrowRight, 
  Play, 
  Layers, 
  Sliders, 
  TrendingUp, 
  ShieldAlert, 
  CloudRain, 
  Thermometer, 
  Wind, 
  AlertTriangle,
  ChevronRight,
  Database,
  CheckCircle2,
  Activity
} from 'lucide-react';

export const PageHomeHero: React.FC = () => {
  const { navigateTo, setVariable, setLeadTime } = useForecast();

  return (
    <div className="home-overview-view">
      {/* 1. Hero Banner with Satellite Cloud backdrop and live forecast overlay */}
      <div className="home-hero-banner">
        <div className="grid-12" style={{ position: 'relative', zIndex: 2, alignItems: 'center' }}>
          {/* Left Hero Text */}
          <div className="col-span-7">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: '#93C5FD', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Hybrid AI – NWP Multi-Model Forecast Blending System
            </div>
            <h1 className="hero-headline" style={{ marginBottom: '1rem' }}>
              Smarter Forecasts for a <span style={{ color: '#60A5FA' }}>Safer India</span>
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5', maxWidth: '58ch', marginBottom: '1.5rem' }}>
              Integrating multiple forecasting systems through intelligent, region- and situation-aware model blending to deliver more accurate and reliable forecasts for rainfall, temperature, wind and extreme weather events.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary-blue"
                onClick={() => navigateTo('forecast-explorer')}
              >
                <span>Explore Forecasts</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="btn-hero-outline"
                onClick={() => navigateTo('about')}
              >
                <Play size={14} />
                <span>How It Works</span>
              </button>
            </div>
          </div>

          {/* Right Hero Mini Map Widget */}
          <div className="col-span-5" style={{ background: 'rgba(7, 25, 44, 0.85)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)' }}>26 Sep 2026, 12 UTC</span>
              <span style={{ fontSize: '0.7rem', background: '#166534', color: '#86EFAC', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                ● Live Forecast
              </span>
            </div>

            {/* Variable Pills in widget */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                className="pill-btn active"
                style={{ fontSize: '0.72rem', padding: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                onClick={() => { setVariable('rainfall'); navigateTo('forecast-explorer'); }}
              >
                <CloudRain size={12} /> Rainfall
              </button>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.72rem', padding: '0.3rem', color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                onClick={() => { setVariable('temperature'); navigateTo('forecast-explorer'); }}
              >
                <Thermometer size={12} /> Temperature
              </button>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.72rem', padding: '0.3rem', color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                onClick={() => { setVariable('wind'); navigateTo('forecast-explorer'); }}
              >
                <Wind size={12} /> Wind
              </button>
            </div>

            {/* Mini Map Snapshot Graphic */}
            <div style={{ background: '#04101D', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FFFFFF' }}>Blended Rainfall Forecast</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>Next 72 hours (India Domain)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60A5FA', marginTop: '0.35rem' }}>78 mm / 24h peak</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>Rainfall Scale</div>
                <div style={{ width: '60px', height: '6px', borderRadius: '3px', background: 'linear-gradient(90deg, #0284C7 0%, #10B981 30%, #F59E0B 60%, #EF4444 100%)' }}></div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('forecast-explorer')}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                padding: '0.45rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#FFFFFF',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <span>View Full Interactive Map</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* 4 Feature Pills on Banner */}
        <div className="hero-feature-pills">
          <div className="hero-feature-pill">
            <div className="hero-feature-icon"><Layers size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>Multi-Model Integration</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>NWP, Ensemble & AI models</div>
            </div>
          </div>

          <div className="hero-feature-pill">
            <div className="hero-feature-icon"><Sliders size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>Adaptive Blending</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>Region, lead time & regime aware</div>
            </div>
          </div>

          <div className="hero-feature-pill">
            <div className="hero-feature-icon"><TrendingUp size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>Higher Forecast Skill</div>
              <div style={{ fontSize: '0.72rem', color: '#86EFAC', fontWeight: 600 }}>+18% Better than single models</div>
            </div>
          </div>

          <div className="hero-feature-pill">
            <div className="hero-feature-icon"><ShieldAlert size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>Extreme Weather Guidance</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>Heavy rainfall, heat & gusts</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Card 1: Skill Improvement */}
        <div className="col-span-3 stat-summary-card" onClick={() => navigateTo('verification-lab')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Forecast Skill Improvement</span>
            <TrendingUp size={16} color="#15803D" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803D', margin: '0.4rem 0 0.1rem 0' }}>
            +18%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--color-muted)' }}>vs. best individual model</span>
            <span style={{ color: '#15803D', background: '#DCFCE7', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 700 }}>↑ Better accuracy</span>
          </div>
        </div>

        {/* Card 2: Temperature */}
        <div className="col-span-3 stat-summary-card" onClick={() => navigateTo('forecast-explorer')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Temperature (India Avg.)</span>
            <Thermometer size={16} color="#DC2626" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0.4rem 0 0.1rem 0' }}>
            32.4 °C
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: '#DC2626', fontWeight: 600 }}>↑ +1.8 °C vs normal</span>
            <span style={{ color: 'var(--color-muted)' }}>Central plains</span>
          </div>
        </div>

        {/* Card 3: Rainfall Area */}
        <div className="col-span-3 stat-summary-card" onClick={() => navigateTo('forecast-explorer')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Rainfall (India Avg.)</span>
            <CloudRain size={16} color="#0284C7" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0.4rem 0 0.1rem 0' }}>
            52%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
            Area with moderate to heavy rainfall
          </div>
        </div>

        {/* Card 4: Extreme Risk */}
        <div className="col-span-3 stat-summary-card" onClick={() => navigateTo('extreme-weather')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Extreme Weather Risk</span>
            <AlertTriangle size={16} color="#D64545" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#D64545', margin: '0.4rem 0 0.1rem 0' }}>
            3
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
            Subdivisions under high risk (72 hrs)
          </div>
        </div>
      </div>

      {/* 3. Middle Triple Columns: Quick Access | Model Contribution | Latest Alerts */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Quick Forecast Access Box */}
        <div className="col-span-4 card-standard">
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.2rem' }}>
            Quick Forecast Access
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.85rem' }}>
            Explore blended forecasts for your region and variable.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-muted)' }}>Region / Subdivision</label>
              <select 
                style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#F8FAFC', outline: 'none' }}
                onChange={(e) => navigateTo('explainability', e.target.value)}
              >
                <option value="sub-23">Konkan & Goa (Maharashtra)</option>
                <option value="sub-7">Odisha (East Coast)</option>
                <option value="sub-28">Coastal Andhra Pradesh & Yanam</option>
                <option value="sub-17">West Rajasthan (Desert Zone)</option>
                <option value="sub-16">Jammu & Kashmir and Ladakh</option>
                <option value="sub-3">Assam & Meghalaya (North East)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-muted)' }}>Season / Monsoon Phase</label>
              <select style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#F8FAFC', outline: 'none' }}>
                <option>Southwest Monsoon (Active Phase)</option>
                <option>Break Monsoon Period</option>
                <option>Western Disturbance Winter</option>
                <option>Pre-Monsoon Summer Heatwave</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-muted)' }}>Lead Time</label>
                <select 
                  style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#F8FAFC' }}
                  onChange={(e) => setLeadTime(e.target.value as any)}
                >
                  <option value="day-3">72 hours (Day 3)</option>
                  <option value="day-1">24 hours (Day 1)</option>
                  <option value="day-5">120 hours (Day 5)</option>
                  <option value="day-7">168 hours (Day 7)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-muted)' }}>Variable</label>
                <select 
                  style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#F8FAFC' }}
                  onChange={(e) => setVariable(e.target.value as any)}
                >
                  <option value="rainfall">Rainfall (mm)</option>
                  <option value="temperature">Temperature (°C)</option>
                  <option value="wind">Wind Speed (km/h)</option>
                  <option value="extreme">Extreme Events</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary-blue"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              onClick={() => navigateTo('forecast-explorer')}
            >
              <span>View Forecast</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Model Contribution (India Average) */}
        <div className="col-span-4 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-ink)' }}>
              Model Contribution (India Average)
            </h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Gating Softmax</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.85rem' }}>
            Current ensemble weight shares across 36 subdivisions
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { name: 'NEPS-R / NEPS-G (NCMRWF)', pct: 34, color: '#2563EB' },
              { name: 'NCUM-G Mithuna-FS (NCMRWF)', pct: 26, color: '#059669' },
              { name: 'ECMWF IFS/HRES', pct: 18, color: '#7C3AED' },
              { name: 'ECMWF AIFS (AI Ensemble)', pct: 12, color: '#F59E0B' },
              { name: 'GFS (NOAA / NCEP)', pct: 7, color: '#64748B' },
              { name: 'Others (GraphCast / Pangu)', pct: 3, color: '#94A3B8' },
            ].map((row, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 500 }}>{row.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-ink)' }}>{row.pct}%</span>
                </div>
                <div style={{ height: '7px', width: '100%', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${row.pct * 2.8}%`, height: '100%', backgroundColor: row.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Alerts */}
        <div className="col-span-4 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-ink)' }}>
              Latest Operational Alerts
            </h2>
            <button
              type="button"
              onClick={() => navigateTo('extreme-weather')}
              style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              View All →
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.85rem' }}>
            Real-time threshold exceedance alerts
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* Alert 1 */}
            <div style={{ display: 'flex', gap: '0.6rem', padding: '0.6rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)' }}>
              <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#991B1B' }}>Heavy Rainfall Alert</span>
                  <span style={{ fontSize: '0.68rem', color: '#991B1B' }}>2 hrs ago</span>
                </div>
                <div style={{ fontSize: '0.73rem', color: '#7F1D1D', marginTop: '2px' }}>
                  Very heavy rainfall likely over Konkan and parts of Madhya Maharashtra in next 72 hours.
                </div>
              </div>
            </div>

            {/* Alert 2 */}
            <div style={{ display: 'flex', gap: '0.6rem', padding: '0.6rem', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--radius-sm)' }}>
              <Thermometer size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#92400E' }}>Heat Wave Watch</span>
                  <span style={{ fontSize: '0.68rem', color: '#92400E' }}>4 hrs ago</span>
                </div>
                <div style={{ fontSize: '0.73rem', color: '#78350F', marginTop: '2px' }}>
                  Above normal temperatures likely over Vidarbha & West Rajasthan.
                </div>
              </div>
            </div>

            {/* Alert 3 */}
            <div style={{ display: 'flex', gap: '0.6rem', padding: '0.6rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-sm)' }}>
              <Wind size={18} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#166534' }}>Strong Winds Alert</span>
                  <span style={{ fontSize: '0.68rem', color: '#166534' }}>5 hrs ago</span>
                </div>
                <div style={{ fontSize: '0.73rem', color: '#14532D', marginTop: '2px' }}>
                  High wind speeds (45-55 km/h) expected over coastal Karnataka and adjoining seas.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Ingestion Sources Footer Bar with Arunika Badge */}
      <div className="card-standard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-ink)' }}>
            Data Sources (Currently Active):
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
            <span style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, color: '#0B3D62' }}>
              NCUM-G (NCMRWF)
            </span>
            <span style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, color: '#2563EB' }}>
              NEPS-G (NCMRWF)
            </span>
            <span style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, color: '#7C3AED' }}>
              ECMWF IFS
            </span>
            <span style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, color: '#F59E0B' }}>
              ECMWF AIFS
            </span>
            <span style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, color: '#059669' }}>
              GFS (NOAA)
            </span>
            <span style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, color: '#DC2626' }}>
              ICON (DWD)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={13} /> Arunika-ready Architecture
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
            Demoed on public proxy data &bull; swaps directly to Mithuna-FS HPC
          </span>
        </div>
      </div>
    </div>
  );
};
