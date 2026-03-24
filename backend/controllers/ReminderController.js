import Reminder from "../model/Reminder.js";
import User from "../model/user.js";
import mongoose from "mongoose";
import { sendReminderEmail, sendTestEmail } from "../services/emailService.js";
import { triggerReminderCheck } from "../services/reminderScheduler.js";
import {
  createAdvanceNotifications,
  deleteAdvanceNotifications,
  getUserRemindersWithAdvance,
  updateReminderWithAdvance
} from "../services/advanceNotificationService.js";

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
      isSent: false,
      notificationStage: 'main'
    });

    // Create advance notifications (1 week and 1 day before)
    const advanceResult = await createAdvanceNotifications(reminder);

    res.status(201).json({
      success: true,
      message: "Reminder created successfully with advance notifications",
      data: reminder,
      advanceNotifications: {
        created: advanceResult.count,
        success: advanceResult.success
      }
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
    const { includeAdvance = 'false' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const includeAdvanceNotifications = includeAdvance === 'true';
    const result = await getUserRemindersWithAdvance(userId, includeAdvanceNotifications);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error
      });
    }

    res.status(200).json({
      success: true,
      count: result.count,
      data: result.data,
      grouped: result.grouped
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

    const result = await updateReminderWithAdvance(id, updateData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || result.error
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      data: result.data
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

    const reminder = await Reminder.findById(id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    // Check if this is an advance notification
    if (reminder.isAdvanceNotification) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete advance notifications directly. Delete the main reminder instead."
      });
    }

    // Delete the main reminder
    await Reminder.findByIdAndDelete(id);

    // Delete associated advance notifications
    const advanceDeleteResult = await deleteAdvanceNotifications(id);

    res.status(200).json({
      success: true,
      message: "Reminder and advance notifications deleted successfully",
      data: reminder,
      deletedAdvanceNotifications: advanceDeleteResult.deletedCount
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

// Send test email
export const sendTestEmailController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required"
      });
    }

    const result = await sendTestEmail(email);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Test email sent successfully",
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send test email",
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message
    });
  }
};

// Send reminder email immediately
export const sendReminderEmailController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder ID format"
      });
    }

    const reminder = await Reminder.findById(id).populate('childId', 'name');

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    const user = await User.findById(reminder.userId);

    if (!user || !user.email) {
      return res.status(404).json({
        success: false,
        message: "User not found or no email address"
      });
    }

    const result = await sendReminderEmail(user, reminder);

    if (result.success) {
      // Mark reminder as sent if it wasn't already
      await Reminder.findByIdAndUpdate(id, { isSent: true });

      res.status(200).json({
        success: true,
        message: "Reminder email sent successfully",
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send reminder email",
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error sending reminder email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reminder email",
      error: error.message
    });
  }
};

// Manually trigger reminder check
export const triggerReminderCheckController = async (req, res) => {
  try {
    await triggerReminderCheck();

    res.status(200).json({
      success: true,
      message: "Reminder check triggered successfully"
    });
  } catch (error) {
    console.error("Error triggering reminder check:", error);
    res.status(500).json({
      success: false,
      message: "Failed to trigger reminder check",
      error: error.message
    });
  }
};

// Get advance notifications for a specific reminder
export const getAdvanceNotifications = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder ID format"
      });
    }

    const advanceNotifications = await Reminder.find({
      parentReminderId: id,
      isAdvanceNotification: true
    }).populate('childId', 'name').sort({ remindAt: 1 });

    res.status(200).json({
      success: true,
      count: advanceNotifications.length,
      data: advanceNotifications
    });
  } catch (error) {
    console.error("Error fetching advance notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch advance notifications",
      error: error.message
    });
  }
};

// Get reminder statistics
export const getReminderStatsController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const stats = await Reminder.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            stage: "$notificationStage",
            sent: "$isSent",
            type: "$type"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Process stats
    const summary = {
      total: 0,
      byStage: { main: 0, oneWeek: 0, oneDay: 0 },
      byStatus: { pending: 0, sent: 0 },
      byType: { vaccine: 0, appointment: 0, medication: 0 },
      upcoming: 0
    };

    // Calculate upcoming reminders
    const upcomingCount = await Reminder.countDocuments({
      userId,
      remindAt: { $gt: new Date() },
      isSent: false
    });

    summary.upcoming = upcomingCount;

    stats.forEach(stat => {
      summary.total += stat.count;

      // By stage
      const stage = stat._id.stage === '1_week' ? 'oneWeek'
                  : stat._id.stage === '1_day' ? 'oneDay'
                  : 'main';
      summary.byStage[stage] += stat.count;

      // By status
      const status = stat._id.sent ? 'sent' : 'pending';
      summary.byStatus[status] += stat.count;

      // By type
      if (stat._id.type && summary.byType[stat._id.type] !== undefined) {
        summary.byType[stat._id.type] += stat.count;
      }
    });

    res.status(200).json({
      success: true,
      data: summary,
      raw: stats
    });
  } catch (error) {
    console.error("Error fetching reminder stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reminder statistics",
      error: error.message
    });
  }
};

// Recreate advance notifications for a reminder
export const recreateAdvanceNotifications = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder ID format"
      });
    }

    const reminder = await Reminder.findById(id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    if (reminder.isAdvanceNotification) {
      return res.status(400).json({
        success: false,
        message: "Cannot recreate advance notifications for an advance notification"
      });
    }

    // Delete existing advance notifications
    const deleteResult = await deleteAdvanceNotifications(id);

    // Create new advance notifications
    const createResult = await createAdvanceNotifications(reminder);

    res.status(200).json({
      success: true,
      message: "Advance notifications recreated successfully",
      deleted: deleteResult.deletedCount,
      created: createResult.count
    });
  } catch (error) {
    console.error("Error recreating advance notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to recreate advance notifications",
      error: error.message
    });
  }
};
