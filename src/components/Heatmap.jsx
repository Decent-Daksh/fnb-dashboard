import React from 'react';

const COLOR_STOPS = ['#eef2f7', '#dbeafe', '#bfdbfe', '#93c5fd', '#3b82f6', '#1e40af'];
const DARK_COLOR_STOPS = ['#1f2c46', '#1e3a8a', '#1d4ed8', '#3b82f6', '#60a5fa', '#bfdbfe'];

export default function Heatmap({ rows, hours }) {
  // rows: [{ day, cells: [{ hour, value }] }]
  const allValues = rows.flatMap((r) => r.cells.map((c) => c.value));
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';
  const stops = isDark ? DARK_COLOR_STOPS : COLOR_STOPS;

  const colorFor = (v) => {
    const t = (v - min) / (max - min || 1);
    const idx = Math.min(stops.length - 1, Math.floor(t * stops.length));
    return stops[idx];
  };

  const grid = `60px repeat(${hours.length}, minmax(0, 1fr))`;
  return (
    <div>
      <div className="heatmap" style={{ gridTemplateColumns: grid }}>
        <div></div>
        {hours.map((h) => <div key={h} style={{ textAlign: 'center', padding: '0 2px' }}>{h}</div>)}
        {rows.map((row) => (
          <React.Fragment key={row.day}>
            <div style={{ alignSelf: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>{row.day}</div>
            {row.cells.map((c) => {
              const t = (c.value - min) / (max - min || 1);
              return (
                <div
                  key={c.hour + row.day}
                  className="heatmap__cell"
                  style={{ background: colorFor(c.value), color: t > 0.5 ? '#fff' : 'var(--text)' }}
                  title={`${row.day} ${c.hour}: $${c.value.toLocaleString()}`}
                >
                  {t > 0.65 ? `$${(c.value/1000).toFixed(1)}k` : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="heatmap__legend" style={{ marginTop: 10 }}>
        <span>Low</span>
        <div className="heatmap__legend-bar">
          {stops.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
        </div>
        <span>Peak (${max.toLocaleString()})</span>
      </div>
    </div>
  );
}
