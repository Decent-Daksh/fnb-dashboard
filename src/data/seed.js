/**
 * Mock data layer for Mezze & Co. — an 80-seat Mediterranean bistro.
 * Seeded deterministic generator so values are stable across reloads.
 *
 * Produces:
 *  - 90 days of daily revenue / covers / channel mix / labour / waste etc.
 *  - 7-day x 13-block heatmap of revenue
 *  - Menu items with price, food cost, and units-sold
 *  - Staff snapshot
 *  - Per-domain rolled-up KPI values for Today / Week / Month
 */

import { KPIS } from './kpis.js';

export const RESTAURANT = {
  name: 'Mezze & Co.',
  format: 'Mediterranean Bistro',
  city: 'Lisbon, Portugal',
  seats: 80,
  opHoursPerDay: 11,         // 12:00 - 23:00
  staffHeadcount: 22,
  fixedDailyCosts: 1850,     // for break-even
  cashBalance: 28400,
};

// ---------- Seeded RNG ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260421);

const range = (n) => Array.from({ length: n }, (_, i) => i);
const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Revenue is bursty by weekday
const dayMultiplier = [1.05, 0.72, 0.78, 0.86, 0.95, 1.32, 1.42]; // Sun..Sat

// ---------- 90-day daily series ----------
function buildDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dow = d.getDay();
    // Long-term gentle growth + seasonal wave + weekday multiplier + noise
    const trend = 1 + (89 - i) * 0.0015;          // +0.15% per day = ~14% over 90d
    const wave = 1 + 0.06 * Math.sin((89 - i) / 11);
    const noise = 0.92 + rand() * 0.16;
    const baseRev = 4200;                          // baseline target
    const targetRevenue = Math.round(baseRev * dayMultiplier[dow] * (1 + (89 - i) * 0.001));
    const revenue = Math.round(baseRev * dayMultiplier[dow] * trend * wave * noise);
    const covers = Math.round(revenue / (32 + rand() * 6));
    const labourCost = Math.round(revenue * (0.30 + rand() * 0.05));
    const cogs = Math.round(revenue * (0.31 + rand() * 0.04));
    const wasteValue = Math.round(cogs * (0.025 + rand() * 0.025));
    const channelDine = 0.55 + rand() * 0.08;
    const channelDelivery = 0.22 + rand() * 0.07;
    const channelTakeaway = 1 - channelDine - channelDelivery;
    days.push({
      date: d,
      dow,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      shortLabel: dayName[dow],
      revenue,
      targetRevenue,
      covers,
      labourCost,
      cogs,
      wasteValue,
      ktt: 9 + rand() * 6,         // kitchen ticket time (min)
      delivery: 28 + rand() * 14,  // delivery time
      cancelPct: 1.4 + rand() * 2.6,
      errorPct: 0.6 + rand() * 1.4,
      upsellPct: 28 + rand() * 18,
      noShowStaffPct: 1 + rand() * 3,
      noShowResPct: 5 + rand() * 6,
      reviews: 4.1 + rand() * 0.45,
      nps: 48 + Math.round(rand() * 25),
      seatUtil: 55 + rand() * 25,
      channels: { dineIn: channelDine, delivery: channelDelivery, takeaway: channelTakeaway },
      revenueByChannel: {
        dineIn: Math.round(revenue * channelDine),
        delivery: Math.round(revenue * channelDelivery),
        takeaway: Math.round(revenue * channelTakeaway),
      },
    });
  }
  return days;
}

export const DAYS = buildDays();

// Today / Week / Month slices
export const TODAY = DAYS[DAYS.length - 1];
export const WEEK = DAYS.slice(-7);
export const MONTH = DAYS.slice(-30);
export const PREV_WEEK = DAYS.slice(-14, -7);
export const PREV_MONTH = DAYS.slice(-60, -30);

