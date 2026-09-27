import React, { useState } from 'react';
import { useForecast } from '../context/ForecastContext';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Activity,
  Sliders,
  HelpCircle
} from 'lucide-react';

export const PageVerificationLab: React.FC = () => {
  const { variable, leadTime, navigateTo } = useForecast();
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'regional' | 'reliability' | 'leadtime' | 'ablation' | 'cases'>('summary');

  return (
    <div className="verification-lab-view">
      {/* 1. Header & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.2rem' }}>
            Home &gt; Verification Lab
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            Verification Lab & Model Performance Matrix
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
            Evaluate the performance of individual models and the blended forecast across variables, regions and lead times against ERA5 & IMD AWS truth.
          </p>
        </div>

        <button
          type="button"
          className="btn-outline"
          onClick={() => alert('Verification Report exported: HyBlend_NCMRWF_SIH26081_Benchmark_2026.pdf')}
        >
          <Download size={15} />
          <span>Download Report</span>
        </button>
      </div>

      {/* 2. Sub-Tabs Bar matching mockups */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
        {[
          { id: 'summary', label: 'Summary' },
          { id: 'regional', label: 'Score by Region' },
          { id: 'reliability', label: 'Reliability & Calibration' },
          { id: 'leadtime', label: 'Lead Time Analysis' },
          { id: 'ablation', label: 'Ablation Study' },
          { id: 'cases', label: 'Case Studies' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`pill-btn ${activeSubTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.id as any)}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Top Row: Model Performance Comparison Table (Col 7) + Reliability & Rank Histogram (Col 5) */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Table */}
        <div className="col-span-7 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-ink)' }}>
              Model Performance Comparison (India &bull; Monsoon 2023 &bull; Lead: 72h)
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Lower Error is Better</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>RMSE ↓</th>
                  <th>MAE ↓</th>
                  <th>CRPS ↓</th>
                  <th>Brier Score ↓</th>
                  <th>BSS ↑</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NCUM-G (NCMRWF)</td>
                  <td>32.4</td>
                  <td>21.3</td>
                  <td>0.184</td>
                  <td>0.236</td>
                  <td>+0.21</td>
                </tr>
                <tr>
                  <td>NEPS-G (NCMRWF)</td>
                  <td>28.7</td>
                  <td>19.1</td>
                  <td>0.162</td>
                  <td>0.201</td>
                  <td>+0.27</td>
                </tr>
                <tr>
                  <td>ECMWF IFS</td>
                  <td>31.6</td>
                  <td>20.8</td>
                  <td>0.171</td>
                  <td>0.219</td>
                  <td>+0.24</td>
                </tr>
                <tr>
                  <td>ECMWF AIFS (AI)</td>
                  <td>29.8</td>
                  <td>19.4</td>
                  <td>0.158</td>
                  <td>0.195</td>
                  <td>+0.29</td>
                </tr>
                <tr>
                  <td>GFS (NOAA)</td>
                  <td>38.1</td>
                  <td>25.6</td>
                  <td>0.203</td>
                  <td>0.268</td>
                  <td>+0.16</td>
                </tr>
                <tr>
                  <td>Equal-Weight Blend</td>
                  <td>27.3</td>
                  <td>18.1</td>
                  <td>0.151</td>
                  <td>0.182</td>
                  <td>+0.32</td>
                </tr>
                <tr className="highlight-blend" style={{ background: '#EFF6FF', borderLeft: '3px solid #2563EB' }}>
                  <td>
                    <strong style={{ color: '#0B3D62' }}>Hybrid AI–NWP (HyBlend)</strong>
                  </td>
                  <td><strong>24.9</strong></td>
                  <td><strong>16.8</strong></td>
                  <td><strong style={{ color: '#15803D' }}>0.137</strong></td>
                  <td><strong style={{ color: '#15803D' }}>0.162</strong></td>
                  <td><strong style={{ color: '#15803D' }}>+0.38</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Reliability Diagram & Rank Histogram */}
        <div className="col-span-5 card-standard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>
              Reliability Diagram (Heavy Rainfall &gt; 64.5 mm)
            </span>
            <span style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: 600 }}>Calibrated</span>
          </div>

          <svg viewBox="0 0 360 160" style={{ width: '100%', height: 'auto' }}>
            <line x1="35" y1="15" x2="340" y2="15" stroke="#E2E8F0" strokeDasharray="2 2" />
            <line x1="35" y1="65" x2="340" y2="65" stroke="#E2E8F0" strokeDasharray="2 2" />
            <line x1="35" y1="115" x2="340" y2="115" stroke="#E2E8F0" strokeDasharray="2 2" />
            <line x1="35" y1="135" x2="340" y2="135" stroke="#94A3B8" strokeWidth="1" />
            <line x1="35" y1="15" x2="35" y2="135" stroke="#94A3B8" strokeWidth="1" />

            <text x="30" y="19" textAnchor="end" fontSize="8" fill="#64748B">1.0</text>
            <text x="30" y="69" textAnchor="end" fontSize="8" fill="#64748B">0.5</text>
            <text x="30" y="139" textAnchor="end" fontSize="8" fill="#64748B">0.0</text>

            <text x="35" y="148" textAnchor="middle" fontSize="8" fill="#64748B">0.0</text>
            <text x="187" y="148" textAnchor="middle" fontSize="8" fill="#64748B">0.5</text>
            <text x="340" y="148" textAnchor="middle" fontSize="8" fill="#64748B">1.0</text>

            {/* 1:1 Diagonal */}
            <line x1="35" y1="135" x2="340" y2="15" stroke="#94A3B8" strokeDasharray="3 3" />

            {/* HyBlend curve */}
            <polyline points="35,135 96,112 157,88 218,62 279,38 340,18" fill="none" stroke="#2563EB" strokeWidth="2.5" />
            <circle cx="218" cy="62" r="3.5" fill="#2563EB" />

            {/* NEPS curve */}
            <polyline points="35,135 96,118 157,96 218,74 279,52 340,32" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* AIFS curve */}
            <polyline points="35,135 96,122 157,102 218,82 279,64 340,45" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>

          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '4px' }}>
            <span style={{ color: '#2563EB', fontWeight: 600 }}>● Hybrid Blend (HyBlend)</span>
            <span style={{ color: '#059669' }}>● NEPS</span>
            <span style={{ color: '#F59E0B' }}>● AIFS</span>
            <span>-- Perfect Reliability</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Skill vs Lead Time (Col 4) | Regional Matrix (Col 4) | Ablation Study (Col 4) */}
      <div className="grid-12">
        {/* Skill vs Lead Time */}
        <div className="col-span-4 card-standard">
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.65rem' }}>
            Skill vs. Lead Time (CRPS, lower is better)
          </span>

          <svg viewBox="0 0 320 140" style={{ width: '100%', height: 'auto' }}>
            <line x1="30" y1="15" x2="300" y2="15" stroke="#E2E8F0" strokeDasharray="2 2" />
            <line x1="30" y1="55" x2="300" y2="55" stroke="#E2E8F0" strokeDasharray="2 2" />
            <line x1="30" y1="95" x2="300" y2="95" stroke="#E2E8F0" strokeDasharray="2 2" />
            <line x1="30" y1="115" x2="300" y2="115" stroke="#94A3B8" strokeWidth="1" />

            <text x="25" y="19" textAnchor="end" fontSize="8" fill="#64748B">0.4</text>
            <text x="25" y="59" textAnchor="end" fontSize="8" fill="#64748B">0.3</text>
            <text x="25" y="99" textAnchor="end" fontSize="8" fill="#64748B">0.2</text>
            <text x="25" y="119" textAnchor="end" fontSize="8" fill="#64748B">0.1</text>

            <text x="40" y="128" textAnchor="middle" fontSize="8" fill="#64748B">24h</text>
            <text x="105" y="128" textAnchor="middle" fontSize="8" fill="#64748B">48h</text>
            <text x="170" y="128" textAnchor="middle" fontSize="8" fill="#64748B">72h</text>
            <text x="235" y="128" textAnchor="middle" fontSize="8" fill="#64748B">96h</text>
            <text x="290" y="128" textAnchor="middle" fontSize="8" fill="#64748B">120h</text>

            {/* GFS line */}
            <polyline points="40,90 105,75 170,55 235,40 290,28" fill="none" stroke="#64748B" strokeWidth="1.5" />
            {/* NCUM line */}
            <polyline points="40,96 105,82 170,68 235,52 290,42" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="2 2" />
            {/* IFS line */}
            <polyline points="40,102 105,88 170,74 235,62 290,50" fill="none" stroke="#7C3AED" strokeWidth="1.5" />
            {/* HyBlend line */}
            <polyline points="40,110 105,98 170,86 235,76 290,68" fill="none" stroke="#2563EB" strokeWidth="2.5" />
          </svg>

          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '2px', flexWrap: 'wrap' }}>
            <span style={{ color: '#2563EB', fontWeight: 600 }}>● HyBlend (Lowest CRPS)</span>
            <span style={{ color: '#7C3AED' }}>● IFS</span>
            <span style={{ color: '#059669' }}>● NCUM</span>
            <span style={{ color: '#64748B' }}>● GFS</span>
          </div>
        </div>

        {/* Regional Performance Matrix */}
        <div className="col-span-4 card-standard">
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.5rem' }}>
            Regional Performance (CRPS, 72h)
          </span>

          <table style={{ width: '100%', fontSize: '0.72rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '3px 5px', textAlign: 'left' }}>Region</th>
                <th style={{ padding: '3px 5px' }}>NCUM</th>
                <th style={{ padding: '3px 5px' }}>NEPS</th>
                <th style={{ padding: '3px 5px' }}>IFS</th>
                <th style={{ padding: '3px 5px', color: '#2563EB', fontWeight: 700 }}>Blend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { reg: 'Northwest India', ncum: 0.21, neps: 0.19, ifs: 0.20, blend: 0.16 },
                { reg: 'Indo-Gangetic', ncum: 0.18, neps: 0.16, ifs: 0.17, blend: 0.13 },
                { reg: 'Central India', ncum: 0.20, neps: 0.18, ifs: 0.19, blend: 0.14 },
                { reg: 'Northeast India', ncum: 0.28, neps: 0.25, ifs: 0.27, blend: 0.21 },
                { reg: 'Western Ghats', ncum: 0.32, neps: 0.29, ifs: 0.31, blend: 0.24 },
                { reg: 'Peninsular India', ncum: 0.24, neps: 0.22, ifs: 0.23, blend: 0.18 },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '3px 5px', fontWeight: 500 }}>{r.reg}</td>
                  <td style={{ padding: '3px 5px', textAlign: 'center' }}>{r.ncum}</td>
                  <td style={{ padding: '3px 5px', textAlign: 'center' }}>{r.neps}</td>
                  <td style={{ padding: '3px 5px', textAlign: 'center' }}>{r.ifs}</td>
                  <td style={{ padding: '3px 5px', textAlign: 'center', background: '#EFF6FF', fontWeight: 700, color: '#2563EB' }}>
                    {r.blend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ablation Study */}
        <div className="col-span-4 card-standard">
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.4rem' }}>
            Ablation Study (Effect on CRPS)
          </span>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
            Validates necessity of each gating component
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem' }}>
            {[
              { label: 'Full System (HyBlend)', val: 0.137, color: '#2563EB' },
              { label: '– Remove Adaptive Weighting', val: 0.149, color: '#64748B' },
              { label: '– Remove Regime Features', val: 0.152, color: '#64748B' },
              { label: '– Remove Disagreement Spread', val: 0.156, color: '#64748B' },
              { label: '– Remove Brier Calibration', val: 0.161, color: '#64748B' },
              { label: 'Equal Weight Simple Baseline', val: 0.151, color: '#94A3B8' },
            ].map((row, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                  <span>{row.label}</span>
                  <strong>{row.val}</strong>
                </div>
                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(row.val / 0.18) * 100}%`, height: '100%', background: row.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
