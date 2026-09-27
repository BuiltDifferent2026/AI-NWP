import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { 
  Settings, 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  AlertCircle, 
  Cpu, 
  HardDrive, 
  Server, 
  Database,
  Activity,
  Play
} from 'lucide-react';

export const PageSystemOperations: React.FC = () => {
  const { cycleTimestamp } = useForecast();

  const pipelineSteps = [
    { num: 1, title: 'Ingestion', desc: 'Fetch NWP + AI grids', status: 'completed', time: '11:58 UTC', duration: '2 min' },
    { num: 2, title: 'Validation', desc: 'Quality checks & bounds', status: 'completed', time: '12:00 UTC', duration: '1 min' },
    { num: 3, title: 'Harmonization', desc: 'Regrid to 0.25° common', status: 'completed', time: '12:03 UTC', duration: '3 min' },
    { num: 4, title: 'Feature Gen', desc: 'Lead, regime, spread', status: 'completed', time: '12:03 UTC', duration: '2 min' },
    { num: 5, title: 'Adaptive Weighting', desc: 'LightGBM softmax gate', status: 'running', time: '12:06 UTC', duration: '68% (3 min)' },
    { num: 6, title: 'Blending', desc: 'Multi-variable blend', status: 'pending', time: '~12 min', duration: '2 min' },
    { num: 7, title: 'Calibration', desc: 'Brier threshold tail', status: 'pending', time: 'Pending', duration: '2 min' },
    { num: 8, title: 'Verification', desc: 'Compare station obs', status: 'pending', time: 'Pending', duration: '1 min' },
    { num: 9, title: 'Publication', desc: 'Push API & Zarr sync', status: 'pending', time: 'Pending', duration: '1 min' },
  ];

  return (
    <div className="system-operations-view">
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.2rem' }}>
            Home &gt; System &amp; Operations
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            System Architecture &amp; Operations Pipeline
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
            End-to-end operational pipeline for hybrid AI–NWP multi-model forecast blending, from ingestion to NCMRWF HPC dissemination.
          </p>
        </div>

        <button
          type="button"
          className="btn-outline"
          onClick={() => alert('Triggering simulated assimilation replay cycle...')}
        >
          <RotateCw size={14} />
          <span>Replay Run</span>
        </button>
      </div>

      {/* 2. Operational Pipeline Progress Stepper (9 Steps) */}
      <div className="card-standard" style={{ marginBottom: '1.5rem', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
              Operational Assimilation Pipeline
            </span>
            <span style={{ fontSize: '0.72rem', background: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 600 }}>
              Cycle: {cycleTimestamp} &bull; In Progress (68%)
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Estimated Completion: 12 mins</span>
        </div>

        {/* 9-Step Stepper Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '0.5rem' }}>
          {pipelineSteps.map((step) => {
            const isDone = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={step.num}
                style={{
                  background: isRunning ? '#FFFFFF' : isDone ? '#F0FDF4' : '#FFFFFF',
                  border: isRunning ? '2px solid #2563EB' : isDone ? '1px solid #BBF7D0' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isRunning ? '0 2px 8px rgba(37,99,235,0.15)' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isRunning ? '#2563EB' : isDone ? '#15803D' : '#94A3B8' }}>
                      {step.num}.
                    </span>
                    {isDone && <CheckCircle2 size={13} color="#15803D" />}
                    {isRunning && <Activity size={13} color="#2563EB" style={{ animation: 'spin 2s linear infinite' }} />}
                    {step.status === 'pending' && <Clock size={12} color="#CBD5E1" />}
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-ink)', lineHeight: '1.2' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', marginTop: '2px', lineHeight: '1.2' }}>
                    {step.desc}
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '3px', fontSize: '0.65rem', color: isRunning ? '#2563EB' : 'var(--color-muted)', fontWeight: isRunning ? 700 : 400 }}>
                  {step.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Middle Row: Data Freshness (Col 7) + System Health (Col 5) */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Data Sources & Freshness */}
        <div className="col-span-7 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-ink)' }}>
              Data Sources Freshness &amp; Latency Status
            </span>
            <span style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: 600 }}>9 / 10 Feeds Active</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Resolution</th>
                  <th>Latest Run (UTC)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'NCUM-G (NCMRWF)', type: 'Deterministic NWP', res: '12 km', time: '26 Sep 12:00', status: 'Available', ok: true },
                  { name: 'NEPS (NCMRWF)', type: 'Ensemble NWP (23m)', res: '12 km', time: '26 Sep 12:00', status: 'Available', ok: true },
                  { name: 'ECMWF IFS', type: 'Global NWP', res: '0.25°', time: '26 Sep 12:00', status: 'Available', ok: true },
                  { name: 'ECMWF AIFS', type: 'AI Foundation', res: '0.25°', time: '26 Sep 12:00', status: 'Available', ok: true },
                  { name: 'GFS (NOAA)', type: 'Global NWP', res: '0.25°', time: '26 Sep 12:00', status: 'Available', ok: true },
                  { name: 'ICON (DWD)', type: 'Global NWP', res: '0.25°', time: '26 Sep 06:00', status: 'Delayed', ok: false },
                  { name: 'IMD Station Truth', type: 'Rainfall / AWS', res: '0.25°', time: '26 Sep 11:30', status: 'Available', ok: true },
                  { name: 'INSAT-3D/3DR', type: 'Satellite (QPE)', res: '4 km', time: '26 Sep 11:45', status: 'Available', ok: true },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.name}</strong></td>
                    <td style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>{row.type}</td>
                    <td style={{ fontSize: '0.75rem' }}>{row.res}</td>
                    <td style={{ fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>{row.time}</td>
                    <td>
                      <span style={{ fontSize: '0.72rem', background: row.ok ? '#DCFCE7' : '#FEF3C7', color: row.ok ? '#15803D' : '#B45309', padding: '0.15rem 0.45rem', borderRadius: '3px', fontWeight: 600 }}>
                        {row.ok ? '● Available' : '▲ Delayed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health & Resources */}
        <div className="col-span-5 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-ink)' }}>
              NCMRWF Supercomputing Node Health
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Arunika Cluster</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.78rem' }}>
            {[
              { name: 'Compute Nodes (CPU)', pct: 42, icon: <Cpu size={14} /> },
              { name: 'Neural Accelerator (GPU A100)', pct: 36, icon: <Activity size={14} /> },
              { name: 'Zarr Cache Storage (NVMe)', pct: 58, icon: <HardDrive size={14} /> },
              { name: 'Inference API Service', pct: 24, icon: <Server size={14} /> },
              { name: 'Timeseries Postgres DB', pct: 31, icon: <Database size={14} /> },
              { name: 'Data Ingestion Worker', pct: 18, icon: <RotateCw size={14} /> },
            ].map((res, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-ink)', fontWeight: 500 }}>
                    {res.icon} {res.name}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{res.pct}%</span>
                </div>
                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${res.pct}%`, height: '100%', background: res.pct > 70 ? '#DC2626' : '#22C55E' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