// ---------- Hourly heatmap (last 7 days, 11 blocks of 1hr each 12:00-23:00) ----------
const HOUR_LABELS = ['12p','1p','2p','3p','4p','5p','6p','7p','8p','9p','10p'];
const hourMult = [0.6, 1.4, 1.1, 0.45, 0.35, 0.45, 1.0, 1.6, 1.8, 1.2, 0.55]; // lunch peak then dinner peak
function buildHeatmap() {
  return WEEK.map((day) => ({
    day: day.shortLabel,
    cells: HOUR_LABELS.map((h, i) => {
      const blockRevShare = hourMult[i] / hourMult.reduce((a, b) => a + b, 0);
      const v = Math.round(day.revenue * blockRevShare * (0.85 + rand() * 0.3));
      return { hour: h, value: v };
    }),
  }));
}
export const HEATMAP = buildHeatmap();
export const HOURS = HOUR_LABELS;

// ---------- Menu items (12 items spanning all 4 quadrants) ----------
export const MENU_ITEMS = [
  // Stars (high margin + high popularity)
  { id:'m1', name:'Whipped Feta',       category:'Mezze',     price:11.5, foodCost:2.2, units:284, quadrant:'Stars' },
  { id:'m2', name:'Grilled Octopus',    category:'Mains',     price:24.0, foodCost:7.8, units:198, quadrant:'Stars' },
  { id:'m3', name:'Lamb Souvlaki Bowl', category:'Mains',     price:22.0, foodCost:7.0, units:241, quadrant:'Stars' },

  // Plowhorses (low margin + high popularity) - need price/cost optimisation
  { id:'m4', name:'House Pita Plate',   category:'Mezze',     price:9.0,  foodCost:4.1, units:312, quadrant:'Plowhorses' },
  { id:'m5', name:'Chicken Shawarma',   category:'Mains',     price:18.0, foodCost:8.6, units:297, quadrant:'Plowhorses' },
  { id:'m6', name:'Hummus & Flatbread', category:'Mezze',     price:8.5,  foodCost:3.6, units:268, quadrant:'Plowhorses' },

  // Puzzles (high margin + low popularity) - need promotion
  { id:'m7', name:'Saffron Risotto',    category:'Mains',     price:23.0, foodCost:6.4, units:64,  quadrant:'Puzzles' },
  { id:'m8', name:'Sea Bass Whole',     category:'Mains',     price:34.0, foodCost:11.5,units:48,  quadrant:'Puzzles' },
  { id:'m9', name:'Baklava Trio',       category:'Desserts',  price:9.5,  foodCost:1.8, units:72,  quadrant:'Puzzles' },

  // Dogs (low margin + low popularity) - candidates for delisting
  { id:'m10', name:'Spinach Pie',       category:'Mezze',     price:7.5,  foodCost:4.4, units:38,  quadrant:'Dogs' },
  { id:'m11', name:'Tabbouleh',         category:'Salads',    price:9.0,  foodCost:5.0, units:41,  quadrant:'Dogs' },
  { id:'m12', name:'Greek Yoghurt Cup', category:'Desserts',  price:6.0,  foodCost:3.2, units:29,  quadrant:'Dogs' },
];
export const MENU_QUADRANTS = ['Stars', 'Plowhorses', 'Puzzles', 'Dogs'];
export const QUADRANT_COLORS = {
  Stars:'#10b981', Plowhorses:'#f59e0b', Puzzles:'#3b82f6', Dogs:'#94a3b8',
};

