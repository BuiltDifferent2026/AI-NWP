export interface ModelSkillWeight {
  modelId: string;
  weight: number; // 0 to 1
  trailingError: number; // RMSE or CRPS
  ciLower: number;
  ciUpper: number;
}

export interface FeatureImportance {
  featureName: string;
  plainDescription: string;
  contributionPercent: number; // 0 to 100
}

export interface SubdivForecastState {
  trustedModelId: string;
  skillGainPercent: number;
  skillGainCiLower: number;
  skillGainCiUpper: number;
  disagreementSpreadIndex: number; // 0 (high agreement) to 1.0 (high spread)
  isFallback: boolean;
  fallbackReason?: string;
  fallbackModelId?: string;
  modelWeights: ModelSkillWeight[];
  featureImportance: FeatureImportance[];
  rollingHistory: { cycle: string; blendError: number; bestModelError: number; errorMetric: string }[];
  extremeRainProb: {
    heavy: number; // P(R24 >= 64.5mm) %
    veryHeavy: number; // P(R24 >= 115.6mm) %
    extreme: number; // P(R24 >= 204.5mm) %
  };
  heatwaveProb: number; // %
  damagingGustProb: number; // %
}

export interface IMDSubdivision {
  id: string;
  code: string;
  name: string;
  zone: 'North' | 'Central' | 'Peninsula' | 'East' | 'NorthEast' | 'NorthWest' | 'Islands';
  currentRegimeId: string;
  geoCenter: {
    lat: number;
    lng: number;
  };
  regimeTransitionAlert?: {
    fromRegimeId: string;
    toRegimeId: string;
    daysUntilTransition: number;
    synopticReason: string;
  };
  mapCoords: {
    cx: number;
    cy: number;
    path: string;
  };
  states: Record<string, SubdivForecastState>;
}

