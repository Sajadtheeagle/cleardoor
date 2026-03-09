# ClearDoor — Components

Reusable HTML fragments. Currently a placeholder — as the site grows from single-page to multi-page, shared components will live here.

## Planned Components

| File | Contents |
|------|----------|
| `nav.html` | Top navigation (server-side include or JS injection) |
| `footer.html` | Site footer with links and legal |
| `property-card.html` | Reusable listing card template |
| `agent-card.html` | Agent profile card |
| `newsletter-cta.html` | Newsletter signup strip |
| `breadcrumb.html` | Breadcrumb navigation |
| `seo-head.html` | Common `<head>` meta tags template |

## Usage (future)

When migrating to server-side rendering or a static site generator, components will be included via:
- **SSI (Apache/Nginx):** `<!--#include file="components/nav.html"-->`
- **Node/Express:** `res.render('page', { component: 'nav' })`
- **Eleventy/Astro:** native include syntax
