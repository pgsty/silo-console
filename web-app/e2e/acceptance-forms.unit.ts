// This file is part of MinIO Console Server
// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { fileURLToPath } from "node:url";
import {
  Browser,
  BrowserContext,
  Locator,
  Page,
  chromium,
  expect,
  test,
} from "@playwright/test";
import { buildHarness } from "./fixtures/buildHarness";
import { browserExecutable } from "./fixtures/browserExecutable";
import { emulateCoarsePointer } from "./fixtures/emulateCoarsePointer";
import AxeBuilder from "@axe-core/playwright";

test.describe.configure({ mode: "serial" });
let browser: Browser;
let context: BrowserContext;
let page: Page;
let script: string;
let writes: string[];
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
          new URL("./fixtures/acceptanceFormsHarness.tsx", import.meta.url),
        ),
        name: "AcceptanceFormsHarness",
        formats: ["iife"],
      },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!("output" in output)) throw new Error("Missing forms harness output");
  script = output.output
    .filter((item) => item.type === "chunk")
    .map((item) => item.code)
    .join("\n");
  browser = await chromium.launch({ executablePath: browserExecutable() });
});
test.afterEach(async () => {
  expect(writes).toEqual([]);
  expect(errors).toEqual([]);
  await context?.close();
});
test.afterAll(async () => browser?.close());

async function mount(
  scenario = "controls",
  language = "en",
  width = 1440,
  theme = "light",
  coarse = false,
  narrow = false,
  density = "default",
) {
  await context?.close();
  context = await browser.newContext({
    viewport: { width, height: 1000 },
    hasTouch: coarse,
  });
  page = await context.newPage();
  if (coarse) await emulateCoarsePointer(page);
  writes = [];
  errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("http://forms.test/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<meta name="viewport" content="width=device-width, initial-scale=1"><div id="root"></div>',
    }),
  );
  await page.route("**/api/v1/**", (route) => {
    const request = route.request();
    if (request.method() !== "GET")
      writes.push(`${request.method()} ${new URL(request.url()).pathname}`);
    const path = new URL(request.url()).pathname;
    const body = path.includes("/idp/openid/")
      ? {
          info: [
            { key: "enable", value: "on" },
            {
              key: "config_url",
              value: "https://identity.example.invalid/config",
            },
            { key: "client_id", value: "fixture-client" },
            { key: "client_secret", value: "" },
            { key: "claim_userinfo", value: "off" },
            { key: "redirect_uri_dynamic", value: "off" },
          ],
        }
      : path.endsWith("/configs")
        ? { configurations: [{ key: "region" }, { key: "api" }] }
        : path.endsWith("/configs/api")
          ? [
              {
                key_values: [
                  { key: "requests_max", value: "0" },
                  { key: "replication_max_workers", value: "500" },
                  {
                    key: "cors_allow_origin",
                    value: "https://first.example.invalid",
                  },
                ],
              },
            ]
          : path.includes("/configs/")
            ? [{ key_values: [] }]
            : {};
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  await page.goto(
    `http://forms.test/?case=${scenario}&lang=${language}&theme=${theme}&density=${density}${narrow ? "&narrow=1" : ""}`,
  );
  await page.addScriptTag({ content: script });
}

async function clickLabelText(label: Locator, text: string) {
  const point = await label.evaluate((node, wanted) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.textContent?.trim() !== wanted) continue;
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      const rect = range.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    }
    throw new Error(`Missing label text: ${wanted}`);
  }, text);
  await page.mouse.click(point.x, point.y);
}

async function clickNextLabel(fieldId: string, nextFieldId: string) {
  await page.locator(`#${fieldId}`).click();
  const nextLabel = page.locator(`label[for="${nextFieldId}"]`);
  await nextLabel.scrollIntoViewIfNeeded();
  const before = await nextLabel.boundingBox();
  const fieldGeometry = () =>
    page.locator(`#${fieldId}`).evaluate((input) => {
      const container = input.closest(".inputItem")!;
      return [
        container,
        input.parentElement!,
        input,
        container.querySelector(".errorText"),
      ]
        .filter(Boolean)
        .map((node) => {
          const element = node as HTMLElement;
          const style = getComputedStyle(element);
          return {
            tag: element.tagName,
            id: element.id,
            className: element.className,
            rect: element.getBoundingClientRect().toJSON(),
            display: style.display,
            lineHeight: style.lineHeight,
            fontSize: style.fontSize,
            minHeight: style.minHeight,
            marginTop: style.marginTop,
            verticalAlign: style.verticalAlign,
            fieldHeight: style.getPropertyValue("--field-height"),
          };
        });
    });
  const fieldBefore = await fieldGeometry();
  // A label can contain a separate help button. Click the actual label text,
  // preserving its native activation rather than targeting that button.
  const target = await nextLabel.evaluate((label) => {
    const events: Array<{ type: string; tag: string; button: string | null }> =
      [];
    for (const type of ["pointerdown", "click"]) {
      label.addEventListener(
        type,
        (event) => {
          const target = event.target as HTMLElement;
          events.push({
            type,
            tag: target.tagName,
            button:
              target.closest("button")?.getAttribute("aria-label") || null,
          });
          label.dataset.activationEvents = JSON.stringify(events);
        },
        { once: true },
      );
    }
    const text = document
      .createTreeWalker(label, NodeFilter.SHOW_TEXT)
      .nextNode()!;
    const range = document.createRange();
    range.selectNodeContents(text);
    const textBox = range.getClientRects()[0];
    const labelBox = label.getBoundingClientRect();
    return {
      documentTop: labelBox.top + scrollY,
      position: {
        x: textBox.x + textBox.width / 2 - labelBox.x,
        y: textBox.y + textBox.height / 2 - labelBox.y,
      },
      centerButton:
        document
          .elementFromPoint(
            labelBox.x + labelBox.width / 2,
            labelBox.y + labelBox.height / 2,
          )
          ?.closest("button")
          ?.getAttribute("aria-label") || null,
    };
  });
  await nextLabel.click({ position: target.position });
  await expect(page.locator(`#${nextFieldId}`)).toBeFocused();
  const after = await nextLabel.boundingBox();
  const activation = await nextLabel.evaluate((label) => ({
    documentTop: label.getBoundingClientRect().top + scrollY,
    events: JSON.parse(label.dataset.activationEvents || "[]") as Array<{
      type: string;
      tag: string;
      button: string | null;
    }>,
  }));
  await test.info().attach(`label-geometry-${fieldId}-${nextFieldId}`, {
    body: JSON.stringify({
      before,
      after,
      target,
      activation,
      fieldBefore,
      fieldAfter: await fieldGeometry(),
    }),
    contentType: "application/json",
  });
  expect(activation.documentTop).toBe(target.documentTop);
  expect(activation.events.map((event) => event.type)).toEqual([
    "pointerdown",
    "click",
  ]);
  expect(activation.events.every((event) => event.button === null)).toBe(true);
  await test.info().attach(`label-click-${fieldId}-${nextFieldId}`, {
    body: JSON.stringify({ before, after, target, activation }),
    contentType: "application/json",
  });
}

