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
  {
    id: 'cbcott',
    label: 'CBC Ottawa',
    url: 'https://www.cbc.ca/webfeed/rss/rss-canada-ottawa'
  },
  {
    id: 'cbcnews',
    label: 'CBC News',
    url: 'https://rss.cbc.ca/lineup/topstories.xml'
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
  },
  /* -- Direct feeds: additional industry sources ------------------- */
  {
    id: 'boc',
    label: 'Bank of Canada',
    url: 'https://www.bankofcanada.ca/category/press-releases/feed/'
  },
  {
    id: 'bnn',
    label: 'BNN Bloomberg',
    url: 'https://www.bnnbloomberg.ca/arc/outboundfeeds/rss/'
  },
  {
    id: 'mpamag',
    label: 'MPA Magazine',
    url: 'https://www.mpamag.com/ca/rss'
  },
  {
    id: 'timescolonist',
    label: 'Times Colonist',
    url: 'https://www.timescolonist.com/rss/real-estate'
  },
  {
    id: 'nsnews',
    label: 'North Shore News',
    url: 'https://www.nsnews.com/rss/real-estate'
  }
];

const MAX_PER_SOURCE    = 10;
const TIMEOUT_MS        = 30000;
const ENRICH_TIMEOUT_MS = 8000;   /* shorter timeout for enrichment fetches */

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
function get(url, hops, ms) {
  if (hops === undefined) hops = 5;
  if (ms   === undefined) ms   = TIMEOUT_MS;
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
        return resolve(get(loc, hops - 1, ms));
      }
      var data = '';
      res.setEncoding('utf8');
      res.on('data', function(c) { data += c; });
      res.on('end', function() { resolve(data); });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(ms, function() {
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

/* --- Extract embedded <img> from HTML description (e.g. CBC) ------- */
function extractDescImg(desc) {
  var m = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  return (m && m[1] && m[1].indexOf('http') === 0) ? m[1] : '';
}

/* --- Extract real publisher URL from a Google News page ------------ */
/* Google News embeds the real article URL in data-n-au attributes.   */
function extractRealUrl(html) {
  var m = html.match(/data-n-au=["']([^"']+)["']/i);
  if (m && m[1] && m[1].indexOf('http') === 0 && m[1].indexOf('news.google.com') === -1) return m[1];
  /* Fallback: og:url if it is not a Google domain */
  var ogU = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i);
  if (ogU && ogU[1] && ogU[1].indexOf('google.com') === -1) return ogU[1];
  return '';
}

/* --- Extract main article body HTML from a full page (server-side) - */
/* Returns clean HTML with only <p>, <h2-4>, <ul>, <ol>, <blockquote> */
function extractArticleBody(html) {
  /* Strip noise that confuses the selector search */
  var clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  /* Locate start of article content using priority selectors */
  var startPatterns = [
    /itemprop=["']articleBody["'][^>]*>/i,
    /class=["'][^"']*\b(?:entry-content|post-content|article-body|article__body|b-article-body|story-body|post__content|article__text|article-text|td-post-content|article__content|content-body|article__description|wrapper--detail__body)\b[^"']*["'][^>]*>/i,
    /<article[^>]*>/i,
    /role=["']main["'][^>]*>/i
  ];
  var startPos = -1;
  for (var s = 0; s < startPatterns.length; s++) {
    var sm = clean.match(startPatterns[s]);
    if (sm) { startPos = sm.index + sm[0].length; break; }
  }
  if (startPos === -1) return '';

  /* Limit to 60 KB and cut before comments / related-posts sections */
  var area = clean.substring(startPos, startPos + 60000);
  var cutPatterns = [
    /id=["'](?:comments|respond)[^"']*["']/i,
    /class=["'][^"']*\b(?:comments-area|post-comments|jp-relatedposts|sharedaddy|entry-footer|article-footer|author-bio|newsletter-signup)\b/i,
    /<footer[^>]*>/i
  ];
  var cut = area.length;
  for (var c = 0; c < cutPatterns.length; c++) {
    var cm = area.match(cutPatterns[c]);
    if (cm && cm.index > 0 && cm.index < cut) cut = cm.index;
  }
  area = area.substring(0, cut);

  /* Collect block elements in document order */
  var out = [];
  var blockRe = /<(h[2-4]|p|ul|ol|blockquote)([^>]*)>([\s\S]*?)<\/\1>/gi;
  var bm;
  while ((bm = blockRe.exec(area)) !== null) {
    var tag = bm[1], attrs = bm[2], inner = bm[3];
    /* Skip ad / social / share containers */
    if (/\b(?:sharedaddy|addtoany|ad-|social-|share-|promo-|related-|newsletter)\b/i.test(attrs)) continue;
    var txt = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (txt.length < 20 && tag === 'p') continue;   /* skip tiny/empty paragraphs */
    /* Keep only safe inline and list tags in inner HTML */
    var safe = inner
      .replace(/<(?!\/?(?:a|strong|em|b|i|li|ul|ol|br)\b)[^>]+>/gi, '')
      .replace(/\son\w+=["'][^"']*["']/gi, '')
      .replace(/\s+/g, ' ').trim();
    out.push('<' + tag + '>' + safe + '</' + tag + '>');
  }
  return out.join('\n');
}

/* --- Extract CBC article body from window.__INITIAL_STATE__ JSON --- */
/* CBC pages are JS-rendered; article data lives in a JSON blob.       */
function extractCbcState(html) {
  var stateM = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]+?);\s*<\/script>/);
  if (!stateM) return { body: '', image: '', description: '' };
  var raw = stateM[1].replace(/\bundefined\b/g, 'null').replace(/:NaN\b/g, ':null');
  var state;
  try { state = JSON.parse(raw); } catch(e) { return { body: '', image: '', description: '' }; }

  /* Lead image */
  var imgUrl = '';
  var lead = ((state.detail || {}).leadImage) || {};
  if (lead.url) imgUrl = lead.url.replace(/\?.*$/, '');

  /* Body paragraphs */
  var detail = ((state.detail || {}).content) || {};
  var bodyEls = detail.body || [];
  var out = [];
  for (var e = 0; e < bodyEls.length; e++) {
    var el = bodyEls[e];
    var tag = (el.tag || 'p').toLowerCase();
    if (!/^(p|h[2-4]|ul|ol|blockquote|li)$/.test(tag)) continue;
    var parts = [];
    var children = el.content || [];
    for (var c = 0; c < children.length; c++) {
      var ch = children[c];
      if (!ch || typeof ch !== 'object') continue;
      var ct = ch.type || '';
      if (ct === 'text') {
        parts.push(String(ch.content || ''));
      } else if (ct === 'a' || ct === 'link') {
        var inner = ch.content || ch.text || '';
        if (Array.isArray(inner)) inner = inner.map(function(x){return (x.content||'');}).join('');
        var href = ((ch.attribs || {}).href) || '';
        parts.push(href ? '<a href="' + href + '">' + inner + '</a>' : String(inner));
      } else if (/^(strong|em|b|i)$/.test(ct)) {
        var inn = ch.content || '';
        if (Array.isArray(inn)) inn = inn.map(function(x){return (x.content||'');}).join('');
        parts.push('<' + ct + '>' + inn + '</' + ct + '>');
      }
      /* skip embeds, images, videos, ads, related */
    }
    var text = parts.join('').trim();
    if (text.length > 10) out.push('<' + tag + '>' + text + '</' + tag + '>');
  }
  var bodyHtml = out.join('\n');
  return {
    body:        bodyHtml.replace(/<[^>]+>/g,'').trim().length > 200 ? bodyHtml : '',
    image:       imgUrl,
    description: detail.description || detail.deck || ''
  };
}

/* --- Fetch og:image, og:description AND article body from a URL ---- */
function fetchPageMeta(url) {
  var isCbc = url.indexOf('cbc.ca') !== -1;
  return new Promise(function(resolve) {
    get(url, 5, ENRICH_TIMEOUT_MS).then(function(html) {
      /* CBC: parse __INITIAL_STATE__ JSON blob */
      if (isCbc) {
        var r = extractCbcState(html);
        if (!r.image)       r.image       = '';
        if (!r.description) r.description = '';
        var ogI = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (ogI && !r.image) r.image = ogI[1];
        return resolve(r);
      }
      var ogImg = '', ogDesc = '';
      var imgM = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                 html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (imgM) ogImg = imgM[1];
      var descM = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i) ||
                  html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
      if (descM) ogDesc = descM[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      var body = extractArticleBody(html);
      resolve({ image: ogImg, description: ogDesc, body: body });
    }).catch(function() { resolve({ image: '', description: '', body: '' }); });
  });
}

/* --- Fetch a Google News article page: og:meta + real publisher URL - */
function fetchGnPage(url) {
  return new Promise(function(resolve) {
    get(url, 5, ENRICH_TIMEOUT_MS).then(function(html) {
      var ogImg = '', ogDesc = '';
      var imgM = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                 html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (imgM) ogImg = imgM[1];
      var descM = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
      if (descM) ogDesc = descM[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      var realLink = extractRealUrl(html);
      resolve({ image: ogImg, description: ogDesc, realLink: realLink });
    }).catch(function() { resolve({ image: '', description: '', realLink: '' }); });
  });
}

/* --- Enrich items with real article metadata ----------------------- */
async function enrichItems(items) {

  /* ── Phase 1: extract embedded images from HTML descriptions (CBC) ── */
  items.forEach(function(it) {
    if (!it.thumbnail) {
      var embedded = extractDescImg(it.description || '');
      if (embedded) it.thumbnail = embedded;
    }
  });

  /* ── Phase 2: fetch full article page for direct-feed items.
     Enrich if missing thumbnail OR RSS text is under 800 chars
     (i.e. feed didn't give us full content). ── */
  var toEnrich = items.filter(function(it) {
    if (it._src.indexOf('gn') === 0) return false;
    var plain = (it.content || it.description || '').replace(/<[^>]+>/g, '').trim();
    return (!it.thumbnail || plain.length < 800) && it.link;
  });

  if (toEnrich.length > 0) {
    console.log('Enriching ' + toEnrich.length + ' direct-feed items (thumb + body)...');
    var BATCH = 5;
    for (var i = 0; i < toEnrich.length; i += BATCH) {
      var batch = toEnrich.slice(i, i + BATCH);
      var results = await Promise.all(batch.map(function(it) {
        return fetchPageMeta(it.link);
      }));
      for (var j = 0; j < batch.length; j++) {
        var r = results[j];
        if (r.image && !batch[j].thumbnail) batch[j].thumbnail = r.image;
        if (r.description) {
          batch[j]._ogDesc = r.description;
          var plain = (batch[j].description || '').replace(/<[^>]+>/g, '').trim();
          if (plain === batch[j].title || plain.length < 100) batch[j].description = r.description;
        }
        /* Store full article body if we extracted meaningful content */
        if (r.body && r.body.replace(/<[^>]+>/g, '').trim().length > 200) batch[j].body = r.body;
      }
      if (i + BATCH < toEnrich.length) await new Promise(function(r) { setTimeout(r, 200); });
    }
    console.log('Direct-feed enrichment done.');
  }

  /* ── Phase 3a: fetch every Google News article page to discover the
     real publisher URL (via data-n-au) plus og:image / og:description. ── */
  var gnItems = items.filter(function(it) { return it._src.indexOf('gn') === 0 && it.link; });

  if (gnItems.length > 0) {
    console.log('Fetching ' + gnItems.length + ' Google News pages for real publisher links...');
    var GN_BATCH = 4;
    for (var k = 0; k < gnItems.length; k += GN_BATCH) {
      var gnBatch = gnItems.slice(k, k + GN_BATCH);
      var gnResults = await Promise.all(gnBatch.map(function(it) {
        return fetchGnPage(it.link);
      }));
      for (var l = 0; l < gnBatch.length; l++) {
        var gr = gnResults[l];
        if (gr.image && !gnBatch[l].thumbnail) gnBatch[l].thumbnail = gr.image;
        if (gr.description && gr.description !== gnBatch[l].title) {
          gnBatch[l]._ogDesc = gr.description;
          gnBatch[l].description = gr.description;
        }
        if (gr.realLink) gnBatch[l].realLink = gr.realLink;
      }
      if (k + GN_BATCH < gnItems.length) await new Promise(function(r) { setTimeout(r, 300); });
    }
    console.log('Google News page fetch done.');
  }

  /* ── Phase 3b: for GN items where we found a real publisher URL,
     fetch that page to get the full article body + a better thumbnail. ── */
  var gnWithLinks = items.filter(function(it) {
    return it._src.indexOf('gn') === 0 && it.realLink && !it.body;
  });

  if (gnWithLinks.length > 0) {
    console.log('Fetching ' + gnWithLinks.length + ' real publisher pages for GN article content...');
    var RL_BATCH = 4;
    for (var p = 0; p < gnWithLinks.length; p += RL_BATCH) {
      var rlBatch = gnWithLinks.slice(p, p + RL_BATCH);
      var rlResults = await Promise.all(rlBatch.map(function(it) {
        return fetchPageMeta(it.realLink);
      }));
      for (var q = 0; q < rlBatch.length; q++) {
        var rr = rlResults[q];
        if (rr.image && !rlBatch[q].thumbnail) rlBatch[q].thumbnail = rr.image;
        if (rr.body && rr.body.replace(/<[^>]+>/g, '').trim().length > 200) rlBatch[q].body = rr.body;
      }
      if (p + RL_BATCH < gnWithLinks.length) await new Promise(function(r) { setTimeout(r, 300); });
    }
    console.log('Google News real-article fetch done.');
  }
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
  await enrichItems(all);

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
