import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller";

const router = Router();

router.use(protect);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/password", changePassword);

export default router;
