import { defineConfig } from "@playwright/test";

// Visual Hive invokes its generated spec explicitly and owns the target server.
// The repository's human-authored E2E suite uses e2e/playwright.config.ts.
export default defineConfig({
  testDir: ".",
  testMatch: ".visual-hive/generated/**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1
});