// ---------- Staff snapshot ----------
export const STAFF = [
  { name:'Ana M.',     role:'Server',   shifts:21, noShows:0, training:6, tenureMo:34 },
  { name:'Bruno R.',   role:'Server',   shifts:18, noShows:1, training:5, tenureMo:11 },
  { name:'Catarina P.',role:'Server',   shifts:22, noShows:0, training:8, tenureMo:48 },
  { name:'Diogo F.',   role:'Bartender',shifts:19, noShows:0, training:4, tenureMo:22 },
  { name:'Elsa N.',    role:'Host',     shifts:16, noShows:2, training:3, tenureMo:7 },
  { name:'Filipe T.',  role:'Line Cook',shifts:23, noShows:0, training:6, tenureMo:19 },
  { name:'Gabriel V.', role:'Line Cook',shifts:20, noShows:1, training:5, tenureMo:9 },
  { name:'Hugo C.',    role:'Sous Chef',shifts:24, noShows:0, training:9, tenureMo:51 },
  { name:'Ines G.',    role:'Pastry',   shifts:14, noShows:0, training:7, tenureMo:14 },
  { name:'João L.',    role:'Server',   shifts:17, noShows:3, training:2, tenureMo:5 },
  { name:'Kim O.',     role:'Dishie',   shifts:22, noShows:0, training:1, tenureMo:28 },
  { name:'Luis B.',    role:'Server',   shifts:19, noShows:0, training:4, tenureMo:13 },
];

// ---------- Suppliers ----------
export const SUPPLIERS = [
  { name:'Atlantic Seafood Co.', onTime:96.4, monthlySpend:8400, lateOrders:2 },
  { name:'Iberian Olive Oil',    onTime:99.1, monthlySpend:1200, lateOrders:0 },
  { name:'Lisbon Greens',        onTime:91.2, monthlySpend:5300, lateOrders:5 },
  { name:'Estrela Dairy',        onTime:97.8, monthlySpend:2700, lateOrders:1 },
  { name:'Trigo Bakers',         onTime:88.6, monthlySpend:1900, lateOrders:7 },
];

// ---------- 86 events ----------
export const EIGHTY_SIX_EVENTS = [
  { date:'-2', item:'Sea Bass Whole', cause:'Supplier short' },
  { date:'-5', item:'Baklava Trio',   cause:'Pastry under-prep' },
  { date:'-7', item:'Octopus',        cause:'High demand' },
  { date:'-9', item:'Sea Bass Whole', cause:'Supplier short' },
];

// ---------- Marketing ROI by channel ----------
export const MARKETING = [
  { channel:'Instagram',     spend:850, attributedRev:5400 },
  { channel:'Google Local',  spend:600, attributedRev:4900 },
  { channel:'Loyalty SMS',   spend:240, attributedRev:2200 },
  { channel:'Influencers',   spend:1200,attributedRev:3800 },
  { channel:'Delivery Apps', spend:1800,attributedRev:6100 },
];

// ---------- Reservations history ----------
export const RECENT_REVIEWS = [
  { rating:5, src:'Google',     text:'Best octopus in Lisbon. Service felt like family.', when:'2h ago' },
  { rating:2, src:'TripAdvisor',text:'Waited 35 min for mains on a Tuesday. Food fine.',  when:'5h ago' },
  { rating:4, src:'Yelp',       text:'Lovely room, mezze a bit pricey for portion.',      when:'1d ago' },
  { rating:5, src:'Google',     text:'Souvlaki bowl is now a weekly ritual.',             when:'2d ago' },
];

// ---------- Aggregations / KPI value computation ----------
function avg(arr, key) { return arr.reduce((s, x) => s + (key ? x[key] : x), 0) / arr.length; }
function sum(arr, key) { return arr.reduce((s, x) => s + (key ? x[key] : x), 0); }

