import api from "./client";
import type {
  PropertiesResponse,
  PropertyResponse,
  PropertyPayload,
  PropertyFilters,
} from "../types";

export const getPropertiesApi = (filters?: PropertyFilters) =>
  api
    .get<PropertiesResponse>("/properties", { params: filters })
    .then((r) => r.data);

export const getMyPropertiesApi = () =>
  api.get<PropertiesResponse>("/properties/mine").then((r) => r.data);

export const getPropertyApi = (id: string) =>
  api.get<PropertyResponse>(`/properties/${id}`).then((r) => r.data);

export const createPropertyApi = (data: PropertyPayload) =>
  api.post<PropertyResponse>("/properties", data).then((r) => r.data);

export const updatePropertyApi = (id: string, data: Partial<PropertyPayload>) =>
  api.put<PropertyResponse>(`/properties/${id}`, data).then((r) => r.data);

export const deletePropertyApi = (id: string) =>
  api.delete<{ message: string }>(`/properties/${id}`).then((r) => r.data);
