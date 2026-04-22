// Inline SVG icon set. Lightweight, themeable via currentColor.
import React from 'react';

const I = ({ children, size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">{children}</svg>
);

export const Icon = {
  home:    (p) => <I {...p}><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></I>,
  currency:(p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M15 9h-3.5a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3H9"/><path d="M12 7v2M12 15v2"/></I>,
  gauge:   (p) => <I {...p}><path d="M12 14a2 2 0 1 0-2-2"/><path d="M3.05 11a9 9 0 1 1 17.9 0"/><path d="M12 14l5-5"/></I>,
  menu:    (p) => <I {...p}><path d="M4 6h16M4 12h16M4 18h16"/></I>,
  users:   (p) => <I {...p}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M15 20c0-2 2-4 5-4"/></I>,
  heart:   (p) => <I {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></I>,
  box:     (p) => <I {...p}><path d="M3 7l9-4 9 4v10l-9 4-9-4Z"/><path d="M3 7l9 4 9-4M12 11v10"/></I>,
  trending:(p) => <I {...p}><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></I>,
  bell:    (p) => <I {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></I>,
  sun:     (p) => <I {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></I>,
  moon:    (p) => <I {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></I>,
  arrowUp: (p) => <I {...p} size={p?.size||14}><path d="M7 14l5-5 5 5"/></I>,
  arrowDown:(p)=> <I {...p} size={p?.size||14}><path d="M17 10l-5 5-5-5"/></I>,
  arrowFlat:(p)=> <I {...p} size={p?.size||14}><path d="M5 12h14"/></I>,
  download:(p) => <I {...p}><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></I>,
  filter:  (p) => <I {...p}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></I>,
  burger:  (p) => <I {...p}><path d="M4 7h16M4 12h16M4 17h16"/></I>,
  zap:     (p) => <I {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></I>,
  check:   (p) => <I {...p}><polyline points="5 12 10 17 19 6"/></I>,
  x:       (p) => <I {...p}><path d="M18 6L6 18M6 6l12 12"/></I>,
  star:    (p) => <I {...p}><polygon points="12 2 15 9 22 10 17 15 18 22 12 19 6 22 7 15 2 10 9 9"/></I>,
  briefcase:(p)=> <I {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></I>,
};
