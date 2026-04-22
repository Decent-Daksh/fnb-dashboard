import React, { useState } from 'react';
import AlertItem from '../components/AlertItem.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Alerts({ alerts, acked, ack, unackAll }) {
  const [filter, setFilter] = useState('active'); // active | all | ack

  const filtered = alerts.filter((a) => {
    if (filter === 'active') return !acked[a.id];
    if (filter === 'ack') return acked[a.id];
    return true;
  });

  const counts = {
    active: alerts.filter((a) => !acked[a.id]).length,
    ack: alerts.filter((a) => acked[a.id]).length,
    all: alerts.length,
  };

  return (
    <div className="page">
      <div className="section__head">
        <div>
          <h2 className="section__title">Smart Alerts feed</h2>
          <p className="muted">Threshold-driven signals from 18 SmartAlert KPIs</p>
        </div>
        <button className="btn btn--sm btn--ghost" onClick={unackAll}>
          <Icon.zap size={14} /> Reset acknowledgements
        </button>
      </div>

      <div className="segmented" style={{ marginBottom: 12 }}>
        {[['active', `Active (${counts.active})`], ['ack', `Acknowledged (${counts.ack})`], ['all', `All (${counts.all})`]].map(([id, label]) => (
          <button key={id} className={`segmented__btn ${filter === id ? 'segmented__btn--active' : ''}`} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="panel empty">
          <Icon.check size={40} />
          <h3>Nothing here</h3>
          <p className="muted">
            {filter === 'active'
              ? 'No active alerts — all SmartAlert KPIs are within thresholds.'
              : filter === 'ack'
              ? 'No alerts have been acknowledged yet.'
              : 'No alerts to show.'}
          </p>
          {filter === 'active' && (
            <p className="muted" style={{ fontSize: 13 }}>
              Try the <strong>Demo Controls</strong> to simulate an alert.
            </p>
          )}
        </div>
      ) : (
        <div className="panel">
          <div className="alert-list">
            {filtered.map((a) => (
              <AlertItem key={a.id} alert={a} onAck={ack} acked={!!acked[a.id]} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
