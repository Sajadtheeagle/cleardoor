#!/usr/bin/env node
/**
 * scripts/backfill-archive.js
 * One-time script: fetches Canadian real estate news month-by-month
 * from Jan 2020 to present via Google News RSS date-range queries.
 *
 * Output: data/news-archive.json  (append-safe, deduped)
 *
 * Usage:
 *   node scripts/backfill-archive.js                # full backfill 2020-01 to now
 *   node scripts/backfill-archive.js 2023-06        # start from June 2023
 *   node scripts/backfill-archive.js 2023-06 2024-01 # specific range
 *
 * Zero external dependencies.
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

/* ── Topic queries ─────────────────────────────────────────────────── */
const TOPICS = [
  { id: 'gnre',     label: 'Canada Real Estate',     q: 'canada+real+estate+market' },
  { id: 'gnmort',   label: 'Mortgage & Housing',      q: 'canada+mortgage+housing+CMHC' },
  { id: 'gnhprice', label: 'Home Prices',             q: 'canada+home+prices+condo+detached' },
  { id: 'gnott',    label: 'Ottawa Real Estate',      q: 'ottawa+real+estate+housing' },
  { id: 'gnottdev', label: 'Ottawa Development',      q: 'ottawa+development+construction+zoning' },
  { id: 'gnottlrt', label: 'Ottawa Transit & Infra',  q: 'ottawa+LRT+transit+infrastructure' },
  { id: 'gnboc',    label: 'Bank of Canada Rates',    q: '%22bank+of+canada%22+interest+rate' },
  { id: 'gnpolicy', label: 'Housing Policy',          q: 'canada+housing+policy+regulation+affordable' },
  { id: 'gnimmig',  label: 'Immigration & Housing',   q: 'canada+immigration+housing+demand' },
  { id: 'gnontre',  label: 'Ontario Real Estate',     q: 'ontario+real+estate+housing+market' },
  { id: 'gnnewcon', label: 'New Construction',        q: 'canada+new+construction+housing+starts' }
];

const TIMEOUT_MS = 20000;
const DELAY_MS   = 500;  /* be polite to Google */

/* ── Helpers ───────────────────────────────────────────────────────── */
function get(url, hops) {
  if (hops === undefined) hops = 5;
  return new Promise(function(resolve, reject) {
    if (hops === 0) return reject(new Error('Too many redirects'));
    var lib = url.startsWith('https') ? https : http;
    var req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClearDoor-Bot/2.0; +https://cleardoor.ca)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
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
    req.setTimeout(TIMEOUT_MS, function() { req.destroy(new Error('Timeout')); });
  });
}

function extractTag(xml, tag) {
  var re = new RegExp('<(?:[a-zA-Z0-9_]+:)?' + tag + '[^>]*>([\\s\\S]*?)</(?:[a-zA-Z0-9_]+:)?' + tag + '>', 'i');
  var m = xml.match(re);
  if (!m) return '';
  return m[1].replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
}

function extractAttr(xml, tag, attr) {
  var re = new RegExp('<' + tag + '[^>]+' + attr + '=["\']([^"\']+)["\']', 'i');
  var m = xml.match(re);
  return m ? m[1] : '';
}

function parseRSS(xml, srcId) {
  var items = [];
  var blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    var title = extractTag(block, 'title');
    var link  = extractTag(block, 'link') || extractAttr(block, 'link', 'href') || extractTag(block, 'guid');
    var pubDate     = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated') || '';
    var description = extractTag(block, 'description') || extractTag(block, 'summary') || '';
    var thumbnail   = extractAttr(block, 'media:thumbnail', 'url') || extractAttr(block, 'media:content', 'url') || '';
    if (title) {
      items.push({
        title: title,
        link: link,
        pubDate: pubDate,
        description: description,
        thumbnail: thumbnail,
        _src: srcId
      });
    }
  }
  return items;
}

function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

