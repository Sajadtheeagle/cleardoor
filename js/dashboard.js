/* ═══════════════════════════════════════════════════════
   CLEARDOOR — ADMIN DASHBOARD  (js/dashboard.js)
   Auth · Subscribers · Analytics · Charts (Canvas 2D)
   ═══════════════════════════════════════════════════════ */

var DASH_PASS        = 'cleardoor2026';
var DASH_STORE_KEY   = 'cd_subscribers';
var DASH_WEBHOOK_KEY = 'cd_newsletter_webhook';

/* ══════════════════════════════════════
   AUTH
   ══════════════════════════════════════ */
var _dashRefreshTimer = null;

function dashLogin() {
  var inp = document.getElementById('dash-pass');
  var err = document.getElementById('dash-login-err');
  if (!inp) return;
  if (inp.value.trim() === DASH_PASS) {
    document.getElementById('dash-login').style.display = 'none';
    document.getElementById('dash-content').style.display = 'block';
    localStorage.setItem('dash_auth', '1');   /* persists across sessions */
    dashInit();
    dashStartAutoRefresh();
  } else {
    if (err) { err.textContent = 'Wrong password'; err.style.display = 'block'; }
  }
}
function dashLogout() {
  localStorage.removeItem('dash_auth');
  dashStopAutoRefresh();
  document.getElementById('dash-login').style.display = 'flex';
  document.getElementById('dash-content').style.display = 'none';
}
function dashCheckAuth() {
  if (localStorage.getItem('dash_auth') === '1') {
    document.getElementById('dash-login').style.display = 'none';
    document.getElementById('dash-content').style.display = 'block';
    dashInit();
    dashStartAutoRefresh();
  }
}
/* Auto-refresh dashboard data every 60 seconds while the page is open */
function dashStartAutoRefresh() {
  dashStopAutoRefresh();
  _dashRefreshTimer = setInterval(function() {
    /* only refresh the active tab */
    var activeTab = (document.querySelector('.dash-tab.active') || {}).dataset && document.querySelector('.dash-tab.active').dataset.tab || 'overview';
    if (activeTab === 'overview')    dashRenderOverview();
    if (activeTab === 'behaviour')   dashRenderBehaviour();
    if (activeTab === 'content')     dashRenderContent();
    if (activeTab === 'seo')         dashRenderSEO();
    if (activeTab === 'subscribers') dashRenderSubscribers();
    /* update last-refreshed timestamp */
    var ts = document.getElementById('dash-refresh-ts');
    if (ts) ts.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
  }, 60000);
}
function dashStopAutoRefresh() {
  if (_dashRefreshTimer) { clearInterval(_dashRefreshTimer); _dashRefreshTimer = null; }
}

/* ══════════════════════════════════════
   NEWSLETTER STORAGE
   ══════════════════════════════════════ */
function dashGetSubscribers() {
  try { return JSON.parse(localStorage.getItem(DASH_STORE_KEY) || '[]'); }
  catch (e) { return []; }
}
function dashSaveSubscriber(email, page) {
  var subs = dashGetSubscribers();
  var exists = subs.some(function (s) { return s.email === email; });
  if (exists) return;
  subs.push({ email: email, date: new Date().toISOString(), page: page || 'unknown' });
  localStorage.setItem(DASH_STORE_KEY, JSON.stringify(subs));
  /* Webhook */
  var webhook = localStorage.getItem(DASH_WEBHOOK_KEY);
  if (webhook) {
    fetch(webhook, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, page: page })
    }).catch(function () {});
  }
}

/* ══════════════════════════════════════
   WEBHOOK SETTINGS
   ══════════════════════════════════════ */
function dashSaveWebhook() {
  var inp    = document.getElementById('dash-webhook-url');
  var status = document.getElementById('dash-webhook-status');
  if (!inp) return;
  var url = inp.value.trim();
  if (url) {
    localStorage.setItem(DASH_WEBHOOK_KEY, url);
    if (status) status.innerHTML = '<span style="color:#2e7d32;font-weight:600">Webhook saved.</span>';
  } else {
    localStorage.removeItem(DASH_WEBHOOK_KEY);
    if (status) status.innerHTML = '<span style="color:#64748b">Webhook removed.</span>';
  }
}

/* ══════════════════════════════════════
   EXPORT CSV
   ══════════════════════════════════════ */
