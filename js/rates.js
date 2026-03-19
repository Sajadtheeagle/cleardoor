/* CLEARDOOR — MORTGAGE RATES PAGE
   Live Canadian mortgage rate comparison — updated daily
================================================================ */

// ══ META ══
const RATES_META = {
  lastUpdated: 'March 18, 2026',
  bocRate: 2.75,
  prime: 4.95,
  nextBocDate: 'April 16, 2026',
  outlook: 'Rates have stabilized following the Bank of Canada\'s 7 consecutive cuts in 2024–2025. Fixed rates are near 3-year lows. Most economists expect no further cuts in 2026 — making this an attractive window to lock in a 3–5 year term.'
};

// ══ BoC RATE HISTORY (for chart) ══
const BOC_HISTORY = [
  {d:'Jan 2020',r:1.75},{d:'Mar 2020',r:0.75},{d:'Apr 2020',r:0.25},
  {d:'Jul 2020',r:0.25},{d:'Jan 2021',r:0.25},{d:'Jul 2021',r:0.25},
  {d:'Jan 2022',r:0.25},{d:'Mar 2022',r:0.50},{d:'Apr 2022',r:1.00},
  {d:'Jun 2022',r:1.50},{d:'Jul 2022',r:2.50},{d:'Sep 2022',r:3.25},
  {d:'Oct 2022',r:3.75},{d:'Dec 2022',r:4.25},{d:'Jan 2023',r:4.50},
  {d:'Jun 2023',r:5.00},{d:'Sep 2023',r:5.00},{d:'Jan 2024',r:5.00},
  {d:'Jun 2024',r:4.75},{d:'Jul 2024',r:4.50},{d:'Sep 2024',r:4.25},
  {d:'Oct 2024',r:3.75},{d:'Dec 2024',r:3.25},{d:'Jan 2025',r:3.00},
  {d:'Mar 2025',r:2.75},{d:'Mar 2026',r:2.75}
];

// BoC annotations
const BOC_ANNOTATIONS = [
  {d:'Apr 2020', label:'COVID Cuts\n0.25%', anchor:'start'},
  {d:'Mar 2022', label:'Hike Cycle', anchor:'start'},
  {d:'Jun 2023', label:'Peak\n5.00%', anchor:'end'},
  {d:'Jun 2024', label:'Cuts Begin', anchor:'start'},
  {d:'Mar 2026', label:'Today\n2.75%', anchor:'end'}
];

// ══ GLOSSARY TOOLTIPS ══
const RATES_TERMS = {
  'insured':    'Requires CMHC/Sagen mortgage insurance. Available when your down payment is under 20%. Counter-intuitively, insured mortgages get LOWER rates because the lender has no default risk.',
  'uninsured':  '20%+ down payment. No CMHC insurance premium to pay — but rates are slightly higher since lenders carry the default risk.',
  'rate-hold':  'A rate hold locks in today\'s rate for 90–150 days while you shop for a home. If rates rise, you keep the lower locked rate. If rates fall, most lenders let you take the better rate at closing.',
  'prepay':     'Annual prepayment privilege — the % of your original principal you can pay down extra each year without penalty. Higher % = more flexibility to pay off your mortgage faster.',
  'heloc':      'Home Equity Line of Credit. A revolving credit line secured by your home equity. Rate floats with the Bank of Canada\'s prime rate. Ideal for renovations, investments, or emergencies.',
  'prime':      'The benchmark rate Canadian banks use, currently 4.95%. It\'s the Bank of Canada\'s overnight rate (2.75%) + 2.20%. Variable mortgage rates are quoted as "Prime ± X%".',
  'variable':   'Your interest rate floats with prime — it changes every time the Bank of Canada adjusts its overnight rate (roughly 8 times/year). Historically saves money long-term but adds payment uncertainty.',
  'fixed':      'Your interest rate is locked for the full term (1–10 years). Payments are predictable no matter what the Bank of Canada does. Popular for budgeting certainty.',
  'amortization': 'The total life of your mortgage — how long until it\'s fully paid off. Max 25 years for insured mortgages (under 20% down). Up to 30 years for uninsured mortgages.',
  'stress-test': 'Federal rule requiring you to qualify at your contract rate + 2% (or 5.25%, whichever is higher). Ensures you can still afford payments if rates rise after you buy.',
  'monoline':   'A lender that only does mortgages — no branches, no chequing accounts. Lower overhead = better rates. Examples: First National, MCAP, Merix. Accessed only through mortgage brokers.',
  'broker':     'An independent professional who shops 30–50+ lenders on your behalf to find the best rate and terms. Paid by the lender, not you. Often gets better rates than going directly to a bank.',
  'ird':        'Interest Rate Differential — the penalty to break a fixed-rate mortgage early. Calculated as the difference between your rate and today\'s comparable rate, times remaining balance and term. Can be very expensive with big banks.',
  'posted-rate':'The rate banks officially advertise (before negotiation). Almost nobody pays posted rates — but big banks use posted rates to calculate break penalties (IRD), making penalties much higher than with monolines.'
};

