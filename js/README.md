# ClearDoor — JavaScript

One file per feature. **Load order matters** — see index.html for correct `<script>` tag sequence.

## File Map

| File | What it does | Depends on |
|------|-------------|------------|
| `new-construction.js` | NC project data array, renderNC, compare, modals | — |
| `glossary.js` | Glossary terms array, renderGlossary, search | — |
| `listings.js` | Listings data array, renderListings, filter | — |
| `calculators.js` | Mortgage calc, savings calc, rent-vs-buy calc, tab switcher | — |
| `blog.js` | BLOG_ARTICLES array, all blog render/open/filter logic | — |
| `ottawa-map.js` | Leaflet map init, zone overlays, LRT layers, investment rankings | Leaflet CDN (must load after) |
| `main.js` | showPage, nav drawer, dropdown hover fix, FAQ toggle, **init** | ALL others (must load last) |
| `data.js` | (legacy stub — data now lives in feature files) | — |

## Load order in index.html

```html
<script src="js/new-construction.js"></script>
<script src="js/glossary.js"></script>
<script src="js/listings.js"></script>
<script src="js/calculators.js"></script>
<script src="js/blog.js"></script>
<!-- Leaflet CDN must come before ottawa-map.js -->
<script src="...leaflet.min.js (CDN)..."></script>
<script src="...leaflet-heat.js (CDN)..."></script>
<script src="js/ottawa-map.js"></script>
<!-- main.js LAST — it runs init() which calls functions from all other files -->
<script src="js/main.js"></script>
```

## Adding a new JS module

1. Create `js/feature.js` with a unique function/variable namespace
2. Add `<script src="js/feature.js"></script>` in `index.html` before `main.js`
3. Add any init calls to the init line in `main.js`
4. Add the `showPage` trigger for your page in `main.js`
