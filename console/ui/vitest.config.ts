import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mts';

// jsdom is the right default for a React/MUI app — components and hooks
// frequently touch `window` / `localStorage` / `document`. The bare node env
// trips on the slice's import-time hydration from localStorage.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // Scope Vitest to in-tree unit tests under src/. Playwright e2e specs in
      // ./e2e match the default *.spec.ts glob and were being executed by
      // Vitest (where they fail because they need a running browser + stack).
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
);
