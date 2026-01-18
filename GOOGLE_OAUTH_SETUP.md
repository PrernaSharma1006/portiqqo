# Google OAuth Setup Guide

## Overview
Google OAuth authentication has been successfully implemented for the Portiqqo portfolio builder. Users can now sign in/sign up using their Google account alongside the existing OTP email verification system.

## ✅ Implementation Status
- **Backend**: Fully configured with Passport.js and Google OAuth 2.0 strategy
- **Frontend**: "Continue with Google" button added to both login and signup pages
- **Dependencies**: Installed (passport, passport-google-oauth20, express-session)
- **Date**: December 26, 2025

## Features Added
- **Continue with Google** button on both Sign In and Create Account pages
- Seamless Google OAuth 2.0 integration
- Automatic user creation with 7-day free trial for new Google users
- Existing users can link their Google account
- No password required when using Google authentication
- Email automatically verified for Google users

## Backend Setup

### 1. Install Dependencies ✅ COMPLETED
The following packages have been installed in `backend/package.json`:
```bash
cd backend
npm install passport passport-google-oauth20 express-session
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen if prompted
6. Select "Web application" as the application type
7. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
8. Copy your **Client ID** and **Client Secret**

### 3. Configure Environment Variables

Add these to your `backend/.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Session Secret (generate a random string)
SESSION_SECRET=your_random_strong_secret_key_here

# JWT Secret (if not already set)
JWT_SECRET=your_jwt_secret_here
```

### 4. Files Modified/Created

**Created:**
- `backend/config/passport.js` - Passport Google OAuth strategy configuration
- `backend/.env.google` - Example environment variables

**Modified:**
- `backend/package.json` - Added passport dependencies
- `backend/server.js` - Initialized passport and session middleware
- `backend/routes/auth.js` - Added Google OAuth routes
- `backend/models/User.js` - Added `googleId` field

## Frontend Setup

### Files Modified/Created

**Created:**
- `frontend/src/pages/auth/AuthCallbackPage.jsx` - Handles OAuth callback and token storage

**Modified:**
- `frontend/src/pages/auth/UnifiedAuthPage.jsx` - Added "Continue with Google" buttons to both login and signup forms
- `frontend/src/App.jsx` - Added `/auth/callback` route

### Features
- Google button appears above the email/password form with "OR" divider
- Official Google brand colors and logo
- Smooth hover effects
- Automatic redirect to dashboard after successful authentication

## User Flow

### For New Users (Sign Up):
1. User clicks "Continue with Google" on signup page
2. Redirected to Google OAuth consent screen
3. User authorizes the application
4. Backend creates new user account with:
   - Email from Google account
   - Name from Google profile
   - 7-day free trial activated
   - No password required
5. User redirected to dashboard

### For Existing Users (Sign In):
1. User clicks "Continue with Google" on login page
2. Redirected to Google OAuth consent screen
3. User authorizes the application
4. Backend:
   - Finds existing user by email
   - Links Google account if not already linked
   - Generates JWT token
5. User redirected to dashboard

### Alternative OTP Flow (Still Available):
- Users can still use the existing email + OTP verification system
- Both methods work independently
- Users who signed up with Google can later add a password if needed

## API Endpoints

### New Endpoints Added:

**`GET /api/auth/google`**
- Initiates Google OAuth flow
- Redirects to Google consent screen
- Public access

**`GET /api/auth/google/callback`**
- Handles Google OAuth callback
- Creates/updates user
- Generates JWT token
- Redirects to frontend with token
- Public access

## Database Changes

### User Model Updates:
```javascript
{
  googleId: {
    type: String,
    sparse: true,
    unique: true
  }
}
```

- `googleId` is optional (sparse index allows null values)
- Unique to prevent duplicate Google account links
- Users can have both password and Google authentication

## Security Features

1. **Session Management**: Secure express-session with HTTP-only cookies
2. **JWT Tokens**: Generated after successful OAuth
3. **Email Verification**: Google emails are automatically verified
4. **Trial Period**: New users get 7-day trial as per pricing model
5. **CORS Protection**: Configured for localhost development and production domains

## Testing

### Development Testing:
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to `http://localhost:3000/auth`
4. Click "Continue with Google"
5. Authorize with your Google account
6. Verify redirect to dashboard

### Production Checklist:
- [ ] Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in production `.env`
- [ ] Add production callback URL to Google Cloud Console
- [ ] Update `callbackURL` in `backend/config/passport.js` for production domain
- [ ] Update redirect URL in `backend/routes/auth.js` callback handler
- [ ] Enable HTTPS and secure cookies (`secure: true` in session config)
- [ ] Test OAuth flow on production domain

## Troubleshooting

### "Redirect URI Mismatch" Error:
- Verify callback URL in Google Cloud Console matches exactly
- Check for trailing slashes
- Ensure HTTP/HTTPS protocol matches

### "Invalid Client" Error:
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check if credentials are enabled in Google Cloud Console

### User Not Created:
- Check backend console logs
- Verify MongoDB connection
- Ensure User model has `googleId` field

### Token Not Stored:
- Check frontend console for errors
- Verify `/auth/callback` route exists
- Check localStorage for `authToken`

## Code Structure

### Backend Flow:
```
User clicks Google button
  ↓
GET /api/auth/google
  ↓
passport.authenticate('google')
  ↓
Google consent screen
  ↓
GET /api/auth/google/callback
  ↓
passport GoogleStrategy
  ↓
Find/Create User
  ↓
Generate JWT
  ↓
Redirect to frontend with token
```

### Frontend Flow:
```
Redirect to /auth/callback?token=xxx
  ↓
AuthCallbackPage extracts token
  ↓
Store in localStorage
  ↓
Fetch user data from /api/auth/me
  ↓
Update AuthContext
  ↓
Redirect to dashboard
```

## Additional Features (Future Enhancements)

- [ ] Add "Unlink Google Account" option in user settings
- [ ] Allow users to add password after Google signup
- [ ] Add more OAuth providers (Facebook, Apple, Microsoft)
- [ ] Implement refresh token rotation
- [ ] Add 2FA for Google-authenticated users
- [ ] Profile picture sync from Google account

## Support

For issues or questions:
- Email: portfolio.builder659@gmail.com
- Check backend logs: `backend/logs/`
- Check frontend console for errors

---

**Status**: ✅ Implemented and Ready for Testing
**Date**: December 26, 2025
**Version**: 1.0.0
