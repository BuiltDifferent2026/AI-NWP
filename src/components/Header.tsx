import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { IndiaEmblemSVG, NCMRWFLogoSVG } from './GovernmentEmblems';
import { Bell, User, Search, Globe, ChevronDown, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { cycleTimestamp, isOfflineDemo, setIsOfflineDemo, navigateTo } = useForecast();

  return (
    <header className="gov-top-header">
      <div className="gov-top-inner">
        {/* Left: Emblem & Official Ministry / NCMRWF Branding */}
        <div className="gov-branding-left">
          {/* Government of India */}
          <div 
            className="gov-brand-item" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigateTo('home')}
            title="Ministry of Earth Sciences, Government of India"
          >
            <IndiaEmblemSVG size={32} />
            <div className="gov-brand-text">
              <span className="gov-brand-hindi">भारत सरकार</span>
              <span className="gov-brand-hindi">पृथ्वी विज्ञान मंत्रालय</span>
              <span className="gov-brand-eng">Government of India &bull; Ministry of Earth Sciences</span>
            </div>
          </div>

          <div style={{ width: '1px', height: '32px', background: 'var(--color-border)', margin: '0 0.5rem' }} />

          {/* NCMRWF Official Center */}
          <div 
            className="gov-brand-item"
            style={{ cursor: 'pointer' }}
            onClick={() => navigateTo('home')}
            title="National Centre for Medium Range Weather Forecasting"
          >
            <NCMRWFLogoSVG size={34} />
            <div className="gov-brand-text">
              <span className="gov-brand-hindi" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                राष्ट्रीय मध्यम अवधि मौसम पूर्वानुमान केंद्र (NCMRWF)
              </span>
              <span className="gov-brand-eng">
                National Centre for Medium Range Weather Forecasting
              </span>
            </div>
          </div>
        </div>

        {/* Right: Search, Date/Time, Operational Badge, Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Cycle Timestamp */}
          <div style={{ fontSize: '0.78rem', color: 'var(--color-ink)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{cycleTimestamp}</span>
            <span style={{ color: 'var(--color-muted)' }}>|</span>
            <button
              type="button"
              onClick={() => setIsOfflineDemo(!isOfflineDemo)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#15803D',
                background: '#DCFCE7',
                border: '1px solid #BBF7D0',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
              title="Toggle Live Assimilation Feed vs Cached Demo Data"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }}></span>
              <span>{isOfflineDemo ? 'Operational (Demo Proxy)' : 'Live NCMRWF Feed'}</span>
            </button>
          </div>

          {/* Notification Bell */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigateTo('extreme-weather')} title="2 Active Weather Alerts">
            <Bell size={18} color="#475569" />
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#DC2626', color: '#FFFFFF', fontSize: '9px', fontWeight: 700, width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              2
            </span>
          </div>

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', borderLeft: '1px solid var(--color-border)', paddingLeft: '0.75rem' }} title="Duty Officer / Forecaster Account">
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0B3D62', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={15} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-ink)' }}>
              Duty Officer
            </div>
          </div>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-muted)', cursor: 'pointer' }}>
            <Globe size={14} />
            <span>English</span>
            <ChevronDown size={12} />
          </div>
        </div>
      </div>
    </header>
  );
};
