import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { 
  BookOpen, 
  Target, 
  HelpCircle, 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export const PageResearchDocs: React.FC = () => {
  const { navigateTo } = useForecast();

  const experiments = [
    { id: 'EXP-001', name: 'Equal Weight Baseline', vars: 'Rain, Temp, Wind', period: '2020–2022', status: 'Completed', result: 'Base CRPS 4.28mm' },
    { id: 'EXP-002', name: 'Historical Skill Weighting (Layer 1)', vars: 'Rain', period: '2020–2022', status: 'Completed', result: '+7.7% skill gain' },
    { id: 'EXP-003', name: 'Regional Stratum Adaptive Weights', vars: 'Rain, Temp', period: '2020–2023', status: 'Completed', result: '+12.4% skill gain' },
    { id: 'EXP-004', name: 'Contextual Gating (LightGBM)', vars: 'Rain, Temp, Wind', period: '2021–2023', status: 'Completed', result: '+18.0% skill gain' },
    { id: 'EXP-005', name: '+ Inter-Model Disagreement & Regime', vars: 'Rain, Wind', period: '2021–2024', status: 'Running', result: 'Sharper extreme detection' },
    { id: 'EXP-006', name: 'Probabilistic Brier Calibration', vars: 'Rain, Temp', period: '2022–2024', status: 'Running', result: '32% FAR reduction' },
    { id: 'EXP-007', name: 'Extreme Event EVT Evaluation', vars: 'Extreme Rain, Heat', period: '2020–2024', status: 'Running', result: 'In Progress' },
  ];

  return (
    <div className="research-docs-view">
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.2rem' }}>
            Home &gt; Research &amp; Documentation
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            Research, Evidence &amp; Scientific Documentation
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
            Experiments, empirical evidence and reproducibility records for adaptive multi-model forecast blending over India.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary-blue"
          onClick={() => navigateTo('verification-lab')}
        >
          <span>View Verification Lab</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* 2. Research Goal & Key Research Questions */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Research Goal */}
        <div className="col-span-5 card-standard" style={{ background: '#F0F7FF', border: '1px solid #BFDBFE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Target size={18} color="#1D4ED8" />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E40AF' }}>
              Our Core Research Goal
            </h2>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#1E3A8A', lineHeight: '1.5' }}>
            To develop and evaluate an adaptive multi-model forecast blending framework that optimally combines operational numerical weather prediction (NCMRWF NCUM/NEPS, ECMWF, GFS) and AI foundation models (GraphCast, AIFS, Pangu) conditioned on Indian meteorological regimes and local terrain.
          </p>
        </div>

        {/* Key Research Questions */}
        <div className="col-span-7 card-standard">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <HelpCircle size={18} color="var(--color-primary)" />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-ink)' }}>
              Key Research Questions Addressed
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
            <div style={{ background: '#F8FAFC', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <strong style={{ color: '#2563EB' }}>RQ1: </strong>
              Does regime-conditioned dynamic weighting beat any single model across lead times?
            </div>
            <div style={{ background: '#F8FAFC', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <strong style={{ color: '#2563EB' }}>RQ2: </strong>
              How does AI vs. physical NWP skill partition between plains and orographic Ghats?
            </div>
            <div style={{ background: '#F8FAFC', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <strong style={{ color: '#2563EB' }}>RQ3: </strong>
              Can separate Brier threshold calibration improve early extreme-event detection?
            </div>
            <div style={{ background: '#F8FAFC', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <strong style={{ color: '#2563EB' }}>RQ4: </strong>
              Does cross-model disagreement spread provide an actionable uncertainty signal?
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Experiments Table */}
      <div className="card-standard" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
            Active Experimental Matrix &amp; Ablation Runs
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>SIH26081 Scientific Artifacts</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Experiment ID</th>
                <th>Experiment Name</th>
                <th>Variables</th>
                <th>Training / Evaluation Period</th>
                <th>Status</th>
                <th>Primary Empirical Result</th>
              </tr>
            </thead>
            <tbody>
              {experiments.map((exp) => (
                <tr key={exp.id}>
                  <td><code>{exp.id}</code></td>
                  <td><strong>{exp.name}</strong></td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{exp.vars}</td>
                  <td style={{ fontSize: '0.75rem' }}>{exp.period}</td>
                  <td>
                    <span style={{ fontSize: '0.7rem', color: exp.status === 'Completed' ? '#15803D' : '#2563EB', background: exp.status === 'Completed' ? '#DCFCE7' : '#EFF6FF', padding: '0.15rem 0.45rem', borderRadius: '3px', fontWeight: 600 }}>
                      {exp.status === 'Completed' ? '✓ Completed' : '● In Progress'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                    {exp.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Research Documentation Deliverables */}
      <div className="grid-12">
        <div className="col-span-3 card-standard" style={{ cursor: 'pointer' }} onClick={() => navigateTo('about')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <FileText size={16} color="var(--color-primary)" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Technical Methodology</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
            Mathematical formulation of LightGBM tree gating &amp; Brier loss minimization.
          </div>
        </div>

        <div className="col-span-3 card-standard" style={{ cursor: 'pointer' }} onClick={() => navigateTo('verification-lab')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Layers size={16} color="#059669" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Experiment Results</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
            Detailed verification metrics, ablation charts and regional heatmaps.
          </div>
        </div>

        <div className="col-span-3 card-standard" style={{ cursor: 'pointer' }} onClick={() => navigateTo('system-ops')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <GitBranch size={16} color="#7C3AED" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>System Architecture</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
            End-to-end operational pipeline &amp; HPC assimilation workflow.
          </div>
        </div>

        <div className="col-span-3 card-standard" style={{ cursor: 'pointer' }} onClick={() => navigateTo('forecast-explorer')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <BookOpen size={16} color="#D97706" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Forecaster User Guide</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
            How to interpret regime transition alerts and inter-model spread signals.
          </div>
        </div>
      </div>
    </div>
  );
};
