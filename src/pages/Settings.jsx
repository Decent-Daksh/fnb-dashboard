import React from 'react';
import { ALL_SMART_ALERT_KPIS } from '../data/alerts.js';
import { Icon } from '../components/Icons.jsx';

export default function Settings({ sim, toggleSim }) {
  return (
    <div className="page">
      <div className="section__head">
        <div>
          <h2 className="section__title">Demo Controls</h2>
          <p className="muted">Simulate SmartAlert breaches to see the cockpit react in real time.</p>
        </div>
      </div>

      <div className="panel">
        <h3 className="panel__title">Simulated alerts</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Toggle any of the 18 SmartAlert KPIs. The Command Centre badge, sidebar count, and Alerts feed update instantly.
        </p>
        <div className="grid grid--two" style={{ gap: 8, marginTop: 12 }}>
          {ALL_SMART_ALERT_KPIS.map((k) => (
            <label key={k.id} className="toggle-row">
              <input type="checkbox" checked={!!sim[k.id]} onChange={() => toggleSim(k.id)} />
              <div>
                <div style={{ fontWeight: 600 }}>{k.shortName}</div>
                <div className="muted" style={{ fontSize: 12 }}>{k.alert?.threshold}</div>
              </div>
              <span className="muted" style={{ marginLeft: 'auto', fontSize: 11, textTransform: 'uppercase' }}>{k.domain}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h3 className="panel__title">About this prototype</h3>
        <p className="muted">
          Mezze & Co. is a fictional 80-seat Mediterranean bistro in Lisbon used to demonstrate a unified F&B intelligence dashboard.
          All data is generated locally with a deterministic seed — no backend, no telemetry. The dashboard surfaces 49 KPIs across
          7 domains with role-aware prioritisation (Manager vs Owner) and 18 threshold-driven Smart Alerts.
        </p>
        <ul className="muted" style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>React 18 + Vite (pure JavaScript, no TypeScript)</li>
          <li>Hand-written CSS with light/dark themes (no Tailwind)</li>
          <li>Recharts for line/bar/scatter/pie · custom SVG sparkline, gauge, and heatmap</li>
          <li>Local-storage persistence for theme, role, range, and acknowledgements</li>
        </ul>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h3 className="panel__title"><Icon.zap size={14} /> Tips</h3>
        <ul className="muted" style={{ paddingLeft: 20 }}>
          <li>Switch <strong>Manager → Owner</strong> in the topbar to see headline KPIs reorder.</li>
          <li>Switch <strong>Today / Week / Month</strong> to recompute every aggregate.</li>
          <li>Each domain page exports its KPIs as CSV.</li>
        </ul>
      </div>
    </div>
  );
}
