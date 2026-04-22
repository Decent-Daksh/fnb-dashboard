import React, { useMemo, useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import { useTheme } from './hooks/useTheme.js';
import { useAcknowledgedAlerts, useSimulatedAlerts } from './hooks/useAlerts.js';
import { buildAlerts } from './data/alerts.js';
import { DOMAINS } from './data/kpis.js';

import Home from './pages/Home.jsx';
import Domain from './pages/Domain.jsx';
import Alerts from './pages/Alerts.jsx';
import Settings from './pages/Settings.jsx';

const ROLE_KEY = 'mezze.role';
const RANGE_KEY = 'mezze.range';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || 'manager');
  const [range, setRange] = useState(() => localStorage.getItem(RANGE_KEY) || 'today');
  const [acked, ack, unackAll] = useAcknowledgedAlerts();
  const [sim, toggleSim] = useSimulatedAlerts();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { localStorage.setItem(ROLE_KEY, role); }, [role]);
  useEffect(() => { localStorage.setItem(RANGE_KEY, range); }, [range]);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const alerts = useMemo(() => buildAlerts({ range, simulated: sim }), [range, sim]);
  const activeAlertCount = alerts.filter((a) => !acked[a.id]).length;

  // Title from route
  const titleFor = () => {
    const path = location.pathname;
    if (path === '/') return ['Command Centre', 'Mezze & Co. — live operations cockpit'];
    if (path === '/alerts') return ['Smart Alerts', 'Threshold-driven operational signals'];
    if (path === '/settings') return ['Demo Controls', 'Simulate alerts & manage thresholds'];
    if (path.startsWith('/d/')) {
      const id = path.slice(3);
      const d = DOMAINS.find((x) => x.id === id);
      return [d ? d.name : 'Domain', d ? `${d.name} — domain breakdown` : ''];
    }
    return ['Mezze & Co.', ''];
  };
  const [pageTitle, pageSub] = titleFor();

  return (
    <div className="app">
      <Sidebar alertCount={activeAlertCount} open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className="scrim scrim--show" onClick={() => setMenuOpen(false)} />}

      <div className="app__main">
        <Topbar
          title={pageTitle}
          subtitle={pageSub}
          range={range}
          onRange={setRange}
          role={role}
          onRole={setRole}
          theme={theme}
          onTheme={toggleTheme}
          onMenu={() => setMenuOpen(true)}
          alertCount={activeAlertCount}
        />
        <main className="app__content">
          <Routes>
            <Route path="/" element={<Home range={range} role={role} alerts={alerts} acked={acked} ack={ack} navigate={navigate} />} />
            <Route path="/d/:domainId" element={<Domain range={range} role={role} />} />
            <Route path="/alerts" element={<Alerts range={range} alerts={alerts} acked={acked} ack={ack} unackAll={unackAll} />} />
            <Route path="/settings" element={<Settings sim={sim} toggleSim={toggleSim} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="panel" style={{ textAlign: 'center', padding: 40 }}>
      <h2>404 — Page not found</h2>
      <p className="muted">The screen you’re looking for doesn’t exist.</p>
    </div>
  );
}
