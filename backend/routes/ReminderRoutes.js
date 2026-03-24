import express from "express";
import {
  createReminder,
  getUserReminders,
  updateReminder,
  deleteReminder,
  sendTestEmailController,
  sendReminderEmailController,
  triggerReminderCheckController,
  getAdvanceNotifications,
  getReminderStatsController,
  recreateAdvanceNotifications
} from "../controllers/ReminderController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createReminder);
router.get("/user/:userId", protect, getUserReminders);
router.put("/:id", protect, updateReminder);
router.delete("/:id", protect, deleteReminder);

// Email-related routes
router.post("/test-email", protect, sendTestEmailController);
router.post("/:id/send-email", protect, sendReminderEmailController);
router.post("/trigger-check", protect, triggerReminderCheckController);

// Advance notification routes
router.get("/:id/advance-notifications", protect, getAdvanceNotifications);
router.get("/user/:userId/stats", protect, getReminderStatsController);
router.post("/:id/recreate-advance", protect, recreateAdvanceNotifications);

export default router;
