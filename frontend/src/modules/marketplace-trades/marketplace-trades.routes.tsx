import type { RouteObject } from "react-router-dom";
import { TradesPage } from "./pages/TradesPage";

// Registered as children of "/" in frontend/src/routers.tsx (Area I).
export const marketplaceTradesRoutes: RouteObject[] = [
  { path: "trades", element: <TradesPage /> },
];
