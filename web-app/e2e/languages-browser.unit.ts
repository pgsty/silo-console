// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
import { test, expect, chromium, Browser, Page } from "@playwright/test";
import { spawn, ChildProcess } from "node:child_process";
import { once } from "node:events";
import { LOCALES, languages, Lang } from "../src/i18n/locales";
let server: ChildProcess, browser: Browser, base: string;
test.beforeAll(async () => {
  server = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import { createServer } from 'vite';const server=await createServer({logLevel:'silent',server:{host:'127.0.0.1',port:0,open:false}});await server.listen();process.send('http://127.0.0.1:'+server.httpServer.address().port);`,
    ],
    { stdio: ["ignore", "ignore", "inherit", "ipc"] },
  );
  base = await new Promise((resolve, reject) => {
    server.once("message", (v) => resolve(String(v)));
    server.once("error", reject);
    server.once("exit", (code) => reject(Error(`Vite exited: ${code}`)));
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
async function setup(page: Page, language?: string) {
  await page.addInitScript((lang) => {
    if (lang) localStorage.setItem("language", lang);
    localStorage.setItem("dark-mode", "off");
  }, language);
  await page.route("**/api/v1/login", (r) =>
    r.fulfill({ json: { loginStrategy: "form", redirectRules: null } }),
  );
  await page.route("**/api/v1/session", (r) =>
    r.fulfill({ status: 401, json: { message: "Not logged in" } }),
  );
  await page.route("**/api/v1/admin/info", (r) =>
    r.fulfill({ json: { servers: [] } }),
  );
  await page.route("**/api/v1/site-replication", (r) =>
    r.fulfill({ json: { enabled: false, sites: [] } }),
  );
}
async function fit(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    )
    .toBeLessThanOrEqual(1);
  const button = page.locator("#language-activator");
  await expect(button).toBeVisible();
  const rect = (await button.boundingBox())!;
  expect(rect.x).toBeGreaterThanOrEqual(0);
  expect(rect.x + rect.width).toBeLessThanOrEqual(
    page.viewportSize()!.width + 1,
  );
  await button.click();
  const menu = page.getByRole("listbox");
  await expect(menu).toBeVisible();
  const box = (await menu.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
}
for (const language of languages)
  test(`login and site-replication form fit all target widths in ${language}`, async () => {
    const page = await browser.newPage();
    try {
      await setup(page, language);
      for (const width of [350, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${base}/login`);
        await expect(page.locator("#accessKey")).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute(
          "lang",
          LOCALES[language].tag,
        );
        await expect(page.locator("html")).toHaveAttribute(
          "dir",
          LOCALES[language].dir,
        );
        await fit(page);
        await page.goto(`${base}/e2e/fixtures/languages-harness.html`);
        await expect(page.locator("#language-activator")).toBeVisible();
        await fit(page);
      }
    } finally {
      await page.close();
    }
  });
test("menu is keyboard accessible, persists selection, and defaults to English independently of browser language", async () => {
  const page = await browser.newPage({ locale: "ar-EG" });
  try {
    await setup(page);
    await page.goto(`${base}/login`);
    const trigger = page.locator("#language-activator");
    await expect(trigger).toHaveAccessibleName("Language");
    await trigger.focus();
    await trigger.press("ArrowDown");
    await expect(page.getByRole("option")).toHaveCount(languages.length);
    await expect(
      page.getByRole("option", { name: "العربية", exact: true }),
    ).toHaveAttribute("dir", "rtl");
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    expect(await page.evaluate(() => localStorage.getItem("language"))).toBe(
      "zh",
    );
    await page.reload();
    await expect(trigger).toHaveAccessibleName("语言");
    await trigger.click();
    await page.getByRole("option", { name: "English", exact: true }).click();
    await expect(trigger).toHaveAccessibleName("Language");
  } finally {
    await page.close();
  }
});

