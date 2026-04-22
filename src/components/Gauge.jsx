import React from 'react';

/** Half-circle gauge using SVG. */
export default function Gauge({ value, min = 0, max = 100, label, color = 'var(--brand)', formatVal = (v) => v.toFixed(0) }) {
  const v = Math.max(min, Math.min(max, value));
  const pct = (v - min) / (max - min);
  const angle = -180 + pct * 180; // -180 left to 0 right (top of arc)

  const cx = 100, cy = 100, r = 80;
  const a1 = (-180 * Math.PI) / 180;
  const a2 = (angle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
  const largeArc = pct > 0.5 ? 1 : 0;

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 120" width="100%">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              stroke="var(--bg-sunken)" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
              stroke={color} strokeWidth="14" fill="none" strokeLinecap="round" />
      </svg>
      <div className="gauge__value">
        <div className="gauge__num">{formatVal(v)}</div>
        <div className="gauge__label">{label}</div>
      </div>
    </div>
  );
}
