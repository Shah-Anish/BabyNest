import express from "express";
import {
  createHealthCheck,
  getHealthChecksByChild,
  updateHealthCheck,
  deleteHealthCheck
} from "../controllers/HealthCheckController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createHealthCheck);
router.get("/child/:childId", protect, getHealthChecksByChild);
router.put("/:id", protect, updateHealthCheck);
router.delete("/:id", protect, deleteHealthCheck);

export default router;
