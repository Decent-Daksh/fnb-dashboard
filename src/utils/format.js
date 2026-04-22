// Utility formatters
export const fmtMoney = (n, currency = '$') => {
  if (n == null) return '—';
  if (Math.abs(n) >= 1000) return `${currency}${(n / 1000).toFixed(1)}k`;
  return `${currency}${n.toFixed(0)}`;
};

export const fmtPct = (n, d = 1) => (n == null ? '—' : `${n.toFixed(d)}%`);
export const fmtNum = (n, d = 0) => (n == null ? '—' : n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }));
export const fmtMin = (n) => (n == null ? '—' : `${n.toFixed(0)} min`);
export const fmtX = (n, d = 1) => (n == null ? '—' : `${n.toFixed(d)}×`);

export const formatValue = (kpi, value) => {
  switch (kpi.unit) {
    case 'pct': return fmtPct(value, kpi.dp ?? 1);
    case 'money': return fmtMoney(value);
    case 'min': return fmtMin(value);
    case 'x': return fmtX(value, kpi.dp ?? 1);
    case 'count': return fmtNum(value, 0);
    case 'days': return `${value.toFixed(0)} d`;
    case 'score': return value.toFixed(0);
    default: return value?.toFixed?.(kpi.dp ?? 1) ?? value;
  }
};

export const computeStatus = (kpi, value) => {
  // returns 'ok' | 'warn' | 'bad'
  if (!kpi.target) return 'ok';
  const t = kpi.target;
  // Higher-is-better
  if (kpi.direction === 'up') {
    if (value >= t.good) return 'ok';
    if (value >= t.warn) return 'warn';
    return 'bad';
  }
  // Lower-is-better
  if (value <= t.good) return 'ok';
  if (value <= t.warn) return 'warn';
  return 'bad';
};

export const deltaPct = (current, prev) => {
  if (!prev || !current) return 0;
  return ((current - prev) / prev) * 100;
};

export const trendForKpi = (kpi, deltaPct) => {
  // Return 'up' | 'down' | 'flat'. Color-meaning depends on direction.
  if (Math.abs(deltaPct) < 0.5) return 'flat';
  return deltaPct > 0 ? 'up' : 'down';
};

export const isImprovement = (kpi, deltaPct) => {
  if (Math.abs(deltaPct) < 0.5) return null;
  return kpi.direction === 'up' ? deltaPct > 0 : deltaPct < 0;
};

export const downloadCSV = (filename, rows) => {
  const csv = rows.map((r) => r.map((c) => {
    const s = c == null ? '' : String(c);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};
