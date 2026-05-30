import type { RouteObject } from "react-router-dom";
import ExchangeLocationsPage from "./pages/ExchangeLocationsPage";
import AdminDashboardPage from "./admin/AdminDashboardPage";
import AdminIntegrationPage from "./admin/AdminIntegrationPage";
import AdminOverviewPage from "./admin/AdminOverviewPage";

export const exchangeRoutes: RouteObject[] = [
  {
    path: "exchange-points",
    element: <ExchangeLocationsPage />,
  },
  {
    path: "admin",
    element: <AdminDashboardPage />,
  },
  {
    path: "admin/overview",
    element: <AdminOverviewPage />,
  },
  {
    path: "admin/integration-needed",
    element: <AdminIntegrationPage />,
  },
];
