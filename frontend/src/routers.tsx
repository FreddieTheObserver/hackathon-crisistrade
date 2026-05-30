import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { exchangeRoutes } from "./modules/exchange/exchange.routes";

/**
 * Root browser router — Area I (coordinate before editing).
 *
 * Each board registers its routes as children of "/".
 * Keep route ownership inside your own module (architecture / code-standards).
 * Frontend paths mirror the backend prefixes agreed in README.md.
 *
 * Convention — when you scaffold your module, add exactly two things:
 *   1. an import at the top of this file:
 *        import { <feature>Routes } from "./modules/<feature>/<feature>.routes";
 *   2. spread your routes into the children array, inside the marked block:
 *        ...<feature>Routes,
 *
 * Each module exports a `RouteObject[]` (e.g. export const donationsRoutes:
 * RouteObject[] = [{ path: "donations", element: <DonationsPage /> }, ...]).
 *
 * Keep the four spreads in the fixed order below so diffs/merges stay clean.
 * Touch only your own line; do not reformat the others.
 */

const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/exchange-points" replace /> },
      // ── Board routes ──────────────────────────────────────────
      // Marketplace Trades  (owner: La Yaung Phyo)                  path: /trades
      // ...marketplaceTradesRoutes,

      // Donations  (owner: Eaint Myat Noe)                          path: /donations
      // ...donationsRoutes,

      // Emergency Requests  (owner: Felice Christiara Median Putri)  path: /requests
      // ...emergencyRequestsRoutes,

      // Safe Exchange Points  (owner: Saw Thet Wai Yan)             path: /exchange-points
      ...exchangeRoutes,
      // ──────────────────────────────────────────────────────────
    ],
  },
]);

export default mainRouter;
