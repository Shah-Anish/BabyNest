import express from "express";
import {
  addGrowthRecord,
  getGrowthRecordsByChild,
  updateGrowthRecord,
  deleteGrowthRecord
} from "../controllers/GrowthRecordController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, addGrowthRecord);
router.get("/child/:childId", protect, getGrowthRecordsByChild);
router.put("/:id", protect, updateGrowthRecord);
router.delete("/:id", protect, deleteGrowthRecord);

export default router;
