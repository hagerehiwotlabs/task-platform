#!/bin/bash
echo "🔍 Hagere Hiwot Labs Task Platform - Verification Script"
echo "====================================================="
echo ""
echo "📁 Directory Structure:"
echo "----------------------"
find . -maxdepth 3 -type d | sort
echo ""
echo "📋 Configuration Files:"
echo "----------------------"
ls -la package.json turbo.json .nvmrc .npmrc .prettierrc .eslintrc.json .lintstagedrc.json
echo ""
echo "🐳 Docker Files:"
echo "---------------"
ls -la docker-compose.yml docker-compose.prod.yml Dockerfile.* nginx.conf 2>/dev/null || echo "Docker files not found"
echo ""
echo "📜 Scripts:"
echo "----------"
ls -la scripts/
echo ""
echo "📦 Package Count:"
echo "----------------"
find . -name "package.json" | wc -l
echo ""
echo "✅ Verification complete!"