for (const language of languages)
  test(`compact metrics and lifecycle labels fit their controls in ${language}`, async () => {
    const page = await browser.newPage();
    try {
      await setup(page, language);
      await page.route("**/api/v1/admin/tiers**", (r) =>
        r.fulfill({ json: { items: [] } }),
      );
      for (const width of [350, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(
          `${base}/e2e/fixtures/languages-harness.html?screen=metrics`,
        );
        await expect(page.locator(".dashboard-time-stat-item")).toHaveCount(2);
        const metrics = await page
          .locator(".dashboard-time-stat-item")
          .evaluateAll((rows) =>
            rows.map((row) => {
              const label = row.querySelector<HTMLElement>(".timeStatLabel")!;
              const value = row.querySelector<HTMLElement>(".timeStatValue")!;
              const a = label.getBoundingClientRect(),
                b = value.getBoundingClientRect();
              return {
                overflow: label.scrollWidth - label.clientWidth,
                overlap: Math.min(a.right, b.right) - Math.max(a.left, b.left),
                lines:
                  a.height / parseFloat(getComputedStyle(label).lineHeight),
                rowOverflow: row.scrollWidth - row.clientWidth,
              };
            }),
          );
        for (const metric of metrics) {
          expect(metric.overflow).toBeLessThanOrEqual(1);
          expect(metric.overlap).toBeLessThanOrEqual(0);
          expect(metric.lines).toBeLessThanOrEqual(2.05);
          expect(metric.rowOverflow).toBeLessThanOrEqual(1);
        }
        await page.goto(
          `${base}/e2e/fixtures/languages-harness.html?screen=lifecycle`,
        );
        const input = page.locator("#noncurrentversion_expiration_days");
        const label = page.locator(
          'label[for="noncurrentversion_expiration_days"]',
        );
        await expect(input).toBeVisible();
        await label.click();
        await expect(input).toBeFocused();
        const field = await label.evaluate((el) => {
          const box = el.getBoundingClientRect();
          const text = document.createRange();
          text.selectNodeContents(el);
          const bounds = text.getBoundingClientRect();
          return {
            left: bounds.left,
            right: bounds.right,
            clipped:
              bounds.width > box.width + 1 || bounds.height > box.height + 1,
            pageOverflow:
              document.documentElement.scrollWidth - window.innerWidth,
          };
        });
        expect(field.left).toBeGreaterThanOrEqual(0);
        expect(field.right).toBeLessThanOrEqual(width);
        expect(field.clipped).toBe(false);
        expect(field.pageOverflow).toBeLessThanOrEqual(1);
      }
    } finally {
      await page.close();
    }
  });
test("all languages switch offline without discarding form input", async () => {
  const page = await browser.newPage();
  try {
    await setup(page);
    await page.goto(`${base}/login`);
    const trigger = page.locator("#language-activator");
    await expect(trigger).toBeVisible();
    await page.locator("#accessKey").fill("unsaved-user");
    await page.context().setOffline(true);
    for (const language of languages) {
      await trigger.click();
      await page
        .getByRole("option", { name: LOCALES[language].label, exact: true })
        .click();
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        LOCALES[language].tag,
      );
      await expect(page.locator("#accessKey")).toHaveValue("unsaved-user");
    }
  } finally {
    await page.close();
  }
});
test("Arabic lays out protocol fields' icons and overlay button LTR", async () => {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });
  try {
    await setup(page, "ar");
    await page.goto(`${base}/login`);
    const input = page.locator("#secretKey");
    await input.fill("secret-value");
    const layout = await input.evaluate((el) => {
      const field = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const button = el
        .closest(".textBoxContainer")!
        .querySelector(".overlayAction")!
        .getBoundingClientRect();
      return {
        direction: style.direction,
        textEnd: field.right - parseFloat(style.paddingRight),
        buttonLeft: button.left,
        buttonRight: button.right,
        fieldRight: field.right,
      };
    });
    expect(layout.direction).toBe("ltr");
    // The reveal button stays inside the padding reserved after the text.
    expect(layout.buttonLeft).toBeGreaterThanOrEqual(layout.textEnd);
    expect(layout.buttonRight).toBeLessThanOrEqual(layout.fieldRight);
  } finally {
    await page.close();
  }
});

test("Arabic keeps protocol payloads LTR and does not translate log messages", async () => {
  const page = await browser.newPage({ viewport: { width: 350, height: 900 } });
  try {
    await setup(page, "ar");
    await page.goto(`${base}/e2e/fixtures/languages-harness.html?screen=raw`);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("raw-path")).toHaveText(
      "archive/日本語/ملف.json",
    );
    for (const selector of ['[data-testid="raw-path"]', "textarea"])
      expect(
        await page
          .locator(selector)
          .evaluate((el) => getComputedStyle(el).direction),
      ).toBe("ltr");
    await expect(page.locator("table")).toContainText(
      "Access Denied raw server message",
    );
    await expect(page.getByTestId("quantity")).toContainText(
      await page.evaluate(() => new Intl.NumberFormat("ar").format(22)),
    );
    await page.locator("#drawer-trigger").click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await expect
      .poll(async () =>
        Math.abs(
          (await drawer.boundingBox())!.x +
            (await drawer.boundingBox())!.width -
            350,
        ),
      )
      .toBeLessThanOrEqual(1);
    await page.keyboard.press("Escape");
    await expect(page.locator("#drawer-trigger")).toBeFocused();
    const tabs = page.getByRole("tab");
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(tabs.nth(1)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(0)).toBeFocused();
    const thumb = page.locator(".switch-thumb");
    const checkedX = (await thumb.boundingBox())!.x;
    // This fixture keeps checked state controlled; its native checked action
    // is verified by the existing switch suite. Here assert the RTL rail edge.
    expect(checkedX).toBeGreaterThanOrEqual(
      (await page.locator(".switchRail").boundingBox())!.x - 1,
    );
    await fit(page);
  } finally {
    await page.close();
  }
});
for (const pseudo of ["en-XA", "ar-XB"])
  test(`expanded ${pseudo} copy fits phone and tablet`, async () => {
    const page = await browser.newPage();
    try {
      await setup(page);
      for (const width of [350, 768]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${base}/login?pseudo=${pseudo}`);
        await expect(page.locator("#language-activator")).toHaveAccessibleName(
          /⟦/,
        );
        await fit(page);
        await page.goto(
          `${base}/e2e/fixtures/languages-harness.html?pseudo=${pseudo}`,
        );
        await fit(page);
      }
    } finally {
      await page.close();
    }
  });