// ══ LENDER DATA (22 lenders) ══
const RATES_LENDERS = [
  // ── Brokers ──
  {
    id:'nesto', name:'nesto', category:'broker',
    badge:'Lowest Rate', badgeColor:'#7c3aed', highlight:true,
    rateHold:150, prepay:20, url:'https://www.nesto.ca',
    fixed:{'1':{ins:4.49,uni:4.69},'2':{ins:4.09,uni:4.29},'3':{ins:3.84,uni:4.04},'4':{ins:3.89,uni:4.09},'5':{ins:3.79,uni:3.99},'7':{ins:4.24,uni:4.44},'10':{ins:4.59,uni:4.79}},
    variable:{'3':{ins:-0.90,uni:-0.60},'5':{ins:-1.00,uni:-0.75}},
    heloc:0.50
  },
  {
    id:'butler', name:'Butler Mortgage', category:'broker',
    badge:'Top Broker', badgeColor:'#0369a1', highlight:false,
    rateHold:120, prepay:20, url:'https://www.butlermortgage.ca',
    fixed:{'1':{ins:4.54,uni:4.74},'2':{ins:4.14,uni:4.34},'3':{ins:3.89,uni:4.09},'4':{ins:3.94,uni:4.14},'5':{ins:3.84,uni:4.04},'7':{ins:4.29,uni:4.49},'10':{ins:4.64,uni:4.84}},
    variable:{'3':{ins:-0.85,uni:-0.55},'5':{ins:-0.95,uni:-0.70}},
    heloc:0.50
  },
  {
    id:'truenorth', name:'True North Mortgage', category:'broker',
    badge:null, badgeColor:null, highlight:false,
    rateHold:120, prepay:20, url:'https://www.truenorthmortgage.ca',
    fixed:{'1':{ins:4.59,uni:4.79},'2':{ins:4.19,uni:4.39},'3':{ins:3.94,uni:4.14},'4':{ins:3.99,uni:4.19},'5':{ins:3.89,uni:4.09},'7':{ins:4.34,uni:4.54},'10':{ins:4.69,uni:4.89}},
    variable:{'3':{ins:-0.80,uni:-0.50},'5':{ins:-0.90,uni:-0.65}},
    heloc:0.50
  },
  {
    id:'pine', name:'Pine Mortgage', category:'broker',
    badge:'Digital Broker', badgeColor:'#0891b2', highlight:false,
    rateHold:130, prepay:20, url:'https://www.pine.ca',
    fixed:{'1':{ins:4.54,uni:4.74},'2':{ins:4.14,uni:4.34},'3':{ins:3.89,uni:4.09},'4':{ins:3.94,uni:4.14},'5':{ins:3.84,uni:4.04},'7':{ins:4.29,uni:4.49},'10':{ins:4.64,uni:4.84}},
    variable:{'3':{ins:-0.85,uni:-0.55},'5':{ins:-0.95,uni:-0.70}},
    heloc:0.50
  },
  {
    id:'dlc', name:'Dominion Lending', category:'broker',
    badge:"Canada's Largest Network", badgeColor:'#b45309', highlight:false,
    rateHold:120, prepay:20, url:'https://dominionlending.ca',
    fixed:{'1':{ins:4.59,uni:4.79},'2':{ins:4.19,uni:4.39},'3':{ins:3.94,uni:4.14},'4':{ins:3.99,uni:4.19},'5':{ins:3.89,uni:4.09},'7':{ins:4.34,uni:4.54},'10':{ins:4.69,uni:4.89}},
    variable:{'3':{ins:-0.80,uni:-0.50},'5':{ins:-0.90,uni:-0.65}},
    heloc:0.50
  },
  // ── Monolines ──
  {
    id:'firstnational', name:'First National', category:'monoline',
    badge:'Monoline Pick', badgeColor:'#047857', highlight:false,
    rateHold:120, prepay:20, url:'https://www.firstnational.ca',
    fixed:{'1':{ins:4.64,uni:4.84},'2':{ins:4.24,uni:4.44},'3':{ins:3.99,uni:4.19},'4':{ins:4.04,uni:4.24},'5':{ins:3.94,uni:4.14},'7':{ins:4.39,uni:4.59},'10':{ins:4.74,uni:4.94}},
    variable:{'3':{ins:-0.75,uni:-0.45},'5':{ins:-0.85,uni:-0.60}},
    heloc:0.50
  },
  {
    id:'mcap', name:'MCAP', category:'monoline',
    badge:null, badgeColor:null, highlight:false,
    rateHold:120, prepay:20, url:'https://www.mcap.com',
    fixed:{'1':{ins:4.69,uni:4.89},'2':{ins:4.29,uni:4.49},'3':{ins:4.04,uni:4.24},'4':{ins:4.09,uni:4.29},'5':{ins:3.99,uni:4.19},'7':{ins:4.44,uni:4.64},'10':{ins:4.79,uni:4.99}},
    variable:{'3':{ins:-0.70,uni:-0.40},'5':{ins:-0.80,uni:-0.55}},
    heloc:0.50
  },
  {
    id:'merix', name:'Merix Financial', category:'monoline',
    badge:null, badgeColor:null, highlight:false,
    rateHold:120, prepay:20, url:'https://www.merix.ca',
    fixed:{'1':{ins:4.69,uni:4.89},'2':{ins:4.29,uni:4.49},'3':{ins:4.04,uni:4.24},'4':{ins:4.09,uni:4.29},'5':{ins:3.99,uni:4.19},'7':{ins:4.44,uni:4.64},'10':{ins:4.79,uni:4.99}},
    variable:{'3':{ins:-0.70,uni:-0.40},'5':{ins:-0.80,uni:-0.55}},
    heloc:0.50
  },
  {
    id:'cmls', name:'CMLS Financial', category:'monoline',
    badge:null, badgeColor:null, highlight:false,
    rateHold:120, prepay:20, url:'https://www.cmls.ca',
    fixed:{'1':{ins:4.74,uni:4.94},'2':{ins:4.34,uni:4.54},'3':{ins:4.09,uni:4.29},'4':{ins:4.14,uni:4.34},'5':{ins:4.04,uni:4.24},'7':{ins:4.49,uni:4.69},'10':{ins:4.84,uni:5.04}},
    variable:{'3':{ins:-0.65,uni:-0.35},'5':{ins:-0.75,uni:-0.50}},
    heloc:0.50
  },
  {
    id:'eq', name:'EQ Bank', category:'monoline',
    badge:'Digital Bank', badgeColor:'#166534', highlight:false,
    rateHold:90, prepay:20, url:'https://www.eqbank.ca',
    fixed:{'1':{ins:4.74,uni:4.94},'2':{ins:4.34,uni:4.54},'3':{ins:4.09,uni:4.29},'4':{ins:4.14,uni:4.34},'5':{ins:4.04,uni:4.24},'7':{ins:4.49,uni:4.69},'10':{ins:4.84,uni:5.04}},
    variable:{'3':{ins:-0.60,uni:-0.30},'5':{ins:-0.70,uni:-0.45}},
    heloc:null
  },
  {
    id:'rmg', name:'RMG Mortgages', category:'monoline',
    badge:null, badgeColor:null, highlight:false,
    rateHold:120, prepay:20, url:'https://www.rmgmortgages.ca',
    fixed:{'1':{ins:4.74,uni:4.94},'2':{ins:4.34,uni:4.54},'3':{ins:4.09,uni:4.29},'4':{ins:4.14,uni:4.34},'5':{ins:4.04,uni:4.24},'7':{ins:4.49,uni:4.69},'10':{ins:4.84,uni:5.04}},
    variable:{'3':{ins:-0.65,uni:-0.35},'5':{ins:-0.75,uni:-0.50}},
    heloc:0.50
  },
  // ── Credit Unions ──
  {
    id:'desjardins', name:'Desjardins', category:'credit-union',
    badge:'Credit Union', badgeColor:'#065f46', highlight:false,
    rateHold:120, prepay:15, url:'https://www.desjardins.com',
    fixed:{'1':{ins:4.79,uni:4.99},'2':{ins:4.39,uni:4.59},'3':{ins:4.14,uni:4.34},'4':{ins:4.19,uni:4.39},'5':{ins:4.14,uni:4.34},'7':{ins:4.54,uni:4.74},'10':{ins:4.89,uni:5.09}},
    variable:{'3':{ins:-0.55,uni:-0.25},'5':{ins:-0.65,uni:-0.40}},
    heloc:0.50
  },
  {
    id:'meridian', name:'Meridian Credit Union', category:'credit-union',
    badge:null, badgeColor:null, highlight:false,
    rateHold:120, prepay:15, url:'https://www.meridiancu.ca',
    fixed:{'1':{ins:4.84,uni:5.04},'2':{ins:4.44,uni:4.64},'3':{ins:4.19,uni:4.39},'4':{ins:4.24,uni:4.44},'5':{ins:4.19,uni:4.39},'7':{ins:4.59,uni:4.79},'10':{ins:4.94,uni:5.14}},
    variable:{'3':{ins:-0.50,uni:-0.20},'5':{ins:-0.60,uni:-0.35}},
    heloc:0.50
  },
  {
    id:'coast', name:'Coast Capital Savings', category:'credit-union',
    badge:'BC-based', badgeColor:'#0e7490', highlight:false,
    rateHold:90, prepay:15, url:'https://www.coastcapitalsavings.com',
    fixed:{'1':{ins:4.89,uni:5.09},'2':{ins:4.49,uni:4.69},'3':{ins:4.24,uni:4.44},'4':{ins:4.29,uni:4.49},'5':{ins:4.24,uni:4.44},'7':{ins:4.64,uni:4.84},'10':{ins:4.99,uni:5.19}},
    variable:{'3':{ins:-0.45,uni:-0.15},'5':{ins:-0.55,uni:-0.30}},
    heloc:0.50
  },
  {
    id:'alterna', name:'Alterna Savings', category:'credit-union',
    badge:null, badgeColor:null, highlight:false,
    rateHold:90, prepay:15, url:'https://www.alterna.ca',
    fixed:{'1':{ins:4.89,uni:5.09},'2':{ins:4.49,uni:4.69},'3':{ins:4.24,uni:4.44},'4':{ins:4.29,uni:4.49},'5':{ins:4.24,uni:4.44},'7':{ins:4.64,uni:4.84},'10':{ins:4.99,uni:5.19}},
    variable:{'3':{ins:-0.45,uni:-0.15},'5':{ins:-0.55,uni:-0.30}},
    heloc:0.50
  },
  // ── Big Banks ──
  {
    id:'nbc', name:'National Bank', category:'big-bank',
    badge:null, badgeColor:null, highlight:false,
    rateHold:90, prepay:10, url:'https://www.nbc.ca',
    fixed:{'1':{ins:4.99,uni:5.19},'2':{ins:4.59,uni:4.79},'3':{ins:4.34,uni:4.54},'4':{ins:4.39,uni:4.59},'5':{ins:4.39,uni:4.59},'7':{ins:4.74,uni:4.94},'10':{ins:5.09,uni:5.29}},
    variable:{'3':{ins:-0.45,uni:-0.15},'5':{ins:-0.55,uni:-0.30}},
    heloc:0.50
  },
  {
    id:'bmo', name:'BMO', category:'big-bank',
    badge:null, badgeColor:null, highlight:false,
    rateHold:90, prepay:10, url:'https://www.bmo.com/en-ca/mortgages',
    fixed:{'1':{ins:5.14,uni:5.34},'2':{ins:4.74,uni:4.94},'3':{ins:4.49,uni:4.69},'4':{ins:4.54,uni:4.74},'5':{ins:4.54,uni:4.79},'7':{ins:4.89,uni:5.09},'10':{ins:5.24,uni:5.44}},
    variable:{'3':{ins:-0.35,uni:-0.05},'5':{ins:-0.45,uni:-0.20}},
    heloc:0.50
  },
  {
    id:'td', name:'TD Bank', category:'big-bank',
    badge:null, badgeColor:null, highlight:false,
    rateHold:90, prepay:10, url:'https://www.td.com/ca/en/personal-banking/products/mortgages',
    fixed:{'1':{ins:5.19,uni:5.39},'2':{ins:4.79,uni:4.99},'3':{ins:4.54,uni:4.74},'4':{ins:4.59,uni:4.79},'5':{ins:4.59,uni:4.84},'7':{ins:4.94,uni:5.14},'10':{ins:5.29,uni:5.49}},
    variable:{'3':{ins:-0.30,uni:0.00},'5':{ins:-0.45,uni:-0.20}},
    heloc:0.50
  },
  {
    id:'rbc', name:'RBC', category:'big-bank',
    badge:null, badgeColor:null, highlight:false,
    rateHold:90, prepay:10, url:'https://www.rbcroyalbank.com/mortgages',
    fixed:{'1':{ins:5.24,uni:5.44},'2':{ins:4.84,uni:5.04},'3':{ins:4.59,uni:4.79},'4':{ins:4.64,uni:4.84},'5':{ins:4.64,uni:4.89},'7':{ins:4.99,uni:5.19},'10':{ins:5.34,uni:5.54}},
    variable:{'3':{ins:-0.30,uni:0.00},'5':{ins:-0.40,uni:-0.15}},
    heloc:0.50
  },
  {
    id:'scotiabank', name:'Scotiabank', category:'big-bank',
    badge:null, badgeColor:null, highlight:false,
    rateHold:90, prepay:10, url:'https://www.scotiabank.com/ca/en/personal/mortgages',
    fixed:{'1':{ins:5.19,uni:5.39},'2':{ins:4.79,uni:4.99},'3':{ins:4.54,uni:4.74},'4':{ins:4.59,uni:4.79},'5':{ins:4.59,uni:4.84},'7':{ins:4.94,uni:5.14},'10':{ins:5.29,uni:5.49}},
    variable:{'3':{ins:-0.30,uni:0.00},'5':{ins:-0.45,uni:-0.20}},
    heloc:0.50
  },
  {
    id:'cibc', name:'CIBC', category:'big-bank',
    badge:null, badgeColor:null, highlight:false,
    rateHold:90, prepay:10, url:'https://www.cibc.com/en/personal-banking/mortgages',
    fixed:{'1':{ins:5.24,uni:5.44},'2':{ins:4.84,uni:5.04},'3':{ins:4.59,uni:4.79},'4':{ins:4.64,uni:4.84},'5':{ins:4.64,uni:4.89},'7':{ins:4.99,uni:5.19},'10':{ins:5.34,uni:5.54}},
    variable:{'3':{ins:-0.30,uni:0.00},'5':{ins:-0.40,uni:-0.15}},
    heloc:0.50
  },
  {
    id:'tangerine', name:'Tangerine', category:'big-bank',
    badge:'No-Fee Banking', badgeColor:'#ea580c', highlight:false,
    rateHold:90, prepay:10, url:'https://www.tangerine.ca/en/mortgages',
    fixed:{'1':{ins:5.14,uni:5.34},'2':{ins:4.74,uni:4.94},'3':{ins:4.49,uni:4.69},'4':{ins:4.54,uni:4.74},'5':{ins:4.54,uni:4.79},'7':{ins:4.89,uni:5.09},'10':{ins:5.24,uni:5.44}},
    variable:{'3':{ins:-0.30,uni:0.00},'5':{ins:-0.45,uni:-0.20}},
    heloc:null
  }
];

