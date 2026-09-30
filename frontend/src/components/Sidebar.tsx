import React from 'react';
import { useForecast, ActivePage } from '../context/ForecastContext';
import {
  Home,
  AlertTriangle,
  BarChart3,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  Sliders,
  ShieldCheck,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activePage,
    navigateTo,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileMenuOpen,
    closeMobileMenu
  } = useForecast();

  // High-impact, purely operational meteorological navigation menu
  const menuItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home Overview', icon: <Home size={18} /> },
    { id: 'forecast-explorer', label: 'Forecast & Blending Studio', icon: <Sliders size={18} /> },
    { id: 'scorecard', label: 'Skill Scorecard', icon: <ShieldCheck size={18} /> },
    { id: 'model-duel', label: 'Model Duel Cases', icon: <Layers size={18} /> },
    { id: 'verification-lab', label: 'Verification Lab', icon: <BarChart3 size={18} /> },
    { id: 'extreme-weather', label: 'Extreme Weather Guidance', icon: <AlertTriangle size={18} /> },
    { id: 'about', label: 'Methodology & Research', icon: <BookOpen size={18} /> },
  ];

  return (
    <aside
      className={`sidebar-nav ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      aria-label="Main Navigation"
    >
      {/* Top Header / Toggle Bar */}
      <div className="sidebar-top-bar">
        {/* Mobile close button & brand header */}
        <div className="sidebar-mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} color="#4ADE80" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>
              VayuSangam Portal
            </span>
          </div>
          <button
            type="button"
            className="sidebar-close-mobile-btn"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Desktop Collapse / Expand Toggle Button */}
        <div className="sidebar-desktop-toggle-wrap">
          {!isSidebarCollapsed && (
            <span className="sidebar-section-title">Operational Navigation</span>
          )}
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Expand sidebar (Shift + S)" : "Collapse sidebar"}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Main Menu Links */}
      <div className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive =
            activePage === item.id ||
            ((activePage === 'dashboard' || activePage === 'model-blending' || activePage === 'explainability' || activePage === 'region-detail') && item.id === 'forecast-explorer') ||
            (activePage === 'extreme-events' && item.id === 'extreme-weather') ||
            ((activePage === 'methodology' || activePage === 'research' || activePage === 'data-products' || activePage === 'system-ops') && item.id === 'about');

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-link-btn ${isActive ? 'active' : ''}`}
              onClick={() => navigateTo(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
              {isActive && !isSidebarCollapsed && (
                <span className="sidebar-active-indicator" />
              )}
            </button>
          );
        })}
      </div>

      {/* Clean & Minimal Status Footer */}
      <div className="sidebar-footer-minimal">
        {isSidebarCollapsed ? (
          <div className="sidebar-footer-collapsed-dot" title="Operational • 26 Sep 2026, 12 UTC">
            <span className="sidebar-status-dot-pulse" />
          </div>
        ) : (
          <div className="sidebar-footer-expanded-clean">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="sidebar-status-dot-pulse" />
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#86EFAC', letterSpacing: '0.02em' }}>
                Operational
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              26 Sep, 12 UTC
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