export const ALL_36_SUBDIVISIONS: IMDSubdivision[] = [
  {
    id: 'sub-1',
    code: 'ANI',
    name: 'Andaman & Nicobar Islands',
    zone: 'Islands',
    currentRegimeId: 'post-cyclone',
    geoCenter: { lat: 11.7401, lng: 92.6586 },
    mapCoords: { cx: 820, cy: 780, path: 'M 805,740 L 830,735 L 835,820 L 810,825 Z' },
    states: generateMockStates('sub-1', 'post-cyclone', false, 0.42, 14.8, 'ecmwf-ifs')
  },
  {
    id: 'sub-2',
    code: 'ARU',
    name: 'Arunachal Pradesh',
    zone: 'NorthEast',
    currentRegimeId: 'break-monsoon',
    geoCenter: { lat: 28.2180, lng: 94.7278 },
    mapCoords: { cx: 830, cy: 280, path: 'M 780,240 L 860,250 L 880,310 L 800,310 Z' },
    states: generateMockStates('sub-2', 'break-monsoon', false, 0.38, 16.5, 'neps-r')
  },
  {
    id: 'sub-3',
    code: 'ASM',
    name: 'Assam & Meghalaya',
    zone: 'NorthEast',
    currentRegimeId: 'break-monsoon',
    geoCenter: { lat: 26.2006, lng: 92.9376 },
    regimeTransitionAlert: {
      fromRegimeId: 'break-monsoon',
      toRegimeId: 'active-monsoon',
      daysUntilTransition: 3,
      synopticReason: 'Monsoon trough expected to shift southwards toward central India in 72 hours.'
    },
    mapCoords: { cx: 780, cy: 350, path: 'M 740,320 L 820,320 L 810,380 L 730,370 Z' },
    states: generateMockStates('sub-3', 'break-monsoon', false, 0.55, 18.2, 'neps-r')
  },
  {
    id: 'sub-4',
    code: 'NMMT',
    name: 'Nagaland, Manipur, Mizoram & Tripura',
    zone: 'NorthEast',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 24.6637, lng: 93.9063 },
    mapCoords: { cx: 820, cy: 420, path: 'M 790,370 L 840,380 L 830,470 L 780,450 Z' },
    states: generateMockStates('sub-4', 'active-monsoon', false, 0.32, 13.4, 'ecmwf-ifs')
  },
  {
    id: 'sub-5',
    code: 'SHWB',
    name: 'Sub-Himalayan West Bengal & Sikkim',
    zone: 'East',
    currentRegimeId: 'break-monsoon',
    geoCenter: { lat: 26.8500, lng: 88.5000 },
    mapCoords: { cx: 710, cy: 330, path: 'M 690,290 L 735,295 L 725,370 L 685,360 Z' },
    states: generateMockStates('sub-5', 'break-monsoon', false, 0.48, 15.6, 'mithuna-fs')
  },
  {
    id: 'sub-6',
    code: 'GWB',
    name: 'Gangetic West Bengal',
    zone: 'East',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 22.9868, lng: 87.8550 },
    mapCoords: { cx: 690, cy: 450, path: 'M 660,400 L 725,410 L 715,490 L 660,480 Z' },
    states: generateMockStates('sub-6', 'active-monsoon', false, 0.28, 19.4, 'mithuna-fs')
  },
  {
    id: 'sub-7',
    code: 'ODI',
    name: 'Odisha',
    zone: 'East',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 20.9517, lng: 85.0985 },
    mapCoords: { cx: 620, cy: 530, path: 'M 580,480 L 670,490 L 645,590 L 570,560 Z' },
    states: generateMockStates('sub-7', 'active-monsoon', false, 0.35, 21.0, 'mithuna-fs')
  },
  {
    id: 'sub-8',
    code: 'JHK',
    name: 'Jharkhand',
    zone: 'East',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 23.6102, lng: 85.2799 },
    mapCoords: { cx: 600, cy: 440, path: 'M 560,400 L 645,410 L 635,480 L 550,470 Z' },
    states: generateMockStates('sub-8', 'active-monsoon', false, 0.29, 14.1, 'graphcast')
  },
  {
    id: 'sub-9',
    code: 'BIH',
    name: 'Bihar',
    zone: 'East',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 25.0961, lng: 85.3131 },
    mapCoords: { cx: 590, cy: 360, path: 'M 540,320 L 670,330 L 640,400 L 535,390 Z' },
    states: generateMockStates('sub-9', 'active-monsoon', false, 0.31, 15.3, 'ecmwf-ifs')
  },
  {
    id: 'sub-10',
    code: 'EUP',
    name: 'East Uttar Pradesh',
    zone: 'Central',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 26.7606, lng: 82.1430 },
    mapCoords: { cx: 490, cy: 370, path: 'M 440,320 L 540,330 L 530,420 L 440,410 Z' },
    states: generateMockStates('sub-10', 'active-monsoon', false, 0.26, 17.8, 'mithuna-fs')
  },
  {
    id: 'sub-11',
    code: 'WUP',
    name: 'West Uttar Pradesh',
    zone: 'Central',
    currentRegimeId: 'climatology-baseline',
    geoCenter: { lat: 28.2076, lng: 79.8267 },
    mapCoords: { cx: 390, cy: 330, path: 'M 350,280 L 440,290 L 430,370 L 340,360 Z' },
    states: generateMockStates('sub-11', 'climatology-baseline', false, 0.22, 13.9, 'graphcast')
  },
  {
    id: 'sub-12',
    code: 'UTK',
    name: 'Uttarakhand',
    zone: 'North',
    currentRegimeId: 'wd-winter',
    geoCenter: { lat: 30.0668, lng: 79.0193 },
    mapCoords: { cx: 410, cy: 250, path: 'M 380,210 L 450,225 L 435,285 L 375,275 Z' },
    states: generateMockStates('sub-12', 'wd-winter', false, 0.44, 16.7, 'neps-r')
  },
  {
    id: 'sub-13',
    code: 'HCD',
    name: 'Haryana, Chandigarh & Delhi',
    zone: 'NorthWest',
    currentRegimeId: 'climatology-baseline',
    geoCenter: { lat: 29.0588, lng: 76.0856 },
    mapCoords: { cx: 330, cy: 295, path: 'M 300,260 L 355,265 L 345,335 L 295,325 Z' },
    states: generateMockStates('sub-13', 'climatology-baseline', false, 0.19, 14.5, 'pangu-weather')
  },
  {
    id: 'sub-14',
    code: 'PUN',
    name: 'Punjab',
    zone: 'NorthWest',
    currentRegimeId: 'wd-winter',
    geoCenter: { lat: 31.1471, lng: 75.3412 },
    mapCoords: { cx: 290, cy: 240, path: 'M 260,205 L 325,215 L 315,280 L 255,270 Z' },
    states: generateMockStates('sub-14', 'wd-winter', false, 0.25, 12.8, 'ecmwf-ifs')
  },
  {
    id: 'sub-15',
    code: 'HMP',
    name: 'Himachal Pradesh',
    zone: 'North',
    currentRegimeId: 'wd-winter',
    geoCenter: { lat: 31.1048, lng: 77.1734 },
    mapCoords: { cx: 340, cy: 190, path: 'M 310,150 L 380,165 L 370,230 L 305,215 Z' },
    states: generateMockStates('sub-15', 'wd-winter', false, 0.52, 17.1, 'neps-r')
  },
  {
    id: 'sub-16',
    code: 'JKL',
    name: 'Jammu & Kashmir and Ladakh',
    zone: 'North',
    currentRegimeId: 'wd-winter',
    geoCenter: { lat: 33.7782, lng: 76.5762 },
    mapCoords: { cx: 310, cy: 110, path: 'M 250,50 L 410,70 L 380,160 L 240,140 Z' },
    states: generateMockStates('sub-16', 'wd-winter', false, 0.58, 18.9, 'neps-r')
  },
  {
    id: 'sub-17',
    code: 'WRAJ',
    name: 'West Rajasthan',
    zone: 'NorthWest',
    currentRegimeId: 'pre-heatwave',
    geoCenter: { lat: 26.9124, lng: 71.9000 },
    regimeTransitionAlert: {
      fromRegimeId: 'pre-heatwave',
      toRegimeId: 'climatology-baseline',
      daysUntilTransition: 4,
      synopticReason: 'Western Disturbance moisture incursion will abate severe heatwave in 4 days.'
    },
    mapCoords: { cx: 200, cy: 330, path: 'M 130,270 L 260,280 L 250,410 L 130,380 Z' },
    states: generateMockStates('sub-17', 'pre-heatwave', false, 0.21, 15.8, 'gfs')
  },
  {
    id: 'sub-18',
    code: 'ERAJ',
    name: 'East Rajasthan',
    zone: 'NorthWest',
    currentRegimeId: 'climatology-baseline',
    geoCenter: { lat: 26.5000, lng: 75.8000 },
    mapCoords: { cx: 290, cy: 370, path: 'M 250,320 L 340,330 L 330,430 L 240,420 Z' },
    states: generateMockStates('sub-18', 'climatology-baseline', false, 0.24, 13.2, 'pangu-weather')
  },
  {
    id: 'sub-19',
    code: 'WMP',
    name: 'West Madhya Pradesh',
    zone: 'Central',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 23.2599, lng: 76.5000 },
    mapCoords: { cx: 370, cy: 445, path: 'M 320,400 L 430,410 L 415,500 L 310,490 Z' },
    states: generateMockStates('sub-19', 'active-monsoon', false, 0.33, 16.4, 'mithuna-fs')
  },
  {
    id: 'sub-20',
    code: 'EMP',
    name: 'East Madhya Pradesh',
    zone: 'Central',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 23.5000, lng: 80.5000 },
    mapCoords: { cx: 480, cy: 460, path: 'M 430,415 L 540,425 L 525,510 L 420,500 Z' },
    states: generateMockStates('sub-20', 'active-monsoon', false, 0.31, 17.2, 'mithuna-fs')
  },
  {
    id: 'sub-21',
    code: 'GUJ',
    name: 'Gujarat Region, Dadra & Nagar Haveli',
    zone: 'NorthWest',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 22.2587, lng: 72.8500 },
    mapCoords: { cx: 240, cy: 470, path: 'M 200,430 L 285,440 L 275,520 L 195,510 Z' },
    states: generateMockStates('sub-21', 'active-monsoon', false, 0.37, 14.8, 'ecmwf-ifs')
  },
  {
    id: 'sub-22',
    code: 'SAUK',
    name: 'Saurashtra & Kutch',
    zone: 'NorthWest',
    currentRegimeId: 'climatology-baseline',
    geoCenter: { lat: 22.5000, lng: 69.8000 },
    mapCoords: { cx: 140, cy: 450, path: 'M 70,410 L 200,420 L 190,500 L 80,490 Z' },
    states: generateMockStates('sub-22', 'climatology-baseline', false, 0.29, 12.1, 'gfs', { forceFallbackOnDay5: true })
  },
  {
    id: 'sub-23',
    code: 'KNG',
    name: 'Konkan & Goa',
    zone: 'Peninsula',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 18.9750, lng: 72.8258 },
    regimeTransitionAlert: {
      fromRegimeId: 'active-monsoon',
      toRegimeId: 'break-monsoon',
      daysUntilTransition: 3,
      synopticReason: 'Offshore trough along Maharashtra-Goa coast weakening; active spell transitioning to break phase.'
    },
    mapCoords: { cx: 240, cy: 580, path: 'M 215,515 L 265,520 L 255,670 L 210,660 Z' },
    states: generateMockStates('sub-23', 'active-monsoon', true, 0.64, -3.1, 'graphcast', {
      fallbackReason: 'Blend underperforms GraphCast by 3.1% in high-orographic coastal regime — falling back to GraphCast.',
      fallbackModelId: 'graphcast'
    })
  },
  {
    id: 'sub-24',
    code: 'MMH',
    name: 'Madhya Maharashtra',
    zone: 'Peninsula',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 18.5204, lng: 74.8567 },
    mapCoords: { cx: 300, cy: 560, path: 'M 265,510 L 340,520 L 330,620 L 260,610 Z' },
    states: generateMockStates('sub-24', 'active-monsoon', false, 0.34, 15.2, 'neps-r')
  },
  {
    id: 'sub-25',
    code: 'MAR',
    name: 'Marathwada',
    zone: 'Peninsula',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 19.8762, lng: 76.3382 },
    mapCoords: { cx: 370, cy: 560, path: 'M 335,515 L 415,525 L 405,605 L 330,595 Z' },
    states: generateMockStates('sub-25', 'active-monsoon', false, 0.27, 14.3, 'ecmwf-aifs')
  },
  {
    id: 'sub-26',
    code: 'VID',
    name: 'Vidarbha',
    zone: 'Central',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 21.1458, lng: 79.0882 },
    mapCoords: { cx: 440, cy: 535, path: 'M 395,490 L 490,500 L 480,575 L 390,565 Z' },
    states: generateMockStates('sub-26', 'active-monsoon', false, 0.32, 17.5, 'mithuna-fs')
  },
  {
    id: 'sub-27',
    code: 'CHH',
    name: 'Chhattisgarh',
    zone: 'Central',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 21.2787, lng: 81.8661 },
    mapCoords: { cx: 520, cy: 530, path: 'M 480,470 L 555,480 L 540,600 L 475,590 Z' },
    states: generateMockStates('sub-27', 'active-monsoon', false, 0.30, 18.0, 'mithuna-fs')
  },
  {
    id: 'sub-28',
    code: 'CAP',
    name: 'Coastal Andhra Pradesh & Yanam',
    zone: 'Peninsula',
    currentRegimeId: 'post-cyclone',
    geoCenter: { lat: 16.5062, lng: 81.5000 },
    regimeTransitionAlert: {
      fromRegimeId: 'post-cyclone',
      toRegimeId: 'climatology-baseline',
      daysUntilTransition: 2,
      synopticReason: 'Depression making landfall near Kalingapatnam and recurving NE; coastal gale winds subsiding.'
    },
    mapCoords: { cx: 500, cy: 640, path: 'M 460,590 L 565,600 L 515,710 L 435,700 Z' },
    states: generateMockStates('sub-28', 'post-cyclone', false, 0.49, 19.8, 'ecmwf-ifs')
  },
  {
    id: 'sub-29',
    code: 'TEL',
    name: 'Telangana',
    zone: 'Peninsula',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 17.3850, lng: 78.4867 },
    mapCoords: { cx: 430, cy: 605, path: 'M 390,565 L 480,575 L 465,665 L 380,655 Z' },
    states: generateMockStates('sub-29', 'active-monsoon', false, 0.28, 16.1, 'mithuna-fs')
  },
  {
    id: 'sub-30',
    code: 'RAY',
    name: 'Rayalaseema',
    zone: 'Peninsula',
    currentRegimeId: 'climatology-baseline',
    geoCenter: { lat: 14.6819, lng: 77.6006 },
    mapCoords: { cx: 410, cy: 685, path: 'M 370,645 L 460,655 L 445,735 L 360,725 Z' },
    states: generateMockStates('sub-30', 'climatology-baseline', false, 0.23, 13.5, 'graphcast')
  },
  {
    id: 'sub-31',
    code: 'TNP',
    name: 'Tamil Nadu, Puducherry & Karaikal',
    zone: 'Peninsula',
    currentRegimeId: 'post-cyclone',
    geoCenter: { lat: 11.1271, lng: 78.6569 },
    mapCoords: { cx: 420, cy: 770, path: 'M 370,725 L 475,735 L 440,845 L 360,835 Z' },
    states: generateMockStates('sub-31', 'post-cyclone', false, 0.45, 18.7, 'ecmwf-ifs')
  },
  {
    id: 'sub-32',
    code: 'CKAR',
    name: 'Coastal Karnataka',
    zone: 'Peninsula',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 13.5000, lng: 74.8500 },
    mapCoords: { cx: 290, cy: 675, path: 'M 265,620 L 310,625 L 295,730 L 260,725 Z' },
    states: generateMockStates('sub-32', 'active-monsoon', false, 0.57, 17.9, 'neps-r')
  },
  {
    id: 'sub-33',
    code: 'NIK',
    name: 'North Interior Karnataka',
    zone: 'Peninsula',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 15.5000, lng: 75.8000 },
    mapCoords: { cx: 340, cy: 645, path: 'M 305,605 L 385,615 L 375,695 L 300,685 Z' },
    states: generateMockStates('sub-33', 'active-monsoon', false, 0.26, 15.0, 'graphcast')
  },
  {
    id: 'sub-34',
    code: 'SIK',
    name: 'South Interior Karnataka',
    zone: 'Peninsula',
    currentRegimeId: 'climatology-baseline',
    geoCenter: { lat: 12.9716, lng: 76.8000 },
    mapCoords: { cx: 350, cy: 720, path: 'M 310,685 L 390,695 L 375,775 L 305,765 Z' },
    states: generateMockStates('sub-34', 'climatology-baseline', false, 0.29, 14.4, 'ecmwf-aifs')
  },
  {
    id: 'sub-35',
    code: 'KER',
    name: 'Kerala & Mahe',
    zone: 'Peninsula',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 10.8505, lng: 76.2711 },
    mapCoords: { cx: 320, cy: 800, path: 'M 295,745 L 340,750 L 330,855 L 290,850 Z' },
    states: generateMockStates('sub-35', 'active-monsoon', false, 0.61, 16.8, 'neps-r')
  },
  {
    id: 'sub-36',
    code: 'LAK',
    name: 'Lakshadweep',
    zone: 'Islands',
    currentRegimeId: 'active-monsoon',
    geoCenter: { lat: 10.5667, lng: 72.6417 },
    mapCoords: { cx: 210, cy: 790, path: 'M 195,760 L 225,755 L 220,830 L 190,825 Z' },
    states: generateMockStates('sub-36', 'active-monsoon', false, 0.35, 12.7, 'ecmwf-ifs')
  }
];

