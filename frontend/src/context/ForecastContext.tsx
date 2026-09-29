import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ALL_36_SUBDIVISIONS, IMDSubdivision, SUBDIVISIONS_BY_ID } from '../data/imdSubdivisions';

export type LeadTimeOption = 'day-1' | 'day-3' | 'day-5' | 'day-7';
export type VariableOption = 'rainfall' | 'temperature' | 'wind' | 'extreme';
export type ActivePage = 
  | 'home'
  | 'forecast-explorer'
  | 'model-blending'
  | 'extreme-weather'
  | 'verification-lab'
  | 'explainability'
  | 'data-products'
  | 'system-ops'
  | 'research'
  | 'about'
  // Legacy aliases supported
  | 'dashboard'
  | 'region-detail'
  | 'model-duel'
  | 'scorecard'
  | 'extreme-events'
  | 'methodology';

export type MapOverlayMode = 'weight' | 'confidence';

const pathToPageMap: Record<string, ActivePage> = {
  '': 'home',
  '/': 'home',
  '/home': 'home',
  '/forecast-explorer': 'forecast-explorer',
  '/model-blending': 'forecast-explorer',
  '/dashboard': 'forecast-explorer',
  '/scorecard': 'scorecard',
  '/model-duel': 'model-duel',
  '/verification-lab': 'verification-lab',
  '/extreme-weather': 'extreme-weather',
  '/extreme-events': 'extreme-weather',
  '/system-ops': 'system-ops',
  '/explainability': 'explainability',
  '/region-detail': 'explainability',
  '/methodology': 'about',
  '/about': 'about',
  '/research': 'about',
  '/data-products': 'about',
};

const pageToPathMap: Record<ActivePage, string> = {
  'home': '/',
  'forecast-explorer': '/forecast-explorer',
  'model-blending': '/forecast-explorer',
  'dashboard': '/forecast-explorer',
  'scorecard': '/scorecard',
  'model-duel': '/model-duel',
  'verification-lab': '/verification-lab',
  'extreme-weather': '/extreme-weather',
  'extreme-events': '/extreme-weather',
  'system-ops': '/system-ops',
  'explainability': '/explainability',
  'region-detail': '/explainability',
  'about': '/methodology',
  'methodology': '/methodology',
  'research': '/methodology',
  'data-products': '/methodology',
};

const pageTitleMap: Record<ActivePage, string> = {
  'home': 'HyBlend — National Regime-Aware Multi-Model Blending System | MoES SIH26081',
  'forecast-explorer': 'Forecast & Blending Studio | HyBlend',
  'model-blending': 'Forecast & Blending Studio | HyBlend',
  'dashboard': 'Forecast & Blending Studio | HyBlend',
  'scorecard': 'Skill Scorecard (95% CI) | HyBlend',
  'model-duel': 'Model Duel Benchmark Cases | HyBlend',
  'verification-lab': 'Verification Lab & Metrics | HyBlend',
  'extreme-weather': 'Extreme Weather Guidance | HyBlend',
  'extreme-events': 'Extreme Weather Guidance | HyBlend',
  'system-ops': 'System Operations & API Telemetry | HyBlend',
  'explainability': 'Subdivision Explainability | HyBlend',
  'region-detail': 'Subdivision Explainability | HyBlend',
  'about': 'Methodology & Scientific Framework | HyBlend',
  'methodology': 'Methodology & Scientific Framework | HyBlend',
  'research': 'Methodology & Scientific Framework | HyBlend',
  'data-products': 'Methodology & Scientific Framework | HyBlend',
};

const parseLocation = (): { page: ActivePage; subdivId?: string; caseId?: string } => {
  if (typeof window === 'undefined') return { page: 'home' };
  
  let path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (window.location.hash) {
    const hashClean = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hashClean && pathToPageMap['/' + hashClean]) {
      path = '/' + hashClean;
    }
  }

  const page = pathToPageMap[path] || 'home';
  const searchParams = new URLSearchParams(window.location.search);
  const subdivId = searchParams.get('subdivision') || undefined;
  const caseId = searchParams.get('case') || undefined;

  return { page, subdivId, caseId };
};

