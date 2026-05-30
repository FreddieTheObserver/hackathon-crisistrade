import { Router } from "express";
import {
  getEmergencies,
  patchEmergency,
  patchEmergencyHelped,
  postEmergency,
  removeEmergency,
} from "../controllers/emergency.controller";
import { requireAuth } from "../../../middlewares/require-auth";

const emergencyRouter = Router();

emergencyRouter.get("/", getEmergencies);
emergencyRouter.post("/", requireAuth, postEmergency);
emergencyRouter.patch("/:id", requireAuth, patchEmergency);
emergencyRouter.patch("/:id/helped", requireAuth, patchEmergencyHelped);
emergencyRouter.delete("/:id", requireAuth, removeEmergency);

export default emergencyRouter;
