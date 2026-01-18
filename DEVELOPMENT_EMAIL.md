# 🔧 Development Mode - Email Service

## Current Status
✅ **Email service running in DEVELOPMENT MODE**

Since email credentials are not configured, the system is simulating email sending for development purposes.

## What's happening:
- OTP codes are being logged to the console instead of sent via email
- Check the backend terminal for OTP codes when testing
- All email functions return success to allow development workflow

## Console Output Example:
```
🔧 [DEV MODE] OTP for test@example.com: 123456
📧 Email service not configured. Configure EMAIL_USER and EMAIL_PASS in .env file
```

## To Enable Real Emails:
1. Update `.env` file in the backend folder
2. Replace these placeholder values:
   - `EMAIL_USER=your_email@gmail.com`
   - `EMAIL_PASS=your_app_password`
3. Use real Gmail credentials with App Password
4. Restart the backend server

## For Production:
- Always configure real email service
- Consider using SendGrid, Mailgun, or AWS SES
- Test email delivery before deployment

## Quick Test:
```bash
curl -X POST http://localhost:5000/api/test-email -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

The OTP will be displayed in the backend console.