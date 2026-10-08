import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  // Tests mutate shared data (create/edit/restore), so run serially.
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://wrongcrm.kodinta.lt',
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
  },
});
