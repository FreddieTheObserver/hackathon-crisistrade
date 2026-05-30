export type ExchangePointRecord = {
  id: string;
  placeName: string;
  area: string;
  openTime: string;
  notes: string;
  contactNotes: string;
  userId: string;
  ownerName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExchangePointResponse = {
  id: string;
  placeName: string;
  area: string;
  openTime: string;
  notes: string;
  contactNotes: string;
  userId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
};

export type ExchangePointWhere = {
  area?: { contains: string };
  OR?: Array<{
    placeName?: { contains: string };
    area?: { contains: string };
    openTime?: { contains: string };
    notes?: { contains: string };
    contactNotes?: { contains: string };
  }>;
};