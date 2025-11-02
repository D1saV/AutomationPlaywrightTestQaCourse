import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    httpCredentials: process.env.HTTP_USERNAME && process.env.HTTP_PASSWORD
      ? {
          username: process.env.HTTP_USERNAME,
          password: process.env.HTTP_PASSWORD,
        }
      : undefined,

    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],


  // webServer: {
  //   command: 'npm run start',
  //   url: process.env.BASE_URL || 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
