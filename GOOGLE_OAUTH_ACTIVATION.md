# Google OAuth Activation Guide

## ✅ Code Changes Complete
The Google OAuth code has been uncommented and is ready to use.

## 🔑 Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create/Select Project**:
   - Click "Select a project" → "New Project"
   - Name: "Portiqqo"
   - Click "Create"

3. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" → "OAuth consent screen"
   - User Type: **External**
   - App name: **Portiqqo**
   - User support email: **portfolio.builder659@gmail.com** (or your email)
   - App domain: **portiqqo.me**
   - Developer contact: **portfolio.builder659@gmail.com**
   - Click "Save and Continue"
   - Scopes: Add `email` and `profile` (default)
   - Test users: Add your email
   - Click "Save and Continue"

4. **Create OAuth Client ID**:
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Web application**
   - Name: **Portiqqo Web Client**
   
   **Authorized JavaScript origins**:
   ```
   http://portiqqo.me
   https://portiqqo.me
   ```
   
   **Authorized redirect URIs**:
   ```
   http://portiqqo.me/api/auth/google/callback
   https://portiqqo.me/api/auth/google/callback
   ```
   
   - Click "CREATE"

5. **Copy Your Credentials**:
   - You'll see a popup with:
     - **Client ID**: looks like `123456789-abc.apps.googleusercontent.com`
     - **Client Secret**: looks like `GOCSPX-abc123xyz`
   - **Save these!** You'll need them in the next step

## 📝 Step 2: Update Server Environment Variables

On your server, edit the backend `.env` file:

```bash
nano /var/www/portiqqo/backend/.env
```

Add these lines (replace with your actual credentials):

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://portiqqo.me/api/auth/google/callback
```

**Important**: Make sure your existing `.env` also has:
```env
APP_URL=http://portiqqo.me
ALLOWED_ORIGINS=http://portiqqo.me,https://portiqqo.me,http://www.portiqqo.me,https://www.portiqqo.me
SESSION_SECRET=your_session_secret_here
```

Save the file (Ctrl+O, Enter, Ctrl+X)

## 🚀 Step 3: Deploy Updated Code

```bash
# 1. Push code from local machine
git add -A
git commit -m "Enable Google OAuth"
git push

# 2. On server, pull changes
cd /var/www/portiqqo
sudo git pull

# 3. Restart backend
pm2 restart portiqqo-backend

# 4. Check logs
pm2 logs portiqqo-backend --lines 20
```

You should see:
```
✅ Google OAuth configured successfully
🚀 Server running in production mode on port 5001
✅ MongoDB connected successfully
```

## 🧪 Step 4: Test Google Login

1. Visit: http://portiqqo.me
2. Click "Get Started" or "Sign In"
3. You should see "Continue with Google" button
4. Click it and authorize with your Google account
5. You should be redirected back and logged in!

## 🔒 Security Notes

- Keep `GOOGLE_CLIENT_SECRET` secure - never commit to git
- Google OAuth is in testing mode - add test users in Console
- To publish: Go to OAuth consent screen → "PUBLISH APP"
- For production, consider enabling HTTPS/SSL with Let's Encrypt

## 🐛 Troubleshooting

**Error: "redirect_uri_mismatch"**
- Make sure redirect URIs in Google Console exactly match your callback URL
- Include both http and https versions

**Error: "access_denied"**
- User declined authorization
- Or app is not published and user is not a test user

**Backend crashes on startup**
- Check `pm2 logs` for errors
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in .env

**Button doesn't appear**
- Frontend might not be rebuilt - run `npm run build` in frontend/
- Check browser console for errors
