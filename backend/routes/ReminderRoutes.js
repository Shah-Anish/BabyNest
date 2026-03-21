import express from "express";
import {
  createReminder,
  getUserReminders,
  updateReminder,
  deleteReminder
} from "../controllers/ReminderController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createReminder);
router.get("/user/:userId", protect, getUserReminders);
router.put("/:id", protect, updateReminder);
router.delete("/:id", protect, deleteReminder);

export default router;
