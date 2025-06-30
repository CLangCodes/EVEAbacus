#!/bin/bash
# Build and deploy Next.js app (standalone mode)
# Usage: ./build-deploy-standalone.sh /path/to/deploy

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

# Copy standalone output
cp -r .next/standalone "$DEPLOY_DIR/"
cp -r .next/static "$DEPLOY_DIR/"
cp .next/BUILD_ID "$DEPLOY_DIR/standalone/.next/" 2>/dev/null || true
[ -d public ] && cp -r public "$DEPLOY_DIR/"
[ -f .env ] && cp .env "$DEPLOY_DIR/"

# Optionally copy next.config.js/ts if needed for runtime
[ -f next.config.js ] && cp next.config.js "$DEPLOY_DIR/"
[ -f next.config.ts ] && cp next.config.ts "$DEPLOY_DIR/"

echo "Standalone deployment files copied to $DEPLOY_DIR."
echo "To start the app:"
echo "  cd $DEPLOY_DIR/standalone && node server.js" 