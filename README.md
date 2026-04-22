# Mezze & Co. — F&B KPI Intelligence Dashboard

A live, interactive KPI dashboard for food & hospitality businesses. Built with **React + JavaScript + plain CSS** (no Tailwind, no TypeScript).

## Tech Stack

- **Framework:** React 18 (Vite)
- **Language:** JavaScript only
- **Styling:** Hand-written CSS variables + CSS modules-style class names
- **Charts:** Recharts (line, bar, pie, scatter, area)
- **Routing:** React Router v6
- **State:** React hooks + localStorage persistence

## Features

- **49 KPIs** across 7 domains: Revenue, Operations, Orders & Menu, Staff, Customer, Inventory, ROI & Growth
- **Smart Alerts panel** with 18 threshold-driven alerts, dismissible & persistent
- **Role-aware views:** Manager (operational) vs Owner (strategic)
- **Time range:** Today / This Week / This Month — re-computes all KPIs
- **Dark mode** with persistent toggle
- **Menu Engineering quadrant** (Stars / Plowhorses / Puzzles / Dogs)
- **Peak-hour heatmap** for revenue and dead-slot detection
- **Mobile responsive** down to 375px
- **Alert simulation toggle** to demo a delivery-time spike live
- **CSV export** for any domain
- **Mock data story:** "Mezze & Co." — 80-seat Mediterranean bistro with realistic 90-day history

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build & Deploy

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, Cloudflare Pages, etc.

## Project Structure

```
src/
  components/    Reusable widgets (KpiCard, Sparkline, Heatmap, etc.)
  pages/         Route screens (one per domain)
  data/          Mock data + KPI registry
  hooks/         useTheme, useAlerts, useTimeRange
  utils/         formatters, csv export
  styles/        Global CSS variables + component styles
  App.jsx
  main.jsx
```
