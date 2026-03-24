# Email Configuration Setup for BabyNest

This document explains how to set up email notifications for reminders in the BabyNest application using Gmail and Nodemailer.

## Prerequisites

- Gmail account
- Node.js application with Nodemailer installed
- Environment variables configured

## Gmail Setup

### Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Follow the instructions to enable 2FA if not already enabled

### Step 2: Generate App Password

1. In your Google Account settings, go to **Security**
2. Under "2-Step Verification", find **App passwords**
3. Select **Mail** as the app and **Other (Custom name)** as the device
4. Enter "BabyNest" as the custom name
5. Click **Generate**
6. Copy the 16-character app password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Configure Environment Variables

Update your `.env` file with your Gmail credentials:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**Important**:
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `abcd efgh ijkl mnop` with the app password you generated
- **Never use your regular Gmail password** - always use an app password

## Features Implemented

### 1. Automatic Email Reminders

The system automatically checks for due reminders every minute and sends email notifications:

- **Vaccine reminders**: Sent when vaccination is due
- **Appointment reminders**: Sent for upcoming medical appointments
- **Medication reminders**: Sent for medication schedules

### 2. Email API Endpoints

#### Test Email
```http
POST /api/reminders/test-email
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "email": "test@example.com"
}
```

#### Send Specific Reminder Email
```http
POST /api/reminders/:id/send-email
Authorization: Bearer <jwt-token>
```

#### Manually Trigger Reminder Check
```http
POST /api/reminders/trigger-check
Authorization: Bearer <jwt-token>
```

### 3. Email Templates

The system uses beautifully formatted HTML email templates that include:

- **BabyNest branding** with green color scheme
- **Reminder type badges** (Vaccination, Appointment, Medication)
- **Child information** and reminder details
- **Scheduled time** in Nepal timezone
- **Call-to-action button** linking to the dashboard
- **Responsive design** for mobile and desktop

### 4. Automatic Scheduling

- **Cron job** runs every minute to check for due reminders
- **Timezone support** for Nepal (Asia/Kathmandu)
- **Duplicate prevention** - reminders are marked as sent
- **Error handling** with detailed logging

## Email Content Example

When a reminder is due, users receive an email with:

- **Subject**: "BabyNest Reminder: Vaccination for Aarav"
- **Greeting**: Personalized with user's name
- **Reminder details**: Type, message, scheduled time
- **Call-to-action**: Button to view all reminders
- **Branding**: Professional BabyNest footer

## Testing the Setup

### 1. Test Email Configuration

```javascript
// Test endpoint
POST /api/reminders/test-email
{
  "email": "your-test-email@gmail.com"
}
```

### 2. Create a Test Reminder

```javascript
// Create reminder for immediate testing
POST /api/reminders/
{
  "userId": "your-user-id",
  "type": "vaccine",
  "message": "BCG vaccination due",
  "remindAt": "2026-03-23T10:30:00.000Z"
}
```

### 3. Manually Trigger Check

```javascript
// Force check for due reminders
POST /api/reminders/trigger-check
```

## Security Best Practices

1. **Never commit app passwords** to version control
2. **Use environment variables** for all credentials
3. **Rotate app passwords** regularly
4. **Monitor email sending logs** for suspicious activity
5. **Rate limit** email endpoints if needed

## Troubleshooting

### Common Issues

1. **Authentication Error**:
   - Verify app password is correct
   - Ensure 2FA is enabled on Gmail account

2. **Email Not Sending**:
   - Check internet connection
   - Verify Gmail SMTP settings
   - Check server logs for errors

3. **Reminders Not Triggering**:
   - Verify cron job is running
   - Check reminder dates are in the future
   - Ensure reminders aren't already marked as sent

### Logs to Check

```bash
# Server console output
- "Email server is ready to send messages" ✅
- "Reminder scheduler started - checking every minute" ✅
- "Found X due reminder(s) to send"
- "✓ Reminder sent successfully to user@email.com"
- "✗ Failed to send reminder: error message"
```

## Alternative Email Providers

While this setup uses Gmail, you can easily configure other providers:

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Support

If you need help setting up email notifications:

1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Test with the `/test-email` endpoint first
4. Contact support at support@babynest.com.np