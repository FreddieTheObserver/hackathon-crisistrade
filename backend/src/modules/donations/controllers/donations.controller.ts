import type { Request, Response } from "express";
import {
  createDonationSchema,
  updateDonationSchema,
} from "../schemas/donations.schema";
import {
  createDonation,
  deleteDonation,
  listDonations,
  updateDonation,
} from "../services/donations.service";

const CURRENT_USER = {
  id: "current-user",
  name: "AK",
};

// error with status code
class DonationControllerError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// turn route id into a number
function parseDonationId(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    throw new DonationControllerError(400, "Invalid donation id");
  }

  const id = Number(value);

  if (!Number.isInteger(id)) {
    throw new DonationControllerError(400, "Invalid donation id");
  }

  return id;
}

// save public upload path
function getUploadedPhotoUrl(file: Express.Multer.File | undefined) {
  return file ? `/uploads/donations/${file.filename}` : null;
}

export async function getDonationsController(_req: Request, res: Response) {
  const donations = await listDonations(CURRENT_USER);

  res.json({
    data: donations,
  });
}

export async function createDonationController(req: Request, res: Response) {
  // check request body first
  const parsed = createDonationSchema.parse(req.body);
  const donation = await createDonation(
    parsed,
    CURRENT_USER,
    getUploadedPhotoUrl(req.file),
  );

  res.status(201).json({
    data: donation,
  });
}

export async function updateDonationController(req: Request, res: Response) {
  const id = parseDonationId(req.params.id);
  // patch can send only changed fields
  const parsed = updateDonationSchema.parse(req.body);
  const donation = await updateDonation(
    id,
    parsed,
    CURRENT_USER,
    getUploadedPhotoUrl(req.file),
  );

  res.json({
    data: donation,
  });
}

export async function deleteDonationController(req: Request, res: Response) {
  const id = parseDonationId(req.params.id);

  await deleteDonation(id, CURRENT_USER);

  res.status(204).send();
}
