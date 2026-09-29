import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { ALL_36_SUBDIVISIONS, IMDSubdivision } from '../data/imdSubdivisions';
import { MODEL_MAP } from '../data/models';
import { WEATHER_REGIMES } from '../data/regimes';
import { useForecast } from '../context/ForecastContext';
import { ArrowRight, AlertTriangle, Layers, Info, MapPin, Eye } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW51c2hrYW1hbGkyMDA1IiwiYSI6ImNtdWpsanoxYTFpdGoyd3BnMGZ4aDhtbjUifQ.6IjaULfuCqS1vAIcXdDs6A';

export const IndiaMap: React.FC = () => {
  const { 
    leadTime, 
    variable, 
    mapOverlayMode, 
    navigateTo, 
    selectedSubdivisionId, 
    setSelectedSubdivisionId,
    timelineStepHours,
    isPlayingTimeline
  } = useForecast();
  const [mapStyleMode, setMapStyleMode] = useState<'mapbox-satellite' | 'mapbox-dark' | 'vector-svg'>('mapbox-satellite');
  const [hoveredSubdiv, setHoveredSubdiv] = useState<IMDSubdivision | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapboxInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const stateKey = `${leadTime}_${variable}`;

  // Helper for confidence color ramp (Teal -> Blue -> Deep Navy)
  const getConfidenceColor = (spreadIndex: number): string => {
    if (spreadIndex < 0.32) return '#0D9488';
    if (spreadIndex < 0.48) return '#0284C7';
    if (spreadIndex < 0.62) return '#2563EB';
    return '#1E3A8A';
  };

  const getSubdivColor = (subdiv: IMDSubdivision): string => {
    const s = subdiv.states[stateKey] || subdiv.states['day-3_rainfall'];
    if (mapOverlayMode === 'weight') {
      if (s.isFallback) return '#64748B';
      const m = MODEL_MAP.get(s.trustedModelId);
      return m?.color || '#0B3D62';
    } else {
      return getConfidenceColor(s.disagreementSpreadIndex);
    }
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
      // Add subdivision markers on Mapbox
      renderMapboxMarkers(map);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.remove();
      mapboxInstanceRef.current = null;
    };
  }, [mapStyleMode]);

  // Update Mapbox markers on state change
  useEffect(() => {
    if (mapboxInstanceRef.current && mapboxInstanceRef.current.isStyleLoaded()) {
      renderMapboxMarkers(mapboxInstanceRef.current);
    }
  }, [leadTime, variable, mapOverlayMode, selectedSubdivisionId, timelineStepHours, isPlayingTimeline]);

  const renderMapboxMarkers = (map: mapboxgl.Map) => {
    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    ALL_36_SUBDIVISIONS.forEach((subdiv) => {
      const color = getSubdivColor(subdiv);
      const isSelected = subdiv.id === selectedSubdivisionId;
      const s = subdiv.states[stateKey] || subdiv.states['day-3_rainfall'];
      const regime = WEATHER_REGIMES[subdiv.currentRegimeId];
      const model = MODEL_MAP.get(s.trustedModelId);

      // Create Custom DOM Marker
      const el = document.createElement('div');
      el.className = 'custom-mapbox-subdiv-marker';
      el.style.width = isSelected ? '34px' : '26px';
      el.style.height = isSelected ? '34px' : '26px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = isSelected ? '3px solid #FFFFFF' : '2px solid rgba(255,255,255,0.9)';
      el.style.boxShadow = isSelected 
        ? '0 0 14px rgba(37,99,235,0.95), 0 2px 6px rgba(0,0,0,0.5)' 
        : isPlayingTimeline
        ? '0 0 8px rgba(96,165,250,0.7), 0 2px 4px rgba(0,0,0,0.35)'
        : '0 2px 4px rgba(0,0,0,0.35)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = '#FFFFFF';
      el.style.fontSize = isSelected ? '10px' : '8.5px';
      el.style.fontWeight = '700';
      el.style.transition = 'all 0.25s ease';
      el.innerText = subdiv.code.slice(0, 3);

      el.addEventListener('click', () => {
        setSelectedSubdivisionId(subdiv.id);
        navigateTo('explainability', subdiv.id);
      });

      // Mapbox Popup
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; color: #1F2933;">
          <div style="font-weight: 700; font-size: 13px; color: #0B3D62; margin-bottom: 2px;">
            ${subdiv.name} [${subdiv.code}]
          </div>
          <div style="font-size: 10px; color: #64748B; margin-bottom: 4px;">
            Horizon: <strong>+${timelineStepHours}h Lead</strong> &bull; Cycle: 26 Sep 12Z
          </div>
          <div style="font-size: 11px; margin-bottom: 4px;">
            <span style="background: ${regime?.badgeBg || '#1D4ED8'}; color: #FFF; padding: 1px 6px; border-radius: 9999px; font-weight: 600;">
              ${regime?.shortLabel}
            </span>
          </div>
          <div style="font-size: 11.5px; margin-bottom: 2px;">
            <strong>Trusted:</strong> ${model?.name || s.trustedModelId}
          </div>
          <div style="font-size: 11.5px; color: ${s.skillGainPercent >= 0 ? '#15803D' : '#DC2626'}; font-weight: 700;">
            Skill Gain: ${s.skillGainPercent >= 0 ? `+${s.skillGainPercent}%` : `${s.skillGainPercent}%`}
            <span style="font-size: 10px; color: #64748B; font-weight: 400;">[${s.skillGainCiLower}% to ${s.skillGainCiUpper}%]</span>
          </div>
          <div style="font-size: 10.5px; color: #2563EB; font-weight: 600; margin-top: 4px; text-align: right;">
            Click marker to inspect →
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
              const fillColor = getSubdivColor(subdiv);

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
                    fill={fillColor}
                    fillOpacity={isSelected ? 1.0 : 0.85}
                    stroke={isSelected ? '#0B3D62' : '#FFFFFF'}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    x={subdiv.mapCoords.cx}
                    y={subdiv.mapCoords.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#FFFFFF"
                    fontSize="11px"
                    fontWeight="700"
                    style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.85)', userSelect: 'none' }}
                  >
                    {subdiv.code}
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
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 400, marginLeft: '4px' }}>
                      [{state.skillGainCiLower}% to {state.skillGainCiUpper}%]
                    </span>
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Inter-model spread:</span>
                  <span style={{ fontWeight: 600, color: getConfidenceColor(state.disagreementSpreadIndex) }}>
                    {(state.disagreementSpreadIndex * 100).toFixed(0)}%
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--color-primary-light)', fontWeight: 600, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
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
