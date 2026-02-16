# Hagere Hiwot Labs Task Platform - Developer Guide

## 🎯 Introduction

Welcome to the **Hagere Hiwot Labs Task Platform Developer Guide**.

This document provides developers with everything needed to work effectively on the project, including architecture overview, development workflows, coding standards, testing practices, and troubleshooting tips. It is intended to be **clear, practical, and safe for public repositories**, while remaining useful for real-world development.

---

## ⚡ Quick Start (5 Minutes)

```bash
git clone https://github.com/Hagere Hiwot Labs/hagerehiwotlabs-task-platform.git
cd hagerehiwotlabs-task-platform
npm install
npm run docker:up
npm run dev # Start all services

# OR
npm run dev:frontend      # Frontend only
npm run dev:backend       # Backend only
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **API Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

For advanced setup and workflows, continue reading below.

---

## 📁 Project Structure

### Monorepo Layout

```
hagerehiwotlabs-task-platform/
├── apps/                          # Applications
│   ├── frontend/                  # React application
│   └── backend/                   # NestJS API
├── packages/                      # Shared packages
│   ├── contracts/                 # API contracts and types
│   ├── ui/                        # Shared UI components
│   └── database/                  # Shared database utilities
├── docs/                          # Documentation
├── scripts/                       # Development scripts
└── .github/                       # CI/CD workflows
```

### Key Directories

| Path                      | Purpose               |
| ------------------------- | --------------------- |
| `apps/frontend/src/`      | Frontend source code  |
| `apps/backend/src/`       | Backend source code   |
| `packages/contracts/src/` | API contracts         |
| `packages/ui/src/`        | Shared UI components  |
| `docs/`                   | Project documentation |
| `.github/workflows/`      | CI/CD pipelines       |

---

## 🛠️ Development Workflow

### Daily Workflow

```bash
git checkout main
git pull origin main
npm run docker:up
npm run dev
```

- Work in small, focused commits
- Keep your branch up to date with `main`
- Run tests before pushing changes

### Feature Development Flow

1. Create or pick an issue
2. Create a branch from `main`
3. Implement changes with tests
4. Commit using Conventional Commits
5. Push branch and open a Pull Request
6. Address review feedback
7. Squash and merge
8. Delete branch after merge

### Branch Naming

```
feature/short-description
bugfix/short-description
hotfix/critical-fix
chore/maintenance-task
docs/documentation-update
refactor/module-name
```

### Commit Message Convention

```
<type>: short description

Optional detailed explanation.
```

**Allowed types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

Example:

```bash
git commit -m "feat(auth): add refresh token support"
```

---

## 💻 Local Development

### Running Services

```bash
npm run dev               # Start all services
npm run dev:frontend      # Frontend only
npm run dev:backend       # Backend only
npm run docker:up         # Infrastructure services only
```

### Environment Configuration

- Copy `.env.example` files to `.env`
- Never commit secrets
- Use different values per environment

---

## 🧪 Testing

### Running Tests

```bash
npm run test
npm run test:coverage
npm run test --workspace=apps/frontend
npm run test --workspace=apps/backend
```

### Testing Principles

1. Test behavior, not implementation
2. Keep tests independent
3. Mock external services
4. Cover edge cases
5. Maintain clean test data

---

## 🔍 Debugging

### Frontend

- Use React Developer Tools
- Inspect network requests
- Check TypeScript errors

### Backend

```bash
npm run start:debug
npm run docker:logs
```

---

## 📦 Package & Workspace Management

```bash
npm install                         # Install all dependencies
npm install axios --workspace=apps/frontend
npm run build --workspace=packages/contracts
```

Dependency types:

- `dependencies`: production code
- `devDependencies`: development tooling
- `peerDependencies`: required by consumers
- `workspace:*`: local packages

---

## 🐳 Docker Development

```bash
docker compose up -d
docker compose down
docker compose logs -f
docker compose ps
```

Docker is used **only for local development and infrastructure services**. Production deployment may differ.

---

## 🔒 Security Practices

- Never commit secrets
- Validate all user input
- Use environment variable validation
- Keep dependencies up to date
- Follow the Code of Conduct

---

## 📝 Code Quality Standards

```bash
npm run lint
npm run format
npm run type-check
```

Standards:

- TypeScript strict mode
- ESLint enforced rules
- Prettier formatting
- Clear naming conventions
- Documentation for public APIs

---

## 🔄 CI/CD Overview

Pipeline stages:

1. Validation (lint, types, formatting)
2. Testing
3. Build
4. Security checks
5. Deployment

All Pull Requests must pass CI before merge.

---

## 🚀 Performance Guidelines

### Frontend

- Code splitting and lazy loading
- Memoization where appropriate
- Avoid unnecessary re-renders

### Backend

- Efficient database queries
- Proper indexing
- Caching for hot paths

---

## 🆘 Troubleshooting

### Common Fixes

```bash
npm run clean
npm install
npm run build
```

- Regenerate types if contracts change
- Restart Docker if services are unreachable
- Check environment variables

---

## 📚 Documentation Guidelines

- Keep docs up to date
- Use clear headings
- Include examples
- Link related documents

---

## 🔗 Useful Commands

```bash
npm run dev
npm run test
npm run build
npm run docker:up
npm run lint
```

---

## 📅 Version History

- **Version**: 1.0
- **Last Updated**: 2026-02-10
