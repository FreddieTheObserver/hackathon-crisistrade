# Marketplace Trades — Frontend Plan (La Yaung Phyo)

> Module: `frontend/src/modules/marketplace-trades/` · Route: `/trades`
> Master plan: `.claude/plans/i-want-to-plan-scalable-axolotl.md` · Tracker: `PROGRESS.md`

## Goal

The Marketplace Trades board: a filterable card grid of trade posts with an inline
"Add Trade" roll-down form (create + edit), status changes, and delete — matching the
provided mockups. Reputation is **not** shown here (deferred to the Profile page).

## UI reference (from mockups)

**Board (`/trades`):**
- Title block: small "trade" badge · "Marketplace Trades" · subtitle "Buy, sell, or trade
  essential items with your community." · green **+ Add Trade** button (top-right) toggles
  the roll-down form.
- **Filter bar:** full-width Search input + dropdowns **Location / Category / Urgency /
  Status** (default "All …") + **✕ Clear Filters**.
- **Add-trade roll-down:** header "Add a New Trade" + collapse chevron; one row of fields
  (Title*, Name*, Offer+Qty*, Want+Qty*, Category*, Urgency*, Location*, Photo, Note,
  Contact*); buttons **Cancel** / **Post Trade** (green).
- **Card grid (3 cols):** thumbnail (uploaded photo, else category-color block + short
  label) · title · status badge top-right · green **Offer** chip + offering · blue **Want**
  chip + wanting · **Location** (bold) · note (muted) · footer: owner name + contact phone
  (green) + "Nh ago" (right). Newly-added card = **red ring**.
- **Card actions** (not drawn, required for CRUD): **Edit** reopens the roll-down pre-filled;
  **Delete** confirms; a **status control** changes status — choosing **Completed** opens a
  dialog for the required counterparty name.

## Status labels / colors

| token | label | color |
|---|---|---|
| `available` | Available | green |
| `pending` | **Reserved** | amber |
| `completed` | Completed | blue |
| `unavailable` | Unavailable | red |

## Files (in this folder)

| File | Responsibility |
|---|---|
| `marketplace-trades.schemas.ts` | Zod mirrors of API: `tradeSchema`, `tradeArraySchema`, form-input schema; const arrays for selects (`ITEM_TYPES/URGENCIES/STATUSES`). |
| `marketplace-trades.types.ts` | `z.infer` types: `Trade`, `CreateTradeInput`, `UpdateTradeInput`, `TradeFilters`. |
| `marketplace-trades.api.ts` | `fetchTrades(filters)`, `fetchTrade(id)`, `createTrade(formData)`, `updateTrade(id, formData)`, `deleteTrade(id)`. Create/update send `FormData`. Parse responses with Zod. Uses shared `api` from `../../api`. |
| `marketplace-trades.routes.tsx` | Exports `marketplaceTradesRoutes: RouteObject[]` → `{ path: "trades", element: <TradesPage /> }`. |
| `pages/TradesPage.tsx` | Owns trades, filters, roll-down open/edit state, `highlightId`. Fetches on mount + filter change. |
| `components/PageHeader.tsx` | "trade" badge, title/subtitle, **+ Add Trade** toggle. |
| `components/TradeFilters.tsx` | Search + Location/Category/Urgency/Status selects + Clear Filters. Location options from distinct `area`; others from const arrays. |
| `components/AddTradeForm.tsx` | Roll-down panel (create + edit). All fields. Builds `FormData`. Cancel / Post Trade. |
| `components/TradeGrid.tsx` | Responsive 3-col grid. |
| `components/TradeCard.tsx` | Thumbnail, title, `StatusBadge`, Offer/Want chips, location, note, footer, action controls. Red ring when `trade.id === highlightId`. |
| `components/StatusBadge.tsx` | token → label + color. |
| `components/CompleteTradeDialog.tsx` | Capture **required** counterparty name when → `completed`; surface backend 400. |
| `components/ConfirmDeleteDialog.tsx` | Delete confirmation. |
| `lib/timeAgo.ts` | "2h ago" from `createdAt`. |

Module is isolated: re-declare the const arrays and mirror API shapes locally (do not import
backend or other modules). All HTTP via shared `api`.

## Key behaviors

- **Add:** +Add Trade rolls panel down → fill → Post Trade → `createTrade` → prepend new
  card, set `highlightId`, collapse. Ring persists until next add (or soft timeout).
- **Edit:** card Edit → roll-down opens pre-filled (edit mode) → Post saves via `updateTrade`.
- **Status / complete:** status control PATCHes; selecting Completed opens
  `CompleteTradeDialog` for counterparty (required) before the PATCH.
- **Delete:** confirm → `deleteTrade` → remove from grid.
- **Filters:** change → refetch `GET /trades` with query params; Clear Filters resets.
- **Photo render:** `<img src={`${import.meta.env.VITE_API_URL}${photoUrl}`}>` when present,
  else category-color placeholder block.

## Area I edits (coordinate with team)

- `frontend/src/routers.tsx` — uncomment:
  ```ts
  import { marketplaceTradesRoutes } from "./modules/marketplace-trades/marketplace-trades.routes";
  // ...
  ...marketplaceTradesRoutes,
  ```
- `frontend/src/App.tsx` — header/nav per mockup is **Area I, team-coordinated**; this module
  contributes the **Trades** `<Link>` (active-tab styling). The full multi-board nav shell
  (Emergency/Donations/Locations/Profile + branding + AK chip) is a shared decision.
- Styling: Tailwind utilities matching the mockup (light theme, green `#16a34a`-style
  accent). `ui-context.md` tokens optional; if formalized later, update that file first.

## Verification

1. `npm run dev` (`:5173`), open `/trades`: grid + filters render and narrow results.
2. +Add Trade rolls down; Post Trade adds a card with the **red ring**; uploaded photo shows.
3. Edit pre-fills the roll-down and saves; status→Completed prompts counterparty; Delete
   confirms and removes.
4. `npm run build` — no `noUnusedLocals` / `noUnusedParameters` TS errors.
