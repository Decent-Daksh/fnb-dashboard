import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icons.jsx';

export default function Topbar({
  title, subtitle, range, onRange, role, onRole, theme, onTheme,
  onMenu, alertCount,
}) {
  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenu} aria-label="Open menu">
        <Icon.burger />
      </button>
      <div>
        <div className="topbar__title">{title}</div>
        {subtitle && <div className="topbar__sub">{subtitle}</div>}
      </div>
      <div className="topbar__spacer" />

      <div className="segmented hide-mobile" role="tablist" aria-label="Time range">
        {[['today','Today'],['week','Week'],['month','Month']].map(([id, label]) => (
          <button key={id} className={`segmented__btn ${range === id ? 'segmented__btn--active' : ''}`} onClick={() => onRange(id)} role="tab">
            {label}
          </button>
        ))}
      </div>

      <div className="segmented" role="tablist" aria-label="Role">
        {[['manager','Manager'],['owner','Owner']].map(([id, label]) => (
          <button key={id} className={`segmented__btn ${role === id ? 'segmented__btn--active' : ''}`} onClick={() => onRole(id)} role="tab">
            {label}
          </button>
        ))}
      </div>

      <button className="icon-btn" onClick={onTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Icon.sun size={16} /> : <Icon.moon size={16} />}
      </button>
      <Link to="/alerts" className="icon-btn" aria-label="Smart alerts">
        <Icon.bell size={16} />
        {alertCount > 0 && <span className="icon-btn__badge">{alertCount}</span>}
      </Link>
    </header>
  );
}
