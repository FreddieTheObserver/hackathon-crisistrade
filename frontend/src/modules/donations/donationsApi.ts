import api from "../../api";
import type {
  Donation,
  DonationFormValues,
  DonationStatus,
} from "./donationsTypes";

type DonationResponse = {
  data: Donation;
};

type DonationsResponse = {
  data: Donation[];
};

// point uploaded image paths at the API host
function resolvePhotoUrl(photoUrl: string | null) {
  if (!photoUrl || /^https?:\/\//i.test(photoUrl) || photoUrl.startsWith("data:")) {
    return photoUrl;
  }

  const apiBaseUrl = api.defaults.baseURL;

  if (!apiBaseUrl) {
    return photoUrl;
  }

  return new URL(photoUrl, apiBaseUrl).toString();
}

// make API results ready for rendering
function normalizeDonation(donation: Donation): Donation {
  return {
    ...donation,
    photoUrl: resolvePhotoUrl(donation.photoUrl),
  };
}

// send fields and optional image in one request
function toDonationFormData(
  values: Partial<DonationFormValues> & { status?: DonationStatus },
) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (key === "photoFile") {
      if (value instanceof File) {
        formData.append("photo", value);
      }
      return;
    }

    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
}

export async function getDonations() {
  const response = await api.get<DonationsResponse>("/donations");
  return response.data.data.map(normalizeDonation);
}

export async function createDonation(values: DonationFormValues) {
  const response = await api.post<DonationResponse>(
    "/donations",
    toDonationFormData(values),
  );

  return normalizeDonation(response.data.data);
}

export async function updateDonation(
  id: number,
  values: Partial<DonationFormValues> & { status?: DonationStatus },
) {
  const response = await api.patch<DonationResponse>(
    `/donations/${id}`,
    toDonationFormData(values),
  );

  return normalizeDonation(response.data.data);
}

export async function deleteDonation(id: number) {
  await api.delete(`/donations/${id}`);
}
