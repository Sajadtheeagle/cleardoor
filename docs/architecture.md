# ClearDoor — Architecture

## Overview

ClearDoor is a **single-page application (SPA)** built with vanilla HTML, CSS, and JavaScript — no framework, no build step. All pages live inside one `index.html`, shown/hidden via CSS classes using the `showPage()` function in `js/main.js`.

## Page Architecture

```
┌─────────────────────────────────────────────────────┐
│  index.html                                         │
│  ┌──────────────────────────────────────────────┐  │
│  │  <nav> — fixed topnav + mobile drawer        │  │
│  ├──────────────────────────────────────────────┤  │
│  │  .page#page-home         (Home)              │  │
│  │  .page#page-listings     (Listings)          │  │
│  │  .page#page-mortgage     (Calculators)       │  │
│  │  .page#page-glossary     (Glossary)          │  │
│  │  .page#page-blog         (Blog/Insights)     │  │
│  │  .page#page-newconstruction (New Build)      │  │
│  │  .page#page-about        (About)             │  │
│  │  .page#page-ottawaplan   (Ottawa Map)        │  │
│  └──────────────────────────────────────────────┘  │
│  <div#cmodal>   Compare Modal                       │
│  <div#pmodal>   Project Detail Modal                │
└─────────────────────────────────────────────────────┘
```

## JS Module Architecture

```
main.js (orchestrator — loads last)
  ├── showPage(id)        ← all page switching
  ├── openDrawer/close    ← mobile navigation
  └── init()             ← calls all render functions

Feature modules (load before main.js):
  new-construction.js  → renderNC(), openProject(), openCompare()
  glossary.js          → renderGlossary()
  listings.js          → renderListings()
  calculators.js       → calcMortgageMain(), calcSave(), calcRvB()
  blog.js              → blogInit(), blogRenderList(), blogOpen()
  ottawa-map.js        → initOPMap() [needs Leaflet CDN first]
```

## CSS Architecture

All CSS uses a **flat, utility-leaning** approach with feature namespacing:
- Global utilities: `.btn-*`, `.card`, `.g2/.g3/.g4`, `.tag-*`
- Feature namespacing: `.blog-*`, `.nc-*`, `.ins-*`
- No CSS framework — custom variables in `:root`

## Deployment

GitHub Pages via custom deploy script (`deploy-cleardoor.command`) that uses the GitHub Tree API to batch-push all files in a single commit.

## Scaling Path

1. **Phase 1 (current):** Static SPA — all data hardcoded in JS arrays
2. **Phase 2:** Add JSON data files in `/data/`, fetch via `fetch()` with localStorage caching
3. **Phase 3:** Standalone pages in `/pages/` for SEO (neighbourhood guides, agent profiles)
4. **Phase 4:** Backend API in `/api/` — listings feed, newsletter, auth
5. **Phase 5:** Migrate to SSR (Next.js/Astro) for full SEO + dynamic content