interface ForecastContextValue {
  leadTime: LeadTimeOption;
  setLeadTime: (lt: LeadTimeOption) => void;
  variable: VariableOption;
  setVariable: (v: VariableOption) => void;
  activePage: ActivePage;
  setActivePage: (p: ActivePage) => void;
  selectedSubdivisionId: string;
  setSelectedSubdivisionId: (id: string) => void;
  selectedSubdivision: IMDSubdivision;
  mapOverlayMode: MapOverlayMode;
  setMapOverlayMode: (mode: MapOverlayMode) => void;
  isOfflineDemo: boolean;
  setIsOfflineDemo: (val: boolean) => void;
  cycleTimestamp: string;
  selectedDuelCaseId?: string;
  setSelectedDuelCaseId: (id: string) => void;
  timelineStepHours: number;
  setTimelineStepHours: React.Dispatch<React.SetStateAction<number>>;
  isPlayingTimeline: boolean;
  setIsPlayingTimeline: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  navigateTo: (page: ActivePage, subdivId?: string, caseId?: string) => void;
}

const ForecastContext = createContext<ForecastContextValue | undefined>(undefined);

export const ForecastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state directly from URL
  const initialLoc = parseLocation();

  const [leadTime, setLeadTime] = useState<LeadTimeOption>('day-3');
  const [variable, setVariable] = useState<VariableOption>('rainfall');
  const [activePage, setActivePage] = useState<ActivePage>(initialLoc.page);
  const [selectedSubdivisionId, setSelectedSubdivisionId] = useState<string>(initialLoc.subdivId || 'sub-23'); // Konkan & Goa default
  const [mapOverlayMode, setMapOverlayMode] = useState<MapOverlayMode>('weight');
  const [isOfflineDemo, setIsOfflineDemo] = useState<boolean>(true);
  const [selectedDuelCaseId, setSelectedDuelCaseId] = useState<string>(initialLoc.caseId || 'case-mumbai-2024');
  const [timelineStepHours, setTimelineStepHours] = useState<number>(72);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const cycleTimestamp = '26 Sep 2026 | 12:00 UTC';

  const selectedSubdivision = SUBDIVISIONS_BY_ID.get(selectedSubdivisionId) || ALL_36_SUBDIVISIONS[22];

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigateTo = useCallback((page: ActivePage, subdivId?: string, caseId?: string) => {
    if (subdivId) {
      setSelectedSubdivisionId(subdivId);
    }
    if (caseId) {
      setSelectedDuelCaseId(caseId);
    }
    setActivePage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync browser URL and document title via HTML5 History API
    if (typeof window !== 'undefined') {
      const basePath = pageToPathMap[page] || '/';
      const params = new URLSearchParams();
      if (subdivId) params.set('subdivision', subdivId);
      if (caseId) params.set('case', caseId);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const newUrl = `${basePath}${queryString}`;

      if (window.location.pathname + window.location.search !== newUrl) {
        window.history.pushState({ page, subdivId, caseId }, '', newUrl);
      }

      document.title = pageTitleMap[page] || 'HyBlend — Multi-Model Forecast Blending System';
    }
  }, []);

  // Listen to browser Back and Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const { page, subdivId, caseId } = parseLocation();
      setActivePage(page);
      if (subdivId) setSelectedSubdivisionId(subdivId);
      if (caseId) setSelectedDuelCaseId(caseId);
      document.title = pageTitleMap[page] || 'HyBlend — Multi-Model Forecast Blending System';
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial title on load
    document.title = pageTitleMap[initialLoc.page] || 'HyBlend — Multi-Model Forecast Blending System';

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [initialLoc.page]);

  return (
    <ForecastContext.Provider
      value={{
        leadTime,
        setLeadTime,
        variable,
        setVariable,
        activePage,
        setActivePage,
        selectedSubdivisionId,
        setSelectedSubdivisionId,
        selectedSubdivision,
        mapOverlayMode,
        setMapOverlayMode,
        isOfflineDemo,
        setIsOfflineDemo,
        cycleTimestamp,
        selectedDuelCaseId,
        setSelectedDuelCaseId,
        timelineStepHours,
        setTimelineStepHours,
        isPlayingTimeline,
        setIsPlayingTimeline,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleSidebar,
        toggleMobileMenu,
        closeMobileMenu,
        navigateTo
      }}
    >
      {children}
    </ForecastContext.Provider>
  );
};

export const useForecast = (): ForecastContextValue => {
  const context = useContext(ForecastContext);
  if (!context) {
    throw new Error('useForecast must be used within a ForecastProvider');
  }
  return context;
};
