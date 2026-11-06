// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { fileURLToPath } from "node:url";
import { Browser, Page, chromium, expect, test } from "@playwright/test";
import { pt } from "../src/i18n/pt";
import { ptScreens } from "../src/i18n/ptScreens";
import { browserExecutable } from "./fixtures/browserExecutable";
import { buildHarness } from "./fixtures/buildHarness";

test.describe.configure({ mode: "serial" });

type CatalogHarness = {
  pendingScreenLoads: () => number;
  releaseScreens: () => void;
  setPortuguese: () => void;
  waitBriefly: () => Promise<unknown>;
};
declare const catalogHarness: CatalogHarness;

let browser: Browser;
let script: string;
let page: Page;

const toggle = () => page.locator("#language-activator");

test.beforeAll(async () => {
  const result = await buildHarness({
    configFile: false,
    logLevel: "silent",
    define: { "process.env.NODE_ENV": '"production"' },
    resolve: { tsconfigPaths: true },
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(
          new URL("./fixtures/languageCatalogHarness.tsx", import.meta.url),
        ),
        name: "LanguageCatalogHarness",
        formats: ["iife"],
      },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!("output" in output)) throw new Error("Missing catalog harness");
  const chunk = output.output.find((item) => item.type === "chunk");
  if (!chunk || chunk.type !== "chunk") throw new Error("Missing script");
  script = chunk.code;
  browser = await chromium.launch({ executablePath: browserExecutable() });
});

test.beforeEach(async () => {
  page = await browser.newPage();
  await page.setContent('<div id="root"></div>');
  await page.addScriptTag({ content: script });
  await expect(toggle()).toBeVisible();
});

test.afterEach(() => page.close());
test.afterAll(() => browser.close());

test("repeated clicks keep cycling while a catalogue download is stalled", async () => {
  await toggle().click();
  await expect(toggle()).toHaveAccessibleName("Mudar para português");

  await toggle().click();
  await expect(toggle()).toHaveAccessibleName("Switch to English");
  await toggle().click();
  await expect(toggle()).toHaveAccessibleName("切换到中文");
});

test("a stalled download does not hold back first paint", async () => {
  await page.evaluate(() => catalogHarness.setPortuguese());
  await page.evaluate(() => catalogHarness.waitBriefly());
  await expect(page.locator("#screen")).toHaveText("Remote host:");
});

test("a language change alone loads the catalogue and updates mounted copy", async () => {
  await page.evaluate(() => catalogHarness.setPortuguese());
  await expect
    .poll(() => page.evaluate(() => catalogHarness.pendingScreenLoads()))
    .toBeGreaterThan(0);
  await expect(page.locator("#common")).toHaveText("Login");

  await page.evaluate(() => catalogHarness.releaseScreens());
  await expect(page.locator("#screen")).toHaveText(ptScreens["Remote host:"]);
  await expect(page.locator("#common")).toHaveText(pt.Login);
});
