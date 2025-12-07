#!/bin/bash
set -e

echo "🚀 Starting full system..."

# 1. Install packages if needed
echo "📦 Installing dependencies..."
npm install

# 2. Build TypeScript
echo "🏗 Building TypeScript..."
npm run build

# 3. Start containers
echo "🐋 Starting Docker stack..."
docker compose up -d --build

# 4. Wait for containers
echo "⏳ Waiting for services to boot..."
sleep 2

# 5. Show tracking service logs
echo "📡 Tracking service logs:"
docker logs -f tracking-ts

