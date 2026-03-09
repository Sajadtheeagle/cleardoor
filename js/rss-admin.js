/*
 *  CLEARDOOR — RSS ADMIN  (js/rss-admin.js)
 *  Manages the list of RSS news sources stored in localStorage.
 *  The Live News tab in blog.js reads from this same key.
 */

var RSS_SOURCES_KEY = 'cd_rss_sources_v1';

/* Default sources — used if none saved yet */
var RSS_DEFAULT_SOURCES = [
  { id: 'cbc',  label: 'CBC',                    url: 'https://rss.cbc.ca/lineup/business.xml' },
  { id: 'bd',   label: 'Better Dwelling',         url: 'https://betterdwelling.com/feed/' },
  { id: 'cmt',  label: 'Canadian Mortgage Trends',url: 'https://www.canadianmortgagetrends.com/feed/' },
  { id: 'fp',   label: 'Financial Post',          url: 'https://feeds.feedburner.com/financialpost' }
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
  var list = document.getElementById('rss-sources-list');
  var badge = document.getElementById('rss-count-badge');
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
          '<div class="rss-source-url">' + escHtml(s.url) + '</div>',
        '</div>',
        '<div class="rss-source-actions">',
          '<button class="rss-test-btn" onclick="rssAdminTest(' + i + ')">Test</button>',
          '<button class="rss-delete-btn" onclick="rssAdminDelete(' + i + ')">Remove</button>',
        '</div>',
      '</div>'
    ].join('');
  }).join('');

  // Also sync to blog.js NEWS_SOURCES if it's loaded
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
  var msgEl  = document.getElementById('rss-add-msg');
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

  // Check for duplicate URL
  if (sources.some(function(s) { return s.url === url; })) {
    rssAdminMsg('This URL is already in your sources.', 'error'); return;
  }

  sources.push({ id: id, label: name, url: url });
  rssAdminSaveSources(sources);
  localStorage.removeItem('cd_news_v2'); // bust news cache

  nameEl.value = '';
  urlEl.value  = '';
  rssAdminMsg('✅ "' + escHtml(name) + '" added! Refresh the Live News tab to see it.', 'ok');
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
  var s = sources[index];
  if (!s) return;

  var row = document.getElementById('rss-row-' + index);
  var testBtn = row && row.querySelector('.rss-test-btn');
  if (testBtn) { testBtn.textContent = 'Testing…'; testBtn.disabled = true; }

  var proxy = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(s.url);
  fetch(proxy)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.status === 'ok' && d.items && d.items.length) {
        if (testBtn) { testBtn.textContent = '✅ OK (' + d.items.length + ' items)'; testBtn.disabled = false; }
      } else {
        if (testBtn) { testBtn.textContent = '⚠️ No items'; testBtn.disabled = false; }
      }
    })
    .catch(function() {
      if (testBtn) { testBtn.textContent = '❌ Failed'; testBtn.disabled = false; }
    });
}

function rssAdminClearCache() {
  localStorage.removeItem('cd_news_v2');
  rssAdminMsg('✅ Cache cleared — go to Live News to reload fresh articles.', 'ok');
}

function rssAdminMsg(text, type) {
  var el = document.getElementById('rss-add-msg');
  if (!el) return;
  el.textContent = text;
  el.className = 'rss-msg rss-msg--' + (type || 'ok');
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(function() { el.style.display = 'none'; }, 4000);
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* Called by main.js showPage('rss-admin') */
function rssAdminInit() {
  // Migrate old CBC URL to new direct feed URL
  var saved = rssAdminGetSources();
  var migrated = false;
  saved.forEach(function(s) {
    if (s.url === 'https://www.cbc.ca/cmlink/rss-canada-business') {
      s.url = 'https://rss.cbc.ca/lineup/business.xml'; migrated = true;
    }
    if (s.url === 'https://financialpost.com/category/real-estate/feed/') {
      s.url = 'https://feeds.feedburner.com/financialpost'; migrated = true;
    }
  });
  if (migrated) { rssAdminSaveSources(saved); localStorage.removeItem('cd_news_v2'); }
  // If no sources saved yet, seed with defaults
  if (!localStorage.getItem(RSS_SOURCES_KEY)) {
    rssAdminSaveSources(RSS_DEFAULT_SOURCES);
  }
  rssAdminRender();
}
