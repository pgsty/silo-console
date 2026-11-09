// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { fileURLToPath } from "node:url";
import { Browser, Page, chromium, expect, test } from "@playwright/test";
import pt from "../src/i18n/locales/pt-BR/chrome";
import ptScreens from "../src/i18n/locales/pt-BR/screens";
import { browserExecutable } from "./fixtures/browserExecutable";
import { buildHarness } from "./fixtures/buildHarness";

test.describe.configure({ mode: "serial" });

type CatalogHarness = {
  setPortuguese: () => void;
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
    define: {
      "process.env.NODE_ENV": '"production"',
      "import.meta.env.DEV": "false",
    },
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

test("dropdown selection updates mounted Portuguese copy synchronously", async () => {
  await toggle().click();
  await page
    .getByRole("option", { name: "Português (Brasil)", exact: true })
    .click();
  await expect(page.locator("#common")).toHaveText(pt.Login as string);
  await expect(page.locator("#screen")).toHaveText(
    ptScreens["Remote host:"] as string,
  );
});

test("changing languages preserves unsaved input and memoized copy updates", async () => {
  await page.locator("#unsaved").fill("draft");
  await page.evaluate(() => catalogHarness.setPortuguese());
  await expect(page.locator("#screen")).toHaveText(
    ptScreens["Remote host:"] as string,
  );
  await toggle().click();
  await page.getByRole("option", { name: "English", exact: true }).click();
  await expect(page.locator("#screen")).toHaveText("Remote host:");
  await expect(page.locator("#unsaved")).toHaveValue("draft");
});

test("language changes work without a network connection", async () => {
  await page.context().setOffline(true);
  await page.evaluate(() => catalogHarness.setPortuguese());
  await expect(page.locator("#common")).toHaveText(pt.Login as string);
  await expect(page.locator("#screen")).toHaveText(
    ptScreens["Remote host:"] as string,
  );
});
