// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { Browser, chromium, expect, test } from "@playwright/test";
import { createServer, ViteDevServer } from "vite";
import { browserExecutable } from "./fixtures/browserExecutable";

let server: ViteDevServer;
let browser: Browser;
let base: string;

test.beforeAll(async () => {
  server = await createServer({
    logLevel: "silent",
    server: { host: "127.0.0.1", port: 0, open: false },
  });
  await server.listen();
  const address = server.httpServer?.address();
  if (!address || typeof address === "string")
    throw new Error("Missing test port");
  base = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch({ executablePath: browserExecutable() });
});

test.afterAll(async () => {
  await browser?.close();
  await server?.close();
});

for (const language of ["en", "zh"]) {
  test(`help trigger toggles once per click and preserves keyboard and outside dismissal (${language})`, async () => {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    try {
      await page.addInitScript((lang) => {
        localStorage.setItem("language", lang);
        localStorage.setItem("dark-mode", "off");
      }, language);
      await page.route("**/api/v1/login", (route) =>
        route.fulfill({
          json: { loginStrategy: "form", redirectRules: null },
        }),
      );
      await page.route("**/api/v1/session", (route) =>
        route.fulfill({ status: 401, json: { message: "Not logged in" } }),
      );
      await page.goto(`${base}/login`);
      await expect(page.locator("#accessKey")).toBeVisible();
      const trigger = page.getByRole("button", {
        name: language === "en" ? "Open help" : "打开帮助",
        exact: true,
      });
      const close = page.getByRole("button", {
        name: language === "en" ? "Close help" : "关闭帮助",
        exact: true,
      });

      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(close).toBeVisible();
      // A mousedown outside handler must not close and then reopen the panel
      // before the same trigger's click runs.
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(close).toHaveCount(0);
      await expect(trigger).toBeFocused();

      await trigger.press("Enter");
      await expect(close).toBeVisible();
      await close.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      await trigger.click();
      await expect(close).toBeVisible();
      await page.locator("#dark-mode-activator").click();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("#dark-mode-activator")).toBeFocused();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

      await trigger.focus();
      await trigger.press("Space");
      await expect(close).toBeVisible();
      await trigger.press("Space");
      await expect(close).toHaveCount(0);
      await expect(trigger).toBeFocused();
    } finally {
      await page.close();
    }
  });
}

