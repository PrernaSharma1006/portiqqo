#!/bin/bash

# Portfolio Save & Publish Feature Deployment Script
# Run this on your production server

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/portiqqo || exit

# Stop PM2 processes
echo "⏸️  Stopping backend..."
pm2 stop backend

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Backend deployment
echo "🔧 Setting up backend..."
cd backend
npm install
cd ..

# Frontend deployment
echo "🎨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Restart backend
echo "▶️  Restarting backend..."
pm2 restart backend

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo ""
echo "📝 Test checklist:"
echo "  1. Login to https://portiqqo.me"
echo "  2. Go to Dashboard"
echo "  3. Select a template"
echo "  4. Fill in portfolio data"
echo "  5. Click 'Save' - should see success"
echo "  6. Click 'Publish Portfolio'"
echo "  7. Copy the generated link"
echo "  8. Open in incognito/new browser"
echo "  9. Verify portfolio displays"
echo ""
