import React from 'react';
import { useForecast, LeadTimeOption, VariableOption } from '../context/ForecastContext';
import { CloudRain, Thermometer, Wind, AlertOctagon } from 'lucide-react';

export const FilterStrip: React.FC = () => {
  const { leadTime, setLeadTime, variable, setVariable } = useForecast();

  const leadTimeOptions: { id: LeadTimeOption; label: string; desc: string }[] = [
    { id: 'day-1', label: 'Day 1', desc: 'T+24h horizon' },
    { id: 'day-3', label: 'Day 3', desc: 'T+72h horizon' },
    { id: 'day-5', label: 'Day 5', desc: 'T+120h horizon' },
    { id: 'day-7', label: 'Day 7', desc: 'T+168h horizon' },
  ];

  const variableOptions: { id: VariableOption; label: string; icon: React.ReactNode }[] = [
    { id: 'rainfall', label: 'Rainfall', icon: <CloudRain size={14} /> },
    { id: 'temperature', label: 'Temperature', icon: <Thermometer size={14} /> },
    { id: 'wind', label: 'Wind', icon: <Wind size={14} /> },
    { id: 'extreme', label: 'Extreme Event', icon: <AlertOctagon size={14} /> },
  ];

  return (
    <div className="filter-strip">
      <div className="filter-strip-inner">
        {/* Lead time filter */}
        <div className="filter-group">
          <span className="filter-label">Lead time:</span>
          <div className="pill-button-group">
            {leadTimeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pill-btn ${leadTime === opt.id ? 'active' : ''}`}
                onClick={() => setLeadTime(opt.id)}
                title={opt.desc}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Variable filter */}
        <div className="filter-group">
          <span className="filter-label">Forecast variable:</span>
          <div className="pill-button-group">
            {variableOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pill-btn ${variable === opt.id ? 'active' : ''}`}
                onClick={() => setVariable(opt.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
