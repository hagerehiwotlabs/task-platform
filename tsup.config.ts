import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'class-variance-authority', 'tailwind-merge', 'clsx'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
