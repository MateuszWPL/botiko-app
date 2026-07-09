import { defineConfig, devices } from '@playwright/test';

/**
 * Base URL can be overridden via env var so CI can point at a preview build.
 * Locally expects `pnpm dev` on port 3000 (reuses an existing server if running).
 */
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // CI: build then start (production mode, faster test run)
    // Local: reuse the already-running dev server, no extra startup cost
    command: process.env.CI ? 'pnpm build && pnpm start' : 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
