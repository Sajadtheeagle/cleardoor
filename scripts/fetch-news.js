#!/usr/bin/env node
/**
 * scripts/fetch-news.js
 * Pre-fetches RSS sources and writes to data/news.json
 * Runs via GitHub Actions every 4 hours.
 * Zero external dependencies â uses Node.js built-in modules only.
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

/* Sources â mixing direct feeds + Google News (reliable from any server).
   Keep IDs in sync with rss-admin.js RSS_DEFAULT_SOURCES. */
const SOURCES = [
  {
    id: 'cmt',
    label: 'Canadian Mortgage Trends',
    url: 'https://www.canadianmortgagetrends.com/feed/'
  },
  {
    id: 'gnre',
    label: 'Canada Real Estate News',
    url: 'https://news.google.com/rss/search?q=canada+real+estate&hl=en-CA&gl=CA&ceid=CA:en'
  },
  {
    id: 'gnmort',
    label: 'Canadian Mortgage & Housing',
    url: 'https://news.google.com/rss/search?q=canada+mortgage+housing&hl=en-CA&gl=CA&ceid=CA:en'
  },
  {
    id: 'gnott',
    label: 'Ottawa Real Estate',
    url: 'https://news.google.com/rss/search?q=ottawa+real+estate&hl=en-CA&gl=CA&ceid=CA:en'
  }
];

const MAX_PER_SOURCE = 10;
const TIMEOUT_MS     = 15000;

/* âââ HTTP helper with redirect support âââââââââââââââââââââââââââ */
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

/* âââ Minimal RSS/Atom XML parser ââââââââââââââââââââââââââââââââââ */
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

    if (title) {
      items.push({
        title: title,
        link: link,
        pubDate: pubDate,
        description: description,
        content: content,
        thumbnail: thumbnail,
        _src: srcId
      });
    }
  }
  return items;
}

/* âââ Main âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
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

  /* Sort newest-first */
  all.sort(function(a, b) {
    return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
  });

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
