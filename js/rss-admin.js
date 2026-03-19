/*
 *  CLEARDOOR — RSS ADMIN  (js/rss-admin.js)
 *  Manages the list of RSS news sources stored in localStorage.
 *  The Live News tab in blog.js reads from this same key.
 *  Protected by a simple username/password login gate.
 *
 *  Default credentials:  admin / cleardoor2026
 *  (Change them inside the dashboard after first login)
 */

/* ═══════════════════════════════════════════════════════════
   AUTH
   ═══════════════════════════════════════════════════════════ */
var ADMIN_CREDS_KEY   = 'cd_admin_creds';
var ADMIN_SESSION_KEY = 'cd_admin_session';

function rssAdminGetCreds() {
  try {
    var c = JSON.parse(localStorage.getItem(ADMIN_CREDS_KEY));
    if (c && c.user && c.pass) return c;
  } catch(e) {}
  return { user: 'admin', pass: 'cleardoor2026' };
}

function rssAdminIsAuth() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
}

function rssAdminShowLoginGate() {
  var gate    = document.getElementById('rss-login-gate');
  var content = document.getElementById('rss-admin-content');
  if (gate)    gate.style.display    = 'flex';
  if (content) content.style.display = 'none';
  /* Pre-fill the username field for convenience */
  var u = document.getElementById('rss-login-user');
  if (u && !u.value) u.value = rssAdminGetCreds().user;
}

function rssAdminShowAdminContent() {
  var gate    = document.getElementById('rss-login-gate');
  var content = document.getElementById('rss-admin-content');
  if (gate)    gate.style.display    = 'none';
  if (content) content.style.display = '';
}

function rssAdminLogin() {
  var user  = (document.getElementById('rss-login-user').value || '').trim();
  var pass  = document.getElementById('rss-login-pass').value || '';
  var creds = rssAdminGetCreds();
  var errEl = document.getElementById('rss-login-err');

  if (user === creds.user && pass === creds.pass) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    if (errEl) errEl.style.display = 'none';
    rssAdminShowAdminContent();
    rssAdminMigrateAndRender();
  } else {
    if (errEl) {
      errEl.textContent    = '❌ Incorrect username or password.';
      errEl.style.display  = 'block';
    }
    /* Shake the card for visual feedback */
    var card = document.querySelector('.rss-login-card');
    if (card) {
      card.classList.add('rss-login-shake');
      setTimeout(function() { card.classList.remove('rss-login-shake'); }, 500);
    }
  }
}

function rssAdminLogout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  var p = document.getElementById('rss-login-pass');
  if (p) p.value = '';
  var e = document.getElementById('rss-login-err');
  if (e) e.style.display = 'none';
  rssAdminShowLoginGate();
}

function rssAdminChangePass() {
  var newUser = (document.getElementById('rss-chpw-user').value    || '').trim();
  var newPass = (document.getElementById('rss-chpw-pass').value    || '');
  var confirm = (document.getElementById('rss-chpw-confirm').value || '');

  if (!newUser || !newPass) {
    rssChpwMsg('❌ Username and password cannot be empty.', 'error'); return;
  }
  if (newPass !== confirm) {
    rssChpwMsg('❌ Passwords do not match.', 'error'); return;
  }

  localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ user: newUser, pass: newPass }));
  document.getElementById('rss-chpw-user').value    = '';
  document.getElementById('rss-chpw-pass').value    = '';
  document.getElementById('rss-chpw-confirm').value = '';
  rssChpwMsg('✅ Credentials saved! Use them next time you sign in.', 'ok');
}

function rssChpwMsg(text, type) {
  var el = document.getElementById('rss-chpw-msg');
  if (!el) return;
  el.textContent   = text;
  el.className     = 'rss-msg rss-msg--' + (type || 'ok');
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(function() { el.style.display = 'none'; }, 5000);
}

/* ═══════════════════════════════════════════════════════════
   RSS SOURCES
   ═══════════════════════════════════════════════════════════ */
var RSS_SOURCES_KEY = 'cd_rss_sources_v1';

/* Default sources — used if none saved yet.
   Keep IDs in sync with scripts/fetch-news.js SOURCES. */
var RSS_DEFAULT_SOURCES = [
  { id: 'cmt',           label: 'Canadian Mortgage Trends', url: 'https://www.canadianmortgagetrends.com/feed/' },
  { id: 'betterdwelling',label: 'Better Dwelling',          url: 'https://betterdwelling.com/feed/' },
  { id: 'storeys',       label: 'Storeys',                  url: 'https://storeys.com/feed/' },
  { id: 'cbc',           label: 'CBC News',                 url: 'https://rss.cbc.ca/lineup/topstories.xml' },
  { id: 'cbcott',        label: 'CBC Ottawa',               url: 'https://rss.cbc.ca/lineup/canada/ottawa.xml' },
  { id: 'boc',           label: 'Bank of Canada',           url: 'https://www.bankofcanada.ca/category/press-releases/feed/' },
  { id: 'bnn',           label: 'BNN Bloomberg',            url: 'https://www.bnnbloomberg.ca/arc/outboundfeeds/rss/' },
  { id: 'mpamag',        label: 'MPA Magazine',             url: 'https://www.mpamag.com/ca/rss' },
  { id: 'timescolonist', label: 'Times Colonist',           url: 'https://www.timescolonist.com/rss/real-estate' },
  { id: 'nsnews',        label: 'North Shore News',         url: 'https://www.nsnews.com/rss/real-estate' }
];

