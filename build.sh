#!/bin/bash
set -e

echo "🧹 Cleaning up..."
rm -rf dist .vercel .astro

echo "🔧 Installing dependencies..."
npm ci

echo "🏗️ Building static site..."
npm run build

echo "✅ Build complete! Site is ready for static deployment."
ls -la dist/