for (const language of ["en", "zh"]) {
  test(`OpenID ${language} labels operate only their own switch and validation waits for interaction`, async () => {
    await mount("openid-add", language, 390);
    const first = page.locator('input[name="claim_userinfo"]');
    const second = page.locator('input[name="redirect_uri_dynamic"]');
    await expect(first).not.toBeChecked();
    await expect(second).not.toBeChecked();
    const ids = await page
      .getByRole("switch")
      .evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(new Set(ids).size).toBe(ids.length);
    await page
      .locator(`label[for="${await second.getAttribute("id")}"]`)
      .click();
    await expect(first).not.toBeChecked();
    await expect(second).toBeChecked();
    await first.focus();
    await page.keyboard.press("Space");
    await expect(first).toBeChecked();
    await expect(second).toBeChecked();
    await second.click();
    await expect(first).toBeChecked();
    await expect(second).not.toBeChecked();
    await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
    await clickNextLabel("name", "config_url");
    await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#client_id")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await page.locator("#clear").click();
    await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
    await page
      .locator("form")
      .evaluate((form: HTMLFormElement) => form.requestSubmit());
    await expect(page.locator("#client_id")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.locator("#save-key")).toBeDisabled();
  });
}

test("OpenID and LDAP editing start pristine and preserve unique control associations", async () => {
  await mount("openid-edit");
  await page.locator("#edit").click();
  await expect(page.locator("#client_secret")).toBeVisible();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  const dynamic = page.locator('input[name="redirect_uri_dynamic"]');
  await page
    .locator(`label[for="${await dynamic.getAttribute("id")}"]`)
    .click();
  await expect(dynamic).toBeChecked();
  await expect(page.locator('input[name="claim_userinfo"]')).not.toBeChecked();
  await clickNextLabel("client_secret", "claim_name");
  await expect(page.locator("#client_secret")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.locator("#cancel").click();
  await page.locator("#edit").click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  expect(writes).toEqual([]);
  expect(errors).toEqual([]);
  await mount("ldap", "en", 390, "dark");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("LDAP");
  await page.locator("#edit").click();
  const editHeading = page.getByRole("heading", { level: 1 });
  await expect(editHeading).toHaveText("Edit Configuration");
  await expect(editHeading).toHaveCSS("font-size", "16px");
  await expect(editHeading).toHaveCSS("line-height", "22px");
  await expect(editHeading).toHaveCSS("font-weight", "550");
  await expect(page.locator("#server_addr")).toBeVisible();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  await clickNextLabel("server_addr", "lookup_bind_dn");
  await expect(page.locator("#server_addr")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator("#save-key")).toBeDisabled();
});

test("all credential-based Tier forms mask secrets and expose keyboard visibility control", async () => {
  for (const provider of ["minio", "s3", "azure"]) {
    await mount(`tier-${provider}`, "en", 390, "dark", true);
    const field = page.locator(
      provider === "azure" ? "#accountKey" : "#secretKey",
    );
    await expect(field).toHaveAttribute("type", "password");
    await field.fill("fixture-secret-only");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Add Tier",
    );
    const reveal = page.getByRole("button", {
      name: "Show password",
      exact: true,
    });
    await reveal.focus();
    await expect(page.locator("main [role=tooltip]")).toHaveText(
      "Show password",
    );
    await page.keyboard.press("Enter");
    await expect(field).toHaveAttribute("type", "text");
    await page
      .getByRole("button", { name: "Hide password", exact: true })
      .click();
    await expect(field).toHaveAttribute("type", "password");
    const bounds = await field.boundingBox();
    expect(bounds!.width).toBeGreaterThan(260);
    expect(bounds!.height).toBeGreaterThanOrEqual(40);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
    expect(writes).toEqual([]);
    expect(errors).toEqual([]);
  }
});

