import * as userRepository from "../repositories/user.repository";
import { IUser, SafeUser } from "../types";
import { badRequest, notFound, unauthorized } from "../utils/AppError";

export const getProfile = (user: IUser): SafeUser & { updatedAt: Date } => ({
  _id:       user._id,
  username:  user.username,
  email:     user.email,
  phone:     user.phone,
  avatar:    user.avatar,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const updateProfile = async (
  userId: string,
  data: { username?: string; phone?: string; avatar?: string }
): Promise<SafeUser> => {
  const allowedFields: Partial<Pick<IUser, "username" | "phone" | "avatar">> = {};

  if (data.username !== undefined) allowedFields.username = data.username.trim();
  if (data.phone    !== undefined) allowedFields.phone    = data.phone.trim();
  if (data.avatar   !== undefined) allowedFields.avatar   = data.avatar.trim();

  if (Object.keys(allowedFields).length === 0) {
    throw badRequest("No valid fields provided to update.");
  }

  const updated = await userRepository.updateUserProfile(userId, allowedFields);

  if (!updated) {
    throw notFound("User not found.");
  }

  return {
    _id:       updated._id,
    username:  updated.username,
    email:     updated.email,
    phone:     updated.phone,
    avatar:    updated.avatar,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};

export const changePassword = async (
  userId: string,
  data: { oldPassword?: string; newPassword?: string }
): Promise<{ message: string }> => {
  const { oldPassword, newPassword } = data;

  if (!oldPassword || !newPassword) {
    throw badRequest("Old password and new password are required.");
  }

  if (newPassword.length < 6) {
    throw badRequest("New password must be at least 6 characters.");
  }

  const user = await userRepository.findUserByIdWithPassword(userId);

  if (!user) {
    throw notFound("User not found.");
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw unauthorized("Old password is incorrect.");
  }

  user.password = newPassword;
  await userRepository.saveUser(user);

  return { message: "Password updated successfully." };
};
