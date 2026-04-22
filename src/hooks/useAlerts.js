import { useEffect, useState, useCallback } from 'react';

const KEY = 'mezze.alerts.ack';

export function useAcknowledgedAlerts() {
  const [acked, setAcked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(acked)); }, [acked]);

  const ack = useCallback((id) => setAcked((a) => ({ ...a, [id]: true })), []);
  const unackAll = useCallback(() => setAcked({}), []);
  return [acked, ack, unackAll];
}

const SIM_KEY = 'mezze.alerts.sim';
export function useSimulatedAlerts() {
  const [sim, setSim] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SIM_KEY) || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem(SIM_KEY, JSON.stringify(sim)); }, [sim]);
  const toggle = useCallback((id) => setSim((s) => ({ ...s, [id]: !s[id] })), []);
  return [sim, toggle];
}
