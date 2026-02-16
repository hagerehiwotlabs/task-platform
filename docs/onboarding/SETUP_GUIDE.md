# Hagere Hiwot Labs Task Platform - Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites Check
```bash
# Verify you have required tools
git --version          # Should be 2.x+
node --version         # Should be 20.x+
npm --version          # Should be 10.x+
docker --version       # Should be 20.x+
docker compose version # Should be 2.x+
```

### One-Command Setup
```bash
# 1. Clone the repository
git clone https://github.com/Hagere Hiwot Labs/hagerehiwotlabs-task-platform.git
cd hagerehiwotlabs-task-platform

# 2. Run the setup script
./scripts/setup.sh

# That's it! Everything will be installed and started automatically.
```

> **Note**
> Most setup steps are one-time only. Day-to-day development typically involves:
> - Pulling latest changes
> - Running `npm install` if dependencies change
> - Starting services with `npm run docker:up` and `npm run dev`

## 📋 Detailed Setup Instructions

### Step 1: Install Prerequisites

#### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install tools
brew install git node@20 docker docker compose gh

# Link Node.js
brew link node@20

# Install Volta (recommended for Node version management)
curl https://get.volta.sh | bash
volta install node@20 npm@10
```

#### Windows
1. **Git**: Download from [git-scm.com](https://git-scm.com/download/win)
2. **Node.js**: Download LTS version from [nodejs.org](https://nodejs.org)
3. **Docker Desktop**: Download from [docker.com](https://docker.com)
4. **GitHub CLI**: Download from [cli.github.com](https://cli.github.com)
5. **VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com)

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt-get update

# Install Git
sudo apt-get install git

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
sudo apt-get install docker.io docker compose

# Install GitHub CLI
type -p curl >/dev/null || sudo apt install curl -y
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y
```

### Step 2: Clone Repository
```bash
# Clone with HTTPS 
git clone https://github.com/Hagere Hiwot Labs/hagerehiwotlabs-task-platform.git

# Navigate to project
cd hagerehiwotlabs-task-platform

# Verify you're in the right place
ls -la
# Should see: apps/ packages/ docs/ docker compose.yml package.json
```

### Step 3: Install Dependencies
```bash
# Install root dependencies
npm install

# This will install dependencies for:
# - Root project (development tools)
# - All apps (frontend, backend)
# - All packages (contracts, ui, etc.)
```

### Step 4: Start Development Services
```bash
# Start database, Redis, and management UIs
npm run docker:up

# Wait for services to start (check with:)
docker compose ps

# All services should show "Up" status
```

### Step 5: Setup Database
```bash
# Generate Prisma client
npm run prisma:generate --workspace=apps/backend

# Run migrations
npm run prisma:migrate --workspace=apps/backend

# Seed database with test data
npm run prisma:seed --workspace=apps/backend

# Verify database is accessible
npm run prisma:studio --workspace=apps/backend
# This will open Prisma Studio in your browser
```

### Step 6: Build Shared Packages
```bash
# Build contracts package
npm run build --workspace=packages/contracts

# Build UI package
npm run build --workspace=packages/ui

# Verify types are generated
ls packages/contracts/src/generated/types.ts
# Should see the generated TypeScript file
```

### Step 7: Start Development
```bash
# Start both frontend and backend
npm run dev

# OR start separately
npm run dev:frontend  # Frontend only (http://localhost:5173)
npm run dev:backend   # Backend only (http://localhost:3000)
```

## 🎯 Verification Steps

### Verify Everything is Working
```bash
# 1. Check services are running
docker compose ps
# Should show all services as "Up"

# 2. Check frontend is accessible
curl -I http://localhost:5173
# Should return HTTP 200

# 3. Check backend API is accessible
curl -I http://localhost:3000/api/v1/health
# Should return HTTP 200

# 4. Check database connection
curl -s http://localhost:3000/api/v1/health | jq .status
# Should return "healthy"

# 5. Run tests
npm run test
# All tests should pass

# 6. Check TypeScript compilation
npm run type-check
# Should show no errors
```

### Expected URLs After Setup
| Service | URL | What to Expect |
|---------|-----|----------------|
| Frontend | http://localhost:5173 | React application with login screen |
| Backend API | http://localhost:3000 | NestJS API server |
| API Documentation | http://localhost:3000/api/docs | Interactive Swagger UI |
| Health Check | http://localhost:3000/api/v1/health | JSON health status |
| PostgreSQL | localhost:5432 | Database server |
| pgAdmin | http://localhost:5050 | Database management UI |
| Redis | localhost:6379 | Redis cache server |
| Redis Commander | http://localhost:8081 | Redis management UI |

### Test Credentials
After seeding (in development only) you can login with:
- **Email**: `test@hagerehiwotlabs.dev`
- **Password**: `SecurePass123!`

