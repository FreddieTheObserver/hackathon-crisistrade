import type { RouteObject } from "react-router-dom";
import ExchangeLocationsPage from "./pages/ExchangeLocationsPage";
import AdminDashboardPage from "./admin/AdminDashboardPage";
import AdminIntegrationPage from "./admin/AdminIntegrationPage";
import AdminOverviewPage from "./admin/AdminOverviewPage";
import RequireAdmin from "../../middlewares/RequireAdmin";

export const exchangeRoutes: RouteObject[] = [
  {
    path: "exchange-points",
    element: <ExchangeLocationsPage />,
  },
  {
    path: "admin",
    element: (
      <RequireAdmin>
        <AdminDashboardPage />
      </RequireAdmin>
    ),
  },
  {
    path: "admin/overview",
    element: (
      <RequireAdmin>
        <AdminOverviewPage />
      </RequireAdmin>
    ),
  },
  {
    path: "admin/integration-needed",
    element: (
      <RequireAdmin>
        <AdminIntegrationPage />
      </RequireAdmin>
    ),
  },
];
