# 🎨 Frontend Developer Guide – Hager Hiwot Labs Task Platform

Welcome to the frontend team! This guide will walk you through everything you need to know to be productive in our monorepo setup.

---

## **📦 What You'll Work With**

- **`apps/frontend/`** – The main React application.
- **`packages/ui/`** – Shared UI components (buttons, cards, inputs) used across the app.
- **`packages/contracts/`** – OpenAPI spec and **generated TypeScript types** for the entire API.  
  You'll import types from `@hagerehiwotlabs/contracts` – **no need to manually define API types**.

- **Backend API** – Runs on `http://localhost:3000/api/v1` when you start `npm run dev`.

---

## **🚀 1. Getting Started (One‑time Setup)**

If you haven't already:

```bash
# Clone the repo
git clone https://github.com/hagerehiwotlabs/task-platform.git
cd task-platform

# Run the setup script (installs deps, starts Docker, runs migrations)
./scripts/setup.sh

# Start the development servers (frontend + backend)
npm run dev
```

Now open http://localhost:5173 – you should see the app (even if it's mostly placeholder pages).

---

## **🎯 2. Your Daily Workflow**

### **A. Start the Day**

```bash
cd ~/task-platform
git checkout develop
git pull origin develop
npm run dev   # starts both frontend (5173) and backend (3000)
```

### **B. Pick a Task**

- Go to the [GitHub Issues](https://github.com/hagerehiwotlabs/task-platform/issues) page.
- Look for issues labeled `frontend` or `good-first-issue`.
- Assign yourself, read the description, and clarify any questions in Telegram.

### **C. Create a Feature Branch**

```bash
git checkout -b feature/add-login-form-yourinitials
```

Branch naming: `feature/`, `bugfix/`, `chore/`, `docs/` + short description + your initials.

### **D. Develop**

You'll spend most of your time in `apps/frontend/src/`.  
The structure:

```
apps/frontend/src/
├── api/          # API client (already set up with axios)
├── components/   # Your custom components (not in ui package)
├── hooks/        # Custom React hooks
├── lib/          # Utilities, helpers
├── pages/        # Route-level components
├── providers/    # Context providers
├── routes/       # React Router configuration
├── test/         # Test setup
└── types/        # Local types (rare – most types come from contracts)
```

**Key imports:**

```tsx
// API types – always from contracts
import type { Task, CreateTaskRequest } from '@hagerehiwotlabs/contracts';

// UI components – from shared ui package
import { Button, Input } from '@hagerehiwotlabs/ui';

// Local utilities
import { formatDate } from '@/lib/utils';
```

### **E. Use the API Client**

We have a pre‑configured Axios client in `src/api/client.ts` with typed methods:

```tsx
import { authAPI, projectsAPI, tasksAPI } from '@/api/client';

// Example: login
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('auth_token', response.data.token);
    // user is in response.data.user
  } catch (error) {
    // error is typed (you can use isApiError helper)
  }
};
```

All methods return a typed Promise – full autocompletion.

### **F. Mocking the API (When Backend Isn't Ready)**

You have two options:

1. **Run the real backend** – `npm run dev` already does this. If the backend team hasn't implemented an endpoint yet, you'll get a 404.  
   **Solution:** Use the **mock server** from the contracts package.

2. **Start the mock server** (based on OpenAPI):

   ```bash
   npm run mock --workspace=packages/contracts
   ```

   This runs Prism on http://localhost:4010, serving fake responses defined in the OpenAPI spec.

   Then, in your frontend, you can point the API client to the mock:

   ```bash
   # In a new terminal, run frontend with env var
   VITE_API_URL=http://localhost:4010 npm run dev --workspace=apps/frontend
   ```

   Or simply edit `apps/frontend/.env.local`:

   ```
   VITE_API_URL=http://localhost:4010
   ```

   **Pro tip:** Use the real backend for endpoints that are ready, and the mock for those still in progress.

3. **Use MSW (Mock Service Worker) for testing** – this is already set up for unit tests. For local development, MSW can also be used, but we recommend Prism because it's contract‑driven.

### **G. State Management with TanStack Query**

We use **TanStack Query** for server state. Example:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '@/api/client';

// Fetch projects
const { data: projects, isLoading } = useQuery({
  queryKey: ['projects'],
  queryFn: () => projectsAPI.getAll().then((res) => res.data),
});

// Create a project
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: projectsAPI.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  },
});
```

### **H. Forms with React Hook Form + Zod**

We use `react-hook-form` with `zod` validation via `@hookform/resolvers`. Example:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@hagerehiwotlabs/ui';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    // call API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Email" {...register('email')} error={errors.email?.message} />
      <Input
        type="password"
        label="Password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

### **I. Styling with Tailwind**

We use Tailwind CSS. You can use utility classes directly:

```tsx
<div className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
  <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
