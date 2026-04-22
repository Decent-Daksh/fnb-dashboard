/**
 * KPI registry — 49 KPIs across 7 domains for Mezze & Co.
 * Each KPI has:
 *  - id, name, shortName, domain, tier (Operational | Strategic | SmartAlert)
 *  - formula (display string), unit, dp (decimal places), direction ('up' = higher better, 'down' = lower better)
 *  - target: { good, warn } in same units (used for status calculation)
 *  - benchmark: human display string
 *  - alert: { threshold (string), severity, action } when tier === 'SmartAlert'
 *  - role: 'manager' | 'owner' | 'both' (which role primarily cares)
 */

export const DOMAINS = [
  { id: 'revenue',   name: 'Revenue',          icon: 'currency' },
  { id: 'operations',name: 'Operations',       icon: 'gauge' },
  { id: 'orders',    name: 'Orders & Menu',    icon: 'menu' },
  { id: 'staff',     name: 'Staff',            icon: 'users' },
  { id: 'customer',  name: 'Customer',         icon: 'heart' },
  { id: 'inventory', name: 'Inventory & Waste',icon: 'box' },
  { id: 'roi',       name: 'ROI & Growth',     icon: 'trending' },
];

export const KPIS = [
  // ============ REVENUE (6) ============
  { id:'rev.attain',  domain:'revenue', name:'Daily Revenue Target Attainment', shortName:'Revenue vs Target', tier:'Operational', formula:'Actual ÷ Target × 100', unit:'pct', dp:1, direction:'up', target:{good:90,warn:75}, benchmark:'>90%', role:'both' },
  { id:'rev.revpash', domain:'revenue', name:'Revenue Per Available Seat Hour (RevPASH)', shortName:'RevPASH', tier:'SmartAlert', formula:'Total Revenue ÷ (Seats × Op. Hours)', unit:'money', dp:2, direction:'up', target:{good:18,warn:13}, benchmark:'$15–$25 / seat-hr', alert:{threshold:'Drop >15% vs same weekday LW', severity:'bad', action:'Run a flash promo on under-performing weekday & reassess station-level pricing.'}, role:'owner' },
  { id:'rev.avgcheck',domain:'revenue', name:'Average Check / Spend Per Cover', shortName:'Avg Check', tier:'Strategic', formula:'Total Revenue ÷ Total Covers', unit:'money', dp:2, direction:'up', target:{good:34,warn:28}, benchmark:'Grows 5–8% YoY', role:'owner' },
  { id:'rev.channel', domain:'revenue', name:'Revenue by Channel Mix', shortName:'Channel Mix', tier:'Operational', formula:'Channel Rev ÷ Total Rev × 100', unit:'pct', dp:0, direction:'up', target:{good:0,warn:0}, benchmark:'Track dine-in / delivery / takeaway', role:'both' },
  { id:'rev.peak',    domain:'revenue', name:'Peak Hour Revenue Capture Rate', shortName:'Peak Capture', tier:'SmartAlert', formula:'Peak 2hr Rev ÷ Daily Rev', unit:'pct', dp:1, direction:'up', target:{good:35,warn:28}, benchmark:'>35% in peak window', alert:{threshold:'Below 35% of daily revenue', severity:'warn', action:'Check if peak-hour staffing is short or pass-times have slipped.'}, role:'manager' },
  { id:'rev.events',  domain:'revenue', name:'Catering & Events Revenue %', shortName:'Events Revenue', tier:'Strategic', formula:'Events Rev ÷ Total Rev × 100', unit:'pct', dp:1, direction:'up', target:{good:8,warn:5}, benchmark:'Grows monthly', role:'owner' },

  // ============ OPERATIONS (6) ============
  { id:'ops.turnover', domain:'operations', name:'Table Turnover Rate', shortName:'Table Turnover', tier:'Operational', formula:'Covers ÷ Seats', unit:'x', dp:1, direction:'up', target:{good:3,warn:2.2}, benchmark:'Fast casual: 3–5×', role:'manager' },
  { id:'ops.dwell',    domain:'operations', name:'Average Table Dwell Time', shortName:'Dwell Time', tier:'SmartAlert', formula:'Total Seated Min ÷ Covers', unit:'min', dp:0, direction:'down', target:{good:65,warn:80}, benchmark:'~60–75 min', alert:{threshold:'Exceeds target by >20 min at peak', severity:'warn', action:'Speed up dessert/check delivery; deploy a table-flip incentive for FOH.'}, role:'manager' },
  { id:'ops.ktt',      domain:'operations', name:'Kitchen Ticket Time (KTT)', shortName:'Kitchen Ticket', tier:'Operational', formula:'Order placed → Food on pass', unit:'min', dp:0, direction:'down', target:{good:12,warn:18}, benchmark:'<12 min casual', role:'manager' },
  { id:'ops.delivery', domain:'operations', name:'Order to Delivery Time', shortName:'Delivery Time', tier:'SmartAlert', formula:'Order confirmed → Delivered', unit:'min', dp:0, direction:'down', target:{good:35,warn:40}, benchmark:'<35 minutes', alert:{threshold:'Rolling 30-min avg >40 min', severity:'bad', action:'Pause delivery acceptance for 15 min; reassign one cook to expediting.'}, role:'manager' },
  { id:'ops.seat',     domain:'operations', name:'Seat Utilisation Rate', shortName:'Seat Utilisation', tier:'Operational', formula:'Occupied ÷ Available Seat-hrs', unit:'pct', dp:0, direction:'up', target:{good:70,warn:55}, benchmark:'>70% during service', role:'manager' },
  { id:'ops.deadslot', domain:'operations', name:'Dead Slot Identification Index', shortName:'Dead Slots', tier:'Strategic', formula:'Revenue per 30-min block / 7-day heatmap', unit:'count', dp:0, direction:'down', target:{good:5,warn:10}, benchmark:'Informs promo scheduling', role:'owner' },

  // ============ ORDERS & MENU (6) ============
  { id:'ord.contrib',  domain:'orders', name:'Menu Item Contribution Margin', shortName:'Menu Contribution', tier:'Strategic', formula:'(Sell Price − Food Cost) ranked', unit:'pct', dp:1, direction:'up', target:{good:68,warn:55}, benchmark:'Stars = high margin + popular', role:'owner' },
  { id:'ord.error',    domain:'orders', name:'Order Error Rate', shortName:'Order Errors', tier:'SmartAlert', formula:'Wrong Orders ÷ Total Orders × 100', unit:'pct', dp:2, direction:'down', target:{good:1,warn:2}, benchmark:'<1%', alert:{threshold:'>2% in any shift', severity:'warn', action:'Run a 5-minute KDS callback drill before the next service.'}, role:'manager' },
  { id:'ord.cancel',   domain:'orders', name:'Cancellation & Abandoned Order Rate', shortName:'Cancellations', tier:'SmartAlert', formula:'Cancelled ÷ Total Orders × 100', unit:'pct', dp:2, direction:'down', target:{good:3,warn:5}, benchmark:'<3%', alert:{threshold:'Spike above 5% in 2-hr window', severity:'warn', action:'Confirm POS / payment terminal and delivery partner status.'}, role:'manager' },
  { id:'ord.upsell',   domain:'orders', name:'Upsell Conversion Rate', shortName:'Upsell Rate', tier:'Operational', formula:'Orders w/ Upsell ÷ Total × 100', unit:'pct', dp:1, direction:'up', target:{good:35,warn:22}, benchmark:'35–50% (trained staff)', role:'manager' },
  { id:'ord.86',       domain:'orders', name:'Item 86 Frequency (Stock-Out Rate)', shortName:'86 Frequency', tier:'Strategic', formula:'Times 86\'d ÷ Service Periods', unit:'count', dp:0, direction:'down', target:{good:2,warn:5}, benchmark:'<2× / week per item', role:'owner' },
  { id:'ord.bevratio', domain:'orders', name:'Beverage-to-Food Revenue Ratio', shortName:'Beverage Ratio', tier:'Operational', formula:'Bev Rev ÷ Food Rev × 100', unit:'pct', dp:1, direction:'up', target:{good:30,warn:22}, benchmark:'30–40% beverage', role:'owner' },

  // ============ STAFF (6) ============
  { id:'staff.labpct', domain:'staff', name:'Labour Cost % of Revenue', shortName:'Labour %', tier:'Operational', formula:'Labour Cost ÷ Revenue × 100', unit:'pct', dp:1, direction:'down', target:{good:32,warn:38}, benchmark:'28–35%', role:'both' },
  { id:'staff.revhr',  domain:'staff', name:'Revenue Per Labour Hour', shortName:'Revenue / Hr', tier:'SmartAlert', formula:'Revenue ÷ Total Staff Hours', unit:'money', dp:0, direction:'up', target:{good:80,warn:60}, benchmark:'Track trending', alert:{threshold:'Drops >10% vs last month same volume', severity:'warn', action:'Right-size next week\'s rota — trim 1 mid-shift FOH on slow weekdays.'}, role:'owner' },
  { id:'staff.turn',   domain:'staff', name:'Staff Turnover Rate', shortName:'Turnover', tier:'Strategic', formula:'(Left ÷ Avg Headcount) × 100', unit:'pct', dp:1, direction:'down', target:{good:25,warn:35}, benchmark:'<30%/yr', role:'owner' },
  { id:'staff.cps',    domain:'staff', name:'Covers Per Server Per Shift', shortName:'Covers / Server', tier:'Operational', formula:'Covers ÷ FOH Staff', unit:'count', dp:0, direction:'up', target:{good:30,warn:22}, benchmark:'25–40 covers/server', role:'manager' },
  { id:'staff.noshow', domain:'staff', name:'No-Show & Late Rate (Staff)', shortName:'Staff No-Show', tier:'SmartAlert', formula:'Unplanned Absences ÷ Scheduled × 100', unit:'pct', dp:1, direction:'down', target:{good:3,warn:5}, benchmark:'<3%', alert:{threshold:'Trigger 2hrs before shift start', severity:'warn', action:'Dispatch on-call backup; flag repeat offender for a 1:1.'}, role:'manager' },
  { id:'staff.train',  domain:'staff', name:'Training Hours Per Staff Per Month', shortName:'Training Hrs', tier:'Operational', formula:'Total Training Hrs ÷ Headcount', unit:'count', dp:1, direction:'up', target:{good:5,warn:3}, benchmark:'4–8 hrs/month', role:'owner' },

  // ============ CUSTOMER (6) ============
  { id:'cust.return',  domain:'customer', name:'Guest Return Rate', shortName:'Return Rate', tier:'Strategic', formula:'Returning ÷ Unique × 100', unit:'pct', dp:1, direction:'up', target:{good:40,warn:28}, benchmark:'>40% monthly', role:'owner' },
  { id:'cust.nps',     domain:'customer', name:'Net Promoter Score (NPS)', shortName:'NPS', tier:'Operational', formula:'%Promoters − %Detractors', unit:'score', dp:0, direction:'up', target:{good:50,warn:30}, benchmark:'>50 good · >70 excellent', role:'both' },
  { id:'cust.review',  domain:'customer', name:'Online Review Score & Velocity', shortName:'Review Score', tier:'SmartAlert', formula:'Avg rating + frequency', unit:'score', dp:1, direction:'up', target:{good:4.4,warn:4.0}, benchmark:'4.4+ across platforms', alert:{threshold:'Any 1–2 star review triggers instant alert', severity:'bad', action:'Owner replies within 4 hours; investigate ticket if available.'}, role:'both' },
  { id:'cust.clv',     domain:'customer', name:'Customer Lifetime Value (CLV)', shortName:'CLV', tier:'Strategic', formula:'Avg Spend × Visits × Years', unit:'money', dp:0, direction:'up', target:{good:580,warn:380}, benchmark:'Caps acquisition spend', role:'owner' },
  { id:'cust.cmp',     domain:'customer', name:'Complaint Resolution Time', shortName:'Complaint Resolve', tier:'SmartAlert', formula:'Raised → Resolved (avg min)', unit:'min', dp:0, direction:'down', target:{good:15,warn:25}, benchmark:'<15 min in-house', alert:{threshold:'Unresolved >20 min in-house / 4hr online', severity:'warn', action:'Manager-on-floor takes ownership; comp where appropriate.'}, role:'manager' },
  { id:'cust.noshow',  domain:'customer', name:'Reservation No-Show Rate', shortName:'Reservation No-Show', tier:'Operational', formula:'No-shows ÷ Reservations × 100', unit:'pct', dp:1, direction:'down', target:{good:8,warn:12}, benchmark:'<8%', role:'manager' },

  // ============ INVENTORY & WASTE (6) ============
  { id:'inv.foodcost', domain:'inventory', name:'Food Cost Percentage', shortName:'Food Cost %', tier:'Operational', formula:'COGS ÷ Food Revenue × 100', unit:'pct', dp:1, direction:'down', target:{good:32,warn:38}, benchmark:'28–35% food', role:'both' },
  { id:'inv.waste',    domain:'inventory', name:'Food Waste %', shortName:'Food Waste', tier:'SmartAlert', formula:'Waste Value ÷ Purchased × 100', unit:'pct', dp:1, direction:'down', target:{good:3,warn:5}, benchmark:'<3% of purchased cost', alert:{threshold:'Daily waste value exceeds threshold', severity:'warn', action:'Review prep par-levels; introduce a daily waste log audit.'}, role:'both' },
  { id:'inv.turn',     domain:'inventory', name:'Inventory Turnover Rate', shortName:'Inventory Turn', tier:'Strategic', formula:'COGS ÷ Avg Inventory', unit:'x', dp:1, direction:'up', target:{good:5,warn:3.5}, benchmark:'4–8×/month perishables', role:'owner' },
  { id:'inv.shrink',   domain:'inventory', name:'Shrinkage & Variance Rate', shortName:'Shrinkage', tier:'SmartAlert', formula:'(Expected − Actual) ÷ Expected × 100', unit:'pct', dp:2, direction:'down', target:{good:1,warn:2}, benchmark:'<1%', alert:{threshold:'Weekly variance >2% on high-value category', severity:'bad', action:'Trigger weighted recount; review CCTV near liquor/protein storage.'}, role:'owner' },
  { id:'inv.supplier', domain:'inventory', name:'Supplier On-Time Delivery Rate', shortName:'Supplier On-Time', tier:'Operational', formula:'On-Time ÷ Total Orders × 100', unit:'pct', dp:1, direction:'up', target:{good:95,warn:88}, benchmark:'>95% on-time', role:'manager' },
  { id:'inv.portion',  domain:'inventory', name:'Cost Per Portion Accuracy', shortName:'Portion Variance', tier:'Strategic', formula:'Plated vs Recipe (variance %)', unit:'pct', dp:1, direction:'down', target:{good:5,warn:8}, benchmark:'<5% variance', role:'owner' },

  // ============ ROI & GROWTH (7) ============
  { id:'roi.prime',    domain:'roi', name:'Prime Cost (Labour + COGS) %', shortName:'Prime Cost', tier:'Strategic', formula:'(Labour + COGS) ÷ Revenue × 100', unit:'pct', dp:1, direction:'down', target:{good:60,warn:67}, benchmark:'<60% (target 55%)', role:'owner' },
  { id:'roi.ebitda',   domain:'roi', name:'EBITDA Margin', shortName:'EBITDA', tier:'Strategic', formula:'(Rev − COGS − Lab − OpEx) ÷ Rev', unit:'pct', dp:1, direction:'up', target:{good:12,warn:7}, benchmark:'10–15%', role:'owner' },
  { id:'roi.mktroi',   domain:'roi', name:'Marketing ROI by Channel', shortName:'Marketing ROI', tier:'Strategic', formula:'(Channel Rev − Cost) ÷ Cost × 100', unit:'pct', dp:0, direction:'up', target:{good:300,warn:150}, benchmark:'Track per channel', role:'owner' },
  { id:'roi.breakeven',domain:'roi', name:'Break-Even Covers Per Day', shortName:'Break-Even Covers', tier:'Operational', formula:'Fixed Daily Costs ÷ Avg Margin', unit:'count', dp:0, direction:'down', target:{good:140,warn:170}, benchmark:'Daily team target', role:'both' },
  { id:'roi.runway',   domain:'roi', name:'Cash Flow Runway (Days)', shortName:'Cash Runway', tier:'SmartAlert', formula:'Cash Balance ÷ Avg Daily Outflow', unit:'days', dp:0, direction:'up', target:{good:45,warn:30}, benchmark:'>45 days healthy', alert:{threshold:'Runway drops below 21 days', severity:'bad', action:'Owner reviews receivables, defers non-essential capex this week.'}, role:'owner' },
  { id:'roi.loyalty',  domain:'roi', name:'Loyalty Programme ROI', shortName:'Loyalty ROI', tier:'Strategic', formula:'(Inc Rev − Cost) ÷ Cost', unit:'pct', dp:0, direction:'up', target:{good:200,warn:120}, benchmark:'Members spend 18–25% more', role:'owner' },
  { id:'roi.delivery', domain:'roi', name:'Delivery Platform Commission Impact', shortName:'Delivery Margin', tier:'SmartAlert', formula:'Delivery Rev × (1 − Commission)', unit:'pct', dp:1, direction:'up', target:{good:12,warn:9}, benchmark:'>12% net margin on delivery', alert:{threshold:'Net delivery margin <8%', severity:'warn', action:'Negotiate with platform or surface a 5% direct-order discount.'}, role:'owner' },
];

export const getKpisByDomain = (domain) => KPIS.filter((k) => k.domain === domain);
export const getKpiById = (id) => KPIS.find((k) => k.id === id);
export const SMART_ALERT_KPIS = KPIS.filter((k) => k.tier === 'SmartAlert');
