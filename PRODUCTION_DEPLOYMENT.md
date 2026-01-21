# Deployment Instructions for porttiqo.me

## Server Setup Complete! Follow these steps:

### 1. Build Frontend
\`\`\`bash
cd /var/www/portiqqo/frontend
npm install
npm run build
# This creates /var/www/portiqqo/frontend/dist
\`\`\`

### 2. Install Nginx Configuration
\`\`\`bash
# Copy config to nginx sites-available
sudo cp /var/www/portiqqo/nginx-portiqqo.conf /etc/nginx/sites-available/portiqqo.me

# Create symbolic link to sites-enabled
sudo ln -s /etc/nginx/sites-available/portiqqo.me /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
\`\`\`

### 3. Install SSL Certificate with Let's Encrypt
\`\`\`bash
# Install certbot if not already installed
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d porttiqo.me -d www.porttiqo.me

# Certbot will automatically update your nginx config
# Follow the prompts and choose redirect HTTP to HTTPS
\`\`\`

### 4. Setup Backend Environment Variables
\`\`\`bash
cd /var/www/portiqqo/backend

# Create production .env file
nano .env
\`\`\`

**Add these to backend/.env:**
\`\`\`env
NODE_ENV=production
PORT=5000
APP_URL=https://porttiqo.me
API_URL=https://porttiqo.me

# Database
MONGODB_URI=your_production_mongodb_uri

# JWT Secrets (generate new ones!)
JWT_SECRET=generate_strong_secret_here
JWT_REFRESH_SECRET=generate_strong_secret_here
SESSION_SECRET=generate_strong_secret_here

# Email
EMAIL_USER=portfolio.builder659@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google OAuth (Update with production credentials)
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# CORS
ALLOWED_ORIGINS=https://porttiqo.me,https://www.porttiqo.me
\`\`\`

### 5. Install Backend Dependencies
\`\`\`bash
cd /var/www/portiqqo/backend
npm install --production
\`\`\`

### 6. Setup PM2 to Run Backend
\`\`\`bash
# Install PM2 globally if not installed
sudo npm install -g pm2

# Start backend with PM2
cd /var/www/portiqqo/backend
pm2 start server.js --name portiqqo-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it gives you (run with sudo)

# Monitor backend
pm2 logs portiqqo-backend
pm2 status
\`\`\`

### 7. Update Frontend Environment for Production
\`\`\`bash
cd /var/www/portiqqo/frontend

# Create/edit .env.production
nano .env.production
\`\`\`

**Add to frontend/.env.production:**
\`\`\`env
VITE_API_URL=https://porttiqo.me/api
VITE_API_BASE_URL=https://porttiqo.me
VITE_APP_URL=https://porttiqo.me
VITE_APP_NAME=Portfolio Builder
\`\`\`

**Then rebuild frontend:**
\`\`\`bash
npm run build
\`\`\`

### 8. Update Google OAuth Redirect URIs
Go to Google Cloud Console and add:
- **Authorized JavaScript origins:**
  - https://porttiqo.me
  - https://www.porttiqo.me
  
- **Authorized redirect URIs:**
  - https://porttiqo.me/api/auth/google/callback
  - https://www.porttiqo.me/api/auth/google/callback

### 9. Setup Firewall
\`\`\`bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw allow 5000/tcp
sudo ufw enable
sudo ufw status
\`\`\`

### 10. Test Your Deployment
\`\`\`bash
# Check backend is running
curl http://localhost:5000/api/health

# Check frontend is served
curl https://porttiqo.me

# Check nginx status
sudo systemctl status nginx

# Check PM2 status
pm2 status

# View backend logs
pm2 logs portiqqo-backend
\`\`\`

### 11. Setup Auto-Deployment (Optional)
\`\`\`bash
# Create deploy script
nano /var/www/portiqqo/deploy.sh
\`\`\`

**Add to deploy.sh:**
\`\`\`bash
#!/bin/bash
cd /var/www/portiqqo

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart portiqqo-backend

# Update frontend
cd ../frontend
npm install
npm run build

# Reload nginx
sudo systemctl reload nginx

echo "Deployment complete!"
\`\`\`

**Make it executable:**
\`\`\`bash
chmod +x /var/www/portiqqo/deploy.sh
\`\`\`

### 12. Setup Automatic SSL Renewal
\`\`\`bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job
# Check it's there:
sudo systemctl status certbot.timer
\`\`\`

## Troubleshooting

### Backend not starting:
\`\`\`bash
pm2 logs portiqqo-backend
pm2 restart portiqqo-backend
\`\`\`

### Nginx errors:
\`\`\`bash
sudo nginx -t
sudo tail -f /var/log/nginx/portiqqo-error.log
\`\`\`

### MongoDB connection issues:
\`\`\`bash
# Check if MongoDB Atlas IP whitelist includes your server IP
curl ifconfig.me
# Add this IP to MongoDB Atlas Network Access
\`\`\`

### SSL issues:
\`\`\`bash
sudo certbot certificates
sudo certbot renew
\`\`\`

## Useful Commands

\`\`\`bash
# Restart everything
pm2 restart all
sudo systemctl restart nginx

# View logs
pm2 logs
sudo tail -f /var/log/nginx/portiqqo-access.log
sudo tail -f /var/log/nginx/portiqqo-error.log

# Check process
pm2 status
sudo systemctl status nginx

# Update deployment
cd /var/www/portiqqo && ./deploy.sh
\`\`\`

## Your Site Will Be Live At:
- **Frontend:** https://porttiqo.me
- **API:** https://porttiqo.me/api
- **Google OAuth Callback:** https://porttiqo.me/api/auth/google/callback

---

**Status:** Ready to deploy
**Domain:** porttiqo.me
**Server Path:** /var/www/portiqqo
