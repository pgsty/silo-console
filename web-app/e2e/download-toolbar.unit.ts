// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Browser, chromium, expect, Page, test } from "@playwright/test";
import { createServer, ViteDevServer } from "vite";
import { browserExecutable } from "./fixtures/browserExecutable";

test.describe.configure({ mode: "serial" });
let server: ViteDevServer;
let browser: Browser;
let page: Page;
let base: string;

test.beforeAll(async () => {
  server = await createServer({
    logLevel: "silent",
    server: { host: "127.0.0.1", port: 0, hmr: false },
  });
  await server.listen();
  const address = server.httpServer?.address();
  if (!address || typeof address === "string")
    throw new Error("Missing Vite test port");
  base = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch({ executablePath: browserExecutable() });
});
test.afterEach(async () => page?.close());
test.afterAll(async () => {
  await browser?.close();
  await server?.close();
});

for (const mode of ["short name", "renamed", "original name"] as const) {
  test(`Windows toolbar downloads the selected object and version with its ${mode}`, async () => {
    const prefix = "nested-folder/".repeat(16);
    const name =
      mode === "short name" ? "report.txt" : `${"x".repeat(205)}.txt`;
    const key = prefix + name;
    const object = {
      name: key,
      size: 3,
      last_modified: "2026-11-01T00:00:00Z",
      version_id: "selected-version",
    };
    const downloads: URL[] = [];
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "platform", { value: "Win32" });
    });
    await page.routeWebSocket("**/ws/objectManager", (socket) => {
      socket.onMessage((message) => {
        const frame = JSON.parse(message.toString());
        if (frame.mode !== "objects") return;
        socket.send(
          JSON.stringify({ request_id: frame.request_id, data: [object] }),
        );
        socket.send(
          JSON.stringify({ request_id: frame.request_id, request_end: true }),
        );
      });
    });
    await page.route("**/api/v1/**", (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith("/session"))
        return route.fulfill({
          json: {
            status: "ok",
            accountAccessKey: "admin",
            permissions: {
              "console-ui": ["admin:*"],
              "arn:aws:s3:::*": ["s3:*"],
            },
          },
        });
      if (url.pathname.endsWith("/objects/metadata"))
        return route.fulfill({ json: object });
      if (url.pathname.endsWith("/objects/download")) {
        downloads.push(url);
        return route.fulfill({
          body: "abc",
          headers: {
            "Content-Disposition": 'attachment; filename="report.txt"',
          },
        });
      }
      return route.fulfill({ json: {} });
    });
    await page.goto(`${base}/browser/reports/${encodeURIComponent(prefix)}`);
    await page.getByRole("checkbox", { name: /Select: .*\.txt$/ }).click();
    await page.getByRole("button", { name: "Download", exact: true }).click();
    if (mode !== "short name") {
      const dialog = page.getByRole("dialog");
      await expect(dialog.locator("#download-filename")).toHaveValue(name);
      if (mode === "renamed") {
        await dialog.locator("#download-filename").fill("local copy.txt");
      } else {
        await dialog.getByLabel("Use Original Name").check();
      }
      await dialog.getByRole("button", { name: "Download File" }).click();
    }
    await expect.poll(() => downloads.length).toBe(1);
    const [request] = downloads;
    expect(request.pathname).toBe("/api/v1/buckets/reports/objects/download");
    expect(request.searchParams.get("prefix")).toBe(key);
    expect(request.searchParams.get("version_id")).toBe(object.version_id);
    expect(request.searchParams.get("override_file_name")).toBe(
      mode === "renamed" ? "local copy.txt" : null,
    );
  });
}
