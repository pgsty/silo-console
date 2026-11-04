// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import { fileURLToPath } from "node:url";
import { chromium, expect, test } from "@playwright/test";
import { buildHarness } from "./fixtures/buildHarness";
import { browserExecutable } from "./fixtures/browserExecutable";

let browser: Awaited<ReturnType<typeof chromium.launch>>;
let script: string;
test.beforeAll(async () => {
  const built = await buildHarness({
    configFile: false,
    logLevel: "silent",
    define: { "process.env.NODE_ENV": '"production"' },
    resolve: { tsconfigPaths: true },
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(
          new URL("./fixtures/byteMeasurementsHarness.tsx", import.meta.url),
        ),
        name: "ByteMeasurements",
        formats: ["iife"],
      },
    },
  });
  const output = Array.isArray(built) ? built[0] : built;
  if (!("output" in output)) throw new Error("Missing harness bundle");
  script = output.output
    .filter((item) => item.type === "chunk")
    .map((item) => item.code)
    .join("\n");
  browser = await chromium.launch({ executablePath: browserExecutable() });
});
test.afterAll(async () => {
  await browser.close();
});

test("both byte helpers parse complete inputs and bound both unit tables", async () => {
  const page = await browser.newPage();
  try {
    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({ content: script });
    const results = await page.evaluate(() => {
      const { calculateBytes, mdsBytes } = (window as any).byteMeasurements;
      const inputs = [
        "1e+21",
        1e21,
        "1.5",
        0.5,
        1024 ** 9,
        0,
        "",
        " ",
        "1junk",
        "0x10",
        NaN,
        Infinity,
        -1,
      ];
      return {
        console: inputs.map((x) => calculateBytes(x, true, false)),
        mds: inputs.map((x) => mdsBytes(x, true, false)),
        k8s: calculateBytes(1024 ** 9, true, false, true),
      };
    });
    const unavailable = { total: null, unit: "" };
    const expected = [
      { total: 867.4, unit: "EiB" },
      { total: 867.4, unit: "EiB" },
      { total: 1.5, unit: "B" },
      { total: 0.5, unit: "B" },
      { total: 1024, unit: "YiB" },
      { total: 0, unit: "B" },
      ...Array(7).fill(unavailable),
    ];
    expect(results.console).toEqual(expected);
    expect(results.mds).toEqual(expected);
    expect(results.k8s).toEqual({ total: 1024 ** 3, unit: "Ei" });
  } finally {
    await page.close();
  }
});

for (const [value, total, unit] of [
  ["1e+21", "867.4", "EiB"],
  ["0.5", "0.5", "B"],
  ["NaN", "N/A", ""],
  ["Infinity", "N/A", ""],
  ["-1", "N/A", ""],
]) {
  test(`Speedtest and SizeChart render ${value} without invalid units`, async () => {
    const page = await browser.newPage();
    try {
      await page.route("http://byte-measurements.test/**", (route) =>
        route.fulfill({
          contentType: "text/html",
          body: '<div id="root"></div>',
        }),
      );
      await page.addInitScript({
        content: `document.addEventListener("DOMContentLoaded", () => {${script}});`,
      });
      await page.goto(
        `http://byte-measurements.test/?bytes=${encodeURIComponent(value)}`,
      );
      await expect(page.locator(".testUnitRes")).toHaveText(total);
      await expect(page.locator(".generalUnit")).toHaveText(
        unit ? `${unit}/s` : "",
      );
      await expect(page.locator(".chartNumber")).toHaveText(
        `${total} ${unit}`.trim(),
      );
      for (const stroke of await page
        .locator("circle")
        .evaluateAll((nodes) =>
          nodes.map((node) => (node as SVGElement).style.strokeDasharray),
        )) {
        expect(stroke).not.toMatch(/NaN|Infinity|undefined/);
      }
    } finally {
      await page.close();
    }
  });
}