// ══ TERM INSIGHTS ══
const RATES_INSIGHTS = {
  '1_fixed':  'Best if you expect rates to fall significantly this year. Maximum renewal flexibility.',
  '2_fixed':  'Short lock-in that lets you re-evaluate in 2 years. Good if you\'re uncertain about the rate path.',
  '3_fixed':  'A sweet spot — competitive pricing with reasonable flexibility. Popular choice for 2026.',
  '4_fixed':  'Less common, but can offer better pricing than 3yr or 5yr. Worth comparing carefully.',
  '5_fixed':  'Canada\'s most popular term. Predictable payments for 5 years. Best for stable incomes.',
  '7_fixed':  'Maximum payment certainty. Only consider if you\'re sure you won\'t move or refinance.',
  '10_fixed': 'Very long commitment. Protects against rate spikes, but penalties for breaking are severe.',
  '3_var':    'Variable with shorter commitment. Payments adjust with BoC moves — lower risk than 5yr variable.',
  '5_var':    'Best historically for total interest savings. Payments fluctuate with prime rate changes.',
  'heloc':    'Access your home equity as a revolving line of credit. Rate floats with prime. Ideal for renovations.'
};

const RATE_CAT = {
  'broker':       {label:'Mortgage Broker', color:'#7c3aed'},
  'monoline':     {label:'Monoline Lender', color:'#0369a1'},
  'credit-union': {label:'Credit Union',    color:'#065f46'},
  'big-bank':     {label:'Big Bank',        color:'#374151'}
};

