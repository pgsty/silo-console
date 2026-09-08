// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import { fileURLToPath } from "node:url";
import { Browser, chromium, expect, test } from "@playwright/test";
import { build } from "vite";
import { browserExecutable } from "./fixtures/browserExecutable";

test.describe.configure({ mode: "serial" });

let browser: Browser;
let script: string;

test.beforeAll(async () => {
  // Bundle the installed MDS distribution, as Console does. The regression is
  // an event-ordering bug; checking source text would miss actual selection.
  const result = await build({
    configFile: false,
    logLevel: "silent",
    define: { "process.env.NODE_ENV": '"production"' },
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(
          new URL("./fixtures/mdsSelectHarness.tsx", import.meta.url),
        ),
        name: "SelectHarness",
        formats: ["iife"],
      },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!("output" in output)) throw new Error("MDS harness build has no output");
  const chunk = output.output.find((item) => item.type === "chunk");
  if (!chunk || chunk.type !== "chunk")
    throw new Error("MDS harness has no script");
  script = chunk.code;
  browser = await chromium.launch({ executablePath: browserExecutable() });
});

test.afterAll(async () => {
  await browser?.close();
});

for (const action of ["click", "tap", "keyboard", "disabled"] as const) {
  test(`MDS Select respects the ${action} target`, async () => {
    const context = await browser.newContext({ hasTouch: action === "tap" });
    try {
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setContent('<div id="root"></div>');
      await page.addScriptTag({ content: script });
      await page.getByText("Choose target", { exact: true }).click();
      if (action === "keyboard") {
        await page.keyboard.press("ArrowDown");
        await expect(page.locator('div[label="Second"]')).toHaveClass(
          /hovered/,
        );
        await page.keyboard.press("Enter");
      } else {
        const target = page.locator(
          `div[label="${action === "disabled" ? "Disabled" : "Second"}"]`,
        );
        // Deliberately do not hover/wait first: touch has no hover, and a
        // quick mouse click can precede React's hover-state render.
        if (action === "tap") await target.tap();
        else await target.click();
      }
      await expect(page.locator('div[label="Second"]')).toHaveCount(0);
      await expect(page.locator("#chosen")).toHaveText(
        action === "disabled" ? "" : "second",
      );
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}
