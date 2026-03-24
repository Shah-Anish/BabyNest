import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

console.log('🧪 Testing email configuration...\n');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Test email configuration
async function testEmailSetup() {
  try {
    console.log('📧 Email User:', process.env.EMAIL_USER || 'NOT SET');
    console.log('🔐 Email Password:', process.env.EMAIL_PASSWORD ? 'SET (hidden)' : 'NOT SET');
    console.log('');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ EMAIL_USER and EMAIL_PASSWORD must be set in .env file');
      process.exit(1);
    }

    console.log('🔗 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    console.log('📬 Sending test email...');
    const info = await transporter.sendMail({
      from: `BabyNest Test <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: '✅ BabyNest Email Test - Success!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">🍼 BabyNest Email Test</h1>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16a34a; margin-top: 0;">✅ Configuration Successful!</h2>
            <p>If you're reading this, your email configuration is working correctly.</p>

            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #16a34a;">
              <strong>Configuration Details:</strong><br>
              📧 Email User: ${process.env.EMAIL_USER}<br>
              🕒 Test Time: ${new Date().toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })}<br>
              🌍 Timezone: Asia/Kathmandu (Nepal)
            </div>
          </div>

          <p>Your BabyNest reminder system is now ready to send notifications!</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}"
               style="background: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Open BabyNest Dashboard
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This is an automated test email from BabyNest<br>
            <strong>Email notifications are working! 🎉</strong>
          </p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📧 Check your inbox at:', process.env.EMAIL_USER);
    console.log('\n🎉 Email setup is complete and working!');
    console.log('\nNext steps:');
    console.log('1. Start your server: npm run dev');
    console.log('2. Create some reminders in the app');
    console.log('3. Wait for automatic email notifications');

  } catch (error) {
    console.error('\n❌ Email test failed:');
    console.error('Error:', error.message);

    if (error.code === 'EAUTH') {
      console.error('\n💡 Authentication failed. Please check:');
      console.error('- Your email and app password are correct');
      console.error('- 2FA is enabled on your Gmail account');
      console.error('- You\'re using an App Password, not your regular password');
    }

    process.exit(1);
  }
}

testEmailSetup();