## 🔧 Troubleshooting Setup

### Common Issues and Solutions

#### Issue: Docker not starting
```bash
# Check Docker Desktop is running
# On macOS: Check Docker icon in menu bar
# On Windows: Check Docker Desktop application

# Restart Docker
# On macOS: Click Docker icon → Restart
# On Windows: Restart Docker Desktop

# Check Docker service
docker ps
# Should show running containers
```

#### Issue: Port already in use
```bash
# Check what's using the port
# Port 5432 (PostgreSQL)
lsof -i :5432

# Port 3000 (Backend)
lsof -i :3000

# Port 5173 (Frontend)
lsof -i :5173

# Kill process using the port
kill -9 <PID>

# OR change port in .env file
# Edit apps/backend/.env or apps/frontend/.env
```

#### Issue: Database connection failed
```bash
# Check PostgreSQL is running
docker compose ps | grep postgres

# Reset database
npm run db:reset

# Check .env file
cat apps/backend/.env
# Should have: DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hagerehiwotlabs_task

# Test database connection
docker compose exec postgres psql -U postgres -d hagerehiwotlabs_task -c "SELECT 1"
```

#### Issue: Node/npm version mismatch
```bash
# Check Node version
node --version
# Should be 20.x

# Check npm version
npm --version
# Should be 9.x or 10.x

# Use Volta to manage versions (recommended)
volta install node@20
volta install npm@10

# OR use nvm
nvm install 20
nvm use 20
```

#### Issue: TypeScript errors after clone
```bash
# Clean and reinstall
npm run clean
npm install

# Regenerate types
npm run generate:types

# Rebuild packages
npm run build --workspace=packages/contracts
npm run build --workspace=packages/ui
```

#### Issue: Git hooks not working
```bash
# Install husky hooks
npm run prepare

# Make hooks executable
chmod +x .husky/*

# Test pre-commit hook
git add .
git commit -m "Test commit"
# Should run linting and formatting
```

### Platform-Specific Issues

#### macOS Specific
```bash
# If you get "Permission denied" for Docker
sudo chmod 666 /var/run/docker.sock

# If you get "Too many open files"
sudo launchctl limit maxfiles 65536 200000
ulimit -n 65536
```

#### Windows Specific
1. **WSL 2 required**: Docker Desktop requires WSL 2
2. **Line endings**: Configure Git for LF line endings
   ```bash
   git config --global core.autocrlf false
   ```
3. **File watching**: Increase file watcher limits
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

#### Linux Specific
```bash
# Docker permissions
sudo usermod -aG docker $USER
# Log out and back in

# File watcher limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 🔐 Environment Configuration

### Required Environment Variables
Create `.env` files based on examples:

#### Backend (.env)
```bash
# Copy example
cp apps/backend/.env.example apps/backend/.env

# Edit with your values
code apps/backend/.env
```

#### Frontend (.env)
```bash
# Copy example
cp apps/frontend/.env.example apps/frontend/.env

# Usually no changes needed for development
```

### Important Variables
| Variable | Purpose | Development Value |
|----------|---------|-------------------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://postgres:postgres@localhost:5432/hagerehiwotlabs_task` |
| `JWT_SECRET` | JWT signing key | `development-secret-change-in-production` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:5173` |
| `NODE_ENV` | Environment | `development` |

## 🛠️ Development Tools Setup

### VS Code (Recommended)
1. **Install VS Code**: [Download here](https://code.visualstudio.com/)
2. **Install extensions**:
   ```bash
   # Essential extensions
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension prisma.prisma
   code --install-extension bradlc.vscode-tailwindcss
   code --install-extension eamodio.gitlens
   code --install-extension ms-azuretools.vscode-docker
   
   # Optional but helpful
   code --install-extension formulahendry.auto-rename-tag
   code --install-extension streetsidesoftware.code-spell-checker
   code --install-extension visualstudioexptteam.vscodeintellicode
   ```

3. **Configure settings**:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "eslint.validate": [
       "javascript",
       "javascriptreact",
       "typescript",
       "typescriptreact"
     ],
     "typescript.preferences.importModuleSpecifier": "relative"
   }
   ```

### Other Editors
- **WebStorm**: Excellent TypeScript/React support
- **Neovim/Vim**: Custom configuration available
- **Sublime Text**: With appropriate plugins

### Browser Extensions
1. **React Developer Tools**: React debugging
2. **Redux DevTools**: State management debugging
3. **JSON Formatter**: Better JSON viewing
4. **Reactime**: React performance profiling


## 🔄 Update Instructions

### Updating from Previous Version
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Update Docker images
docker compose pull

# Rebuild if needed
docker compose up -d --build

# Run migrations if database changed
npm run db:migrate

# Rebuild packages
npm run build --workspaces
```

### Regular Maintenance
```bash
# Weekly: Update dependencies
npm update

