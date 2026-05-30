export interface ExchangePoint {
  id: string;
  placeName: string;
  area: string;
  openTime: string;
  notes: string;
  contactNotes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExchangePointFormValues {
  placeName: string;
  area: string;
  openTimeStart: string;
  openTimeStartMeridiem: "AM" | "PM";
  openTimeEnd: string;
  openTimeEndMeridiem: "AM" | "PM";
  notes: string;
  contactNotes: string;
}

export interface ExchangePointPayload {
  placeName: string;
  area: string;
  openTime: string;
  notes: string;
  contactNotes: string;
}
