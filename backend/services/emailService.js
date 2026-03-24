import transporter from '../config/email.js';

/**
 * Send reminder email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `BabyNest <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send reminder notification email with advance notification support
 * @param {Object} user - User object
 * @param {Object} reminder - Reminder object
 */
export const sendReminderEmail = async (user, reminder) => {
  const typeLabels = {
    vaccine: 'Vaccination',
    appointment: 'Appointment',
    medication: 'Medication'
  };

  const typeLabel = typeLabels[reminder.type] || 'Reminder';
  const childName = reminder.childId?.name || 'your child';

  // Configure based on notification stage
  const stageConfig = getStageConfiguration(reminder.notificationStage);

  const subject = `${stageConfig.emailPrefix} ${typeLabel} for ${childName}`;

  const text = generateTextEmail(user, reminder, typeLabel, childName, stageConfig);
  const html = generateHTMLEmail(user, reminder, typeLabel, childName, stageConfig);

  return await sendEmail({
    to: user.email,
    subject,
    text,
    html
  });
};

/**
 * Get configuration for different notification stages
 * @param {string} stage - Notification stage (1_week, 1_day, main)
 * @returns {Object} Configuration object
 */
const getStageConfiguration = (stage) => {
  const configs = {
    '1_week': {
      emailPrefix: '🗓️ BabyNest Reminder: Next Week -',
      badgeText: 'Next Week',
      badgeColor: '#3b82f6', // Blue
      urgencyText: 'Coming up next week',
      timeframe: '1 week',
      emoji: '🗓️',
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6'
    },
    '1_day': {
      emailPrefix: '⏰ BabyNest Reminder: Tomorrow -',
      badgeText: 'Tomorrow',
      badgeColor: '#f59e0b', // Orange
      urgencyText: 'Due tomorrow',
      timeframe: '1 day',
      emoji: '⏰',
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b'
    },
    'main': {
      emailPrefix: '🚨 BabyNest Reminder: Today -',
      badgeText: 'Today',
      badgeColor: '#ef4444', // Red
      urgencyText: 'Due today',
      timeframe: 'today',
      emoji: '🚨',
      backgroundColor: '#fee2e2',
      borderColor: '#ef4444'
    }
  };

  return configs[stage] || configs.main;
};

/**
 * Generate plain text email
 */
const generateTextEmail = (user, reminder, typeLabel, childName, stageConfig) => {
  const originalDate = reminder.originalRemindAt || reminder.remindAt;

  return `
Hello ${user.name},

${stageConfig.urgencyText.toUpperCase()}: ${typeLabel} for ${childName}

Message: ${reminder.message}
Original Date: ${new Date(originalDate).toLocaleString('en-NP', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'full',
  timeStyle: 'short'
})}

${stageConfig.timeframe === 'today'
  ? 'This reminder is due today. Please take action immediately.'
  : `This is an advance notification. The actual reminder is scheduled for ${stageConfig.timeframe} from now.`
}

Best regards,
BabyNest Team
  `.trim();
};

/**
 * Generate HTML email with stage-specific styling
 */
const generateHTMLEmail = (user, reminder, typeLabel, childName, stageConfig) => {
  const originalDate = reminder.originalRemindAt || reminder.remindAt;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px;
    }
    .header {
      background: linear-gradient(135deg, ${stageConfig.badgeColor} 0%, ${stageConfig.badgeColor}dd 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 20px -30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .urgency-badge {
      display: inline-block;
      background: ${stageConfig.badgeColor};
      color: white;
      padding: 8px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 20px;
      letter-spacing: 1px;
    }
    .content {
      background: ${stageConfig.backgroundColor};
      padding: 25px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid ${stageConfig.borderColor};
    }
    .content-field {
      margin: 20px 0;
    }
    .content-label {
      font-weight: bold;
      color: ${stageConfig.badgeColor};
      margin-bottom: 8px;
      font-size: 14px;
    }
    .content-value {
      color: #374151;
      font-size: 16px;
      line-height: 1.5;
    }
    .timeline-info {
      background: white;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      border: 2px solid ${stageConfig.borderColor};
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #6b7280;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background: ${stageConfig.badgeColor};
      color: white;
      padding: 15px 35px;
      text-decoration: none;
      border-radius: 8px;
      margin-top: 25px;
      font-weight: bold;
      font-size: 16px;
    }
    .button:hover {
      background: ${stageConfig.badgeColor}dd;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${stageConfig.emoji} BabyNest Reminder</h1>
    </div>

    <p>Hello <strong>${user.name}</strong>,</p>

    <div class="urgency-badge">${stageConfig.badgeText}</div>

    <p><strong>${stageConfig.urgencyText}:</strong> ${typeLabel} for <strong>${childName}</strong></p>

    <div class="content">
      <div class="content-field">
        <div class="content-label">📝 Reminder Details:</div>
        <div class="content-value">${reminder.message}</div>
      </div>

      <div class="content-field">
        <div class="content-label">📅 Original Date:</div>
        <div class="content-value">${new Date(originalDate).toLocaleString('en-NP', {
          timeZone: 'Asia/Kathmandu',
          dateStyle: 'full',
          timeStyle: 'short'
        })}</div>
      </div>

      <div class="content-field">
        <div class="content-label">⚡ Type:</div>
        <div class="content-value">${typeLabel}</div>
      </div>
    </div>

    <div class="timeline-info">
      <strong style="color: ${stageConfig.badgeColor};">
        ${stageConfig.timeframe === 'today'
          ? '🚨 This reminder is due TODAY! Please take action immediately.'
          : `📋 This is an advance notification. The actual reminder is scheduled for ${stageConfig.timeframe} from now.`
        }
      </strong>
    </div>

    <center>
      <a href="${process.env.FRONTEND_URL}/dashboard/reminders" class="button">
        ${stageConfig.timeframe === 'today' ? 'View & Mark Complete' : 'View All Reminders'}
      </a>
    </center>

    <div class="footer">
      <p>Best regards,<br><strong>BabyNest Team</strong></p>
      <p style="font-size: 12px; color: #9ca3af;">
        ${stageConfig.timeframe === 'today'
          ? 'This is your final reminder notification.'
          : `You will receive ${stageConfig.timeframe === '1 week' ? 'another reminder 1 day before' : 'a final reminder on the due date'}.`
        }
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Send test email
 */
export const sendTestEmail = async (to) => {
  const subject = 'BabyNest Email Test';
  const text = 'This is a test email from BabyNest. If you received this, your email configuration is working correctly!';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #16a34a;">BabyNest Email Test</h2>
      <p>This is a test email from BabyNest.</p>
      <p>If you received this, your email configuration is working correctly! ✅</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
      <p style="color: #6b7280; font-size: 14px;">Best regards,<br>BabyNest Team</p>
    </div>
  `;

  return await sendEmail({ to, subject, text, html });
};