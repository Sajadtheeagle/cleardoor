# ClearDoor — Deployment Guide

## Quick Deploy

```bash
./deploy-cleardoor.command
```

Double-click the `.command` file in Finder, or run from terminal.

## How It Works

The deploy script uses the **GitHub Tree API** to push all files to the `main` branch in a single API call. This avoids rate limits that occur when uploading files one-by-one.

**Endpoint used:**
```
POST https://api.github.com/repos/Sajadtheeagle/cleardoor/git/trees
POST https://api.github.com/repos/Sajadtheeagle/cleardoor/git/commits
PATCH https://api.github.com/repos/Sajadtheeagle/cleardoor/git/refs/heads/main
```

## Files Deployed

The script deploys every file in the outputs folder:
- `index.html`
- `css/*.css` (base, new-construction, modals, ottawa-map, blog)
- `js/*.js` (main, new-construction, glossary, listings, calculators, blog, ottawa-map)
- `images/**` (all non-empty image files)
- `data/*.json` (when present)
- `docs/*.md`
- `README.md`, `.gitignore`

## After Deploy

GitHub Pages automatically rebuilds within ~1 minute of a push to `main`. Check https://cleardoor.ca to confirm.

## Troubleshooting

| Error | Fix |
|-------|-----|
| `401 Unauthorized` | Token expired — update `GH_TOKEN` in deploy script |
| `422 Unprocessable` | A file path contains special chars — rename the file |
| `Too many blobs` | Split into two deploys — the script handles batching automatically |
| Page not updating | Hard-refresh (Cmd+Shift+R) — GitHub Pages can have CDN cache delays |
