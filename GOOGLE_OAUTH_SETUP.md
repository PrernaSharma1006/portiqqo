# Google OAuth Setup Instructions

## ✅ Step 1: Google Credentials (COMPLETED)
You've already obtained your Google OAuth Client ID and Client Secret from Google Cloud Console.

## Step 2: Update Backend Environment Variables

### On Your Local Machine:

Edit `backend/.env` and add these lines (replace with your actual values):

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://portiqqo.me/api/auth/google/callback
```

### On Your Server:

```bash
# SSH to your server and edit the .env file
nano /var/www/portiqqo/backend/.env
```

Add the same lines:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret
GOOGLE_CALLBACK_URL=http://portiqqo.me/api/auth/google/callback
```

Save (Ctrl+O, Enter, Ctrl+X)

## Step 3: Restart Backend

```bash
pm2 restart portiqqo-backend
pm2 logs portiqqo-backend --lines 20
```

## Step 4: Test Google Login

1. Go to http://portiqqo.me/auth
2. Click "Continue with Google"
3. Sign in with your Google account
4. You should be redirected to the dashboard

## Important Notes:

- Google OAuth is already coded and ready to use
- The "Continue with Google" button is already on the login/signup pages
- Once you add the credentials, it will work immediately
- Make sure both HTTP and HTTPS URLs are in Google Console redirect URIs
- For production, you should add HTTPS URLs when you get SSL certificate

## Troubleshooting:

If Google login doesn't work:
1. Check backend logs: `pm2 logs portiqqo-backend`
2. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set correctly
3. Ensure redirect URIs in Google Console match exactly:
   - http://portiqqo.me/api/auth/google/callback
   - https://portiqqo.me/api/auth/google/callback
4. Check that SESSION_SECRET is set in .env
5. Verify CORS ALLOWED_ORIGINS includes your domain
