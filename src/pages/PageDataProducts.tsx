import React from 'react';
import { useForecast } from '../context/ForecastContext';
import { 
  Database, 
  Layers, 
  Code, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Copy,
  Terminal,
  FileText
} from 'lucide-react';

export const PageDataProducts: React.FC = () => {
  const { navigateTo } = useForecast();

  const handleCopyApi = () => {
    navigator.clipboard?.writeText('https://api.ncmrwf.gov.in/hybrid-blend/v1/forecast?subdivision=KNG&lead=72h');
    alert('API Endpoint copied to clipboard!');
  };

  return (
    <div className="data-products-view">
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.2rem' }}>
            Home &gt; Data &amp; Products
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            Data Ecosystem &amp; Products Catalog
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
            Integrated multi-source data architecture, NetCDF4/Zarr distribution pipelines, and OpenAPI endpoints for MoES/IMD integration.
          </p>
        </div>

        <button
          type="button"
          className="btn-outline"
          onClick={() => alert('NCMRWF HyBlend Data Specification v1.4 loaded.')}
        >
          <FileText size={15} />
          <span>Documentation</span>
        </button>
      </div>

      {/* 2. Data Flow & System Architecture Diagram */}
      <div className="card-standard" style={{ marginBottom: '1.5rem', background: '#F8FAFC' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.75rem' }}>
          Data Flow &amp; System Pipeline Architecture
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', alignItems: 'center' }}>
          {/* Step 1: Data Sources */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: '#0B3D62', marginBottom: '4px' }}>1. Data Sources</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>
              &bull; NWP Models (NCUM, IFS, GFS)<br/>
              &bull; AI Models (GraphCast, AIFS)<br/>
              &bull; Obs (IMD AWS, INSAT)
            </div>
          </div>

          {/* Step 2: Pre-processing */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: '#2563EB', marginBottom: '4px' }}>2. Pre-processing</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>
              &bull; NetCDF4 / GRIB2 Decode<br/>
              &bull; Physical Bounds Checking<br/>
              &bull; Spatial Harmonization
            </div>
          </div>

          {/* Step 3: Integration Layer */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: '#7C3AED', marginBottom: '4px' }}>3. Integration Layer</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>
              &bull; Common 0.25° Grid Alignment<br/>
              &bull; Feature Store Generation<br/>
              &bull; Stratum Trailing Skill
            </div>
          </div>

          {/* Step 4: Blending Engine */}
          <div style={{ background: '#EFF6FF', border: '2px solid #BFDBFE', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: '#1D4ED8', marginBottom: '4px' }}>4. Blending Engine</div>
            <div style={{ color: 'var(--color-ink)', fontSize: '0.7rem' }}>
              &bull; LightGBM Gating Trees<br/>
              &bull; Disagreement Weighting<br/>
              &bull; Brier Tail Calibration
            </div>
          </div>

          {/* Step 5: Forecast Products */}
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: '#15803D', marginBottom: '4px' }}>5. Dissemination</div>
            <div style={{ color: '#166534', fontSize: '0.7rem' }}>
              &bull; Deterministic &amp; Prob Grids<br/>
              &bull; REST API Endpoints<br/>
              &bull; IMD Duty Dashboard
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Ingested Sources Table (Col 7) + API Access (Col 5) */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Available Data Sources */}
        <div className="col-span-7 card-standard">
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.75rem' }}>
            Available Ingestion Data Feeds
          </span>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feed Name</th>
                  <th>Provider</th>
                  <th>Resolution</th>
                  <th>Frequency</th>
                  <th>Coverage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'NCUM-G', prov: 'NCMRWF / MoES', res: '~12 km', freq: '6-hourly', cov: 'Global / India', status: 'Available' },
                  { name: 'NEPS-G', prov: 'NCMRWF / MoES', res: '~12 km', freq: '6-hourly', cov: 'Subcontinent', status: 'Available' },
                  { name: 'NCUM-R / NEPS-R', prov: 'NCMRWF', res: '4 km', freq: '3-hourly', cov: 'South Asia', status: 'Available' },
                  { name: 'ECMWF IFS', prov: 'ECMWF', res: '0.25°', freq: '6-hourly', cov: 'Global', status: 'Available' },
                  { name: 'ECMWF AIFS', prov: 'ECMWF', res: '0.25°', freq: '6-hourly', cov: 'Global', status: 'Available' },
                  { name: 'GFS', prov: 'NOAA / NCEP', res: '0.25°', freq: '6-hourly', cov: 'Global', status: 'Available' },
                  { name: 'IMD Station Truth', prov: 'IMD', res: '0.25° grid', freq: 'Daily', cov: 'India', status: 'Available' },
                  { name: 'INSAT-3D/3DR QPE', prov: 'ISRO / MOSDAC', res: '4 km', freq: '15-min', cov: 'Subcontinent', status: 'Available' },
                ].map((feed, idx) => (
                  <tr key={idx}>
                    <td><strong>{feed.name}</strong></td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{feed.prov}</td>
                    <td style={{ fontSize: '0.75rem' }}>{feed.res}</td>
                    <td style={{ fontSize: '0.75rem' }}>{feed.freq}</td>
                    <td style={{ fontSize: '0.75rem' }}>{feed.cov}</td>
                    <td>
                      <span style={{ fontSize: '0.7rem', color: '#15803D', background: '#DCFCE7', padding: '0.15rem 0.45rem', borderRadius: '3px', fontWeight: 600 }}>
                        ● {feed.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Access Card */}
        <div className="col-span-5 card-standard" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-ink)' }}>
                Internal REST API Access
              </span>
              <span style={{ fontSize: '0.68rem', background: '#F1F5F9', color: 'var(--color-primary)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                OpenAPI 3.1
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
              Standardized JSON &amp; NetCDF stream endpoints for MoES decision support systems.
            </div>

            {/* URL Display */}
            <div style={{ background: '#0F172A', color: '#38BDF8', borderRadius: '4px', padding: '0.6rem 0.75rem', fontSize: '0.75rem', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span>https://api.ncmrwf.gov.in/hybrid-blend/v1</span>
              <button
                type="button"
                onClick={handleCopyApi}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                title="Copy URL"
              >
                <Copy size={13} />
              </button>
            </div>

            {/* Endpoints list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                <code><strong style={{ color: '#059669' }}>GET</strong> /forecast</code>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>Get blended forecast grids</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                <code><strong style={{ color: '#059669' }}>GET</strong> /weights</code>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>Get model gating weight maps</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                <code><strong style={{ color: '#059669' }}>GET</strong> /extremes</code>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>Get Brier exceedance alerts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                <code><strong style={{ color: '#059669' }}>GET</strong> /verification</code>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>Get CRPS/RMSE performance</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.6rem', fontSize: '0.72rem', color: 'var(--color-muted)' }}>
            Authentication: API Key header <code>X-NCMRWF-AUTH</code> (Authorized MoES / IMD nodes).
          </div>
        </div>
      </div>
    </div>
  );
};
