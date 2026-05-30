import { Router } from "express";
import { donationsRouter } from "./modules/donations/donations.routers";

const mainRouter = Router();

mainRouter.use("/donations", donationsRouter);

/**
 * Shared router — Area I (coordinate before editing).
 *
 * Each board mounts its own Express Router under a distinct prefix.
 * No two boards share a prefix (architecture invariant 6).
 * Prefixes match the "Planned route prefixes" agreed in README.md.
 *
 * Convention — when you scaffold your module, add exactly two lines:
 *   1. an import at the top of this file:
 *        import <feature>Router from "./modules/<feature>/<feature>.router";
 *   2. a mount below, inside the marked block:
 *        mainRouter.use("/<prefix>", <feature>Router);
 *
 * Keep the four mounts in the fixed order below so diffs/merges stay clean.
 * Touch only your own line; do not reformat the others.
 */

// ── Board mounts ────────────────────────────────────────────────
// Marketplace Trades  (owner: La Yaung Phyo)                  prefix: /trades
import marketplaceTradesRouter from "./modules/marketplace-trades/marketplace-trades.router";
mainRouter.use("/trades", marketplaceTradesRouter);

// Donations  (owner: Eaint Myat Noe)                          prefix: /donations
// import donationsRouter from "./modules/donations/donations.router";
// mainRouter.use("/donations", donationsRouter);

// Emergency Requests  (owner: Felice Christiara Median Putri)  prefix: /requests
// import emergencyRequestsRouter from "./modules/emergency-requests/emergency-requests.router";
// mainRouter.use("/requests", emergencyRequestsRouter);

// Safe Exchange Points  (owner: Saw Thet Wai Yan)             prefix: /exchange-points
// import exchangePointsRouter from "./modules/exchange-points/exchange-points.router";
// mainRouter.use("/exchange-points", exchangePointsRouter);
// ────────────────────────────────────────────────────────────────

export default mainRouter;
