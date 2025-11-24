#!/bin/bash

# Serve form-template fat bundle for local development
# Usage: ./serve-dev.sh

echo "🚀 Starting Form Template Development Server..."
echo ""

# Check if dist/ exists
if [ ! -d "dist" ]; then
  echo "❌ dist/ directory not found"
  echo "   Run: npm run build"
  exit 1
fi

# Check if form.js exists
if [ ! -f "dist/form.js" ]; then
  echo "❌ dist/form.js not found"
  echo "   Run: npm run build"
  exit 1
fi

echo "✅ Fat bundle found: dist/form.js"
echo ""
echo "📝 Edit dist/dev.html to configure your dev credentials:"
echo "   - Line 55: devUsername (your Dashboard email)"
echo "   - Line 56: devPassword (your Dashboard password)"
echo "   - Line 57: devApiUrl (your tenant API URL)"
echo ""
echo "🌐 Starting HTTP server on port 8081..."
echo ""
echo "   URL: http://localhost:8081/dev.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd dist
python3 -m http.server 8081