// ══ STATE ══
var _rState = {type:'fixed', term:'5', amount:500000, amort:25};

// ══ INIT ══
function initRates() {
  _renderRatesHero();
  _renderRatesContext();
  _updateTermChips();
  _renderRatesTable();
  _renderBocChart();
  _renderMortgageJourney();
  _renderRatesNews();
}

// ══ TOOLTIP HELPER ══
function _tip(key, label) {
  var text = RATES_TERMS[key] || '';
  if (!text) return label;
  return label + '<span class="rtip" tabindex="0" aria-label="'+text.replace(/"/g,'&quot;')+'">?<span class="rtip-box">'+text+'</span></span>';
}

// ══ HERO ══
function _renderRatesHero() {
  var el = document.getElementById('rates-hero-stats');
  if (!el) return;
  var prime = RATES_META.prime;
  var bestFixed = Math.min.apply(null, RATES_LENDERS.filter(function(l){return l.fixed&&l.fixed['5'];}).map(function(l){return l.fixed['5'].ins;}));
  var bestVarSpr = Math.min.apply(null, RATES_LENDERS.filter(function(l){return l.variable&&l.variable['5'];}).map(function(l){return l.variable['5'].ins;}));
  var bestVar = (prime + bestVarSpr).toFixed(2);
  el.innerHTML =
    '<div class="rhc"><div class="rhc-label">Best 5yr Fixed (Insured)</div><div class="rhc-rate">'+bestFixed.toFixed(2)+'%</div><div class="rhc-sub">Lowest available today</div></div>'+
    '<div class="rhc"><div class="rhc-label">Best 5yr Variable (Insured)</div><div class="rhc-rate">'+bestVar+'%</div><div class="rhc-sub">Prime − '+Math.abs(bestVarSpr).toFixed(2)+'%</div></div>'+
    '<div class="rhc rhc-boc"><div class="rhc-label">BoC Policy Rate</div><div class="rhc-rate">'+RATES_META.bocRate+'%</div><div class="rhc-sub">Prime = '+prime+'%</div></div>';
}

// ══ CONTEXT BOX ══
function _renderRatesContext() {
  var el = document.getElementById('rates-context');
  if (!el) return;
  el.innerHTML =
    '<div class="rcb">'+
      '<span class="rcb-icon">📊</span>'+
      '<div class="rcb-text"><strong>Market Context — '+RATES_META.lastUpdated+':</strong> '+RATES_META.outlook+
      ' <span class="rcb-next">Next BoC announcement: <strong>'+RATES_META.nextBocDate+'</strong></span></div>'+
    '</div>';
}

// ══ FILTERS ══
function ratesSetType(type) {
  _rState.type = type;
  if (type === 'variable' && !['3','5'].includes(_rState.term)) _rState.term = '5';
  if (type === 'heloc') _rState.term = 'heloc';
  if (type === 'fixed' && _rState.term === 'heloc') _rState.term = '5';
  document.querySelectorAll('.rtype-btn').forEach(function(b){b.classList.remove('active');});
  var active = document.querySelector('.rtype-btn[data-t="'+type+'"]');
  if (active) active.classList.add('active');
  _updateTermChips();
  _renderRatesTable();
}

function ratesSetTerm(term) {
  _rState.term = term;
  document.querySelectorAll('.rterm-chip').forEach(function(c){c.classList.remove('active');});
  var active = document.querySelector('.rterm-chip[data-t="'+term+'"]');
  if (active) active.classList.add('active');
  _renderRatesTable();
}

function ratesSetAmount(val) {
  _rState.amount = +val;
  var el = document.getElementById('rates-amt-val');
  if (el) el.textContent = '$' + Math.round(val).toLocaleString('en-CA');
  _renderRatesTable();
}

function ratesSetAmort(val) {
  _rState.amort = +val;
  _renderRatesTable();
}

function _updateTermChips() {
  var bar = document.getElementById('rterm-bar');
  if (!bar) return;
  var terms = _rState.type === 'variable' ? ['3','5'] : _rState.type === 'heloc' ? [] : ['1','2','3','4','5','7','10'];
  bar.innerHTML = terms.map(function(t){
    return '<button class="rterm-chip'+(_rState.term===t?' active':'')+'" data-t="'+t+'" onclick="ratesSetTerm(\''+t+'\')">'+t+'yr</button>';
  }).join('');
}

// ══ MONTHLY PAYMENT ══
function _calcPayment(ratePercent, amount, amortYears) {
  var r = ratePercent / 100 / 12;
  var n = amortYears * 12;
  if (r === 0) return amount / n;
  return amount * (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
}

// ══ TABLE ══
function _renderRatesTable() {
  var el = document.getElementById('rates-tbody');
  if (!el) return;
  var type = _rState.type, term = _rState.term, amount = _rState.amount, amort = _rState.amort;
  var prime = RATES_META.prime;

  var insightKey = (type === 'heloc') ? 'heloc' : (term + '_' + (type === 'variable' ? 'var' : 'fixed'));
  var insightEl = document.getElementById('rates-insight');
  if (insightEl) {
    var tips = RATES_INSIGHTS[insightKey];
    insightEl.style.display = tips ? '' : 'none';
    if (tips) insightEl.innerHTML = '💡 ' + tips;
  }
  var hdrEl = document.getElementById('rates-hdr-amount');
  if (hdrEl) hdrEl.textContent = '$' + amount.toLocaleString('en-CA') + ' mortgage';

  // HELOC view
  if (type === 'heloc') {
    var helocLenders = RATES_LENDERS.filter(function(l){return l.heloc != null;});
    el.innerHTML = helocLenders.map(function(l) {
      var rate = (prime + l.heloc).toFixed(2);
      var cat = RATE_CAT[l.category] || {};
      return '<div class="rrow">'+
        '<div class="rcell rcell-lender"><div class="rl-name">'+l.name+'</div><div class="rl-cat" style="color:'+cat.color+'">'+cat.label+'</div></div>'+
        '<div class="rcell rcell-rate"><div class="rrate">'+rate+'%</div><div class="rpayment">Prime + '+l.heloc.toFixed(2)+'%</div><div class="rlabel">Variable '+_tip('heloc','HELOC')+'</div></div>'+
        '<div class="rcell rcell-rate"></div>'+
        '<div class="rcell rcell-meta"><div class="rmeta"><span class="rmeta-l">'+_tip('rate-hold','Rate Hold')+'</span><span class="rmeta-v">'+l.rateHold+'d</span></div></div>'+
        '<div class="rcell rcell-cta"><a href="'+l.url+'" target="_blank" class="btn-rate-cta">Get Rate →</a></div></div>';
    }).join('');
    return;
  }

  var rows = RATES_LENDERS.filter(function(l) {
    if (type === 'fixed') return l.fixed && l.fixed[term];
    if (type === 'variable') return l.variable && l.variable[term];
    return false;
  }).map(function(l) {
    var ins, uni, insSpread, uniSpread;
    if (type === 'fixed') {
      ins = l.fixed[term].ins; uni = l.fixed[term].uni;
    } else {
      insSpread = l.variable[term].ins; uniSpread = l.variable[term].uni;
      ins = prime + insSpread; uni = prime + uniSpread;
    }
    return Object.assign({}, l, {ins:ins, uni:uni, insSpread:insSpread, uniSpread:uniSpread});
  });
  rows.sort(function(a,b){return a.ins - b.ins;});

  var bestRate = rows.length ? rows[0].ins : null;
  var bigBankStart = rows.findIndex(function(r){return r.category==='big-bank';});

  el.innerHTML = rows.map(function(l, idx) {
    var isBest = l.ins === bestRate;
    var insPayment = _calcPayment(l.ins, amount, amort);
    var uniPayment = _calcPayment(l.uni, amount, amort);
    var cat = RATE_CAT[l.category] || {};
    var spreadInsLabel = type==='variable' ? '<div class="rspread">Prime '+(l.insSpread>=0?'+':'')+l.insSpread.toFixed(2)+'%</div>' : '';
    var spreadUniLabel = type==='variable' ? '<div class="rspread">Prime '+(l.uniSpread>=0?'+':'')+l.uniSpread.toFixed(2)+'%</div>' : '';
    var divider = (bigBankStart === idx) ? '<div class="rrow-divider"><span>🏦 Big Bank Rates — negotiate before accepting</span></div>' : '';
    return divider +
      '<div class="rrow'+(isBest?' rrow-best':'')+(l.highlight?' rrow-hi':'')+'">'+
        '<div class="rcell rcell-lender">'+
          '<div class="rl-name">'+l.name+(isBest?' <span class="rbest-badge">★ Lowest</span>':'')+'</div>'+
          '<div class="rl-cat" style="color:'+cat.color+'">'+cat.label+'</div>'+
          (l.badge&&!isBest?'<div class="rl-badge" style="background:'+l.badgeColor+'18;color:'+l.badgeColor+'">'+l.badge+'</div>':'')+
        '</div>'+
        '<div class="rcell rcell-rate">'+
          '<div class="rrate'+(isBest?' rrate-best':'')+'">'+l.ins.toFixed(2)+'%</div>'+
          spreadInsLabel+
          '<div class="rpayment">$'+Math.round(insPayment).toLocaleString('en-CA')+'/mo</div>'+
          '<div class="rlabel">'+_tip('insured','Insured')+'  &lt;20% down</div>'+
        '</div>'+
        '<div class="rcell rcell-rate">'+
          '<div class="rrate">'+l.uni.toFixed(2)+'%</div>'+
          spreadUniLabel+
          '<div class="rpayment">$'+Math.round(uniPayment).toLocaleString('en-CA')+'/mo</div>'+
          '<div class="rlabel">'+_tip('uninsured','Uninsured')+'  ≥20% down</div>'+
        '</div>'+
        '<div class="rcell rcell-meta">'+
          '<div class="rmeta"><span class="rmeta-l">'+_tip('rate-hold','Rate Hold')+'</span><span class="rmeta-v">'+l.rateHold+'d</span></div>'+
          '<div class="rmeta"><span class="rmeta-l">'+_tip('prepay','Prepay')+'</span><span class="rmeta-v">'+l.prepay+'%/yr</span></div>'+
        '</div>'+
        '<div class="rcell rcell-cta"><a href="'+l.url+'" target="_blank" class="btn-rate-cta">Get Rate →</a></div>'+
      '</div>';
  }).join('');
}

// ══ BoC RATE CHART (pure SVG) ══
function _renderBocChart() {
  var el = document.getElementById('boc-chart');
  if (!el) return;

  var W = 560, H = 120, PL = 26, PR = 8, PT = 14, PB = 20;
  var cW = W - PL - PR, cH = H - PT - PB;
  var maxR = 5.6, minR = 0;
  var n = BOC_HISTORY.length;

  function xPos(i) { return PL + (i / (n - 1)) * cW; }
  function yPos(r) { return PT + cH - ((r - minR) / (maxR - minR)) * cH; }

  // Build SVG point array
  var pts = BOC_HISTORY.map(function(pt, i) { return {x: xPos(i), y: yPos(pt.r)}; });

  // Catmull-Rom smooth curve (organic, flowing)
  function catmullRom(pts) {
    var d = 'M ' + pts[0].x.toFixed(1) + ',' + pts[0].y.toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[Math.min(pts.length - 1, i + 2)];
      var tension = 0.4;
      var cp1x = p1.x + (p2.x - p0.x) * tension / 2;
      var cp1y = p1.y + (p2.y - p0.y) * tension / 2;
      var cp2x = p2.x - (p3.x - p1.x) * tension / 2;
      var cp2y = p2.y - (p3.y - p1.y) * tension / 2;
      d += ' C ' + cp1x.toFixed(1) + ',' + cp1y.toFixed(1) +
           ' ' + cp2x.toFixed(1) + ',' + cp2y.toFixed(1) +
           ' ' + p2.x.toFixed(1) + ',' + p2.y.toFixed(1);
    }
    return d;
  }

  var linePath  = catmullRom(pts);
  var closePath = linePath +
    ' L ' + pts[n-1].x.toFixed(1) + ',' + (PT + cH) +
    ' L ' + pts[0].x.toFixed(1)   + ',' + (PT + cH) + ' Z';

  // Y ticks — minimal: 0, 2.5, 5
  var yTicksSvg = [0, 2.5, 5].map(function(r) {
    var y = yPos(r).toFixed(1);
    return '<line x1="'+PL+'" x2="'+(PL+cW)+'" y1="'+y+'" y2="'+y+'" stroke="#f1f5f9" stroke-width="1"/>'+
           '<text x="'+(PL-3)+'" y="'+(+y+3)+'" text-anchor="end" font-size="7.5" fill="#cbd5e1">'+r+'%</text>';
  }).join('');

  // X labels — key dates only
  var xLabelsSvg = [0, 7, 13, 20, 25].map(function(i) {
    if (i >= n) return '';
    return '<text x="'+xPos(i).toFixed(1)+'" y="'+(PT+cH+13)+'" text-anchor="middle" font-size="7.5" fill="#94a3b8">'+BOC_HISTORY[i].d+'</text>';
  }).join('');

  // Annotation dots — 3 key moments
  var annots = {'Apr 2020':{l:'0.25%',c:'#0ea5e9'},'Jun 2023':{l:'Peak 5%',c:'#ef4444'},'Mar 2026':{l:'Today',c:'#10b981'}};
  var annotSvg = '';
  BOC_HISTORY.forEach(function(pt, i) {
    var ann = annots[pt.d]; if (!ann) return;
    var x = xPos(i), y = yPos(pt.r);
    var right = i > n * 0.65;
    var lx = right ? x - 5 : x + 5;
    annotSvg +=
      '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="3" fill="'+ann.c+'" stroke="#fff" stroke-width="1.5"/>'+
      '<text x="'+lx.toFixed(1)+'" y="'+(y-5).toFixed(1)+'" font-size="8" font-weight="700" fill="'+ann.c+'" text-anchor="'+(right?'end':'start')+'">'+ann.l+'</text>';
  });

  el.innerHTML =
    '<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">'+
      '<defs><linearGradient id="bocGrad2" x1="0" y1="0" x2="0" y2="1">'+
        '<stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.18"/>'+
        '<stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.01"/>'+
      '</linearGradient></defs>'+
      yTicksSvg+
      '<path d="'+closePath+'" fill="url(#bocGrad2)"/>'+
      '<path d="'+linePath+'" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'+
      xLabelsSvg+annotSvg+
    '</svg>';
}

// ══ MORTGAGE JOURNEY ══
function _renderMortgageJourney() {
  var el = document.getElementById('rates-journey');
  if (!el) return;
  var steps = [
    {icon:'💰', n:1, title:'Save for Down Payment', sub:'FHSA + RRSP HBP',
     body:'Open your FHSA immediately — contribution room builds from the year you open it, not when you deposit. Up to $8K/yr, $40K lifetime. Pair with RRSP Home Buyers\' Plan ($60K) for maximum tax savings.',
     cta:'Savings Planner', ctaPage:'calculator', ctaTab:'savings', color:'#0ea5e9'},
    {icon:'🧮', n:2, title:'Calculate Your Budget', sub:'Affordability & Stress Test',
     body:'Use the stress test to know your max. You must qualify at your rate +2% or 5.25%, whichever is higher. This tells lenders you can still afford your mortgage if rates rise.',
     cta:'Affordability Calc', ctaPage:'calculator', ctaTab:'affordability', color:'#10b981'},
    {icon:'📋', n:3, title:'Get Pre-Approved', sub:'Rate hold + credit check',
     body:'A pre-approval locks in today\'s rate for 90–150 days. Multiple mortgage inquiries within 14 days count as ONE hit on your credit score. Don\'t be afraid to shop around.',
     cta:null, ctaPage:null, ctaTab:null, color:'#7c3aed'},
    {icon:'🏡', n:4, title:'Shop for Your Home', sub:'With financing confidence',
     body:'Now you know your budget, rate, and monthly payment. Your realtor will help you search. When you find a home, make an offer with a financing condition — this protects you.',
     cta:'Find a Home', ctaPage:'listings', ctaTab:null, color:'#f59e0b'},
    {icon:'📝', n:5, title:'Firm Up the Mortgage', sub:'Full application + documents',
     body:'Provide income docs, employment letter, T4s, and bank statements. The lender orders a property appraisal. This is when your mortgage moves from pre-approved to approved.',
     cta:null, ctaPage:null, ctaTab:null, color:'#0891b2'},
    {icon:'⚖️', n:6, title:'Lawyer Reviews Everything', sub:'Title search + insurance',
     body:'Your real estate lawyer searches the property title, reviews the purchase agreement, arranges title insurance, and sets up the mortgage registration. Budget $1,500–$2,500 for legal fees.',
     cta:'LTT Calculator', ctaPage:'calculator', ctaTab:'ltt', color:'#6366f1'},
    {icon:'🔑', n:7, title:'Close & Get Your Keys', sub:'Closing costs due today',
     body:'On closing day, your lawyer receives the mortgage funds from the lender and pays the seller. You pay your down payment + closing costs (land transfer tax, legal fees, adjustments). Then — keys!',
     cta:'Closing Costs', ctaPage:'financial', ctaTab:null, color:'#10b981'},
    {icon:'🔄', n:8, title:'Renew & Optimize', sub:'Every 1–5 years',
     body:'At renewal, you\'re not locked in — shop the full market again. Don\'t auto-renew with your bank. Most Canadians save thousands by switching lenders at renewal. Use our rate comparison above.',
     cta:null, ctaPage:null, ctaTab:null, color:'#7c3aed'}
  ];

  el.innerHTML = steps.map(function(s) {
    var cta = s.cta ? '<button class="journey-cta" onclick="showPage(\''+s.ctaPage+'\')'+(s.ctaTab?';showCalc(\''+s.ctaTab+'\',document.querySelector(\'[data-tab='+s.ctaTab+']\'))':'')+'" style="border-color:'+s.color+';color:'+s.color+'">'+s.cta+' →</button>' : '';
    return '<div class="journey-step">'+
      '<div class="journey-num" style="background:'+s.color+'">'+s.n+'</div>'+
      '<div class="journey-icon">'+s.icon+'</div>'+
      '<div class="journey-body">'+
        '<div class="journey-title">'+s.title+'</div>'+
        '<div class="journey-sub">'+s.sub+'</div>'+
        '<div class="journey-desc">'+s.body+'</div>'+
        cta+
      '</div>'+
    '</div>';
  }).join('');
}

// ══ RELATED MORTGAGE NEWS ══
function _renderRatesNews() {
  var el = document.getElementById('rates-news-grid');
  var section = document.getElementById('rates-news-section');
  if (!el) return;

  var raw = localStorage.getItem('cd_news_v2');
  if (!raw) { if(section) section.style.display='none'; return; }

  var data;
  try { data = JSON.parse(raw); } catch(e) { if(section) section.style.display='none'; return; }
  var items = (data && data.items) ? data.items : (Array.isArray(data) ? data : []);

  var keywords = ['rate','mortgage','bank of canada','boc','prime rate','interest rate','housing market','lending','refinanc','renewal','fixed','variable','cmhc','stress test','down payment','amortization'];
  var filtered = items.filter(function(it) {
    var text = ((it.title||'')+(it.description||'')+(it.body||'')).toLowerCase();
    return keywords.some(function(k){return text.indexOf(k) >= 0;});
  }).slice(0, 6);

  if (!filtered.length) { if(section) section.style.display='none'; return; }

  el.innerHTML = filtered.map(function(it) {
    var img = it.thumbnail ? '<div class="rn-img" style="background-image:url(\''+it.thumbnail+'\')"></div>' : '<div class="rn-img rn-img-ph"><span>📰</span></div>';
    var src = it._src || 'news';
    var srcColors = {'cbc':'#c41230','cmort':'#1a3a6b','better':'#0d5c63','boc':'#8b1a1a','bnn':'#0a2240','storeys':'#c2410c','mpamag':'#0277bd'};
    var srcColor = srcColors[src] || '#1a3a6b';
    var srcLabel = it._srcLabel || src.toUpperCase();
    var date = it.pubDate ? new Date(it.pubDate).toLocaleDateString('en-CA',{month:'short',day:'numeric'}) : '';
    return '<div class="rn-card" onclick="showPage(\'news\');" style="cursor:pointer">'+
      img+
      '<div class="rn-content">'+
        '<div class="rn-meta"><span class="rn-source" style="background:'+srcColor+'18;color:'+srcColor+'">'+srcLabel+'</span><span class="rn-date">'+date+'</span></div>'+
        '<div class="rn-title">'+it.title+'</div>'+
      '</div>'+
    '</div>';
  }).join('');
}

// ══ RATE ALERT SIGNUP ══
function rateAlertSignup() {
  var email = (document.getElementById('rate-alert-email') || {}).value || '';
  var msg = document.getElementById('rate-alert-msg');
  if (!email || !email.includes('@')) {
    if (msg) { msg.style.display='block'; msg.textContent='Please enter a valid email address.'; }
    return;
  }
  if (msg) { msg.style.display='block'; msg.textContent='✓ You\'re on the list! We\'ll alert you when rates change.'; msg.style.color='rgba(134,239,172,.9)'; }
  var input = document.getElementById('rate-alert-email');
  if (input) input.value = '';
  // Wire to insNewsletter flow if available
  if (typeof insNewsletter === 'function') insNewsletter('rates');
}
