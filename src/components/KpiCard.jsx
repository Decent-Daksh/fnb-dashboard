import React from 'react';
import Sparkline from './Sparkline.jsx';
import { Icon } from './Icons.jsx';
import { formatValue, computeStatus, deltaPct, isImprovement } from '../utils/format.js';

const STATUS_LABEL = { ok: 'On Target', warn: 'Watch', bad: 'Alert' };
const STATUS_COLOR = {
  ok: 'var(--ok)', warn: 'var(--warn)', bad: 'var(--bad)',
};

export default function KpiCard({ kpi, value, prev, spark, period = 'today', alertActive = false }) {
  const status = computeStatus(kpi, value);
  const dPct = deltaPct(value, prev);
  const improved = isImprovement(kpi, dPct);
  const trendClass = Math.abs(dPct) < 0.5 ? 'delta--flat' : improved ? 'delta--up' : 'delta--down';
  const TrendArrow = Math.abs(dPct) < 0.5 ? Icon.arrowFlat : (dPct > 0 ? Icon.arrowUp : Icon.arrowDown);
  const periodLabel = period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month';

  return (
    <div className="kpi-card" title={`${kpi.name} — ${kpi.formula}`}>
      <div className="kpi-card__head">
        <span className={`tier-tag tier--${kpi.tier === 'SmartAlert' ? 'SmartAlert' : kpi.tier}`}>
          {kpi.tier === 'SmartAlert' ? 'Alert' : kpi.tier.slice(0, 4)}
        </span>
        <span className="kpi-card__name" title={kpi.name}>{kpi.shortName}</span>
        {alertActive && (
          <span className="kpi-card__alert" aria-label="Alert active">
            <Icon.bell size={14} />
          </span>
        )}
      </div>

      <div className="kpi-card__value-row">
        <div className="kpi-card__value">{formatValue(kpi, value)}</div>
        {Math.abs(dPct) >= 0.1 && (
          <span className={`kpi-card__delta ${trendClass}`} title={`vs previous ${period}`}>
            <TrendArrow size={12} /> {Math.abs(dPct).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="kpi-card__bottom">
        <span className="status-dot" style={{ color: STATUS_COLOR[status] }} aria-label={STATUS_LABEL[status]}>
          {STATUS_LABEL[status]}
        </span>
        {spark && spark.length > 1 && (
          <div style={{ color: STATUS_COLOR[status] }}>
            <Sparkline data={spark} stroke={STATUS_COLOR[status]} />
          </div>
        )}
      </div>

      <div className="kpi-card__benchmark">
        <span style={{ color: 'var(--text-subtle)' }}>{periodLabel} · </span>
        <span style={{ color: 'var(--text-muted)' }}>Bench: {kpi.benchmark}</span>
      </div>
    </div>
  );
}
