import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL: 'https://kj-migration.vercel.app',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'Desktop Chrome', use: { browserName: 'chromium' } },
    { name: 'Mobile Chrome', use: { ...{ browserName: 'chromium' }, viewport: { width: 375, height: 812 } } },
  ],
});
