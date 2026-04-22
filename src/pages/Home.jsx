import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import KpiCard from '../components/KpiCard.jsx';
import AlertItem from '../components/AlertItem.jsx';
import Heatmap from '../components/Heatmap.jsx';
import Gauge from '../components/Gauge.jsx';
import { Icon } from '../components/Icons.jsx';
import { KPIS, DOMAINS } from '../data/kpis.js';
import { aggregate, DAYS, HEATMAP, HOURS, RESTAURANT } from '../data/seed.js';
import { fmtMoney, fmtPct, formatValue } from '../utils/format.js';

const HEADLINE_BY_ROLE = {
  manager: ['rev.attain', 'ops.ktt', 'staff.labpct', 'cust.nps', 'inv.foodcost', 'ord.error'],
  owner:   ['rev.attain', 'roi.prime', 'roi.ebitda', 'cust.return', 'inv.foodcost', 'roi.runway'],
};

export default function Home({ range, role, alerts, acked, ack }) {
  const navigate = useNavigate();
  const agg = useMemo(() => aggregate(range), [range]);

  const headlineIds = HEADLINE_BY_ROLE[role] || HEADLINE_BY_ROLE.manager;
  const headlines = headlineIds.map((id) => KPIS.find((k) => k.id === id));

  const trendData = DAYS.slice(range === 'today' ? -14 : range === 'week' ? -28 : -90).map((d) => ({
    date: d.label,
    Revenue: d.revenue,
    Target: d.targetRevenue,
  }));

  const channelData = [
    { name: 'Dine-in', value: agg.revenueByChannel.dineIn, color: 'var(--brand)' },
    { name: 'Delivery', value: agg.revenueByChannel.delivery, color: 'var(--accent)' },
    { name: 'Takeaway', value: agg.revenueByChannel.takeaway, color: 'var(--warn)' },
  ];

  const activeAlerts = alerts.filter((a) => !acked[a.id]).slice(0, 5);
  const attainPct = (agg.revenue / agg.target) * 100;

  return (
    <div className="page">
      {/* HERO STRIP */}
      <div className="grid grid--hero">
        <div className="panel panel--hero">
          <div className="hero__label">{range === 'today' ? "Today's Revenue" : range === 'week' ? 'This Week' : 'This Month'}</div>
          <div className="hero__value">{fmtMoney(agg.revenue)}</div>
          <div className="hero__sub">
            <span className={attainPct >= 90 ? 'pill pill--ok' : attainPct >= 75 ? 'pill pill--warn' : 'pill pill--bad'}>
              {fmtPct(attainPct, 0)} of target
            </span>
            <span className="muted">Target {fmtMoney(agg.target)} · {agg.covers.toLocaleString()} covers</span>
          </div>
        </div>
        <div className="panel panel--gauge">
          <Gauge
            value={attainPct}
            min={0}
            max={130}
            label="Target Attainment"
            color={attainPct >= 90 ? 'var(--ok)' : attainPct >= 75 ? 'var(--warn)' : 'var(--bad)'}
            formatVal={(v) => `${v.toFixed(0)}%`}
          />
        </div>
        <div className="panel panel--mini">
          <div className="mini__row">
            <Icon.users size={14} />
            <span>{RESTAURANT.staffHeadcount} staff</span>
          </div>
          <div className="mini__row">
            <Icon.gauge size={14} />
            <span>{RESTAURANT.seats} seats · {RESTAURANT.opHoursPerDay}h/day</span>
          </div>
          <div className="mini__row">
            <Icon.bell size={14} />
            <span>{activeAlerts.length} active alerts</span>
          </div>
          <div className="mini__row">
            <Icon.heart size={14} />
            <span>{RESTAURANT.city}</span>
          </div>
        </div>
      </div>

      {/* HEADLINE KPIs */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Headline KPIs · {role === 'manager' ? 'Manager view' : 'Owner view'}</h2>
          <span className="muted">6 priority signals</span>
        </div>
        <div className="grid grid--kpi">
          {headlines.map((k) => (
            <KpiCard
              key={k.id}
              kpi={k}
              value={agg.values[k.id]}
              prev={agg.prev[k.id]}
              spark={agg.sparks[k.id]}
              period={range}
              alertActive={alerts.some((a) => a.id === k.id && !acked[a.id])}
            />
          ))}
        </div>
      </section>

      {/* CHARTS ROW */}
      <section className="section grid grid--two">
        <div className="panel">
          <div className="panel__head">
            <h3 className="panel__title">Revenue vs Target</h3>
            <span className="muted">{trendData.length}-day trend</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8 }} formatter={(v) => `$${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="Target" stroke="var(--text-muted)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Revenue" stroke="var(--brand)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel__head">
            <h3 className="panel__title">Revenue by Channel</h3>
            <span className="muted">{range === 'today' ? 'Today' : range === 'week' ? 'Week' : 'Month'}</span>
          </div>
          <div className="grid grid--two" style={{ alignItems: 'center', gap: 12 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={channelData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {channelData.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8 }} formatter={(v) => `$${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div>
              {channelData.map((c) => (
                <div key={c.name} className="legend__row">
                  <span className="legend__dot" style={{ background: c.color }} />
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <strong>{fmtMoney(c.value)}</strong>
                  <span className="muted" style={{ marginLeft: 6 }}>
                    {((c.value / agg.revenue) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ALERTS + HEATMAP */}
      <section className="section grid grid--two">
        <div className="panel">
          <div className="panel__head">
            <h3 className="panel__title">Smart Alerts</h3>
            <button className="btn btn--sm btn--ghost" onClick={() => navigate('/alerts')}>View all →</button>
          </div>
          {activeAlerts.length === 0 ? (
            <div className="empty">
              <Icon.check size={28} />
              <p>All systems within thresholds.</p>
            </div>
          ) : (
            <div className="alert-list">
              {activeAlerts.map((a) => (
                <AlertItem key={a.id} alert={a} onAck={ack} acked={!!acked[a.id]} />
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel__head">
            <h3 className="panel__title">Revenue Heatmap</h3>
            <span className="muted">Last 7 days · 12p–10p</span>
          </div>
          <Heatmap rows={HEATMAP} hours={HOURS} />
        </div>
      </section>

      {/* DOMAIN SHORTCUTS */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Browse by Domain</h2>
          <span className="muted">{KPIS.length} KPIs · 7 domains</span>
        </div>
        <div className="grid grid--domain">
          {DOMAINS.map((d) => {
            const count = KPIS.filter((k) => k.domain === d.id).length;
            const alertCount = alerts.filter((a) => a.domain.toLowerCase().startsWith(d.id.slice(0, 4)) && !acked[a.id]).length;
            return (
              <button key={d.id} className="domain-card" onClick={() => navigate(`/d/${d.id}`)}>
                <div className="domain-card__name">{d.name}</div>
                <div className="domain-card__meta">
                  <span>{count} KPIs</span>
                  {alertCount > 0 && <span className="pill pill--bad">{alertCount} alert{alertCount > 1 ? 's' : ''}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
