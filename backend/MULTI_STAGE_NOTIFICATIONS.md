# 🔔 Multi-Stage Reminder Notifications - Complete Guide

BabyNest now supports **multi-stage reminder notifications** that automatically send emails to parents **1 week before**, **1 day before**, and **on the day** of important reminders like vaccinations, appointments, and medications.

## 🌟 Features

### **Automatic Multi-Stage Notifications**
- **1 Week Advance**: Blue-themed email sent 7 days before the reminder
- **1 Day Advance**: Orange-themed email sent 1 day before the reminder
- **Final Reminder**: Red-themed email sent on the actual reminder date

### **Smart Email Templates**
- **Color-coded by urgency**: Blue → Orange → Red
- **Stage-specific messaging**: Different content for each notification stage
- **Nepal timezone support**: All dates formatted for Asia/Kathmandu
- **Mobile responsive**: Beautiful HTML emails that work on all devices

### **Intelligent Management**
- **Auto-creation**: Advance notifications created automatically when main reminder is added
- **Auto-cleanup**: Advance notifications deleted when main reminder is deleted
- **Smart scheduling**: Only creates advance notifications for future dates
- **Duplicate prevention**: Tracks sent status to prevent repeat notifications

---

## 🚀 How It Works

### **1. Creating a Reminder**

When you create a reminder via the API:

```http
POST /api/reminders/
{
  "userId": "user123",
  "childId": "child456",
  "type": "vaccine",
  "message": "BCG vaccination due",
  "remindAt": "2026-04-15T10:00:00.000Z"
}
```

**The system automatically creates 3 reminders:**

1. **1-Week Advance**: Scheduled for April 8, 2026
   - `notificationStage: "1_week"`
   - `isAdvanceNotification: true`
   - `message: "🗓️ Reminder: Coming up next week - BCG vaccination due"`

2. **1-Day Advance**: Scheduled for April 14, 2026
   - `notificationStage: "1_day"`
   - `isAdvanceNotification: true`
   - `message: "⏰ Reminder: Tomorrow - BCG vaccination due"`

3. **Main Reminder**: Scheduled for April 15, 2026
   - `notificationStage: "main"`
   - `isAdvanceNotification: false`
   - Original message unchanged

### **2. Email Sending Process**

The scheduler runs **every minute** and processes due reminders:

```
🔄 Running reminder check...
📊 Breakdown: 2 main, 5 1-week advance, 3 1-day advance reminders
📧 Sending 1 WEEK ADVANCE reminder email to parent@example.com for vaccine
✅ 1 WEEK ADVANCE reminder sent successfully to parent@example.com
   └─ Original reminder date: 4/15/2026
📈 Summary: 8/10 reminders sent successfully
```

---

## 📧 Email Templates

### **1 Week Advance (Blue Theme)**
```
Subject: 🗓️ BabyNest Reminder: Next Week - Vaccination for Aarav

📋 This is an advance notification. The actual reminder is
scheduled for 1 week from now.

You will receive another reminder 1 day before.
```

### **1 Day Advance (Orange Theme)**
```
Subject: ⏰ BabyNest Reminder: Tomorrow - Vaccination for Aarav

⚡ This is an advance notification. The actual reminder is
scheduled for 1 day from now.

You will receive a final reminder on the due date.
```

### **Final Reminder (Red Theme)**
```
Subject: 🚨 BabyNest Reminder: Today - Vaccination for Aarav

🚨 This reminder is due TODAY! Please take action immediately.

This is your final reminder notification.
```

---

## 🛠 API Endpoints

### **Basic Reminder Operations**

```http
# Create reminder (auto-creates advance notifications)
POST /api/reminders/
{
  "userId": "user123",
  "type": "vaccine",
  "message": "BCG vaccination",
  "remindAt": "2026-04-15T10:00:00Z"
}

# Get user reminders (main reminders only by default)
GET /api/reminders/user/:userId

# Get user reminders including advance notifications
GET /api/reminders/user/:userId?includeAdvance=true

# Update reminder (auto-updates advance notifications if date changed)
PUT /api/reminders/:id
{
  "message": "Updated message",
  "remindAt": "2026-04-20T10:00:00Z"
}

# Delete reminder (auto-deletes advance notifications)
DELETE /api/reminders/:id
```

### **Advanced Notification Management**

```http
# Get advance notifications for a specific reminder
GET /api/reminders/:id/advance-notifications

# Get reminder statistics for a user
GET /api/reminders/user/:userId/stats

# Recreate advance notifications for a reminder
POST /api/reminders/:id/recreate-advance

# Send specific reminder email immediately
POST /api/reminders/:id/send-email

# Test email configuration
POST /api/reminders/test-email
{
  "email": "test@example.com"
}

# Manually trigger reminder check
POST /api/reminders/trigger-check
```

---

## 📊 Database Schema

