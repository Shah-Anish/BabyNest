import express from "express";
import { getGrowthAnalytics } from "../controllers/GrowthAnalyticsController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/child/:childId", protect, getGrowthAnalytics);

export default router;
