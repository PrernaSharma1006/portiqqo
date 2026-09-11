const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.initTransporter();
  }

  initTransporter() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT) || 465;

    this.resendKey = process.env.RESEND_API_KEY;
    this.brevoKey = process.env.BREVO_API_KEY;
    this.sendgridKey = process.env.SENDGRID_API_KEY;

    if (!user || !pass || user === 'your_email@gmail.com' || pass === 'your_app_password') {
      this.isConfigured = false;
    } else {
      this.isConfigured = true;
      this.user = user;
      this.pass = pass;
      this.host = host;
      this.port = port;

      this.transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465,
        auth: {
          user: user,
          pass: pass
        },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
        tls: {
          rejectUnauthorized: false
        }
      });
    }

    if (this.resendKey) {
      console.log('⚡ Resend HTTP API configured (HTTPS Port 443)');
    } else if (this.brevoKey) {
      console.log('⚡ Brevo HTTP API configured (HTTPS Port 443)');
    } else if (this.sendgridKey) {
      console.log('⚡ SendGrid HTTP API configured (HTTPS Port 443)');
    } else if (this.isConfigured) {
      console.log(`📧 SMTP initialized on ${host}:${port} (${port === 465 ? 'SSL' : 'TLS'}) for ${user}`);
    } else {
      console.warn('⚠️ [EMAIL WARNING] No HTTP API Key (RESEND_API_KEY) or SMTP credentials configured!');
    }
  }

  async sendViaResend(email, otp, firstName) {
    if (!this.resendKey) return null;
    console.log(`🌐 Dispatching OTP (${otp}) to ${email} via Resend HTTP API (Port 443)...`);
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Portfolio Builder <onboarding@resend.dev>',
          to: [email],
          subject: 'Your Portfolio Builder Verification Code',
          html: this.getOTPHtml(otp, firstName),
          text: `Your verification code is: ${otp}`
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ OTP email sent successfully via Resend HTTPS API to ${email}. ID: ${data.id}`);
        return { success: true, messageId: data.id };
      } else {
        console.error(`❌ Resend HTTP API error for ${email}:`, data);
        return null;
      }
    } catch (err) {
      console.error(`❌ Resend HTTP API exception for ${email}:`, err.message);
      return null;
    }
  }

  async sendViaBrevo(email, otp, firstName) {
    if (!this.brevoKey) return null;
    console.log(`🌐 Dispatching OTP (${otp}) to ${email} via Brevo HTTP API (Port 443)...`);
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.brevoKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Portfolio Builder', email: process.env.EMAIL_USER || 'support@portfoliobuilder.com' },
          to: [{ email: email }],
          subject: 'Your Portfolio Builder Verification Code',
          htmlContent: this.getOTPHtml(otp, firstName),
          textContent: `Your verification code is: ${otp}`
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ OTP email sent successfully via Brevo HTTPS API to ${email}. ID: ${data.messageId || 'ok'}`);
        return { success: true, messageId: data.messageId || 'ok' };
      } else {
        console.error(`❌ Brevo HTTP API error for ${email}:`, data);
        return null;
      }
    } catch (err) {
      console.error(`❌ Brevo HTTP API exception for ${email}:`, err.message);
      return null;
    }
  }

  getOTPHtml(otp, firstName) {
    return `
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
    `;
  }

  async sendOTP(email, otp, firstName = '') {
    this.initTransporter();

    // 1. Try Resend HTTP API (HTTPS Port 443 - Bypasses Render Port Blocks)
    if (this.resendKey) {
      const resendResult = await this.sendViaResend(email, otp, firstName);
      if (resendResult) return resendResult;
    }

    // 2. Try Brevo HTTP API (HTTPS Port 443 - Bypasses Render Port Blocks)
    if (this.brevoKey) {
      const brevoResult = await this.sendViaBrevo(email, otp, firstName);
      if (brevoResult) return brevoResult;
    }

    if (!this.isConfigured) {
      console.error(`❌ [CRITICAL] Cannot send OTP email to ${email}: SMTP ports are blocked on Render free tier and no HTTP API key (RESEND_API_KEY) is set on Render Dashboard!`);
      return { success: false, error: 'Render blocks raw SMTP ports. Please add RESEND_API_KEY to Render Environment Variables.' };
    }

    console.log(`📤 Sending OTP email (${otp}) to ${email} via SMTP...`);

    const mailOptions = {
      from: {
        name: 'Portfolio Builder',
        address: process.env.EMAIL_FROM || this.user
      },
      to: email,
      subject: 'Your Portfolio Builder Verification Code',
      html: this.getOTPHtml(otp, firstName),
      text: `Hello ${firstName ? firstName : 'there'}!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`
    };

    // Primary delivery attempt (Port 465 SSL)
    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent successfully to ${email} (Port ${this.port}). Message ID: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (primaryError) {
      console.warn(`⚠️ Primary SMTP delivery (Port ${this.port}) failed for ${email}: ${primaryError.message}. Retrying via Fallback Port 587 STARTTLS...`);

      // Fallback delivery attempt (Port 587 STARTTLS)
      try {
        const fallbackTransporter = nodemailer.createTransport({
          host: this.host,
          port: 587,
          secure: false,
          auth: {
            user: this.user,
            pass: this.pass
          },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 8000,
          tls: {
            rejectUnauthorized: false
          }
        });

        const result = await fallbackTransporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent successfully to ${email} via Fallback Port 587. Message ID: ${result.messageId}`);
        return { success: true, messageId: result.messageId };
      } catch (fallbackError) {
        console.error(`❌ Render blocked all raw SMTP ports (465 & 587) for ${email}. Please set RESEND_API_KEY in Render Environment Variables to send emails via HTTPS Port 443.`);
        return { success: false, error: `Render blocks raw SMTP ports 465 & 587. Primary: ${primaryError.message} | Fallback: ${fallbackError.message}` };
      }
    }
  }

  async verifyConnection() {
    this.initTransporter();
    if (this.resendKey || this.brevoKey) return true;
    if (!this.isConfigured) return false;
    try {
      await this.transporter.verify();
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = new EmailService();