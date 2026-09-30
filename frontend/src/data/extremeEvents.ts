export interface ExtremeThresholdTier {
  id: string;
  name: string;
  category: 'Rainfall' | 'Temperature' | 'Wind';
  thresholdText: string;
  imdDefinition: string;
  colorCode: string;
  brierScore: number;
  brierScoreCi: [number, number];
  pod: number; // Probability of Detection (0 to 1.0)
  podCi: [number, number];
  far: number; // False Alarm Ratio (0 to 1.0)
  farCi: [number, number];
  csi: number; // Critical Success Index (0 to 1.0)
  csiCi: [number, number];
  calibrationNotes: string;
}

export interface ReliabilityPoint {
  binForecastProb: number; // 0.1, 0.2, ... 0.9
  observedFrequency: number; // 0.0 to 1.0
  VayuSangamFrequency: number;
  uncalibratedEnsembleFrequency: number;
  sampleCount: number;
}

export const IMD_RAINFALL_TIERS: ExtremeThresholdTier[] = [
  {
    id: 'heavy-rain',
    name: 'Heavy Rainfall',
    category: 'Rainfall',
    thresholdText: 'P(R24h ≥ 64.5 mm)',
    imdDefinition: 'IMD Yellow Watch: 24-hour accumulated rainfall between 64.5 mm and 115.5 mm.',
    colorCode: '#F2C230', // Amber/Yellow
    brierScore: 0.084,
    brierScoreCi: [0.076, 0.092],
    pod: 0.88,
    podCi: [0.84, 0.91],
    far: 0.16,
    farCi: [0.13, 0.20],
    csi: 0.76,
    csiCi: [0.71, 0.80],
    calibrationNotes: 'Separate Brier-score minimization weights optimize spatial sharpness without over-triggering watches.'
  },
  {
    id: 'very-heavy-rain',
    name: 'Very Heavy Rainfall',
    category: 'Rainfall',
    thresholdText: 'P(R24h ≥ 115.6 mm)',
    imdDefinition: 'IMD Orange Alert: 24-hour accumulated rainfall between 115.6 mm and 204.4 mm.',
    colorCode: '#F08A3C', // Orange
    brierScore: 0.046,
    brierScoreCi: [0.039, 0.053],
    pod: 0.81,
    podCi: [0.75, 0.86],
    far: 0.21,
    farCi: [0.16, 0.27],
    csi: 0.67,
    csiCi: [0.61, 0.72],
    calibrationNotes: 'Calibrated using logistic threshold regressions conditioned on active orographic regime tags.'
  },
  {
    id: 'extreme-rain',
    name: 'Extremely Heavy Rainfall',
    category: 'Rainfall',
    thresholdText: 'P(R24h ≥ 204.5 mm)',
    imdDefinition: 'IMD Red Warning: 24-hour accumulated rainfall exceeding 204.5 mm.',
    colorCode: '#D64545', // Crimson Red
    brierScore: 0.019,
    brierScoreCi: [0.014, 0.024],
    pod: 0.73,
    podCi: [0.65, 0.80],
    far: 0.28,
    farCi: [0.20, 0.36],
    csi: 0.57,
    csiCi: [0.49, 0.64],
    calibrationNotes: 'Constrained by extreme-value EVT post-processing to avoid severe false alarm dilution in high-impact events.'
  }
];

export const OTHER_EXTREME_TIERS: ExtremeThresholdTier[] = [
  {
    id: 'heatwave-declaration',
    name: 'Severe Heatwave Declaration',
    category: 'Temperature',
    thresholdText: 'Tmax ≥ 45.0°C (or anomaly ≥ +4.5°C)',
    imdDefinition: 'IMD Heatwave criteria: Station maximum temperature reaches at least 40°C for plains and departure from normal is 4.5°C to 6.4°C.',
    colorCode: '#DC2626',
    brierScore: 0.038,
    brierScoreCi: [0.031, 0.045],
    pod: 0.89,
    podCi: [0.83, 0.93],
    far: 0.12,
    farCi: [0.08, 0.17],
    csi: 0.79,
    csiCi: [0.73, 0.84],
    calibrationNotes: 'Calibrated against IMD 0.25° gridded maximum temperature climatology (1981–2010).'
  },
  {
    id: 'damaging-wind-gust',
    name: 'Damaging Gale Wind Gust',
    category: 'Wind',
    thresholdText: 'Gusts ≥ 65 km/h (≥ 35 knots)',
    imdDefinition: 'Squally to Gale wind criteria causing structural risk, coastal surge and power line vulnerability.',
    colorCode: '#7C3AED',
    brierScore: 0.052,
    brierScoreCi: [0.044, 0.061],
    pod: 0.84,
    podCi: [0.78, 0.89],
    far: 0.18,
    farCi: [0.13, 0.24],
    csi: 0.71,
    csiCi: [0.65, 0.77],
    calibrationNotes: 'Weighted heavily towards convection-permitting NEPS-R (4km) and IFS coastal wind vector assimilation.'
  }
];

export const RELIABILITY_DIAGRAM_DATA: ReliabilityPoint[] = [
  { binForecastProb: 0.05, observedFrequency: 0.04, VayuSangamFrequency: 0.05, uncalibratedEnsembleFrequency: 0.12, sampleCount: 1420 },
  { binForecastProb: 0.15, observedFrequency: 0.14, VayuSangamFrequency: 0.15, uncalibratedEnsembleFrequency: 0.26, sampleCount: 980 },
  { binForecastProb: 0.25, observedFrequency: 0.23, VayuSangamFrequency: 0.24, uncalibratedEnsembleFrequency: 0.39, sampleCount: 650 },
  { binForecastProb: 0.35, observedFrequency: 0.34, VayuSangamFrequency: 0.36, uncalibratedEnsembleFrequency: 0.52, sampleCount: 430 },
  { binForecastProb: 0.45, observedFrequency: 0.46, VayuSangamFrequency: 0.44, uncalibratedEnsembleFrequency: 0.63, sampleCount: 310 },
  { binForecastProb: 0.55, observedFrequency: 0.54, VayuSangamFrequency: 0.56, uncalibratedEnsembleFrequency: 0.74, sampleCount: 240 },
  { binForecastProb: 0.65, observedFrequency: 0.66, VayuSangamFrequency: 0.64, uncalibratedEnsembleFrequency: 0.82, sampleCount: 180 },
  { binForecastProb: 0.75, observedFrequency: 0.73, VayuSangamFrequency: 0.76, uncalibratedEnsembleFrequency: 0.89, sampleCount: 135 },
  { binForecastProb: 0.85, observedFrequency: 0.86, VayuSangamFrequency: 0.84, uncalibratedEnsembleFrequency: 0.94, sampleCount: 90 },
  { binForecastProb: 0.95, observedFrequency: 0.93, VayuSangamFrequency: 0.94, uncalibratedEnsembleFrequency: 0.98, sampleCount: 52 }
];
