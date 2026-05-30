# Marketplace Trades — Backend Plan (La Yaung Phyo)

> Module: `backend/src/modules/marketplace-trades/` · Route prefix: `/trades`
> Master plan: `.claude/plans/i-want-to-plan-scalable-axolotl.md` · Tracker: `PROGRESS.md`

## Goal

Full CRUD REST API for marketplace trade posts with filtering, photo upload, and a
reputation system: completing a trade awards +1 to both the owner and the
counterparty. Reputation has no UI on the Trades board yet — it is exposed via
endpoints for the Profile page (integration phase).

## Confirmed decisions

- **Statuses (String, Zod-validated — SQLite has no enums):** `available | pending |
  completed | unavailable`. (UI labels: Available / **Reserved** = pending / Completed /
  Unavailable.)
- **Photos:** `multer` disk storage → `backend/uploads/`, served at `/uploads`. Store the
  relative URL in `photoUrl`. Optional, image MIME only, ~2 MB cap.
- **Form/data fields:** title, ownerName, offering, wanting, itemType (category), urgency,
  area (location), contact, note?, photoUrl?, status, counterparty?.
- **Completion rule:** counterparty **required** to set `completed`; +1 to owner and
  counterparty, awarded exactly once (`reputationAwarded` guard).

## Prisma models (append-only to `backend/prisma/schema.prisma`)

```prisma
// ── Marketplace Trades (owner: La Yaung Phyo) ──────────────────────
model Trade {
  id                String   @id @default(cuid())
  title             String
  ownerName         String                          // author / reputation owner (plain string, no auth)
  offering          String                          // offer + qty, e.g. "Rice (20 kg)"
  wanting           String                          // want + qty, e.g. "Blankets (5)"
  itemType          String                          // water|food|medicine|batteries|shelter|tools|other
  urgency           String                          // low|medium|high|critical
  area              String                          // location, e.g. "Kathmandu, Bagmati"
  contact           String                          // phone / contact (required)
  note              String?
  photoUrl          String?                         // /uploads/<file>, set by multer
  status            String   @default("available")  // available|pending|completed|unavailable
  counterparty      String?                         // required when status -> completed
  reputationAwarded Boolean  @default(false)        // one-time idempotency guard
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Trader {
  id               String   @id @default(cuid())
  name             String   @unique                 // by-name link to Trade.ownerName / counterparty (no FK)
  reputationPoints Int      @default(0)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

After editing: from `backend/`, run `npx prisma generate && npx prisma db push`.

## Files (in this folder)

| File | Responsibility |
|---|---|
| `marketplace-trades.schema.ts` | Const arrays `STATUSES / URGENCIES / ITEM_TYPES`; `createTradeSchema`, `updateTradeSchema` (`.partial()`), `listTradesQuerySchema`. |
| `marketplace-trades.types.ts` | `z.infer` types only (no hand-written duplicates). |
| `marketplace-trades.upload.ts` | multer `diskStorage` → `backend/uploads/`, unique filename, image-MIME `fileFilter`, `limits.fileSize ≈ 2 MB`. Exports `uploadTradePhoto = upload.single("photo")`. |
| `marketplace-trades.data.ts` | Only file importing `{ prisma }` from `../../db`. CRUD + reputation `$transaction`. |
| `marketplace-trades.controller.ts` | Validate (Zod) → data layer → JSON. Throws `AppError` (`{ status }`) on 404 / business-rule 400. |
| `async-handler.ts` | `(fn) => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next)`. |
| `marketplace-trades.router.ts` | `express.Router()`, **default export**; wires handlers (+ `uploadTradePhoto` on POST/PATCH). |

Import style: **relative imports omit `.js`** (match scaffold, e.g. `../../db`).

## Zod schemas (`marketplace-trades.schema.ts`)

```ts
export const ITEM_TYPES = ["water","food","medicine","batteries","shelter","tools","other"] as const;
export const URGENCIES  = ["low","medium","high","critical"] as const;
export const STATUSES   = ["available","pending","completed","unavailable"] as const;

export const createTradeSchema = z.object({
  title:        z.string().trim().min(1).max(120),
  ownerName:    z.string().trim().min(1).max(80),
  offering:     z.string().trim().min(1).max(200),
  wanting:      z.string().trim().min(1).max(200),
  itemType:     z.enum(ITEM_TYPES),
  urgency:      z.enum(URGENCIES),
  area:         z.string().trim().min(1).max(120),
  contact:      z.string().trim().min(1).max(60),
  note:         z.string().trim().max(500).optional(),
  status:       z.enum(STATUSES).default("available"),
  counterparty: z.string().trim().min(1).max(80).optional(),
});

