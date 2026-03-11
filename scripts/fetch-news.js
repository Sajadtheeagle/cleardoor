#!/usr/bin/env node
/**
 * scripts/fetch-news.js
 * Pre-fetches RSS sources and writes to data/news.json
 * Runs via GitHub Actions every 4 hours.
 * Zero external dependencies -- uses Node.js built-in modules only.
 *
 * Sources cover:
 *   - Canadian real estate market news
 *   - Mortgage & housing (CMHC, rates)
 *   - Ottawa local real estate & development
 *   - Ottawa transit & infrastructure
 *   - Bank of Canada interest rate decisions
 *   - Housing policy & regulation
 *   - Immigration impact on housing
 *   - Ontario-wide real estate
 *   - New construction & development
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

/* Sources -- direct feeds + Google News RSS (reliable from GitHub Actions).
   Keep IDs in sync with rss-admin.js RSS_DEFAULT_SOURCES. */
const SOURCES = [
  /* -- Direct feeds ------------------------------------------------- */
  {
    id: 'cmt',
    label: 'Canadian Mortgage Trends',
    url: 'https://www.canadianmortgagetrends.com/feed/'
  },
  {
    id: 'betterdwelling',
    label: 'Better Dwelling',
    url: 'https://betterdwelling.com/feed/'
  },
  {
    id: 'storeys',
    label: 'Storeys',
    url: 'https://storeys.com/feed/'
  },
  /* -- Google News: Real Estate & Housing --------------------------- */
  {
    id: 'gnre',
    label: 'Canada Real Estate',
    url: 'https://news.google.com/rss/search?q=canada+real+estate+market&hl=en-CA&gl=CA&ceid=CA:en'
  },
  {
    id: 'gnmort',
    label: 'Mortgage & Housing',
    url: 'https://news.google.com/rss/search?q=canada+mortgage+housing+CMHC&hl=en-CA&gl=CA&ceid=CA:en'
  },
  {
    id: 'gnhprice',
    label: 'Home Prices',
    url: 'https://news.google.com/rss/search?q=canada+home+prices+condo+detached&hl=en-CA&gl=CA&ceid=CA:en'
  },
  /* -- Google News: Ottawa Local ------------------------------------ */
  {
    id: 'gnott',
    label: 'Ottawa Real Estate',
    url: 'https://news.google.com/rss/search?q=ottawa+real+estate+housing&hl=en-CA&gl=CA&ceid=CA:en'
  },
  {
    id: 'gnottdev',
    label: 'Ottawa Development',
    url: 'https://news.google.com/rss/search?q=ottawa+development+construction+zoning&hl=en-CA&gl=CA&ceid=CA:en'
  },
  {
    id: 'gnottlrt',
    label: 'Ottawa Transit & Infra',
    url: 'https://news.google.com/rss/search?q=ottawa+LRT+transit+infrastructure&hl=en-CA&gl=CA&ceid=CA:en'
  },
  /* -- Google News: Policy & Rates (impact on RE) ------------------- */
  {
    id: 'gnboc',
    label: 'Bank of Canada Rates',
    url: 'https://news.google.com/rss/search?q=%22bank+of+canada%22+interest+rate&hl=en-CA&gl=CA&ceid=CA:en'
  },
  {
    id: 'gnpolicy',
    label: 'Housing Policy',
    url: 'https://news.google.com/rss/search?q=canada+housing+policy+regulation+affordable&hl=en-CA&gl=CA&ceid=CA:en'
  },
  {
    id: 'gnimmig',
    label: 'Immigration & Housing',
    url: 'https://news.google.com/rss/search?q=canada+immigration+housing+demand&hl=en-CA&gl=CA&ceid=CA:en'
  },
  /* -- Google News: Ontario-wide ------------------------------------ */
  {
    id: 'gnontre',
    label: 'Ontario Real Estate',
    url: 'https://news.google.com/rss/search?q=ontario+real+estate+housing+market&hl=en-CA&gl=CA&ceid=CA:en'
  },
  /* -- Google News: New Construction & Development ------------------ */
  {
    id: 'gnnewcon',
    label: 'New Construction',
    url: 'https://news.google.com/rss/search?q=canada+new+construction+housing+starts+condo+launch&hl=en-CA&gl=CA&ceid=CA:en'
  }
];

const MAX_PER_SOURCE = 10;
const TIMEOUT_MS     = 15000;

