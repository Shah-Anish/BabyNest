import cron from 'node-cron';
import Reminder from '../model/Reminder.js';
import User from '../model/user.js';
import { sendReminderEmail } from './emailService.js';

/**
 * Check for due reminders and send emails (including advance notifications)
 */
const checkAndSendReminders = async () => {
  try {
    const now = new Date();

    // Find all reminders that are due and not sent yet (including advance notifications)
    const dueReminders = await Reminder.find({
      remindAt: { $lte: now },
      isSent: false
    }).populate('childId', 'name').populate('parentReminderId', 'message type');

    console.log(`Found ${dueReminders.length} due reminder(s) to send`);

    if (dueReminders.length === 0) {
      return;
    }

    // Group reminders by stage for better logging
    const grouped = {
      main: dueReminders.filter(r => r.notificationStage === 'main'),
      oneWeek: dueReminders.filter(r => r.notificationStage === '1_week'),
      oneDay: dueReminders.filter(r => r.notificationStage === '1_day')
    };

    console.log(`📊 Breakdown: ${grouped.main.length} main, ${grouped.oneWeek.length} 1-week advance, ${grouped.oneDay.length} 1-day advance reminders`);

    for (const reminder of dueReminders) {
      try {
        // Get user details
        const user = await User.findById(reminder.userId);

        if (!user || !user.email) {
          console.log(`⚠️  Skipping reminder ${reminder._id}: User not found or no email`);
          continue;
        }

        // Log the type of notification being sent
        const stageText = {
          'main': 'FINAL',
          '1_week': '1 WEEK ADVANCE',
          '1_day': '1 DAY ADVANCE'
        }[reminder.notificationStage] || 'UNKNOWN';

        console.log(`📧 Sending ${stageText} reminder email to ${user.email} for ${reminder.type}`);

        // Send email
        const result = await sendReminderEmail(user, reminder);

        if (result.success) {
          // Mark reminder as sent
          await Reminder.findByIdAndUpdate(reminder._id, {
            isSent: true,
            sentAt: new Date()
          });

          console.log(`✅ ${stageText} reminder sent successfully to ${user.email}`);

          // Log additional info for advance notifications
          if (reminder.isAdvanceNotification) {
            const originalDate = new Date(reminder.originalRemindAt || reminder.remindAt);
            console.log(`   └─ Original reminder date: ${originalDate.toLocaleDateString('en-NP')}`);
          }

        } else {
          console.error(`❌ Failed to send ${stageText} reminder to ${user.email}:`, result.error);
        }

      } catch (error) {
        console.error(`💥 Error processing reminder ${reminder._id}:`, error);
      }
    }

    // Summary log
    const sentCount = await Reminder.countDocuments({
      _id: { $in: dueReminders.map(r => r._id) },
      isSent: true
    });

    console.log(`📈 Summary: ${sentCount}/${dueReminders.length} reminders sent successfully`);

  } catch (error) {
    console.error('💥 Error in checkAndSendReminders:', error);
  }
};

/**
 * Get reminder statistics
 */
const getReminderStats = async () => {
  try {
    const stats = await Reminder.aggregate([
      {
        $group: {
          _id: { stage: "$notificationStage", sent: "$isSent" },
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = {
      total: 0,
      pending: { main: 0, oneWeek: 0, oneDay: 0 },
      sent: { main: 0, oneWeek: 0, oneDay: 0 }
    };

    stats.forEach(stat => {
      summary.total += stat.count;

      const stage = stat._id.stage === '1_week' ? 'oneWeek'
                  : stat._id.stage === '1_day' ? 'oneDay'
                  : 'main';

      const status = stat._id.sent ? 'sent' : 'pending';
      summary[status][stage] += stat.count;
    });

    return summary;
  } catch (error) {
    console.error('Error getting reminder stats:', error);
    return null;
  }
};

/**
 * Start reminder scheduler
 * Runs every minute to check for due reminders
 */
export const startReminderScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    console.log('\n🔄 Running reminder check...');
    await checkAndSendReminders();

    // Log stats every 10 minutes (when minute ends in 0)
    const currentMinute = new Date().getMinutes();
    if (currentMinute % 10 === 0) {
      const stats = await getReminderStats();
      if (stats) {
        console.log('📊 Reminder Statistics:');
        console.log(`   Total: ${stats.total} | Pending: ${stats.pending.main + stats.pending.oneWeek + stats.pending.oneDay} | Sent: ${stats.sent.main + stats.sent.oneWeek + stats.sent.oneDay}`);
        console.log(`   Main: ${stats.pending.main}/${stats.sent.main} | 1-Week: ${stats.pending.oneWeek}/${stats.sent.oneWeek} | 1-Day: ${stats.pending.oneDay}/${stats.sent.oneDay}`);
      }
    }
  });

  console.log('✅ Reminder scheduler started - checking every minute');
  console.log('📧 Multi-stage notifications enabled: 1 week → 1 day → final reminder');
};

/**
 * Manually trigger reminder check (for testing)
 */
export const triggerReminderCheck = async () => {
  console.log('🔄 Manually triggering reminder check...');
  await checkAndSendReminders();

  const stats = await getReminderStats();
  if (stats) {
    console.log('\n📊 Current Reminder Statistics:');
    console.log(`Total Reminders: ${stats.total}`);
    console.log(`Pending: Main(${stats.pending.main}) | 1-Week(${stats.pending.oneWeek}) | 1-Day(${stats.pending.oneDay})`);
    console.log(`Sent: Main(${stats.sent.main}) | 1-Week(${stats.sent.oneWeek}) | 1-Day(${stats.sent.oneDay})`);
  }
};

/**
 * Clean up old sent reminders (optional maintenance function)
 * @param {number} daysOld - Remove reminders older than this many days
 */
export const cleanupOldReminders = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Reminder.deleteMany({
      isSent: true,
      remindAt: { $lt: cutoffDate }
    });

    console.log(`🧹 Cleanup: Removed ${result.deletedCount} old sent reminders (older than ${daysOld} days)`);
    return result.deletedCount;

  } catch (error) {
    console.error('Error cleaning up old reminders:', error);
    return 0;
  }
};