#!/usr/bin/env python3
"""
enrich_news.py — Enriches data/news.json in-place.

• Fetches missing RSS feeds (Better Dwelling, CBC Ottawa, CBC News)
  and appends their items.
• For direct-feed items (CMT, CBC, Storeys, Better Dwelling):
    - Fetches the article page
    - Extracts og:image + article body <p>/<h2-4>/<ul>/<ol>
• Google News items: cannot get real article URL (JS-only redirect),
  but we mark them with _gnOnly=true so the reader shows a cleaner UI.

Run: python3 scripts/enrich_news.py
"""

import json, re, ssl, time
from urllib.request  import Request, urlopen
from urllib.error    import URLError, HTTPError
from urllib.parse    import urljoin

DATA_FILE      = 'data/news.json'
TIMEOUT        = 10
BATCH_DELAY    = 0.3
BATCH_SIZE     = 5
MIN_BODY_CHARS = 200
MAX_PER_SOURCE = 10

HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/120.0.0.0 Safari/537.36'
    ),
    'Accept':          'text/html,application/xhtml+xml,*/*',
    'Accept-Language': 'en-CA,en;q=0.9',
}

# SSL context — bypass cert verification (needed on macOS without cert bundle)
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode    = ssl.CERT_NONE

# ─── Missing RSS sources to add ──────────────────────────────────────────────
MISSING_SOURCES = [
    {'id': 'betterdwelling', 'label': 'Better Dwelling',
     'url': 'https://betterdwelling.com/feed/'},
    {'id': 'cbcott',  'label': 'CBC Ottawa',
     'url': 'https://www.cbc.ca/webfeed/rss/rss-canada-ottawa'},
    {'id': 'cbcnews', 'label': 'CBC News',
     'url': 'https://rss.cbc.ca/lineup/topstories.xml'},
    {'id': 'boc',    'label': 'Bank of Canada',
     'url': 'https://www.bankofcanada.ca/category/press-releases/feed/'},
    {'id': 'bnn',    'label': 'BNN Bloomberg',
     'url': 'https://www.bnnbloomberg.ca/arc/outboundfeeds/rss/'},
    {'id': 'mpamag', 'label': 'MPA Magazine',
     'url': 'https://www.mpamag.com/ca/rss'},
    {'id': 'timescolonist', 'label': 'Times Colonist',
     'url': 'https://www.timescolonist.com/rss/real-estate'},
    {'id': 'nsnews', 'label': 'North Shore News',
     'url': 'https://www.nsnews.com/rss/real-estate'},
]

# ─── HTTP helper ─────────────────────────────────────────────────────────────

def fetch(url):
    """Return page text, or '' on error."""
    if not url:
        return ''
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=TIMEOUT, context=SSL_CTX) as r:
            charset = r.headers.get_content_charset() or 'utf-8'
            return r.read().decode(charset, errors='replace')
    except Exception as e:
        return ''

# ─── RSS parser (mirrors fetch-news.js logic) ─────────────────────────────────

def extract_tag(xml, tag):
    m = re.search(
        r'<(?:[a-zA-Z0-9_]+:)?' + tag + r'[^>]*>([\s\S]*?)</(?:[a-zA-Z0-9_]+:)?' + tag + r'>',
        xml, re.I
    )
    if not m:
        return ''
    v = m.group(1)
    v = re.sub(r'^<!\[CDATA\[', '', v)
    v = re.sub(r'\]\]>$', '', v)
    return v.strip()

def extract_attr(xml, tag, attr):
    m = re.search(r'<' + tag + r'[^>]+' + attr + r'=["\']([^"\']+)["\']', xml, re.I)
    return m.group(1) if m else ''

