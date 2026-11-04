// Copyright (c) 2026 PGSTY
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { fileURLToPath } from "node:url";
import { chromium, expect, test as base, type Page } from "@playwright/test";
import { buildHarness } from "./buildHarness";
import { browserExecutable } from "./browserExecutable";

export const test = base.extend<{ configPage: Page }, { configScript: string }>(
  {
    configScript: [
      async ({}, use) => {
        const result = await buildHarness({
          configFile: false,
          logLevel: "silent",
          define: { "process.env.NODE_ENV": '"production"' },
          resolve: { tsconfigPaths: true },
          build: {
            write: false,
            lib: {
              entry: fileURLToPath(
                new URL("./bucketConfigHarness.tsx", import.meta.url),
              ),
              name: "BucketConfigHarness",
              formats: ["iife"],
            },
          },
        });
        const output = Array.isArray(result) ? result[0] : result;
        if (!("output" in output)) throw new Error("Missing harness output");
        await use(
          output.output
            .filter((item) => item.type === "chunk")
            .map((item) => item.code)
            .join("\n"),
        );
      },
      { scope: "worker" },
    ],
    configPage: async ({ configScript }, use) => {
      const browser = await chromium.launch({
        executablePath: browserExecutable(),
      });
      const page = await browser.newPage();
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route("http://bucket-config.test/**", (route) =>
        route.fulfill({
          contentType: "text/html",
          body: '<div id="root"></div>',
        }),
      );
      await page.addInitScript({
        content: `document.addEventListener("DOMContentLoaded", () => {\n${configScript}\n});`,
      });
      try {
        await use(page);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
  },
);

export { expect };
