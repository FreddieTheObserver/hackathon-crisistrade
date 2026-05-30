import { Router } from "express";
import {
  getEmergencies,
  patchEmergency,
  patchEmergencyHelped,
  postEmergency,
  removeEmergency,
} from "../controllers/emergency.controller";

const emergencyRouter = Router();

emergencyRouter.get("/", getEmergencies);
emergencyRouter.post("/", postEmergency);
emergencyRouter.patch("/:id", patchEmergency);
emergencyRouter.patch("/:id/helped", patchEmergencyHelped);
emergencyRouter.delete("/:id", removeEmergency);

export default emergencyRouter;
