import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('🔍 Quick Gmail Credential Check\n');

// Check if credentials are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.log('❌ EMAIL_USER or EMAIL_PASSWORD not set in .env file');
  console.log('📝 Please update your .env file with real Gmail credentials\n');
  console.log('Example:');
  console.log('EMAIL_USER=your-email@gmail.com');
  console.log('EMAIL_PASSWORD=abcd efgh ijkl mnop');
  process.exit(1);
}

// Check if they're still placeholder values
if (process.env.EMAIL_USER.includes('your-') || process.env.EMAIL_USER.includes('babynest.notification')) {
  console.log('⚠️  You still have placeholder email credentials!');
  console.log('Current EMAIL_USER:', process.env.EMAIL_USER);
  console.log('\n🔧 Please replace with YOUR real Gmail address');
  console.log('📋 Steps:');
  console.log('1. Use your actual Gmail: your-real-email@gmail.com');
  console.log('2. Generate App Password at: https://myaccount.google.com/apppasswords');
  console.log('3. Update .env file with real credentials');
  process.exit(1);
}

console.log('✅ EMAIL_USER set:', process.env.EMAIL_USER);
console.log('✅ EMAIL_PASSWORD set:', process.env.EMAIL_PASSWORD ? 'Yes (hidden)' : 'No');

// Test connection
console.log('\n🔗 Testing Gmail connection...');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

try {
  await transporter.verify();
  console.log('✅ Gmail connection successful!');
  console.log('🎉 Your email setup is working correctly!');
  console.log('\n📧 Sending test email to yourself...');

  const info = await transporter.sendMail({
    from: `BabyNest <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: '✅ BabyNest Email Test - SUCCESS!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #16a34a;">🎉 Email Setup Successful!</h2>
        <p>Congratulations! Your BabyNest email notifications are now working.</p>
        <p><strong>Email User:</strong> ${process.env.EMAIL_USER}</p>
        <p><strong>Test Time:</strong> ${new Date().toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })}</p>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <strong>✅ Ready for Multi-Stage Reminders:</strong><br>
          • 📅 1 Week Advance Notifications<br>
          • ⏰ 1 Day Advance Notifications<br>
          • 🚨 Final Day Reminders
        </div>
        <p>Your reminder system is now ready to send notifications!</p>
      </div>
    `
  });

  console.log('✅ Test email sent! Message ID:', info.messageId);
  console.log('📬 Check your inbox for the test email');
  console.log('\n🚀 Your BabyNest email system is ready!');

} catch (error) {
  console.log('❌ Gmail connection failed:', error.message);

  if (error.code === 'EAUTH') {
    console.log('\n💡 Authentication Error - Check:');
    console.log('1. Is this a real Gmail address?');
    console.log('2. Is 2FA enabled on your Gmail account?');
    console.log('3. Are you using an App Password (not regular password)?');
    console.log('4. Is the App Password 16 characters (e.g., "abcd efgh ijkl mnop")?');
    console.log('\n🔗 Get App Password: https://myaccount.google.com/apppasswords');
  }
}