def parse_rss(xml, src_id, src_label):
    items = []
    blocks = re.findall(r'<item[\s>][\s\S]*?</item>|<entry[\s>][\s\S]*?</entry>', xml, re.I)
    for block in blocks[:MAX_PER_SOURCE]:
        title       = extract_tag(block, 'title')
        link        = extract_tag(block, 'link') or extract_attr(block, 'link', 'href') or extract_tag(block, 'guid')
        pub_date    = extract_tag(block, 'pubDate') or extract_tag(block, 'published') or extract_tag(block, 'updated')
        description = extract_tag(block, 'description') or extract_tag(block, 'summary')
        content     = extract_tag(block, 'encoded') or extract_tag(block, 'content')
        thumbnail   = extract_attr(block, 'media:thumbnail', 'url') or extract_attr(block, 'media:content', 'url')
        if title:
            items.append({
                'title': title, 'link': link, 'pubDate': pub_date,
                'description': description, 'content': content,
                'thumbnail': thumbnail, '_src': src_id,
            })
    return items

# ─── Article extraction helpers ───────────────────────────────────────────────

def extract_og_image(html):
    m = (re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I) or
         re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html, re.I))
    return m.group(1) if m else ''

def extract_og_desc(html):
    m = (re.search(r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I) or
         re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:description["\']', html, re.I) or
         re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I) or
         re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']description["\']', html, re.I))
    if not m:
        return ''
    return (m.group(1)
            .replace('&amp;','&').replace('&lt;','<')
            .replace('&gt;','>').replace('&quot;','"'))

def extract_article_body(html):
    """Extract main article body — returns clean HTML or ''."""
    clean = re.sub(r'<script[\s\S]*?</script>', '', html, flags=re.I)
    clean = re.sub(r'<style[\s\S]*?</style>',   '', clean, flags=re.I)
    clean = re.sub(r'<iframe[\s\S]*?</iframe>',  '', clean, flags=re.I)
    clean = re.sub(r'<!--[\s\S]*?-->',           '', clean)

    start_patterns = [
        r'itemprop=["\']articleBody["\'][^>]*>',
        (r'class=["\'][^"\']*\b(?:entry-content|post-content|article-body|article__body|'
         r'b-article-body|story-body|post__content|article__text|article-text|td-post-content|'
         r'article__content|content-body|article__description|wrapper--detail__body)\b[^"\']*["\'][^>]*>'),
        r'<article[^>]*>',
        r'role=["\']main["\'][^>]*>',
    ]
    start_pos = -1
    for pat in start_patterns:
        m = re.search(pat, clean, re.I)
        if m:
            start_pos = m.end()
            break
    if start_pos == -1:
        return ''

    area = clean[start_pos: start_pos + 60000]
    cut_patterns = [
        r'id=["\'](?:comments|respond)[^"\']*["\']',
        (r'class=["\'][^"\']*\b(?:comments-area|post-comments|jp-relatedposts|'
         r'sharedaddy|entry-footer|article-footer|author-bio|newsletter-signup)\b'),
        r'<footer[^>]*>',
    ]
    cut = len(area)
    for pat in cut_patterns:
        m = re.search(pat, area, re.I)
        if m and 0 < m.start() < cut:
            cut = m.start()
    area = area[:cut]

    out = []
    for m in re.finditer(r'<(h[2-4]|p|ul|ol|blockquote)([^>]*?)>([\s\S]*?)</\1>', area, re.I):
        tag, attrs, inner = m.group(1), m.group(2), m.group(3)
        if re.search(r'\b(?:sharedaddy|addtoany|ad-|social-|share-|promo-|related-|newsletter)\b', attrs, re.I):
            continue
        txt = re.sub(r'<[^>]+>', '', inner).strip()
        if len(txt) < 20 and tag.lower() == 'p':
            continue
        safe = re.sub(r'<(?!\/?(?:a|strong|em|b|i|li|ul|ol|br)\b)[^>]+>', '', inner, flags=re.I)
        safe = re.sub(r'\son\w+=["\'][^"\']*["\']', '', safe)
        safe = re.sub(r'\s+', ' ', safe).strip()
        out.append(f'<{tag}>{safe}</{tag}>')

    return '\n'.join(out)

def plain_text(html):
    return re.sub(r'<[^>]+>', '', html or '').strip()

