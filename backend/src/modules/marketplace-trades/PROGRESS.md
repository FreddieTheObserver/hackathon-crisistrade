# Marketplace Trades — Backend Progress

> Module: `backend/src/modules/marketplace-trades/` · Plan: `PLAN.md`
> Last updated: 2026-05-30

**Legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

## Status: Not started (planning complete)

## Tasks

### 0. Prep / coordination
- [x] Update `context/architecture.md` Storage Model (multer disk uploads + `photoUrl`)
- [ ] Add deps to `backend/package.json`: `multer`, `@types/multer`
- [ ] Add scripts: `db:push`, `seed`
- [ ] Create empty `backend/uploads/` with `.gitkeep`

### 1. Database
- [ ] Append `Trade` model to `backend/prisma/schema.prisma`
- [ ] Append `Trader` model to `backend/prisma/schema.prisma`
- [ ] Run `npx prisma generate && npx prisma db push`

### 2. Validation & types
- [ ] `marketplace-trades.schema.ts` — const arrays + create/update/list-query schemas
- [ ] `marketplace-trades.types.ts` — `z.infer` types

### 3. Infrastructure
- [ ] `async-handler.ts` — promise-forwarding wrapper
- [ ] `marketplace-trades.upload.ts` — multer disk storage + image filter + size limit

### 4. Data access (`marketplace-trades.data.ts`)
- [ ] `listTrades(filters)` — Prisma `where` from filters, `search` OR-contains, desc createdAt
- [ ] `getTradeById(id)`
- [ ] `createTrade(input)`
- [ ] `updateTradeWithReputation(id, patch)` — `$transaction`, counterparty rule, +1 both, idempotent
- [ ] `deleteTrade(id)` — 404 if missing
- [ ] `listTraders()` / `getTraderByName(name)`

### 5. Controller (`marketplace-trades.controller.ts`)
- [ ] `create` (201) — parse body after multer, attach `photoUrl` from `req.file`
- [ ] `list` (200) — parse query
- [ ] `readOne` (200 / 404)
- [ ] `update` (200) — partial body + optional photo + status/reputation side-effect
- [ ] `remove` (200 `{message}`)
- [ ] `traders` / `trader` (reputation read endpoints)

### 6. Router (`marketplace-trades.router.ts`)
- [ ] Wire endpoints via `asyncHandler`; `uploadTradePhoto` on POST/PATCH
- [ ] `/traders` + `/traders/:name` declared **before** `/:id`
- [ ] Default export

### 7. Area I wiring
- [ ] `backend/src/routers.ts` — uncomment import + mount `/trades`
- [ ] `backend/src/index.ts` — `express.static` for `/uploads`

### 8. Seed
- [ ] `backend/prisma/seed.ts` — 8–10 themed trades, all statuses, one completed + Traders
- [ ] `npm run seed` runs clean

### 9. Verification (see PLAN.md)
- [ ] CRUD endpoints return correct shapes/status codes
- [ ] Filters (`area/urgency/itemType/status/search`) work
- [ ] Photo upload → `201` with reachable `/uploads/<file>`
- [ ] Completion: counterparty required; +1 both; idempotent re-PATCH
- [ ] Delete → 200 then 404

## Notes / decisions log
- (append dated notes as implementation proceeds)
