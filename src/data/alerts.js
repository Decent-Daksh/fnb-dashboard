import { SMART_ALERT_KPIS } from './kpis.js';
import { aggregate } from './seed.js';
import { computeStatus } from '../utils/format.js';

/**
 * Build the active alert feed from the 18 SmartAlert KPIs.
 * - An alert is "naturally" active when current value breaches threshold (status === 'bad' or 'warn')
 * - Plus simulated alerts (manually toggled in demo controls) are forced active.
 */
export function buildAlerts({ range = 'today', simulated = {} } = {}) {
  const agg = aggregate(range);
  const minutesAgo = (m) => `${m} min ago`;
  const list = SMART_ALERT_KPIS.map((k, i) => {
    const v = agg.values[k.id];
    const status = computeStatus(k, v);
    const naturallyActive = status === 'bad' || (status === 'warn' && k.alert?.severity === 'warn');
    const active = simulated[k.id] || naturallyActive;
    if (!active) return null;
    return {
      id: k.id,
      title: `${k.shortName}: ${k.alert?.threshold || 'threshold breached'}`,
      domain: k.domain[0].toUpperCase() + k.domain.slice(1),
      severity: simulated[k.id] ? 'bad' : (status === 'bad' ? 'bad' : 'warn'),
      threshold: k.alert?.threshold || '',
      action: k.alert?.action || 'Investigate immediately.',
      when: minutesAgo([5, 12, 24, 38, 47, 61, 73, 92, 118][i % 9]),
    };
  }).filter(Boolean);
  // Sort by severity then time
  const sevRank = { bad: 0, warn: 1, info: 2 };
  return list.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);
}

export const ALL_SMART_ALERT_KPIS = SMART_ALERT_KPIS;
