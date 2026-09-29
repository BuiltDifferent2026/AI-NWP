import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { IndiaEmblemSVG, NCMRWFLogoSVG } from './GovernmentEmblems';
import { Bell, User, Globe, ChevronDown, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    isOfflineDemo, 
    setIsOfflineDemo, 
    navigateTo,
    isMobileMenuOpen,
    toggleMobileMenu
  } = useForecast();

  return (
    <header className="gov-top-header">
      <div className="gov-top-inner">
        {/* Left: Mobile Hamburger Toggle + Emblem & Official Ministry / NCMRWF Branding */}
        <div className="gov-branding-left">
          {/* Mobile Navigation Menu Toggle */}
          <button
            type="button"
            className="header-mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            title="Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Government of India Emblem & Title */}
          <div 
            className="gov-brand-item brand-india" 
            onClick={() => navigateTo('home')}
            title="Ministry of Earth Sciences, Government of India"
          >
            <IndiaEmblemSVG size={30} />
            <div className="gov-brand-text">
              <span className="gov-brand-hindi">भारत सरकार</span>
              <span className="gov-brand-eng">MoES &bull; Govt. of India</span>
            </div>
          </div>

          <div className="gov-brand-divider" />

          {/* NCMRWF Official Center */}
          <div 
            className="gov-brand-item brand-ncmrwf"
            onClick={() => navigateTo('home')}
            title="National Centre for Medium Range Weather Forecasting"
          >
            <NCMRWFLogoSVG size={32} />
            <div className="gov-brand-text">
              <span className="gov-brand-title-primary">NCMRWF</span>
              <span className="gov-brand-subtitle">Weather Forecasting & Blending</span>
            </div>
          </div>
        </div>

        {/* Right: Search, Date/Time, Operational Badge, Notifications & Profile */}
        <div className="gov-header-right">
          {/* Cycle Timestamp - hidden on small mobile */}
          <div className="gov-cycle-info">
          </div>

          {/* Operational / Demo Mode Toggle Badge */}
          <button
            type="button"
            className="gov-status-toggle-badge"
            onClick={() => setIsOfflineDemo(!isOfflineDemo)}
            title="Toggle Live Assimilation Feed vs Cached Demo Data"
          >
            <span className="gov-status-pulse-dot" />
            <span className="gov-status-text">
              {isOfflineDemo ? 'Demo Mode' : 'Live Feed'}
            </span>
          </button>

          {/* Notification Bell */}
          <div 
            className="gov-notification-btn" 
            onClick={() => navigateTo('extreme-weather')} 
            title="2 Active Weather Alerts"
            role="button"
            tabIndex={0}
          >
            <Bell size={18} color="#475569" />
            <span className="gov-bell-badge">2</span>
          </div>

          {/* User Profile */}
          <div 
            className="gov-user-profile" 
            title="Duty Officer / Forecaster Account"
            role="button"
            tabIndex={0}
          >
            <div className="gov-user-avatar">
              <User size={15} />
            </div>
            <span className="gov-user-name">Duty Officer</span>
          </div>

          {/* Language Selector */}
          <div className="gov-lang-selector" title="Language selection">
            <Globe size={14} />
            <span className="gov-lang-text">EN</span>
            <ChevronDown size={12} />
          </div>
        </div>
      </div>
    </header>
  );
};
