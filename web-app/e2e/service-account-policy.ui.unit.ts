// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import { fileURLToPath } from "node:url";
import {
  Browser,
  BrowserContext,
  Page,
  chromium,
  expect,
  test,
} from "@playwright/test";
import { buildHarness } from "./fixtures/buildHarness";
import { browserExecutable } from "./fixtures/browserExecutable";
import type { ServiceAccount } from "../src/api/consoleApi";

test.describe.configure({ mode: "serial" });

const parentPolicy =
  '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::parent/*"]}]}';
const inlinePolicy =
  '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::restricted/*"]}]}';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let script: string;
let styles: string;
let writes: Record<string, unknown>[];
let writePaths: string[];
let getCount: number;
let errors: string[];

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
          new URL(
            "./fixtures/serviceAccountPolicyHarness.tsx",
            import.meta.url,
          ),
        ),
        name: "ServiceAccountPolicyHarness",
        formats: ["iife"],
      },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!("output" in output)) throw new Error("Missing service-account harness");
  script = output.output
    .filter((item) => item.type === "chunk")
    .map((item) => (item.type === "chunk" ? item.code : ""))
    .join("\n");
  styles = output.output
    .filter((item) => item.type === "asset" && item.fileName.endsWith(".css"))
    .map((item) => (item.type === "asset" ? String(item.source) : ""))
    .join("\n");
  browser = await chromium.launch({ executablePath: browserExecutable() });
});

test.afterEach(async () => {
  await context?.close();
  expect(errors).toEqual([]);
});

test.afterAll(async () => {
  await browser?.close();
});

async function mount(
  account: ServiceAccount,
  options: {
    failure?: boolean;
    hold?: boolean;
    unselected?: boolean;
    emptyAccessKey?: boolean;
    readOnly?: boolean;
    rejectUpdate?: boolean;
    language?: "en" | "zh";
  } = {},
) {
  context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  page = await context.newPage();
  writes = [];
  writePaths = [];
  errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  getCount = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  await page.route("**/*", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.startsWith("/api/v1/service-accounts/")) {
      if (request.method() === "GET") {
        getCount++;
        if (options.hold && path.endsWith("/test-access")) await gate;
        if (options.failure) {
          return route.fulfill({
            status: 503,
            contentType: "application/json",
            body: JSON.stringify({
              message: "controlled account read failure",
            }),
          });
        }
        return route.fulfill({
          status: 200,
          json: path.endsWith("/next-access")
            ? {
                impliedPolicy: false,
                policy: inlinePolicy,
                name: "next-account",
              }
            : account,
        });
      }
      writes.push(request.postDataJSON() as Record<string, unknown>);
      writePaths.push(path);
      if (options.rejectUpdate) {
        return route.fulfill({
          status: 400,
          json: { message: "invalid policy document" },
        });
      }
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      contentType: "text/html",
      body: '<base href="/"><div id="root"></div>',
    });
  });

  const query = new URLSearchParams();
  if (options.unselected) query.set("unselected", "1");
  if (options.emptyAccessKey) query.set("accessKey", "");
  if (options.readOnly) query.set("readOnly", "1");
  if (options.language) query.set("lang", options.language);
  await page.goto(`http://service-account.test/?${query}`);
  if (styles) await page.addStyleTag({ content: styles });
  await page.addScriptTag({ content: script });
  return { release };
}

test("inherited metadata and status saves do not echo a parent policy over 4 KiB", async () => {
  const largeParentPolicy = JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["s3:GetObject"],
        Resource: Array.from(
          { length: 180 },
          (_, i) => `arn:aws:s3:::parent-bucket-${i}/*`,
        ),
      },
    ],
  });
  expect(largeParentPolicy.length).toBeGreaterThan(4096);
  await mount({
    accountStatus: "on",
    impliedPolicy: true,
    policy: largeParentPolicy,
    name: "old-name",
    expiration: "2030-01-02T03:04:00Z",
  });
  await expect(page.locator("#save-sa-policy")).toBeEnabled();
  await page.locator("#name").fill("new-name");
  await page.locator("#description").fill("new-description");
  await page.locator("#saStatus").uncheck();
  await page.locator("#save-sa-policy").click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0]).toMatchObject({
    name: "new-name",
    description: "new-description",
    status: "off",
    policy: "",
  });
  expect(Date.parse(String(writes[0].expiry))).toBe(
    Date.parse("2030-01-02T03:04:00Z"),
  );
});

test("enabling an inherited restriction sends the policy draft", async () => {
  await mount({ impliedPolicy: true, policy: parentPolicy });
  await page.locator("#serviceAccountPolicy").check();
  await expect(page.locator("#code_wrapper")).toBeVisible();
  await page.locator("#save-sa-policy").click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0].policy).toBe(parentPolicy);
});

test("unchanged inline policy saves metadata without a policy update", async () => {
  await mount({ impliedPolicy: false, policy: inlinePolicy, name: "old-name" });
  await page.locator("#name").fill("new-name");
  await page.locator("#save-sa-policy").click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0]).toMatchObject({ name: "new-name", policy: "" });
});

test("turning off an inline restriction sends an explicit empty policy", async () => {
  await mount({ impliedPolicy: false, policy: inlinePolicy });
  await page.locator("#serviceAccountPolicy").uncheck();
  await page.locator("#save-sa-policy").click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0].policy).toBe('{"Statement":[]}');
});

