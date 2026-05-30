import { Router } from "express";
import { prisma } from "../../db";
import { createDonationSchema, updateDonationSchema } from "./donations.schema";

export const donationsRouter = Router();

const CURRENT_USER = {
  id: "current-user",
  name: "AK",
};

donationsRouter.get("/", async (_req, res, next) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      data: donations.map((donation) => ({
        ...donation,
        isOwner: donation.ownerId === CURRENT_USER.id,
      })),
    });
  } catch (error) {
    next(error);
  }
});

donationsRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createDonationSchema.parse(req.body);

    const donation = await prisma.donation.create({
      data: {
        ...parsed,
        photoUrl: parsed.photoUrl || null,
        ownerId: CURRENT_USER.id,
        ownerName: CURRENT_USER.name,
      },
    });

    res.status(201).json({
      data: {
        ...donation,
        isOwner: true,
      },
    });
  } catch (error) {
    next(error);
  }
});

donationsRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "Invalid donation id" });
      return;
    }

    const existingDonation = await prisma.donation.findUnique({
      where: { id },
    });

    if (!existingDonation) {
      res.status(404).json({ message: "Donation not found" });
      return;
    }

    if (existingDonation.ownerId !== CURRENT_USER.id) {
      res.status(403).json({
        message: "You can only update your own donation posts",
      });
      return;
    }

    const parsed = updateDonationSchema.parse(req.body);

    const donation = await prisma.donation.update({
      where: { id },
      data: {
        ...parsed,
        photoUrl: parsed.photoUrl === "" ? null : parsed.photoUrl,
      },
    });

    res.json({
      data: {
        ...donation,
        isOwner: true,
      },
    });
  } catch (error) {
    next(error);
  }
});

donationsRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "Invalid donation id" });
      return;
    }

    const existingDonation = await prisma.donation.findUnique({
      where: { id },
    });

    if (!existingDonation) {
      res.status(404).json({ message: "Donation not found" });
      return;
    }

    if (existingDonation.ownerId !== CURRENT_USER.id) {
      res.status(403).json({
        message: "You can only delete your own donation posts",
      });
      return;
    }

    await prisma.donation.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});