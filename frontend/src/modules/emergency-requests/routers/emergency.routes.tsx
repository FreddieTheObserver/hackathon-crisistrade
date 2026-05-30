import type { RouteObject } from "react-router-dom";
import EmergencyPage from "../pages/EmergencyPage";

export const emergencyRoutes: RouteObject[] = [
  {
    path: "requests",
    element: <EmergencyPage />,
  },
];
