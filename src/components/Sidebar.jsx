import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from './Icons.jsx';
import { DOMAINS } from '../data/kpis.js';

const ICON_MAP = {
  currency: Icon.currency, gauge: Icon.gauge, menu: Icon.menu,
  users: Icon.users, heart: Icon.heart, box: Icon.box, trending: Icon.trending,
};

export default function Sidebar({ alertCount, open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">M</div>
        <div>
          <div className="sidebar__title">Mezze & Co.</div>
          <div className="sidebar__subtitle">F&B Intelligence</div>
        </div>
      </div>

      <NavLink to="/" end className={({ isActive }) => `navlink ${isActive ? 'navlink--active' : ''}`} onClick={onClose}>
        <Icon.home className="navlink__icon" /> Command Centre
      </NavLink>

      <div className="sidebar__group">Domains</div>
      {DOMAINS.map((d) => {
        const I = ICON_MAP[d.icon] || Icon.gauge;
        return (
          <NavLink key={d.id} to={`/d/${d.id}`} onClick={onClose}
            className={({ isActive }) => `navlink ${isActive ? 'navlink--active' : ''}`}>
            <I className="navlink__icon" /> {d.name}
          </NavLink>
        );
      })}

      <div className="sidebar__group">Tools</div>
      <NavLink to="/alerts" className={({ isActive }) => `navlink ${isActive ? 'navlink--active' : ''}`} onClick={onClose}>
        <Icon.bell className="navlink__icon" /> Smart Alerts
        {alertCount > 0 && <span className="navlink__badge">{alertCount}</span>}
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `navlink ${isActive ? 'navlink--active' : ''}`} onClick={onClose}>
        <Icon.zap className="navlink__icon" /> Demo Controls
      </NavLink>

      <div className="sidebar__footer">
        80-seat bistro · Lisbon<br/>v1.0 · Selection prototype
      </div>
    </aside>
  );
}
