import express from "express";
import {
  getSettings,
  updateSettings
} from "../controllers/SettingsController.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getSettings);
router.put("/", protect, authorize("admin"), updateSettings);

export default router;
