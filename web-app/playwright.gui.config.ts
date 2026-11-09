// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { defineConfig, devices } from "@playwright/test";
import { join } from "node:path";
import { guiEnvironment } from "./e2e/fixtures/guiEnvironment";
import { browserExecutable } from "./e2e/fixtures/browserExecutable";
const env = guiEnvironment();
export default defineConfig({
  testDir: "./e2e",
  testMatch: [
    /(?:navigation|buckets-table|preview|iam|overview|a11y|responsive|object-keyboard)\.spec\.ts$/,
    ...(process.env.VISUAL === "1" ? [/visual\.spec\.ts$/] : []),
  ],
  globalSetup: "./e2e/fixtures/guiAuthenticate.ts",
  workers: 1,
  forbidOnly: true,
  reporter: [
    ["line"],
    ["json", { outputFile: join(env.artifacts, "report.json") }],
  ],
  updateSnapshots: "none",
  snapshotPathTemplate: env.baselines
    ? join(
        env.baselines,
        "{platform}",
        "{projectName}",
        "{testFilePath}",
        "{arg}{ext}",
      )
    : undefined,
  outputDir: join(env.artifacts, "results"),
  timeout: 45000,
  use: {
    baseURL: env.url,
    storageState: env.auth,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: { executablePath: browserExecutable() },
  },
  projects: [
    {
      name: "gui-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
});
