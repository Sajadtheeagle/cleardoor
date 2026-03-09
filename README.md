# ClearDoor — Canada's First-Time Buyer Platform

**Live site:** https://cleardoor.ca  
**Repo:** https://github.com/Sajadtheeagle/cleardoor  
**Deployed via:** GitHub Pages

## Folder Structure

```
cleardoor/
├── index.html                 # Main app (single-page)
├── css/                       # All stylesheets — one file per feature
├── js/                        # All JavaScript — one file per feature
├── images/                    # Static images, organized by content type
│   ├── blog/                  # Article hero images
│   ├── listings/              # Property listing photos
│   ├── new-construction/      # Builder & project images
│   ├── neighbourhoods/        # Neighbourhood photography [future]
│   ├── agents/                # Agent headshots [future]
│   ├── events/                # Event photos [future]
│   ├── icons/                 # UI icons, favicons
│   ├── og/                    # Open Graph social sharing images
│   ├── team/                  # Team member photos
│   └── logo/                  # Logo variations
├── data/                      # JSON data files [future]
├── components/                # Reusable HTML fragments [future]
├── pages/                     # Standalone pages [future]
│   ├── agents/
│   ├── neighbourhoods/
│   ├── tools/
│   ├── blog/                  # Individual article pages (SEO)
│   └── events/
├── api/                       # Backend API [future]
└── docs/                      # Developer documentation
```

## Quick Deploy

```bash
./deploy-cleardoor.command
```

Requires: GitHub token set inside deploy-cleardoor.command.

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no framework — fast, lightweight)
- **Maps:** Leaflet.js + Leaflet.heat (Ottawa City Plans page)
- **Hosting:** GitHub Pages (cleardoor.ca custom domain)
- **Deploy:** GitHub Tree API via deploy-cleardoor.command

## File Naming Convention

| Feature | CSS File | JS File |
|---------|----------|---------|
| Navigation, layout, hero | `css/base.css` | `js/main.js` |
| New construction hub | `css/new-construction.css` | `js/new-construction.js` |
| Listings page | — (in base) | `js/listings.js` |
| Glossary | — (in base) | `js/glossary.js` |
| Calculators | — (in base) | `js/calculators.js` |
| Modals | `css/modals.css` | (in new-construction.js) |
| Ottawa map | `css/ottawa-map.css` | `js/ottawa-map.js` |
| Blog/Insights | `css/blog.css` | `js/blog.js` |

## Adding New Features

1. Create `css/your-feature.css` and `js/your-feature.js`
2. Add `<link>` tag in `index.html` `<head>`
3. Add `<script src="js/your-feature.js">` before `</body>` in `index.html`
4. Add `showPage('yourpage')` trigger in `js/main.js`
5. Deploy with `./deploy-cleardoor.command`
