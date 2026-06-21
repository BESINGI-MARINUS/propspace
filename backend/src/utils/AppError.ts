export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.isOperational = true;

    // Maintains a proper stack trace (excluding the constructor call) in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

// Convenience factories for the most common cases
// These read better at call sites than `new AppError("...", 404)` everywhere.

export const badRequest = (message: string) => new AppError(message, 400);
export const unauthorized = (message: string) => new AppError(message, 401);
export const forbidden = (message: string) => new AppError(message, 403);
export const notFound = (message: string) => new AppError(message, 404);
export const conflict = (message: string) => new AppError(message, 409);
