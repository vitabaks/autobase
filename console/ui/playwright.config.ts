import { defineConfig, devices } from '@playwright/test';

// Local E2E config — assumes the autobase console stack is already up on
// http://localhost (see console/docker-compose.yml). Token is baked into the
// UI at container start via AUTH_TOKEN; the same value is set into
// localStorage.token by each test's beforeEach.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Tests share a single backend; keep serial.
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