test("shared fields keep full phone width, aligned desktop columns, and usable local descriptions", async () => {
  for (const width of [390, 768, 1440]) {
    await mount("controls", "en", width, "light", width === 390);
    const fields = [
      "endpoint",
      "secret",
      "invalid",
      "region-select",
      "autocomplete",
      "description",
    ];
    for (const id of fields) await expect(page.locator(`#${id}`)).toBeVisible();
    const bounds = await Promise.all(
      fields.map((id) => page.locator(`#${id}`).boundingBox()),
    );
    expect(
      bounds.every((box) => box && box.width >= (width === 390 ? 300 : 400)),
    ).toBe(true);
    for (const box of bounds)
      expect(box!.height).toBeGreaterThanOrEqual(width === 390 ? 40 : 36);
    const secret = page.locator("#secret");
    const secretBox = (await secret.boundingBox())!;
    const actionBox = (await secret
      .locator("..")
      .locator(".overlayAction")
      .boundingBox())!;
    expect(actionBox.y + actionBox.height / 2).toBe(
      secretBox.y + secretBox.height / 2,
    );
    const firstX = bounds[0]!.x;
    for (const box of bounds) expect(Math.abs(box!.x - firstX)).toBeLessThan(1);
    const label = await page.locator('label[for="endpoint"]').boundingBox();
    if (width === 390)
      expect(label!.y + label!.height + 7).toBeLessThan(bounds[0]!.y);
    else expect(label!.x + label!.width).toBeLessThan(bounds[0]!.x);
    await expect(page.locator("#invalid")).toHaveAttribute(
      "aria-describedby",
      "invalid-error",
    );
    const errorBounds = await page.locator("#invalid-error").boundingBox();
    expect(errorBounds!.x).toBe(firstX);
    expect(errorBounds!.width).toBeLessThanOrEqual(bounds[2]!.width);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const region = page.locator("#region-select");
    await expect(region).toHaveAccessibleName("Storage region First region");
    await region.click();
    await page.getByRole("option", { name: "Second region" }).click();
    await expect(region).toContainText("Second region");
    await expect(region).toHaveAccessibleName("Storage region Second region");
    await expect(page.locator('input[type="hidden"]#region')).toHaveValue(
      "two",
    );
    await expect(
      page.getByRole("heading", { name: "Connection settings", level: 2 }),
    ).toHaveCSS("font-size", "16px");
    await expect(
      page.getByRole("heading", { name: "Credential details", level: 3 }),
    ).toHaveCSS("font-size", "16px");
    expect(writes).toEqual([]);
    expect(errors).toEqual([]);
  }
});

test("small field help is focusable without toggling or submitting; help text contrasts in both themes", async () => {
  for (const theme of ["light", "dark"]) {
    await mount("controls", "en", 390, theme, true);
    const help = page.getByRole("button", { name: "Switch help", exact: true });
    await help.focus();
    await expect(page.getByRole("tooltip")).toContainText("Switch help");
    await help.click();
    await expect(page.locator("#enabled")).not.toBeChecked();
    await expect(page.locator("#submits")).toHaveText("0");
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: "Endpoint help", exact: true })
      .click();
    await expect(page.locator("#endpoint")).not.toBeFocused();
    await expect(page.locator("#submits")).toHaveText("0");
    const target = await help.boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(40);
    expect(target!.height).toBeGreaterThanOrEqual(40);
    const icon = await help.locator("svg").boundingBox();
    expect(icon!.width).toBe(13);
    expect(icon!.height).toBe(13);
    const switchTarget = await page.locator("#enabled").boundingBox();
    expect(switchTarget!.width).toBeGreaterThanOrEqual(40);
    expect(switchTarget!.height).toBeGreaterThanOrEqual(40);
    const contrast = await page.locator("#help-panel").evaluate((element) => {
      const text = [...element.querySelectorAll("div")].find(
        (node) => node.textContent === "Create Configurations",
      )!;
      const color = getComputedStyle(text).color;
      const background = getComputedStyle(
        element.firstElementChild!,
      ).backgroundColor;
      const luminance = (rgb: string) => {
        const channels = rgb
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map((v) => {
            const c = v / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          });
        return (
          channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
        );
      };
      const a = luminance(color),
        b = luminance(background);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
    expect(writes).toEqual([]);
    expect(errors).toEqual([]);
  }
  for (const width of [1440, 390]) {
    await mount("checkboxes", "en", width, "light", width === 390);
    await test.info().attach(`toggle-names-${width}`, {
      body: await page.locator("main").ariaSnapshot(),
      contentType: "text/plain",
    });
    const explicit = page.locator("#labeled-checkbox");
    const generated = page.getByTestId("generated-checkbox").locator("input");
    const switched = page.locator("#labeled-switch");
    for (const [input, name] of [
      [explicit, "Enabled option"],
      [generated, "Generated option"],
      [switched, "Enabled switch Toggle help"],
    ] as const) {
      expect
        .soft(
          await input.evaluate((node: HTMLInputElement) => node.labels?.length),
        )
        .toBe(1);
      expect.soft(await input.getAttribute("id")).toBeTruthy();
      expect
        .soft(
          await page
            .getByRole(input === switched ? "switch" : "checkbox", {
              name,
              exact: true,
            })
            .count(),
        )
        .toBe(1);
    }
    await clickLabelText(
      page.locator('label[for="labeled-checkbox"]'),
      "Enabled option",
    );
    await expect(explicit).toBeChecked();
    await expect(explicit).toBeFocused();
    await expect(page.locator("#checkbox-events")).toHaveText(
      '{"changes":1,"rows":0}',
    );
    await explicit.press("Space");
    await expect(explicit).not.toBeChecked();
    await clickLabelText(
      page
        .getByTestId("generated-checkbox")
        .locator("label")
        .filter({ hasText: "Generated option" }),
      "Generated option",
    );
    expect.soft(await generated.isChecked()).toBe(true);
    expect
      .soft(await generated.evaluate((node) => node === document.activeElement))
      .toBe(true);
    await clickLabelText(
      page.locator('label[for="labeled-switch"]'),
      "Enabled switch",
    );
    await expect(switched).toBeChecked();
    await page
      .getByRole("button", { name: "Toggle help", exact: true })
      .click();
    await expect(page.getByRole("tooltip")).toHaveText("Toggle help");
    await expect(switched).toBeChecked();
    await page.keyboard.press("Escape");
    expect
      .soft(await page.locator("#checkbox-events").textContent())
      .toBe('{"changes":4,"rows":0}');
    const disabledLabel = await page
      .getByText("Disabled option", { exact: true })
      .boundingBox();
    await page.mouse.click(
      disabledLabel!.x + disabledLabel!.width / 2,
      disabledLabel!.y + disabledLabel!.height / 2,
    );
    await expect(page.locator("#disabled-checkbox")).toBeDisabled();
    await expect(page.locator("#disabled-checkbox")).not.toBeChecked();
    await expect(page.locator("#disabled-checkbox")).not.toBeFocused();
    await expect(page.locator("#row-checkbox")).toHaveAccessibleName(
      "Row selection",
    );
    await expect(page.locator("#only-switch")).toHaveAccessibleName("Status");
    for (const input of [explicit, switched]) {
      if (width === 390) {
        const target = await input.boundingBox();
        expect(target!.width).toBeGreaterThanOrEqual(40);
        expect(target!.height).toBeGreaterThanOrEqual(40);
      }
    }
    const axe = await new AxeBuilder({ page })
      .withRules(["form-field-multiple-labels"])
      .analyze();
    expect.soft([...axe.violations, ...axe.incomplete]).toEqual([]);
  }
});

