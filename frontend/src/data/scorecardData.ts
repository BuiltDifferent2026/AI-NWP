export interface StratumPerformance {
  stratumId: string;
  stratumName: string;
  leadTime: string;
  variable: string;
  metricLabel: string;
  VayuSangamError: number;
  VayuSangamCi: [number, number];
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
    subdivisionId: 'lead-24h-national',
    subdivisionName: 'National (All Subdivisions)',
    leadTime: 'Day 1 (T+24h)',
    variable: 'Temperature',
    competingModelName: 'Pangu-Weather (AI)',
    differencePercent: 1.14,
    reason: 'At T+24h, Pangu RMSE (0.4999 K) slightly outperforms unconstrained gate (0.5056 K) with negative skill gain (-1.14%). Honest fallback to Pangu is active.',
    activeFallbackModel: 'Pangu-Weather (AI)'
  },
  {
    subdivisionId: 'sub-23',
    subdivisionName: 'Konkan & Goa',
    leadTime: 'Day 3 (T+72h)',
    variable: 'Rainfall',
    competingModelName: 'IFS HRES (Physical NWP)',
    differencePercent: 2.1,
    reason: 'During active coastal monsoon surge, physical orographic resolution equals gate accuracy — system applies conservative shrinkage to IFS HRES.',
    activeFallbackModel: 'IFS HRES'
  },
  {
    subdivisionId: 'sub-18',
    subdivisionName: 'East Rajasthan',
    leadTime: 'Day 7 (T+168h)',
    variable: 'Temperature',
    competingModelName: 'Pangu-Weather',
    differencePercent: 0.6,
    reason: 'Pre-monsoon heatwave synoptic stagnation at Day 7 — gating variance matches single leading AI trajectory.',
    activeFallbackModel: 'Pangu-Weather'
  }
];

export const NATIONAL_STRATUM_SUMMARY = {
  headlineSkillGain: 9.54,
  headlineCi: [8.28, 10.77] as [number, number],
  windSkillGain: 52.59,
  windCi: [52.19, 52.98] as [number, number],
  leadTimeBreakdown: [
    {
      leadTime: 'Day 1 (T+24h)',
      VayuSangamGain: -1.14,
      ci: [-2.45, 0.18] as [number, number],
      sampleCount: 1826,
      fallbackEngaged: true,
      note: 'Honest Fallback to Pangu-Weather active (RMSE 0.4999 vs 0.5056)'
    },
    {
      leadTime: 'Day 3 (T+72h)',
      VayuSangamGain: 4.20,
      ci: [2.76, 5.56] as [number, number],
      sampleCount: 1826,
      fallbackEngaged: false,
      note: 'Statistically significant improvement over Pangu (RMSE 0.8352 vs 0.8718)'
    },
    {
      leadTime: 'Day 5 (T+120h)',
      VayuSangamGain: 9.19,
      ci: [7.82, 10.59] as [number, number],
      sampleCount: 1826,
      fallbackEngaged: false,
      note: 'Robust gating superiority as NWP and AI error structures diverge (RMSE 1.0481 vs 1.1542)'
    },
    {
      leadTime: 'Day 7 (T+168h)',
      VayuSangamGain: 13.43,
      ci: [11.89, 14.86] as [number, number],
      sampleCount: 1826,
      fallbackEngaged: false,
      note: 'Maximum skill divergence at medium range over single AI baseline (RMSE 1.2874 vs 1.4871)'
    },
  ],
  methodologyComparison: [
    {
      methodName: 'VayuSangam (Layer 2 LightGBM Gate)',
      meanRMSE_Temp: 0.857,
      ciRMSE_Temp: [0.841, 0.873] as [number, number],
      meanRMSE_Wind: 0.846,
      ciRMSE_Wind: [0.832, 0.860] as [number, number],
      meanRMSE_Rain: 0.206, // calibrated mm
      ciRMSE_Rain: [0.198, 0.214] as [number, number],
      overallSkillGain: 9.54,
      gainCi: [8.28, 10.77] as [number, number]
    },
    {
      methodName: 'Best Single Model (Pangu-Weather)',
      meanRMSE_Temp: 0.947,
      ciRMSE_Temp: [0.930, 0.965] as [number, number],
      meanRMSE_Wind: 1.784,
      ciRMSE_Wind: [1.758, 1.810] as [number, number],
      meanRMSE_Rain: 0.285,
      ciRMSE_Rain: [0.272, 0.298] as [number, number],
      overallSkillGain: 0.0,
      gainCi: [0.0, 0.0] as [number, number]
    },
    {
      methodName: 'Equal-Weight Ensemble Average',
      meanRMSE_Temp: 0.955,
      ciRMSE_Temp: [0.938, 0.972] as [number, number],
      meanRMSE_Wind: 1.636,
      ciRMSE_Wind: [1.612, 1.660] as [number, number],
      meanRMSE_Rain: 0.264,
      ciRMSE_Rain: [0.252, 0.276] as [number, number],
      overallSkillGain: -0.76,
      gainCi: [-1.45, -0.07] as [number, number]
    },
    {
      methodName: 'IFS ENS Mean (Ensemble NWP)',
      meanRMSE_Temp: 1.097,
      ciRMSE_Temp: [1.078, 1.116] as [number, number],
      meanRMSE_Wind: 1.839,
      ciRMSE_Wind: [1.812, 1.866] as [number, number],
      meanRMSE_Rain: 0.278,
      ciRMSE_Rain: [0.265, 0.291] as [number, number],
      overallSkillGain: -15.76,
      gainCi: [-17.20, -14.32] as [number, number]
    },
    {
      methodName: 'IFS HRES (Physical NWP Core)',
      meanRMSE_Temp: 1.259,
      ciRMSE_Temp: [1.238, 1.280] as [number, number],
      meanRMSE_Wind: 1.957,
      ciRMSE_Wind: [1.928, 1.986] as [number, number],
      meanRMSE_Rain: 0.295,
      ciRMSE_Rain: [0.281, 0.309] as [number, number],
      overallSkillGain: -32.87,
      gainCi: [-34.50, -31.24] as [number, number]
    },
    {
      methodName: 'Climatology & Persistence Baseline',
      meanRMSE_Temp: 2.450,
      ciRMSE_Temp: [2.380, 2.520] as [number, number],
      meanRMSE_Wind: 3.650,
      ciRMSE_Wind: [3.550, 3.750] as [number, number],
      meanRMSE_Rain: 0.650,
      ciRMSE_Rain: [0.620, 0.680] as [number, number],
      overallSkillGain: -158.7,
      gainCi: [-165.0, -152.4] as [number, number]
    }
  ]
};
