import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { unauthorized } from "../utils/AppError";

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler<AuthRequest>(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw unauthorized("No token provided. Access denied.");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as JwtPayload;

  const user = await User.findById(decoded.id);
  if (!user) {
    throw unauthorized("User belonging to this token no longer exists.");
  }

  req.user = user;
  next();
});
