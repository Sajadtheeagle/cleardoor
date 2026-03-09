#!/usr/bin/env node
/**
 * scripts/fetch-news.js
 * Pre-fetches default RSS sources and writes to data/news.json
 * Runs via GitHub Actions every 4 hours.
 * Zero external dependencies — uses Node.js built-in modules only.
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

/* Default sources — keep in sync with rss-admin.js RSS_DEFAULT_SOURCES */
const SOURCES = [
  { id: 'cbc',    label: 'CBC News',                url: 'https://rss.cbc.ca/lineup/topstories.xml' },
  { id: 'bd',     label: 'Better Dwelling',         url: 'https://betterdwelling.com/feed/' },
  { id: 'cmt',    label: 'Canadian Mortgage Trends', url: 'https://www.canadianmortgagetrends.com/feed/' },
  { id: 'cbcott', label: 'CBC Ottawa',              url: 'https://rss.cbc.ca/lineup/canada/ottawa.xml' }
];

const MAX_PER_SOURCE = 10;
const TIMEOUT_MS     = 20000;

/* HTTP helper with redirect support */
function get(url, hops) {
  if (hops === undefined) hops = 5;
  return new Promise(function(resolve, reject) {
    if (hops === 0) return reject(new Error('Too many redirects'));
    var lib = url.startsWith('https') ? https : http;
    var req = lib.get(url, {
      headers: { 'User-Agent': 'ClearDoor-NewsBot/1.0 (+https://cleardoor.ca)' }
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
    req.setTimeout(TIMEOUT_MS, function() { req.destroy(new Error('Timeout')); });
  });
}

/* Minimal RSS/Atom XML parser (no dependencies) */
function extractTag(xml, tag) {
  var re = new RegExp(
    '<(?:[a-zA-Z0-9_]+:)?' + tag + '[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</(?:[a-zA-Z0-9_]+:)?' + tag + '>',
    'i'
  );
  var m = xml.match(re);
  return m ? m[1].trim() : '';
}

function extractAttr(xml, tag, attr) {
  var re = new RegExp('<' + tag + '[^>]+' + attr + '=["\'"]([^"\'"]+ )["\'"]', 'i');
  var m = xml.match(re);
  return m ? m[1] : '';
}

function parseRSS(xml, srcId) {
  var items  = [];
  var blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/g) || [];

  for (var i = 0; i < blocks.length; i++) {
    var block       = blocks[i];
    var title       = extractTag(block, 'title');
    var link        = extractTag(block, 'link') || extractAttr(block, 'link', 'href') || extractTag(block, 'guid');
    var pubDate     = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated') || '';
    var description = extractTag(block, 'description') || extractTag(block, 'summary') || '';
    var content     = extractTag(block, 'encoded') || extractTag(block, 'content') || '';
    var thumbnail   = extractAttr(block, 'media:thumbnail', 'url') || extractAttr(block, 'media:content', 'url') || '';

    if (title) {
      items.push({ title: title, link: link, pubDate: pubDate, description: description, content: content, thumbnail: thumbnail, _src: srcId });
    }
  }
  return items;
}

/* Main */
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
    await new Promise(function(r) { setTimeout(r, 400); });
  }

  all.sort(function(a, b) { return new Date(b.pubDate || 0) - new Date(a.pubDate || 0); });

  var outDir  = path.join(process.cwd(), 'data');
  var outFile = path.join(outDir, 'news.json');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outFile, JSON.stringify({
    ts:      Date.now(),
    fetched: new Date().toISOString(),
    sources: SOURCES.map(function(s) { return { id: s.id, label: s.label }; }),
    items:   all
  }, null, 2));

  console.log('Saved ' + all.length + ' total items to data/news.json');
}

main().catch(function(err) { console.error(err); process.exit(1); });