test("a pending initial load cannot be saved or edited", async () => {
  const pending = await mount(
    { impliedPolicy: true, policy: parentPolicy },
    { hold: true },
  );
  try {
    await expect.poll(() => getCount).toBe(1);
    await expect(page.locator("#save-sa-policy")).toBeDisabled();
    await expect(page.locator("#name")).toBeDisabled();
    await expect(page.locator("#serviceAccountPolicy")).toBeDisabled();
    await page.locator("form").dispatchEvent("submit");
    expect(writes).toEqual([]);
  } finally {
    pending.release();
  }
  await expect(page.locator("#save-sa-policy")).toBeEnabled();
});

test("a failed initial load cannot fall back to inherited defaults", async () => {
  await mount({}, { failure: true });
  await expect(
    page.getByText("controlled account read failure.", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("#save-sa-policy")).toBeDisabled();
  await expect(page.locator("#saStatus")).toBeDisabled();
  await page.locator("form").dispatchEvent("submit");
  expect(writes).toEqual([]);
});

for (const options of [{ unselected: true }, { emptyAccessKey: true }]) {
  test(`an absent selection cannot load or save: ${JSON.stringify(options)}`, async () => {
    await mount({}, options);
    await expect(page.locator("#save-sa-policy")).toBeDisabled();
    await page.locator("form").dispatchEvent("submit");
    expect(getCount).toBe(0);
    expect(writes).toEqual([]);
  });
}

test("editing an inline restriction sends only the edited document", async () => {
  await mount({ impliedPolicy: false, policy: inlinePolicy });
  await page.locator("#code_wrapper").fill(parentPolicy);
  await page.locator("#save-sa-policy").click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0].policy).toBe(parentPolicy);
});

for (const inherited of [true, false]) {
  test(`toggling restriction away and back preserves the original policy: inherited=${inherited}`, async () => {
    await mount({ impliedPolicy: inherited, policy: inlinePolicy });
    const toggle = page.locator("#serviceAccountPolicy");
    await expect(toggle).toBeEnabled();
    await toggle.setChecked(inherited);
    await toggle.setChecked(!inherited);
    await page.locator("#save-sa-policy").click();
    await expect.poll(() => writes.length).toBe(1);
    expect(writes[0].policy).toBe("");
  });

  test(`read-only account details cannot submit policy changes: inherited=${inherited}`, async () => {
    await mount(
      { impliedPolicy: inherited, policy: inlinePolicy },
      { readOnly: true, language: "zh" },
    );
    await expect(page.locator("#code_wrapper")).toHaveValue(inlinePolicy);
    await expect(page.locator("#code_wrapper")).not.toBeEditable();
    await expect(
      page.getByRole("switch", { name: "在用户策略基础上进一步限制" }),
    ).toBeDisabled();
    await expect(page.locator("#save-sa-policy")).toHaveCount(0);
    await page.locator("form").dispatchEvent("submit");
    expect(writes).toEqual([]);
  });
}

test("a blank draft cannot silently turn an inline edit into a no-op or reset", async () => {
  await mount({ impliedPolicy: false, policy: inlinePolicy });
  await page.locator("#code_wrapper").fill(" \n ");
  await expect(page.locator("#save-sa-policy")).toBeDisabled();
  await page.locator("form").dispatchEvent("submit");
  expect(writes).toEqual([]);
  await page.locator("#serviceAccountPolicy").uncheck();
  await page.locator("#save-sa-policy").click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0].policy).toBe('{"Statement":[]}');
});

test("a rejected policy keeps the draft available for correction", async () => {
  await mount(
    { impliedPolicy: false, policy: inlinePolicy },
    { rejectUpdate: true },
  );
  await page.locator("#code_wrapper").fill('{"Statement":');
  await page.locator("#save-sa-policy").click();
  await expect(
    page.getByText("invalid policy document.", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("#save-sa-policy")).toBeEnabled();
  await expect(page.locator("#code_wrapper")).toHaveValue('{"Statement":');
  expect(writes).toHaveLength(1);
});

test("a delayed response for a previous account cannot overwrite the new selection", async () => {
  const pending = await mount(
    { impliedPolicy: true, policy: parentPolicy, name: "old-account" },
    { hold: true },
  );
  try {
    await expect.poll(() => getCount).toBe(1);
    // Trigger a parent prop change while the dialog keeps the background inert.
    await page
      .locator("#select-next-account")
      .evaluate((element) => (element as HTMLButtonElement).click());
    await expect(page.locator("#name")).toHaveValue("next-account");
    const oldResponse = page.waitForResponse((response) =>
      response.url().endsWith("/service-accounts/test-access"),
    );
    pending.release();
    await (await oldResponse).finished();
    await expect(page.locator("#name")).toHaveValue("next-account");
    await expect(page.locator("#serviceAccountPolicy")).toBeChecked();
    await page.locator("#save-sa-policy").click();
    await expect.poll(() => writes.length).toBe(1);
    expect(writes[0]).toMatchObject({ name: "next-account", policy: "" });
    expect(writePaths).toEqual(["/api/v1/service-accounts/next-access"]);
  } finally {
    pending.release();
  }
});
