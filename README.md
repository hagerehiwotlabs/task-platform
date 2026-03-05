# Hagere Hiwot Labs Task Platform 🚀

A **production‑ready task management platform** built with modern technologies.  
Designed for **parallel team development**, **contract‑first APIs**, and **enterprise‑grade quality** from day one.

---

## ✨ Features

- **🔐 Secure Authentication** – JWT with Redis blacklist, rate limiting, and security headers.
- **📁 Project Management** – Create, update, and delete projects with ease.
- **📝 Task Tracking** – Full CRUD for tasks, assignees, priorities, and statuses.
- **👥 Team Collaboration** – Real‑time updates, notifications, and clear ownership.
- **📊 Analytics Ready** – Built‑in pagination, filtering, and future reporting.
- **🎨 Modern UI** – Responsive design with shared component library (Tailwind + Radix UI).

---

## 🛠️ Tech Stack

| Layer          | Technology                                                                 |
|----------------|----------------------------------------------------------------------------|
| **Frontend**   | React 18 + TypeScript + Vite + TanStack Query + Tailwind CSS               |
| **Backend**    | NestJS + TypeScript + PostgreSQL + Prisma + Redis                          |
| **API**        | OpenAPI 3.0 (contract‑first) + generated TypeScript types                  |
| **Monorepo**   | NPM Workspaces + Turborepo                                                  |
| **DevOps**     | Docker + Docker Compose + GitHub Actions (CI/CD)                            |
| **Testing**    | Vitest + MSW + Coverage enforcement (80% min)                               |
| **Security**   | Helmet, CSP, JWT, rate limiting, input validation, secure headers          |

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/hagerehiwotlabs/task-platform.git
cd task-platform

# 2. Run the automated setup script
./scripts/setup.sh

# 3. Start development (frontend + backend + databases)
npm run dev
```

After running, open:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **pgAdmin:** [http://localhost:5050](http://localhost:5050) (admin@hagerehiwotlabs.dev / admin)
- **Redis Commander:** [http://localhost:8081](http://localhost:8081)

---

## 📁 Project Structure

```
task-platform/
├── apps/
│   ├── frontend/          # React + Vite application
│   └── backend/           # NestJS API
├── packages/
│   ├── contracts/         # OpenAPI spec + generated TypeScript types
│   ├── ui/                # Shared React component library (tsup)
│   └── database/          # Prisma schema + migrations (shared)
├── docs/                  # Team & architecture documentation
├── scripts/               # Development automation scripts
├── .github/               # CI/CD workflows
└── docker-compose*.yml    # Development & production compose files
```

---

## 🔄 Development Workflow

### Branching & Commits

- **Branch naming:** `feature/description-initials`, `bugfix/description-initials`
- **Commit convention:** `[type]: brief description`  
  Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Running Tests

```bash
# Entire monorepo
npm run test

# With coverage
npm run test:coverage

# Single package
npm run test --workspace=apps/frontend
```

### Code Quality Gates

- ✅ Pre‑commit hooks run ESLint, Prettier, and contract validation.
- ✅ CI enforces 80% test coverage minimum.
- ✅ PRs require at least one approval and passing checks.

---

## 🐳 Docker Support

| Environment | Command                     | Services                            |
|-------------|-----------------------------|-------------------------------------|
| Development | `docker-compose up -d`      | PostgreSQL, Redis, pgAdmin, Redis‑Commander |
| Production  | `docker-compose -f docker-compose.prod.yml up -d` | Full stack with nginx |

---

## 📚 Documentation

All documentation lives in the `/docs` folder and is version‑controlled.

- [Team Rules & Processes](docs/team/README.md)
- [Architecture Decisions (ADRs)](docs/architecture/README.md)
- [Developer Onboarding Guide](docs/onboarding/README.md)

---

## 📄 [MIT](LICENSE) © [Hagere Hiwot Labs](https://github.com/hagerehiwotlabs)

---

**Built with ❤️ by the Hagere Hiwot Labs Team**  
[GitHub Organization](https://github.com/hagerehiwotlabs) · [Team Telegram](https://t.me/hagerehiwotlabs_team)
