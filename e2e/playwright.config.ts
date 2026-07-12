import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  testDir: ".",
  testMatch: "dashboard.spec.ts",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never", outputFolder: "../playwright-report" }]],
  outputDir: "../test-results",
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.01
    }
  },
  use: {
    baseURL: "http://127.0.0.1:4317",
    colorScheme: "light",
    locale: "en-US",
    timezoneId: "UTC",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } }
    }
  ],
  webServer: {
    command: "npm run preview",
    cwd: repoRoot,
    url: "http://127.0.0.1:4317",
    reuseExistingServer: true,
    timeout: 30_000
  }
});
