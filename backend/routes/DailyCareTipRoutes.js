import express from "express";
import {
  createTip,
  getTips,
  updateTip,
  deleteTip
} from "../controllers/DailyCareTipController.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createTip);
router.get("/", protect, getTips);
router.put("/:id", protect, authorize("admin"), updateTip);
router.delete("/:id", protect, authorize("admin"), deleteTip);

export default router;
