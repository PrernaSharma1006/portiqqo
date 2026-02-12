# Subdomain-based Portfolio URLs - Deployment Guide

## Overview
This update changes portfolio URLs from path-based (`portiqqo.me/username`) to subdomain-based (`username.portiqqo.me`).

## What Changed

### Backend Changes
- **Portfolio Controller**: Now accepts custom subdomain from user input
- **URL Generation**: Changed from `portiqqo.me/{subdomain}` to `{subdomain}.portiqqo.me`
- **Subdomain Validation**: Ensures subdomain contains only lowercase letters, numbers, and hyphens

### Frontend Changes
- **Editor UI**: Added subdomain input field where users can choose their custom subdomain
- **Public Portfolio Page**: Now extracts subdomain from hostname (`example.portiqqo.me`) instead of path
- **Portfolio Helper**: Updated to pass custom subdomain when saving portfolios

## Deployment Steps

### 1. DNS Configuration (REQUIRED)
Add a wildcard DNS record to your domain:

**For Cloudflare/Domain Registrar:**
- Type: `A`
- Name: `*` (asterisk for wildcard)
- Content/Value: `YOUR_SERVER_IP`
- TTL: `Auto` or `3600`

This allows any subdomain like `example.portiqqo.me`, `john.portiqqo.me`, etc. to point to your server.

**Verification:**
```bash
# Test DNS propagation
nslookup test.portiqqo.me
# Should return your server IP
```

### 2. SSL Certificate Update (REQUIRED)
Update your SSL certificate to support wildcard subdomains:

```bash
# Stop nginx
sudo systemctl stop nginx

# Request wildcard SSL certificate
sudo certbot certonly --standalone \
  -d portiqqo.me \
  -d www.portiqqo.me \
  -d *.portiqqo.me

# Start nginx
sudo systemctl start nginx
```

**Note:** Wildcard certificates require DNS validation. Follow certbot's instructions.

### 3. Nginx Configuration

Copy the wildcard subdomain configuration:

```bash
# On your server
cd /var/www/portiqqo
sudo cp nginx-subdomain-portiqqo.conf /etc/nginx/sites-available/subdomain-portiqqo

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/subdomain-portiqqo /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### 4. Code Deployment

```bash
# Pull latest changes
cd /var/www/portiqqo
sudo git pull origin main

# Install any new dependencies
cd backend
sudo npm install

cd ../frontend
sudo npm install

# Build frontend
sudo npm run build

# Restart backend
pm2 restart backend

# Reload nginx
sudo systemctl reload nginx
```

### 5. Verification

**Test the system:**

1. **Create a portfolio:**
   - Log in to your account
   - Go to portfolio editor
   - Enter a custom subdomain (e.g., "myportfolio")
   - Save and publish

2. **Access the portfolio:**
   - Visit `https://myportfolio.portiqqo.me`
   - Should display your portfolio

3. **Check logs if issues:**
   ```bash
   # Nginx logs
   sudo tail -f /var/log/nginx/portfolio-subdomain-error.log
   
   # Backend logs
   pm2 logs backend
   ```

## Troubleshooting

### Issue: "Portfolio not found"
- **Check DNS**: Verify wildcard DNS record is active
- **Check subdomain**: Subdomain should only contain lowercase letters, numbers, and hyphens
- **Check database**: Verify portfolio exists with `isPublished: true`

### Issue: SSL Certificate Error
- Ensure wildcard certificate includes `*.portiqqo.me`
- Update nginx SSL paths if using different certificate
- Reload nginx after certificate renewal

### Issue: 502 Bad Gateway
- Backend might not be running: `pm2 status`
- Check backend logs: `pm2 logs backend`
- Verify backend is listening on port 5001

### Issue: Page shows 404
- Nginx might not be routing correctly
- Verify `/etc/nginx/sites-enabled/subdomain-portiqqo` exists
- Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`

## Backward Compatibility

The system supports both URL formats:
- **New**: `username.portiqqo.me` (subdomain-based)
- **Old**: `portiqqo.me/username` (path-based - still works)

The frontend automatically detects which format is being used.

## Features

### User Benefits
1. **Custom Subdomain**: Users can choose their own subdomain (e.g., "portfolio", "work", "showcase")
2. **Professional URLs**: Cleaner, more professional-looking portfolio links
3. **Branding**: Better personal branding with custom subdomain

### System Benefits
1. **Scalability**: Each portfolio gets its own subdomain
2. **SEO**: Better SEO with dedicated subdomains
3. **Analytics**: Easier to track individual portfolio performance

## Example Flow

1. User signs up: "John Smith"
2. Creates portfolio in editor
3. Enters custom subdomain: "johnsmith"
4. System validates and saves: `johnsmith.portiqqo.me`
5. Publishes portfolio
6. Portfolio accessible at: `https://johnsmith.portiqqo.me`

If user doesn't enter a subdomain, system auto-generates from name: `john-smith.portiqqo.me`

## Security Notes

- Subdomains are validated to prevent malicious input
- Only lowercase letters, numbers, and hyphens allowed
- System ensures subdomain uniqueness
- Wildcard SSL certificate secures all subdomains
