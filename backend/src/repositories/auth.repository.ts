import User from "../models/user.model";
import { IUser } from "../types";

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email }).select("+password");
};

export const findUserByUsername = async (username: string): Promise<IUser | null> => {
  return User.findOne({ username });
};

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const user = new User(data);
  return user.save();
};
