export type EmergencyUrgency = "Urgent" | "Medium" | "Low";

export type EmergencyStatus = "Open" | "Helped" | "Suspended" | "Banned";

export type EmergencyPost = {
  contact: string;
  createdAt: string;
  id: string;
  isOwner?: boolean;
  location: string;
  need: string;
  note: string;
  ownerName: string;
  photoUrl?: string;
  status: EmergencyStatus;
  title: string;
  updatedAt: string;
  urgency: EmergencyUrgency;
};

export type EmergencyFormPayload = {
  contact: string;
  isOwner?: boolean;
  location: string;
  need: string;
  note: string;
  photoUrl?: string;
  title: string;
  urgency: EmergencyUrgency;
};