function dashExportCSV() {
  var subs = dashGetSubscribers();
  if (subs.length === 0) { alert('No subscribers to export.'); return; }
  var csv = 'Email,Date,Source Page\n';
  subs.forEach(function (s) {
    csv += '"' + s.email + '",' + s.date + ',"' + (s.page || '') + '"\n';
  });
  var blob = new Blob([csv], { type: 'text/csv' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href = url;
  a.download = 'cleardoor-subscribers-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════
   TAB SWITCHING
   ══════════════════════════════════════ */
function dashSwitchTab(tab, btn) {
  document.querySelectorAll('.dash-panel').forEach(function (p) { p.style.display = 'none'; });
  document.querySelectorAll('.dash-tab').forEach(function (b) { b.classList.remove('active'); });
  var panel = document.getElementById('dash-panel-' + tab);
  if (panel) panel.style.display = '';
  if (btn) btn.classList.add('active');
  /* Render charts lazily when tab becomes visible */
  if (tab === 'overview')   { dashRenderOverview(); }
  if (tab === 'behaviour')  { dashRenderBehaviour(); }
  if (tab === 'content')    { dashRenderContent(); }
  if (tab === 'seo')        { dashRenderSEO(); }
  if (tab === 'subscribers'){ dashRenderSubscribers(); }
}

/* ══════════════════════════════════════
   ANALYTICS HELPERS
   ══════════════════════════════════════ */
function dashGetEvents() {
  if (typeof cdGetAnalytics === 'function') return cdGetAnalytics();
  try { return JSON.parse(localStorage.getItem('cd_analytics_v2') || '[]'); }
  catch (e) { return []; }
}

function dashLast30Days() {
  var cutoff = Date.now() - 30 * 24 * 3600 * 1000;
  return dashGetEvents().filter(function (e) { return e.ts >= cutoff; });
}

/* Count occurrences of field values in an event array */
function dashCount(events, field) {
  var map = {};
  events.forEach(function (e) {
    var key = e[field] || 'unknown';
    map[key] = (map[key] || 0) + 1;
  });
  return map;
}

/* Sort a {key:count} object → [[key,count]…] descending */
function dashSortMap(map) {
  return Object.keys(map).map(function (k) { return [k, map[k]]; })
    .sort(function (a, b) { return b[1] - a[1]; });
}

/* Group pageview events by calendar day (YYYY-MM-DD) — last 30 days */
function dashSessionsByDay(events) {
  var map = {};
  /* Build a list of last 30 days */
  for (var i = 29; i >= 0; i--) {
    var d = new Date(Date.now() - i * 86400000);
    var key = d.toISOString().slice(0, 10);
    map[key] = new Set();
  }
  events.forEach(function (e) {
    if (e.t !== 'pageview') return;
    var key = new Date(e.ts).toISOString().slice(0, 10);
    if (map[key] !== undefined) map[key].add(e.session);
  });
  /* Convert sets to counts */
  var result = [];
  Object.keys(map).sort().forEach(function (k) {
    result.push({ date: k, count: map[k].size });
  });
  return result;
}

/* Format milliseconds to "Xm Ys" */
function dashFmtDuration(ms) {
  if (!ms || ms < 0) return '0s';
  var secs = Math.round(ms / 1000);
  var mins = Math.floor(secs / 60);
  var rem  = secs % 60;
  if (mins === 0) return rem + 's';
  return mins + 'm ' + rem + 's';
}

/* ══════════════════════════════════════
   CANVAS CHART HELPERS
   ══════════════════════════════════════ */

/* Draw a bar chart on a canvas element.
   data: [{label, value}]
   tooltip: DOM element for hover tooltip
*/
function dashDrawBarChart(canvas, data, opts) {
  opts = opts || {};
  var dpr  = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  var W    = rect.width  || canvas.offsetWidth  || 600;
  var H    = rect.height || canvas.offsetHeight || 200;

  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';

  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  if (!data || data.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No data yet', W / 2, H / 2);
    return;
  }

  var padL = opts.padL !== undefined ? opts.padL : 36;
  var padR = 12;
  var padT = 14;
  var padB = opts.padB !== undefined ? opts.padB : 36;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;

  var maxVal = Math.max.apply(null, data.map(function (d) { return d.value; }));
  if (maxVal === 0) maxVal = 1;

  /* Y-axis gridlines */
  var gridLines = 4;
  ctx.strokeStyle = '#f0f4f8';
  ctx.lineWidth   = 1;
  for (var gi = 0; gi <= gridLines; gi++) {
    var yg = padT + chartH - (gi / gridLines) * chartH;
    ctx.beginPath();
    ctx.moveTo(padL, yg);
    ctx.lineTo(padL + chartW, yg);
    ctx.stroke();
    /* Y label */
    var yVal = Math.round((gi / gridLines) * maxVal);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(yVal, padL - 4, yg + 3);
  }

  /* Bars */
  var n       = data.length;
  var groupW  = chartW / n;
  var barW    = Math.max(4, Math.min(groupW * 0.55, 48));
  var radius  = Math.min(4, barW / 2);
  var baseClr = opts.color || '#1a3a6b';

  /* Store bar rects for tooltip hit-testing */
  var barRects = [];

  data.forEach(function (d, i) {
    var barH  = Math.max(1, (d.value / maxVal) * chartH);
    var x     = padL + i * groupW + (groupW - barW) / 2;
    var y     = padT + chartH - barH;

    /* Slight opacity variation for visual depth */
    var opacity = 0.65 + (i % 3) * 0.1;
    ctx.fillStyle = baseClr;
    ctx.globalAlpha = opacity;

    /* Rounded-top rectangle */
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + barW - radius, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
    ctx.lineTo(x + barW, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    barRects.push({ x: x, y: y, w: barW, h: barH, label: d.label, value: d.value });

    /* X label */
    ctx.fillStyle = '#64748b';
    ctx.font = '9px system-ui, sans-serif';
    ctx.textAlign = 'center';
    var lbl = String(d.label || '');
    /* Truncate long labels */
    if (lbl.length > 8) lbl = lbl.slice(0, 7) + '…';
    ctx.fillText(lbl, x + barW / 2, H - padB + 12);
  });

  /* Hover tooltip */
  var tooltip = opts.tooltip;
  if (tooltip) {
    canvas.addEventListener('mousemove', function (ev) {
      var cr  = canvas.getBoundingClientRect();
      var mx  = (ev.clientX - cr.left);
      var my  = (ev.clientY - cr.top);
      var hit = null;
      for (var bi = 0; bi < barRects.length; bi++) {
        var br = barRects[bi];
        if (mx >= br.x && mx <= br.x + br.w && my >= br.y && my <= br.y + br.h) {
          hit = br; break;
        }
      }
      if (hit) {
        tooltip.textContent = hit.label + ': ' + hit.value;
        tooltip.style.display = 'block';
        tooltip.style.left = (hit.x + hit.w / 2 - 30) + 'px';
        tooltip.style.top  = (hit.y - 28) + 'px';
      } else {
        tooltip.style.display = 'none';
      }
    });
    canvas.addEventListener('mouseleave', function () {
      tooltip.style.display = 'none';
    });
  }
}

/* Draw a time-series bar chart (sessions/day) */
function dashDrawTimeChart(canvas, dailyData, opts) {
  /* Use abbreviated date labels like "Mar 5" */
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var data = dailyData.map(function (d) {
    var dt  = new Date(d.date + 'T00:00:00');
    var lbl = months[dt.getMonth()] + ' ' + dt.getDate();
    return { label: lbl, value: d.count };
  });
  /* Show only every Nth label to avoid overlap */
  var n = data.length;
  data = data.map(function (d, i) {
    return { label: (n <= 14 || i % Math.ceil(n / 10) === 0) ? d.label : '', value: d.value };
  });
  dashDrawBarChart(canvas, data, opts);
}

/* ══════════════════════════════════════
   OVERVIEW TAB
   ══════════════════════════════════════ */
function dashRenderOverview() {
  var events30 = dashLast30Days();
  var subs     = dashGetSubscribers();

  /* ── KPI Values ── */
  var sessions30 = new Set(events30.filter(function(e){return e.t==='pageview';}).map(function(e){return e.session;})).size;
  var pageviews30 = events30.filter(function(e){return e.t==='pageview';}).length;
  var uniqueVisitors = new Set(events30.map(function(e){return e.session;})).size;

  /* Most visited page */
  var pvMap = dashCount(events30.filter(function(e){return e.t==='pageview';}), 'page');
  var pvSorted = dashSortMap(pvMap);
  var topPage = pvSorted.length ? pvSorted[0][0] : 'N/A';

  /* Top calculator */
  var calcEvents = events30.filter(function(e){return e.t==='calc';});
  var calcMap    = dashCount(calcEvents, 'calc');
  var calcSorted = dashSortMap(calcMap);
  var topCalc    = calcSorted.length ? calcSorted[0][0] : 'N/A';

  /* Top channel — from session_start events */
  var sessionStarts30 = events30.filter(function(e){ return e.t === 'session_start'; });
  var channelMap  = dashCount(sessionStarts30, 'channel');
  var channelSort = dashSortMap(channelMap);
  var topChannel  = channelSort.length ? channelSort[0][0] : 'N/A';

  /* Top city — from geo field on session_start events */
  var cityMap = {};
  sessionStarts30.forEach(function(e) {
    if (e.geo && e.geo.city) {
      var city = e.geo.city;
      cityMap[city] = (cityMap[city] || 0) + 1;
    }
  });
  var citySorted = dashSortMap(cityMap);
  var topCity = citySorted.length ? citySorted[0][0] : 'N/A';

  /* Render KPI grid */
  var grid = document.getElementById('dash-kpi-grid');
  if (grid) {
    grid.className = 'dash-kpi-grid';
    grid.innerHTML = [
      dashKpiCard('📅', 'Sessions (30d)',   sessions30,     'Unique sessions',      '#1a3a6b'),
      dashKpiCard('👁️', 'Page Views (30d)', pageviews30,    'Total views',          '#0a1628'),
      dashKpiCard('👥', 'Unique Visitors',  uniqueVisitors, 'By session ID',        '#1e5f8e'),
      dashKpiCard('🏆', 'Top Page',         topPage,        'Most visited',         '#2e7d32'),
      dashKpiCard('🧮', 'Top Calculator',   topCalc,        'Most used',            '#5c6bc0'),
      dashKpiCard('📬', 'Subscribers',      subs.length,    'Newsletter all-time',  '#c0392b'),
      dashKpiCard('📡', 'Top Channel',      topChannel,     'Primary traffic source','#0891b2'),
      dashKpiCard('🌆', 'Top City',         topCity,        'Most visitors from',   '#7c3aed')
    ].join('');
  }

  /* ── Sessions/day chart ── */
  var cleanDaily = dashSessionsByDay(
    (function(){
      var all = dashGetEvents();
      var cutoff = Date.now() - 30*24*3600*1000;
      return all.filter(function(e){return e.ts>=cutoff;});
    })()
  );

  var sessionsChartWrap = document.getElementById('dash-sessions-chart-wrap');
  if (sessionsChartWrap) {
    var canvas  = sessionsChartWrap.querySelector('canvas');
    var tooltip = sessionsChartWrap.querySelector('.dash-chart-tooltip');
    if (canvas) {
      setTimeout(function(){
        dashDrawTimeChart(canvas, cleanDaily, { tooltip: tooltip, color: '#1a3a6b', padB: 40 });
      }, 50);
    }
  }

  /* ── Device breakdown ── */
  var devMap  = dashCount(events30.filter(function(e){return e.t==='session_start';}), 'device');
  var devEl   = document.getElementById('dash-device-pills');
  var devIcons = { mobile: '📱', tablet: '🖥️', desktop: '💻' };
  if (devEl) {
    devEl.innerHTML = Object.keys(devMap).length ? Object.keys(devMap).map(function (d) {
      return '<div class="dash-device-pill">' + (devIcons[d] || '🖥️') + ' ' +
        '<strong>' + d + '</strong>: ' + devMap[d] + '</div>';
    }).join('') : '<div class="dash-empty">No device data yet.</div>';
  }

  /* ── Traffic Channels table ── */
  dashRenderChannelsTable(events30);

  /* ── Visitor Locations tables ── */
  dashRenderLocations(events30);
}

/* ══════════════════════════════════════
   TRAFFIC CHANNELS TABLE
   ══════════════════════════════════════ */
function dashRenderChannelsTable(events30) {
  var el = document.getElementById('dash-channels-table');
  if (!el) return;

  var sessions = events30.filter(function(e){ return e.t === 'session_start'; });
  if (sessions.length === 0) {
    el.innerHTML = '<div class="dash-empty">No channel data yet — visit the live site from different sources to populate this.</div>';
    return;
  }

  /* Build channel map: channel → {sessions, devices:{}, pages:{}, lastSeen} */
  var chMap = {};
  sessions.forEach(function(e) {
    var ch = e.channel || 'Direct';
    if (!chMap[ch]) chMap[ch] = { count: 0, devices: {}, pages: {}, lastSeen: 0 };
    chMap[ch].count++;
    if (e.device) chMap[ch].devices[e.device] = (chMap[ch].devices[e.device] || 0) + 1;
    if (e.ts > chMap[ch].lastSeen) chMap[ch].lastSeen = e.ts;
  });

  /* Map page views to sessions for "pages/session" */
  var pvBySess = {};
  events30.filter(function(e){ return e.t === 'pageview'; }).forEach(function(e) {
    pvBySess[e.session] = (pvBySess[e.session] || 0) + 1;
  });

  /* Average pages/session per channel */
  var chAvgPages = {};
  sessions.forEach(function(e) {
    var ch = e.channel || 'Direct';
    if (!chAvgPages[ch]) chAvgPages[ch] = { total: 0, count: 0 };
    chAvgPages[ch].total += pvBySess[e.session] || 1;
    chAvgPages[ch].count++;
  });

  var total = sessions.length;
  var sorted = dashSortMap(dashCount(sessions, 'channel'));

  /* Channel icons */
  var chIcons = {
    'Direct': '🔗', 'Google': '🔍', 'Bing': '🔎',
    'Facebook': '👥', 'Instagram': '📸', 'LinkedIn': '💼',
    'X / Twitter': '🐦', 'YouTube': '▶️', 'Email': '📧', 'Internal': '🏠'
  };

  var html = '<div class="dash-table-scroll"><table class="dash-table">' +
    '<thead><tr>' +
      '<th>Channel</th>' +
      '<th>Sessions</th>' +
      '<th>Share</th>' +
      '<th>Avg Pages/Session</th>' +
      '<th>Device Split</th>' +
      '<th>Last Visit</th>' +
    '</tr></thead><tbody>';

  sorted.forEach(function(row) {
    var ch   = row[0];
    var cnt  = row[1];
    var pct  = ((cnt / total) * 100).toFixed(1);
    var d    = chMap[ch];
    var icon = chIcons[ch] || (ch.indexOf('Referral:') === 0 ? '🌐' : (ch.indexOf('UTM:') === 0 ? '📣' : '🔗'));
    var lastSeen = d.lastSeen ? new Date(d.lastSeen).toLocaleDateString('en-CA') : '—';

    /* Device split as compact pills */
    var devPills = Object.keys(d.devices).map(function(dv) {
      var dvIcons = { mobile: '📱', tablet: '⬜', desktop: '💻' };
      return '<span class="dash-ch-device">' + (dvIcons[dv] || dv[0].toUpperCase()) + ' ' + d.devices[dv] + '</span>';
    }).join('');

    /* Avg pages/session */
    var ap = chAvgPages[ch] ? (chAvgPages[ch].total / chAvgPages[ch].count).toFixed(1) : '—';

    /* Bar in "Share" column */
    var barPct = ((cnt / sorted[0][1]) * 100).toFixed(0);
    var shareCell =
      '<div style="display:flex;align-items:center;gap:.4rem">' +
        '<div style="width:60px;background:#f0f4f8;border-radius:4px;height:8px;overflow:hidden">' +
          '<div style="width:' + barPct + '%;height:100%;background:#1a3a6b;border-radius:4px"></div>' +
        '</div>' +
        '<span style="font-size:.8rem;color:#64748b">' + pct + '%</span>' +
      '</div>';

    html += '<tr>' +
      '<td><span class="dash-ch-icon">' + icon + '</span> <strong>' + ch + '</strong></td>' +
      '<td><strong>' + cnt + '</strong></td>' +
      '<td>' + shareCell + '</td>' +
      '<td style="color:#0891b2;font-weight:600">' + ap + '</td>' +
      '<td>' + (devPills || '—') + '</td>' +
      '<td style="color:#94a3b8;font-size:.8rem">' + lastSeen + '</td>' +
    '</tr>';
  });

  el.innerHTML = html + '</tbody></table></div>';
}

/* ══════════════════════════════════════
   VISITOR LOCATIONS TABLES
   ══════════════════════════════════════ */
function dashRenderLocations(events30) {
  var sessions = events30.filter(function(e){ return e.t === 'session_start'; });
  var total    = sessions.length || 1;

  /* ── Country table ── */
  var countryEl = document.getElementById('dash-locations-country');
  if (countryEl) {
    var countryMap  = {};
    var countryDev  = {};
    var countryLast = {};
    sessions.forEach(function(e) {
      var c = (e.geo && e.geo.country) ? e.geo.country : 'Unknown';
      countryMap[c]  = (countryMap[c]  || 0) + 1;
      if (!countryDev[c]) countryDev[c] = {};
      if (e.device) countryDev[c][e.device] = (countryDev[c][e.device] || 0) + 1;
      if (!countryLast[c] || e.ts > countryLast[c]) countryLast[c] = e.ts;
    });
    var cSorted = dashSortMap(countryMap);

    var countryFlags = { 'Canada':'🇨🇦','United States':'🇺🇸','United Kingdom':'🇬🇧','Australia':'🇦🇺','France':'🇫🇷','Germany':'🇩🇪','India':'🇮🇳','China':'🇨🇳','Japan':'🇯🇵','South Korea':'🇰🇷','Unknown':'🌍' };

    if (cSorted.length === 0) {
      countryEl.innerHTML += '<div class="dash-empty">No location data yet.</div>';
    } else {
      var html = '<div class="dash-table-scroll"><table class="dash-table">' +
        '<thead><tr><th>Country</th><th>Sessions</th><th>Share</th><th>Last Visit</th></tr></thead><tbody>';
      cSorted.forEach(function(row, i) {
        var pct      = ((row[1] / total) * 100).toFixed(1);
        var flag     = countryFlags[row[0]] || '🌍';
        var lastSeen = countryLast[row[0]] ? new Date(countryLast[row[0]]).toLocaleDateString('en-CA') : '—';
        var barPct   = ((row[1] / cSorted[0][1]) * 100).toFixed(0);
        html += '<tr>' +
          '<td>' + flag + ' <strong>' + row[0] + '</strong></td>' +
          '<td><strong>' + row[1] + '</strong></td>' +
          '<td>' +
            '<div style="display:flex;align-items:center;gap:.4rem">' +
              '<div style="width:50px;background:#f0f4f8;border-radius:4px;height:7px;overflow:hidden">' +
                '<div style="width:' + barPct + '%;height:100%;background:#2e7d32;border-radius:4px"></div>' +
              '</div>' +
              '<span style="font-size:.78rem;color:#64748b">' + pct + '%</span>' +
            '</div>' +
          '</td>' +
          '<td style="color:#94a3b8;font-size:.78rem">' + lastSeen + '</td>' +
        '</tr>';
      });
      countryEl.innerHTML = '<div class="dash-chart-title">By Country</div>' + html + '</tbody></table></div>';
    }
  }

  /* ── City table ── */
  var cityEl = document.getElementById('dash-locations-city');
  if (cityEl) {
    var cityMap  = {};
    var cityCountry = {};
    var cityLast = {};
    sessions.forEach(function(e) {
      if (!e.geo || !e.geo.city) return;
      var c = e.geo.city;
      cityMap[c]  = (cityMap[c]  || 0) + 1;
      if (e.geo.country && !cityCountry[c]) cityCountry[c] = e.geo.country;
      if (!cityLast[c] || e.ts > cityLast[c]) cityLast[c] = e.ts;
    });
    var citySorted = dashSortMap(cityMap);

    if (citySorted.length === 0) {
      cityEl.innerHTML += '<div class="dash-empty">No city data yet — requires geolocation API response.</div>';
    } else {
      var html = '<div class="dash-table-scroll"><table class="dash-table">' +
        '<thead><tr><th>City</th><th>Country</th><th>Sessions</th><th>Last Visit</th></tr></thead><tbody>';
      citySorted.slice(0, 20).forEach(function(row) {
        var lastSeen = cityLast[row[0]] ? new Date(cityLast[row[0]]).toLocaleDateString('en-CA') : '—';
        var barPct   = ((row[1] / citySorted[0][1]) * 100).toFixed(0);
        var country  = cityCountry[row[0]] || '';
        html += '<tr>' +
          '<td>' +
            '<div style="display:flex;align-items:center;gap:.5rem">' +
              '<div style="width:40px;background:#f0f4f8;border-radius:4px;height:6px;overflow:hidden">' +
                '<div style="width:' + barPct + '%;height:100%;background:#7c3aed;border-radius:4px"></div>' +
              '</div>' +
              '<strong>' + row[0] + '</strong>' +
            '</div>' +
          '</td>' +
          '<td style="color:#64748b;font-size:.8rem">' + country + '</td>' +
          '<td><strong>' + row[1] + '</strong></td>' +
          '<td style="color:#94a3b8;font-size:.78rem">' + lastSeen + '</td>' +
        '</tr>';
      });
      cityEl.innerHTML = '<div class="dash-chart-title">By City</div>' + html + '</tbody></table></div>';
    }
  }
}

function dashKpiCard(icon, label, value, sub, accent) {
  return '<div class="dash-kpi-card" style="--kpi-accent:' + (accent||'#1a3a6b') + '">' +
    '<span class="dash-kpi-icon">' + icon + '</span>' +
    '<div class="dash-kpi-value">' + value + '</div>' +
    '<div class="dash-kpi-label">' + label + '</div>' +
    '<div class="dash-kpi-sub">'   + sub   + '</div>' +
  '</div>';
}

/* ══════════════════════════════════════
   BEHAVIOUR TAB
   ══════════════════════════════════════ */
function dashRenderBehaviour() {
  var events30 = dashLast30Days();

  /* ── Top Pages Table ── */
  var pvEvents = events30.filter(function(e){return e.t==='pageview';});
  var pvMap    = dashCount(pvEvents, 'page');
  var pvTotal  = pvEvents.length || 1;
  var pvSorted = dashSortMap(pvMap);
  var pagesEl  = document.getElementById('dash-top-pages');
  if (pagesEl) {
    if (pvSorted.length === 0) {
      pagesEl.innerHTML = '<div class="dash-empty">No page view data yet. Browse the site to generate data.</div>';
    } else {
      var html = '<div class="dash-table-scroll"><table class="dash-table">' +
        '<thead><tr><th>#</th><th>Page</th><th>Views</th><th>% of Total</th></tr></thead><tbody>';
      pvSorted.forEach(function (row, i) {
        var pct = ((row[1] / pvTotal) * 100).toFixed(1);
        html += '<tr><td>' + (i+1) + '</td>' +
          '<td style="font-weight:700;color:#0a1628;text-transform:capitalize">' + row[0] + '</td>' +
          '<td>' + row[1] + '</td>' +
          '<td><span class="dash-positive">' + pct + '%</span></td></tr>';
      });
      pagesEl.innerHTML = html + '</tbody></table></div>';
    }
  }

  /* ── Calculator Usage Chart ── */
  var calcEvents = events30.filter(function(e){return e.t==='calc';});
  var calcMap    = dashCount(calcEvents, 'calc');
  var calcSorted = dashSortMap(calcMap);
  var calcChartWrap = document.getElementById('dash-calc-chart-wrap');
  if (calcChartWrap) {
    var canvas  = calcChartWrap.querySelector('canvas');
    var tooltip = calcChartWrap.querySelector('.dash-chart-tooltip');
    if (canvas) {
      var calcData = calcSorted.map(function(r){return {label:r[0], value:r[1]};});
      setTimeout(function(){
        dashDrawBarChart(canvas, calcData, { tooltip: tooltip, color: '#5c6bc0' });
      }, 50);
    }
  }

  /* ── Top CTAs ── */
  var ctaEvents = events30.filter(function(e){return e.t==='click' && e.cta;});
  var ctaMap    = dashCount(ctaEvents, 'cta');
  var ctaSorted = dashSortMap(ctaMap);
  var ctaEl     = document.getElementById('dash-top-ctas');
  if (ctaEl) {
    if (ctaSorted.length === 0) {
      ctaEl.innerHTML = '<div class="dash-empty">No CTA clicks recorded yet.</div>';
    } else {
      var maxCta = ctaSorted[0][1] || 1;
      ctaEl.innerHTML = ctaSorted.slice(0, 10).map(function (row) {
        var pct = Math.round((row[1] / maxCta) * 100);
        return '<div class="dash-bar-row">' +
          '<div class="dash-bar-label" title="' + row[0] + '">' + row[0] + '</div>' +
          '<div class="dash-bar-track"><div class="dash-bar-fill" style="width:' + pct + '%;background:#1a3a6b"></div></div>' +
          '<div class="dash-bar-count">' + row[1] + '</div>' +
        '</div>';
      }).join('');
    }
  }

  /* ── Scroll Depth per Page ── */
  var scrollEvents = events30.filter(function(e){return e.t==='scroll';});
  /* Build map: page → {25:n, 50:n, 75:n, 100:n} */
  var depthMap = {};
  scrollEvents.forEach(function(e){
    if (!depthMap[e.page]) depthMap[e.page] = {25:0,50:0,75:0,100:0};
    if (e.depth) depthMap[e.page][e.depth] = (depthMap[e.page][e.depth]||0)+1;
  });
  var depthEl = document.getElementById('dash-scroll-depth');
  if (depthEl) {
    var pages = Object.keys(depthMap);
    if (pages.length === 0) {
      depthEl.innerHTML = '<div class="dash-empty">No scroll data yet.</div>';
    } else {
      var depthColors = { 25: '#93c5fd', 50: '#60a5fa', 75: '#3b82f6', 100: '#1d4ed8' };
      depthEl.innerHTML = '<div class="dash-depth-grid">' +
        pages.map(function(pg){
          var d = depthMap[pg];
          var mx = Math.max(d[25]||0, d[50]||0, d[75]||0, d[100]||0) || 1;
          return '<div class="dash-depth-card">' +
            '<div class="dash-depth-page">' + pg + '</div>' +
            '<div class="dash-depth-bars">' +
              [25,50,75,100].map(function(m){
                var h = Math.round(((d[m]||0)/mx)*32) + 4;
                return '<div class="dash-depth-bar-seg" style="height:'+h+'px;background:'+depthColors[m]+'" title="'+m+'%: '+(d[m]||0)+'"></div>';
              }).join('') +
            '</div>' +
            '<div class="dash-depth-label"><span>25</span><span>50</span><span>75</span><span>100</span></div>' +
          '</div>';
        }).join('') + '</div>';
    }
  }

  /* ══ NEW: Time on Page table ══ */
  var topEl = document.getElementById('dash-time-on-page');
  if (topEl) {
    var topEvents = events30.filter(function(e){ return e.t === 'time_on_page' && e.duration_ms > 0; });
    /* Aggregate per page: sum duration, count, compute avg */
    var topMap = {};
    topEvents.forEach(function(e) {
      var pg = e.page || 'unknown';
      if (!topMap[pg]) topMap[pg] = { total: 0, count: 0 };
      topMap[pg].total += e.duration_ms;
      topMap[pg].count++;
    });
    var topSorted = Object.keys(topMap)
      .map(function(pg) {
        return { page: pg, avg: topMap[pg].total / topMap[pg].count, count: topMap[pg].count };
      })
      .sort(function(a, b) { return b.avg - a.avg; });

    if (topSorted.length === 0) {
      topEl.innerHTML = '<div class="dash-empty">No time-on-page data yet. Browse the site to generate data.</div>';
    } else {
      var html = '<div class="dash-table-scroll"><table class="dash-table">' +
        '<thead><tr><th>#</th><th>Page</th><th>Avg Time</th><th>Samples</th></tr></thead><tbody>';
      topSorted.forEach(function(row, i) {
        html += '<tr><td>' + (i+1) + '</td>' +
          '<td style="font-weight:700;color:#0a1628;text-transform:capitalize">' + row.page + '</td>' +
          '<td><span class="dash-positive">' + dashFmtDuration(row.avg) + '</span></td>' +
          '<td>' + row.count + '</td></tr>';
      });
      topEl.innerHTML = html + '</tbody></table></div>';
    }
  }

  /* ══ NEW: Most Clicked Buttons ══ */
  var btnEl = document.getElementById('dash-clicked-buttons');
  if (btnEl) {
    var btnEvents = events30.filter(function(e){ return e.t === 'click' && e.label; });
    var btnMap    = dashCount(btnEvents, 'label');
    var btnSorted = dashSortMap(btnMap);
    if (btnSorted.length === 0) {
      btnEl.innerHTML = '<div class="dash-empty">No button click data yet.</div>';
    } else {
      var maxBtn = btnSorted[0][1] || 1;
      btnEl.innerHTML = btnSorted.slice(0, 10).map(function(row) {
        var pct = Math.round((row[1] / maxBtn) * 100);
        return '<div class="dash-bar-row">' +
          '<div class="dash-bar-label" title="' + row[0] + '">' + row[0] + '</div>' +
          '<div class="dash-bar-track"><div class="dash-bar-fill" style="width:' + pct + '%;background:#0891b2"></div></div>' +
          '<div class="dash-bar-count">' + row[1] + '</div>' +
        '</div>';
      }).join('');
    }
  }
}

/* ══════════════════════════════════════
   CONTENT TAB
   ══════════════════════════════════════ */
function dashRenderContent() {
  var events30 = dashLast30Days();
  var newsEvents = events30.filter(function(e){return e.t==='news';});

  /* ── Top Articles ── */
  var artMap    = {};
  newsEvents.forEach(function(e){
    var key = e.title || 'Unknown';
    if (!artMap[key]) artMap[key] = { count: 0, source: e.source || '' };
    artMap[key].count++;
  });
  var artSorted = Object.keys(artMap)
    .map(function(k){ return { title: k, count: artMap[k].count, source: artMap[k].source }; })
    .sort(function(a,b){ return b.count - a.count; })
    .slice(0, 20);

  var artEl = document.getElementById('dash-top-articles');
  if (artEl) {
    if (artSorted.length === 0) {
      /* Show news items from cache even if no tracking events */
      var newsData = null;
      try { newsData = JSON.parse(localStorage.getItem('cd_news_cache')); } catch(e){}
      if (newsData && newsData.items && newsData.items.length) {
        var items = newsData.items.slice(0,20);
        var html  = '<div class="dash-table-scroll"><table class="dash-table">' +
          '<thead><tr><th>#</th><th>Title</th><th>Source</th><th>Date</th></tr></thead><tbody>';
        items.forEach(function(item, i){
          var d  = new Date(item.pubDate);
          var dt = isNaN(d) ? '' : d.toLocaleDateString('en-CA');
          var src = item._publisher || item._src || '';
          if (newsData.sources){
            var found = newsData.sources.find(function(s){return s.id===item._src;});
            if (found) src = found.label;
          }
          html += '<tr><td>'+(i+1)+'</td>' +
            '<td><a href="'+(item.link||'#')+'" target="_blank">'+item.title+'</a></td>' +
            '<td>'+src+'</td><td>'+dt+'</td></tr>';
        });
        artEl.innerHTML = html + '</tbody></table></div>';
      } else {
        artEl.innerHTML = '<div class="dash-empty">No news article opens tracked yet. Open articles from the News tab.</div>';
      }
    } else {
      var html = '<div class="dash-table-scroll"><table class="dash-table">' +
        '<thead><tr><th>#</th><th>Title</th><th>Source</th><th>Opens</th></tr></thead><tbody>';
      artSorted.forEach(function(row, i){
        html += '<tr><td>'+(i+1)+'</td>' +
          '<td style="max-width:360px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600">'+row.title+'</td>' +
          '<td style="color:#64748b">'+row.source+'</td>' +
          '<td><span class="dash-badge--blue dash-badge">'+row.count+'</span></td></tr>';
      });
      artEl.innerHTML = html + '</tbody></table></div>';
    }
  }

  /* ── Articles by Source chart ── */
  var srcMap    = dashCount(newsEvents, 'source');
  var newsData2 = null;
  try { newsData2 = JSON.parse(localStorage.getItem('cd_news_cache')); } catch(e){}
  var srcSorted = dashSortMap(srcMap);

  var srcChartWrap = document.getElementById('dash-source-chart-wrap');
  if (srcChartWrap) {
    var canvas  = srcChartWrap.querySelector('canvas');
    var tooltip = srcChartWrap.querySelector('.dash-chart-tooltip');
    if (canvas) {
      var srcData = srcSorted.map(function(r){return {label:r[0],value:r[1]};});
      setTimeout(function(){
        dashDrawBarChart(canvas, srcData, { tooltip: tooltip, color: '#c0392b' });
      }, 50);
    }
  }

  /* Horizontal bar rows for source breakdown */
  var srcBarsEl = document.getElementById('dash-source-bars');
  if (srcBarsEl) {
    var displayMap = srcMap;
    if (!srcSorted.length && newsData2 && newsData2.items) {
      displayMap = {};
      newsData2.items.forEach(function(item){
        var src = item._publisher || item._src || 'unknown';
        if (newsData2.sources) {
          var found = newsData2.sources.find(function(s){return s.id===item._src;});
          if (found) src = found.label;
        }
        displayMap[src] = (displayMap[src]||0)+1;
      });
    }
    var dispSorted = dashSortMap(displayMap);
    if (!dispSorted.length) {
      srcBarsEl.innerHTML = '<div class="dash-empty">No source data available.</div>';
    } else {
      var maxSrc = dispSorted[0][1] || 1;
      srcBarsEl.innerHTML = dispSorted.map(function(row){
        var pct = Math.round((row[1]/maxSrc)*100);
        return '<div class="dash-bar-row">' +
          '<div class="dash-bar-label" title="'+row[0]+'">' + row[0] + '</div>' +
          '<div class="dash-bar-track"><div class="dash-bar-fill" style="width:'+pct+'%;background:#c0392b"></div></div>' +
          '<div class="dash-bar-count">' + row[1] + '</div>' +
        '</div>';
      }).join('');
    }
  }

  /* ══ NEW: Traffic by Source (reuse channel data) ══ */
  var trafficSrcEl = document.getElementById('dash-content-traffic-src');
  if (trafficSrcEl) {
    var sessStarts = events30.filter(function(e){ return e.t === 'session_start'; });
    var chMap  = dashCount(sessStarts, 'channel');
    var chSort = dashSortMap(chMap);
    var total  = sessStarts.length || 1;
    if (chSort.length === 0) {
      trafficSrcEl.innerHTML = '<div class="dash-empty">No traffic source data yet.</div>';
    } else {
      var maxCh = chSort[0][1] || 1;
      trafficSrcEl.innerHTML = chSort.map(function(row) {
        var barPct = Math.round((row[1] / maxCh) * 100);
        var totalPct = ((row[1] / total) * 100).toFixed(1);
        return '<div class="dash-bar-row">' +
          '<div class="dash-bar-label" title="' + row[0] + '">' + row[0] + '</div>' +
          '<div class="dash-bar-track"><div class="dash-bar-fill" style="width:' + barPct + '%;background:#0891b2"></div></div>' +
          '<div class="dash-bar-count">' + row[1] + '<span class="dash-channel-pct">' + totalPct + '%</span></div>' +
        '</div>';
      }).join('');
    }
  }
}

/* ══════════════════════════════════════
   SEO TAB  (Enhancement 5)
   ══════════════════════════════════════ */
function dashRenderSEO() {
  var panel = document.getElementById('dash-panel-seo');
  if (!panel) return;

  var events30     = dashLast30Days();
  var sessStarts30 = events30.filter(function(e){ return e.t === 'session_start'; });
  var total30      = sessStarts30.length || 1;

  /* ── Card 1: Organic Traffic ── */
  var organicSessions = sessStarts30.filter(function(e) {
    return e.channel === 'Google' || e.channel === 'Bing';
  });

  /* Organic sessions per week (4 weeks, newest first) */
  var now = Date.now();
  var weekBuckets = [0, 0, 0, 0]; /* index 0 = current week, 3 = oldest */
  organicSessions.forEach(function(e) {
    var ageMs  = now - e.ts;
    var weekIdx = Math.floor(ageMs / (7 * 24 * 3600 * 1000));
    if (weekIdx >= 0 && weekIdx < 4) weekBuckets[weekIdx]++;
  });
  /* weekBuckets[0] is newest; reverse for chronological display */
  var weekLabels = ['Wk -3', 'Wk -2', 'Wk -1', 'This wk'];
  var weekData   = weekBuckets.slice().reverse().map(function(v, i) {
    return { label: weekLabels[i], value: v };
  });

  var organicHtml = '<div class="dash-seo-card">' +
    '<div class="dash-chart-title">Organic Traffic (Google + Bing)</div>' +
    '<div class="dash-kpi-value" style="font-size:2.2rem;text-align:center;margin:.5rem 0">' + organicSessions.length + '</div>' +
    '<div style="text-align:center;color:#64748b;font-size:.82rem;margin-bottom:1rem">organic sessions in last 30 days</div>' +
    '<div style="position:relative;height:160px">' +
      '<canvas class="dash-chart-canvas" style="height:160px" id="dash-seo-organic-canvas"></canvas>' +
      '<div class="dash-chart-tooltip" id="dash-seo-organic-tip"></div>' +
    '</div>' +
  '</div>';

  /* ── Card 2: Traffic Sources breakdown ── */
  var chMap  = dashCount(sessStarts30, 'channel');
  var chSort = dashSortMap(chMap);
  var maxCh  = chSort.length ? chSort[0][1] : 1;

  var srcRows = chSort.map(function(row) {
    var barPct   = Math.round((row[1] / maxCh) * 100);
    var totalPct = ((row[1] / total30) * 100).toFixed(1);
    return '<div class="dash-bar-row">' +
      '<div class="dash-bar-label" title="' + row[0] + '">' + row[0] + '</div>' +
      '<div class="dash-bar-track"><div class="dash-bar-fill" style="width:' + barPct + '%;background:#1a3a6b"></div></div>' +
      '<div class="dash-bar-count">' + row[1] + '<span class="dash-channel-pct">' + totalPct + '%</span></div>' +
    '</div>';
  }).join('') || '<div class="dash-empty">No traffic source data yet.</div>';

  var sourcesHtml = '<div class="dash-seo-card">' +
    '<div class="dash-chart-title">Traffic Sources — Last 30 Days</div>' +
    srcRows +
  '</div>';

  /* ── Card 3: Top Referrer Domains ── */
  var referralEvents = sessStarts30.filter(function(e) {
    return e.channel && e.channel.indexOf('Referral: ') === 0;
  });
  var refDomainMap = {};
  var refLastSeen  = {};
  referralEvents.forEach(function(e) {
    var domain = e.channel.replace('Referral: ', '');
    refDomainMap[domain] = (refDomainMap[domain] || 0) + 1;
    if (!refLastSeen[domain] || e.ts > refLastSeen[domain]) {
      refLastSeen[domain] = e.ts;
    }
  });
  var refSorted = dashSortMap(refDomainMap).slice(0, 10);

  var refBody = '';
  if (refSorted.length === 0) {
    refBody = '<div class="dash-empty">No referral traffic yet.</div>';
  } else {
    var refHtml = '<div class="dash-table-scroll"><table class="dash-table">' +
      '<thead><tr><th>#</th><th>Domain</th><th>Sessions</th><th>Last Seen</th></tr></thead><tbody>';
    refSorted.forEach(function(row, i) {
      var lastSeen = refLastSeen[row[0]] ? new Date(refLastSeen[row[0]]).toLocaleDateString('en-CA') : '';
      refHtml += '<tr><td>' + (i+1) + '</td>' +
        '<td style="font-weight:600;color:#1a3a6b">' + row[0] + '</td>' +
        '<td>' + row[1] + '</td>' +
        '<td style="color:#64748b">' + lastSeen + '</td></tr>';
    });
    refBody = refHtml + '</tbody></table></div>';
  }

  var referrersHtml = '<div class="dash-seo-card">' +
    '<div class="dash-chart-title">Top Referrer Domains</div>' +
    refBody +
  '</div>';

  /* ── Card 4: Google Search Console CTA + Checklist ── */
  var ctaHtml = '<div class="dash-seo-cta">' +
    '<h3>📈 Connect Google Search Console</h3>' +
    '<p>See your exact keyword rankings, click-through rates, and impressions in Google\'s free dashboard.</p>' +
    '<a href="https://search.google.com/search-console" target="_blank" rel="noopener" class="rss-add-btn" style="display:inline-block;margin:.6rem 0 1rem;text-decoration:none">Open Search Console →</a>' +
    '<div style="color:rgba(255,255,255,.9);font-size:.83rem;margin-bottom:.8rem"><strong>3-step setup:</strong>' +
      '<ol style="margin:.4rem 0 0 1.2rem;line-height:1.9">' +
        '<li>Add your property (e.g. <em>cleardoor.ca</em>) in Search Console</li>' +
        '<li>Verify ownership via the HTML meta tag method</li>' +
        '<li>View the Performance report to see impressions, clicks &amp; rankings</li>' +
      '</ol>' +
    '</div>' +
    '<div class="dash-chart-title" style="color:rgba(255,255,255,.9);margin:.8rem 0 .3rem">Site Health Checklist</div>' +
    '<ul class="dash-checklist">' +
      '<li><span>✅</span> HTTPS enabled</li>' +
      '<li><span>✅</span> Mobile-friendly</li>' +
      '<li><span>✅</span> Sitemap exists</li>' +
      '<li><span>⚠️</span> Google Search Console not yet verified</li>' +
      '<li><span>⚠️</span> Structured data (schema.org) not detected</li>' +
    '</ul>' +
  '</div>';

  /* Inject everything into the panel */
  panel.innerHTML =
    '<div class="dash-section-title">SEO &amp; Traffic</div>' +
    '<div class="dash-two-col">' +
      organicHtml +
      sourcesHtml +
    '</div>' +
    referrersHtml +
    ctaHtml;

  /* Draw organic weekly chart after DOM is ready */
  setTimeout(function() {
    var orgCanvas = document.getElementById('dash-seo-organic-canvas');
    var orgTip    = document.getElementById('dash-seo-organic-tip');
    if (orgCanvas) {
      dashDrawBarChart(orgCanvas, weekData, { tooltip: orgTip, color: '#2e7d32', padB: 30 });
    }
  }, 60);
}

/* ══════════════════════════════════════
   SUBSCRIBERS TAB
   ══════════════════════════════════════ */
function dashRenderSubscribers() {
  var subs = dashGetSubscribers();
  var el   = document.getElementById('dash-sub-list');
  if (!el) return;
  if (subs.length === 0) {
    el.innerHTML = '<div class="dash-empty">No subscribers yet. Newsletter signups will appear here.</div>';
    return;
  }
  subs.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
  var html = '<div class="dash-table-scroll"><table class="dash-table">' +
    '<thead><tr><th>Email</th><th>Date</th><th>Source Page</th></tr></thead><tbody>';
  subs.forEach(function (s) {
    var d = new Date(s.date);
    html += '<tr>' +
      '<td style="font-weight:600;color:#0a1628">' + s.email + '</td>' +
      '<td>' + d.toLocaleDateString('en-CA') + ' ' + d.toLocaleTimeString('en-CA',{hour:'2-digit',minute:'2-digit'}) + '</td>' +
      '<td>' + (s.page||'') + '</td>' +
    '</tr>';
  });
  el.innerHTML = html + '</tbody></table></div>';
}

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
function dashInit() {
  /* Load saved webhook URL */
  var saved = localStorage.getItem(DASH_WEBHOOK_KEY);
  var wInp  = document.getElementById('dash-webhook-url');
  if (wInp && saved) wInp.value = saved;

  /* Render the default (overview) tab */
  dashRenderOverview();
  dashRenderSubscribers();
}
