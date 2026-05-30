import { Router } from "express";
import {
  createDonationController,
  deleteDonationController,
  getDonationsController,
  updateDonationController,
} from "./controllers/donations.controller";
import { donationPhotoUpload } from "./middlewares/donations.upload.middleware";
import { requireAuth } from "../../middlewares/require-auth";

export const donationsRouter = Router();

// route shortcut
donationsRouter.get("/", getDonationsController);
donationsRouter.post("/", requireAuth, donationPhotoUpload, createDonationController);
donationsRouter.patch("/:id", requireAuth, donationPhotoUpload, updateDonationController);
donationsRouter.delete("/:id", requireAuth, deleteDonationController);
