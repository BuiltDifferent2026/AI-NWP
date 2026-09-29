import React from 'react';
import { useForecast, ActivePage } from '../context/ForecastContext';
import { 
  Home, 
  CloudSun, 
  GitMerge, 
  AlertTriangle, 
  BarChart3, 
  HelpCircle, 
  Database, 
  Settings, 
  BookOpen, 
  Info,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, navigateTo, isOfflineDemo } = useForecast();

  const menuItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={17} /> },
    { id: 'forecast-explorer', label: 'Forecast & Blending', icon: <CloudSun size={17} /> },
    { id: 'extreme-weather', label: 'Extreme Weather', icon: <AlertTriangle size={17} /> },
    { id: 'verification-lab', label: 'Verification Lab', icon: <BarChart3 size={17} /> },
    { id: 'explainability', label: 'Why This Forecast?', icon: <HelpCircle size={17} /> },
    { id: 'data-products', label: 'Data & Products', icon: <Database size={17} /> },
    { id: 'system-ops', label: 'System & Operations', icon: <Settings size={17} /> },
    { id: 'research', label: 'Research', icon: <BookOpen size={17} /> },
    { id: 'about', label: 'About', icon: <Info size={17} /> },
  ];

  return (
    <aside className="sidebar-nav">
      <div className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = 
            activePage === item.id ||
            (activePage === 'dashboard' && item.id === 'forecast-explorer') ||
            (activePage === 'model-blending' && item.id === 'forecast-explorer') ||
            (activePage === 'region-detail' && item.id === 'explainability') ||
            (activePage === 'model-duel' && item.id === 'forecast-explorer') ||
            (activePage === 'scorecard' && item.id === 'verification-lab') ||
            (activePage === 'extreme-events' && item.id === 'extreme-weather') ||
            (activePage === 'methodology' && item.id === 'about');

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-link-btn ${isActive ? 'active' : ''}`}
              onClick={() => navigateTo(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* System Status Sidebar Footer Box */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: '#86EFAC', marginBottom: '0.35rem' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4ADE80' }}></span>
          <span>{isOfflineDemo ? 'Operational (Demo)' : 'All systems operational'}</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.2rem' }}>
          Latest Run: <strong style={{ color: '#FFFFFF' }}>26 Sep 2026, 12 UTC</strong>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '0.6rem' }}>
          Next Update: in 5 hrs
        </div>
        <button
          type="button"
          onClick={() => navigateTo('system-ops')}
          style={{
            width: '100%',
            padding: '0.4rem',
            fontSize: '0.75rem',
            color: '#FFFFFF',
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontWeight: 600,
            transition: 'background 0.15s ease'
          }}
        >
          <span>View System Details</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </aside>
  );
};