# Monthly: Clean Docker resources
docker system prune -a

# Quarterly: Review and update setup guide
# Check for new tool versions
# Update environment configurations
```

## 🧪 Testing Your Setup

### Comprehensive Test
```bash
#!/bin/bash
echo "🔍 Running comprehensive setup test..."

# Test 1: Docker services
echo "1. Testing Docker services..."
docker compose ps | grep -q "Up"
if [ $? -eq 0 ]; then echo "✅ Docker services running"; else echo "❌ Docker services failed"; exit 1; fi

# Test 2: Database connection
echo "2. Testing database connection..."
curl -s http://localhost:3000/api/v1/health | grep -q "healthy"
if [ $? -eq 0 ]; then echo "✅ Database connected"; else echo "❌ Database connection failed"; exit 1; fi

# Test 3: Frontend server
echo "3. Testing frontend server..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200"
if [ $? -eq 0 ]; then echo "✅ Frontend server running"; else echo "❌ Frontend server failed"; exit 1; fi

# Test 4: Backend API
echo "4. Testing backend API..."
curl -s http://localhost:3000/api/v1/health/liveness | grep -q "UP"
if [ $? -eq 0 ]; then echo "✅ Backend API running"; else echo "❌ Backend API failed"; exit 1; fi

# Test 5: TypeScript compilation
echo "5. Testing TypeScript compilation..."
npm run type-check > /dev/null 2>&1
if [ $? -eq 0 ]; then echo "✅ TypeScript compilation passed"; else echo "❌ TypeScript compilation failed"; exit 1; fi

# Test 6: Tests passing
echo "6. Running tests..."
npm run test > /dev/null 2>&1
if [ $? -eq 0 ]; then echo "✅ Tests passed"; else echo "❌ Tests failed"; exit 1; fi

echo "🎉 All tests passed! Setup is complete and working correctly."
```

### Quick Health Check
```bash
# One-line health check
curl -f http://localhost:3000/api/v1/health && \
  curl -f http://localhost:5173 > /dev/null && \
  docker compose ps | grep -q "Up" && \
  echo "✅ All systems healthy" || echo "❌ Health check failed"
```

## 📞 Getting Help

### When to Ask for Help
- **Setup takes >30 minutes**: Ask in #tech-help
- **Error messages you don't understand**: Screenshot and ask
- **Missing dependencies**: Check this guide first, then ask
- **Platform-specific issues**: Mention your OS

### What Information to Provide
```bash
# When asking for help, provide:
1. Your operating system and version
2. Error messages (copy-paste, not screenshot)
3. Steps you've already tried
4. Output of these commands:
   - node --version
   - npm --version
   - docker --version
   - docker compose ps
   - cat apps/backend/.env
```

### Support Channels
1. **#tech-help**: Technical setup issues
2. **#general**: General questions
3. **Team lead**: If stuck for >1 hour
4. **GitHub Issues**: For bugs in setup process

## 🎓 Next Steps After Setup

### 1. Explore the Application
```bash
# 1. Open frontend
open http://localhost:5173

# 2. Login with test credentials
# Email: test@hagerehiwotlabs.dev
# Password: SecurePass123!

# 3. Explore API documentation
open http://localhost:3000/api/docs

# 4. Check database content
npm run prisma:studio --workspace=apps/backend
```

### 2. Make Your First Change
```bash
# 1. Create a branch
git checkout -b docs/update-readme-$(whoami)

# 2. Make a small change
# Edit README.md or similar documentation

# 3. Commit and push
git add .
git commit -m "docs: Update README with additional info"
git push -u origin docs/update-readme-$(whoami)

# 4. Create PR on GitHub
gh pr create --title "docs: Update README" --body "Updated README with..."
```

### 3. Learn the Codebase
```bash
# 1. Explore architecture
code docs/architecture/README.md

# 2. Understand API design
code docs/architecture/API_DESIGN.md

# 3. Review team processes
code docs/team/TEAM_RULES.md

```

### 4. Start Coding

**Congratulations! Your development environment is now set up. Welcome to the team! 🎉**

---

## 🔗 Quick Reference Commands
```bash
# Setup
./scripts/setup.sh                    # Complete setup
npm install                           # Install dependencies
npm run docker:up                     # Start services

# Development
npm run dev                           # Start everything
npm run dev:frontend                  # Frontend only
npm run dev:backend                   # Backend only

# Database
npm run db:setup                      # Setup database
npm run prisma:studio                 # Database GUI

# Testing
npm run test                          # Run tests
npm run test:coverage                 # Tests with coverage

# Maintenance
npm run clean                         # Clean everything
npm update                            # Update dependencies
docker system prune -a                # Clean Docker
```

## 📅 Version History

* **Version**: 1.0
* **Last Updated**: 2026-02-10


