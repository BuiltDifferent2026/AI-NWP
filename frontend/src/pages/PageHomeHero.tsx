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
  const { variable, navigateTo, setVariable, setLeadTime } = useForecast();

  return (
    <div className="home-overview-view">
      {/* 1. Hero Banner with Satellite Cloud backdrop and live forecast overlay */}
      <div className="home-hero-banner">
        {/* Animated Realistic Satellite Weather Background Layer */}
        <div className="hero-bg-satellite" aria-hidden="true" />
        {/* Atmospheric Radar Shimmer Layer */}
        <div className="hero-bg-shimmer" aria-hidden="true" />
        {/* Dark Navy/Black Gradient Overlay for Text Readability */}
        <div className="hero-gradient-overlay" aria-hidden="true" />

        <div className="grid-12" style={{ position: 'relative', zIndex: 5, alignItems: 'center' }}>
          {/* Left Hero Text */}
          <div className="col-span-7">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: '#93C5FD', textTransform: 'uppercase' }}>
                Hybrid AI – NWP Multi-Model Forecast Blending System
              </span>
              <span style={{ height: '2px', width: '36px', background: 'linear-gradient(90deg, #60A5FA, transparent)', borderRadius: '2px' }} />
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
          <div className="col-span-5" style={{ background: 'rgba(7, 25, 44, 0.85)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', border: '1px solid rgba(255, 255, 255, 0.18)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.36)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)' }}>26 Sep 2026, 12 UTC</span>
              <span style={{ fontSize: '0.7rem', background: '#166534', color: '#86EFAC', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                ● Live Forecast
              </span>
            </div>

            {/* Variable Pills in widget */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.4rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: variable === 'rainfall' ? '#2563EB' : 'rgba(255, 255, 255, 0.14)',
                  color: variable === 'rainfall' ? '#FFFFFF' : '#F1F5F9',
                  border: variable === 'rainfall' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.28)',
                  fontWeight: variable === 'rainfall' ? 700 : 500,
                  boxShadow: variable === 'rainfall' ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none'
                }}
                onClick={() => setVariable('rainfall')}
              >
                <CloudRain size={13} color={variable === 'rainfall' ? '#FFFFFF' : '#93C5FD'} />
                <span>Rainfall</span>
              </button>
              <button
                type="button"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.4rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: variable === 'temperature' ? '#2563EB' : 'rgba(255, 255, 255, 0.14)',
                  color: variable === 'temperature' ? '#FFFFFF' : '#F1F5F9',
                  border: variable === 'temperature' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.28)',
                  fontWeight: variable === 'temperature' ? 700 : 500,
                  boxShadow: variable === 'temperature' ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none'
                }}
                onClick={() => setVariable('temperature')}
              >
                <Thermometer size={13} color={variable === 'temperature' ? '#FFFFFF' : '#FCA5A5'} />
                <span>Temperature</span>
              </button>
              <button
                type="button"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.4rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: variable === 'wind' ? '#2563EB' : 'rgba(255, 255, 255, 0.14)',
                  color: variable === 'wind' ? '#FFFFFF' : '#F1F5F9',
                  border: variable === 'wind' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.28)',
                  fontWeight: variable === 'wind' ? 700 : 500,
                  boxShadow: variable === 'wind' ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none'
                }}
                onClick={() => setVariable('wind')}
              >
                <Wind size={13} color={variable === 'wind' ? '#FFFFFF' : '#A7F3D0'} />
                <span>Wind</span>
              </button>
            </div>

            {/* Dynamic Preview for Selected Variable */}
            <div style={{ background: '#04101D', borderRadius: 'var(--radius-sm)', padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {variable === 'rainfall' ? 'Blended Rainfall Forecast' : variable === 'temperature' ? 'Blended 2m Temperature' : 'Blended 10m Wind Speed'}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
                  Next 72 hours (India Domain) &bull; GBDT Softmax Blend
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: variable === 'rainfall' ? '#60A5FA' : variable === 'temperature' ? '#F87171' : '#34D399', marginTop: '0.3rem' }}>
                  {variable === 'rainfall' ? '78 mm / 24h peak' : variable === 'temperature' ? '32.4 °C Mean (44.6 °C Peak)' : '28 km/h Mean (88 km/h Gusts)'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>
                  {variable === 'rainfall' ? 'Coastal Inundation Risk in Konkan & Goa' : variable === 'temperature' ? 'Pre-Monsoon Heatwave in Vidarbha / Central India' : 'Gale Wind Warning along Bay of Bengal'}
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '95px' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3px' }}>
                  {variable === 'rainfall' ? 'Rainfall Scale' : variable === 'temperature' ? 'Temp Scale' : 'Wind Scale'}
                </div>
                <div style={{ 
                  width: '85px', 
                  height: '7px', 
                  borderRadius: '3px', 
                  background: variable === 'rainfall' 
                    ? 'linear-gradient(90deg, #0284C7 0%, #10B981 30%, #F59E0B 60%, #EF4444 100%)' 
                    : variable === 'temperature' 
                    ? 'linear-gradient(90deg, #3B82F6 0%, #10B981 30%, #F59E0B 60%, #DC2626 100%)' 
                    : 'linear-gradient(90deg, #06B6D4 0%, #3B82F6 40%, #8B5CF6 70%, #EC4899 100%)' 
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                  <span>{variable === 'rainfall' ? '0mm' : variable === 'temperature' ? '15°C' : '0km/h'}</span>
                  <span>{variable === 'rainfall' ? '200mm+' : variable === 'temperature' ? '48°C' : '100+'}</span>
                </div>
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
                gap: '0.35rem',
                transition: 'background 0.15s ease'
              }}
            >
              <span>Explore {variable === 'rainfall' ? 'Rainfall' : variable === 'temperature' ? 'Temperature' : 'Wind'} on Interactive Map</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* 4 Feature Pills on Banner */}
        <div className="hero-feature-pills">
          <div 
            className="hero-feature-pill" 
            onClick={() => navigateTo('about')}
            style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
            title="Inspect Upstream Models & Data Pipeline"
          >
            <div className="hero-feature-icon"><Layers size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>Multi-Model Integration</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>NWP, Ensemble &amp; AI models →</div>
            </div>
          </div>

          <div 
            className="hero-feature-pill" 
            onClick={() => navigateTo('model-blending')}
            style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
            title="Inspect Spatial Weights &amp; Run Live Meta-Model Inference"
          >
            <div className="hero-feature-icon"><Sliders size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>Adaptive Blending</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>Region, lead time &amp; regime aware →</div>
            </div>
          </div>

          <div 
            className="hero-feature-pill" 
            onClick={() => navigateTo('scorecard')}
            style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
            title="Inspect 95% Bootstrap Confidence Intervals"
          >
            <div className="hero-feature-icon"><TrendingUp size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>Higher Forecast Skill</div>
              <div style={{ fontSize: '0.72rem', color: '#86EFAC', fontWeight: 600 }}>+9.5% Temp &bull; +52.6% Wind Gain →</div>
            </div>
          </div>

          <div 
            className="hero-feature-pill" 
            onClick={() => navigateTo('extreme-events')}
            style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
            title="Inspect Extreme Rain, Heatwave &amp; Gale Guidance"
          >
            <div className="hero-feature-icon"><ShieldAlert size={18} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>Extreme Weather Guidance</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>Heavy rainfall, heat &amp; gusts →</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Card 1: Skill Improvement */}
        <div className="col-span-3 stat-summary-card" onClick={() => navigateTo('scorecard')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Forecast Skill Improvement</span>
            <TrendingUp size={16} color="#15803D" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803D', margin: '0.4rem 0 0.1rem 0' }}>
            +9.5% Temp
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--color-muted)' }}>+52.6% Wind vs Pangu</span>
            <span style={{ color: '#15803D', background: '#DCFCE7', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 700 }}>95% CI Verified →</span>
          </div>
        </div>

        {/* Card 2: Temperature */}
        <div className="col-span-3 stat-summary-card" onClick={() => { setVariable('temperature'); navigateTo('forecast-explorer'); }} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Temperature (India Avg.)</span>
            <Thermometer size={16} color="#DC2626" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0.4rem 0 0.1rem 0' }}>
            32.4 °C
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--color-muted)' }}>Vidarbha / Central: 44.6°C</span>
            <span style={{ color: '#DC2626', background: '#FEE2E2', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 700 }}>Pre-Monsoon Heat</span>
          </div>
        </div>

        {/* Card 3: Rainfall */}
        <div className="col-span-3 stat-summary-card" onClick={() => { setVariable('rainfall'); navigateTo('forecast-explorer'); }} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Heavy Rainfall Alert</span>
            <CloudRain size={16} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2563EB', margin: '0.4rem 0 0.1rem 0' }}>
            14 Subdivisions
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--color-muted)' }}>Konkan &amp; Goa: 78 mm/24h</span>
            <span style={{ color: '#2563EB', background: '#DBEAFE', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 700 }}>Active Monsoon</span>
          </div>
        </div>

        {/* Card 4: Extreme Events */}
        <div className="col-span-3 stat-summary-card" onClick={() => navigateTo('extreme-events')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Extreme Weather Warnings</span>
            <ShieldAlert size={16} color="#D97706" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#D97706', margin: '0.4rem 0 0.1rem 0' }}>
            3 Active
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--color-muted)' }}>Coastal Surge &bull; Heatwave</span>
            <span style={{ color: '#D97706', background: '#FEF3C7', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 700 }}>Inspect Ladder →</span>
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