function rssAdminGetSources() {
  try {
    var saved = JSON.parse(localStorage.getItem(RSS_SOURCES_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch(e) {}
  return JSON.parse(JSON.stringify(RSS_DEFAULT_SOURCES)); // deep copy
}

function rssAdminSaveSources(sources) {
  localStorage.setItem(RSS_SOURCES_KEY, JSON.stringify(sources));
}

function rssAdminRender() {
  var sources = rssAdminGetSources();
  var list    = document.getElementById('rss-sources-list');
  var badge   = document.getElementById('rss-count-badge');
  if (!list) return;
  badge && (badge.textContent = sources.length);

  if (!sources.length) {
    list.innerHTML = '<div class="rss-empty">No sources yet. Add one above.</div>';
    return;
  }

  list.innerHTML = sources.map(function(s, i) {
    return [
      '<div class="rss-source-row" id="rss-row-' + i + '">',
        '<div class="rss-source-info">',
          '<div class="rss-source-name">' + escHtml(s.label) + '</div>',
          '<div class="rss-source-url">'  + escHtml(s.url)   + '</div>',
        '</div>',
        '<div class="rss-source-actions">',
          '<button class="rss-test-btn"   onclick="rssAdminTest('   + i + ')">Test</button>',
          '<button class="rss-delete-btn" onclick="rssAdminDelete(' + i + ')">Remove</button>',
        '</div>',
      '</div>'
    ].join('');
  }).join('');

  rssAdminSyncToBlog(sources);
}

function rssAdminSyncToBlog(sources) {
  if (typeof NEWS_SOURCES !== 'undefined') {
    NEWS_SOURCES.length = 0;
    sources.forEach(function(s) { NEWS_SOURCES.push(s); });
  }
}

function rssAdminAdd() {
  var nameEl = document.getElementById('rss-new-name');
  var urlEl  = document.getElementById('rss-new-url');
  var name   = (nameEl.value || '').trim();
  var url    = (urlEl.value  || '').trim();

  if (!name || !url) {
    rssAdminMsg('Please fill in both name and URL.', 'error'); return;
  }
  if (!url.startsWith('http')) {
    rssAdminMsg('URL must start with http:// or https://', 'error'); return;
  }

  var sources = rssAdminGetSources();
  var id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  if (sources.some(function(s) { return s.url === url; })) {
    rssAdminMsg('This URL is already in your sources.', 'error'); return;
  }

  sources.push({ id: id, label: name, url: url });
  rssAdminSaveSources(sources);
  localStorage.removeItem('cd_news_v2'); // bust news cache

  nameEl.value = '';
  urlEl.value  = '';
  rssAdminMsg('✅ "' + escHtml(name) + '" saved! Refresh the Live News tab to see it.', 'ok');
  rssAdminRender();
}

function rssAdminDelete(index) {
  var sources = rssAdminGetSources();
  var removed = sources.splice(index, 1);
  rssAdminSaveSources(sources);
  localStorage.removeItem('cd_news_v2');
  rssAdminMsg('Removed "' + escHtml((removed[0] || {}).label || '') + '"', 'ok');
  rssAdminRender();
}

function rssAdminTest(index) {
  var sources = rssAdminGetSources();
  var s       = sources[index];
  if (!s) return;

  var row     = document.getElementById('rss-row-' + index);
  var testBtn = row && row.querySelector('.rss-test-btn');
  if (testBtn) { testBtn.textContent = 'Testing…'; testBtn.disabled = true; }

  var proxy    = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(s.url);
  var timedOut = false;
  var timer    = setTimeout(function() {
    timedOut = true;
    if (testBtn) { testBtn.textContent = '⏱ Timeout'; testBtn.disabled = false; }
    rssAdminMsg('⚠️ "' + escHtml(s.label) + '" timed out — the feed may be slow or incompatible.', 'error');
  }, 12000);

  fetch(proxy)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (timedOut) return;
      clearTimeout(timer);
      if (d.status === 'ok' && d.items && d.items.length) {
        if (testBtn) { testBtn.textContent = '✅ OK (' + d.items.length + ' items)'; testBtn.disabled = false; }
        rssAdminMsg('✅ "' + escHtml(s.label) + '" works — ' + d.items.length + ' articles found.', 'ok');
      } else {
        var reason = d.message || d.status || 'unknown error';
        if (testBtn) { testBtn.textContent = '⚠️ ' + reason.substring(0, 20); testBtn.disabled = false; }
        rssAdminMsg('⚠️ "' + escHtml(s.label) + '" returned: ' + reason + '. This feed may not work with the proxy.', 'error');
      }
    })
    .catch(function() {
      if (timedOut) return;
      clearTimeout(timer);
      if (testBtn) { testBtn.textContent = '❌ Network error'; testBtn.disabled = false; }
      rssAdminMsg('❌ Could not reach "' + escHtml(s.label) + '". Check the URL and your connection.', 'error');
    });
}

function rssAdminClearCache() {
  localStorage.removeItem('cd_news_v2');
  rssAdminMsg('✅ Cache cleared — go to Live News to reload fresh articles.', 'ok');
}

function rssAdminMsg(text, type) {
  var el = document.getElementById('rss-add-msg');
  if (!el) return;
  el.textContent   = text;
  el.className     = 'rss-msg rss-msg--' + (type || 'ok');
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(function() { el.style.display = 'none'; }, 4000);
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════════════════════════
   INIT — called by main.js showPage('rss-admin')
   ═══════════════════════════════════════════════════════════ */
function rssAdminMigrateAndRender() {
  /* Replace old/broken source URLs with working alternatives */
  var oldUrls = {
    'https://www.cbc.ca/cmlink/rss-canada-business':        'https://rss.cbc.ca/lineup/topstories.xml',
    'https://rss.cbc.ca/lineup/business.xml':               'https://rss.cbc.ca/lineup/topstories.xml',
    'https://financialpost.com/category/real-estate/feed/': null,
    'https://feeds.feedburner.com/financialpost':           null
  };
  var saved    = rssAdminGetSources();
  var migrated = false;
  var filtered = [];

  saved.forEach(function(s) {
    if (s.url in oldUrls) {
      if (oldUrls[s.url]) { s.url = oldUrls[s.url]; filtered.push(s); }
      // null = remove this source
      migrated = true;
    } else {
      filtered.push(s);
    }
  });

  /* Ensure CBC Ottawa is always present */
  if (!filtered.some(function(s) { return s.id === 'cbcott'; })) {
    filtered.push({ id: 'cbcott', label: 'CBC Ottawa', url: 'https://rss.cbc.ca/lineup/canada/ottawa.xml' });
    migrated = true;
  }

  if (migrated) {
    rssAdminSaveSources(filtered);
    localStorage.removeItem('cd_news_v2');
  }

  /* Seed defaults if localStorage was completely empty */
  if (!localStorage.getItem(RSS_SOURCES_KEY)) {
    rssAdminSaveSources(RSS_DEFAULT_SOURCES);
  }

  rssAdminRender();
}

/* ═══════════════════════════════════════════════════════════
   ARCHIVE STATS
   ═══════════════════════════════════════════════════════════ */
function rssArchiveRefreshStats() {
  var el = document.getElementById('rss-archive-stats');
  if (!el) return;
  el.textContent = 'Loading...';
  fetch('/data/news-archive.json?v=' + Date.now())
    .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(data) {
      var items = data.items || [];
      if (!items.length) {
        el.innerHTML = '<span style="color:#9ca3af">Archive is empty. Run the backfill from GitHub Actions to populate it.</span>';
        return;
      }
      /* Count by source */
      var bySrc = {};
      var byYear = {};
      items.forEach(function(item) {
        bySrc[item._src] = (bySrc[item._src] || 0) + 1;
        var d = new Date(item.pubDate);
        if (!isNaN(d)) byYear[d.getFullYear()] = (byYear[d.getFullYear()] || 0) + 1;
      });
      var srcLabels = {};
      (data.sources || []).forEach(function(s) { srcLabels[s.id] = s.label; });

      var html = '<div class="rss-archive-total">' + items.length.toLocaleString() + ' articles</div>';
      html += '<div class="rss-archive-meta">Last updated: ' + (data.fetched ? new Date(data.fetched).toLocaleString() : 'unknown') + '</div>';

      /* Year breakdown */
      var years = Object.keys(byYear).sort();
      html += '<div class="rss-archive-breakdown"><strong>By Year:</strong> ';
      html += years.map(function(y) { return y + ': ' + byYear[y].toLocaleString(); }).join(' | ');
      html += '</div>';

      /* Source breakdown */
      var srcKeys = Object.keys(bySrc).sort(function(a, b) { return bySrc[b] - bySrc[a]; });
      html += '<div class="rss-archive-breakdown"><strong>By Source:</strong><br>';
      html += srcKeys.map(function(k) {
        return '<span class="rss-archive-src-chip">' + (srcLabels[k] || k) + ': ' + bySrc[k].toLocaleString() + '</span>';
      }).join(' ');
      html += '</div>';

      el.innerHTML = html;
    })
    .catch(function() {
      el.innerHTML = '<span style="color:#9ca3af">No archive found. Run the backfill from GitHub Actions first.</span>';
    });
}

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */
function rssAdminInit() {
  if (!rssAdminIsAuth()) {
    rssAdminShowLoginGate();
    return;
  }
  rssAdminShowAdminContent();
  rssAdminMigrateAndRender();
  rssArchiveRefreshStats();
}
