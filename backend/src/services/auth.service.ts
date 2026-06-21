import jwt, { SignOptions } from "jsonwebtoken";
import * as authRepository from "../repositories/auth.repository";
import { AuthResult, IUser, SafeUser } from "../types";
import { conflict, unauthorized } from "../utils/AppError";

const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, options);
};

const sanitizeUser = (user: IUser): SafeUser => ({
  _id:      user._id,
  username: user.username,
  email:    user.email,
  phone:    user.phone,
  avatar:   user.avatar,
  createdAt: user.createdAt,
});

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResult> => {
  const existingEmail = await authRepository.findUserByEmail(data.email);
  if (existingEmail) {
    throw conflict("An account with this email already exists.");
  }

  const existingUsername = await authRepository.findUserByUsername(data.username);
  if (existingUsername) {
    throw conflict("This username is already taken.");
  }

  const user = await authRepository.createUser(data);
  const token = generateToken(user._id.toString());
  return { token, user: sanitizeUser(user) };
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResult> => {
  const user = await authRepository.findUserByEmail(data.email);

  if (!user) {
    // Same message for "no such user" and "wrong password" — avoids
    // leaking which one failed (credential enumeration defence).
    throw unauthorized("Invalid email or password.");
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw unauthorized("Invalid email or password.");
  }

  const token = generateToken(user._id.toString());
  return { token, user: sanitizeUser(user) };
};
