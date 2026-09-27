export interface WeatherModel {
  id: string;
  name: string;
  category: 'Physical NWP' | 'Ensembles' | 'AI Foundation Models' | 'Related Operational Systems';
  resolution: string;
  institution: string;
  lineage: string;
  color: string;
  isEvaluatedOnly?: boolean;
  notes: string;
}

export const UPSTREAM_MODELS: WeatherModel[] = [
  // Physical NWP
  {
    id: 'ecmwf-ifs',
    name: 'ECMWF IFS/HRES',
    category: 'Physical NWP',
    resolution: '9 km global',
    institution: 'ECMWF (Reading, UK)',
    lineage: 'Hydrostatic atmospheric model with 4D-Var data assimilation',
    color: '#0284C7',
    notes: 'Gold standard global deterministic physical model.'
  },
  {
    id: 'gfs',
    name: 'NOAA GFS',
    category: 'Physical NWP',
    resolution: '0.25° (~28 km)',
    institution: 'NOAA / NCEP (USA)',
    lineage: 'Finite-Volume Cubed-Sphere (FV3) dynamical core',
    color: '#059669',
    notes: 'Operational global deterministic model, updated 4x daily.'
  },
  {
    id: 'mithuna-fs',
    name: 'NCMRWF Mithuna-FS',
    category: 'Physical NWP',
    resolution: '12 km global',
    institution: 'NCMRWF / MoES (Noida, India)',
    lineage: 'NCUM-G Unified Model lineage adapted for South Asian monsoon dynamics',
    color: '#0B3D62',
    notes: 'Indigenous operational physical NWP model calibrated for Indian monsoon.'
  },

  // Ensembles
  {
    id: 'neps-r',
    name: 'NCMRWF NEPS-R (4km)',
    category: 'Ensembles',
    resolution: '4 km regional',
    institution: 'NCMRWF / MoES',
    lineage: 'Convection-permitting ensemble over Indian subcontinent',
    color: '#D97706',
    notes: 'High-resolution regional ensemble, specialized for orographic and convective rainfall.'
  },
  {
    id: 'neps-g',
    name: 'NCMRWF NEPS-G',
    category: 'Ensembles',
    resolution: '12 km global (23 members)',
    institution: 'NCMRWF / MoES',
    lineage: 'Global ensemble prediction system based on NCUM core',
    color: '#B45309',
    notes: 'Operational probabilistic NWP framework for multi-day uncertainty.'
  },
  {
    id: 'gefs',
    name: 'NOAA GEFS',
    category: 'Ensembles',
    resolution: '0.25° (31 members)',
    institution: 'NOAA / NCEP',
    lineage: 'Ensemble Kalman Filter perturbed initial conditions',
    color: '#10B981',
    notes: 'Global ensemble system capturing synoptic spread across medium range.'
  },

  // AI Foundation Models
  {
    id: 'graphcast',
    name: 'GraphCast',
    category: 'AI Foundation Models',
    resolution: '0.25° (6-hourly)',
    institution: 'Google DeepMind',
    lineage: 'Graph neural network (GNN) on icosahedral multi-mesh representation',
    color: '#7C3AED',
    notes: 'State-of-the-art medium-range AI model, excels in synoptic wave propagation.'
  },
  {
    id: 'pangu-weather',
    name: 'Pangu-Weather',
    category: 'AI Foundation Models',
    resolution: '0.25°',
    institution: 'Huawei Cloud',
    lineage: '3D Earth-specific hierarchical vision transformer (3D-EST)',
    color: '#9333EA',
    notes: 'Highly capable AI model with low geopotential height bias.'
  },
  {
    id: 'ecmwf-aifs',
    name: 'ECMWF AIFS',
    category: 'AI Foundation Models',
    resolution: '28 km (0.25° grid)',
    institution: 'ECMWF',
    lineage: 'Data-driven machine learned forecasting system trained on ERA5 & IFS analysis',
    color: '#6366F1',
    notes: 'ECMWF operational data-driven AI model.'
  },
  {
    id: 'fourcastnet',
    name: 'FourCastNet',
    category: 'AI Foundation Models',
    resolution: '0.25°',
    institution: 'NVIDIA / Caltech',
    lineage: 'Adaptive Fourier Neural Operator (AFNO) architecture',
    color: '#4F46E5',
    notes: 'Fast Fourier-based neural operator model for extreme wind and precipitation tracks.'
  },
  {
    id: 'gencast',
    name: 'GenCast (Evaluation)',
    category: 'AI Foundation Models',
    resolution: '0.25° ensemble diffusion',
    institution: 'Google DeepMind',
    lineage: 'Diffusion-based probabilistic AI foundation model',
    color: '#8B5CF6',
    isEvaluatedOnly: true,
    notes: 'Evaluated in the same research landscape; tracked for future probabilistic layer integration.'
  },

  // Related Operational Systems
  {
    id: 'bharat-fs',
    name: 'IITM BharatFS (Mission Mausam)',
    category: 'Related Operational Systems',
    resolution: '6 km regional',
    institution: 'IITM Pune / MoES',
    lineage: 'High-resolution Earth System Model under Mission Mausam',
    color: '#EC4899',
    notes: 'Separate national initiative under Mission Mausam, integrated via standardized ingestion adapter.'
  }
];

export const MODEL_MAP = new Map(UPSTREAM_MODELS.map(m => [m.id, m]));
