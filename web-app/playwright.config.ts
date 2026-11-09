import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 3 : undefined,
  reporter: "html",
  use: {
    trace: "retain-on-failure",
  },
  projects: [
    { name: "unit", testMatch: /.*\.unit\.ts/ },
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      testIgnore: [
        /.*\.unit\.ts/,
        /group-status-regression\.spec\.ts$/,
        /(navigation|preview|iam|overview|a11y|visual|object-keyboard|responsive)\.spec\.ts$/,
      ],
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
});
