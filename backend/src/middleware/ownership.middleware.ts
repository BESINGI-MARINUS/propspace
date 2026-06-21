import Property from "../models/property.model";
import { AuthRequest, OwnerRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { forbidden, notFound } from "../utils/AppError";

/**
 * checkOwnership
 * ───────────────
 * Confirms the authenticated user owns the requested property.
 * Must run after the protect middleware.
 * Attaches req.property so the controller doesn't re-query the DB.
 */
export const checkOwnership = asyncHandler<AuthRequest>(
  async (req, _res, next) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
      throw notFound("Property not found.");
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      throw forbidden("Forbidden. You are not the owner of this listing.");
    }

    (req as OwnerRequest).property = property;
    next();
  },
);
