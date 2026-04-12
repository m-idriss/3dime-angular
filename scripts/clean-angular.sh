#!/bin/bash

echo "🚀 Full Angular project cleanup and update..."

# 1. Remove temporary folders and lock files
echo "🧹 Removing node_modules, dist, cache, and lock files..."
rm -rf node_modules dist .angular cache package-lock.json

# 2. Clean npm cache
echo "🧼 Cleaning npm cache..."
npm cache clean --force

# 3. Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# 4. Update Angular core and CLI
echo "⬆️ Updating Angular core and CLI..."
npx ng update @angular/core @angular/cli --force

# 5. Check and update other dependencies
echo "🔍 Checking for outdated dependencies..."
npm outdated || true

echo "📦 Updating outdated dependencies..."
npm update

# 6. Optional: full dependency update with npm-check-updates
if command -v ncu >/dev/null 2>&1; then
  echo "⚙️ Performing full dependency update via npm-check-updates..."
  npx npm-check-updates -u
  npm install
else
  echo "ℹ️ npm-check-updates not installed."
  echo "   To perform a full upgrade, run:"
  echo "   npm install -g npm-check-updates && npx npm-check-updates -u && npm install"
fi

# 7. Verify build
echo "🧪 Verifying project build..."
npx ng build

# 8. Optional: lint and format
if [ -f "./.prettierrc" ] || [ -f "./.prettierrc.json" ]; then
  echo "✨ Formatting code with Prettier..."
  npx prettier --write .
fi

if [ -f "./angular.json" ]; then
  echo "🔧 Running Angular lint..."
  npx ng lint --fix || true
fi

echo "✅ Cleanup and update completed successfully!"
