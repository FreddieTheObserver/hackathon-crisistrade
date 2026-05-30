export type EmergencyUrgency = "Urgent" | "Medium" | "Low";

export type EmergencyStatus = "Open" | "Helped";

export type EmergencyPost = {
  contact: string;
  id: string;
  isOwner?: boolean;
  location: string;
  need: string;
  note: string;
  photoUrl?: string;
  status: EmergencyStatus;
  title: string;
  urgency: EmergencyUrgency;
};
