import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import jwt from "jsonwebtoken";
import { AppError } from "./AppError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Our own thrown errors | message is safe to show as-is
  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  // Mongoose validation errors (schema rules: required, minlength, enum...)
  // Collapse all field errors into one readable message.
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({ message: messages.join(" ") });
    return;
  }

  // Mongoose cast errors — usually a malformed ObjectId in a route param
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({ message: `Invalid value for field "${err.path}".` });
    return;
  }

  // MongoDB duplicate key error
  if (isDuplicateKeyError(err)) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? "field";
    res.status(409).json({ message: `This ${field} is already in use.` });
    return;
  }

  // JWT errors that slip through outside the auth middleware
  if (err instanceof jwt.TokenExpiredError) {
    res
      .status(401)
      .json({ message: "Token has expired. Please log in again." });
    return;
  }
  if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ message: "Invalid token. Access denied." });
    return;
  }

  // Anything unexpected: log the real error,
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
};

// MongoDB duplicate-key errors use a fixed error code (11000) when a unique index is violated.
// The `keyPattern` field identifies which field caused the conflict, such as email or username.
interface DuplicateKeyError {
  code: 11000;
  keyPattern?: Record<string, unknown>;
}

// Type guard to detect whether an unknown error is a MongoDB duplicate-key violation.
// This allows the handler to safely read the error metadata and return a clear client message.
const isDuplicateKeyError = (err: unknown): err is DuplicateKeyError =>
  typeof err === "object" &&
  err !== null &&
  (err as { code?: unknown }).code === 11000;
