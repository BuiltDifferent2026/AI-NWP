import React, { createContext, useContext, useState } from 'react';
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
  setTimelineStepHours: (hours: number) => void;
  isPlayingTimeline: boolean;
  setIsPlayingTimeline: (play: boolean) => void;
  navigateTo: (page: ActivePage, subdivId?: string, caseId?: string) => void;
}

const ForecastContext = createContext<ForecastContextValue | undefined>(undefined);

export const ForecastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leadTime, setLeadTime] = useState<LeadTimeOption>('day-3');
  const [variable, setVariable] = useState<VariableOption>('rainfall');
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedSubdivisionId, setSelectedSubdivisionId] = useState<string>('sub-23'); // Konkan & Goa default
  const [mapOverlayMode, setMapOverlayMode] = useState<MapOverlayMode>('weight');
  const [isOfflineDemo, setIsOfflineDemo] = useState<boolean>(true);
  const [selectedDuelCaseId, setSelectedDuelCaseId] = useState<string>('case-mumbai-2024');
  const [timelineStepHours, setTimelineStepHours] = useState<number>(72);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  const cycleTimestamp = '26 Sep 2026 | 12:00 UTC';

  const selectedSubdivision = SUBDIVISIONS_BY_ID.get(selectedSubdivisionId) || ALL_36_SUBDIVISIONS[22];

  const navigateTo = (page: ActivePage, subdivId?: string, caseId?: string) => {
    if (subdivId) {
      setSelectedSubdivisionId(subdivId);
    }
    if (caseId) {
      setSelectedDuelCaseId(caseId);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
