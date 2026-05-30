# UI Context

## Theme

CrisisTrade is a **light** technical workspace — a near-white page (`slate-50`)
with white layered surfaces (cards, navbar, panels), slate text, a single
emerald accent for primary/brand actions, and one tone color per board
(yellow / red / green / sky). There is no dark mode in the MVP.

## Colors

Tokens are defined as Tailwind 4 `@theme` custom properties in
`frontend/src/index.css`. Defining `--color-<name>` there generates the
matching utilities automatically (`bg-<name>`, `text-<name>`, `border-<name>`).
Prefer these semantic utilities over raw palette classes in shared chrome.

| Role               | CSS Variable            | Utility example   | Value (palette)     |
| ------------------ | ----------------------- | ----------------- | ------------------- |
| Page background    | `--color-page`          | `bg-page`         | `#f8fafc` (slate-50)|
| Surface            | `--color-surface`       | `bg-surface`      | `#ffffff` (white)   |
| Primary text       | `--color-ink`           | `text-ink`        | `#0f172a` (slate-900)|
| Muted text         | `--color-muted`         | `text-muted`      | `#64748b` (slate-500)|
| Primary accent     | `--color-accent`        | `bg-accent`       | `#059669` (emerald-600)|
| Accent (hover)     | `--color-accent-strong` | `bg-accent-strong`| `#047857` (emerald-700)|
| Border / divider   | `--color-line`          | `border-line`     | `#e2e8f0` (slate-200)|
| Error              | `--color-danger`        | `text-danger`     | `#dc2626` (red-600) |
| Success            | `--color-success`       | `text-success`    | `#16a34a` (green-600)|

### Per-board tones

| Board                | CSS Variable        | Utility       | Value (palette)   |
| -------------------- | ------------------- | ------------- | ----------------- |
| Marketplace Trades   | `--color-trade`     | `text-trade`  | `#eab308` (yellow-500)|
| Emergency Requests   | `--color-emergency` | `text-emergency`| `#ef4444` (red-500)|
| Donations            | `--color-donation`  | `text-donation`| `#22c55e` (green-500)|
| Safe Exchange Points | `--color-location`  | `text-location`| `#0ea5e9` (sky-500)|

## Typography

Default Tailwind system font stack (no custom font loaded in the MVP). Headings
use `font-bold`; body uses normal weight. Sizes follow Tailwind's scale
(`text-sm` for secondary UI, `text-4xl` for page titles).

## Border Radius

| Context           | Class           |
| ----------------- | --------------- |
| Inline / small UI | `rounded-md`    |
| Cards / panels    | `rounded-xl`    |
| Pills / avatars   | `rounded-full`  |
| Modals / overlays | `rounded-xl`    |

## Component Library

No third-party component library. Components are plain React + Tailwind utility
classes. Icons come from `lucide-react` (stroke-based). Shared cross-board UI
primitives live in `frontend/src/components/`.

## Layout Patterns

- **App shell:** `min-h-screen` flex column — sticky top navbar (`bg-surface`,
  bottom `border-line`) over a `flex-1` main that renders the active board via
  `<Outlet/>`.
- **Navbar:** top bar, max width `max-w-7xl`, brand on the left, board links in
  the center (desktop), profile avatar (+ Admin link for admins) on the right.
- **Board page:** centered container (`max-w-7xl`, `px-6`), page header with
  title + primary action, optional filter bar, then a responsive card grid.
- **Modals:** centered overlay on a `bg-slate-950/50` backdrop.

## Migration Status

The token layer above is **defined** and adopted in Area I shared chrome
(app shell, navbar, protected/admin guards, shared pages). The four board
modules (Area II) still use raw palette classes; their owners should migrate
to the semantic tokens within their own `modules/<feature>/` folders.

## Icons

`lucide-react` — stroke-based icons only. Sizes: `h-4 w-4` inline, `h-5 w-5`
for buttons.
