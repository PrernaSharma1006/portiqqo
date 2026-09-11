const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT) || 587;

    if (!user || !pass || user === 'your_email@gmail.com' || pass === 'your_app_password') {
      console.warn('⚠️ SMTP credentials missing or default in environment variables. Email sending disabled.');
      this.isConfigured = false;
      return;
    }

    this.isConfigured = true;
    this.transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false, // Port 587 uses STARTTLS (secure: false)
      auth: {
        user: user,
        pass: pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log(`📧 Email service initialized on ${host}:${port} for ${user}`);
  }

  async verifyConnection() {
    if (!this.isConfigured) {
      console.log('📧 Email service not configured - skipping verification');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service verification failed:', error.message);
      return false;
    }
  }

  async sendOTP(email, otp, firstName = '') {
    if (!this.isConfigured) {
      console.log(`🔧 [DEV MODE] OTP for ${email}: ${otp}`);
      return { success: true, messageId: 'dev-mode-' + Date.now() };
    }

    const mailOptions = {
      from: {
        name: 'Portfolio Builder',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: email,
      subject: 'Your Portfolio Builder Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Verification Code</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 20px; }
            .greeting { font-size: 18px; color: #2d3748; margin-bottom: 20px; }
            .otp-container { text-align: center; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; padding: 20px; background-color: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 8px; display: inline-block; }
            .message { font-size: 16px; color: #4a5568; line-height: 1.6; margin: 20px 0; }
            .warning { background-color: #fed7d7; border-left: 4px solid #fc8181; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .warning-text { color: #9b2c2c; margin: 0; }
            .footer { background-color: #f7fafc; padding: 20px; text-align: center; color: #718096; font-size: 14px; border-top: 1px solid #e2e8f0; }
            .link { color: #667eea; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Portfolio Builder</h1>
            </div>
            <div class="content">
              <div class="greeting">
                Hello ${firstName ? firstName : 'there'}! 👋
              </div>
              <p class="message">
                You've requested to verify your account on Portfolio Builder. Use the verification code below to complete your registration:
              </p>
              <div class="otp-container">
                <div class="otp-code">${otp}</div>
              </div>
              <div class="warning">
                <p class="warning-text">
                  ⚠️ This code will expire in 10 minutes for your security. Don't share this code with anyone.
                </p>
              </div>
              <p class="message">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>
                Need help? Contact us at <a href="mailto:support@portfoliobuilder.com" class="link">support@portfoliobuilder.com</a>
              </p>
              <p>
                © ${new Date().getFullYear()} Portfolio Builder. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${firstName ? firstName : 'there'}!
        
        Your verification code is: ${otp}
        
        This code will expire in 10 minutes.
        Don't share this code with anyone.
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent successfully to ${email}. Message ID: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(`❌ Failed to send OTP email to ${email}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, firstName, lastName) {
    if (!this.isConfigured) return { success: true };

    const mailOptions = {
      from: {
        name: 'Portfolio Builder',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: email,
      subject: 'Welcome to Portfolio Builder! 🎉',
      html: `<p>Welcome ${firstName} ${lastName}! Thank you for registering.</p>`
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Welcome email error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(email, resetToken, firstName = '') {
    if (!this.isConfigured) return { success: true };

    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: {
        name: 'Portfolio Builder',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Password reset email error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();