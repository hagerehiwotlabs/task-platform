# ⚙️ Backend Developer Guide – Hager Hiwot Labs Task Platform

Welcome to the backend team! This guide will walk you through everything you need to know to be productive in our monorepo setup.

---

## **📦 What You'll Work With**

- **`apps/backend/`** – The main NestJS application.
- **`packages/contracts/`** – OpenAPI spec and **generated TypeScript types** for the entire API.  
  You'll both consume and update these types when you change the API.
- **PostgreSQL** – via Docker Compose, with **Prisma** as the ORM.
- **Redis** – for token blacklisting and rate limiting (optional but production-ready).
- **Swagger** – auto‑generated API docs at `http://localhost:3000/api/docs`.

All backend code is written in **TypeScript** with strict mode enabled.

---

## **🚀 1. Getting Started (One‑time Setup)**

If you haven't already:

```bash
# Clone the monorepo
git clone https://github.com/hagerehiwotlabs/task-platform.git
cd task-platform

# Run the setup script (installs deps, starts Docker, runs migrations)
./scripts/setup.sh

# Start the development servers (frontend + backend)
npm run dev
```

Now the backend is running at `http://localhost:3000`.  
You can test it by visiting `http://localhost:3000/api/v1/health` or the Swagger UI at `http://localhost:3000/api/docs`.

---

## **🎯 2. Your Daily Workflow**

### **A. Start the Day**

```bash
cd ~/task-platform
git checkout develop
git pull origin develop
npm run dev   # starts both frontend (5173) and backend (3000)
```

If you only want to run the backend (and maybe the database), you can:

```bash
npm run docker:up         # start PostgreSQL and Redis
npm run dev:backend       # start only the NestJS server
```

### **B. Pick a Task**

