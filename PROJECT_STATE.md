# Project State Notes

## Current Status (Sep 16 2026)
- Star rating system: working on both Comercio and Servicos pages
- Mural da Comunidade: new page at /mural, linked in Header nav
- Admin Dashboard: has "Mural" and "Avaliações" tabs for managing posts/reviews
- All data is now pulled from real MySQL database (no hardcoded lists)
- Comercio and Mural were verified with TypeScript, production build, and existing tests
- Comercio map now refreshes one pin per visible commerce using stored lat/lng when filters/search change

## Key Fixes Made
1. Comercio.tsx: removed hardcoded commerceList, now uses trpc.commerce.listApproved
2. Comercio.tsx: added real average rating computation via ratingMap useMemo
3. Mural.tsx: removed hardcoded seedPosts, shows empty state when no posts
4. Mural.tsx: added pending approval notice after submission
5. Comercio.tsx: replaced one-time marker setup with dynamic Google Maps markers from real commerce coordinates

## DB State
- Depends on configured MySQL database; UI handles empty approved commerce/review/mural states

## Remaining TODO Items (from todo.md - all marked [x] now)
All items from the star ratings + mural feature are complete.

## Next Step
Start the dev server and visually inspect Comercio/Mural with the configured database and Google Maps key when available.