export const updateTradeSchema = createTradeSchema.partial();

export const listTradesQuerySchema = z.object({
  area:     z.string().trim().min(1).optional(),
  urgency:  z.enum(URGENCIES).optional(),
  itemType: z.enum(ITEM_TYPES).optional(),
  status:   z.enum(STATUSES).optional(),
  search:   z.string().trim().min(1).optional(), // contains-match on title/offering/wanting/note
});
```

`photoUrl` is **not** in the body schema — derived server-side from `req.file`
(`/uploads/<filename>` when present). Requests are `multipart/form-data`, so run multer
first, then parse `req.body` with Zod.

## Reputation logic (`updateTradeWithReputation`, in `prisma.$transaction`)

1. Load trade → 404 if missing.
2. If `patch.status === "completed"` and no counterparty (existing or in patch) →
   throw `AppError 400` "Counterparty is required to complete a trade."
3. `becomingCompleted = patch.status === "completed" && !existing.reputationAwarded`.
4. Update trade (+ `reputationAwarded: true` if `becomingCompleted`).
5. If `becomingCompleted`: `upsert` Trader for `ownerName` (+1) **and** `counterparty` (+1).
6. Return updated trade. Idempotent via `reputationAwarded`.

## API contract (prefix `/trades`)

| Method | Path | Body / Query | Success | Errors |
|---|---|---|---|---|
| POST | `/trades` | multipart createTradeSchema + optional `photo` | `201` Trade | `400` |
| GET | `/trades` | `area, urgency, itemType, status, search` (optional) | `200` `Trade[]` (desc `createdAt`) | `400` |
| GET | `/trades/:id` | — | `200` Trade | `404` |
| PATCH | `/trades/:id` | multipart updateTradeSchema + optional `photo` | `200` Trade (+reputation on →completed) | `400`, `404` |
| DELETE | `/trades/:id` | — | `200 {message:"Trade deleted"}` | `404` |
| GET | `/trades/traders` | — | `200` `Trader[]` (desc points) — Profile later | — |
| GET | `/trades/traders/:name` | — | `200` Trader or `{name, reputationPoints:0}` | — |

**Router ordering:** declare `/traders` and `/traders/:name` **before** `/:id` so Express 5
does not capture `traders` as an `:id`.

## Area I edits (coordinate with team)

- `backend/src/routers.ts` — uncomment:
  ```ts
  import marketplaceTradesRouter from "./modules/marketplace-trades/marketplace-trades.router";
  mainRouter.use("/trades", marketplaceTradesRouter);
  ```
- `backend/src/index.ts` — serve uploads (additive):
  `app.use("/uploads", express.static(<uploadsDir>))`.
- `backend/package.json` — add deps `multer`, `@types/multer`; scripts
  `"db:push": "prisma generate && prisma db push"`, `"seed": "tsx prisma/seed.ts"`.
- `context/architecture.md` — update Storage Model: add multer disk uploads
  (`backend/uploads/`, served `/uploads`) + `photoUrl`. (Do this first — current doc says
  "no blob/file storage".)

## Seeding — `backend/prisma/seed.ts`

Standalone tsx script, idempotent (`deleteMany` Trades+Traders, then create). ~8–10
disaster-themed trades mirroring the mockup (Rice for Blankets, Water Bottles for Power
Bank, Blankets for Gas Cylinder, Gas Cylinder for Rice, Power Bank for Medicine, Medicine
for Water Bottles, …) across every `itemType`, all statuses incl. one `completed` (with
counterparty) and its two Traders pre-seeded with points. Use real province `area` values
(Bagmati, Gandaki, Koshi) so the Location filter has options. `.gitkeep` an empty
`backend/uploads/`.

## Verification

1. `npx prisma generate && npx prisma db push`; `npm run seed`; `npm run dev` (`:3000`).
2. `GET /trades` → seeded array; `?itemType=water&urgency=high`, `?search=rice`,
   `?status=available` filter correctly.
3. `POST /trades` (multipart, valid + photo) → `201` with `photoUrl`; missing `offering` →
   `400`. Photo reachable at `http://localhost:3000/uploads/<file>`.
4. `PATCH /trades/:id {status:"completed"}` without counterparty → `400`; with counterparty
   → `200`, and `GET /trades/traders` shows owner + counterparty +1. Re-PATCH → unchanged.
5. `DELETE /trades/:id` → `200 {message}`; subsequent `GET` → `404`.
