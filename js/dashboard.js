/* ═══════════════════════════════════════════════════════
   CLEARDOOR — ADMIN DASHBOARD  (js/dashboard.js)
   Newsletter subscribers + News KPIs
   ═══════════════════════════════════════════════════════ */

var DASH_PASS = 'cleardoor2026';
var DASH_STORE_KEY = 'cd_subscribers';
var DASH_WEBHOOK_KEY = 'cd_newsletter_webhook';

/* ── Auth ── */
function dashLogin() {
  var inp = document.getElementById('dash-pass');
  var err = document.getElementById('dash-login-err');
  if (!inp) return;
  if (inp.value === DASH_PASS) {
    document.getElementById('dash-login').style.display = 'none';
    document.getElementById('dash-content').style.display = 'block';
    sessionStorage.setItem('dash_auth', '1');
    dashInit();
  } else {
    if (err) { err.textContent = 'Wrong password'; err.style.display = 'block'; }
  }
}
function dashLogout() {
  sessionStorage.removeItem('dash_auth');
  document.getElementById('dash-login').style.display = '';
  document.getElementById('dash-content').style.display = 'none';
}
function dashCheckAuth() {
  if (sessionStorage.getItem('dash_auth') === '1') {
    document.getElementById('dash-login').style.display = 'none';
    document.getElementById('dash-content').style.display = 'block';
    dashInit();
  }
}

/* ── Newsletter Storage ── */
function dashGetSubscribers() {
  try { return JSON.parse(localStorage.getItem(DASH_STORE_KEY) || '[]'); }
  catch (e) { return []; }
}
function dashSaveSubscriber(email, page) {
  var subs = dashGetSubscribers();
  /* Check for duplicates */
  var exists = subs.some(function(s) { return s.email === email; });
  if (exists) return;
  subs.push({ email: email, date: new Date().toISOString(), page: page || 'unknown' });
  localStorage.setItem(DASH_STORE_KEY, JSON.stringify(subs));
  /* Also send to webhook if configured */
  var webhook = localStorage.getItem(DASH_WEBHOOK_KEY);
  if (webhook) {
    fetch(webhook, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, page: page })
    }).catch(function() {});
  }
}

/* ── Webhook Settings ── */
function dashSaveWebhook() {
  var inp = document.getElementById('dash-webhook-url');
  var status = document.getElementById('dash-webhook-status');
  if (!inp) return;
  var url = inp.value.trim();
  if (url) {
    localStorage.setItem(DASH_WEBHOOK_KEY, url);
    if (status) { status.innerHTML = '<span style="color:var(--green);font-weight:600">Webhook saved.</span>'; }
  } else {
    localStorage.removeItem(DASH_WEBHOOK_KEY);
    if (status) { status.innerHTML = '<span style="color:var(--gray)">Webhook removed.</span>'; }
  }
}

/* ── Tab Switching ── */
function dashSwitchTab(tab, btn) {
  document.querySelectorAll('.dash-panel').forEach(function(p) { p.style.display = 'none'; });
  document.querySelectorAll('.dash-tab').forEach(function(b) { b.classList.remove('active'); });
  var panel = document.getElementById('dash-panel-' + tab);
  if (panel) panel.style.display = '';
  if (btn) btn.classList.add('active');
}

/* ── Init Dashboard ── */
function dashInit() {
  dashRenderKPIs();
  dashRenderSubscribers();
  dashRenderSources();
  dashRenderArticles();
  /* Load saved webhook URL */
  var saved = localStorage.getItem(DASH_WEBHOOK_KEY);
  var inp = document.getElementById('dash-webhook-url');
  if (inp && saved) inp.value = saved;
}

/* ── KPI Cards ── */
function dashRenderKPIs() {
  var subs = dashGetSubscribers();
  var newsData = null;
  try { newsData = JSON.parse(localStorage.getItem('cd_news_cache')); } catch (e) {}
  var totalArticles = newsData && newsData.items ? newsData.items.length : 0;
  var totalSources = newsData && newsData.sources ? newsData.sources.length : 0;
  var freshness = '';
  if (newsData && newsData.fetched) {
    var diff = Date.now() - new Date(newsData.fetched).getTime();
    var hrs = Math.floor(diff / 3600000);
    freshness = hrs < 1 ? 'Just now' : hrs + 'h ago';
  }

  var todaySubs = subs.filter(function(s) {
    return new Date(s.date).toDateString() === new Date().toDateString();
  }).length;

  var grid = document.getElementById('dash-kpi-grid');
  if (!grid) return;
  grid.innerHTML = [
    kpiCard('📬', 'Total Subscribers', subs.length, 'All time'),
    kpiCard('📈', 'Today', todaySubs, 'New subscribers'),
    kpiCard('📰', 'Articles', totalArticles, 'In news feed'),
    kpiCard('📡', 'Sources', totalSources, 'Active feeds'),
    kpiCard('🕐', 'Last Fetch', freshness || 'N/A', 'News freshness')
  ].join('');
}

function kpiCard(icon, label, value, sub) {
  return '<div style="background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:1.2rem;text-align:center">' +
    '<div style="font-size:1.8rem;margin-bottom:.3rem">' + icon + '</div>' +
    '<div style="font-size:1.6rem;font-weight:900;color:var(--navy)">' + value + '</div>' +
    '<div style="font-size:.82rem;font-weight:700;color:var(--navy);margin-bottom:.2rem">' + label + '</div>' +
    '<div style="font-size:.72rem;color:var(--gray)">' + sub + '</div>' +
  '</div>';
}