def extract_cbc_state(html):
    """
    CBC pages are JS-rendered. Their article data lives in a window.__INITIAL_STATE__
    JSON blob. Returns dict with 'body' (HTML) and 'image' (URL), or empty strings.
    """
    m = re.search(r'window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]+?);\s*</script>', html)
    if not m:
        return {'body': '', 'image': '', 'description': ''}
    try:
        raw = m.group(1).replace('undefined', 'null').replace(':NaN', ':null')
        state = json.loads(raw)
    except Exception:
        return {'body': '', 'image': '', 'description': ''}

    # Lead image
    img_url = ''
    lead = state.get('detail', {}).get('leadImage', {}) or {}
    if lead.get('url'):
        img_url = lead['url'].split('?')[0]   # strip resize params

    # Body paragraphs
    detail = state.get('detail', {}).get('content', {}) or {}
    body_els = detail.get('body', []) or []

    def el_to_html(el):
        """Convert a CBC body element to an HTML string."""
        tag = el.get('tag', 'p').lower()
        if tag not in ('p', 'h2', 'h3', 'h4', 'ul', 'ol', 'blockquote', 'li'):
            return ''
        parts = []
        for child in (el.get('content') or []):
            if not isinstance(child, dict):
                continue
            ctype = child.get('type', '')
            if ctype == 'text':
                parts.append(str(child.get('content', '')))
            elif ctype in ('a', 'link'):
                inner = child.get('content', child.get('text', ''))
                href  = (child.get('attribs') or {}).get('href', '')
                if isinstance(inner, list):
                    inner = ''.join(c.get('content','') for c in inner if isinstance(c,dict))
                parts.append(f'<a href="{href}">{inner}</a>' if href else str(inner))
            elif ctype in ('strong', 'em', 'b', 'i'):
                inner = child.get('content', '')
                if isinstance(inner, list):
                    inner = ''.join(c.get('content','') for c in inner if isinstance(c,dict))
                parts.append(f'<{ctype}>{inner}</{ctype}>')
            elif ctype in ('polopoly_similar', 'related', 'embed', 'image', 'video',
                           'quiz', 'poll', 'newsletter', 'ad'):
                pass  # skip non-text blocks
            else:
                # Generic: try to get .content as text
                inner = child.get('content', '')
                if isinstance(inner, str) and inner.strip():
                    parts.append(inner)
        text = ''.join(parts).strip()
        if not text or len(text) < 10:
            return ''
        return f'<{tag}>{text}</{tag}>'

    out = [h for h in (el_to_html(el) for el in body_els) if h]
    body_html = '\n'.join(out)
    desc = detail.get('description', '') or detail.get('deck', '') or ''

    return {
        'body':        body_html if len(plain_text(body_html)) > MIN_BODY_CHARS else '',
        'image':       img_url,
        'description': desc,
    }

