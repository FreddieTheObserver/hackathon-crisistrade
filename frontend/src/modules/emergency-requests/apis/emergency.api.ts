import api from "../../../api";
import {
  emergencyListResponseSchema,
  emergencyResponseSchema,
} from "../schemas/emergency.schema";
import type { EmergencyFormPayload, EmergencyStatus } from "../types/emergency.type";

export const getEmergencies = async () => {
  const response = await api.get("/requests");
  return emergencyListResponseSchema.parse(response.data).emergencies;
};

export const createEmergency = async (payload: EmergencyFormPayload) => {
  const response = await api.post("/requests", payload);
  return emergencyResponseSchema.parse(response.data).emergency;
};

export const updateEmergency = async (
  id: string,
  payload: Partial<EmergencyFormPayload> & { status?: EmergencyStatus },
) => {
  const response = await api.patch(`/requests/${id}`, payload);
  return emergencyResponseSchema.parse(response.data).emergency;
};

export const markEmergencyHelped = async (id: string) => {
  const response = await api.patch(`/requests/${id}/helped`);
  return emergencyResponseSchema.parse(response.data).emergency;
};

export const deleteEmergency = async (id: string) => {
  await api.delete(`/requests/${id}`);
};