</div>
```

If you find yourself repeating classes, extract them into a component (preferably in `packages/ui`).

### **J. Testing**

We use **Vitest** + **React Testing Library**. Tests live next to the component they test, with `.test.tsx` extension.

**Example test for a component:**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits email and password', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

**Run tests:**

```bash
npm run test --workspace=apps/frontend        # watch mode
npm run test:coverage --workspace=apps/frontend  # coverage report
```

We enforce **80% coverage** – CI will fail if you go below.

### **K. Committing Your Changes**

```bash
git add .
git commit -m "feat: add login form with validation"
```

The pre‑commit hook will run ESLint and Prettier. If it fails, fix issues and commit again.

**Commit message format:**  
`type: short description`  
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`.

### **L. Push and Create a Pull Request**

```bash
git push -u origin feature/add-login-form-yourinitials
```

Then on GitHub:

- Create a PR against `develop`.
- Fill the template (what/why/how, screenshots).
- Request two reviewers.
- Add labels (`frontend`, `needs-review`).

Wait for CI to pass and reviewers to approve. Address feedback by pushing new commits to the same branch.

### **M. After Merge**

```bash
git checkout develop
git pull origin develop
git branch -d feature/add-login-form-yourinitials
```

Pick the next issue and repeat!

---

## **🧠 3. Understanding the Monorepo for Frontend Devs**

### **Shared UI Components (`@hagerehiwotlabs/ui`)**

- Located in `packages/ui/`.
- Built with **tsup** and published to the workspace (no need to publish to npm).
- To add a new component:
  1. Create the component in `packages/ui/src/components/`.
  2. Export it from `packages/ui/src/index.ts`.
  3. Run `npm run build --workspace=packages/ui` to rebuild.
  4. In your frontend app, import it: `import { MyNewComponent } from '@hagerehiwotlabs/ui'`.

The UI package is hot‑reloaded in development, so changes appear immediately in the frontend app.

### **Shared Types (`@hagerehiwotlabs/contracts`)**

- OpenAPI spec is the single source of truth.
- Types are generated automatically and can be imported anywhere:
  ```ts
  import type { User, Project, Task } from '@hagerehiwotlabs/contracts';
  ```
- If the API changes (new field, new endpoint), the contracts package must be updated first.  
  **You'll never manually type API responses** – it's all generated.

---

## **🔄 4. Handling API Changes (Contracts Updates)**

Sometimes the backend team needs to change the API. Here's how it affects you:

1. They update `packages/contracts/src/openapi.yaml` and run `npm run generate:types`.
2. They commit both the spec change and the generated types.
3. When you pull the latest `develop`, your `node_modules` will have the new types.
4. **Your code may now have TypeScript errors** if the API shape changed.
   - If it's a **breaking change** (e.g., field removed), you'll need to update your code accordingly.
   - If it's a **new field**, you can start using it immediately.

**Pro tip:** When you pull and see a contracts update, run `npm run build --workspace=packages/contracts` to ensure everything is compiled (usually done automatically by the workspace scripts).

---

## **🧪 5. Testing Best Practices**

- **Test user interactions**, not implementation details.
- Use `@testing-library/user-event` to simulate real user actions.
- For components that use TanStack Query, wrap them in a `QueryClientProvider` in tests (see existing tests for examples).
- For API calls, use MSW to mock responses (already configured – see `src/test/setup.ts`).

**Run tests with coverage** before pushing to ensure you meet the 80% threshold.

---

## **📚 6. Additional Resources**

- [Team Rules & Git Workflow](docs/team/TEAM_RULES.md)
- [Architecture Decisions](docs/architecture/DECISIONS.md) (why we chose this stack)
- [OpenAPI Spec (contracts)](packages/contracts/src/openapi.yaml) – read it to understand available endpoints.

---

## **🎯 7. Common Questions**

### Q: How do I know if an endpoint is ready on the backend?

- Check the issue board – if the backend task is marked "Done", the endpoint should be live.
- You can also check the Swagger docs at http://localhost:3000/api/docs – endpoints appear there once implemented.
- If unsure, ask in Telegram.

### Q: Can I work if the backend isn't ready?

Absolutely! Use the **mock server** (Prism) as described above. You can build the entire UI against mocks, then switch to the real backend later.

### Q: I need a new API endpoint that's not in the spec. What do I do?

- Discuss with the backend lead and the team.
- If approved, update the OpenAPI spec yourself (or ask backend to do it) and regenerate types.
- Then you can use the new types immediately.

### Q: How do I add a new page?

1. Create a component in `apps/frontend/src/pages/`.
2. Add a route in `apps/frontend/src/routes/index.tsx`.
3. Link to it using React Router's `Link`.

### Q: How do I use environment variables?

Create a `.env.local` file in `apps/frontend/` with `VITE_` prefix. Example:

```
VITE_API_URL=http://localhost:4010
```

Access in code: `import.meta.env.VITE_API_URL`.

---

## **✅ Your First Week Goals**

- [ ] Run the project locally and explore the codebase.
- [ ] Complete one `good-first-issue` (e.g., fix a typo, add a simple component).
- [ ] Understand the flow: issue → branch → commit → PR → merge.
- [ ] Get comfortable with the shared types and UI package.
- [ ] Write your first test.

---

You're now ready to contribute! Remember: ask questions early, review each other's code kindly, and enjoy building this awesome platform.

**Happy coding, Hager Hiwot Labs Frontend team!** 🚀