/* Generate month ranges: [{after:'2020-01-01', before:'2020-02-01', label:'2020-01'}, ...] */
function monthRanges(startStr, endStr) {
  var ranges = [];
  var cur = new Date(startStr + '-01T00:00:00Z');
  var end = new Date(endStr + '-01T00:00:00Z');
  while (cur <= end) {
    var y = cur.getUTCFullYear();
    var m = cur.getUTCMonth();
    var after = y + '-' + String(m + 1).padStart(2, '0') + '-01';
    var next = new Date(Date.UTC(y, m + 1, 1));
    var before = next.getUTCFullYear() + '-' + String(next.getUTCMonth() + 1).padStart(2, '0') + '-01';
    var label = y + '-' + String(m + 1).padStart(2, '0');
    ranges.push({ after: after, before: before, label: label });
    cur = next;
  }
  return ranges;
}

function dedupKey(title) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/* ── Main ──────────────────────────────────────────────────────────── */
async function main() {
  var args = process.argv.slice(2);
  var now = new Date();
  var startMonth = args[0] || '2020-01';
  var endMonth   = args[1] || (now.getUTCFullYear() + '-' + String(now.getUTCMonth() + 1).padStart(2, '0'));

  var outDir  = path.join(process.cwd(), 'data');
  var outFile = path.join(outDir, 'news-archive.json');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  /* Load existing archive to append */
  var archive = { items: [], sources: [] };
  if (fs.existsSync(outFile)) {
    try {
      archive = JSON.parse(fs.readFileSync(outFile, 'utf8'));
      console.log('Loaded existing archive: ' + archive.items.length + ' items');
    } catch (e) {
      console.log('Could not parse existing archive, starting fresh');
      archive = { items: [], sources: [] };
    }
  }

  /* Build seen-set from existing items */
  var seen = {};
  archive.items.forEach(function(item) { seen[dedupKey(item.title)] = true; });

  var ranges = monthRanges(startMonth, endMonth);
  var newCount = 0;
  var errCount = 0;

  console.log('Backfilling ' + startMonth + ' to ' + endMonth + ' (' + ranges.length + ' months x ' + TOPICS.length + ' topics)');
  console.log('Total fetches: ~' + (ranges.length * TOPICS.length) + '\n');

  for (var ri = 0; ri < ranges.length; ri++) {
    var range = ranges[ri];
    process.stdout.write('\n=== ' + range.label + ' ===\n');

    for (var ti = 0; ti < TOPICS.length; ti++) {
      var topic = TOPICS[ti];
      var url = 'https://news.google.com/rss/search?q=' + topic.q +
        '+after:' + range.after + '+before:' + range.before +
        '&hl=en-CA&gl=CA&ceid=CA:en';

      process.stdout.write('  ' + topic.label + '... ');
      try {
        var xml = await get(url);
        var items = parseRSS(xml, topic.id);
        var added = 0;
        for (var ii = 0; ii < items.length; ii++) {
          var key = dedupKey(items[ii].title);
          if (!seen[key]) {
            seen[key] = true;
            items[ii]._month = range.label;  /* tag with month for archive browsing */
            archive.items.push(items[ii]);
            added++;
          }
        }
        newCount += added;
        console.log(items.length + ' fetched, ' + added + ' new');
      } catch (e) {
        console.log('ERROR: ' + e.message);
        errCount++;
      }

      await sleep(DELAY_MS);
    }

    /* Save after every month (resume-safe) */
    archive.items.sort(function(a, b) {
      return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
    });
    archive.ts = Date.now();
    archive.fetched = new Date().toISOString();
    archive.sources = TOPICS.map(function(t) { return { id: t.id, label: t.label }; });
    archive.totalItems = archive.items.length;
    archive.dateRange = { from: startMonth, to: endMonth };
    fs.writeFileSync(outFile, JSON.stringify(archive, null, 2));
    process.stdout.write('  [saved: ' + archive.items.length + ' total]\n');
  }

  console.log('\n========================================');
  console.log('Done! ' + newCount + ' new items added (' + errCount + ' errors)');
  console.log('Total archive: ' + archive.items.length + ' items');
  console.log('Saved to: ' + outFile);
}

main().catch(function(err) { console.error(err); process.exit(1); });
