import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

// Unit tests only. End-to-end tests live in tests/e2e and run under Playwright.
export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    env: {
      // Deterministic secret/origin so token + URL assertions are stable.
      BETTER_AUTH_SECRET: 'test-secret-do-not-use-in-prod',
      NEXT_PUBLIC_SITE_URL: 'https://resumebuildz.tech',
    },
  },
});
