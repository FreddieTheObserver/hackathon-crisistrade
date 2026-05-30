# hackathon-crisistrade

CrisisTrade — a web-based disaster marketplace where citizens, volunteers, and community groups exchange supplies, request urgent help, donate free resources, and find safe exchange points when normal shops, delivery, and money-based transactions are no longer reliable.

## Members & Features

| Member                         | Feature              | Branch                         |
| ------------------------------ | -------------------- | ------------------------------ |
| La Yaung Phyo                  | Marketplace Trades   | `feature/marketplace-trades`   |
| Eaint Myat Noe                 | Donations            | `feature/donations`            |
| Felice Christiara Median Putri | Emergency Requests   | `feature/emergency-requests`   |
| Saw Thet Wai Yan               | Safe Exchange Points | `feature/safe-exchange-points` |

Authentication is not implemented during individual feature development (allowed under Rule 4). Auth, an admin page, and a rules-acceptance page may be added in a later integration phase.

## About

CrisisTrade is a CSC105 PreHack / hackathon project (Team E1-G12). It is built as four **independent** CRUD boards, one per team member, so each feature can be developed and demoed on its own. The repository follows the **shared folder structure** convention:

- **Area I — Shared infrastructure** (`backend/src/{index,db,routers}.ts`, `backend/prisma/schema.prisma`, `frontend/src/{main,App,api,routers}.tsx`, etc.) is managed collaboratively and edited only when necessary.
- **Area II — Private feature modules** lives under `backend/src/modules/<feature>/` and `frontend/src/modules/<feature>/`. Each member owns one folder and develops their feature entirely within it.

## Features

- **Marketplace Trades** — Post disaster supply trades (what you have, what you want), browse and filter by area/urgency/item/status, update trade status, and earn simple reputation points when a trade is completed. Owned by La Yaung Phyo.
- **Donations** — Post free supplies (food, water, medicine, shelter items), browse and filter, and mark items as reserved or finished. Posts clearly show items are free — no payment or trading logic. Owned by Eaint Myat Noe.
- **Emergency Requests** — Post urgent requests for essential supplies or assistance even with nothing to trade; track status as open, helped, or closed. Owned by Felice Christiara Median Putri.
- **Safe Exchange Points** — Post public locations useful for trades, donation pickup, or aid distribution, with safety status and facilities; track operational status. Owned by Saw Thet Wai Yan.

## API Endpoints

_No endpoints are implemented yet. Each feature exposes a REST CRUD router mounted under its own prefix in `backend/src/routers.ts`. Members add their concrete endpoints here as they land._

Planned route prefixes:

- **Marketplace Trades** — `/trades`
- **Donations** — `/donations`
- **Emergency Requests** — `/requests`
- **Safe Exchange Points** — `/exchange-points`

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, Axios, Zod
- **Backend:** Express 5, TypeScript, Zod, cookie-parser, cors
- **Database:** SQLite via Prisma 7 ORM (libSQL adapter)

## Setup

```bash
# Backend
cd backend
npm install
npx prisma generate
cp .env.example .env   # then edit DATABASE_URL
npx prisma db push     # create the SQLite database
npm run dev            # runs on http://localhost:3000

# Frontend (in a separate terminal)
cd frontend
npm install
cp .env.example .env   # then edit VITE_API_URL to point at the backend
npm run dev            # runs on http://localhost:5173
```

## Git Workflow

- `main` is the integration branch — do not develop directly on it.
- Each member works on `feature/<their-feature-name>` (all lowercase, kebab-case).
- Commit regularly with clear messages (e.g., `Add trade status filtering`, `Fix reputation increment on completion`).
- All feature branches must be merged into `main` before final submission.
- **Do not delete feature branches after merging.**
- **Do not do major implementation work on another member's feature branch.**

## Database Schema Changes

`backend/prisma/schema.prisma` is the **one shared file the whole team coordinates on**. Before pushing schema changes:

1. Announce in the team chat what model you're adding.
2. Append your model to the bottom of `schema.prisma` (don't reformat existing models).
3. Run `npx prisma generate` and `npx prisma db push` locally to verify.
4. Commit the schema change in its own commit with a clear message like `Add Trade model to schema`.
