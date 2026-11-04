// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { fileURLToPath } from "node:url";
import { chromium, expect, test } from "@playwright/test";
import { build } from "vite";
import { browserExecutable } from "./fixtures/browserExecutable";

test("mounted Overview hook preserves stale data, cancels generations and polls only while visible", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  let result: Awaited<ReturnType<typeof build>>;
  try {
    process.env.NODE_ENV = "production";
    result = await build({
      configFile: false,
      logLevel: "silent",
      define: { "process.env.NODE_ENV": '"production"' },
      resolve: {
        alias: {
          api: fileURLToPath(
            new URL("./fixtures/overviewApiStub.ts", import.meta.url),
          ),
        },
      },
      build: {
        write: false,
        lib: {
          entry: fileURLToPath(
            new URL("./fixtures/overviewHookHarness.tsx", import.meta.url),
          ),
          name: "OverviewHookHarness",
          formats: ["iife"],
        },
      },
    });
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
  }
  const output = Array.isArray(result) ? result[0] : result;
  if (!("output" in output)) throw new Error("Missing hook harness output");
  const chunk = output.output.find((item) => item.type === "chunk");
  if (!chunk || chunk.type !== "chunk")
    throw new Error("Missing hook harness script");
  const browser = await chromium.launch({
    executablePath: browserExecutable(),
  });
  try {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    // Keep polling independent of wall time spent building and asserting in CI.
    // Advance it only at the explicit polling/visibility steps below.
    const now = new Date("2026-01-01T00:00:00Z");
    await page.clock.install({ time: now });
    await page.clock.pauseAt(new Date(now.getTime() + 60 * 60 * 1000));
    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({ content: chunk.code });
    const count = () =>
      page.evaluate(() => window.overviewHarness.requests.length);
    const state = () =>
      page
        .locator("#state")
        .evaluate((node) => JSON.parse(node.textContent || "{}"));
    await expect.poll(count).toBe(1);
    expect(
      await page.evaluate(() => window.overviewHarness.requests[0].defaultOnly),
    ).toBe(true);
    await page.evaluate(() => window.overviewHarness.requests[0].reject());
    await expect.poll(state).toEqual({ refreshing: false, error: true });
    await page.locator("#refresh").click();
    await expect.poll(count).toBe(2);
    await page.evaluate(() =>
      window.overviewHarness.resolve(1, { buckets: 5 }),
    );
    await expect
      .poll(state)
      .toEqual({ data: { buckets: 5 }, refreshing: false, error: false });
    await page.locator("#refresh").click();
    await expect.poll(count).toBe(3);
    await expect
      .poll(state)
      .toEqual({ data: { buckets: 5 }, refreshing: true, error: false });
    await page.locator("#refresh").click();
    await expect.poll(count).toBe(4);
    expect(
      await page.evaluate(
        () => window.overviewHarness.requests[2].signal.aborted,
      ),
    ).toBe(true);
    await page.evaluate(() =>
      window.overviewHarness.resolve(3, { buckets: 9 }),
    );
    await expect
      .poll(state)
      .toEqual({ data: { buckets: 9 }, refreshing: false, error: false });
    await page.evaluate(() =>
      window.overviewHarness.resolve(2, { buckets: 1 }),
    );
    await expect
      .poll(state)
      .toEqual({ data: { buckets: 9 }, refreshing: false, error: false });
    await page.locator("#refresh").click();
    await expect.poll(count).toBe(5);
    await page.evaluate(() => window.overviewHarness.requests[4].reject());
    await expect
      .poll(state)
      .toEqual({ data: { buckets: 9 }, refreshing: false, error: true });
    await page.clock.runFor(1000);
    await expect.poll(count).toBe(6);
    await page.evaluate(() => window.overviewHarness.hide(true));
    await page.clock.runFor(5000);
    expect(await count()).toBe(6);
    await page.evaluate(() => window.overviewHarness.hide(false));
    await expect.poll(count).toBe(7);
    expect(
      await page.evaluate(
        () => window.overviewHarness.requests[5].signal.aborted,
      ),
    ).toBe(true);
    await page.locator("#mount").click();
    expect(
      await page.evaluate(
        () => window.overviewHarness.requests[6].signal.aborted,
      ),
    ).toBe(true);
    await page.evaluate(() =>
      window.overviewHarness.resolve(6, { buckets: 99 }),
    );
    await page.clock.runFor(5000);
    expect(await count()).toBe(7);
    await expect(page.locator("#state")).toHaveCount(0);
    await page.locator("#mount").click();
    await expect.poll(count).toBe(8);
    await expect.poll(state).toEqual({ refreshing: true, error: false });
    expect(errors).toEqual([]);
  } finally {
    await browser.close();
  }
});
