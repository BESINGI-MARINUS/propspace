import * as userService from "../services/user.service";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";

export const getProfile = asyncHandler<AuthRequest>(async (req, res) => {
  const profile = userService.getProfile(req.user);
  res.status(200).json({ user: profile });
});

export const updateProfile = asyncHandler<AuthRequest>(async (req, res) => {
  const updated = await userService.updateProfile(
    req.user._id.toString(),
    req.body,
  );
  res.status(200).json({ message: "Profile updated.", user: updated });
});

export const changePassword = asyncHandler<AuthRequest>(async (req, res) => {
  const result = await userService.changePassword(
    req.user._id.toString(),
    req.body,
  );
  res.status(200).json(result);
});
