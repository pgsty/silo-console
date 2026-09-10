// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later
import { test, expect, chromium, Browser } from "@playwright/test";
import { spawn, ChildProcess } from "node:child_process";
import { once } from "node:events";
let server: ChildProcess, browser: Browser, base: string;
test.beforeAll(async () => {
  // Vite mutates process-level build state. Keep the dev fixture in a separate
  // process so later production-bundle tests see their own clean environment.
  server = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import { createServer } from 'vite';
    const server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 0, open: false } });
    await server.listen();
    process.send('http://127.0.0.1:' + server.httpServer.address().port);
  `,
    ],
    { stdio: ["ignore", "ignore", "inherit", "ipc"] },
  );
  base = await new Promise<string>((resolve, reject) => {
    server.once("message", (message) => resolve(String(message)));
    server.once("error", reject);
    server.once("exit", (code) =>
      reject(new Error(`Fixture server exited: ${code}`)),
    );
  });
  browser = await chromium.launch();
});
test.afterAll(async () => {
  await browser?.close();
  if (server && server.exitCode === null) {
    const stopped = once(server, "exit");
    server.kill();
    await stopped;
  }
});
for (const lang of ["en", "zh"]) {
  test(`remaining screen labels render in ${lang} while payloads stay literal`, async () => {
    const page = await browser.newPage();
    await page.goto(
      `${base}/e2e/fixtures/localization-harness.html?lang=${lang}`,
    );
    await expect(page.getByTestId("not-found")).toContainText(
      lang === "zh" ? "找不到此页面" : "page could not be found",
    );
    await expect(page.getByTestId("card")).toContainText(
      lang === "zh" ? "查看全部" : "View All",
    );
    await expect(page.getByTestId("log")).toContainText(
      lang === "zh" ? "远程主机：" : "Remote host:",
    );
    await expect(page.getByTestId("log")).toContainText("raw error payload");
    await expect(page.getByTestId("log")).toContainText("GetObject");
    await expect(page.getByTestId("health")).toContainText(
      lang === "zh" ? "部署 ID：" : "Deployment ID:",
    );
    await page.close();
  });
}
