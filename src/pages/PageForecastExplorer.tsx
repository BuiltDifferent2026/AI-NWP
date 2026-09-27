import React, { useState } from 'react';
import { useForecast } from '../context/ForecastContext';
import { IndiaMap } from '../components/IndiaMap';
import { MODEL_MAP } from '../data/models';
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
  Info
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

  const [activeLayer, setActiveLayer] = useState<'blend' | 'satellite' | 'agreement' | 'confidence'>('blend');
  const [pointTab, setPointTab] = useState<'rainfall' | 'temperature' | 'wind'>('rainfall');

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

  return (
    <div className="forecast-explorer-view">
      {/* 1. Header & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.2rem' }}>
            Home &gt; Forecast Explorer
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            Forecast Explorer
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
            Explore blended forecasts for India based on multiple NWP and AI models.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary-blue"
          onClick={() => navigateTo('model-blending')}
        >
          <Layers size={15} />
          <span>Compare Models</span>
        </button>
      </div>

      {/* 2. Main Workspace: Map with Layer Options (Col 8) + Point Forecast (Col 4) */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Left Map Panel */}
        <div className="col-span-8 card-standard" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-ink)' }}>
              Blended Rainfall Forecast (Next 72 Hours)
            </div>

            {/* Layer Filter Chips */}
            <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.72rem' }}>
              <button
                type="button"
                className={`pill-btn ${activeLayer === 'blend' ? 'active' : ''}`}
                onClick={() => setActiveLayer('blend')}
              >
                Blended Forecast
              </button>
              <button
                type="button"
                className={`pill-btn ${activeLayer === 'agreement' ? 'active' : ''}`}
                onClick={() => setActiveLayer('agreement')}
              >
                Model Agreement
              </button>
              <button
                type="button"
                className={`pill-btn ${activeLayer === 'confidence' ? 'active' : ''}`}
                onClick={() => setActiveLayer('confidence')}
              >
                Confidence
              </button>
            </div>
          </div>

          {/* Interactive Subdivision Map */}
          <div style={{ position: 'relative', flex: 1, minHeight: '460px' }}>
            <IndiaMap />

            {/* Rainfall Gradient Scale overlay */}
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
            </div>
          </div>

          {/* Timeline Scrubber matching mockups */}
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
              <div>Valid Time:</div>
              <strong style={{ color: 'var(--color-ink)' }}>29 Sep 2026, 12 UTC</strong>
            </div>
          </div>
        </div>

        {/* Right Point Forecast Panel */}
        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Point Forecast Card */}
          <div className="card-standard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 600 }}>Point Forecast</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {selectedSubdivision.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                  Centroid: {selectedSubdivision.mapCoords.cx}°E, {selectedSubdivision.mapCoords.cy}°N
                </div>
              </div>
              <Star size={16} color="var(--color-muted)" style={{ cursor: 'pointer' }} />
            </div>

            {/* Variable sub-tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '4px', marginBottom: '0.85rem' }}>
              <button
                type="button"
                className={`pill-btn ${pointTab === 'rainfall' ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '0.3rem' }}
                onClick={() => setPointTab('rainfall')}
              >
                Rainfall
              </button>
              <button
                type="button"
                className={`pill-btn ${pointTab === 'temperature' ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '0.3rem' }}
                onClick={() => setPointTab('temperature')}
              >
                Temperature
              </button>
              <button
                type="button"
                className={`pill-btn ${pointTab === 'wind' ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '0.3rem' }}
                onClick={() => setPointTab('wind')}
              >
                Wind
              </button>
            </div>

            {/* Headline forecast value */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                  78 mm
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                  Blended Forecast (next 72 hours)
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700, border: '1px solid #BBF7D0' }}>
                  Medium Confidence
                </span>
              </div>
            </div>

            {/* Secondary Point Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.72rem' }}>
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
                <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>West-Southwest</div>
              </div>
            </div>

            {/* Model Contribution for this point */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
                Model Contribution (This Location)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                    <span>NEPS-R (NCMRWF)</span>
                    <strong>36%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '36%', height: '100%', background: '#2563EB' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                    <span>NCUM-G (NCMRWF)</span>
                    <strong>28%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '28%', height: '100%', background: '#059669' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                    <span>ECMWF IFS</span>
                    <strong>18%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '18%', height: '100%', background: '#7C3AED' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                    <span>ECMWF AIFS</span>
                    <strong>10%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '10%', height: '100%', background: '#F59E0B' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Forecast Timeline Chart | Model Comparison Bar | Recent Runs */}
      <div className="grid-12">
        {/* Forecast Timeline */}
        <div className="col-span-5 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
              Forecast Timeline ({selectedSubdivision.name})
            </span>
            <button
              type="button"
              onClick={() => navigateTo('explainability', selectedSubdivision.id)}
              style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              View Full Timeline →
            </button>
          </div>

          <svg viewBox="0 0 420 150" style={{ width: '100%', height: 'auto' }}>
            <line x1="35" y1="20" x2="395" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="35" y1="65" x2="395" y2="65" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="35" y1="110" x2="395" y2="110" stroke="#94A3B8" strokeWidth="1" />

            <text x="30" y="24" textAnchor="end" fontSize="9" fill="#64748B">150</text>
            <text x="30" y="69" textAnchor="end" fontSize="9" fill="#64748B">75</text>
            <text x="30" y="114" textAnchor="end" fontSize="9" fill="#64748B">0</text>

            <text x="50" y="125" textAnchor="middle" fontSize="9" fill="#64748B">Now</text>
            <text x="120" y="125" textAnchor="middle" fontSize="9" fill="#64748B">+24h</text>
            <text x="190" y="125" textAnchor="middle" fontSize="9" fill="#64748B">+48h</text>
            <text x="260" y="125" textAnchor="middle" fontSize="9" fill="#2563EB" fontWeight="700">+72h</text>
            <text x="330" y="125" textAnchor="middle" fontSize="9" fill="#64748B">+96h</text>
            <text x="385" y="125" textAnchor="middle" fontSize="9" fill="#64748B">+120h</text>

            {/* P10 - P90 Uncertainty Shaded Band */}
            <polygon
              points="50,105 120,95 190,75 260,35 330,65 385,85 385,105 330,95 260,75 190,95 120,105 50,110"
              fill="#2563EB"
              fillOpacity="0.15"
            />

            {/* Mean Line */}
            <polyline
              points="50,108 120,100 190,85 260,55 330,80 385,95"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
            />
            <circle cx="260" cy="55" r="4" fill="#2563EB" />
          </svg>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '3px', background: '#2563EB' }}></span> Blended Forecast (Mean)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: '#2563EB', opacity: 0.2 }}></span> Forecast Range (P10–P90)
            </div>
          </div>
        </div>

        {/* Model Comparison Bar Chart */}
        <div className="col-span-4 card-standard">
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.75rem' }}>
            Model Comparison (Rainfall, mm)
          </span>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '120px', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB' }}>78</div>
              <div style={{ width: '28px', height: '65px', background: '#2563EB', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-ink)', fontWeight: 700, marginTop: '4px' }}>Blend</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#059669' }}>62</div>
              <div style={{ width: '28px', height: '52px', background: '#059669', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '4px' }}>NCUM</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#7C3AED' }}>105</div>
              <div style={{ width: '28px', height: '88px', background: '#7C3AED', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '4px' }}>NEPS</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#F59E0B' }}>58</div>
              <div style={{ width: '28px', height: '48px', background: '#F59E0B', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '4px' }}>IFS</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>46</div>
              <div style={{ width: '28px', height: '38px', background: '#64748B', borderRadius: '3px 3px 0 0', margin: '0 auto' }}></div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '4px' }}>GFS</div>
            </div>
          </div>
        </div>

        {/* Recent Forecast Runs */}
        <div className="col-span-3 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
              Recent Forecast Runs
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>UTC Cycles</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem', background: '#F0FDF4', borderRadius: '4px', border: '1px solid #DCFCE7' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#166534' }}>26 Sep, 12 UTC</div>
                <div style={{ fontSize: '0.68rem', color: '#15803D' }}>T+72h forecast available</div>
              </div>
              <span style={{ background: '#22C55E', color: '#FFFFFF', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                ● Latest
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem', background: '#F8FAFC', borderRadius: '4px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>26 Sep, 06 UTC</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>T+72h completed</div>
              </div>
              <CheckCircle2 size={13} color="#059669" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem', background: '#F8FAFC', borderRadius: '4px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>25 Sep, 12 UTC</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>Archived run</div>
              </div>
              <CheckCircle2 size={13} color="#059669" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
