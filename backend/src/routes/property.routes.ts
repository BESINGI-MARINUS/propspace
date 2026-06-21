import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { checkOwnership } from "../middleware/ownership.middleware";
import {
  getAllProperties,
  getMyListings,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller";

const router = Router();

// Public
router.get("/", getAllProperties);
router.get("/mine", protect, getMyListings);
router.get("/:id", getPropertyById);

// Protected
router.use(protect);
router.post("/", createProperty);
router.put("/:id", checkOwnership, updateProperty);
router.delete("/:id", checkOwnership, deleteProperty);

export default router;
