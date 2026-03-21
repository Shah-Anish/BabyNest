import express from "express";
import {
  createRecommendation,
  getRecommendations,
  updateRecommendation,
  deleteRecommendation
} from "../controllers/NutritionRecommendationController.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createRecommendation);
router.get("/", protect, getRecommendations);
router.put("/:id", protect, authorize("admin"), updateRecommendation);
router.delete("/:id", protect, authorize("admin"), deleteRecommendation);

export default router;
