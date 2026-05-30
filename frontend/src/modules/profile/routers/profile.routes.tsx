import type { RouteObject } from "react-router-dom";

import { ProfilePage } from "../pages/ProfilePage";

export const profileRoutes: RouteObject[] = [
  {
    path: "/profile",
    element: <ProfilePage />,
  },
];
