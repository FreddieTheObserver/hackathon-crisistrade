import type { RouteObject } from "react-router-dom";
import EmergencyRequestsPage from "../pages/EmergencyRequestsPage";

export const emergencyRequestsRoutes: RouteObject[] = [
  {
    path: "requests",
    element: <EmergencyRequestsPage />,
  },
];