/* ── Subscribers List ── */
function dashRenderSubscribers() {
  var subs = dashGetSubscribers();
  var el = document.getElementById('dash-sub-list');
  if (!el) return;
  if (subs.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--gray)">No subscribers yet. Newsletter signups will appear here.</div>';
    return;
  }
  /* Sort newest first */
  subs.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  var html = '<table style="width:100%;border-collapse:collapse;font-size:.85rem">' +
    '<thead><tr style="text-align:left;border-bottom:2px solid var(--border)">' +
    '<th style="padding:.6rem;color:var(--navy)">Email</th>' +
    '<th style="padding:.6rem;color:var(--navy)">Date</th>' +
    '<th style="padding:.6rem;color:var(--navy)">Source Page</th>' +
    '</tr></thead><tbody>';
  subs.forEach(function(s) {
    var d = new Date(s.date);
    html += '<tr style="border-bottom:1px solid var(--border)">' +
      '<td style="padding:.5rem .6rem;color:var(--navy);font-weight:600">' + s.email + '</td>' +
      '<td style="padding:.5rem .6rem;color:var(--gray)">' + d.toLocaleDateString('en-CA') + ' ' + d.toLocaleTimeString('en-CA', {hour: '2-digit', minute: '2-digit'}) + '</td>' +
      '<td style="padding:.5rem .6rem;color:var(--gray)">' + (s.page || '') + '</td>' +
    '</tr>';
  });
  html += '</tbody></table>';
  el.innerHTML = html;
}

/* ── Export CSV ── */
function dashExportCSV() {
  var subs = dashGetSubscribers();
  if (subs.length === 0) { alert('No subscribers to export.'); return; }
  var csv = 'Email,Date,Source Page\n';
  subs.forEach(function(s) {
    csv += s.email + ',' + s.date + ',' + (s.page || '') + '\n';
  });
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = 'cleardoor-subscribers-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Sources Chart ── */
function dashRenderSources() {
  var el = document.getElementById('dash-source-chart');
  if (!el) return;
  var newsData = null;
  try { newsData = JSON.parse(localStorage.getItem('cd_news_cache')); } catch (e) {}
  if (!newsData || !newsData.items) {
    el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--gray)">No news data loaded yet. Visit the News tab first.</div>';
    return;
  }
  /* Count per source */
  var counts = {};
  newsData.items.forEach(function(item) {
    var src = item._src || 'unknown';
    counts[src] = (counts[src] || 0) + 1;
  });
  /* Sort by count */
  var sorted = Object.keys(counts).sort(function(a, b) { return counts[b] - counts[a]; });
  var max = counts[sorted[0]] || 1;
  var colors = typeof NEWS_SRC_COLORS !== 'undefined' ? NEWS_SRC_COLORS : {};

  var html = sorted.map(function(src) {
    var pct = Math.round((counts[src] / max) * 100);
    var clr = colors[src] || '#1a3a6b';
    var label = src;
    if (newsData.sources) {
      var found = newsData.sources.find(function(s) { return s.id === src; });
      if (found) label = found.label;
    }
    return '<div style="margin-bottom:.8rem">' +
      '<div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:.3rem">' +
        '<span style="font-weight:700;color:var(--navy)">' + label + '</span>' +
        '<span style="color:var(--gray)">' + counts[src] + ' articles</span>' +
      '</div>' +
      '<div style="background:var(--light);border-radius:8px;height:22px;overflow:hidden">' +
        '<div style="width:' + pct + '%;height:100%;background:' + clr + ';border-radius:8px;transition:width .5s"></div>' +
      '</div>' +
    '</div>';
  }).join('');
  el.innerHTML = html;
}

/* ── Articles List ── */
function dashRenderArticles() {
  var el = document.getElementById('dash-article-list');
  if (!el) return;
  var newsData = null;
  try { newsData = JSON.parse(localStorage.getItem('cd_news_cache')); } catch (e) {}
  if (!newsData || !newsData.items) {
    el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--gray)">No news data loaded.</div>';
    return;
  }
  var items = newsData.items.slice(0, 30);
  var html = '<table style="width:100%;border-collapse:collapse;font-size:.82rem">' +
    '<thead><tr style="text-align:left;border-bottom:2px solid var(--border)">' +
    '<th style="padding:.5rem">Title</th>' +
    '<th style="padding:.5rem">Source</th>' +
    '<th style="padding:.5rem">Date</th>' +
    '</tr></thead><tbody>';
  items.forEach(function(item) {
    var d = new Date(item.pubDate);
    var dateStr = isNaN(d) ? '' : d.toLocaleDateString('en-CA');
    var srcLabel = item._src || '';
    if (newsData.sources) {
      var found = newsData.sources.find(function(s) { return s.id === item._src; });
      if (found) srcLabel = found.label;
    }
    if (item._publisher) srcLabel = item._publisher;
    html += '<tr style="border-bottom:1px solid var(--border)">' +
      '<td style="padding:.4rem .5rem;color:var(--navy);max-width:400px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' +
        '<a href="' + (item.link || '#') + '" target="_blank" style="color:var(--navy);text-decoration:none;font-weight:600">' + (item.title || '') + '</a>' +
      '</td>' +
      '<td style="padding:.4rem .5rem;color:var(--gray);white-space:nowrap">' + srcLabel + '</td>' +
      '<td style="padding:.4rem .5rem;color:var(--gray);white-space:nowrap">' + dateStr + '</td>' +
    '</tr>';
  });
  html += '</tbody></table>';
  el.innerHTML = html;
}