test("elevated compact fields retain coarse targets and aligned password actions", async () => {
  await mount("controls", "en", 390, "dark", true, false, "compact");
  for (const id of [
    "endpoint",
    "secret",
    "region-select",
    "autocomplete",
    "description",
    "origins-0",
  ]) {
    const field = page.locator(`#${id}`);
    await expect(field).toBeVisible();
    const box = (await field.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(240);
    expect(box.height).toBeGreaterThanOrEqual(40);
    await expect(field).toHaveCSS("font-size", "16px");
  }
  const secret = page.locator("#secret");
  const input = (await secret.boundingBox())!;
  const action = (await secret
    .locator("..")
    .locator(".overlayAction")
    .boundingBox())!;
  expect(action.y + action.height / 2).toBe(input.y + input.height / 2);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("tablet content stacks form help and CORS rows while preserving label activation and editing", async () => {
  await mount("controls", "en", 768, "light", false, true);
  const form = page.locator("form");
  const help = page.locator("#form-help");
  const formBox = (await form.boundingBox())!;
  const helpBox = (await help.boundingBox())!;
  expect(helpBox.y).toBeGreaterThan(formBox.y + formBox.height);
  for (const id of [
    "endpoint",
    "region-select",
    "autocomplete",
    "description",
    "origins-0",
  ]) {
    const box = (await page.locator(`#${id}`).boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(240);
    expect(box.x + box.width).toBeLessThanOrEqual(768);
  }
  const label = page.locator('label[for="origins-0"]');
  const labelBox = (await label.boundingBox())!;
  const first = page.locator("#origins-0");
  expect(labelBox.y + labelBox.height + 7).toBeLessThan(
    (await first.boundingBox())!.y,
  );
  await label.getByText("Allowed origins", { exact: true }).click();
  await expect(first).toBeFocused();
  const second = page.locator("#origins-1");
  await second.fill("https://second.example.invalid");
  await second.locator("..").getByRole("button").click();
  await expect(page.locator("#origins-2")).toHaveValue("");
  await expect(page.locator("#origins-value")).toHaveText(
    "https://first.example.invalid,https://second.example.invalid",
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(768);
});

test("API settings submit only changed, supported fields", async () => {
  await mount("configuration");
  const save = page.getByRole("button", { name: "Save", exact: true });
  const workers = page.getByLabel("Maximum Replication Workers", {
    exact: true,
  });
  await expect(workers).toHaveValue("500");
  await expect(save).toBeDisabled();
  await expect(
    page.locator("#replication_workers, #replication_failed_workers"),
  ).toHaveCount(0);
  await workers.fill("8");
  await workers.fill("500");
  await expect(save).toBeDisabled();
  await workers.fill("8");

  const writesToAPI: unknown[] = [];
  await page.route("**/api/v1/configs/api", (route) => {
    if (route.request().method() === "PUT") {
      writesToAPI.push(route.request().postDataJSON());
      return route.fulfill({ json: { restart: false } });
    }
    // A server advertising only requests_max must only offer that field.
    return route.fulfill({
      json: [{ key_values: [{ key: "requests_max", value: "0" }] }],
    });
  });
  await save.click();
  await expect(workers).toHaveCount(0);
  await expect(page.locator("#requests_max")).toHaveValue("0");
  await expect(page.locator("#cors_allow_origin-0")).toHaveCount(0);
  await expect(save).toBeDisabled();
  expect(writesToAPI).toEqual([
    { key_values: [{ key: "replication_max_workers", value: "8" }] },
  ]);
});

test("configuration navigation follows available tablet width and keeps API and CORS fields usable", async () => {
  await mount("configuration", "en", 768, "light", false, true);
  const tabs = page.getByRole("tablist");
  await expect(tabs).toHaveAttribute("aria-orientation", "horizontal");
  const requests = page.locator("#requests_max");
  await expect(requests).toBeVisible();
  for (const id of ["requests_max", "cors_allow_origin-0"]) {
    const box = (await page.locator(`#${id}`).boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(100);
    expect(box.height).toBeGreaterThanOrEqual(36);
  }
  const apiTab = page.getByRole("tab", { name: "API", exact: true });
  await apiTab.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    page.getByRole("tab", { name: "Region", exact: true }),
  ).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(tabs).toHaveAttribute("aria-orientation", "vertical");
  await page.keyboard.press("ArrowDown");
  await expect(apiTab).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(1440);
});

test("page, nested section, empty-state and dialog headings retain their semantic hierarchy", async () => {
  await mount("headings");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Permissions",
  );
  await expect(
    page.getByRole("heading", { name: "Policy", level: 2, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Current User Policy", level: 3 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "No rules", level: 3 }),
  ).toBeVisible();
  await expect(
    page.locator("#empty-section-toolbar").getByRole("heading"),
  ).toHaveCount(0);
  await expect(page.locator("#open-heading-dialog")).toBeVisible();
  for (const name of [
    "No matching results",
    "Feature unavailable",
    "Permission required",
    "Page not found",
  ])
    await expect(
      page.getByRole("heading", { name, level: 2, exact: true }),
    ).toBeVisible();
  await page.locator("#clear-list-filters").click();
  await expect(
    page.getByRole("heading", { name: "No groups", level: 2 }),
  ).toBeVisible();
  await page.locator("#show-entity").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Alice");
  await page.locator("#open-heading-dialog").click();
  const dialog = page.getByRole("dialog", { name: "Edit permissions" });
  await expect(dialog.getByRole("heading", { level: 1 })).toHaveCount(0);
  await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(
    "Edit permissions",
  );
  await page.locator("#finish-heading-dialog").click();
  await expect(page.locator("#open-heading-dialog")).toBeFocused();
  for (const language of ["en", "zh"]) {
    await mount("overview", language, language === "en" ? 1440 : 390);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      language === "en" ? "Overview" : "概览",
    );
    await expect(page.locator("#refresh-overview")).toBeEnabled();
    const names =
      language === "en"
        ? [
            "Deployment statistics",
            "Servers",
            "Alerts",
            "Quick actions",
            "Identity",
            "Monitoring",
            "Settings",
            "Tools",
          ]
        : [
            "部署统计",
            "服务器",
            "告警",
            "快捷操作",
            "身份",
            "监控",
            "设置",
            "工具",
          ];
    for (const name of names) {
      expect
        .soft(await page.getByRole("group", { name, exact: true }).count())
        .toBe(1);
    }
    await expect(page.getByRole("navigation")).toHaveCount(4);
    await expect(page.getByRole("heading", { level: 2 })).toHaveText(
      names.slice(1),
    );
    expect(
      await page
        .getByRole("navigation")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute("aria-labelledby")),
        ),
    ).toEqual([
      "overview-nav-identity",
      "overview-nav-monitoring",
      "overview-nav-settings",
      "overview-nav-tools",
    ]);
    const axe = await new AxeBuilder({ page })
      .withRules(["aria-prohibited-attr"])
      .analyze();
    expect.soft([...axe.violations, ...axe.incomplete]).toEqual([]);
  }
});

test("browser controls retain one labeled toggle across resize and expose only the open upload menu", async ({}, testInfo) => {
  for (const language of ["en", "zh"]) {
    await mount("browser-controls", language, 1440);
    const name = language === "en" ? "Show deleted objects" : "显示已删除对象";
    await expect(
      page.getByRole("heading", { name: "Browser controls", exact: true }),
    ).toBeVisible();
    const checkbox = page.locator('[id="showDeletedObjects"]:visible');
    expect
      .soft(await page.getByRole("checkbox", { name, exact: true }).count())
      .toBe(1);
    const original = await checkbox.elementHandle();
    const geometry = [];
    for (const [index, width] of [1440, 390, 1440].entries()) {
      await page.setViewportSize({ width, height: 1000 });
      if (width === 390) await emulateCoarsePointer(page);
      expect
        .soft(await page.locator('[id="showDeletedObjects"]').count())
        .toBe(1);
      if (index > 0) {
        expect
          .soft(
            await original!.evaluate(
              (node) => node.isConnected && node === document.activeElement,
            ),
          )
          .toBe(true);
      }
      const label = page.locator('label[for="showDeletedObjects"]:visible');
      await expect(label).toHaveCount(1);
      await clickLabelText(label, name);
      await expect(checkbox).toBeChecked({ checked: index % 2 === 0 });
      expect
        .soft(
          await checkbox.evaluate((node) => node === document.activeElement),
        )
        .toBe(true);
      const events = JSON.parse(
        (await page.locator("#browser-control-events").textContent())!,
      );
      expect(events.changes).toBe(index + 1);
      const measured = {
        width,
        checkbox: await checkbox.boundingBox(),
        copy: await page.locator("#copy-path").boundingBox(),
        create: await page.locator("#new-path").boundingBox(),
      };
      geometry.push(measured);
      if (width === 1440) {
        expect(
          measured.checkbox!.x - measured.copy!.x - measured.copy!.width,
        ).toBe(5);
      } else {
        expect(
          measured.checkbox!.y -
            Math.max(
              measured.copy!.y + measured.copy!.height,
              measured.create!.y + measured.create!.height,
            ),
        ).toBe(15);
        expect(measured.checkbox!.width).toBe(40);
        expect(measured.checkbox!.height).toBe(40);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    await testInfo.attach(`breadcrumb-geometry-${language}`, {
      body: JSON.stringify(geometry),
      contentType: "application/json",
    });
    const trigger = page.locator("#upload-main");
    const popup = page.locator("#upload-files-main-menu");
    expect.soft(await trigger.getAttribute("aria-controls")).toBeNull();
    expect.soft(await trigger.getAttribute("aria-expanded")).toBe("false");
    for (const close of ["Escape", "outside"] as const) {
      await trigger.click();
      await expect(popup).toBeVisible();
      expect.soft(await trigger.getAttribute("aria-haspopup")).toBe("menu");
      expect.soft(await popup.getAttribute("role")).toBe("menu");
      await expect(trigger).toHaveAttribute(
        "aria-controls",
        "upload-files-main-menu",
      );
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      if (close === "Escape") await page.keyboard.press("Escape");
      else await page.locator("#outside-upload").click();
      await expect(popup).toHaveCount(0);
      expect.soft(await trigger.getAttribute("aria-controls")).toBeNull();
      expect.soft(await trigger.getAttribute("aria-expanded")).toBe("false");
      if (close === "Escape") await expect(trigger).toBeFocused();
      else await expect(page.locator("#outside-upload")).toBeFocused();
    }
    for (const name of language === "en"
      ? ["Upload File", "Upload Folder"]
      : ["上传文件", "上传文件夹"]) {
      await trigger.click();
      await expect(popup).toBeVisible();
      await popup.getByRole("menuitem", { name, exact: true }).click();
      await expect(popup).toHaveCount(0);
      expect.soft(await trigger.getAttribute("aria-controls")).toBeNull();
      expect.soft(await trigger.getAttribute("aria-expanded")).toBe("false");
    }
    await expect(page.locator("#browser-control-events")).toHaveText(
      '{"checked":true,"changes":3,"files":1,"folders":1}',
    );
    const [fileName, folderName] =
      language === "en"
        ? ["Upload File", "Upload Folder"]
        : ["上传文件", "上传文件夹"];
    // Finish pointer interaction before testing keyboard-only menu navigation.
    await page.locator("#outside-upload").hover();
    await trigger.press("Enter");
    await expect(
      popup.getByRole("menuitem", { name: fileName, exact: true }),
    ).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(
      popup.getByRole("menuitem", { name: folderName, exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(await trigger.getAttribute("aria-controls")).toBeNull();
    await expect(page.locator("#browser-control-events")).toHaveText(
      '{"checked":true,"changes":3,"files":1,"folders":2}',
    );
    await trigger.press("Space");
    await expect(
      popup.getByRole("menuitem", { name: fileName, exact: true }),
    ).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(
      popup.getByRole("menuitem", { name: folderName, exact: true }),
    ).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(
      popup.getByRole("menuitem", { name: fileName, exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Space");
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(await trigger.getAttribute("aria-controls")).toBeNull();
    await expect(page.locator("#browser-control-events")).toHaveText(
      '{"checked":true,"changes":3,"files":2,"folders":2}',
    );
    await page.locator("#disable-upload").click();
    await expect(trigger).toBeDisabled();
    const axe = await new AxeBuilder({ page })
      .withRules([
        "duplicate-id-aria",
        "aria-valid-attr-value",
        "form-field-multiple-labels",
      ])
      .analyze();
    expect.soft([...axe.violations, ...axe.incomplete]).toEqual([]);
  }
});

test("date fields align with neighboring controls and keep native keyboard, label and disabled behavior", async ({}, testInfo) => {
  test.setTimeout(60_000);
  for (const width of [390, 768, 1440]) {
    await mount(
      "dates",
      "en",
      width,
      width === 768 ? "dark" : "light",
      width === 390,
      width === 768,
    );
    const before = page.locator("#date-before");
    const expiry = page.locator("#expiry");
    const adjacent = await before.boundingBox();
    const field = await expiry.boundingBox();
    expect(field!.x).toBeCloseTo(adjacent!.x, 1);
    expect(field!.width).toBeCloseTo(adjacent!.width, 1);
    expect(field!.height).toBe(adjacent!.height);
    expect(field!.height).toBeGreaterThanOrEqual(width === 390 ? 40 : 36);
    expect(field!.width).toBeGreaterThanOrEqual(width === 390 ? 240 : 100);
    expect(
      await expiry.evaluate((node) => getComputedStyle(node).borderRadius),
    ).toBe(
      await before.evaluate((node) => getComputedStyle(node).borderRadius),
    );
    const label = page.locator('label[for="expiry"]');
    if (width < 1440) {
      const bounds = await label.boundingBox();
      expect(field!.y).toBeGreaterThanOrEqual(bounds!.y + bounds!.height + 7);
    }
    await testInfo.attach(`date-fields-${width}`, {
      contentType: "image/png",
      body: await page.screenshot({ fullPage: true }),
    });
    await before.click();
    await page.keyboard.press("Tab");
    await expect(expiry).toBeFocused();
    await expect(expiry).toHaveValue("10/24/2026 12:30");
    await page.locator("#date-after").click();
    await label.click();
    await expect(expiry).toBeFocused();
    await expiry.fill("12/31/2026 23:45");
    await page.keyboard.press("Tab");
    await expect(page.locator("#expiry-value")).toHaveText(
      "2026-12-31 23:45:00",
    );
    await label.click();
    await expiry.fill("13/50/2026 23:45");
    await page.keyboard.press("Tab");
    await expect(page.locator("#expiry-value")).toHaveText(
      "2026-12-31 23:45:00",
    );
    await label.click();
    await expect(expiry).toHaveValue("12/31/2026 23:45");
    await page.locator("#disable-date").click();
    await expect(expiry).toBeDisabled();
    await expect(page.locator("#expiry-picker")).toBeDisabled();
    const disabledValue = await expiry.inputValue();
    // Locator.click follows a label's disabled control and waits for it to
    // become enabled. A real pointer click must leave that control inert.
    await label.scrollIntoViewIfNeeded();
    const disabledLabel = await label.boundingBox();
    await page.mouse.click(
      disabledLabel!.x + disabledLabel!.width / 2,
      disabledLabel!.y + disabledLabel!.height / 2,
    );
    await expect(expiry).not.toBeFocused();
    await expect(expiry).toHaveValue(disabledValue);
    await before.click();
    await page.keyboard.press("Tab");
    await expect(page.locator("#date-after")).toBeFocused();
    await expect(page.locator("#timeSelector-expiry")).toHaveCount(0);
    await expect(
      page.getByRole("textbox", { name: "Start Time:", exact: true }),
    ).toHaveCount(1);
    await expect(
      page.getByRole("textbox", { name: "End Time:", exact: true }),
    ).toHaveCount(1);
  }
});

test("date picker stays keyboard reachable in a modal and fits coarse phone targets", async ({}, testInfo) => {
  test.setTimeout(60_000);
  await mount("dates", "en", 390, "light", true);
  const opener = page.locator("#open-date-dialog");
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Edit expiry", exact: true });
  const trigger = page.locator("#modal-expiry-picker");
  await expect(dialog).toBeVisible();
  await expect(page.locator("#modal-expiry")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  const picker = page.locator("#timeSelector-modal-expiry");
  await expect(picker).toBeVisible();
  await testInfo.attach("date-picker-initial-focus-and-geometry", {
    contentType: "application/json",
    body: JSON.stringify(
      await picker.evaluate((node) => ({
        active: document.activeElement?.outerHTML,
        ownsFocus: node.contains(document.activeElement),
        bounds: node.getBoundingClientRect().toJSON(),
        popupAnchor: node.getAttribute("data-popup-anchor"),
        role: node.getAttribute("role"),
      })),
      null,
      2,
    ),
  });
  await expect
    .poll(() =>
      picker.evaluate((node) => node.contains(document.activeElement)),
    )
    .toBe(true);
  await expect(picker).toHaveAttribute("role", "dialog");
  const box = await picker.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(8);
  expect(box!.x + box!.width).toBeLessThanOrEqual(382);
  const calendarRows = await picker.evaluate((node) => {
    const rows = new Map<number, number[]>();
    for (const day of node.querySelectorAll(
      ".react-calendar__month-view__days__day",
    )) {
      const bounds = day.getBoundingClientRect();
      const top = Math.round(bounds.top);
      rows.set(top, [...(rows.get(top) || []), bounds.left + bounds.width / 2]);
    }
    return {
      rows: [...rows.values()],
      weekdays: [
        ...node.querySelectorAll(
          ".react-calendar__month-view__weekdays__weekday",
        ),
      ].map((day) => {
        const bounds = day.getBoundingClientRect();
        return bounds.left + bounds.width / 2;
      }),
    };
  });
  expect(calendarRows.weekdays).toHaveLength(7);
  for (const row of calendarRows.rows) {
    expect(row).toHaveLength(7);
    row.forEach((center, column) =>
      expect(
        Math.abs(center - calendarRows.weekdays[column]),
      ).toBeLessThanOrEqual(1),
    );
  }
  for (const button of await picker
    .locator(
      ".react-calendar__month-view__days__day, .react-calendar__navigation button, .modeBar button",
    )
    .all()) {
    const target = await button.boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(40);
    expect(target!.height).toBeGreaterThanOrEqual(40);
  }
  await testInfo.attach("date-calendar-coarse-phone", {
    contentType: "image/png",
    body: await page.screenshot(),
  });
  await page.keyboard.press("Escape");
  await expect(picker).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(picker).toBeVisible();
  const targetDay = picker
    .locator(
      ".react-calendar__month-view__days__day:not(.react-calendar__month-view__days__day--neighboringMonth)",
    )
    .filter({ hasText: /^30$/ });
  const tabTo = async (target: ReturnType<Page["locator"]>) => {
    for (let step = 0; step < 100; step++) {
      if (await target.evaluate((node) => node === document.activeElement))
        return;
      await page.keyboard.press("Tab");
    }
    await expect(target).toBeFocused();
  };
  await tabTo(targetDay);
  await page.keyboard.press("Enter");
  await expect(page.locator("#expiry-value")).toHaveText("2026-10-30 00:00:00");
  const columns = picker.locator(".columnSelector");
  await expect(columns).toHaveCount(2);
  for (const column of await columns.all()) {
    const target = await column.getByRole("button").first().boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(40);
    expect(target!.height).toBeGreaterThanOrEqual(40);
  }
  await testInfo.attach("date-time-coarse-phone", {
    contentType: "image/png",
    body: await page.screenshot(),
  });
  const hour = columns.nth(0).getByRole("button", { name: "13", exact: true });
  await tabTo(hour);
  await page.keyboard.press("Enter");
  const minute = columns
    .nth(1)
    .getByRole("button", { name: "15", exact: true });
  await tabTo(minute);
  await page.keyboard.press("Enter");
  await expect(page.locator("#expiry-value")).toHaveText("2026-10-30 13:15:00");
  await expect(picker).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(dialog).toBeVisible();
  await page.locator("#modal-expiry").click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("date picker preserves minute-first focus, seconds completion and localized calendar labels", async ({}, testInfo) => {
  test.setTimeout(60_000);
  for (const language of ["en", "zh"]) {
    await mount(
      "dates-seconds",
      language,
      390,
      language === "zh" ? "dark" : "light",
      true,
    );
    await page.locator("#open-date-dialog").click();
    const owner = page.getByRole("dialog", {
      name: "Edit expiry",
      exact: true,
    });
    const trigger = page.locator("#modal-expiry-picker");
    await page.keyboard.press("Tab");
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");
    const picker = page.locator("#timeSelector-modal-expiry");
    await expect(picker).toBeVisible();
    await picker.locator(".modeBar button").nth(1).click();
    const columns = picker.locator(".columnSelector");
    await expect(columns).toHaveCount(3);
    const minute = columns
      .nth(1)
      .getByRole("button", { name: "15", exact: true });
    const originalMinute = await minute.elementHandle();
    await minute.click();
    await expect
      .poll(() =>
        originalMinute!.evaluate((node) => ({
          connected: node.isConnected,
          focused: document.activeElement === node,
        })),
      )
      .toEqual({ connected: true, focused: true });
    await expect(owner).toBeVisible();
    await expect(picker).toBeVisible();
    await expect(page.locator("#expiry-value")).toHaveText(
      "2026-10-24 12:15:00",
    );
    const second = columns
      .nth(2)
      .getByRole("button", { name: "30", exact: true });
    const originalSecond = await second.elementHandle();
    await second.click();
    await expect
      .poll(() =>
        originalSecond!.evaluate((node) => ({
          connected: node.isConnected,
          focused: document.activeElement === node,
        })),
      )
      .toEqual({ connected: true, focused: true });
    await expect(picker).toBeVisible();
    await expect(page.locator("#expiry-value")).toHaveText(
      "2026-10-24 12:15:30",
    );
    await expect(picker.locator(".timeTitle")).toHaveText(
      language === "zh" ? "时间" : "Time",
    );
    await expect(picker.locator(".titleElement")).toHaveText(
      language === "zh" ? ["小时", "分钟", "秒"] : ["Hour", "Minute", "Second"],
    );
    await testInfo.attach(`time-selector-seconds-${language}`, {
      contentType: "image/png",
      body: await page.screenshot(),
    });
    await columns
      .nth(0)
      .getByRole("button", { name: "14", exact: true })
      .click();
    await expect(page.locator("#expiry-value")).toHaveText(
      "2026-10-24 14:15:30",
    );
    await expect(picker).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(owner).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(picker).toBeVisible();
    await picker.locator(".modeBar button").first().click();
    await expect(
      picker.locator(".react-calendar__navigation__label"),
    ).toHaveText(language === "zh" ? "2026年10月" : "October2026");
    await expect(
      picker.locator(".react-calendar__month-view__weekdays"),
    ).toContainText(language === "zh" ? "日" : "Sun");
    await page.keyboard.press("Escape");
    await expect(picker).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(owner).toBeVisible();
    await page.locator("#modal-expiry").click();
    await page.keyboard.press("Escape");
    await expect(owner).toBeHidden();
  }
});

test("Chinese calendar days stay on one line with full accessible dates", async ({}, testInfo) => {
  test.setTimeout(60_000);
  for (const width of [390, 768]) {
    for (const coarse of [false, true]) {
      await mount("dates", "zh", width, "dark", coarse);
      const trigger = page.locator("#expiry-picker");
      await trigger.click();
      const picker = page.locator("#timeSelector-expiry");
      await expect(picker).toBeVisible();
      const cells = await picker
        .locator(".react-calendar__month-view__days__day")
        .evaluateAll((buttons) =>
          buttons.map((button) => {
            const bounds = button.getBoundingClientRect();
            const label = button.querySelector("abbr")!;
            const range = document.createRange();
            range.selectNodeContents(label);
            const ink = [...range.getClientRects()];
            return {
              text: label.textContent,
              accessibleDate: label.getAttribute("aria-label"),
              x: bounds.x,
              y: bounds.y,
              width: bounds.width,
              height: bounds.height,
              lineCount: new Set(ink.map((rect) => Math.round(rect.top))).size,
              contained: ink.every(
                (rect) =>
                  rect.left >= bounds.left &&
                  rect.right <= bounds.right &&
                  rect.top >= bounds.top &&
                  rect.bottom <= bounds.bottom,
              ),
            };
          }),
        );
      await testInfo.attach(
        `calendar-zh-${width}-${coarse ? "coarse" : "fine"}`,
        {
          contentType: "image/png",
          body: await page.screenshot(),
        },
      );
      await testInfo.attach(`calendar-geometry-${width}-${coarse}`, {
        contentType: "application/json",
        body: JSON.stringify(cells, null, 2),
      });
      const rows = new Map<number, number>();
      for (const cell of cells) {
        expect(cell.text).toMatch(/^\d{1,2}$/);
        expect(cell.accessibleDate).toMatch(/^\d{4}年\d{1,2}月\d{1,2}日$/);
        expect(cell.lineCount).toBe(1);
        expect(cell.contained).toBe(true);
        expect(cell.width).toBeGreaterThanOrEqual(coarse ? 40 : 28);
        expect(cell.height).toBeGreaterThanOrEqual(coarse ? 40 : 28);
        const row = Math.round(cell.y);
        rows.set(row, (rows.get(row) || 0) + 1);
      }
      expect([...rows.values()]).toEqual(Array(rows.size).fill(7));
      await expect(picker.locator(".modeBar button").first()).toHaveText(
        "2026年10月24日",
      );
      const nextDate = picker.getByRole("button", {
        name: "2026年10月28日",
        exact: true,
      });
      await expect(nextDate).toHaveText("28");
      await nextDate.click();
      await expect(picker.locator(".modeBar button").first()).toHaveText(
        "2026年10月28日",
      );
      await expect(page.locator("#expiry-value")).toHaveText(
        "2026-10-28 00:00:00",
      );
      await page.keyboard.press("Escape");
      await expect(picker).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
  }
});
