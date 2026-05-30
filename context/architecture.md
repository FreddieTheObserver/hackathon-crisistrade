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
| File upload | Multer (disk storage)                       | Image uploads saved to `backend/uploads/`, served at `/uploads`   |
| Auth        | JWT in httpOnly cookie (`jsonwebtoken` + `bcryptjs`) | Backend `modules/auth` + shared `requireAuth`; see Auth and Access Model below |

## System Boundaries

The repo follows the PreHack shared-folder convention: **Area I** (shared infrastructure, edited collaboratively) and **Area II** (private per-member feature modules).

### Area I — Shared infrastructure (coordinate before editing)

- `backend/src/index.ts` — Express app setup, middleware (json, urlencoded, cookie-parser, cors), static serving of uploaded files at `/uploads`, router mount, error handler, server start.
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
- **Local file storage for image uploads**: boards that accept a photo (e.g. Marketplace Trades) upload it via Multer to the local `backend/uploads/` directory, served statically at `/uploads`. Only the relative file URL (e.g. `/uploads/<file>`) is persisted in SQLite as a string column (e.g. `Trade.photoUrl`) — the binary itself is **not** stored in the database. Uploads are restricted to image MIME types with a small size cap (~2 MB); the directory is git-ignored (kept with a `.gitkeep`). No cloud/object storage in the MVP.
- **No browser localStorage for canonical data**: although the original product brief mentioned local browser storage for a demo, this implementation persists data through the real SQLite backend. localStorage may only be used later for non-canonical UI state (e.g., the integration-phase rules-acceptance flag).

## Auth and Access Model

Authentication was added in the integration phase (backend, branch `share/auth`). It **reuses** the boards without changing their core CRUD — guards and an owner stamp were added, the data flows are unchanged.

- **Accounts:** a single shared `User` model (`email`/`displayName` unique, `passwordHash`). Signup/login/logout/current-user live in `backend/src/modules/auth/` and mount at `/auth`.
- **Session:** a JWT signed with `JWT_SECRET` (`jsonwebtoken`), stored in an httpOnly cookie named `token`; passwords hashed with `bcryptjs`. The frontend's existing `withCredentials` Axios instance carries the cookie. No session table — auth is stateless.
- **`requireAuth`** (`backend/src/middlewares/require-auth.ts`, Area I) verifies the cookie and attaches `req.user = { id, email, displayName }`; absent/invalid → 401. `Express.Request` is augmented in `backend/src/types/express.d.ts`.
- **Ownership:** every post carries its creator as a plain `userId` string (no Prisma FK relation — consistent with the by-name `Trader` link) plus a denormalized `ownerName`. Donations reuse their existing `ownerId`. Owner is **stamped from the session** on create; **reads are public**, but **create/update/delete require `requireAuth`** and 403 when `record.userId !== req.user.id`.
- **Reputation:** the owner side of a completed trade links its `Trader` to the real account via `Trader.userId`; the counterparty stays a typed name (by-name `Trader`, no account). `GET /auth/me` returns the caller's `reputationPoints`.
- **Admin moderation:** `User.role` (`"user"` | `"admin"`) carried in the session JWT and returned by `/auth/me`. `isAdmin`/`requireAdmin` live in `require-auth.ts`. Admins **bypass** every board's owner-check (`isAdmin || owner`), so the admin UI moderates posts (suspend/ban/restore/delete) through the **existing board endpoints** — no separate admin API. Admins are created via seed only; signup always creates a plain `user` (no self-elevation). Status enums gained `suspended`/`banned` per board for moderation.
- **Frontend session state:** a global `AuthProvider` (`frontend/src/auth/AuthContext.tsx`, Area I) resolves the session via `GET /auth/me` on load and holds the current user; `useAuth()` exposes `user`/`loading`/`setUser`/`refresh`/`logout`. `/login` and `/signup` are separate routes whose forms call `/auth/login` and `/auth/signup` and push the user into context; the navbar shows the user and a logout action. `ProtectedRoute` (`frontend/src/middlewares/ProtectedRoute.tsx`) is now real — it gates the `/` app shell and redirects unauthenticated visitors to `/login`.
- **Still deferred to frontend integration:** the Rules & Regulations acceptance gate. The admin dashboard UI exists (frontend) and is now backed by role-gated moderation.

## Invariants

1. The four boards are **independent**: a feature module must not import from another feature module. Cross-board coupling is forbidden during individual implementation.
2. Area I shared files are edited collaboratively and sparingly; members do their feature work inside their own `modules/<feature>/` folder.
3. `schema.prisma` changes are append-only and team-coordinated — never reformat or rewrite another member's model.
4. No auth, admin, or rules-acceptance logic lives inside an individual feature module during the individual phase.
5. All external input (request bodies, query params, form data) is validated with Zod at the boundary before any logic runs.
6. Each feature mounts its Express router under a distinct path prefix in `backend/src/routers.ts`; no two boards share a prefix.
7. Errors are surfaced by throwing (or forwarding) to the central `errorHandler` — handlers do not hand-roll inconsistent error responses.
