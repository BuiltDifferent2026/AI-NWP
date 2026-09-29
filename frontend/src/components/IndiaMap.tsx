import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { ALL_36_SUBDIVISIONS, IMDSubdivision } from '../data/imdSubdivisions';
import { MODEL_MAP } from '../data/models';
import { WEATHER_REGIMES } from '../data/regimes';
import { useForecast } from '../context/ForecastContext';
import { ArrowRight, AlertTriangle, Layers, Info, MapPin, Eye } from 'lucide-react';
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export interface IndiaMapProps {
  activeMapMode?: 'blend' | 'weights' | 'agreement' | 'confidence' | 'weight';
  selectedRosterModel?: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ 
  activeMapMode: propMapMode, 
  selectedRosterModel = 'all' 
}) => {
  const { 
    leadTime, 
    variable, 
    mapOverlayMode: contextMapMode, 
    navigateTo, 
    selectedSubdivisionId, 
    setSelectedSubdivisionId,
    timelineStepHours,
    isPlayingTimeline
  } = useForecast();

  // Active mode from prop or context (normalized)
  const rawMode = propMapMode || contextMapMode || 'blend';
  const effectiveMode: 'blend' | 'weights' | 'agreement' | 'confidence' = 
    rawMode === 'weight' ? 'weights' : rawMode;

  const [mapStyleMode, setMapStyleMode] = useState<'mapbox-satellite' | 'mapbox-dark' | 'vector-svg'>('mapbox-satellite');
  const [hoveredSubdiv, setHoveredSubdiv] = useState<IMDSubdivision | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapboxInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const stateKey = `${leadTime}_${variable}`;

  // Helper calculating dynamic layer visual attributes per subdivision
  const getSubdivisionVisuals = (subdiv: IMDSubdivision) => {
    const s = subdiv.states[stateKey] || subdiv.states['day-3_rainfall'];
    const zone = subdiv.zone;

    // 1. BLENDED FORECAST LAYER (Meteorological values)
    if (effectiveMode === 'blend') {
      if (variable === 'rainfall') {
        let base = 28;
        if (zone === 'Peninsula') base = 74;
        else if (zone === 'NorthEast') base = 68;
        else if (zone === 'Central' || zone === 'East') base = 35;
        else if (zone === 'NorthWest') base = 4;
        else if (zone === 'North') base = 18;

        const leadFactor = timelineStepHours <= 24 ? 0.8 : timelineStepHours <= 72 ? 1.0 : 1.25;
        const val = Math.round(base * leadFactor);

        let color = '#3B82F6'; // < 10mm (Blue)
        if (val >= 115.6) color = '#DC2626'; // Very Heavy (Red)
        else if (val >= 64.5) color = '#EA580C'; // Heavy (Orange)
        else if (val >= 35) color = '#F59E0B'; // Moderate-Heavy (Amber)
        else if (val >= 15) color = '#10B981'; // Moderate (Green)
        else if (val >= 5) color = '#06B6D4'; // Light (Cyan)

        return {
          color,
          badgeText: `${val}m`,
          fullText: `${val} mm`,
          title: `Blended Rainfall: ${val} mm`,
          metricName: 'Precipitation',
          metricVal: `${val} mm/24h`
        };
      } else if (variable === 'temperature') {
        let base = 32.5;
        if (zone === 'NorthWest') base = 41.2;
        else if (zone === 'Central') base = 37.4;
        else if (zone === 'Peninsula') base = 30.8;
        else if (zone === 'East') base = 33.6;
        else if (zone === 'NorthEast') base = 28.5;

        const val = Number((base + (timelineStepHours > 72 ? 1.2 : 0)).toFixed(1));

        let color = '#10B981';
        if (val >= 40.0) color = '#DC2626'; // Extreme Heat
        else if (val >= 36.0) color = '#F97316'; // High Heat
        else if (val >= 32.0) color = '#FBBF24'; // Warm
        else if (val >= 26.0) color = '#10B981'; // Moderate
        else color = '#0EA5E9'; // Cool

        return {
          color,
          badgeText: `${Math.round(val)}°`,
          fullText: `${val} °C`,
          title: `Blended Temp: ${val} °C`,
          metricName: '2m Temperature',
          metricVal: `${val} °C`
        };
      } else {
        // Wind speed
        let base = 21;
        if (zone === 'Peninsula' || zone === 'Islands') base = 32;
        else if (zone === 'East') base = 38;
        else if (zone === 'Central') base = 19;
        else if (zone === 'NorthWest') base = 16;
        else base = 14;

        const val = Math.round(base);

        let color = '#10B981';
        if (val >= 50) color = '#7C3AED'; // Squally / Gale
        else if (val >= 35) color = '#DC2626'; // Strong Wind
        else if (val >= 22) color = '#F59E0B'; // Moderate Breeze
        else color = '#10B981'; // Light

        return {
          color,
          badgeText: `${val}k`,
          fullText: `${val} km/h`,
          title: `Blended Wind: ${val} km/h`,
          metricName: '10m Wind Speed',
          metricVal: `${val} km/h`
        };
      }
    }

    // 2. SPATIAL MODEL WEIGHTS LAYER
    if (effectiveMode === 'weights') {
      const model = MODEL_MAP.get(s.trustedModelId);
      const isSpecific = selectedRosterModel && selectedRosterModel !== 'all';

      if (isSpecific) {
        // Find weight for the selected upstream model
        const matchWeight = s.modelWeights.find(w => 
          w.modelId.toLowerCase().includes(selectedRosterModel.toLowerCase()) ||
          selectedRosterModel.toLowerCase().includes(w.modelId.toLowerCase())
        );
        const share = matchWeight ? matchWeight.weight : 0.22;
        const pct = Math.round(share * 100);

        let color = '#93C5FD';
        if (pct >= 40) color = '#1E3A8A';
        else if (pct >= 30) color = '#2563EB';
        else if (pct >= 20) color = '#60A5FA';

        return {
          color,
          badgeText: `${pct}%`,
          fullText: `${pct}% Weight`,
          title: `${selectedRosterModel.toUpperCase()} Weight: ${pct}%`,
          metricName: 'Gating Weight',
          metricVal: `${pct}% Share`
        };
      } else {
        // Dominant model coloring
        const modelColor = s.isFallback ? '#64748B' : (model?.color || '#2563EB');
        const shortName = s.isFallback ? 'FALL' : (model?.name.split(' ')[0].slice(0, 4).toUpperCase() || subdiv.code.slice(0, 3));

        return {
          color: modelColor,
          badgeText: shortName,
          fullText: model?.name || s.trustedModelId,
          title: `Dominant Model: ${model?.name || s.trustedModelId}`,
          metricName: 'Dominant Model',
          metricVal: `${model?.name || s.trustedModelId} (Skill: +${s.skillGainPercent}%)`
        };
      }
    }

    // 3. MODEL AGREEMENT / SPREAD LAYER
    if (effectiveMode === 'agreement') {
      const spread = s.disagreementSpreadIndex;
      let color = '#10B981'; // High Agreement / Tight Consensus (< 0.32)
      let label = 'Consensus';
      let spreadVal = `±${(spread * 2.8).toFixed(1)}°`;

      if (variable === 'rainfall') {
        spreadVal = `±${Math.round(spread * 32)}mm`;
      } else if (variable === 'wind') {
        spreadVal = `±${Math.round(spread * 15)}k`;
      }

      if (spread >= 0.65) {
        color = '#EF4444'; // High Disagreement / Model Duel
        label = 'Model Duel';
      } else if (spread >= 0.45) {
        color = '#F59E0B'; // Moderate Divergence
        label = 'Divergent';
      } else if (spread >= 0.30) {
        color = '#3B82F6'; // Moderate Agreement
        label = 'Moderate';
      }

      return {
        color,
        badgeText: spreadVal,
        fullText: `${label} (${spreadVal})`,
        title: `Model Agreement: ${label} [Spread: ${(spread * 100).toFixed(0)}%]`,
        metricName: 'Spread & Consensus',
        metricVal: `${label} (Spread ${(spread * 100).toFixed(0)}%)`
      };
    }

    // 4. CONFIDENCE LEVEL LAYER
    const conf = Math.max(42, Math.min(96, Math.round(92 - s.disagreementSpreadIndex * 42)));
    let color = '#047857'; // >= 85% Very High
    let confLabel = 'Very High';

    if (conf < 55) {
      color = '#DC2626'; // Red Alert (<55%)
      confLabel = 'Uncertain';
    } else if (conf < 70) {
      color = '#D97706'; // Amber (55-69%)
      confLabel = 'Moderate';
    } else if (conf < 85) {
      color = '#0284C7'; // Blue (70-84%)
      confLabel = 'High';
    }

    return {
      color,
      badgeText: `${conf}%`,
      fullText: `${confLabel} (${conf}%)`,
      title: `Confidence: ${confLabel} (${conf}%)`,
      metricName: 'Confidence Rating',
      metricVal: `${conf}% (${confLabel})`
    };
  };

  const getSubdivColor = (subdiv: IMDSubdivision): string => {
    return getSubdivisionVisuals(subdiv).color;
  };

  // Initialize Mapbox GL Map
  useEffect(() => {
    if (mapStyleMode === 'vector-svg' || !mapContainerRef.current) {
      if (mapboxInstanceRef.current) {
        mapboxInstanceRef.current.remove();
        mapboxInstanceRef.current = null;
      }
      return;
    }

    if (!MAPBOX_TOKEN) {
      console.warn('Mapbox token is missing. Please define VITE_MAPBOX_TOKEN in your .env file.');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const styleUrl = mapStyleMode === 'mapbox-satellite'
      ? 'mapbox://styles/mapbox/satellite-streets-v12'
      : 'mapbox://styles/mapbox/dark-v11';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [78.9629, 22.5937], // Center of India
      zoom: 4.1,
      minZoom: 3.5,
      maxZoom: 9,
      attributionControl: false
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');

    mapboxInstanceRef.current = map;

    map.on('load', () => {
      renderMapboxMarkers(map);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.remove();
      mapboxInstanceRef.current = null;
    };
  }, [mapStyleMode]);

  // Update Mapbox markers on ANY state change including activeMapMode and selectedRosterModel
  useEffect(() => {
    if (mapboxInstanceRef.current && mapboxInstanceRef.current.isStyleLoaded()) {
      renderMapboxMarkers(mapboxInstanceRef.current);
    }
  }, [leadTime, variable, effectiveMode, selectedRosterModel, selectedSubdivisionId, timelineStepHours, isPlayingTimeline]);

  const renderMapboxMarkers = (map: mapboxgl.Map) => {
    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    ALL_36_SUBDIVISIONS.forEach((subdiv) => {
      const visuals = getSubdivisionVisuals(subdiv);
      const isSelected = subdiv.id === selectedSubdivisionId;
      const s = subdiv.states[stateKey] || subdiv.states['day-3_rainfall'];
      const regime = WEATHER_REGIMES[subdiv.currentRegimeId];
      const model = MODEL_MAP.get(s.trustedModelId);

      // Create Custom DOM Marker with responsive badge
      const el = document.createElement('div');
      el.className = 'custom-mapbox-subdiv-marker';
      el.style.width = isSelected ? '40px' : '32px';
      el.style.height = isSelected ? '40px' : '32px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = visuals.color;
      el.style.border = isSelected ? '3px solid #FFFFFF' : '2px solid rgba(255,255,255,0.92)';
      el.style.boxShadow = isSelected 
        ? '0 0 16px rgba(37,99,235,1), 0 3px 8px rgba(0,0,0,0.6)' 
        : '0 2px 5px rgba(0,0,0,0.45)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = '#FFFFFF';
      el.style.fontSize = isSelected ? '10.5px' : '9px';
      el.style.fontWeight = '800';
      el.style.letterSpacing = '-0.3px';
      el.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      el.innerText = visuals.badgeText;

      el.addEventListener('click', () => {
        setSelectedSubdivisionId(subdiv.id);
        navigateTo('explainability', subdiv.id);
      });

      // Layer-sensitive Mapbox Popup
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; color: #1F2933; min-width: 175px;">
          <div style="font-weight: 800; font-size: 13px; color: #0B3D62; margin-bottom: 2px;">
            ${subdiv.name} [${subdiv.code}]
          </div>
          <div style="font-size: 10.5px; color: #64748B; margin-bottom: 4px;">
            Horizon: <strong>+${timelineStepHours}h Lead</strong> &bull; Layer: <strong style="color: #2563EB; text-transform: capitalize;">${effectiveMode}</strong>
          </div>
          <div style="margin-bottom: 4px; padding: 4px 6px; background: #F8FAFC; border-radius: 4px; border-left: 3px solid ${visuals.color};">
            <div style="font-size: 10px; color: #64748B; text-transform: uppercase; font-weight: 700;">${visuals.metricName}</div>
            <div style="font-size: 13.5px; font-weight: 800; color: #0F172A;">${visuals.metricVal}</div>
          </div>
          <div style="font-size: 11px; margin-bottom: 3px;">
            <strong>Dominant Source:</strong> ${model?.name || s.trustedModelId}
          </div>
          <div style="font-size: 11px; color: ${s.skillGainPercent >= 0 ? '#15803D' : '#DC2626'}; font-weight: 700;">
            Skill Gain: ${s.skillGainPercent >= 0 ? `+${s.skillGainPercent}%` : `${s.skillGainPercent}%`}
          </div>
          <div style="font-size: 10px; color: #2563EB; font-weight: 600; margin-top: 4px; text-align: right;">
            Click to inspect feature weights →
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(popupHtml);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([subdiv.geoCenter.lng, subdiv.geoCenter.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      className="india-map-wrapper"
      style={{ position: 'relative', width: '100%', background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.85rem', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
    >
      {/* Map Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={14} color="var(--color-primary)" />
          <span>36 IMD Subdivisions &bull; Click marker or polygon to inspect feature attribution</span>
        </div>

        {/* Mapbox Basemap Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            className={`pill-btn ${mapStyleMode === 'mapbox-satellite' ? 'active' : ''}`}
            onClick={() => setMapStyleMode('mapbox-satellite')}
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
          >
            Mapbox Satellite
          </button>
          <button
            type="button"
            className={`pill-btn ${mapStyleMode === 'mapbox-dark' ? 'active' : ''}`}
            onClick={() => setMapStyleMode('mapbox-dark')}
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
          >
            Dark Weather
          </button>
          <button
            type="button"
            className={`pill-btn ${mapStyleMode === 'vector-svg' ? 'active' : ''}`}
            onClick={() => setMapStyleMode('vector-svg')}
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
          >
            Vector Topology
          </button>
        </div>
      </div>

      {/* Mapbox GL Map Container */}
      {mapStyleMode !== 'vector-svg' && (
        <div 
          ref={mapContainerRef} 
          style={{ width: '100%', height: '460px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}
        />
      )}

      {/* High-Performance SVG Vector Fallback Mode */}
      {mapStyleMode === 'vector-svg' && (
        <svg
          viewBox="50 30 850 830"
          style={{ width: '100%', height: 'auto', maxHeight: '480px', display: 'block' }}
          aria-label="Map of India IMD Subdivisions"
        >
          <defs>
            <filter id="subtle-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#0B3D62" floodOpacity="0.12" />
            </filter>
          </defs>

          <g id="subdivisions-layer">
            {ALL_36_SUBDIVISIONS.map((subdiv) => {
              const isSelected = subdiv.id === selectedSubdivisionId;
              const visuals = getSubdivisionVisuals(subdiv);

              return (
                <g 
                  key={subdiv.id}
                  onClick={() => {
                    setSelectedSubdivisionId(subdiv.id);
                    navigateTo('explainability', subdiv.id);
                  }}
                  onMouseEnter={() => setHoveredSubdiv(subdiv)}
                  onMouseLeave={() => setHoveredSubdiv(null)}
                >
                  <path
                    d={subdiv.mapCoords.path}
                    className="map-subdivision-path"
                    fill={visuals.color}
                    fillOpacity={isSelected ? 1.0 : 0.88}
                    stroke={isSelected ? '#0B3D62' : '#FFFFFF'}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    style={{ cursor: 'pointer', transition: 'fill 0.25s ease' }}
                  />
                  <text
                    x={subdiv.mapCoords.cx}
                    y={subdiv.mapCoords.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#FFFFFF"
                    fontSize="10px"
                    fontWeight="800"
                    style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.9)', userSelect: 'none' }}
                  >
                    {visuals.badgeText}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {/* Floating Hover Card (Vector Mode) */}
      {mapStyleMode === 'vector-svg' && hoveredSubdiv && (
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(mousePos.x + 15, 520)}px`,
            top: `${Math.min(mousePos.y - 40, 380)}px`,
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-elevated)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            width: '280px',
            pointerEvents: 'none',
            zIndex: 30,
            backdropFilter: 'blur(4px)'
          }}
        >
          {(() => {
            const state = hoveredSubdiv.states[stateKey] || hoveredSubdiv.states['day-3_rainfall'];
            const regime = WEATHER_REGIMES[hoveredSubdiv.currentRegimeId];
            const trustedModel = MODEL_MAP.get(state.trustedModelId);
            const visuals = getSubdivisionVisuals(hoveredSubdiv);

            return (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                    {hoveredSubdiv.name}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-muted)' }}>
                    [{hoveredSubdiv.code}]
                  </span>
                </div>

                <div style={{ margin: '0.4rem 0', padding: '0.35rem 0.5rem', background: '#F8FAFC', borderRadius: '4px', borderLeft: `3px solid ${visuals.color}` }}>
                  <div style={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    Active Layer: {effectiveMode}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                    {visuals.metricVal}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span
                    className="badge-regime"
                    style={{ backgroundColor: regime?.badgeBg || '#1D4ED8', fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
                  >
                    {regime?.shortLabel || 'Active Regime'}
                  </span>
                  {state.isFallback && (
                    <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.68rem', fontWeight: 600, padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
                      Fallback State
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Most Trusted Source: </span>
                  <strong>{trustedModel?.name || state.trustedModelId}</strong>
                </div>

                <div style={{ fontSize: '0.78rem', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Skill gain vs best single:</span>
                  <span style={{ fontWeight: 700, color: state.skillGainPercent >= 0 ? '#15803D' : '#B91C1C' }}>
                    {state.skillGainPercent >= 0 ? `+${state.skillGainPercent}%` : `${state.skillGainPercent}%`}
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--color-primary-light)', fontWeight: 600, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem', marginTop: '4px' }}>
                  <span>Click for full feature importance & duel</span>
                  <ArrowRight size={11} />
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
