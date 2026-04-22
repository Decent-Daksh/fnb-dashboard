import React, { useState } from 'react';
import { Icon } from './Icons.jsx';

export default function AlertItem({ alert, onAck, acked }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`alert alert--${alert.severity} ${acked ? 'alert--ack' : ''}`}>
      <div className="alert__dot" />
      <div className="alert__body">
        <div className="alert__title">{alert.title}</div>
        <div className="alert__meta">
          <span>{alert.domain}</span>
          <span>·</span>
          <span>{alert.when}</span>
          <span>·</span>
          <span>{alert.threshold}</span>
        </div>
        {(open || acked) ? null : (
          <button className="btn btn--sm btn--ghost" onClick={() => setOpen(true)} style={{ marginTop: 6, padding: '2px 0' }}>
            See recommended action →
          </button>
        )}
        {open && !acked && (
          <div className="alert__action">{alert.action}</div>
        )}
      </div>
      {!acked && (
        <button className="alert__close" onClick={() => onAck(alert.id)} aria-label="Acknowledge">
          <Icon.check size={16} />
        </button>
      )}
    </div>
  );
}
