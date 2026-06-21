import api from "./client";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types";

export const registerApi = (data: RegisterPayload) =>
  api.post<AuthResponse>("/auth/register", data).then((r) => r.data);

export const loginApi = (data: LoginPayload) =>
  api.post<AuthResponse>("/auth/login", data).then((r) => r.data);
