import { defineConfig, devices } from "@playwright/test";

// E2E_BASE_URL が指定された場合（本番受入など）はリモートを直接叩き、
// ローカル webServer は起動しない。未指定時は従来通り dist を配信する。
const remoteBaseURL = process.env.E2E_BASE_URL;
const baseURL = remoteBaseURL ?? "http://localhost:3456";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "*.e2e.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    locale: "ja-JP",
  },
  webServer: remoteBaseURL
    ? undefined
    : {
        command: "pnpm exec serve dist -l 3456",
        url: "http://localhost:3456",
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
      grep: /\[mobile\]/,
    },
  ],
});
