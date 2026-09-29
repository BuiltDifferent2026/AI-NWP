import React from 'react';
import { useForecast } from './context/ForecastContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PageHomeHero } from './pages/PageHomeHero';
import { PageForecastExplorer } from './pages/PageForecastExplorer';
import { PageRegionDetail } from './pages/PageRegionDetail';
import { PageModelDuel } from './pages/PageModelDuel';
import { PageScorecard } from './pages/PageScorecard';
import { PageExtremeEvents } from './pages/PageExtremeEvents';
import { PageVerificationLab } from './pages/PageVerificationLab';
import { PageMethodology } from './pages/PageMethodology';

export const App: React.FC = () => {
  const { activePage, isMobileMenuOpen, closeMobileMenu } = useForecast();

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <PageHomeHero />;
      case 'forecast-explorer':
      case 'model-blending':
      case 'dashboard':
        return <PageForecastExplorer />;
      case 'explainability':
      case 'region-detail':
        return <PageRegionDetail />;
      case 'model-duel':
        return <PageModelDuel />;
      case 'verification-lab':
        return <PageVerificationLab />;
      case 'scorecard':
        return <PageScorecard />;
      case 'extreme-weather':
      case 'extreme-events':
        return <PageExtremeEvents />;
      case 'about':
      case 'methodology':
      case 'research':
      case 'data-products':
      case 'system-ops':
        return <PageMethodology />;
      default:
        return <PageHomeHero />;
    }
  };

  return (
    <div className="app-container">
      {/* Top Official Government Header */}
      <Header />

      {/* Main Body with Sidebar + Content */}
      <div className="app-body-layout">
        <Sidebar />
        
        {/* Backdrop for mobile navigation drawer */}
        <div 
          className={`sidebar-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={closeMobileMenu}
          aria-label="Close sidebar backdrop"
        />

        <main className="main-content">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};
