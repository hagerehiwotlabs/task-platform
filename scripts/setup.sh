#!/bin/bash
set -e

echo "🚀 Setting up HagereHiwotLabs Task Platform..."
echo "=============================================="


# Start Docker services
echo "🐳 Starting Docker services..."
docker compose up -d --wait

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Setup backend
echo "⚙️  Setting up backend..."
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
cd ../..

# Build shared packages
echo "📦 Building shared packages..."
npm run build --workspace=packages/contracts
npm run build --workspace=packages/ui

# Validate contracts
echo "📄 Validating contracts..."
npm run validate:contracts

# Run health check
echo "🩺 Running health check..."
curl -f http://localhost:3000/api/v1/health || echo "⚠️  Health check failed, but continuing..."

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📡 Services are now running:"
echo "   Frontend:    http://localhost:5173"
echo "   Backend API: http://localhost:3000"
echo "   API Docs:    http://localhost:3000/api/docs"
echo "   PostgreSQL:  localhost:5432"
echo "   Redis:       localhost:6379"
echo "   pgAdmin:     http://localhost:5050 (admin@hagerehiwotlabs.dev / admin)"
echo "   Redis UI:    http://localhost:8081"
echo ""
echo "🚀 Start development:"
echo "   npm run dev"
echo ""
echo "🧪 Run tests:"
echo "   npm run test"
echo ""
echo "📊 Check coverage:"
echo "   npm run test:coverage"