export function aggregate(range = 'today') {
  let curr, prev;
  if (range === 'today')  { curr = [TODAY];          prev = [DAYS[DAYS.length - 8]]; }
  if (range === 'week')   { curr = WEEK;             prev = PREV_WEEK; }
  if (range === 'month')  { curr = MONTH;            prev = PREV_MONTH; }

  const revenueCurr = sum(curr, 'revenue');
  const revenuePrev = sum(prev, 'revenue');
  const targetCurr = sum(curr, 'targetRevenue');
  const coversCurr = sum(curr, 'covers');
  const coversPrev = sum(prev, 'covers');
  const labourCurr = sum(curr, 'labourCost');
  const cogsCurr = sum(curr, 'cogs');
  const wasteCurr = sum(curr, 'wasteValue');
  const opHrs = curr.length * RESTAURANT.opHoursPerDay;
  const seatHrs = opHrs * RESTAURANT.seats;

  const revenueByChannel = {
    dineIn:    sum(curr.map((d) => d.revenueByChannel.dineIn)),
    delivery:  sum(curr.map((d) => d.revenueByChannel.delivery)),
    takeaway:  sum(curr.map((d) => d.revenueByChannel.takeaway)),
  };

  // Peak: top-3 hourly cells across last 7 days for the matching window
  const heatmapForRange = HEATMAP;
  const sortedHourly = heatmapForRange.flatMap((d) => d.cells.map((c) => c.value)).sort((a, b) => b - a);
  const peakRev = sum(sortedHourly.slice(0, Math.max(2, Math.floor(sortedHourly.length * 0.18))));
  const totalHourly = sum(sortedHourly);
  const peakCapture = totalHourly ? (peakRev / totalHourly) * 100 : 0;

  // Helper to fill in trend sparkline series for a given key from the curr range
  const sparkOf = (key) => curr.slice(-7).map((d) => d[key] ?? 0);
  const channelsAvg = {
    dineIn: revenueByChannel.dineIn / revenueCurr,
    delivery: revenueByChannel.delivery / revenueCurr,
    takeaway: revenueByChannel.takeaway / revenueCurr,
  };

  // Menu engineering - star contribution
  const menuMargin = MENU_ITEMS.reduce((s, m) => s + ((m.price - m.foodCost) * m.units), 0);
  const menuRevenue = MENU_ITEMS.reduce((s, m) => s + (m.price * m.units), 0);
  const menuContrib = (menuMargin / menuRevenue) * 100;

  // Reviews / NPS
  const npsAvg = avg(curr, 'nps');
  const reviewsAvg = avg(curr, 'reviews');

  // Composite values keyed by KPI id
  const v = {
    'rev.attain':   (revenueCurr / targetCurr) * 100,
    'rev.revpash':  revenueCurr / seatHrs,
    'rev.avgcheck': revenueCurr / coversCurr,
    'rev.channel':  channelsAvg.dineIn * 100,        // dine-in % as headline
    'rev.peak':     peakCapture,
    'rev.events':   6.4 + (range === 'month' ? 1 : 0),

    'ops.turnover': coversCurr / (RESTAURANT.seats * curr.length),
    'ops.dwell':    72 + (rand() - 0.5) * 8,
    'ops.ktt':      avg(curr, 'ktt'),
    'ops.delivery': avg(curr, 'delivery'),
    'ops.seat':     avg(curr, 'seatUtil'),
    'ops.deadslot': 6,

    'ord.contrib':  menuContrib,
    'ord.error':    avg(curr, 'errorPct'),
    'ord.cancel':   avg(curr, 'cancelPct'),
    'ord.upsell':   avg(curr, 'upsellPct'),
    'ord.86':       3,
    'ord.bevratio': 28.5,

    'staff.labpct': (labourCurr / revenueCurr) * 100,
    'staff.revhr':  revenueCurr / (curr.length * 85),  // ~85 staff hours/day avg
    'staff.turn':   22.4,
    'staff.cps':    coversCurr / (curr.length * 7),    // ~7 FOH/day
    'staff.noshow': avg(curr, 'noShowStaffPct'),
    'staff.train':  5.4,

    'cust.return':  44.2,
    'cust.nps':     npsAvg,
    'cust.review':  reviewsAvg,
    'cust.clv':     612,
    'cust.cmp':     14,
    'cust.noshow':  avg(curr, 'noShowResPct'),

    'inv.foodcost': (cogsCurr / revenueCurr) * 100,
    'inv.waste':    (wasteCurr / cogsCurr) * 100,
    'inv.turn':     5.6,
    'inv.shrink':   0.9,
    'inv.supplier': 94.8,
    'inv.portion':  4.2,

    'roi.prime':    ((labourCurr + cogsCurr) / revenueCurr) * 100,
    'roi.ebitda':   ((revenueCurr - labourCurr - cogsCurr - RESTAURANT.fixedDailyCosts * curr.length) / revenueCurr) * 100,
    'roi.mktroi':   ((sum(MARKETING, 'attributedRev') - sum(MARKETING, 'spend')) / sum(MARKETING, 'spend')) * 100,
    'roi.breakeven':Math.round(RESTAURANT.fixedDailyCosts / 24),
    'roi.runway':   Math.round(RESTAURANT.cashBalance / (labourCurr + cogsCurr) * curr.length),
    'roi.loyalty':  185,
    'roi.delivery': 9.6,
  };

  // Previous-period values for delta calculation
  const prevV = {
    'rev.attain':   (revenuePrev / sum(prev,'targetRevenue')) * 100,
    'rev.revpash':  revenuePrev / (prev.length * RESTAURANT.opHoursPerDay * RESTAURANT.seats),
    'rev.avgcheck': revenuePrev / coversPrev,
    'rev.channel':  channelsAvg.dineIn * 100 * 0.97,
    'rev.peak':     peakCapture * 0.94,
    'rev.events':   5.8,

    'ops.turnover': coversPrev / (RESTAURANT.seats * prev.length),
    'ops.dwell':    74,
    'ops.ktt':      avg(prev, 'ktt'),
    'ops.delivery': avg(prev, 'delivery'),
    'ops.seat':     avg(prev, 'seatUtil'),
    'ops.deadslot': 7,

    'ord.contrib':  menuContrib - 1.6,
    'ord.error':    avg(prev, 'errorPct'),
    'ord.cancel':   avg(prev, 'cancelPct'),
    'ord.upsell':   avg(prev, 'upsellPct'),
    'ord.86':       4,
    'ord.bevratio': 27.2,

    'staff.labpct': (sum(prev,'labourCost') / revenuePrev) * 100,
    'staff.revhr':  revenuePrev / (prev.length * 85),
    'staff.turn':   24.0,
    'staff.cps':    coversPrev / (prev.length * 7),
    'staff.noshow': avg(prev, 'noShowStaffPct'),
    'staff.train':  4.9,

    'cust.return':  41.8,
    'cust.nps':     avg(prev,'nps'),
    'cust.review':  avg(prev,'reviews'),
    'cust.clv':     598,
    'cust.cmp':     16,
    'cust.noshow':  avg(prev, 'noShowResPct'),

    'inv.foodcost': (sum(prev,'cogs') / revenuePrev) * 100,
    'inv.waste':    (sum(prev,'wasteValue') / sum(prev,'cogs')) * 100,
    'inv.turn':     5.3,
    'inv.shrink':   1.1,
    'inv.supplier': 93.5,
    'inv.portion':  4.6,

    'roi.prime':    ((sum(prev,'labourCost') + sum(prev,'cogs')) / revenuePrev) * 100,
    'roi.ebitda':   ((revenuePrev - sum(prev,'labourCost') - sum(prev,'cogs') - RESTAURANT.fixedDailyCosts * prev.length) / revenuePrev) * 100,
    'roi.mktroi':   190,
    'roi.breakeven':Math.round(RESTAURANT.fixedDailyCosts / 23),
    'roi.runway':   Math.round(RESTAURANT.cashBalance / (sum(prev,'labourCost') + sum(prev,'cogs')) * prev.length),
    'roi.loyalty':  178,
    'roi.delivery': 10.4,
  };

  // Sparklines (last 7 days of relevant series)
  const sparks = {
    'rev.attain':   curr.slice(-7).map((d) => (d.revenue / d.targetRevenue) * 100),
    'rev.revpash':  curr.slice(-7).map((d) => d.revenue / (RESTAURANT.opHoursPerDay * RESTAURANT.seats)),
    'rev.avgcheck': curr.slice(-7).map((d) => d.revenue / d.covers),
    'rev.channel':  curr.slice(-7).map((d) => d.channels.dineIn * 100),
    'rev.peak':     curr.slice(-7).map(() => 38 + rand() * 6),
    'rev.events':   [5,6,5.5,7,6.4,7.1,6.8],

    'ops.turnover': curr.slice(-7).map((d) => d.covers / RESTAURANT.seats),
    'ops.dwell':    [76,74,73,71,72,72,71],
    'ops.ktt':      sparkOf('ktt'),
    'ops.delivery': sparkOf('delivery'),
    'ops.seat':     sparkOf('seatUtil'),
    'ops.deadslot': [9,8,8,7,7,6,6],

    'ord.contrib':  [62,63,64,64,66,66,67],
    'ord.error':    sparkOf('errorPct'),
    'ord.cancel':   sparkOf('cancelPct'),
    'ord.upsell':   sparkOf('upsellPct'),
    'ord.86':       [4,4,3,3,4,3,3],
    'ord.bevratio': [27,27.5,28,28,28.4,28.6,28.5],

    'staff.labpct': curr.slice(-7).map((d) => (d.labourCost / d.revenue) * 100),
    'staff.revhr':  curr.slice(-7).map((d) => d.revenue / 85),
    'staff.turn':   [25,24.6,24,23.6,23,22.6,22.4],
    'staff.cps':    curr.slice(-7).map((d) => d.covers / 7),
    'staff.noshow': sparkOf('noShowStaffPct'),
    'staff.train':  [4.6,4.8,5,5.1,5.2,5.3,5.4],

    'cust.return':  [42,42.5,43,43.4,43.8,44,44.2],
    'cust.nps':     sparkOf('nps'),
    'cust.review':  sparkOf('reviews'),
    'cust.clv':     [598,602,605,608,610,612,612],
    'cust.cmp':     [18,17,16,15,14,14,14],
    'cust.noshow':  sparkOf('noShowResPct'),

    'inv.foodcost': curr.slice(-7).map((d) => (d.cogs / d.revenue) * 100),
    'inv.waste':    curr.slice(-7).map((d) => (d.wasteValue / d.cogs) * 100),
    'inv.turn':     [5.2,5.3,5.4,5.5,5.5,5.6,5.6],
    'inv.shrink':   [1.4,1.3,1.2,1.1,1.0,0.95,0.9],
    'inv.supplier': [93,93.5,94,94.4,94.6,94.8,94.8],
    'inv.portion':  [5.0,4.8,4.6,4.5,4.4,4.3,4.2],

    'roi.prime':    curr.slice(-7).map((d) => ((d.labourCost + d.cogs) / d.revenue) * 100),
    'roi.ebitda':   curr.slice(-7).map((d) => ((d.revenue - d.labourCost - d.cogs - RESTAURANT.fixedDailyCosts) / d.revenue) * 100),
    'roi.mktroi':   [180,185,188,190,192,193,195],
    'roi.breakeven':[80,79,79,78,78,77,77],
    'roi.runway':   [42,40,38,37,36,35,34],
    'roi.loyalty':  [170,174,178,180,182,184,185],
    'roi.delivery': [11,10.6,10.2,9.9,9.7,9.6,9.6],
  };

  return {
    range,
    days: curr,
    revenue: revenueCurr,
    target: targetCurr,
    covers: coversCurr,
    revenueByChannel,
    values: v,
    prev: prevV,
    sparks,
  };
}

// Helper to access KPI by id
export function lookupKpi(id) {
  return KPIS.find((k) => k.id === id);
}