/* --- Dedup helper: removes articles with identical titles ---------- */
function dedup(items) {
  var seen = {};
  return items.filter(function(item) {
    /* Normalize: lowercase, strip non-alphanumeric */
    var key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

/* --- HTTP helper with redirect support ----------------------------- */
function get(url, hops) {
  if (hops === undefined) hops = 5;
  return new Promise(function(resolve, reject) {
    if (hops === 0) return reject(new Error('Too many redirects'));
    var lib = url.startsWith('https') ? https : http;
    var req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClearDoor-Bot/2.0; +https://cleardoor.ca)',
        'Accept':     'application/rss+xml, application/xml, text/xml, */*'
      }
    }, function(res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        var loc = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        res.resume();
        return resolve(get(loc, hops - 1));
      }
      var data = '';
      res.setEncoding('utf8');
      res.on('data', function(c) { data += c; });
      res.on('end', function() { resolve(data); });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(TIMEOUT_MS, function() {
      req.destroy(new Error('Timeout'));
    });
  });
}

/* --- Minimal RSS/Atom XML parser ----------------------------------- */
function extractTag(xml, tag) {
  var re = new RegExp(
    '<(?:[a-zA-Z0-9_]+:)?' + tag + '[^>]*>([\\s\\S]*?)</(?:[a-zA-Z0-9_]+:)?' + tag + '>',
    'i'
  );
  var m = xml.match(re);
  if (!m) return '';
  return m[1]
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .trim();
}

function extractAttr(xml, tag, attr) {
  var re = new RegExp('<' + tag + '[^>]+' + attr + '=["\']([^"\']+)["\']', 'i');
  var m = xml.match(re);
  return m ? m[1] : '';
}

function parseRSS(xml, srcId) {
  var items  = [];
  var isGoogleNews = srcId.indexOf('gn') === 0;
  var blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) || [];

  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    var title = extractTag(block, 'title');
    var link  = extractTag(block, 'link') ||
                extractAttr(block, 'link', 'href') ||
                extractTag(block, 'guid');
    var pubDate     = extractTag(block, 'pubDate') ||
                      extractTag(block, 'published') ||
                      extractTag(block, 'updated') || '';
    var description = extractTag(block, 'description') ||
                      extractTag(block, 'summary') || '';
    var content     = extractTag(block, 'encoded') ||
                      extractTag(block, 'content') || '';
    var thumbnail   = extractAttr(block, 'media:thumbnail', 'url') ||
                      extractAttr(block, 'media:content', 'url') || '';

    /* Google News: extract <source> tag for real publisher info,
       fix redirect URL, and clean description */
    var sourceName = '';
    var sourceUrl  = '';
    if (isGoogleNews) {
      sourceName = extractTag(block, 'source');
      sourceUrl  = extractAttr(block, 'source', 'url');
      /* Fix link: /rss/articles/ returns XML in browser;
         /articles/ renders properly via Google News JS redirect */
      link = link.replace('/rss/articles/', '/articles/');
      /* Clean description: strip the useless <a> wrapper, keep plain text */
      description = title;
      /* Clean title: Google News appends " - Source Name" */
      if (sourceName && title.indexOf(' - ' + sourceName) > 0) {
        title = title.substring(0, title.lastIndexOf(' - ' + sourceName)).trim();
      } else {
        /* Try generic " - Source" at end */
        var dashIdx = title.lastIndexOf(' - ');
        if (dashIdx > title.length * 0.4) title = title.substring(0, dashIdx).trim();
      }
    }

    if (title) {
      var item = {
        title: title,
        link: link,
        pubDate: pubDate,
        description: description,
        content: content,
        thumbnail: thumbnail,
        _src: srcId
      };
      if (sourceName) item._publisher = sourceName;
      if (sourceUrl)  item._pubUrl = sourceUrl;
      items.push(item);
    }
  }
  return items;
}

/* --- Fetch og:image and og:description from a page URL ------------- */
function fetchPageMeta(url) {
  return new Promise(function(resolve) {
    get(url).then(function(html) {
      var ogImg = '';
      var ogDesc = '';
      /* og:image */
      var imgM = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                 html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (imgM) ogImg = imgM[1];
      /* og:description or meta description */
      var descM = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i) ||
                  html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
      if (descM) ogDesc = descM[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      resolve({ image: ogImg, description: ogDesc });
    }).catch(function() { resolve({ image: '', description: '' }); });
  });
}

/* --- Enrich Google News items with real article metadata ------------ */
async function enrichGoogleNewsItems(items) {
  var gnItems = items.filter(function(it) { return it._pubUrl; });
  if (gnItems.length === 0) return;
  console.log('Enriching ' + gnItems.length + ' Google News items with article metadata...');
  var BATCH = 5;
  for (var i = 0; i < gnItems.length; i += BATCH) {
    var batch = gnItems.slice(i, i + BATCH);
    var results = await Promise.all(batch.map(function(it) {
      /* Fetch the publisher homepage to at least get a favicon/logo,
         or try the Google News /articles/ URL for the og:image */
      return fetchPageMeta(it.link);
    }));
    for (var j = 0; j < batch.length; j++) {
      if (results[j].image && !batch[j].thumbnail) batch[j].thumbnail = results[j].image;
      if (results[j].description && batch[j].description === batch[j].title) {
        batch[j].description = results[j].description;
      }
    }
    if (i + BATCH < gnItems.length) {
      await new Promise(function(r) { setTimeout(r, 200); });
    }
  }
  console.log('Enrichment done.');
}

/* --- Main ---------------------------------------------------------- */
async function main() {
  var all = [];

  for (var i = 0; i < SOURCES.length; i++) {
    var src = SOURCES[i];
    process.stdout.write('Fetching ' + src.label + '... ');
    try {
      var xml   = await get(src.url);
      var items = parseRSS(xml, src.id).slice(0, MAX_PER_SOURCE);
      all = all.concat(items);
      console.log(items.length + ' items ok');
    } catch (e) {
      console.log('ERROR: ' + e.message);
    }
    /* Be polite */
    if (i < SOURCES.length - 1) {
      await new Promise(function(r) { setTimeout(r, 300); });
    }
  }

  /* Try to enrich Google News items with og:image from their Google News page */
  await enrichGoogleNewsItems(all);

  /* Sort newest-first then dedup (same headline from multiple sources) */
  all.sort(function(a, b) {
    return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
  });
  all = dedup(all);

  var outDir  = path.join(process.cwd(), 'data');
  var outFile = path.join(outDir, 'news.json');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outFile, JSON.stringify({
    ts:      Date.now(),
    fetched: new Date().toISOString(),
    sources: SOURCES.map(function(s) { return { id: s.id, label: s.label }; }),
    items:   all
  }, null, 2));

  console.log('\nSaved ' + all.length + ' total items -> data/news.json');
}

main().catch(function(err) { console.error(err); process.exit(1); });