- Go to the [GitHub Issues](https://github.com/hagerehiwotlabs/task-platform/issues) page.
- Look for issues labeled `backend` or `good-first-issue`.
- Assign yourself, read the description, and clarify any questions in Telegram.

### **C. Create a Feature Branch**

```bash
git checkout -b feature/add-login-endpoint-yourinitials
```

Branch naming: `feature/`, `bugfix/`, `hotfix/`, `chore/`, `docs/` + short description + your initials.

### **D. Understand the Code Structure**

```
apps/backend/
├── prisma/                  # Prisma schema and migrations
├── src/
│   ├── config/              # Environment validation, security configs
│   ├── health/              # Health check endpoints
│   ├── modules/             # Feature modules (auth, projects, tasks, users)
│   │   ├── auth/            # Authentication module
│   │   ├── projects/        # Project module
│   │   ├── tasks/           # Task module
│   │   └── users/           # User module
│   ├── shared/              # Shared services (prisma, redis, etc.)
│   └── main.ts              # Entry point
├── test/                    # E2E tests
├── .env.example              # Example environment variables
└── package.json
```

We follow a **modular monolith** architecture: each feature has its own module with controllers, services, and DTOs.

### **E. Develop a New Endpoint**

Let's say you're implementing a new endpoint like `GET /projects/:projectId/tasks`. The steps:

1. **Check the OpenAPI spec** – it's the source of truth.  
   Look at `packages/contracts/src/openapi.yaml` to see the exact request/response shape.  
   If the endpoint isn't in the spec yet, you'll need to add it first (see section 3 below).

2. **Generate/use types** – run `npm run generate:types` if you changed the spec.  
   Then import the types in your code:

   ```ts
   import type { Task } from '@hagerehiwotlabs/contracts'
   ```

3. **Create/update the DTOs** – use `class-validator` to validate incoming data:

   ```ts
   // apps/backend/src/modules/tasks/dto/create-task.dto.ts
   import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator'
   import { TaskStatus, TaskPriority } from '@prisma/client'

   export class CreateTaskDto {
     @IsString()
     title: string

     @IsOptional()
     @IsString()
     description?: string

     @IsOptional()
     @IsEnum(TaskStatus)
     status?: TaskStatus

     @IsOptional()
     @IsEnum(TaskPriority)
     priority?: TaskPriority

     @IsOptional()
     @IsUUID()
     assigneeId?: string
   }
   ```

4. **Implement the controller**:

   ```ts
   // apps/backend/src/modules/tasks/tasks.controller.ts
   import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
   import { TasksService } from './tasks.service'
   import { CreateTaskDto } from './dto/create-task.dto'
   import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
   import { Task } from '@hagerehiwotlabs/contracts' // type only

   @Controller('projects/:projectId/tasks')
   @UseGuards(JwtAuthGuard)
   export class TasksController {
     constructor(private tasksService: TasksService) {}

     @Post()
     async create(
       @Param('projectId') projectId: string,
       @Body() dto: CreateTaskDto
     ): Promise<Task> {
       return this.tasksService.create(projectId, dto)
     }

     @Get()
     async findAll(@Param('projectId') projectId: string): Promise<Task[]> {
       return this.tasksService.findAll(projectId)
     }
   }
   ```

5. **Implement the service**:

   ```ts
   // apps/backend/src/modules/tasks/tasks.service.ts
   import { Injectable, NotFoundException } from '@nestjs/common'
   import { PrismaService } from '../../shared/prisma/prisma.service'
   import { CreateTaskDto } from './dto/create-task.dto'
   import { Task } from '@prisma/client'

   @Injectable()
   export class TasksService {
     constructor(private prisma: PrismaService) {}

     async create(projectId: string, dto: CreateTaskDto): Promise<Task> {
       // verify project exists
       const project = await this.prisma.project.findUnique({
         where: { id: projectId }
       })
       if (!project) throw new NotFoundException('Project not found')

       return this.prisma.task.create({
         data: {
           ...dto,
           projectId
         }
       })
     }

     async findAll(projectId: string): Promise<Task[]> {
       return this.prisma.task.findMany({
         where: { projectId }
       })
     }
   }
   ```

6. **Add the module wiring** – ensure the controller and service are registered in the module.

7. **Test the endpoint** (see Testing section below).

### **F. Working with Database (Prisma)**

**Prisma schema** is in `apps/backend/prisma/schema.prisma`.  
If you need to add a new field or model:

1. Edit the schema.
2. Run a migration:
   ```bash
   npm run prisma:migrate --workspace=apps/backend -- --name add_due_date_to_tasks
   ```
   This creates a SQL migration file and applies it locally.
3. Commit both the schema change **and** the migration folder.
4. Regenerate the Prisma client:
   ```bash
   npm run prisma:generate --workspace=apps/backend
   ```

**Seeding** – the database is seeded with sample data via `prisma/seed.ts`.  
Run `npm run prisma:seed` if you need to reset the sample data.

**Prisma Studio** – a GUI to browse data:  
```bash
npm run prisma:studio --workspace=apps/backend
```

> **If `prisma studio` doesn't open**, run:
> ```bash
> cd apps/backend
> npx prisma studio --url "postgresql://postgres:postgres@localhost:5432/hagerehiwotlabs_task"
> ```

### **G. Using Redis (for Token Blacklist & Rate Limiting)**

Redis is optional but available. The `RedisService` provides methods like `blacklistToken`, `isTokenBlacklisted`, and `checkRateLimit`.  
In development, if Redis isn't running, the service will log a warning and fall back to in‑memory (no blacklist) – this allows you to work without Redis.

To use Redis in your code, inject the service:

```ts
import { RedisService } from '../../shared/redis/redis.service'

@Injectable()
export class AuthService {
  constructor(private redis: RedisService) {}

  async logout(userId: string, token: string) {
    // Blacklist the token until it expires (e.g., 7 days)
    const expiresIn = 7 * 24 * 60 * 60 // seconds
    await this.redis.blacklistToken(token, expiresIn)
  }
}
```

### **H. Testing**

We use **Vitest** for unit and integration tests, and **supertest** for E2E tests.  
Tests live next to the files they test (`.spec.ts`) or in `test/` for E2E.

**Unit test example:**

```ts
// tasks.service.spec.ts
import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service'
import { PrismaService } from '../../shared/prisma/prisma.service'

describe('TasksService', () => {
  let service: TasksService
  let prisma: PrismaService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              findMany: jest.fn().mockResolvedValue([])
            }
          }
        }
      ]
    }).compile()

    service = module.get(TasksService)
    prisma = module.get(PrismaService)
  })

  it('should return tasks', async () => {
    expect(await service.findAll('project-1')).toEqual([])
    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: { projectId: 'project-1' }
    })
  })
})
```

**E2E test example** (in `test/tasks.e2e-spec.ts`):

```ts
import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../src/app.module'

describe('Tasks (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/projects/:id/tasks (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/projects/123/tasks')
      .expect(200)
      .expect(res => Array.isArray(res.body))
  })

  afterAll(async () => {
    await app.close()
  })
})
```

**Run tests:**

```bash
npm run test --workspace=apps/backend          # unit tests
npm run test:coverage --workspace=apps/backend # with coverage report
npm run test:e2e --workspace=apps/backend      # e2e tests
```

We enforce **80% coverage** – CI will fail if you go below.

### **I. Committing Your Changes**

```bash
git add .
git commit -m "feat: add tasks list endpoint"
```

Pre‑commit hook runs ESLint and Prettier. If it fails, fix issues and commit again.

**Commit message format:**  
`type: short description`  
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`.

### **J. Push and Create a Pull Request**

```bash
git push -u origin feature/add-tasks-endpoint-yourinitials
```

On GitHub:
- Create a PR against `develop`.
- Fill the template (what/why/how, any notes).
- Request two reviewers.
- Add labels (`backend`, `needs-review`).

CI will run:
- Lint & type check
- Tests + coverage
- Build
- Security scan

**If CI fails**, check logs and fix. Push new commits to the same branch.

### **K. After Merge**

```bash
git checkout develop
git pull origin develop
git branch -d feature/add-tasks-endpoint-yourinitials
```

Pick the next issue and repeat!

---

## **🧠 3. Handling API Contracts (OpenAPI)**

The OpenAPI spec (`packages/contracts/src/openapi.yaml`) is the **single source of truth**.

### **When you add a new endpoint or modify an existing one:**

1. **Edit the OpenAPI spec** – add the path, request body, responses, and schemas.  
   Follow the existing examples for consistency.

2. **Regenerate types**:
   ```bash
   npm run generate:types
   ```
   This updates the generated TypeScript types in `packages/contracts/src/generated/` and the main index.

3. **Commit both** – the spec change **and** the generated types.  
   The pre‑commit hook will remind you if they are out of sync.

4. **Now frontend can use the new types immediately** (after they pull your changes).

**Important:**  
- If your change is **backward compatible** (adding a field, new optional parameter), you can just update the spec and regenerate.
- If it's **breaking** (renaming a field, removing a field, changing a required field), you must:
  - Discuss with the team.
  - Create a new version of the endpoint (e.g., `/api/v2/...`) or coordinate a migration with frontend.
  - Update the spec accordingly.

---

## **🔄 4. Working with Environment Variables**

Copy `.env.example` to `.env` in `apps/backend/` (or the root, but backend looks in its own folder).  
The variables are validated using Zod in `src/config/env.ts`.  
You can add new variables by updating both `.env.example` and the validation schema.

**Important:** Never commit `.env` files – they are in `.gitignore`.

---

## **🧪 5. Testing Best Practices**

- **Unit tests** – for services, utilities, and individual functions.
- **Integration tests** – for controllers (using a test database).  
  You can use the `@nestjs/testing` package and mock Prisma (as shown above) or use a real test database.
- **E2E tests** – test the full HTTP stack with a real database (use a separate test database, e.g., `test_db`).  
  Our CI uses a PostgreSQL service for this.

**Coverage threshold:** 80% lines, functions, branches. Run `npm run test:coverage` before pushing to ensure you're meeting it.

---

## **🎯 6. Common Scenarios**

### **Q: How do I know if a frontend developer needs an API change?**
- Usually, the issue will be labeled `backend` and `frontend` if both sides are involved.
- If you're unsure, ask in Telegram.  
- Always discuss API changes **before** implementing – the contract must be agreed upon.

### **Q: I need a new database table. What's the process?**
1. Add the model to `prisma/schema.prisma`.
2. Run a migration: `npm run prisma:migrate --workspace=apps/backend -- --name add_comments_table`.
3. Update the OpenAPI spec to expose the new resource (if needed).
4. Generate types and commit everything.
5. Implement the service/controller.

### **Q: How do I test an endpoint without the frontend?**
Use **Postman**, **Insomnia**, or simply **Swagger** (http://localhost:3000/api/docs) – it's interactive and lets you send authenticated requests (just paste a JWT token).

You can also write a quick curl command.

### **Q: How do I get a JWT token for testing?**
- Use the `/auth/login` endpoint with the seeded test user (`test@hagerehiwotlabs.dev` / `SecurePass123!`).
- Or implement a test helper that generates tokens (but be careful not to commit secrets).

### **Q: The frontend team is waiting for an endpoint. Can I provide a mock?**
Yes! The contracts package already has a mock server (Prism). You can run it locally for frontend, but the real endpoint is better. If you're blocked on something else, you can stub the endpoint in the backend (return fake data) temporarily – but mark it clearly.

### **Q: I need to debug a database query. How?**
- Use `console.log` with the Prisma query (enable logging in Prisma by setting `log: ['query']` in `PrismaService`).
- Use Prisma Studio (`npm run prisma:studio`) to view data.
- Connect directly with `psql` or pgAdmin (http://localhost:5050).

---

## **📚 7. Additional Resources**

- [Team Rules & Git Workflow](docs/team/TEAM_RULES.md)
- [Architecture Decisions](docs/architecture/DECISIONS.md) (why we chose this stack)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [OpenAPI Specification](https://swagger.io/specification/)

---

## **✅ Your First Week Goals**

- [ ] Run the project locally and explore the codebase.
- [ ] Complete one `good-first-issue` (e.g., add a simple endpoint, write a test).
- [ ] Understand the flow: issue → branch → commit → PR → merge.
- [ ] Get comfortable with Prisma and writing migrations.
- [ ] Write a unit test and an e2e test for your feature.
- [ ] Familiarize yourself with the OpenAPI spec and how to update it.

---

You're now ready to contribute to the backend! Remember to communicate with the frontend team when APIs change, and always keep the contract in sync.

**Happy coding, Hager Hiwot Labs Backend team!** 🚀
