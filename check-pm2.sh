#!/bin/bash

# Check PM2 processes
echo "📋 Current PM2 processes:"
pm2 list

echo ""
echo "🔍 If you see your backend process, restart it with:"
echo "pm2 restart <process-name-or-id>"
echo ""
echo "If no processes exist, start the backend with:"
echo "pm2 start server.js --name backend-portiqqo"
