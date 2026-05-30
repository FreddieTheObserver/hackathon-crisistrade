# Code Standards

## General

- Keep modules small and single-purpose; one board per feature module folder.
- Fix root causes — do not layer workarounds on top of broken behavior.
- Do not mix unrelated concerns (e.g., two boards, or UI and unrelated API work) in a single component, route, or commit.
- Build features within your own `modules/<feature>/` folder; touch Area I shared files only when integration genuinely requires it, and coordinate first.

## TypeScript

- Strict typing is required. The backend `tsconfig.json` sets `"strict": true`; the frontend enables `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`. Keep both clean.
- Avoid `any` — use explicit interfaces or narrowly scoped types. Derive request/response types from Zod schemas where possible (`z.infer`).
- Validate unknown external input at system boundaries with Zod before trusting it; never cast untrusted data straight to a type.

## Backend (Express 5 + Prisma)

- Each feature exposes its own `Router` and is mounted under a distinct prefix in `backend/src/routers.ts` (e.g., `mainRouter.use("/trades", tradesRouter)`).
- Import the shared Prisma client from `backend/src/db.ts` — do not instantiate a new `PrismaClient` per module.
- Parse and validate the request (`body`, `params`, `query`) with Zod at the top of each handler, before any database work.
- Keep handlers focused: validate → call data layer → return a consistent JSON shape. Push reusable DB logic out of the route function when it grows.
- Surface failures by throwing an error with a `status` (handled by `error_handler.ts`); rely on the central handler rather than duplicating error JSON.

## Frontend (React 19 + React Router 7)

- Use function components and hooks. Keep each board's pages and components inside `frontend/src/modules/<feature>/`.
- Make all HTTP calls through the shared Axios instance in `frontend/src/api.ts` — do not create ad-hoc axios clients or hardcode the base URL.
- Register a board's routes as children of the root router in `frontend/src/routers.tsx`; keep route ownership inside your module.
- Validate/parse API responses with Zod when shape correctness matters.

## Styling

- Use Tailwind CSS 4 utility classes (the global stylesheet is `frontend/src/index.css`, which imports Tailwind).
- Color tokens, typography, radius, and component conventions will be defined in `ui-context.md` — once defined, use those tokens rather than hardcoded hex values.

## API Routes

- Validate and parse request input with Zod before any logic runs.
- Return consistent, predictable response shapes per board (e.g., the created/updated resource, or a `{ message }` on delete).
- Standard CRUD shape per board: `POST /` (create), `GET /` (list, with optional filter query params), `GET /:id` (read one), `PATCH /:id` (update / status change), `DELETE /:id` (delete).
- Status transitions (e.g., a trade → `completed`, with the reputation increment) are server-side mutations validated like any other update.

## Data and Storage

- Post data and reputation live in SQLite via Prisma — the database is the source of truth, not the browser.
- Append new models to the bottom of `backend/prisma/schema.prisma`; never reformat existing models. After changes, run `npx prisma generate` and `npx prisma db push`.
- Do not store canonical app data in `localStorage`. (localStorage is reserved for non-canonical UI state in the later integration phase.)
- Seed disaster-themed sample data so each board is demoable.

## File Organization

- `backend/src/modules/<feature>/` — a board's backend: router, request handlers/controllers, Zod schemas, and Prisma-backed data access.
- `frontend/src/modules/<feature>/` — a board's frontend: pages, components, API call helpers, and types.
- `backend/src/` (Area I) — `index.ts`, `routers.ts`, `db.ts`, `middlewares/` — shared, coordinate before editing.
- `frontend/src/` (Area I) — `main.tsx`, `App.tsx`, `routers.tsx`, `api.ts`, `middlewares/` — shared, coordinate before editing.
- `backend/prisma/schema.prisma` — the single shared schema file.
