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

// ══ LENDER DATA ══
const RATES_LENDERS = [
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
    id:'desjardins', name:'Desjardins', category:'credit-union',
    badge:'Credit Union', badgeColor:'#065f46', highlight:false,
    rateHold:120, prepay:15, url:'https://www.desjardins.com',
    fixed:{'1':{ins:4.79,uni:4.99},'2':{ins:4.39,uni:4.59},'3':{ins:4.14,uni:4.34},'4':{ins:4.19,uni:4.39},'5':{ins:4.14,uni:4.34},'7':{ins:4.54,uni:4.74},'10':{ins:4.89,uni:5.09}},
    variable:{'3':{ins:-0.55,uni:-0.25},'5':{ins:-0.65,uni:-0.40}},
    heloc:0.50
  },
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

  // Update insight
  var insightKey = (type === 'heloc') ? 'heloc' : (term + '_' + (type === 'variable' ? 'var' : 'fixed'));
  var insightEl = document.getElementById('rates-insight');
  if (insightEl) {
    var tips = RATES_INSIGHTS[insightKey];
    insightEl.style.display = tips ? '' : 'none';
    if (tips) insightEl.textContent = '💡 ' + tips;
  }

  // Update header amount
  var hdrEl = document.getElementById('rates-hdr-amount');
  if (hdrEl) hdrEl.textContent = '$' + amount.toLocaleString('en-CA') + ' mortgage';

  // HELOC special view
  if (type === 'heloc') {
    var helocLenders = RATES_LENDERS.filter(function(l){return l.heloc != null;});
    el.innerHTML = helocLenders.map(function(l) {
      var rate = (prime + l.heloc).toFixed(2);
      var cat = RATE_CAT[l.category] || {};
      return '<div class="rrow"><div class="rcell rcell-lender"><div class="rl-name">'+l.name+'</div><div class="rl-cat" style="color:'+cat.color+'">'+cat.label+'</div></div>'+
        '<div class="rcell rcell-rate"><div class="rrate">'+rate+'%</div><div class="rpayment">Prime + '+l.heloc.toFixed(2)+'%</div><div class="rlabel">Variable HELOC</div></div>'+
        '<div class="rcell rcell-meta"><div class="rmeta"><span class="rmeta-l">Rate Hold</span><span class="rmeta-v">'+l.rateHold+'d</span></div></div>'+
        '<div class="rcell rcell-cta"><a href="'+l.url+'" target="_blank" class="btn-rate-cta">Get Rate →</a></div></div>';
    }).join('');
    return;
  }

  // Build rows with computed rates
  var rows = RATES_LENDERS.filter(function(l) {
    if (type === 'fixed') return l.fixed && l.fixed[term];
    if (type === 'variable') return l.variable && l.variable[term];
    return false;
  }).map(function(l) {
    var ins, uni, insSpread, uniSpread;
    if (type === 'fixed') {
      ins = l.fixed[term].ins;
      uni = l.fixed[term].uni;
    } else {
      insSpread = l.variable[term].ins;
      uniSpread = l.variable[term].uni;
      ins = prime + insSpread;
      uni = prime + uniSpread;
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
    var divider = (bigBankStart === idx) ? '<div class="rrow-divider"><span>Big Bank Rates (Posted)</span></div>' : '';
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
          '<div class="rlabel">Insured (&lt;20% down)</div>'+
        '</div>'+
        '<div class="rcell rcell-rate">'+
          '<div class="rrate">'+l.uni.toFixed(2)+'%</div>'+
          spreadUniLabel+
          '<div class="rpayment">$'+Math.round(uniPayment).toLocaleString('en-CA')+'/mo</div>'+
          '<div class="rlabel">Uninsured (≥20% down)</div>'+
        '</div>'+
        '<div class="rcell rcell-meta">'+
          '<div class="rmeta"><span class="rmeta-l">Rate Hold</span><span class="rmeta-v">'+l.rateHold+'d</span></div>'+
          '<div class="rmeta"><span class="rmeta-l">Prepay</span><span class="rmeta-v">'+l.prepay+'%/yr</span></div>'+
        '</div>'+
        '<div class="rcell rcell-cta"><a href="'+l.url+'" target="_blank" class="btn-rate-cta">Get Rate →</a></div>'+
      '</div>';
  }).join('');
}
