import { defineConfig, devices } from '@playwright/test';

// Playwright smoke-test config.
//
// Scope:
//   Catch regressions on the 3 highest-value user paths (landing,
//   builder loads, pricing + templates render). Not a full E2E
//   coverage suite — just enough to fail a PR if something broken
//   ships.
//
// Target:
//   By default tests run against BASE_URL. CI uses a Next.js dev
//   server spun up by the `webServer` block. Locally you can point
//   at the live prod URL:
//     BASE_URL=https://resumebuildz.tech npx playwright test
//
// Chromium only for now. Firefox/WebKit coverage is nice-to-have.
// Add later if prod bugs surface on those engines.

const PORT = 3847;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],

  // Spin up the app unless BASE_URL points elsewhere.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run dev -- --port ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
