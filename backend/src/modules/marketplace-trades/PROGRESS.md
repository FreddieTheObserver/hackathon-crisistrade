# Marketplace Trades — Backend Progress

> Module: `backend/src/modules/marketplace-trades/` · Plan: `PLAN.md`
> Last updated: 2026-05-30

**Legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

## Status: Backend complete (Tasks 0–9 done; verified via Postman)

> Note: files live under the kept subfolder layout — `schemas/`, `types/`,
> `services/` (data layer), `controllers/`, `middlewares/` (upload +
> async-handler), with the router at the module root.

## Tasks

### 0. Prep / coordination
- [x] Update `context/architecture.md` Storage Model (multer disk uploads + `photoUrl`)
- [x] Add deps to `backend/package.json`: `multer`, `@types/multer`
- [x] Add scripts: `db:push`, `seed`
- [x] Create empty `backend/uploads/` with `.gitkeep` (+ `.gitignore` rule for uploads)

### 1. Database
- [x] Replace `Trade` model in `backend/prisma/schema.prisma` (cuid, full fields, no FK)
- [x] Replace `Trader` model in `backend/prisma/schema.prisma` (cuid, by-name link)
- [x] Run `npx prisma generate && npx prisma db push` (used `--accept-data-loss`, no reset needed)

### 2. Validation & types
- [x] `schemas/marketplace-trades.schema.ts` — const arrays + create/update/list-query schemas
- [x] `types/marketplace-trades.types.ts` — `z.infer` types

### 3. Infrastructure
- [x] `middlewares/async-handler.ts` — promise-forwarding wrapper
- [x] `middlewares/marketplace-trades.upload.ts` — multer disk storage + image filter + 2 MB limit

### 4. Data access (`services/marketplace-trades.service.ts`)
- [x] `listTrades(filters)` — Prisma `where` from filters, `search` OR-contains, desc createdAt
- [x] `getTradeById(id)`
- [x] `createTrade(input)`
- [x] `updateTradeWithReputation(id, patch)` — `$transaction`, counterparty rule, +1 both, idempotent
- [x] `deleteTrade(id)` — 404 if missing
- [x] `listTraders()` / `getTraderByName(name)`

### 5. Controller (`controllers/marketplace-trades.controller.ts`)
- [x] `createTrade` (201) — parse body after multer, attach `photoUrl` from `req.file`
- [x] `listTrades` (200) — parse query
- [x] `getTrade` (200 / 404)
- [x] `updateTrade` (200) — partial body + optional photo + status/reputation side-effect
- [x] `deleteTrade` (200 `{message}`)
- [x] `listTraders` / `getTrader` (reputation read endpoints)

### 6. Router (`marketplace-trades.router.ts`)
- [x] Wire endpoints via `asyncHandler`; `uploadTradePhoto` on POST/PATCH
- [x] `/traders` + `/traders/:name` declared **before** `/:id`
- [x] Default export

### 7. Area I wiring
- [x] `backend/src/routers.ts` — uncomment import + mount `/trades`
- [x] `backend/src/index.ts` — `express.static` for `/uploads`

### 8. Seed
- [x] `backend/prisma/seed.ts` — 9 themed trades, all statuses, one completed + Traders
- [x] `npm run seed` runs clean (9 trades, 2 traders)

### 9. Verification (see PLAN.md)
- [x] CRUD endpoints return correct shapes/status codes
- [x] Filters (`area/urgency/itemType/status/search`) work
- [x] Photo upload → `201` with reachable `/uploads/<file>`
- [x] Completion: counterparty required; +1 both; idempotent re-PATCH
- [x] Delete → 200 then 404

## Notes / decisions log
- 2026-05-30 — Kept the existing subfolder layout (`schemas/`, `services/`,
  `controllers/`) instead of flat module-root files; added `types/` and
  `middlewares/` for the new infra. Data layer file is `services/*.service.ts`
  (the plan's `*.data.ts` role).
- 2026-05-30 — `db push` applied with `--accept-data-loss` (Int→cuid PK change);
  a full `--force-reset` was not needed.
- 2026-05-30 — Tasks 0–8 implemented; `tsc --noEmit` clean.
- 2026-05-30 — Task 9 verified manually via Postman against `npm run dev`
  (CRUD, filters, photo upload, reputation completion/idempotency, delete→404).
