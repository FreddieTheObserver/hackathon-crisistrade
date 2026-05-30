# Marketplace Trades — Frontend Progress

> Module: `frontend/src/modules/marketplace-trades/` · Plan: `PLAN.md`
> Last updated: 2026-05-30

**Legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

## Status: Not started (planning complete)

## Tasks

### 1. Schemas & types
- [ ] `marketplace-trades.schemas.ts` — Zod mirrors + const arrays for selects
- [ ] `marketplace-trades.types.ts` — `z.infer` types

### 2. API layer (`marketplace-trades.api.ts`)
- [ ] `fetchTrades(filters)` — query params, Zod-parse array
- [ ] `fetchTrade(id)`
- [ ] `createTrade(formData)` — multipart
- [ ] `updateTrade(id, formData)` — multipart
- [ ] `deleteTrade(id)`

### 3. Routing
- [ ] `marketplace-trades.routes.tsx` — export `marketplaceTradesRoutes`

### 4. Page shell (`pages/TradesPage.tsx`)
- [ ] State: trades, filters, roll-down open/edit, `highlightId`
- [ ] Fetch on mount + on filter change
- [ ] Wire create/edit/delete/status handlers

### 5. Components
- [ ] `PageHeader.tsx` — badge, title/subtitle, +Add Trade toggle
- [ ] `TradeFilters.tsx` — search + 4 selects + Clear Filters
- [ ] `AddTradeForm.tsx` — roll-down create + edit, builds `FormData`
- [ ] `TradeGrid.tsx` — responsive 3-col grid
- [ ] `TradeCard.tsx` — thumbnail/photo, chips, footer, actions, red-ring highlight
- [ ] `StatusBadge.tsx` — token → label/color
- [ ] `CompleteTradeDialog.tsx` — required counterparty capture
- [ ] `ConfirmDeleteDialog.tsx` — delete confirm
- [ ] `lib/timeAgo.ts` — relative time

### 6. Behaviors
- [ ] Add flow → prepend card + red ring + collapse panel
- [ ] Edit flow → pre-filled roll-down → save
- [ ] Status change; Completed → counterparty dialog → PATCH
- [ ] Delete → confirm → remove
- [ ] Filters refetch; Clear Filters resets
- [ ] Photo render (uploaded vs category placeholder)

### 7. Area I wiring
- [ ] `frontend/src/routers.tsx` — uncomment import + spread
- [ ] `frontend/src/App.tsx` — add Trades `<Link>` (coordinate nav shell)

### 8. Verification (see PLAN.md)
- [ ] Grid + filters render and narrow results
- [ ] Add Trade roll-down → Post → red-ring card; photo shows
- [ ] Edit pre-fills + saves; Completed prompts counterparty; Delete confirms
- [ ] `npm run build` clean (no unused locals/params)

## Notes / decisions log
- (append dated notes as implementation proceeds)
