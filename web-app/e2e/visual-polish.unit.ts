// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { fileURLToPath } from "node:url";
import { Browser, Page, chromium, expect, test } from "@playwright/test";
import { buildHarness } from "./fixtures/buildHarness";
import { browserExecutable } from "./fixtures/browserExecutable";
import { emulateCoarsePointer } from "./fixtures/emulateCoarsePointer";
import { formatAxisTick } from "../src/screens/Console/Dashboard/Prometheus/Widgets/formatAxisTick";

test.describe.configure({ mode: "serial" });
let browser: Browser, page: Page, script: string;
let requests: URL[];
type HelpLoadWindow = Window & {
  __t22HelpTabsGate?: Promise<void>;
  __t22ResolveHelpTabs?: () => void;
  __t22HelpTabsResolved?: boolean;
};
test.beforeAll(async () => {
  const result = await buildHarness({
    configFile: false,
    logLevel: "silent",
    define: { "process.env.NODE_ENV": '"production"' },
    resolve: { tsconfigPaths: true },
    plugins: [
      {
        name: "delay-real-help-tabs",
        enforce: "pre",
        transform(code, id) {
          if (!id.endsWith("/screens/Console/HelpMenu.tsx")) return;
          const loader =
            '() => import("../../../packages/mds/src/components/Tabs/Tabs")';
          if (!code.includes(loader))
            throw new Error("Help Tabs loader changed");
          return code.replace(
            loader,
            `() => Promise.resolve(window.__t22HelpTabsGate)
              .then(() => import("../../../packages/mds/src/components/Tabs/Tabs"))
              .then((module) => { window.__t22HelpTabsResolved = true; return module; })`,
          );
        },
      },
    ],
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(
          new URL("./fixtures/visualPolishHarness.tsx", import.meta.url),
        ),
        name: "VisualPolishHarness",
        formats: ["iife"],
      },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!("output" in output)) throw new Error("Missing harness output");
  script = output.output
    .filter((item) => item.type === "chunk")
    .map((item) => item.code)
    .join("\n");
  browser = await chromium.launch({ executablePath: browserExecutable() });
});
test.afterEach(async () => page?.close());
test.afterAll(async () => browser?.close());
async function mount(table = false, coarse = false, delayHelp = false) {
  page = await browser.newPage({
    viewport: { width: 900, height: 900 },
    hasTouch: coarse,
  });
  if (coarse) await emulateCoarsePointer(page);
  requests = [];
  await page.route("http://polish.test/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<base href="/"><style>*{box-sizing:border-box}body{margin:0;font-family:sans-serif}</style><div id="root"></div>',
    }),
  );
  await page.route("**/api/v1/admin/inspect?*", (route) => {
    requests.push(new URL(route.request().url()));
    return route.fulfill({
      contentType: "application/zip",
      headers: { "content-disposition": 'attachment; filename="inspect.zip"' },
      body: "test archive",
    });
  });
  await page.goto(`http://polish.test/${table ? "?table" : ""}`);
  if (delayHelp)
    await page.evaluate(() => {
      const target = window as HelpLoadWindow;
      target.__t22HelpTabsGate = new Promise<void>((resolve) => {
        target.__t22ResolveHelpTabs = resolve;
      });
    });
  await page.addScriptTag({ content: script });
  await expect(page.locator(table ? "#many" : "#inspect_volume")).toBeVisible();
}
const submitDirectly = () =>
  page
    .locator("#inspect_volume")
    .evaluate((input) =>
      input
        .closest("form")!
        .dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        ),
    );

test("numeric axis labels trim float tails without losing small rates or inventing finite values", () => {
  expect(formatAxisTick(116.60000000000001)).toBe("116.6");
  expect(formatAxisTick(0.000000123456789)).toBe("1.23457e-7");
  expect(formatAxisTick(-0.000123456789)).toBe("-0.000123457");
  expect(formatAxisTick(0)).toBe("0");
  expect(formatAxisTick("0.25")).toBe("0.25");
  expect(formatAxisTick(Infinity)).toBe("Infinity");
  expect(formatAxisTick(NaN)).toBe("NaN");
  expect(formatAxisTick("n/a")).toBe("n/a");
  expect(formatAxisTick("")).toBe("");
});

test("actual Inspect stays pristine through language changes, validates touched/submit and resets", async () => {
  await mount();
  const volume = page.locator("#inspect_volume"),
    path = page.locator("#inspect_path");
  await expect(
    page.getByText("This field is required", { exact: true }),
  ).toHaveCount(0);
  await page.locator("#zh").click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  await volume.focus();
  await path.focus();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(1);
  await page.locator("#en").click();
  await expect(
    page.getByText("This field is required", { exact: true }),
  ).toHaveCount(2);
  await volume.fill("   ");
  await path.fill("   ");
  await submitDirectly();
  expect(requests).toHaveLength(0);
  await expect(page.locator("#inspect-start")).toBeDisabled();
  await volume.fill(" /bucket");
  await path.fill("/path");
  await expect(
    page.getByText("Volume/Bucket name cannot start with /", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Path cannot start with /", { exact: true }),
  ).toBeVisible();
  await submitDirectly();
  expect(requests).toHaveLength(0);
  await volume.fill("bucket");
  await path.fill("docs/x");
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  await expect(page.locator("#inspect-start")).toBeEnabled();
  await page.locator("#zh").click();
  await page.locator("#inspect-clear-button").click();
  await expect(volume).toHaveValue("");
  await expect(path).toHaveValue("");
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  await page.locator("#en").click();
  await expect(
    page.getByText("This field is required", { exact: true }),
  ).toHaveCount(0);
});

test("actual Inspect guards pristine submit and preserves encoded download and decryption reset", async () => {
  await mount();
  await submitDirectly();
  expect(requests).toHaveLength(0);
  await expect(
    page.getByText("This field is required", { exact: true }),
  ).toHaveCount(2);
  await page
    .context()
    .addCookies([
      { name: "inspect.zip", value: "test-key", url: "http://polish.test/" },
    ]);
  await page.locator("#inspect_volume").fill("bucket ?&#");
  await page.locator("#inspect_path").fill("docs/中 文%*/xl.meta");
  const download = page.waitForEvent("download");
  await page.locator("#inspect-start").click();
  expect((await download).suggestedFilename()).toBe("inspect.zip");
  expect(requests).toHaveLength(1);
  expect(requests[0].searchParams.get("volume")).toBe("bucket ?&#");
  expect(requests[0].searchParams.get("file")).toBe("docs/中 文%*/xl.meta");
  expect(requests[0].searchParams.get("encrypt")).toBe("true");
  await expect(
    page.getByRole("dialog", { name: "Inspect Decryption Key" }),
  ).toBeVisible();
  await expect(page.locator("#inspect-dec-key")).toHaveValue("test-key");
  // polish.test is plain HTTP, where the async Clipboard API is absent. The
  // copy action must still work, and stay the field's only overlay button.
  const copyKey = page.locator(
    ".textBoxContainer:has(#inspect-dec-key) .overlayAction button",
  );
  await expect(copyKey).toHaveCount(1);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await copyKey.click();
  expect(pageErrors).toEqual([]);
  await expect(page.locator("#inspect-dec-key")).toHaveAttribute(
    "type",
    "password",
  );
  // Leave the button so its tooltip does not take the first Escape.
  await page.mouse.move(0, 0);
  await page.locator("#inspect-dec-key").focus();
  await page.keyboard.press("Escape");
  await expect(page.locator("#inspect_volume")).toHaveValue("");
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  expect(
    (await page.context().cookies()).some(
      (cookie) => cookie.name === "inspect.zip",
    ),
  ).toBe(false);
});

test("real header and Overflow trigger hints do not cover expanded menus; Escape restores trigger", async () => {
  await mount();
  for (const name of ["Open help", "Fixture actions"]) {
    const trigger = page.getByRole("button", { name, exact: true });
    await trigger.focus();
    await expect(page.getByRole("tooltip")).toBeVisible();
    await trigger.click();
    await expect(page.getByRole("tooltip")).toHaveCount(0);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    if (name === "Fixture actions") {
      await expect(
        page.getByRole("menuitem", { name: "Download" }),
      ).toBeVisible();
      await expect(
        page.getByRole("menuitem", { name: "Download" }),
      ).toBeFocused();
    } else {
      await expect(
        page.getByRole("button", { name: "Close help" }),
      ).toBeVisible();
      await expect
        .poll(() =>
          page
            .locator(".help-menu-panel")
            .evaluate((panel) => panel.contains(document.activeElement)),
        )
        .toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  }
});

test("Help owns one-Escape dismissal while Tabs loads and late resolution preserves trigger focus", async () => {
  await mount(false, false, true);
  const trigger = page.getByRole("button", { name: "Open help", exact: true });
  await trigger.click();
  const panel = page.locator(".help-menu-panel");
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("button")).toHaveCount(0);
  await expect(panel).toBeFocused();
  expect((await panel.boundingBox())!.height).toBeLessThan(240);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await page.evaluate(() => (window as HelpLoadWindow).__t22ResolveHelpTabs!());
  await expect
    .poll(() =>
      page.evaluate(() => (window as HelpLoadWindow).__t22HelpTabsResolved),
    )
    .toBe(true);
  await expect(panel).toHaveCount(0);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("bounded table shows complete short rows and scrolls large lists at both densities and real coarse geometry", async () => {
  await mount(true);
  const table = page.locator(".bounded-fixture");
  const first = page.locator(".ReactVirtualized__Table__row").first();
  await page.locator("#zero").click();
  await expect(page.getByText("No records", { exact: true })).toBeVisible();
  await page.locator("#one").click();
  await expect(page.getByText("record-0", { exact: true })).toBeVisible();
  await expect(page.locator(".ReactVirtualized__Table__row")).toHaveCount(1);
  await page.locator("#loading").click();
  await expect(page.getByText("Loading rows")).toBeVisible();
  await page.locator("#loading").click();
  await page.locator("#two").click();
  for (const coarse of [false, true]) {
    if (coarse) {
      await emulateCoarsePointer(page);
      expect(
        await page.evaluate(() => matchMedia("(pointer: coarse)").matches),
      ).toBe(true);
    }
    for (const compact of [false, true]) {
      if (compact) await page.locator("#compact").click();
      await expect(first).toBeVisible();
      const expected = coarse ? 40 : compact ? 28 : 36;
      await expect(first).toHaveCSS("height", `${expected}px`);
      const box = await table.boundingBox();
      expect(box!.height).toBeLessThan(160);
      await expect(page.getByText("record-1", { exact: true })).toBeVisible();
      await page.locator("#many").click();
      await page.locator(".ReactVirtualized__Table__Grid").evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      await expect(page.getByText("record-199", { exact: true })).toBeVisible();
      await page.locator("#two").click();
      await expect(page.getByText("record-1", { exact: true })).toBeVisible();
      if (compact) await page.locator("#compact").click();
    }
  }
});
