const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Check if email configuration is provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
        process.env.EMAIL_USER === 'your_email@gmail.com' || 
        process.env.EMAIL_PASS === 'your_app_password') {
      console.warn('⚠️ Email configuration missing or using default values. Email functionality will be disabled.');
      this.isConfigured = false;
      return;
    }

    this.isConfigured = true;
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async verifyConnection() {
    if (!this.isConfigured) {
      console.log('📧 Email service not configured - skipping verification');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
      return true;
    } catch (error) {
      console.error('❌ Email service error:', error.message);
      return false;
    }
  }

  async sendOTP(email, otp, firstName = '') {
    // If email is not configured, simulate sending for development
    if (!this.isConfigured) {
      console.log(`🔧 [DEV MODE] OTP for ${email}: ${otp}`);
      console.log('📧 Email service not configured. Configure EMAIL_USER and EMAIL_PASS in .env file');
      // Return success to allow development without email setup
      return { success: true, messageId: 'dev-mode-' + Date.now() };
    }

    const mailOptions = {
      from: {
        name: 'Portfolio Builder',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: email,
      subject: 'Your Portfolio Builder Login Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Login Code</title>
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
                You've requested to sign in to your Portfolio Builder account. Use the verification code below to complete your login:
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
                If you didn't request this code, you can safely ignore this email. Your account remains secure.
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
        
        You've requested to sign in to your Portfolio Builder account.
        Your verification code is: ${otp}
        
        This code will expire in 10 minutes for your security.
        Don't share this code with anyone.
        
        If you didn't request this code, you can safely ignore this email.
        
        Need help? Contact us at support@portfoliobuilder.com
        
        © ${new Date().getFullYear()} Portfolio Builder. All rights reserved.
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error.message);
      console.error('Email configuration check:');
      console.error('- EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
      console.error('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Missing');
      console.error('- EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com');
      
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(email, firstName, lastName) {
    // If email is not configured, log and return
    if (!this.isConfigured) {
      console.log(`🔧 [DEV MODE] Welcome email for ${firstName} ${lastName} (${email})`);
      return { success: true, messageId: 'dev-mode-welcome-' + Date.now() };
    }

    const mailOptions = {
      from: {
        name: 'Portfolio Builder',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: email,
      subject: 'Welcome to Portfolio Builder! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Portfolio Builder</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 20px; }
            .greeting { font-size: 20px; color: #2d3748; margin-bottom: 20px; font-weight: 600; }
            .message { font-size: 16px; color: #4a5568; line-height: 1.6; margin: 20px 0; }
            .cta-button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .features { margin: 30px 0; }
            .feature { display: flex; align-items: center; margin: 15px 0; }
            .feature-icon { margin-right: 15px; font-size: 20px; }
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
                Welcome, ${firstName} ${lastName}! 🎉
              </div>
              <p class="message">
                Thank you for joining Portfolio Builder! We're excited to help you create a stunning professional portfolio that showcases your work and skills.
              </p>
              
              <div class="features">
                <div class="feature">
                  <span class="feature-icon">🎨</span>
                  <span>Choose from profession-specific templates</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">📁</span>
                  <span>Upload your work (images, videos, PDFs)</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">🌐</span>
                  <span>Get your unique subdomain</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">💾</span>
                  <span>15GB of free storage included</span>
                </div>
              </div>

              <p class="message">
                Ready to get started? Create your first portfolio and make your mark online!
              </p>
              
              <div style="text-align: center;">
                <a href="${process.env.APP_URL}/dashboard" class="cta-button">Create Your Portfolio</a>
              </div>
            </div>
            <div class="footer">
              <p>
                Need help? Check out our <a href="${process.env.APP_URL}/help" class="link">Help Center</a> or contact us at <a href="mailto:support@portfoliobuilder.com" class="link">support@portfoliobuilder.com</a>
              </p>
              <p>
                © ${new Date().getFullYear()} Portfolio Builder. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't throw error for welcome email as it's not critical
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(email, resetToken, firstName = '') {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'Portfolio Builder',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: email,
      subject: 'Reset Your Portfolio Builder Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 20px; }
            .greeting { font-size: 18px; color: #2d3748; margin-bottom: 20px; }
            .message { font-size: 16px; color: #4a5568; line-height: 1.6; margin: 20px 0; }
            .cta-button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
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
                Hello ${firstName ? firstName : 'there'}!
              </div>
              <p class="message">
                We received a request to reset your password for your Portfolio Builder account. Click the button below to create a new password:
              </p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="cta-button">Reset Password</a>
              </div>
              
              <div class="warning">
                <p class="warning-text">
                  ⚠️ This link will expire in 1 hour for your security.
                </p>
              </div>
              
              <p class="message">
                If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
              </p>
              
              <p class="message">
                If the button doesn't work, you can copy and paste this link into your browser:<br>
                <a href="${resetUrl}" class="link">${resetUrl}</a>
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
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

module.exports = new EmailService();