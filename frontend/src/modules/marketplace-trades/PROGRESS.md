# Marketplace Trades — Frontend Progress

> Module: `frontend/src/modules/marketplace-trades/` · Plan: `PLAN.md`
> Last updated: 2026-05-30

**Legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

## Status: Done — implemented & verified in-browser (subfolder layout)

> Layout note: files are organized into subfolders (`schemas/`, `types/`, `api/`,
> `lib/`, `components/`, `pages/`) instead of the flat layout in PLAN.md; the route
> file stays at the module root.

## Tasks

### 1. Schemas & types
- [x] `schemas/marketplace-trades.schemas.ts` — Zod mirrors + const arrays for selects
- [x] `types/marketplace-trades.types.ts` — `z.infer` types (+ re-export of `ItemType`/`Urgency`/`Status`)

### 2. API layer (`api/marketplace-trades.api.ts`)
- [x] `fetchTrades(filters)` — query params (blanks omitted), Zod-parse array
- [x] `fetchTrade(id)`
- [x] `createTrade(formData)` — multipart
- [x] `updateTrade(id, formData)` — multipart
- [x] `deleteTrade(id)`

### 3. Routing
- [x] `marketplace-trades.routes.tsx` — export `marketplaceTradesRoutes`

### 4. Page shell (`pages/TradesPage.tsx`)
- [x] State: trades, filters, roll-down open/edit, `highlightId`, dialogs
- [x] Fetch on mount + on filter change (with stale-response guard)
- [x] Wire create/edit/delete/status handlers

### 5. Components
- [x] `PageHeader.tsx` — badge, title/subtitle, +Add Trade toggle
- [x] `TradeFilters.tsx` — search + 4 selects + Clear Filters
- [x] `AddTradeForm.tsx` — roll-down create + edit, builds `FormData`
- [x] `TradeGrid.tsx` — responsive grid (1/2/3 cols)
- [x] `TradeCard.tsx` — thumbnail/photo, chips, footer, actions, red-ring highlight
- [x] `StatusBadge.tsx` — token → label/color (`pending` → "Reserved")
- [x] `CompleteTradeDialog.tsx` — required counterparty capture
- [x] `ConfirmDeleteDialog.tsx` — delete confirm
- [x] `lib/timeAgo.ts` — relative time

### 6. Behaviors
- [x] Add flow → prepend card + red ring + collapse panel
- [x] Edit flow → pre-filled roll-down → save
- [x] Status change; Completed → counterparty dialog → PATCH
- [x] Delete → confirm → remove
- [x] Filters refetch; Clear Filters resets
- [x] Photo render (uploaded vs category placeholder)

### 7. Area I wiring
- [x] `frontend/src/routers.tsx` — import + spread `...marketplaceTradesRoutes`
- [x] `frontend/src/App.tsx` — added Trades `NavLink` (active-tab styling)

### 8. Verification (see PLAN.md)
- [x] Grid + filters render and narrow results
- [x] Add Trade roll-down → Post → red-ring card; photo shows
- [x] Edit pre-fills + saves; Completed prompts counterparty; Delete confirms
- [x] `npm run build` clean (no unused locals/params)

## Notes / decisions log
- 2026-05-30 — Module organized into subfolders (deviation from flat PLAN layout).
- 2026-05-30 — `Status`/`ItemType`/`Urgency` re-exported from `types` so components
  import all trade types from one module.
- 2026-05-30 — Status changes go through `updateTrade` with a one-field `FormData`
  (single update path); `completed` first collects counterparty via dialog.
- 2026-05-30 — "Failed to load trades" during verification was **not** a code bug:
  a stale Vite instance held :5173, so the dev server fell back to :5174, whose
  origin isn't in the backend `ALLOW_ORIGIN` allowlist → CORS blocked the request.
  Fix: free :5173 and run the frontend on the configured origin.
- 2026-05-30 — Reputation intentionally **not** shown on this board (deferred to a
  Profile page in the integration phase); points still accrue server-side.
