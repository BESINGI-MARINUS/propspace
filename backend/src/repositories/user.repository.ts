import User from "../models/user.model";
import { IUser } from "../types";

export const findUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

export const findUserByIdWithPassword = async (id: string): Promise<IUser | null> => {
  return User.findById(id).select("+password");
};

export const updateUserProfile = async (
  id: string,
  updates: Partial<Pick<IUser, "username" | "phone" | "avatar">>
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
};

export const saveUser = async (user: IUser): Promise<IUser> => {
  return user.save();
};
