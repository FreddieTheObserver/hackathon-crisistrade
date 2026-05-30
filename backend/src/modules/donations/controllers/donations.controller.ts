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
import { isAdmin } from "../../../middlewares/require-auth";
import { verifyToken } from "../../auth/services/auth.service";

// Derive the donations service's expected user shape from the session user.
function currentUser(req: Request) {
  const u = req.user!;
  return { id: u.id, name: u.displayName, isAdmin: isAdmin(u) };
}

function currentViewer(req: Request) {
  if (req.user) {
    return currentUser(req);
  }

  const token = req.cookies?.token;
  if (!token) {
    return { id: "", name: "" };
  }

  try {
    const user = verifyToken(token);
    return { id: user.id, name: user.displayName, isAdmin: isAdmin(user) };
  } catch {
    return { id: "", name: "" };
  }
}

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

export async function getDonationsController(req: Request, res: Response) {
  // Public route: a valid session marks matching posts as owned.
  const donations = await listDonations(currentViewer(req));

  res.json({
    data: donations,
  });
}

export async function createDonationController(req: Request, res: Response) {
  // check request body first
  const parsed = createDonationSchema.parse(req.body);
  const donation = await createDonation(
    parsed,
    currentUser(req),
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
    currentUser(req),
    getUploadedPhotoUrl(req.file),
  );

  res.json({
    data: donation,
  });
}

export async function deleteDonationController(req: Request, res: Response) {
  const id = parseDonationId(req.params.id);

  await deleteDonation(id, currentUser(req));

  res.status(204).send();
}
