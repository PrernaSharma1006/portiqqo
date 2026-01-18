# Email Setup Guide for Portfolio Builder

## 🔧 Gmail Configuration (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to "Security"
3. Enable "2-Step Verification"

### Step 2: Generate App Password
1. Visit: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device
4. Enter "Portfolio Builder" as the name
5. Copy the generated 16-character password

### Step 3: Update .env file
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=Portfolio Builder <noreply@portfoliobuilder.com>
```

## 🧪 Testing Email Configuration

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Test email sending:
```bash
curl -X POST http://localhost:5000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com"}'
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid login"** error:
   - Make sure you're using App Password, not regular password
   - Verify 2FA is enabled on your Google account

2. **Connection timeout**:
   - Check your internet connection
   - Verify EMAIL_HOST and EMAIL_PORT settings

3. **Authentication failed**:
   - Double-check EMAIL_USER is your full Gmail address
   - Ensure EMAIL_PASS is the 16-character app password

### Alternative Email Providers:

#### SendGrid (Production Recommended)
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

#### Outlook/Hotmail
```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=youremail@outlook.com
EMAIL_PASS=your-password
```

## 📝 Notes

- The OTP system requires a working email configuration
- Without email, users won't be able to verify their accounts
- Test the email functionality before deploying to production
- Consider using a dedicated email service like SendGrid for production