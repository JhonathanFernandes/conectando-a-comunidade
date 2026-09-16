# Project State Notes

## Current Status (Aug 21 2026)
- Star rating system: working on both Comercio and Servicos pages
- Mural da Comunidade: new page at /mural, linked in Header nav
- Admin Dashboard: has "Mural" and "Avaliações" tabs for managing posts/reviews
- All data is now pulled from real MySQL database (no hardcoded lists)
- DB is currently EMPTY (0 commerces, 0 reviews, 0 mural posts) - users need to add data via forms

## Key Fixes Made
1. Comercio.tsx: removed hardcoded commerceList, now uses trpc.commerce.listApproved
2. Comercio.tsx: added real average rating computation via ratingMap useMemo
3. Mural.tsx: removed hardcoded seedPosts, shows empty state when no posts
4. Mural.tsx: added pending approval notice after submission

## DB State
- commerces: 0 rows
- reviews: 0 rows
- muralPosts: 0 rows

## Remaining TODO Items (from todo.md - all marked [x] now)
All items from the star ratings + mural feature are complete.

## Next Step
Save checkpoint after verifying Comercio and Mural pages render correctly with empty state.