function generateMockStates(
  subdivId: string,
  regime: string,
  forceFallbackDay3: boolean,
  baseDisagreement: number,
  baseSkillGain: number,
  primaryModel: string,
  options?: {
    forceFallbackOnDay5?: boolean;
    fallbackReason?: string;
    fallbackModelId?: string;
  }
): Record<string, SubdivForecastState> {
  const leadTimes = ['day-1', 'day-3', 'day-5', 'day-7'];
  const variables = ['rainfall', 'temperature', 'wind', 'extreme'];
  const result: Record<string, SubdivForecastState> = {};

  for (const lt of leadTimes) {
    for (const v of variables) {
      const key = `${lt}_${v}`;
      const ltFactor = lt === 'day-1' ? 1.0 : lt === 'day-3' ? 1.25 : lt === 'day-5' ? 1.6 : 2.0;
      
      const isFallback = Boolean((forceFallbackDay3 && lt === 'day-3') || (options?.forceFallbackOnDay5 && lt === 'day-5'));
      
      const skillGain = isFallback 
        ? -2.8 
        : Math.round((baseSkillGain * (lt === 'day-1' ? 1.1 : lt === 'day-3' ? 1.0 : lt === 'day-5' ? 0.85 : 0.72) + (v === 'rainfall' ? 2.1 : v === 'temperature' ? -0.5 : 1.0)) * 10) / 10;
      
      const ciHalf = 3.5 + (ltFactor * 0.8);
      const ciLower = Math.round((skillGain - ciHalf) * 10) / 10;
      const ciUpper = Math.round((skillGain + ciHalf) * 10) / 10;

      const disagreement = Math.min(0.95, Math.round((baseDisagreement * ltFactor * (v === 'rainfall' ? 1.15 : 0.9)) * 100) / 100);

      const trustedModel = isFallback 
        ? (options?.fallbackModelId || 'graphcast')
        : (lt === 'day-7' && v === 'temperature' ? 'graphcast' : (v === 'rainfall' && (regime === 'active-monsoon' || regime === 'break-monsoon') ? primaryModel : primaryModel));

      const weights: ModelSkillWeight[] = [
        { modelId: 'mithuna-fs', weight: 0.28, trailingError: 3.2 * ltFactor, ciLower: 2.8 * ltFactor, ciUpper: 3.7 * ltFactor },
        { modelId: 'ecmwf-ifs', weight: 0.24, trailingError: 3.4 * ltFactor, ciLower: 3.0 * ltFactor, ciUpper: 3.9 * ltFactor },
        { modelId: 'graphcast', weight: 0.21, trailingError: 3.6 * ltFactor, ciLower: 3.1 * ltFactor, ciUpper: 4.1 * ltFactor },
        { modelId: 'neps-r', weight: 0.15, trailingError: 3.9 * ltFactor, ciLower: 3.4 * ltFactor, ciUpper: 4.5 * ltFactor },
        { modelId: 'gfs', weight: 0.08, trailingError: 4.5 * ltFactor, ciLower: 4.0 * ltFactor, ciUpper: 5.1 * ltFactor },
        { modelId: 'pangu-weather', weight: 0.04, trailingError: 4.8 * ltFactor, ciLower: 4.2 * ltFactor, ciUpper: 5.5 * ltFactor },
      ];

      const featureImportance: FeatureImportance[] = [
        { featureName: 'Trailing stratum skill', plainDescription: 'Rolling 30-day CRPS/RMSE in this subdivision', contributionPercent: 34 },
        { featureName: 'Active weather regime', plainDescription: `Current classified regime: ${regime}`, contributionPercent: 24 },
        { featureName: 'Inter-model disagreement', plainDescription: 'Cross-model forecast spread index', contributionPercent: 18 },
        { featureName: 'Lead-time bucket', plainDescription: `Forecast horizon: ${lt.toUpperCase()}`, contributionPercent: 12 },
        { featureName: 'IMD subdivision prior', plainDescription: 'Subdivision spatial climatology', contributionPercent: 8 },
        { featureName: 'Seasonal phase', plainDescription: 'Monsoon onset/progression calendar index', contributionPercent: 4 },
      ];

      const history = [
        { cycle: '00Z -4d', blendError: 2.9, bestModelError: 3.4, errorMetric: v === 'rainfall' ? 'CRPS (mm)' : 'RMSE (°C/m/s)' },
        { cycle: '12Z -3d', blendError: 2.8, bestModelError: 3.3, errorMetric: v === 'rainfall' ? 'CRPS (mm)' : 'RMSE (°C/m/s)' },
        { cycle: '00Z -3d', blendError: 3.1, bestModelError: 3.7, errorMetric: v === 'rainfall' ? 'CRPS (mm)' : 'RMSE (°C/m/s)' },
        { cycle: '12Z -2d', blendError: 2.7, bestModelError: 3.2, errorMetric: v === 'rainfall' ? 'CRPS (mm)' : 'RMSE (°C/m/s)' },
        { cycle: '00Z -2d', blendError: 3.0, bestModelError: 3.5, errorMetric: v === 'rainfall' ? 'CRPS (mm)' : 'RMSE (°C/m/s)' },
        { cycle: '12Z -1d', blendError: 2.6, bestModelError: 3.1, errorMetric: v === 'rainfall' ? 'CRPS (mm)' : 'RMSE (°C/m/s)' },
        { cycle: '00Z (Curr)', blendError: 2.5, bestModelError: 3.0, errorMetric: v === 'rainfall' ? 'CRPS (mm)' : 'RMSE (°C/m/s)' },
      ];

      const heavyBase = regime === 'active-monsoon' || regime === 'post-cyclone' ? 68 : regime === 'break-monsoon' ? 38 : 12;
      const veryHeavyBase = Math.round(heavyBase * 0.58);
      const extremeBase = Math.round(heavyBase * 0.26);

      result[key] = {
        trustedModelId: trustedModel,
        skillGainPercent: skillGain,
        skillGainCiLower: ciLower,
        skillGainCiUpper: ciUpper,
        disagreementSpreadIndex: disagreement,
        isFallback: isFallback,
        fallbackReason: isFallback ? (options?.fallbackReason || `Blend underperforms ${trustedModel} by ${Math.abs(skillGain)}% in this lead-time horizon — falling back to single model.`) : undefined,
        fallbackModelId: isFallback ? trustedModel : undefined,
        modelWeights: weights,
        featureImportance: featureImportance,
        rollingHistory: history,
        extremeRainProb: {
          heavy: Math.min(95, Math.max(5, heavyBase)),
          veryHeavy: Math.min(85, Math.max(2, veryHeavyBase)),
          extreme: Math.min(65, Math.max(0, extremeBase)),
        },
        heatwaveProb: regime === 'pre-heatwave' ? 78 : 8,
        damagingGustProb: regime === 'post-cyclone' ? 84 : 14,
      };
    }
  }

  return result;
}

export const SUBDIVISIONS_BY_ID = new Map(ALL_36_SUBDIVISIONS.map(s => [s.id, s]));
