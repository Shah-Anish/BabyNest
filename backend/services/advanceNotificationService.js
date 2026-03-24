import Reminder from '../model/Reminder.js';

/**
 * Create advance notification reminders (1 week and 1 day before)
 * @param {Object} mainReminder - The main reminder object
 * @returns {Object} Result with created advance reminders
 */
export const createAdvanceNotifications = async (mainReminder) => {
  try {
    const mainReminderDate = new Date(mainReminder.remindAt);
    const advanceReminders = [];

    // Calculate notification dates
    const oneWeekBefore = new Date(mainReminderDate);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

    const oneDayBefore = new Date(mainReminderDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

    const now = new Date();

    // Create 1 week advance notification (only if it's in the future)
    if (oneWeekBefore > now) {
      const weeklyReminder = await Reminder.create({
        userId: mainReminder.userId,
        childId: mainReminder.childId,
        type: mainReminder.type,
        message: generateAdvanceMessage(mainReminder.message, '1 week'),
        remindAt: oneWeekBefore,
        isAdvanceNotification: true,
        notificationStage: '1_week',
        parentReminderId: mainReminder._id,
        originalRemindAt: mainReminder.remindAt,
        isSent: false
      });

      advanceReminders.push(weeklyReminder);
      console.log(`✓ Created 1-week advance notification for reminder ${mainReminder._id}`);
    }

    // Create 1 day advance notification (only if it's in the future)
    if (oneDayBefore > now) {
      const dailyReminder = await Reminder.create({
        userId: mainReminder.userId,
        childId: mainReminder.childId,
        type: mainReminder.type,
        message: generateAdvanceMessage(mainReminder.message, '1 day'),
        remindAt: oneDayBefore,
        isAdvanceNotification: true,
        notificationStage: '1_day',
        parentReminderId: mainReminder._id,
        originalRemindAt: mainReminder.remindAt,
        isSent: false
      });

      advanceReminders.push(dailyReminder);
      console.log(`✓ Created 1-day advance notification for reminder ${mainReminder._id}`);
    }

    return {
      success: true,
      count: advanceReminders.length,
      advanceReminders
    };

  } catch (error) {
    console.error('Error creating advance notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate advance notification message
 * @param {string} originalMessage - Original reminder message
 * @param {string} timeframe - Time before main reminder ('1 week' or '1 day')
 * @returns {string} Enhanced message for advance notification
 */
const generateAdvanceMessage = (originalMessage, timeframe) => {
  const prefix = timeframe === '1 week'
    ? '🗓️ Reminder: Coming up next week - '
    : '⏰ Reminder: Tomorrow - ';

  return `${prefix}${originalMessage}`;
};

/**
 * Delete advance notifications when main reminder is deleted
 * @param {string} mainReminderId - ID of the main reminder
 * @returns {Object} Result of deletion
 */
export const deleteAdvanceNotifications = async (mainReminderId) => {
  try {
    const result = await Reminder.deleteMany({
      parentReminderId: mainReminderId,
      isAdvanceNotification: true
    });

    console.log(`✓ Deleted ${result.deletedCount} advance notifications for reminder ${mainReminderId}`);

    return {
      success: true,
      deletedCount: result.deletedCount
    };

  } catch (error) {
    console.error('Error deleting advance notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get all reminders for a user (including advance notifications)
 * @param {string} userId - User ID
 * @param {boolean} includeAdvance - Whether to include advance notifications
 * @returns {Object} Reminders grouped by type
 */
export const getUserRemindersWithAdvance = async (userId, includeAdvance = false) => {
  try {
    const filter = { userId };

    if (!includeAdvance) {
      filter.isAdvanceNotification = { $ne: true };
    }

    const reminders = await Reminder.find(filter)
      .populate('childId', 'name')
      .populate('parentReminderId', 'message type')
      .sort({ remindAt: 1 });

    // Group reminders
    const grouped = {
      main: reminders.filter(r => !r.isAdvanceNotification),
      advance: reminders.filter(r => r.isAdvanceNotification),
      upcoming: reminders.filter(r => r.remindAt > new Date()),
      past: reminders.filter(r => r.remindAt <= new Date())
    };

    return {
      success: true,
      data: includeAdvance ? reminders : grouped.main,
      grouped,
      count: reminders.length
    };

  } catch (error) {
    console.error('Error fetching user reminders:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update main reminder and its advance notifications
 * @param {string} reminderId - Main reminder ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Result of update
 */
export const updateReminderWithAdvance = async (reminderId, updateData) => {
  try {
    const mainReminder = await Reminder.findById(reminderId);

    if (!mainReminder) {
      return { success: false, message: 'Reminder not found' };
    }

    // Don't allow updating advance notifications directly
    if (mainReminder.isAdvanceNotification) {
      return {
        success: false,
        message: 'Cannot update advance notifications directly. Update the main reminder instead.'
      };
    }

    // Update main reminder
    const updatedReminder = await Reminder.findByIdAndUpdate(
      reminderId,
      updateData,
      { new: true, runValidators: true }
    );

    // If reminder date changed, recreate advance notifications
    if (updateData.remindAt) {
      // Delete existing advance notifications
      await deleteAdvanceNotifications(reminderId);

      // Create new advance notifications
      await createAdvanceNotifications(updatedReminder);
    }

    return {
      success: true,
      data: updatedReminder
    };

  } catch (error) {
    console.error('Error updating reminder with advance notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};