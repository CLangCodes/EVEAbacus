#!/bin/bash

# EVEAbacus Deployment Script
# This script handles both backend and frontend deployment with error checking

set -e  # Exit on any error

echo "🚀 Starting EVEAbacus deployment..."

# Navigate to your project directory
cd /var/www/eveabacus

echo "📁 Current directory: $(pwd)"

# Pull latest changes (only if it's already a git repo)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes from git..."
    git pull origin main
else
    echo "⚠️  Not a git repository, skipping git pull"
    echo "   If this is the first deployment, you may need to clone the repository first"
fi

# Build and restart backend
if [ -d "EVEAbacus.WebUI" ]; then
    echo "🔨 Building backend (.NET)..."
    cd EVEAbacus.WebUI
    dotnet publish --configuration Release --output /var/www/eveabacus
    cd ..
    echo "✅ Backend build completed"
else
    echo "❌ EVEAbacus.WebUI directory not found"
    echo "   Expected path: /var/www/eveabacus/EVEAbacus.WebUI"
    exit 1
fi

# Restart the backend service
echo "🔄 Restarting backend service..."
if sudo systemctl restart eveabacus; then
    echo "✅ Backend service restarted successfully"
else
    echo "⚠️  Failed to restart backend service (continuing anyway)"
fi

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 pnpm version: $(pnpm --version)"

# Build and deploy frontend
if [ -d "eve-abacus-webui" ]; then
    echo "🔨 Building frontend (Next.js)..."
    cd eve-abacus-webui
    
    echo "📦 Installing frontend dependencies..."
    pnpm install
    
    echo "🏗️  Building frontend..."
    pnpm build
    
    echo "📋 Copying built frontend to main directory..."
    if [ -d ".next" ]; then
        sudo cp -r .next /var/www/eveabacus/
        echo "✅ Frontend files copied successfully"
    else
        echo "❌ .next directory not found after build"
        exit 1
    fi
    
    cd ..
    echo "✅ Frontend build and deployment completed"
else
    echo "❌ eve-abacus-webui directory not found"
    echo "   Expected path: /var/www/eveabacus/eve-abacus-webui"
    echo "   Current directory contents:"
    ls -la
    exit 1
fi

# Reload nginx
echo "🔄 Reloading nginx..."
if sudo systemctl reload nginx; then
    echo "✅ Nginx reloaded successfully"
else
    echo "⚠️  Failed to reload nginx (continuing anyway)"
fi

echo "🎉 Deployment completed successfully!"
echo "📊 Summary:"
echo "   - Backend: Built and restarted"
echo "   - Frontend: Built and deployed"
echo "   - Nginx: Reloaded"
echo ""
echo "🌐 Your application should now be available!" 