import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { badRequest } from "../utils/AppError";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body as {
    username?: string;
    email?: string;
    password?: string;
  };

  if (!username || !email || !password) {
    throw badRequest("Username, email, and password are required.");
  }

  const result = await authService.registerUser({ username, email, password });
  res.status(201).json({ message: "Account created successfully.", ...result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    throw badRequest("Email and password are required.");
  }

  const result = await authService.loginUser({ email, password });
  res.status(200).json({ message: "Login successful.", ...result });
});
