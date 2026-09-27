export interface WeatherRegime {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  typicalSeason: string;
  dominantDynamics: string;
}

export const WEATHER_REGIMES: Record<string, WeatherRegime> = {
  'active-monsoon': {
    id: 'active-monsoon',
    name: 'Active Monsoon',
    shortLabel: 'Active Monsoon',
    description: 'Vigorous monsoon trough positioned over central India; heavy coastal and Ghat convergence, frequent depression genesis in Bay of Bengal.',
    badgeBg: '#1D4ED8', // Royal Blue
    badgeBorder: '#3B82F6',
    typicalSeason: 'Southwest Monsoon (Jun–Sep)',
    dominantDynamics: 'Strong low-level cross-equatorial jet (Findlater Jet) & deep convective heating'
  },
  'break-monsoon': {
    id: 'break-monsoon',
    name: 'Break Monsoon',
    shortLabel: 'Break Monsoon',
    description: 'Monsoon trough shifted northward to the Himalayan foothills; suppressed central/peninsular rainfall, heavy foothill orographic precipitation.',
    badgeBg: '#D97706', // Amber Gold
    badgeBorder: '#F59E0B',
    typicalSeason: 'Southwest Monsoon (Jul–Aug intra-seasonal)',
    dominantDynamics: 'Northward displaced ITCZ & anomalous anticyclone over central India'
  },
  'wd-winter': {
    id: 'wd-winter',
    name: 'Western-Disturbance-Affected Winter',
    shortLabel: 'WD Winter',
    description: 'Extratropical synoptic systems originating over Mediterranean embedding into subtropical westerlies; snow in Western Himalayas, rain & cold wave over NW plains.',
    badgeBg: '#0284C7', // Sky Icy Blue
    badgeBorder: '#38BDF8',
    typicalSeason: 'Winter / Early Spring (Dec–Mar)',
    dominantDynamics: 'Upper-tropospheric jet streaks and baroclinic instability'
  },
  'pre-heatwave': {
    id: 'pre-heatwave',
    name: 'Pre-Monsoon Heatwave',
    shortLabel: 'Pre-Monsoon Heat',
    description: 'Persistent anti-cyclonic sinking over NW/Central India with advection of hot dry northwesterly continental winds (Loo).',
    badgeBg: '#DC2626', // Crimson Flame
    badgeBorder: '#EF4444',
    typicalSeason: 'Pre-Monsoon / Summer (Apr–Jun)',
    dominantDynamics: 'Strong solar insolation, soil moisture deficit, low cloud cover'
  },
  'post-cyclone': {
    id: 'post-cyclone',
    name: 'Post-Monsoon Cyclone Influence',
    shortLabel: 'Cyclone Influence',
    description: 'Tropical cyclogenesis and depression propagation across Bay of Bengal / Arabian Sea impacting coastal subdivisions with gale winds and storm surges.',
    badgeBg: '#7C3AED', // Storm Purple
    badgeBorder: '#A78BFA',
    typicalSeason: 'Post-Monsoon (Oct–Dec)',
    dominantDynamics: 'High Ocean Heat Content (>26.5°C SST) and low vertical wind shear'
  },
  'climatology-baseline': {
    id: 'climatology-baseline',
    name: 'Normal / Climatological Baseline',
    shortLabel: 'Normal Baseline',
    description: 'Quasi-stationary climatological mean patterns with diurnal localized convective triggers without dominant synoptic forcing.',
    badgeBg: '#059669', // Emerald Baseline
    badgeBorder: '#10B981',
    typicalSeason: 'Transitional / Quiescent periods',
    dominantDynamics: 'Local thermodynamic instability & sea-breeze convergence'
  }
};
