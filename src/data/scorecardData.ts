export interface StratumPerformance {
  stratumId: string;
  stratumName: string;
  leadTime: string;
  variable: string;
  metricLabel: string;
  hyBlendError: number;
  hyBlendCi: [number, number];
  bestSingleModelId: string;
  bestSingleModelName: string;
  bestSingleModelError: number;
  bestSingleModelCi: [number, number];
  skillWeightedError: number;
  skillWeightedCi: [number, number];
  equalWeightError: number;
  equalWeightCi: [number, number];
  simulatedForecasterError: number;
  simulatedForecasterCi: [number, number];
  climatologyError: number;
  climatologyCi: [number, number];
  skillGainPercent: number;
  skillGainCi: [number, number];
  isFallback: boolean;
  fallbackModelId?: string;
  fallbackReason?: string;
}

export interface FallbackCaseRecord {
  subdivisionId: string;
  subdivisionName: string;
  leadTime: string;
  variable: string;
  competingModelName: string;
  differencePercent: number;
  reason: string;
  activeFallbackModel: string;
}

export const FALLBACK_RECORDS: FallbackCaseRecord[] = [
  {
    subdivisionId: 'sub-23',
    subdivisionName: 'Konkan & Goa',
    leadTime: 'Day 3 (T+72h)',
    variable: 'Rainfall',
    competingModelName: 'GraphCast (DeepMind)',
    differencePercent: 3.1,
    reason: 'Blend underperforms GraphCast by 3.1% in high-orographic coastal regime — not statistically significant at 95% CI — falling back to GraphCast.',
    activeFallbackModel: 'GraphCast (DeepMind)'
  },
  {
    subdivisionId: 'sub-22',
    subdivisionName: 'Saurashtra & Kutch',
    leadTime: 'Day 5 (T+120h)',
    variable: 'Rainfall',
    competingModelName: 'NOAA GFS',
    differencePercent: 1.4,
    reason: 'Gating layer variance higher than single deterministic trajectory during hyper-arid synoptic lull — falling back to NOAA GFS.',
    activeFallbackModel: 'NOAA GFS'
  },
  {
    subdivisionId: 'sub-18',
    subdivisionName: 'East Rajasthan',
    leadTime: 'Day 7 (T+168h)',
    variable: 'Temperature',
    competingModelName: 'Pangu-Weather',
    differencePercent: 0.8,
    reason: 'Skill gain within neutral noise band (±1.0%) at Day 7 horizon — defaulting to leading single AI foundation baseline.',
    activeFallbackModel: 'Pangu-Weather'
  }
];

export const NATIONAL_STRATUM_SUMMARY = {
  headlineSkillGain: 14.2,
  headlineCi: [9.8, 18.6] as [number, number],
  leadTimeBreakdown: [
    { leadTime: 'Day 1 (T+24h)', hyBlendGain: 17.8, ci: [14.2, 21.4] as [number, number], sampleCount: 1080 },
    { leadTime: 'Day 3 (T+72h)', hyBlendGain: 14.2, ci: [9.8, 18.6] as [number, number], sampleCount: 1080 },
    { leadTime: 'Day 5 (T+120h)', hyBlendGain: 10.5, ci: [6.1, 14.9] as [number, number], sampleCount: 1080 },
    { leadTime: 'Day 7 (T+168h)', hyBlendGain: 7.2, ci: [2.5, 11.8] as [number, number], sampleCount: 1080 },
  ],
  methodologyComparison: [
    {
      methodName: 'HyBlend (Layer 2 LightGBM Gate)',
      meanCRPS_Rain: 3.12,
      ciCRPS: [2.85, 3.39] as [number, number],
      meanRMSE_Temp: 1.15,
      ciRMSE_Temp: [1.02, 1.28] as [number, number],
      meanRMSE_Wind: 2.18,
      ciRMSE_Wind: [1.95, 2.41] as [number, number],
      overallSkillGain: 14.2,
      gainCi: [9.8, 18.6] as [number, number]
    },
    {
      methodName: 'Best Individual Upstream Model (Stratified)',
      meanCRPS_Rain: 3.64,
      ciCRPS: [3.35, 3.93] as [number, number],
      meanRMSE_Temp: 1.34,
      ciRMSE_Temp: [1.21, 1.47] as [number, number],
      meanRMSE_Wind: 2.54,
      ciRMSE_Wind: [2.30, 2.78] as [number, number],
      overallSkillGain: 0.0,
      gainCi: [0.0, 0.0] as [number, number]
    },
    {
      methodName: 'Simulated Forecaster Baseline ("Trust most frequent winner")',
      meanCRPS_Rain: 3.82,
      ciCRPS: [3.51, 4.13] as [number, number],
      meanRMSE_Temp: 1.48,
      ciRMSE_Temp: [1.32, 1.64] as [number, number],
      meanRMSE_Wind: 2.72,
      ciRMSE_Wind: [2.46, 2.98] as [number, number],
      overallSkillGain: -4.9,
      gainCi: [-8.1, -1.7] as [number, number]
    },
    {
      methodName: 'Layer 1 Skill-Weighted Average (1/Error)',
      meanCRPS_Rain: 3.95,
      ciCRPS: [3.66, 4.24] as [number, number],
      meanRMSE_Temp: 1.52,
      ciRMSE_Temp: [1.38, 1.66] as [number, number],
      meanRMSE_Wind: 2.81,
      ciRMSE_Wind: [2.55, 3.07] as [number, number],
      overallSkillGain: -8.5,
      gainCi: [-12.0, -5.0] as [number, number]
    },
    {
      methodName: 'Equal-Weight Simple Ensemble Average',
      meanCRPS_Rain: 4.28,
      ciCRPS: [3.95, 4.61] as [number, number],
      meanRMSE_Temp: 1.76,
      ciRMSE_Temp: [1.58, 1.94] as [number, number],
      meanRMSE_Wind: 3.15,
      ciRMSE_Wind: [2.85, 3.45] as [number, number],
      overallSkillGain: -17.6,
      gainCi: [-21.8, -13.4] as [number, number]
    },
    {
      methodName: 'Climatology & Persistence Baseline',
      meanCRPS_Rain: 6.85,
      ciCRPS: [6.32, 7.38] as [number, number],
      meanRMSE_Temp: 2.95,
      ciRMSE_Temp: [2.68, 3.22] as [number, number],
      meanRMSE_Wind: 4.82,
      ciRMSE_Wind: [4.40, 5.24] as [number, number],
      overallSkillGain: -88.2,
      gainCi: [-96.5, -79.9] as [number, number]
    }
  ]
};
