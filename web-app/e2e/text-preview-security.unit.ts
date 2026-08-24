// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Browser, chromium, expect, Page, test } from "@playwright/test";
import { createServer, ViteDevServer } from "vite";

test.describe.configure({ mode: "serial" });

const findBrowserExecutable = (directory: string, depth = 0): string | null => {
  if (!existsSync(directory) || depth > 5) {
    return null;
  }

  const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    b.name.localeCompare(a.name),
  );
  for (const entry of entries) {
    const candidate = join(directory, entry.name);
    if (
      entry.isFile() &&
      (entry.name === "chrome-headless-shell" ||
        entry.name === "chrome-headless-shell.exe")
    ) {
      return candidate;
    }
    if (entry.isDirectory()) {
      const nested = findBrowserExecutable(candidate, depth + 1);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
};

const browserExecutable = (): string => {
  const configured = chromium.executablePath();
  if (existsSync(configured)) {
    return configured;
  }

  const cacheRoots =
    process.platform === "darwin"
      ? [join(homedir(), "Library", "Caches", "ms-playwright")]
      : [join(homedir(), ".cache", "ms-playwright")];
  for (const root of cacheRoots) {
    const executable = findBrowserExecutable(root);
    if (executable) {
      return executable;
    }
  }

  throw new Error("No Playwright Chromium executable is installed");
};

test.describe("safe text DOM rendering", () => {
  let viteServer: ViteDevServer;
  let browser: Browser;
  let page: Page;
  let baseURL: string;

  test.beforeAll(async () => {
    viteServer = await createServer({
      logLevel: "silent",
      server: { host: "127.0.0.1", port: 0 },
    });
    await viteServer.listen();
    const address = viteServer.httpServer?.address();
    if (!address || typeof address === "string") {
      throw new Error("Vite test server did not expose a port");
    }
    baseURL = `http://127.0.0.1:${address.port}`;
    browser = await chromium.launch({ executablePath: browserExecutable() });
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await browser.close();
    await viteServer.close();
  });

  test("keeps active HTML, SVG, and XML payloads in one text node", async () => {
    const objectRequests: string[] = [];
    let dialogs = 0;

    page.on("request", (request) => {
      if (request.url().includes("text-preview.invalid")) {
        objectRequests.push(request.url());
      }
    });
    page.on("dialog", async (dialog) => {
      dialogs += 1;
      await dialog.dismiss();
    });

    await page.goto(`${baseURL}/e2e/fixtures/text-preview-harness.html`);
    const preview = page.getByTestId("text-preview-content");
    await expect(preview).toBeVisible();

    const result = await page.evaluate(() => {
      const pre = document.querySelector(
        "pre[data-testid='text-preview-content']",
      );
      return {
        actual: pre?.textContent,
        expected: (window as any).__textPreviewPayload,
        executed: (window as any).__textPreviewExecuted,
        preChildNodes: pre?.childNodes.length,
        preChildType: pre?.firstChild?.nodeType,
        activeElements: pre?.querySelectorAll(
          "script, img, iframe, svg, object, embed",
        ).length,
        documentActiveElements: document.querySelectorAll(
          "#root script, #root img, #root iframe, #root svg, #root object, #root embed",
        ).length,
      };
    });

    expect(result.actual).toBe(result.expected);
    expect(result.executed).toBe(false);
    expect(result.preChildNodes).toBe(1);
    expect(result.preChildType).toBe(3);
    expect(result.activeElements).toBe(0);
    expect(result.documentActiveElements).toBe(0);
    expect(dialogs).toBe(0);
    expect(objectRequests).toEqual([]);
  });
});
