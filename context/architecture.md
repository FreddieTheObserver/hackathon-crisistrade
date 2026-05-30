# Architecture Context

## Stack

| Layer       | Technology                                  | Role                                                              |
| ----------- | ------------------------------------------- | ----------------------------------------------------------------- |
| Frontend    | React 19 + TypeScript + Vite                | SPA UI, dev server on `http://localhost:5173`                     |
| UI          | Tailwind CSS 4                              | Styling (design tokens to be defined in `ui-context.md`)          |
| Routing     | React Router 7 (`react-router-dom`)         | Client-side routing via `frontend/src/routers.tsx`               |
| HTTP client | Axios                                       | Shared instance in `frontend/src/api.ts` (`withCredentials`)      |
| Backend     | Express 5 + TypeScript (tsx)                | REST API, dev server on `http://localhost:3000`                   |
| Validation  | Zod                                         | Validates external input at the API boundary (front and back)     |
| Database    | SQLite via Prisma 7 (libSQL adapter)        | Persistent storage for posts and reputation                       |
| Auth        | None (not implemented in individual phase)  | `ProtectedRoute` is currently a pass-through placeholder          |

## System Boundaries

The repo follows the PreHack shared-folder convention: **Area I** (shared infrastructure, edited collaboratively) and **Area II** (private per-member feature modules).

### Area I — Shared infrastructure (coordinate before editing)

- `backend/src/index.ts` — Express app setup, middleware (json, urlencoded, cookie-parser, cors), router mount, error handler, server start.
- `backend/src/routers.ts` — root `mainRouter`; each feature mounts its router here under a distinct prefix.
- `backend/src/db.ts` — Prisma client instance (libSQL adapter); import `prisma` from here.
- `backend/src/middlewares/error_handler.ts` — central error handler; handles `ZodError` (400) and `AppError.status`.
- `backend/prisma/schema.prisma` — the single shared schema; models are appended, never reformatted.
- `frontend/src/main.tsx` — React entry; mounts `RouterProvider`.
- `frontend/src/App.tsx` — app shell (header/nav + `<Outlet/>`).
- `frontend/src/routers.tsx` — root browser router; each feature registers its routes as children.
- `frontend/src/api.ts` — shared Axios instance pointed at `VITE_API_URL`.

### Area II — Private feature modules (one owner each)

- `backend/src/modules/marketplace-trades/` — Marketplace Trades API (owner: La Yaung Phyo).
- `backend/src/modules/donations/` — Donations API (owner: Eaint Myat Noe).
- `backend/src/modules/emergency-requests/` — Emergency Requests API (owner: Felice Christiara Median Putri).
- `backend/src/modules/exchange-points/` — Safe Exchange Points API (owner: Saw Thet Wai Yan).
- `frontend/src/modules/<feature>/` — the matching frontend module (pages, components, API calls, types) for each board.

## Storage Model

- **SQLite (via Prisma)**: the source of truth for all post data and reputation. Each board owns one or more Prisma models appended to the shared `schema.prisma`. Post metadata, status fields, and reputation counters all live here.
- **No blob/file storage**: the MVP has no media or large-artifact uploads.
- **No browser localStorage for canonical data**: although the original product brief mentioned local browser storage for a demo, this implementation persists data through the real SQLite backend. localStorage may only be used later for non-canonical UI state (e.g., the integration-phase rules-acceptance flag).

## Auth and Access Model

- **No authentication during individual implementation.** There are no accounts, sessions, roles, or permissions yet.
- `frontend/src/middlewares/ProtectedRoute.tsx` currently renders its children unchanged — it is a placeholder for the integration phase, not active access control.
- Posts are **not** tied to an authenticated user. Where a board needs an "author" or a reputation owner (e.g., Marketplace Trades), that identity is a plain field on the post/record, not a real user account.
- Authentication, ownership, and admin moderation are deferred to the integration phase and must reuse the boards without changing their CRUD.

## Invariants

1. The four boards are **independent**: a feature module must not import from another feature module. Cross-board coupling is forbidden during individual implementation.
2. Area I shared files are edited collaboratively and sparingly; members do their feature work inside their own `modules/<feature>/` folder.
3. `schema.prisma` changes are append-only and team-coordinated — never reformat or rewrite another member's model.
4. No auth, admin, or rules-acceptance logic lives inside an individual feature module during the individual phase.
5. All external input (request bodies, query params, form data) is validated with Zod at the boundary before any logic runs.
6. Each feature mounts its Express router under a distinct path prefix in `backend/src/routers.ts`; no two boards share a prefix.
7. Errors are surfaced by throwing (or forwarding) to the central `errorHandler` — handlers do not hand-roll inconsistent error responses.
