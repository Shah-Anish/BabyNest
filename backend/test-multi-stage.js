import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Reminder from './model/Reminder.js';
import User from './model/user.js';
import { createAdvanceNotifications } from './services/advanceNotificationService.js';
import { sendReminderEmail } from './services/emailService.js';

dotenv.config();

console.log('🧪 Testing Multi-Stage Notification System...\n');

const testMultiStageNotifications = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create a test user
    let testUser = await User.findOne({ email: process.env.EMAIL_USER });

    if (!testUser) {
      console.log('📝 Creating test user...');
      testUser = await User.create({
        name: 'Test Parent',
        email: process.env.EMAIL_USER,
        phone: '9841234567',
        role: 'parent'
      });
    }

    console.log(`👤 Using test user: ${testUser.name} (${testUser.email})`);

    // Create a test reminder for 10 minutes from now
    const reminderDate = new Date();
    reminderDate.setMinutes(reminderDate.getMinutes() + 10);

    console.log(`📅 Creating test reminder for: ${reminderDate.toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })}`);

    const testReminder = await Reminder.create({
      userId: testUser._id,
      type: 'vaccine',
      message: 'Test BCG vaccination reminder - Multi-stage notification test',
      remindAt: reminderDate,
      notificationStage: 'main'
    });

    console.log(`✅ Main reminder created: ${testReminder._id}`);

    // Create advance notifications
    console.log('\n🔄 Creating advance notifications...');
    const advanceResult = await createAdvanceNotifications(testReminder);

    if (advanceResult.success) {
      console.log(`✅ Created ${advanceResult.count} advance notifications`);

      // List all created reminders
      const allReminders = await Reminder.find({
        $or: [
          { _id: testReminder._id },
          { parentReminderId: testReminder._id }
        ]
      }).sort({ remindAt: 1 });

      console.log('\n📋 Created Reminder Timeline:');
      allReminders.forEach((reminder, index) => {
        const stage = {
          '1_week': '🗓️  1 WEEK ADVANCE',
          '1_day': '⏰ 1 DAY ADVANCE',
          'main': '🚨 MAIN REMINDER'
        }[reminder.notificationStage];

        const date = reminder.remindAt.toLocaleString('en-NP', {
          timeZone: 'Asia/Kathmandu',
          dateStyle: 'short',
          timeStyle: 'short'
        });

        console.log(`   ${index + 1}. ${stage} - ${date}`);
        console.log(`      Message: ${reminder.message}`);
        console.log(`      ID: ${reminder._id}`);
        console.log('');
      });

      // Test email sending for each stage
      console.log('📧 Testing email templates...\n');

      for (const reminder of allReminders) {
        const stageName = {
          '1_week': '1-Week Advance',
          '1_day': '1-Day Advance',
          'main': 'Main Reminder'
        }[reminder.notificationStage];

        console.log(`📬 Sending ${stageName} email...`);

        const emailResult = await sendReminderEmail(testUser, reminder);

        if (emailResult.success) {
          console.log(`✅ ${stageName} email sent successfully! Message ID: ${emailResult.messageId}`);
        } else {
          console.log(`❌ Failed to send ${stageName} email: ${emailResult.error}`);
        }
        console.log('');
      }

      console.log('🎉 Multi-stage notification test completed!');
      console.log('📧 Check your email inbox for the test notifications.');
      console.log('\n💡 Tips:');
      console.log('   - Each email has different colors (Blue → Orange → Red)');
      console.log('   - Each email has different urgency messaging');
      console.log('   - All dates are in Nepal timezone');

      // Cleanup test data
      console.log('\n🧹 Cleaning up test data...');
      await Reminder.deleteMany({
        $or: [
          { _id: testReminder._id },
          { parentReminderId: testReminder._id }
        ]
      });
      console.log('✅ Test reminders cleaned up');

    } else {
      console.log('❌ Failed to create advance notifications:', advanceResult.error);
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the test
testMultiStageNotifications();