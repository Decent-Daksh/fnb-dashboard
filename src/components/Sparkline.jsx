import React from 'react';

/** Tiny pure-SVG sparkline. Avoids Recharts for perf on many cards. */
export default function Sparkline({ data = [], stroke = 'var(--brand)', fill = 'none', height = 32 }) {
  if (!data.length) return null;
  const w = 110, h = height, pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1 || 1);
  const points = data.map((d, i) => {
    const x = pad + i * step;
    const y = h - pad - ((d - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${path} L${points[points.length - 1][0]},${h} L${points[0][0]},${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="kpi-card__sparkline">
      <path d={area} fill={fill === 'none' ? 'currentColor' : fill} opacity="0.12" />
      <path d={path} stroke={stroke} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
