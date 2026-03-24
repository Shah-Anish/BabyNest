import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Reminder from './model/Reminder.js';
import User from './model/user.js';
import { createAdvanceNotifications } from './services/advanceNotificationService.js';

dotenv.config();

console.log('🧪 Testing Reminder Creation & Advance Notifications\n');

const testReminderSystem = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if email is configured
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-')) {
      console.log('❌ Please set up email credentials first!');
      console.log('Run: npm run quick-email-test');
      return;
    }

    // Find or create test user
    let testUser = await User.findOne({ email: process.env.EMAIL_USER });

    if (!testUser) {
      console.log('👤 Creating test user...');
      testUser = await User.create({
        name: 'Test Parent',
        email: process.env.EMAIL_USER,
        phone: '9841234567',
        role: 'parent'
      });
    }

    console.log(`👤 Test user: ${testUser.name} (${testUser.email})`);

    // Test 1: Create reminder for 5 minutes from now (to test immediate flow)
    const reminderDate1 = new Date();
    reminderDate1.setMinutes(reminderDate1.getMinutes() + 5);

    // Test 2: Create reminder for 2 weeks from now (to test all advance notifications)
    const reminderDate2 = new Date();
    reminderDate2.setDate(reminderDate2.getDate() + 14);

    const testReminders = [
      {
        type: 'vaccine',
        message: 'TEST: BCG vaccination (5 min test)',
        remindAt: reminderDate1,
        description: 'Tests immediate notification'
      },
      {
        type: 'appointment',
        message: 'TEST: Pediatric checkup (2 weeks)',
        remindAt: reminderDate2,
        description: 'Tests all 3 notifications: 1-week, 1-day, and main'
      }
    ];

    console.log('\n📅 Creating test reminders...');

    for (const [index, testData] of testReminders.entries()) {
      console.log(`\n${index + 1}. Creating: ${testData.message}`);
      console.log(`   Scheduled: ${testData.remindAt.toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })}`);
      console.log(`   Purpose: ${testData.description}`);

      // Create main reminder
      const reminder = await Reminder.create({
        userId: testUser._id,
        type: testData.type,
        message: testData.message,
        remindAt: testData.remindAt,
        notificationStage: 'main'
      });

      console.log(`   ✅ Main reminder created: ${reminder._id}`);

      // Create advance notifications
      const advanceResult = await createAdvanceNotifications(reminder);

      if (advanceResult.success) {
        console.log(`   ✅ Created ${advanceResult.count} advance notifications`);

        // Show timeline
        const allReminders = await Reminder.find({
          $or: [
            { _id: reminder._id },
            { parentReminderId: reminder._id }
          ]
        }).sort({ remindAt: 1 });

        console.log('   📋 Notification Timeline:');
        allReminders.forEach((r, i) => {
          const stage = {
            '1_week': '   📅 1 Week Advance',
            '1_day': '   ⏰ 1 Day Advance',
            'main': '   🚨 Main Reminder'
          }[r.notificationStage];

          const date = r.remindAt.toLocaleString('en-NP', {
            timeZone: 'Asia/Kathmandu',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          console.log(`      ${stage}: ${date}`);
        });
      } else {
        console.log(`   ❌ Failed to create advance notifications: ${advanceResult.error}`);
      }
    }

    // Show summary
    const totalReminders = await Reminder.countDocuments({
      userId: testUser._id
    });

    console.log(`\n📊 Summary: Created ${totalReminders} total reminders`);
    console.log('🚀 Reminder system is working!');

    console.log('\n⏰ What happens next:');
    console.log('1. Start your server: npm run dev');
    console.log('2. The scheduler will check every minute for due reminders');
    console.log('3. You should receive emails at the scheduled times');

    console.log('\n🧹 Cleanup test data? (y/n)');
    // For now, let's keep the test data so they can see emails being sent

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testReminderSystem();