import React from 'react';
import { useForecast } from './context/ForecastContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PageHomeHero } from './pages/PageHomeHero';
import { PageForecastExplorer } from './pages/PageForecastExplorer';
import { PageModelBlending } from './pages/PageModelBlending';
import { PageRegionDetail } from './pages/PageRegionDetail';
import { PageModelDuel } from './pages/PageModelDuel';
import { PageScorecard } from './pages/PageScorecard';
import { PageExtremeEvents } from './pages/PageExtremeEvents';
import { PageVerificationLab } from './pages/PageVerificationLab';
import { PageDataProducts } from './pages/PageDataProducts';
import { PageSystemOperations } from './pages/PageSystemOperations';
import { PageResearchDocs } from './pages/PageResearchDocs';
import { PageMethodology } from './pages/PageMethodology';

export const App: React.FC = () => {
  const { activePage } = useForecast();

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
      case 'data-products':
        return <PageDataProducts />;
      case 'system-ops':
        return <PageSystemOperations />;
      case 'research':
        return <PageResearchDocs />;
      case 'about':
      case 'methodology':
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
        <main className="main-content">
          {renderActivePage()}
        </main>
      </div>

      {/* Official Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border)', background: '#FFFFFF', padding: '0.75rem 1.5rem', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <strong>राष्ट्रीय मध्यम अवधि मौसम पूर्वानुमान केंद्र (NCMRWF)</strong> &bull; Ministry of Earth Sciences, Govt. of India &bull; Smart India Hackathon 2026 (SIH26081)
          </div>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-muted)' }}>
            <span>Verification: ERA5 + IMD 0.25° Truth</span>
            <span>Gating Engine: LightGBM Multi-Task Adaptive Regressor</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