def fetch_page_meta(url, src_id=''):
    html = fetch(url)
    if not html:
        return {'image': '', 'description': '', 'body': ''}

    # CBC uses JS rendering — parse __INITIAL_STATE__ instead of DOM
    if src_id in ('cbcott', 'cbcnews') or 'cbc.ca' in url:
        r = extract_cbc_state(html)
        # Fill image/desc from og: tags if the state didn't provide them
        if not r['image']:
            r['image'] = extract_og_image(html)
        if not r['description']:
            r['description'] = extract_og_desc(html)
        return r

    body = extract_article_body(html)
    return {
        'image':       extract_og_image(html),
        'description': extract_og_desc(html),
        'body':        body if len(plain_text(body)) > MIN_BODY_CHARS else '',
    }

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f'Reading {DATA_FILE}...')
    with open(DATA_FILE, encoding='utf-8') as f:
        data = json.load(f)
    items = data['items']
    existing_srcs = set(i['_src'] for i in items)
    print(f'{len(items)} items loaded. Sources present: {sorted(existing_srcs)}\n')

    changed = 0

    # ── Fetch missing RSS feeds (Better Dwelling, CBC Ottawa, CBC News) ────────
    for src in MISSING_SOURCES:
        if src['id'] in existing_srcs:
            print(f'  {src["label"]}: already in news.json, skipping.')
            continue
        print(f'Fetching RSS: {src["label"]}... ', end='', flush=True)
        xml = fetch(src['url'])
        if not xml:
            print('FAILED (could not fetch feed)')
            continue
        new_items = parse_rss(xml, src['id'], src['label'])
        if not new_items:
            print('FAILED (no items parsed)')
            continue
        # Phase 1 for new items: extract embedded images (CBC style)
        for it in new_items:
            if not it.get('thumbnail'):
                m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', it.get('description',''), re.I)
                if m and m.group(1).startswith('http'):
                    it['thumbnail'] = m.group(1)
        items.extend(new_items)
        changed += len(new_items)
        print(f'OK — added {len(new_items)} items')

    # Re-sort newest first after adding items
    def parse_date(it):
        import email.utils
        try:
            return email.utils.parsedate_to_datetime(it.get('pubDate','')).timestamp()
        except Exception:
            return 0
    items.sort(key=parse_date, reverse=True)

    # ── Phase 1: extract embedded <img> from HTML descriptions (CBC style) ────
    for it in items:
        if not it.get('thumbnail'):
            m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', it.get('description',''), re.I)
            if m and m.group(1).startswith('http'):
                it['thumbnail'] = m.group(1)
                changed += 1

    # Clear CBC thumbnails set from RSS <img> tags (tiny/broken) so we can
    # replace them with the proper lead image from __INITIAL_STATE__
    for it in items:
        if it['_src'] in ('cbcott', 'cbcnews') and not it.get('body'):
            it.pop('thumbnail', None)  # will be re-fetched with proper image

    # ── Phase 2: direct-feed items — fetch article page for body + thumbnail ──
    to_enrich = [
        it for it in items
        if not it['_src'].startswith('gn')
        and it.get('link')
        and (
            not it.get('thumbnail')
            or len(plain_text((it.get('content') or '') + (it.get('description') or ''))) < 800
        )
        and not it.get('body')
    ]
    print(f'\nPhase 2: enriching {len(to_enrich)} direct-feed items (thumbnail + body)...')
    for idx in range(0, len(to_enrich), BATCH_SIZE):
        batch = to_enrich[idx: idx + BATCH_SIZE]
        print(f'  [{idx+1}-{min(idx+BATCH_SIZE, len(to_enrich))} of {len(to_enrich)}] ', end='', flush=True)
        for it in batch:
            src_id = it['_src']
            print(f'{src_id}..', end='', flush=True)
            r = fetch_page_meta(it['link'], src_id)
            if r['image'] and not it.get('thumbnail'):
                it['thumbnail'] = r['image'];   changed += 1
            if r['description']:
                it['_ogDesc'] = r['description']
                if len(plain_text(it.get('description',''))) < 100:
                    it['description'] = r['description'];  changed += 1
            if r['body']:
                it['body'] = r['body'];  changed += 1
        print()
        if idx + BATCH_SIZE < len(to_enrich):
            time.sleep(BATCH_DELAY)
    print('Phase 2 done.')

    # ── Summary ───────────────────────────────────────────────────────────────
    print()
    print('─' * 55)
    print(f'Total items:          {len(items)}')
    print(f'Items with thumbnail: {sum(1 for i in items if i.get("thumbnail"))}')
    print(f'Items with body:      {sum(1 for i in items if i.get("body"))}')
    print(f'Total changes:        {changed}')
    print('─' * 55)

    from collections import Counter
    by_src = Counter(i['_src'] for i in items)
    for src_id, cnt in sorted(by_src.items()):
        thumb = sum(1 for i in items if i['_src']==src_id and i.get('thumbnail'))
        body  = sum(1 for i in items if i['_src']==src_id and i.get('body'))
        print(f'  {src_id:20} {cnt:3} items | thumb:{thumb:3} body:{body:3}')
    print()

    if changed == 0:
        print('No changes needed — news.json is already fully enriched.')
        return

    # Update items list in data dict
    data['items'] = items

    print(f'Writing enriched data back to {DATA_FILE}...')
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Done! ✓')
    print()
    print('Clear the browser cache and reload:')
    print("  In browser console → localStorage.removeItem('cd_news_v2') → refresh")

if __name__ == '__main__':
    main()
