import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Points to your schema file relative to this config
  schema: './apps/backend/prisma/schema.prisma',
  migrations: {
    path: './apps/backend/prisma/migrations',
    seed: 'tsx apps/backend/prisma/seed.ts', // Update path if needed
  },
  datasource: {
    // The database URL is now configured here
    url: env('DATABASE_URL'),
  },
});