### **Updated Reminder Model**

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  childId: ObjectId,          // Reference to ChildProfile
  type: String,               // "vaccine", "appointment", "medication"
  message: String,            // Reminder message
  remindAt: Date,             // When to send notification
  isSent: Boolean,           // Has this notification been sent?

  // New fields for multi-stage notifications
  isAdvanceNotification: Boolean,    // Is this an advance notification?
  notificationStage: String,         // "1_week", "1_day", "main"
  parentReminderId: ObjectId,        // Links to main reminder
  originalRemindAt: Date,            // Original reminder date (for advance notifications)

  createdAt: Date,
  updatedAt: Date
}
```

### **Example Data Structure**

```javascript
// Main reminder
{
  _id: "main123",
  userId: "user456",
  type: "vaccine",
  message: "BCG vaccination due",
  remindAt: "2026-04-15T10:00:00Z",
  notificationStage: "main",
  isAdvanceNotification: false,
  parentReminderId: null,
  isSent: false
}

// 1-week advance notification
{
  _id: "advance789",
  userId: "user456",
  type: "vaccine",
  message: "🗓️ Reminder: Coming up next week - BCG vaccination due",
  remindAt: "2026-04-08T10:00:00Z",
  notificationStage: "1_week",
  isAdvanceNotification: true,
  parentReminderId: "main123",
  originalRemindAt: "2026-04-15T10:00:00Z",
  isSent: true
}
```

---

## 🔧 Configuration & Setup

### **Environment Variables**
```env
# Email Configuration
EMAIL_USER=babynest.notifications@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL for email links
FRONTEND_URL=http://localhost:3000
```

### **Enable Multi-Stage Notifications**

The system is **automatically enabled** when you:
1. ✅ Set up email credentials in `.env`
2. ✅ Start the server (`npm run dev`)
3. ✅ Create reminders via API

**No additional configuration needed!**

---

## 📈 Monitoring & Statistics

### **Server Logs**
```bash
✅ Reminder scheduler started - checking every minute
📧 Multi-stage notifications enabled: 1 week → 1 day → final reminder

🔄 Running reminder check...
📊 Breakdown: 2 main, 5 1-week advance, 3 1-day advance reminders
📧 Sending 1 WEEK ADVANCE reminder email to parent@gmail.com for vaccine
✅ 1 WEEK ADVANCE reminder sent successfully to parent@gmail.com

📊 Reminder Statistics (every 10 minutes):
   Total: 50 | Pending: 12 | Sent: 38
   Main: 5/15 | 1-Week: 3/12 | 1-Day: 4/11
```

### **API Statistics**
```http
GET /api/reminders/user/user123/stats

Response:
{
  "success": true,
  "data": {
    "total": 45,
    "byStage": { "main": 15, "oneWeek": 15, "oneDay": 15 },
    "byStatus": { "pending": 20, "sent": 25 },
    "byType": { "vaccine": 20, "appointment": 15, "medication": 10 },
    "upcoming": 8
  }
}
```

---

## 🧪 Testing the System

### **1. Test Email Configuration**
```bash
cd backend
npm run test-email
```

### **2. Create Test Reminder**
```javascript
// Create a reminder for testing (15 minutes from now)
const reminderDate = new Date();
reminderDate.setMinutes(reminderDate.getMinutes() + 15);

POST /api/reminders/
{
  "userId": "your-user-id",
  "type": "vaccine",
  "message": "Test reminder - should trigger soon",
  "remindAt": reminderDate.toISOString()
}
```

### **3. Monitor Server Console**
```bash
npm run dev

# Watch for:
✅ Reminder scheduler started
📧 Multi-stage notifications enabled
🔄 Running reminder check...
📧 Sending reminders...
```

### **4. Force Reminder Check**
```http
POST /api/reminders/trigger-check
```

---

## 🎯 Benefits for Parents

### **Never Miss Important Dates**
- **Early warning**: 1 week advance notice to plan ahead
- **Last chance**: 1 day reminder for final preparation
- **Urgent action**: Same-day notification for immediate action

### **Reduced Stress**
- **Gradual awareness**: No sudden surprises
- **Planning time**: Advance notice allows appointment booking
- **Peace of mind**: Automated system ensures nothing is forgotten

### **Better Child Health Outcomes**
- **Timely vaccinations**: Advance warnings prevent delays
- **Regular checkups**: Appointment reminders improve healthcare consistency
- **Medication compliance**: Multi-stage reminders ensure proper dosing

---

## 🚨 Important Notes

### **Advance Notification Rules**
1. **Future dates only**: Advance notifications only created for future reminder dates
2. **Auto-deletion**: Deleting main reminder removes all advance notifications
3. **No direct editing**: Cannot edit advance notifications directly - edit main reminder instead
4. **Smart updates**: Updating reminder date recreates advance notifications automatically

### **Production Considerations**
1. **Rate limiting**: Consider adding rate limits to email endpoints
2. **Monitoring**: Set up alerts for failed email deliveries
3. **Cleanup**: Run periodic cleanup of old sent reminders
4. **Backup**: Ensure reminder data is included in backups

### **Gmail Setup Requirements**
- ✅ 2-Factor Authentication enabled
- ✅ App Password generated (not regular password)
- ✅ Correct EMAIL_USER and EMAIL_PASSWORD in .env

---

## 🎉 Success!

Your BabyNest application now supports comprehensive **multi-stage reminder notifications**!

Parents will receive:
- 📅 **1-week advance notice** (blue theme)
- ⏰ **1-day advance notice** (orange theme)
- 🚨 **Final day reminder** (red theme)

All emails are automatically sent, beautifully formatted, and localized for Nepal! 🇳🇵