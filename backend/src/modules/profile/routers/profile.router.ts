import { Router } from "express";

import { requireAuth } from "../../../middlewares/require-auth";
import { getMyProfile, patchMyProfile } from "../controllers/profile.controller";

const profileRouter = Router();

profileRouter.get("/me", requireAuth, getMyProfile);
profileRouter.patch("/me", requireAuth, patchMyProfile);

export default profileRouter;
