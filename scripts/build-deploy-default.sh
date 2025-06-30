#!/bin/bash
# Build and deploy Next.js app (default mode)
# Usage: ./build-deploy-default.sh /path/to/deploy

set -e

DEPLOY_DIR="$1"
if [ -z "$DEPLOY_DIR" ]; then
  echo "Usage: $0 /path/to/deploy"
  exit 1
fi

# Build the app
pnpm install
pnpm build

# Prepare deployment directory
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
cp -r .next "$DEPLOY_DIR/"
cp -r node_modules "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp pnpm-lock.yaml "$DEPLOY_DIR/" 2>/dev/null || true
[ -d public ] && cp -r public "$DEPLOY_DIR/"
[ -f .env ] && cp .env "$DEPLOY_DIR/"
[ -f next.config.js ] && cp next.config.js "$DEPLOY_DIR/"
[ -f next.config.ts ] && cp next.config.ts "$DEPLOY_DIR/"

echo "Deployment files copied to $DEPLOY_DIR."
echo "To start the app:"
echo "  cd $DEPLOY_DIR && pnpm install --prod && pnpm start" 