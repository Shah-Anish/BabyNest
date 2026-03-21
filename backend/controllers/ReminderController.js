import Reminder from "../model/Reminder.js";
import mongoose from "mongoose";

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const { userId, childId, type, message, remindAt } = req.body;

    if (!userId || !type || !message || !remindAt) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId, type, message, and remindAt"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    if (childId && !mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const reminder = await Reminder.create({
      userId,
      childId,
      type,
      message,
      remindAt,
      isSent: false
    });

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      data: reminder
    });
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create reminder",
      error: error.message
    });
  }
};

// Get all reminders for a user
export const getUserReminders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const reminders = await Reminder.find({ userId })
      .populate("childId", "name")
      .sort({ remindAt: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reminders",
      error: error.message
    });
  }
};

// Update reminder (mark as sent/read)
export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder ID format"
      });
    }

    const reminder = await Reminder.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      data: reminder
    });
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update reminder",
      error: error.message
    });
  }
};

// Delete a reminder
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder ID format"
      });
    }

    const reminder = await Reminder.findByIdAndDelete(id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
      data: reminder
    });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete reminder",
      error: error.message
    });
  }
};
