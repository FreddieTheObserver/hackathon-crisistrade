import { Router } from "express";
import {
  createDonationController,
  deleteDonationController,
  getDonationsController,
  updateDonationController,
} from "./controllers/donations.controller";
import { donationPhotoUpload } from "./middlewares/donations.upload.middleware";

export const donationsRouter = Router();

// route shortcut
donationsRouter.get("/", getDonationsController);
donationsRouter.post("/", donationPhotoUpload, createDonationController);
donationsRouter.patch("/:id", donationPhotoUpload, updateDonationController);
donationsRouter.delete("/:id", deleteDonationController);
