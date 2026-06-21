import api from "./client";
import type { User } from "../types";

export const getProfileApi = () =>
  api.get<{ user: User }>("/users/profile").then((r) => r.data);

export const updateProfileApi = (data: Partial<Pick<User, "username" | "phone" | "avatar">>) =>
  api.put<{ message: string; user: User }>("/users/profile", data).then((r) => r.data);

export const changePasswordApi = (data: { oldPassword: string; newPassword: string }) =>
  api.put<{ message: string }>("/users/password", data).then((r) => r.data);
