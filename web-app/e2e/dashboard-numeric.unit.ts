// Copyright (c) 2026 PGSTY
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { fileURLToPath } from "node:url";
import { chromium, expect, test } from "@playwright/test";
import { buildHarness } from "./fixtures/buildHarness";
import { browserExecutable } from "./fixtures/browserExecutable";

test("syscall labels retain fractional rates without changing raw data or integer panels", async () => {
  const result = await buildHarness({
    configFile: false,
    logLevel: "silent",
    define: { "process.env.NODE_ENV": '"production"' },
    resolve: { tsconfigPaths: true },
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(
          new URL(
            "../src/screens/Console/Dashboard/Prometheus/utils.tsx",
            import.meta.url,
          ),
        ),
        name: "DashboardUtils",
        formats: ["iife"],
      },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!("output" in output)) throw new Error("Missing dashboard bundle");
  const script = output.output
    .filter((item) => item.type === "chunk")
    .map((item) => item.code)
    .join("\n");
  const browser = await chromium.launch({
    executablePath: browserExecutable(),
  });
  try {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addScriptTag({ content: script });
    const actual = await page.evaluate(() => {
      const { panelsConfiguration, widgetDetailsToPanel } = (
        window as unknown as {
          DashboardUtils: typeof import("../src/screens/Console/Dashboard/Prometheus/utils");
        }
      ).DashboardUtils;
      const syscalls = panelsConfiguration.find((panel) => panel.id === 11)!;
      const descriptors = panelsConfiguration.find((panel) => panel.id === 8)!;
      const cpu = panelsConfiguration.find((panel) => panel.id === 77)!;
      const values = ["0", "0.25", "0.004", "0.000001", "1234"];
      const panel = widgetDetailsToPanel(
        {
          type: "graph",
          targets: [
            {
              legendFormat: "{{server}}",
              result: [
                {
                  metric: { server: "node-1" },
                  values: [[1000, "0.25"]],
                },
              ],
            },
          ],
        },
        syscalls,
      );
      return {
        labels: values.map((value) => syscalls.yAxisFormatter!(value)),
        rawData: panel.data,
        descriptorLabels: ["0", "1234"].map((value) =>
          descriptors.yAxisFormatter!(value),
        ),
        cpuLabel: cpu.yAxisFormatter!("0.25"),
      };
    });
    expect(actual).toEqual({
      labels: ["0", "0.25", "0.004", "0.000001", "1234"],
      rawData: [{ name: 1000, "key_0node-1": "0.25" }],
      descriptorLabels: ["0", "1234"],
      cpuLabel: "0.25",
    });
    expect(errors).toEqual([]);
  } finally {
    await browser.close();
  }
});
