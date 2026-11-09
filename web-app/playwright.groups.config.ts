// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineConfig } from "@playwright/test";
import { join } from "node:path";
import { groupStatusEnvironment } from "./e2e/fixtures/groupStatusFixture";
import { externalDirectory } from "./e2e/fixtures/guiEnvironment";
import { browserExecutable } from "./e2e/fixtures/browserExecutable";

const artifacts = externalDirectory("GROUP_STATUS_ARTIFACTS");
export default defineConfig({
  testDir: "./e2e",
  testMatch: /group-status-regression\.spec\.ts$/,
  workers: 1,
  timeout: 45000,
  forbidOnly: true,
  reporter: [
    ["line"],
    ["json", { outputFile: join(artifacts, "report.json") }],
  ],
  outputDir: join(artifacts, "results"),
  use: {
    baseURL: groupStatusEnvironment().url,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: { executablePath: browserExecutable() },
    viewport: { width: 1440, height: 1000 },
  },
});
