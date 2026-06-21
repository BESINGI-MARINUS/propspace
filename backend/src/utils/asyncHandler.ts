import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * asyncHandler
 * ─────────────
 * Wraps an async route/middleware function so any rejected promise or
 * thrown error is automatically forwarded to next(error) — Express does
 * NOT do this on its own for async functions.
 *
 * This is what actually enforces "always next(error), never res.json()
 * inline" — it removes the try/catch boilerplate that made it easy to
 * forget the catch block (or to handle the response directly inside it)
 * in the first place.
 *
 * Usage:
 *   router.get("/profile", protect, asyncHandler(userController.getProfile));
 *
 * The generic <T> lets this wrap handlers typed with AuthRequest/OwnerRequest
 * without losing type information, instead of casting through `unknown`.
 */
export const asyncHandler = <T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void> | void
): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };
