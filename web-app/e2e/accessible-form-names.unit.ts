// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import {
  Browser,
  BrowserContext,
  Page,
  TestInfo,
  chromium,
  expect,
  test,
} from "@playwright/test";
import { buildHarness } from "./fixtures/buildHarness";
import { browserExecutable } from "./fixtures/browserExecutable";
import { emulateCoarsePointer } from "./fixtures/emulateCoarsePointer";

let browser: Browser;
let context: BrowserContext | undefined;
let page: Page | undefined;
let script: string;
let unexpectedRequests: string[];
let pageErrors: string[];
let lookupRequests: unknown[];
const variants = [
  { language: "en", width: 1440 },
  { language: "zh", width: 390 },
];

test.beforeAll(async () => {
  const result = await buildHarness({
    configFile: false,
    logLevel: "silent",
    resolve: { tsconfigPaths: true },
    define: { "process.env.NODE_ENV": '"production"' },
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(
          new URL("./fixtures/accessibleFormNamesHarness.tsx", import.meta.url),
        ),
        name: "AccessibleFormNamesHarness",
        formats: ["iife"],
      },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!("output" in output)) throw new Error("Missing form-name harness");
  script = output.output
    .filter((item) => item.type === "chunk")
    .map((item) => item.code)
    .join("\n");
  browser = await chromium.launch({ executablePath: browserExecutable() });
});
test.beforeEach(() => {
  unexpectedRequests = [];
  pageErrors = [];
  lookupRequests = [];
});
test.afterEach(async () => {
  await context?.close();
  expect(unexpectedRequests).toEqual([]);
  expect(pageErrors).toEqual([]);
});
test.afterAll(async () => browser?.close());

async function mount(scenario: string, language: string, width: number) {
  await context?.close();
  context = await browser.newContext({
    viewport: { width, height: 1000 },
    hasTouch: width === 390,
  });
  page = await context.newPage();
  if (width === 390) await emulateCoarsePointer(page);
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === "http://form-names.test" && url.pathname === "/")
      return route.fulfill({
        contentType: "text/html",
        body: '<meta name="viewport" content="width=device-width, initial-scale=1"><div id="root"></div>',
      });
    if (
      url.pathname === "/api/v1/list-external-buckets" &&
      request.method() === "POST"
    ) {
      lookupRequests.push(request.postDataJSON());
      return route.fulfill({
        json: {
          buckets:
            scenario === "bulk-remote"
              ? [{ name: "remote-one" }, { name: "remote-two" }]
              : [],
        },
      });
    }
    unexpectedRequests.push(`${request.method()} ${url.pathname}`);
    return route.fulfill({
      status: 500,
      json: { message: "Unexpected request" },
    });
  });
  await page.goto(`http://form-names.test/?case=${scenario}&lang=${language}`);
  await page.addScriptTag({ content: script });
  await expect(page.getByRole("dialog")).toBeVisible();
  return page;
}

async function auditNames(
  currentPage: Page,
  info: TestInfo,
  scenario: string,
  language: string,
) {
  const axe = await new AxeBuilder({ page: currentPage })
    .withRules(["label"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await info.attach(`${scenario}-${language}-labels`, {
    contentType: "application/json",
    body: JSON.stringify(
      { violations: axe.violations, writes: unexpectedRequests },
      null,
      2,
    ),
  });
  if (language === "zh")
    await info.attach(`${scenario}-390-zh-mounted`, {
      contentType: "image/png",
      body: await currentPage.screenshot({ fullPage: true }),
    });
}

async function closeDialog(currentPage: Page) {
  await currentPage
    .getByRole("dialog")
    .getByRole("button", { name: /^(Close|关闭)$/, exact: true })
    .click();
  await expect(currentPage.getByRole("dialog")).toHaveCount(0);
  await expect(currentPage.getByTestId("closed")).toHaveText("[false]");
}

test("actual rename download field is named and preserves filename validation", async ({}, info) => {
  for (const { language, width } of variants) {
    const currentPage = await mount("rename", language, width);
    const input = currentPage.locator("#download-filename");
    await expect(input).toHaveAccessibleName(
      language === "zh" ? "名称" : "Name",
    );
    await expect(currentPage.locator("#download-file")).toBeDisabled();
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await input.fill("short-name.txt");
    await expect(input).toHaveValue("short-name.txt");
    await expect(currentPage.locator("#download-file")).toBeEnabled();
    await currentPage
      .getByRole("switch", {
        name: language === "zh" ? "使用原始名称" : "Use Original Name",
      })
      .check();
    await expect(input).toHaveValue(`${"long-name-".repeat(24)}.txt`);
    await expect(currentPage.locator("#download-file")).toBeEnabled();
    await auditNames(currentPage, info, "rename", language);
    await closeDialog(currentPage);
  }
});

test("actual inspect key remains named read-only across visibility changes", async ({}, info) => {
  for (const { language, width } of variants) {
    const currentPage = await mount("key", language, width);
    const input = currentPage.locator("#inspect-dec-key");
    await expect(input).toHaveAccessibleName(
      language === "zh" ? "检查归档解密密钥" : "Inspect Decryption Key",
    );
    await expect(input).toHaveJSProperty("readOnly", true);
    await expect(input).toHaveAttribute("type", "password");
    await input.focus();
    await input.press("x");
    await expect(input).toHaveValue("fixture-decryption-key");
    await currentPage.locator("#show-hide-key").click();
    await expect(input).toHaveAttribute("type", "text");
    await expect(input).toHaveValue("fixture-decryption-key");
    await currentPage.locator("#show-hide-key").click();
    await expect(input).toHaveAttribute("type", "password");
    await auditNames(currentPage, info, "key", language);
    await closeDialog(currentPage);
  }
});

test("actual bulk replication targets keep distinct names and usable long-bucket layouts", async ({}, info) => {
  const longName = `bucket-${"a".repeat(56)}`;
  const geometry: unknown[] = [];
  for (const { language, width } of variants) {
    for (const scenario of ["bulk", "bulk-remote"]) {
      const currentPage = await mount(scenario, language, width);
      await currentPage.locator("#accessKey").fill("fixture-access");
      await currentPage.locator("#secretKey").fill("fixture-secret");
      await currentPage
        .locator("#targetURL")
        .fill("replica.example.invalid:9000");
      await currentPage
        .getByRole("button", {
          name: language === "zh" ? "下一步" : "Next",
          exact: true,
        })
        .click();
      const first = currentPage.locator("#assign-bucket-0");
      const second = currentPage.locator("#assign-bucket-1");
      const firstControl =
        scenario === "bulk"
          ? first
          : currentPage.locator("#assign-bucket-0-select");
      const secondControl =
        scenario === "bulk"
          ? second
          : currentPage.locator("#assign-bucket-1-select");
      const prefix = language === "zh" ? "目标存储桶" : "Target Bucket";
      await expect
        .soft(firstControl)
        .toHaveAccessibleName(`${prefix}: source-one`);
      await expect
        .soft(secondControl)
        .toHaveAccessibleName(`${prefix}: ${longName}`);
      if (scenario === "bulk") await first.fill("remote-one");
      else {
        await firstControl.click();
        await expect(
          currentPage.locator("#assign-bucket-0-options-selector"),
        ).toHaveAccessibleName(`${prefix}: source-one`);
        await currentPage
          .locator("#assign-bucket-0-options-selector")
          .getByRole("option", { name: "remote-one", exact: true })
          .click();
      }
      await expect(second).toHaveValue("");
      if (scenario === "bulk") await second.fill("remote-two");
      else {
        await secondControl.focus();
        await secondControl.press("ArrowDown");
        await expect(
          currentPage.locator("#assign-bucket-1-options-selector"),
        ).toHaveAccessibleName(`${prefix}: ${longName}`);
        await currentPage
          .locator("#assign-bucket-1-options-selector")
          .getByRole("option", { name: "remote-two", exact: true })
          .click();
      }
      await expect(first).toHaveValue("remote-one");
      await currentPage
        .getByRole("button", {
          name: language === "zh" ? "上一步" : "Back",
          exact: true,
        })
        .click();
      await currentPage
        .getByRole("button", {
          name: language === "zh" ? "下一步" : "Next",
          exact: true,
        })
        .click();
      await expect(first).toHaveValue("remote-one");
      await expect(second).toHaveValue("remote-two");
      if (scenario === "bulk-remote") {
        await expect(firstControl).toHaveText("remote-one");
        await expect(secondControl).toHaveText("remote-two");
      }
      await expect(firstControl).toBeEnabled();
      await expect(secondControl).toBeEnabled();
      const boxes = await secondControl.evaluate((node, name) => {
        const dialog = node.closest('[role="dialog"]')!;
        const source = Array.from(dialog.querySelectorAll("div")).find(
          (element) =>
            element.childElementCount === 0 && element.textContent === name,
        )!;
        const rect = (element: Element) => {
          const r = element.getBoundingClientRect();
          return {
            x: r.x,
            y: r.y,
            right: r.right,
            bottom: r.bottom,
            width: r.width,
            height: r.height,
          };
        };
        return {
          control: rect(node),
          source: rect(source),
          dialog: rect(dialog),
          clientWidth: dialog.clientWidth,
          scrollWidth: dialog.scrollWidth,
          viewportWidth: innerWidth,
        };
      }, longName);
      geometry.push({ scenario, language, width, ...boxes });
      expect.soft(boxes.control.width).toBeGreaterThanOrEqual(240);
      expect.soft(boxes.control.x).toBeGreaterThanOrEqual(boxes.dialog.x);
      expect.soft(boxes.control.right).toBeLessThanOrEqual(boxes.dialog.right);
      expect.soft(boxes.source.right).toBeLessThanOrEqual(boxes.dialog.right);
      expect.soft(boxes.scrollWidth).toBeLessThanOrEqual(boxes.clientWidth + 1);
      expect.soft(boxes.dialog.right).toBeLessThanOrEqual(width + 1);
      expect
        .soft(
          boxes.source.right <= boxes.control.x ||
            boxes.source.bottom <= boxes.control.y,
        )
        .toBe(true);
      await auditNames(currentPage, info, scenario, language);
      await closeDialog(currentPage);
    }
  }
  await info.attach("bulk-long-name-geometry", {
    contentType: "application/json",
    body: JSON.stringify(geometry, null, 2),
  });
  expect(lookupRequests).toHaveLength(8);
  for (const request of lookupRequests)
    expect(request).toEqual({
      accessKey: "fixture-access",
      secretKey: "fixture-secret",
      targetURL: "replica.example.invalid:9000",
      useTLS: true,
    });
});

for (const scenario of ["replication-delete", "noncurrent-delete"])
  test(`actual ${scenario} confirmation is named and keeps exact phrase gating`, async ({}, info) => {
    for (const { language, width } of variants) {
      const currentPage = await mount(scenario, language, width);
      const phrase =
        scenario === "replication-delete"
          ? language === "zh"
            ? "是的，我确认"
            : "Yes, I am sure"
          : "YES, PROCEED";
      const name =
        language === "zh"
          ? `如需继续，请在输入框中输入 ${phrase}。`
          : `To continue please type ${phrase} in the box.`;
      const input = currentPage.locator(
        scenario === "replication-delete" ? "#retype-tenant" : "#type-confirm",
      );
      await expect(input).toHaveAccessibleName(name);
      await expect(currentPage.locator("#confirm-ok")).toBeDisabled();
      await input.fill("not confirmed");
      await expect(currentPage.locator("#confirm-ok")).toBeDisabled();
      await input.fill(phrase);
      await expect(currentPage.locator("#confirm-ok")).toBeEnabled();
      await input.fill("");
      await expect(currentPage.locator("#confirm-ok")).toBeDisabled();
      await auditNames(currentPage, info, scenario, language);
      await currentPage.locator("#confirm-cancel").click();
      await expect(currentPage.getByRole("dialog")).toHaveCount(0);
      await expect(currentPage.getByTestId("closed")).toHaveText("[false]");
    }
  });
