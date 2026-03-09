# ClearDoor — CSS

One file per feature. Load order in index.html `<head>`:

| File | Contents | Lines |
|------|----------|-------|
| `base.css` | CSS variables, reset, nav, layout, hero, shared components, responsive | ~180 |
| `new-construction.css` | New Construction Hub — toolbar, map panel, cards, compare bar | ~55 |
| `modals.css` | Compare modal, Project detail modal | ~35 |
| `ottawa-map.css` | Leaflet map container, legend, layer toggle, zone popups | ~30 |
| `blog.css` | Blog/Insights page — hero, filters, cards, article detail, sidebar | ~175 |

## Adding a new CSS file

1. Create `css/feature-name.css`
2. Add `<link rel="stylesheet" href="css/feature-name.css">` in `index.html` after `blog.css`
3. Use a unique CSS class prefix for all selectors (e.g. `.agent-*`, `.hood-*`)

## CSS Variable Reference (from base.css)

```css
--navy:#0f2342    /* Primary dark */
--blue:#1a56a0    /* Medium blue */
--sky:#3b9eff     /* Accent blue */
--teal:#0db4a8    /* Accent teal */
--light:#f4f8ff   /* Background light */
--gray:#64748b    /* Body text */
--border:#e2eaf5  /* Border color */
--gold:#f59e0b    /* Warning/highlight */
--green:#10b981   /* Success */
--purple:#7c3aed  /* Mortgage category */
--rose:#e11d48    /* Danger/red */
--nav-h:62px      /* Nav height */
```