for (const language of ["en", "zh"] as const) {
  test(`help hover preserves focus, all resource categories and full-card links (${language})`, async () => {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    try {
      await page.addInitScript(
        (lang) => localStorage.setItem("language", lang),
        language,
      );
      await page.route("**/api/v1/login", (route) =>
        route.fulfill({ json: { loginStrategy: "form", redirectRules: null } }),
      );
      await page.route("**/api/v1/session", (route) =>
        route.fulfill({ status: 401, json: { message: "Not logged in" } }),
      );
      await page.route("https://silo.pgsty.com/**/index.xml", (route) =>
        route.fulfill({
          contentType: "application/rss+xml",
          body: "<rss><channel><item><title>Release update</title><link>https://silo.pgsty.com/blog/test-update/</link><description>Latest project news</description></item></channel></rss>",
        }),
      );
      await page.goto(`${base}/login`);
      const field = page.locator("#accessKey");
      await field.focus();
      const trigger = page.getByRole("button", {
        name: language === "en" ? "Open help" : "打开帮助",
        exact: true,
      });
      const panel = page.locator(".help-menu-panel");
      await trigger.hover();
      await expect(panel).toBeVisible();
      await expect(field).toBeFocused();
      await expect(panel.getByRole("tab")).toHaveCount(3);
      await page.keyboard.press("Escape");
      await expect(panel).toHaveCount(0);
      await expect(field).toBeFocused();
      await page.mouse.move(0, 0);
      await trigger.hover();
      await expect(panel).toBeVisible();
      await page.mouse.move(0, 0);
      await expect(panel).toHaveCount(0);
      await trigger.click();
      await expect(
        panel.locator(".helpItemBlock").first().getByRole("link"),
      ).toHaveCount(1);
      await expect(
        panel.getByRole("link", {
          name: language === "en" ? "Learn more" : "了解更多",
          exact: true,
        }),
      ).toHaveCount(0);
      await panel
        .getByRole("tab", {
          name: language === "en" ? "Video" : "视频",
          exact: true,
        })
        .click();
      await expect(
        panel.locator('.helpItemBlock a[href*="resources.min.io"]'),
      ).toBeVisible();
      await panel
        .getByRole("tab", {
          name: language === "en" ? "Blog" : "博客",
          exact: true,
        })
        .click();
      await expect(
        panel.getByRole("link", { name: "Release update Latest project news" }),
      ).toBeVisible();
      await expect(
        panel.getByRole("link", {
          name: language === "en" ? "RSS feed" : "RSS 订阅",
          exact: true,
        }),
      ).toHaveAttribute(
        "href",
        language === "zh"
          ? "https://silo.pgsty.com/zh/blog/index.xml"
          : "https://silo.pgsty.com/blog/index.xml",
      );
    } finally {
      await page.close();
    }
  });

  test(`login footer, publisher links and responsive headline balance (${language})`, async () => {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    try {
      await page.addInitScript(
        (lang) => localStorage.setItem("language", lang),
        language,
      );
      await page.route("**/api/v1/login", (route) =>
        route.fulfill({ json: { loginStrategy: "form", redirectRules: null } }),
      );
      await page.route("**/api/v1/session", (route) =>
        route.fulfill({ status: 401, json: { message: "Not logged in" } }),
      );
      await page.goto(`${base}/login`);
      await expect(page.locator(".footer a")).toHaveText(
        language === "en"
          ? ["SILO", "DOCS", "GitHub", "Download"]
          : ["SILO", "文档", "GitHub", "下载"],
      );
      for (const link of await page
        .getByRole("link", { name: "PGSTY", exact: true })
        .all()) {
        await expect(link).toHaveAttribute(
          "href",
          language === "zh" ? "https://pgsty.com/zh/" : "https://pgsty.com/",
        );
      }
      await expect(
        page.getByRole("link", { name: "PGSTY", exact: true }),
      ).toHaveCount(2);
      await page.evaluate(() => document.fonts.ready);
      for (const width of [1440, 1024, 768]) {
        await page.setViewportSize({ width, height: 900 });
        if (language === "en") {
          await expect
            .poll(async () => {
              const first = (await page
                .locator(".heroLine")
                .nth(0)
                .boundingBox())!;
              const second = (await page
                .locator(".heroLine")
                .nth(1)
                .boundingBox())!;
              return Math.abs(first.width - second.width);
            })
            .toBeLessThan(1);
        }
        const overflow = await page.locator("aside").evaluate((el) => {
          const bounds = el.getBoundingClientRect();
          return [...el.querySelectorAll(".heroLine, .intro, .legal")].some(
            (node) => node.getBoundingClientRect().right > bounds.right + 1,
          );
        });
        expect(overflow).toBe(false);
        const legal = await page.locator(".legal").evaluate((el) => {
          const panel = el.closest("aside")!;
          return {
            bottomGap:
              panel.getBoundingClientRect().bottom -
              el.getBoundingClientRect().bottom,
            padding: parseFloat(
              getComputedStyle(el.parentElement!).paddingBottom,
            ),
            linksReadable: [...el.querySelectorAll("a")].every(
              (link) =>
                getComputedStyle(link).color === getComputedStyle(el).color,
            ),
          };
        });
        expect(Math.abs(legal.bottomGap - legal.padding)).toBeLessThan(1);
        expect(legal.linksReadable).toBe(true);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(page.locator("aside")).toBeHidden();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(390);
    } finally {
      await page.close();
    }
  });
}
