# ClearDoor — Pages

Standalone HTML pages for content that warrants its own URL (better SEO, shareable links, ad landing pages).

## Planned Pages

| Folder | Purpose | Priority |
|--------|---------|----------|
| `agents/` | Licensed realtor profiles & search | High |
| `neighbourhoods/` | Per-neighbourhood guides (Kanata, Barrhaven, Centretown, etc.) | High |
| `tools/` | Standalone affordability & down-payment calculators | Medium |
| `blog/` | Individual blog article pages for SEO (`/blog/ottawa-market-spring-2026`) | Medium |
| `events/` | First-time buyer events & webinars | Low |

## SEO Strategy

Each standalone page should have:
- Unique `<title>` and `<meta description>`
- Open Graph tags (`og:title`, `og:image`, `og:description`)
- `<link rel="canonical">` pointing to itself
- Structured data (`application/ld+json`) — `RealEstateAgent`, `LocalBusiness`, or `Article` schema
- Internal links back to main tools/calculators
