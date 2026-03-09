# ClearDoor — Contributing Guide

## Adding a New Page

1. Add HTML in `index.html`:
```html
<!-- ════ NEW PAGE NAME ════ -->
<div id="page-newpage" class="page">
  <!-- your content -->
</div>
```

2. Add a nav button:
```html
<button class="nl" onclick="showPage('newpage')">🔧 New Page</button>
```

3. Add CSS in `css/newpage.css` (use `.np-*` prefix)

4. Add JS in `js/newpage.js`

5. Register in `js/main.js`:
```javascript
if(id==='newpage'){ newPageInit(); }
```

6. Add both files to `index.html` load order.

## Adding Blog Articles

Open `js/blog.js` and add a new entry to the `BLOG_ARTICLES` array:

```javascript
{
  id:'b12', cat:'market', badge:'new', emoji:'📊', bg:'bcbg-market',
  title:'Your Article Title',
  excerpt:'One-paragraph summary shown on the card.',
  readMin:5, date:'2026-03-15', author:'ClearDoor Research', featured:false,
  body:[
    'Opening paragraph text...',
    '<h2>Section Heading</h2>',
    'More paragraph text...',
    '<div class="callout tip">💡 <strong>Tip:</strong> Something useful.</div>',
  ]
}
```

**Categories:** `market` | `mortgage` | `policy` | `guide` | `ottawa` | `canada`  
**Badges:** `new` | `trending` | `guide` | `update` | `` (empty = no badge)  
**Backgrounds:** `bcbg-market` | `bcbg-mortgage` | `bcbg-policy` | `bcbg-guide` | `bcbg-ottawa` | `bcbg-canada`

## Code Style

- **CSS:** Flat selectors, feature-namespaced, minified-friendly (no nesting)
- **JS:** ES5-compatible `var`/`function` style for blog.js; ES6 template literals ok elsewhere
- **HTML:** Semantic where possible, accessibility attributes on interactive elements

## Commit Message Format

```
feat: add neighbourhood profiles page
fix: correct mortgage calc for 30-year amortization
content: add 3 new blog articles (March 2026)
style: improve mobile nav drawer animation
```
