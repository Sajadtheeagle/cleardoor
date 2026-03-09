# ClearDoor — API

Backend API placeholder. ClearDoor is currently a 100% client-side static site. This folder is reserved for future backend integration.

## Planned Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/listings` | GET | Fetch active Ottawa listings |
| `/api/mortgage-rates` | GET | Current lender rate matrix |
| `/api/subscribe` | POST | Newsletter signup (currently uses alert() placeholder) |
| `/api/contact` | POST | Realtor/agent lead form |
| `/api/market-stats` | GET | Latest OREB market stats |
| `/api/neighbourhoods/{id}` | GET | Neighbourhood data |

## Tech Stack (future)

- **Runtime:** Node.js with Express or Fastify
- **Database:** PostgreSQL (listings, users) + Redis (caching)
- **Auth:** JWT for user accounts
- **Hosting:** Vercel/Railway/Fly.io (low cost, Canadian-region)

## Current Workarounds

| Feature | Current Approach | Future |
|---------|-----------------|--------|
| Newsletter | `alert()` placeholder | `/api/subscribe` → Mailchimp/ConvertKit |
| Listings | Hardcoded array in `js/listings.js` | MLS API feed |
| Market stats | Hardcoded in `js/data.js` | `/api/market-stats` → CMHC/OREB data |
