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

/* ─── HTTP helper with redirect support ─────────────────────────── */
function get(url, hops = 5) {
  return new Promise((resolve, reject) => {
    if (hops === 0) return reject(new Error('Too many redirects'));
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: { 'User-Agent': 'ClearDoor-NewsBot/1.0 (+https://cleardoor.ca)' }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        res.resume();
        return resolve(get(loc, hops - 1));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(TIMEOUT_MS, () => req.destroy(new Error('Timeout')));
  });
}

/* ─── Minimal RSS/Atom XML parser (no dependencies) ─────────────── */
function extractTag(xml, tag) {
  // Matches <tag>, <ns:tag>, with optional CDATA
  const re = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</(?:[a-zA-Z0-9_]+:)?${tag}>`,
    'i'
  );
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

function extractAttr(xml, tag, attr) {
  const re = new RegExp(`<${tag}[^>]+${attr}=["']([^"']+)["']`, 'i');
  const m = xml.match(re);
  return m ? m[1] : '';
}

function parseRSS(xml, srcId) {
  const items   = [];
  // Support both <item> (RSS) and <entry> (Atom)
  const blocks  = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/g) || [];

  for (const block of blocks) {
    const title       = extractTag(block, 'title');
    const link        = extractTag(block, 'link') || extractAttr(block, 'link', 'href') || extractTag(block, 'guid');
    const pubDate     = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated') || '';
    const description = extractTag(block, 'description') || extractTag(block, 'summary') || '';
    const content     = extractTag(block, 'encoded') || extractTag(block, 'content') || '';
    const thumbnail   = extractAttr(block, 'media:thumbnail', 'url') ||
                        extractAttr(block, 'media:content',   'url') || '';

    if (title) {
      items.push({ title, link, pubDate, description, content, thumbnail, _src: srcId });
    }
  }
  return items;
}

/* ─── Main ───────────────────────────────────────────────────────── */
async function main() {
  const all = [];

  for (const src of SOURCES) {
    process.stdout.write(`Fetching ${src.label}... `);
    try {
      const xml   = await get(src.url);
      const items = parseRSS(xml, src.id).slice(0, MAX_PER_SOURCE);
      all.push(...items);
      console.log(`${items.length} items ✓`);
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
    // Be polite — don't hammer servers
    await new Promise(r => setTimeout(r, 400));
  }

  // Sort newest-first
  all.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));

  const outDir  = path.join(process.cwd(), 'data');
  const outFile = path.join(outDir, 'news.json');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outFile, JSON.stringify({
    ts:      Date.now(),
    fetched: new Date().toISOString(),
    sources: SOURCES.map(({ id, label }) => ({ id, label })),
    items:   all
  }, null, 2));

  console.log(`\n✅ Saved ${all.length} total items → data/news.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
