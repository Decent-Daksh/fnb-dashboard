import React, { useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import KpiCard from '../components/KpiCard.jsx';
import { DOMAINS, KPIS, getKpisByDomain } from '../data/kpis.js';
import { aggregate, MENU_ITEMS, QUADRANT_COLORS, STAFF, SUPPLIERS, MARKETING, RECENT_REVIEWS, EIGHTY_SIX_EVENTS, RESTAURANT } from '../data/seed.js';
import { fmtMoney, fmtPct, downloadCSV } from '../utils/format.js';
import { Icon } from '../components/Icons.jsx';

export default function Domain({ range, role }) {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const domain = DOMAINS.find((d) => d.id === domainId);
  const agg = useMemo(() => aggregate(range), [range]);

  if (!domain) return <Navigate to="/" replace />;

  const kpis = getKpisByDomain(domainId);
  // Sort: SmartAlert > Operational > Strategic, but role-relevant first
  const sorted = [...kpis].sort((a, b) => {
    const tierRank = { SmartAlert: 0, Operational: 1, Strategic: 2 };
    const aRole = a.role === role || a.role === 'both' ? 0 : 1;
    const bRole = b.role === role || b.role === 'both' ? 0 : 1;
    if (aRole !== bRole) return aRole - bRole;
    return tierRank[a.tier] - tierRank[b.tier];
  });

  const exportCsv = () => {
    const rows = [['KPI', 'Value', 'Previous', 'Status', 'Tier', 'Benchmark']];
    sorted.forEach((k) => {
      const v = agg.values[k.id];
      const p = agg.prev[k.id];
      rows.push([k.name, v?.toFixed(2), p?.toFixed(2), k.tier, k.tier, k.benchmark]);
    });
    downloadCSV(`mezze-${domainId}-${range}.csv`, rows);
  };

  return (
    <div className="page">
      <div className="breadcrumbs">
        <button className="link" onClick={() => navigate('/')}>← Command Centre</button>
      </div>

      <div className="section__head">
        <div>
          <h2 className="section__title">{domain.name}</h2>
          <p className="muted">{kpis.length} KPIs · sorted for {role === 'manager' ? 'Manager' : 'Owner'} priority</p>
        </div>
        <button className="btn btn--sm" onClick={exportCsv}>
          <Icon.download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid--kpi">
        {sorted.map((k) => (
          <KpiCard
            key={k.id}
            kpi={k}
            value={agg.values[k.id]}
            prev={agg.prev[k.id]}
            spark={agg.sparks[k.id]}
            period={range}
          />
        ))}
      </div>

      {/* Domain-specific deep panels */}
      {domainId === 'orders' && <MenuEngineering />}
      {domainId === 'staff' && <StaffPanel />}
      {domainId === 'inventory' && <InventoryPanel />}
      {domainId === 'customer' && <CustomerPanel />}
      {domainId === 'roi' && <RoiPanel />}
      {domainId === 'revenue' && <RevenueChannelPanel agg={agg} />}
      {domainId === 'operations' && <OperationsPanel />}
    </div>
  );
}

function MenuEngineering() {
  const data = MENU_ITEMS.map((m) => ({
    ...m,
    margin: ((m.price - m.foodCost) / m.price) * 100,
    revenue: m.price * m.units,
  }));
  return (
    <section className="section">
      <div className="section__head">
        <h3 className="section__title">Menu Engineering Matrix</h3>
        <span className="muted">Margin × Popularity · 12 items</span>
      </div>
      <div className="grid grid--two">
        <div className="panel">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="var(--border)" />
              <XAxis type="number" dataKey="units" name="Units sold" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} label={{ value: 'Units sold', position: 'insideBottom', offset: -2, fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis type="number" dataKey="margin" name="Margin %" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} unit="%" />
              <ZAxis range={[80, 80]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8 }}
                formatter={(v, k) => k === 'margin' ? `${v.toFixed(1)}%` : v} labelFormatter={(_, p) => p?.[0]?.payload?.name || ''} />
              <Scatter data={data}>
                {data.map((m, i) => <Cell key={i} fill={QUADRANT_COLORS[m.quadrant]} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="legend__row" style={{ marginTop: 8, gap: 14, flexWrap: 'wrap' }}>
            {Object.entries(QUADRANT_COLORS).map(([q, c]) => (
              <span key={q} className="legend__row" style={{ gap: 6, flex: '0 0 auto' }}>
                <span className="legend__dot" style={{ background: c }} /> {q}
              </span>
            ))}
          </div>
        </div>
        <div className="panel">
          <table className="table">
            <thead><tr><th>Item</th><th>Margin %</th><th>Units</th><th>Class</th></tr></thead>
            <tbody>
              {data.sort((a, b) => b.revenue - a.revenue).map((m) => (
                <tr key={m.id}>
                  <td>{m.name}<div className="muted" style={{ fontSize: 11 }}>{m.category}</div></td>
                  <td>{m.margin.toFixed(0)}%</td>
                  <td>{m.units}</td>
                  <td><span className="pill" style={{ background: QUADRANT_COLORS[m.quadrant], color: '#fff' }}>{m.quadrant}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <h4 className="panel__title">Recent 86 Events</h4>
        <table className="table">
          <thead><tr><th>Day</th><th>Item</th><th>Cause</th></tr></thead>
          <tbody>
            {EIGHTY_SIX_EVENTS.map((e, i) => (
              <tr key={i}><td>{e.date}d</td><td>{e.item}</td><td className="muted">{e.cause}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StaffPanel() {
  return (
    <section className="section">
      <div className="section__head">
        <h3 className="section__title">Staff Roster · {STAFF.length} active</h3>
        <span className="muted">Headcount {RESTAURANT.staffHeadcount}</span>
      </div>
      <div className="panel">
        <table className="table">
          <thead><tr><th>Name</th><th>Role</th><th>Shifts</th><th>No-shows</th><th>Training hrs</th><th>Tenure</th></tr></thead>
          <tbody>
            {STAFF.map((s) => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td>{s.role}</td>
                <td>{s.shifts}</td>
                <td>{s.noShows > 0 ? <span className="pill pill--warn">{s.noShows}</span> : '0'}</td>
                <td>{s.training}h</td>
                <td>{s.tenureMo} mo</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InventoryPanel() {
  return (
    <section className="section">
      <div className="section__head">
        <h3 className="section__title">Suppliers</h3>
        <span className="muted">{SUPPLIERS.length} active</span>
      </div>
      <div className="panel">
        <table className="table">
          <thead><tr><th>Supplier</th><th>On-time %</th><th>Late orders</th><th>Monthly spend</th></tr></thead>
          <tbody>
            {SUPPLIERS.map((s) => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td>{s.onTime >= 95 ? <span className="pill pill--ok">{s.onTime}%</span> : s.onTime >= 90 ? <span className="pill pill--warn">{s.onTime}%</span> : <span className="pill pill--bad">{s.onTime}%</span>}</td>
                <td>{s.lateOrders}</td>
                <td>{fmtMoney(s.monthlySpend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CustomerPanel() {
  return (
    <section className="section">
      <div className="section__head">
        <h3 className="section__title">Recent Reviews</h3>
        <span className="muted">Online review velocity</span>
      </div>
      <div className="grid grid--two">
        {RECENT_REVIEWS.map((r, i) => (
          <div key={i} className="panel">
            <div className="legend__row" style={{ marginBottom: 6 }}>
              <span className="pill" style={{ background: r.rating >= 4 ? 'var(--ok)' : r.rating >= 3 ? 'var(--warn)' : 'var(--bad)', color: '#fff' }}>★ {r.rating}</span>
              <span className="muted">{r.src}</span>
              <span className="muted" style={{ marginLeft: 'auto' }}>{r.when}</span>
            </div>
            <p style={{ margin: 0 }}>"{r.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoiPanel() {
  const data = MARKETING.map((m) => ({
    ...m,
    roi: ((m.attributedRev - m.spend) / m.spend) * 100,
  }));
  return (
    <section className="section">
      <div className="section__head">
        <h3 className="section__title">Marketing ROI by Channel</h3>
        <span className="muted">Last 30 days</span>
      </div>
      <div className="panel">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="channel" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8 }} formatter={(v) => `${v.toFixed(0)}%`} />
            <Bar dataKey="roi" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.roi >= 300 ? 'var(--ok)' : d.roi >= 150 ? 'var(--warn)' : 'var(--bad)'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <table className="table" style={{ marginTop: 10 }}>
          <thead><tr><th>Channel</th><th>Spend</th><th>Attributed Rev</th><th>ROI</th></tr></thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.channel}>
                <td>{d.channel}</td>
                <td>{fmtMoney(d.spend)}</td>
                <td>{fmtMoney(d.attributedRev)}</td>
                <td><strong>{d.roi.toFixed(0)}%</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RevenueChannelPanel({ agg }) {
  const total = agg.revenue;
  const data = [
    { name: 'Dine-in', value: agg.revenueByChannel.dineIn },
    { name: 'Delivery', value: agg.revenueByChannel.delivery },
    { name: 'Takeaway', value: agg.revenueByChannel.takeaway },
  ];
  return (
    <section className="section">
      <div className="section__head">
        <h3 className="section__title">Channel breakdown</h3>
        <span className="muted">{fmtMoney(total)} total</span>
      </div>
      <div className="panel">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, top: 8, right: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={(v) => `$${v / 1000}k`} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'var(--text)' }} />
            <Tooltip contentStyle={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8 }} formatter={(v) => fmtMoney(v)} />
            <Bar dataKey="value" fill="var(--brand)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function OperationsPanel() {
  return (
    <section className="section">
      <div className="panel">
        <h3 className="panel__title">Operations narrative</h3>
        <p className="muted">
          Kitchen & service flow signals — kitchen ticket time and delivery durations are the leading indicators.
          When dwell time drifts above target during peak, FOH should accelerate dessert/check delivery to protect turnover.
        </p>
      </div>
    </section>
  );
}
