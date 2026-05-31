export type DonationStatus =
  | "AVAILABLE"
  | "RESERVED_PENDING"
  | "TAKEN_FINISHED"
  | "SUSPENDED"
  | "BANNED";

// SUSPENDED/BANNED are admin-only moderation states; owners only manage the
// normal lifecycle below. Used to gate the status dropdown on the card.
export const DONATION_OWNER_STATUSES: DonationStatus[] = [
  "AVAILABLE",
  "RESERVED_PENDING",
  "TAKEN_FINISHED",
];
export const DONATION_MODERATION_STATUSES: DonationStatus[] = [
  "SUSPENDED",
  "BANNED",
];

export type Donation = {
  id: number;
  title: string;
  item: string;
  quantity: string;
  category: string;
  location: string;
  availableAt: string;
  photoUrl: string | null;
  note: string | null;
  contact: string;
  status: DonationStatus;
  ownerName: string;
  createdAt: string;
  isOwner: boolean;
};

export type DonationFormValues = {
  title: string;
  item: string;
  quantity: string;
  category: string;
  location: string;
  availableAt: string;
  photoFile: File | null;
  note: string;
  contact: string;
};
