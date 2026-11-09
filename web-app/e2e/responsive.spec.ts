// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { test, expect, Page, Locator, Request } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { join } from "node:path";
import { emulateCoarsePointer } from "./fixtures/emulateCoarsePointer";
import { guiEnvironment } from "./fixtures/guiEnvironment";

test.use({ reducedMotion: "reduce" });

const routes = [
  "/login",
  "/overview",
  "/buckets",
  "/browser/demo-data",
  "/browser/demo-data/docs%2F",
  "/browser/demo-data/docs%2FREADME.md",
  "/identity/users",
  "/policies",
  "/tools/metrics",
  "/tools/watch",
  "/settings/configurations/logger_webhook",
  "/settings/configurations",
  "/identity/users/bob",
  "/policies/demo-reader",
  "/identity/groups",
  "/access-keys",
  "/settings/event-destinations",
  "/settings/tiers",
];
async function geometry(page: Page) {
  const bounds = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: innerWidth,
    main: [...document.querySelectorAll<HTMLElement>(".mainPage")].map(
      (node) => ({ scroll: node.scrollWidth, width: node.clientWidth }),
    ),
    overlaps: [...document.querySelectorAll(".page-header")].map((header) => {
      const title = header
        .querySelector(".page-header-label")!
        .getBoundingClientRect();
      const actions = header
        .querySelector(".page-header-actions")!
        .getBoundingClientRect();
      return (
        title.right > actions.left + 1 &&
        title.bottom > actions.top &&
        actions.bottom > title.top
      );
    }),
  }));
  expect(bounds.document).toBeLessThanOrEqual(bounds.viewport);
  for (const main of bounds.main)
    expect(main.scroll).toBeLessThanOrEqual(main.width + 1);
  expect(bounds.overlaps).not.toContain(true);
}

// These deep states use the deployment's real read APIs. Every business write
// is blocked and fails the case, so opening a form never changes its config.
const deepScreens = [
  {
    id: "openid-add",
    path: "/identity/idp/openid/configurations/add-idp",
    fields: ["name", "config_url", "client_id", "client_secret"],
  },
  {
    id: "ldap-edit",
    path: "/identity/ldap/configuration",
    fields: ["server_addr", "lookup_bind_dn", "lookup_bind_password"],
  },
  {
    id: "webhook-add",
    path: "/settings/event-destinations/add/notify_webhook",
    fields: ["identifier-field", "endpoint", "auth_token"],
  },
  {
    id: "kafka-add",
    path: "/settings/event-destinations/add/notify_kafka",
    fields: ["identifier-field", "topic", "sasl_username", "sasl_password"],
  },
  {
    id: "group-add",
    path: "/identity/groups/create-group",
    fields: ["group-name"],
  },
  {
    id: "access-key-add",
    path: "/access-keys/new-account",
    fields: ["accessKey", "secretKey", "name", "description", "comment"],
  },
  ...["minio", "s3", "azure", "gcs"].map((provider) => ({
    id: `tier-${provider}`,
    path: `/settings/tiers/add/${provider}`,
    fields: ["name", "endpoint", "bucket", "prefix"],
  })),
  {
    id: "api-configuration",
    path: "/settings/configurations/api",
    fields: ["requests_max"],
  },
  {
    id: "trace-filters",
    path: "/tools/trace",
    fields: [
      "trace-status-code",
      "trace-function-name",
      "trace-method",
      "trace-path",
    ],
  },
  { id: "profile", path: "/support/profile", fields: [] },
  {
    id: "replication-add",
    path: "/settings/site-replication/add",
    fields: [
      "add-rep-current-site-ep-0",
      "add-rep-current-site-ac-0",
      "add-rep-current-site-sk-0",
      "add-rep-peer-site-ep-0",
      "add-rep-peer-site-ac-0",
      "add-rep-peer-site-sk-0",
    ],
  },
];

async function deepFieldGeometry(page: Page, ids: string[], width: number) {
  const measurements = [];
  for (const id of ids) {
    const field = page.locator(`[id="${id}"]`);
    await expect(field).toBeVisible();
    const bounds = await field.boundingBox();
    expect(bounds, id).not.toBeNull();
    expect(bounds!.width, id).toBeGreaterThanOrEqual(width < 768 ? 240 : 100);
    expect(bounds!.height, id).toBeGreaterThanOrEqual(width < 768 ? 40 : 36);
    expect(bounds!.x, id).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width, id).toBeLessThanOrEqual(width);
    const label = page.locator(`label[for="${id}"]`);
    await expect(label).toHaveCount(1);
    const labelBounds = await label.boundingBox();
    expect(labelBounds, id).not.toBeNull();
    if (width < 768) {
      expect(labelBounds!.y + labelBounds!.height + 7, id).toBeLessThan(
        bounds!.y,
      );
      expect(Math.abs(labelBounds!.x - bounds!.x), id).toBeLessThan(1);
    }
    measurements.push({ id, field: bounds, label: labelBounds });
  }
  return measurements;
}

for (const language of ["en", "zh"])
  for (const width of [390, 768, 1440])
    for (const screen of deepScreens) {
      test(`deep responsive ${width} ${language}: ${screen.id}`, async ({
        browser,
      }, info) => {
        const theme = language === "zh" ? "dark" : "light";
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          storageState: guiEnvironment().auth,
          reducedMotion: "reduce",
          hasTouch: width === 390,
        });
        await context.addInitScript(
          ({ language, theme }) => {
            localStorage.setItem("language", language);
            localStorage.setItem("dark-mode", theme === "dark" ? "on" : "off");
            // Exercise the narrower content area with the tablet sidebar open.
            localStorage.setItem("sidebarOpen", JSON.stringify({ open: true }));
          },
          { language, theme },
        );
        const page = await context.newPage();
        const writes: string[] = [];
        const errors: string[] = [];
        const failedReads: string[] = [];
        const failedRequests: string[] = [];
        const onReadFailure = (request: Request) => {
          const path = new URL(request.url()).pathname;
          if (path.startsWith("/api/v1/") && request.method() === "GET")
            failedRequests.push(
              `${request.failure()?.errorText || "Request failed"} ${path}`,
            );
        };
        // This case navigates once, then edits local form state. Aborted API
        // reads during that scope are failures, not a navigation exception.
        page.on("requestfailed", onReadFailure);
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("response", (response) => {
          if (
            new URL(response.url()).pathname.startsWith("/api/v1/") &&
            response.request().method() === "GET" &&
            !response.ok()
          )
            failedReads.push(
              `${response.status()} ${new URL(response.url()).pathname}`,
            );
        });
        await page.route("**/api/v1/**", (route) => {
          if (["GET", "HEAD", "OPTIONS"].includes(route.request().method()))
            return route.continue();
          writes.push(
            `${route.request().method()} ${new URL(route.request().url()).pathname}`,
          );
          return route.abort("blockedbyclient");
        });
        if (width === 390) await emulateCoarsePointer(page);
        try {
          await page.goto(`${guiEnvironment().url}${screen.path}`);
          await expect(page.locator(".page-header")).toBeVisible();
          if (width === 768)
            await expect(
              page.getByRole("button", {
                name: /^(Collapse menu|折叠菜单)$/,
                exact: true,
              }),
            ).toBeVisible();
          if (screen.id === "ldap-edit") {
            await page.locator("#edit").click();
            await expect(page.locator("#save-key")).toBeDisabled();
          }
          if (screen.id === "trace-filters") {
            await page.locator("#filter-toggle").click();
            await expect(page.locator("#trace-filters")).toBeVisible();
          }
          if (screen.id === "profile") {
            await expect(page.locator("#start-profiling")).toBeVisible();
            await expect(page.locator("#stop-profiling")).toBeVisible();
          }
          await expect(
            page.locator('[role="status"][aria-busy="true"]'),
          ).toHaveCount(0);
          const measurements = await deepFieldGeometry(
            page,
            screen.fields,
            width,
          );
          await geometry(page);
          const actions =
            screen.id === "trace-filters"
              ? ["filter-toggle", "start-trace"]
              : screen.id === "profile"
                ? ["start-profiling", "stop-profiling"]
                : screen.id === "replication-add"
                  ? ["clear", "save", "add-peer-row-0"]
                  : screen.id.startsWith("tier-")
                    ? ["save-tier-configuration"]
                    : [];
          for (const id of actions) {
            const action = page.locator(`#${id}`);
            await expect(action).toBeVisible();
            const bounds = (await action.boundingBox())!;
            expect(bounds.x, id).toBeGreaterThanOrEqual(0);
            expect(bounds.x + bounds.width, id).toBeLessThanOrEqual(width);
            expect(bounds.height, id).toBeGreaterThanOrEqual(
              width === 390 ? 40 : 36,
            );
          }

          const controlIds = await page
            .locator(
              ".mainPage input[id], .mainPage textarea[id], .mainPage select[id]",
            )
            .evaluateAll((nodes) => nodes.map((node) => node.id));
          expect(new Set(controlIds).size).toBe(controlIds.length);
          if (
            ["openid-add", "ldap-edit", "replication-add"].includes(screen.id)
          )
            await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);

          if (["openid-add", "kafka-add", "ldap-edit"].includes(screen.id)) {
            const switches = page.getByRole("switch");
            const checked = await switches.evaluateAll((nodes) =>
              nodes.map((node) => (node as HTMLInputElement).checked),
            );
            const help = page.locator(".mainPage .inputLabel button").first();
            await help.focus();
            await expect(page.getByRole("tooltip")).toBeVisible();
            await help.click();
            expect(
              await switches.evaluateAll((nodes) =>
                nodes.map((node) => (node as HTMLInputElement).checked),
              ),
            ).toEqual(checked);
            await page.keyboard.press("Escape");
          }

          if (screen.id === "openid-add") {
            const first = page.locator('input[name="claim_userinfo"]');
            const second = page.locator('input[name="redirect_uri_dynamic"]');
            await expect(first).not.toBeChecked();
            await expect(second).not.toBeChecked();
            const label = page.locator(
              `label[for="${await second.getAttribute("id")}"]`,
            );
            // The text portion, not the nested help button, is the label action.
            await label.click({ position: { x: 4, y: 4 } });
            await expect(second).toBeChecked();
            await expect(first).not.toBeChecked();
            await second.focus();
            await page.keyboard.press("Space");
            await expect(second).not.toBeChecked();
            await page.locator("#name").focus();
            await page.locator("#config_url").focus();
            await expect(page.locator("#name")).toHaveAttribute(
              "aria-invalid",
              "true",
            );
            await expect(page.locator("#client_id")).not.toHaveAttribute(
              "aria-invalid",
              "true",
            );
            await page.locator("#name").fill("unsaved-layout-check");
            await page
              .locator("#config_url")
              .fill(
                `https://identity.example.invalid/${"long-segment/".repeat(12)}`,
              );
            await geometry(page);
          }

          if (screen.id.startsWith("tier-") && screen.id !== "tier-gcs") {
            const id = screen.id === "tier-azure" ? "accountKey" : "secretKey";
            const secret = page.locator(`#${id}`);
            await expect(secret).toHaveAttribute("type", "password");
            await secret.fill("synthetic-layout-check");
            const reveal = secret.locator("..").getByRole("button");
            await expect(reveal).toHaveAccessibleName(
              language === "en" ? "Show password" : "显示密码",
            );
            await reveal.focus();
            await page.keyboard.press("Enter");
            await expect(secret).toHaveAttribute("type", "text");
            await reveal.click();
            await expect(secret).toHaveAttribute("type", "password");
          }

          if (screen.id === "replication-add") {
            const peers = page.locator(
              '.site-input-row:has(input[id^="add-rep-peer-site-ep-"])',
            );
            await expect(page.locator("#add-peer-row-0")).toBeEnabled();
            const before = await peers.count();
            await page.locator("#add-rep-peer-site-0").fill("unsaved-peer");
            await page.locator("#add-peer-row-0").click();
            await expect(peers).toHaveCount(before + 1);
            await expect(page.locator("#add-rep-peer-site-1")).toBeFocused();
            await expect(page.locator("#add-rep-peer-site-0")).toHaveValue(
              "unsaved-peer",
            );
            await geometry(page);
            await page.locator("#remove-peer-row-1").click();
            await expect(peers).toHaveCount(before);
            await expect(page.locator("#add-peer-row-0")).toBeFocused();
            await expect(page.locator("#add-rep-peer-site-0")).toHaveValue(
              "unsaved-peer",
            );
            await expect(page.locator('input[id*="-sk-"]')).toHaveCount(2);
            for (const secret of await page.locator('input[id*="-sk-"]').all())
              await expect(secret).toHaveAttribute("type", "password");
          }

          // One phone dark and one desktop light state for every deep screen.
          // This is an unmodified whole-page audit: no masks or rule exclusions.
          if (
            (width === 390 && language === "zh") ||
            (width === 1440 && language === "en")
          ) {
            const audit = await new AxeBuilder({ page }).analyze();
            await info.attach("whole-page-axe", {
              body: JSON.stringify(audit, null, 2),
              contentType: "application/json",
            });
            expect(
              audit.violations.filter((item) =>
                ["moderate", "serious", "critical"].includes(item.impact || ""),
              ),
            ).toEqual([]);
          }
          await info.attach("deep-form-geometry", {
            body: JSON.stringify(
              {
                screen: screen.id,
                width,
                language,
                theme,
                measurements,
                writes,
                errors,
                failedReads,
                failedRequests,
              },
              null,
              2,
            ),
            contentType: "application/json",
          });
          await page.screenshot({
            path: join(
              guiEnvironment().screenshots,
              `deep-${screen.id}-${width}-${language}-${theme}.png`,
            ),
            fullPage: true,
            animations: "disabled",
          });
          expect(writes).toEqual([]);
          expect(errors).toEqual([]);
          expect(failedReads).toEqual([]);
          expect(failedRequests).toEqual([]);
        } finally {
          // Closing the context is outside the observed acceptance window.
          page.off("requestfailed", onReadFailure);
          await context.close();
        }
      });
    }

for (const lang of ["en", "zh"])
  for (const width of [390, 768, 1440])
    for (const route of routes) {
      test(`responsive ${width} ${lang}: ${route}`, async ({ browser }) => {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          storageState: route === "/login" ? undefined : guiEnvironment().auth,
        });
        await context.addInitScript(
          ({ lang }) => {
            localStorage.setItem("language", lang);
            localStorage.removeItem("sidebarOpen");
          },
          { lang },
        );
        const page = await context.newPage();
        try {
          const apiPath =
            route === "/overview"
              ? "/admin/info"
              : route === "/buckets" || route.startsWith("/browser/")
                ? "/buckets"
                : route === "/identity/users"
                  ? "/users"
                  : route === "/policies"
                    ? "/policies"
                    : route === "/identity/groups"
                      ? "/groups"
                      : route === "/settings/configurations"
                        ? "/configs"
                        : route === "/settings/event-destinations"
                          ? "/admin/notification_endpoints"
                          : undefined;
          const response = apiPath
            ? page.waitForResponse(
                (item) =>
                  new URL(item.url()).pathname === `/api/v1${apiPath}` &&
                  item.request().method() === "GET",
              )
            : undefined;
          await page.goto(`${guiEnvironment().url}${route}`);
          if (response) expect((await response).ok()).toBe(true);
          if (route === "/login")
            await expect(page.locator(".formBox")).toBeVisible();
          else {
            await expect(page.locator(".page-header").first()).toBeVisible();
            const menu = page.getByRole("button", {
              name: lang === "en" ? "Open menu" : "打开菜单",
              exact: true,
            });
            if (width < 768) await expect(menu).toBeVisible();
            else await expect(menu).toHaveCount(0);
          }
          if (route === "/browser/demo-data/docs%2F") {
            const first = page.locator('[role="row"][data-fluid-key]').first();
            await expect(first).toBeVisible();
            await first.focus();
            await page.keyboard.press("Space");
            await expect(first).toHaveAttribute("aria-selected", "true");
            await expect(page.getByRole("dialog")).toHaveCount(0);
          }
          if (route.startsWith("/browser/"))
            await expect(page.getByRole("grid").first()).toBeVisible();
          if (route.endsWith("README.md") && width < 768)
            await expect(
              page.getByRole("dialog", {
                name: lang === "en" ? "Object details" : "对象详情",
                exact: true,
              }),
            ).toBeVisible();
          if (route === "/identity/users/bob")
            await expect(page.getByRole("tabpanel").first()).toContainText(
              "analysts",
            );
          if (route === "/policies/demo-reader")
            await expect(page.getByRole("tabpanel").first()).toContainText(
              "s3:",
            );
          if (route === "/settings/configurations")
            await expect(
              page
                .locator("#settings-container input:not([type=file])")
                .first(),
            ).toBeVisible();
          await expect(
            page.locator('[role="status"][aria-busy="true"]'),
          ).toHaveCount(0);
          // Two paints flush responsive measurements without a timer-based readiness guess.
          await page.evaluate(
            () =>
              new Promise<void>((resolve) =>
                requestAnimationFrame(() =>
                  requestAnimationFrame(() => resolve()),
                ),
              ),
          );
          await geometry(page);
          if (
            route === "/identity/users/bob" ||
            route === "/policies/demo-reader"
          ) {
            await expect(page.getByRole("tablist").first()).toHaveAttribute(
              "aria-orientation",
              width < 768 ? "horizontal" : "vertical",
            );
            const panel = await page
              .getByRole("tabpanel")
              .first()
              .boundingBox();
            expect(panel!.width).toBeGreaterThan(width < 768 ? 250 : 200);
          }
          if (width !== 1440)
            await page.screenshot({
              path: join(
                guiEnvironment().screenshots,
                `${width}-${lang}-${route.replace(/[^a-zA-Z0-9]/g, "_")}.png`,
              ),
              fullPage: true,
              animations: "disabled",
            });
        } finally {
          await context.close();
        }
      });
    }

test("sidebar preference is explicit, responsive defaults do not persist, drawer navigates and restores focus", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.removeItem("sidebarOpen"));
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/buckets");
  await expect(
    page.getByRole("button", { name: "Expand menu", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("sidebarOpen")),
  ).toBeNull();
  await page.getByRole("button", { name: "Expand menu", exact: true }).click();
  await page.setViewportSize({ width: 1199, height: 900 });
  await expect(
    page.getByRole("button", { name: "Collapse menu", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("sidebarOpen")!).open,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 390, height: 900 });
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Menu", exact: true });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await drawer.getByRole("button", { name: "Buckets", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(
    page.getByRole("button", { name: "Collapse menu", exact: true }),
  ).toBeVisible();
});

test("mobile actions retain language, theme and Help; login hero starts at 768", async ({
  browser,
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/buckets");
  const overflow = page.getByRole("button", {
    name: "Page actions",
    exact: true,
  });
  await overflow.click();
  await page
    .getByRole("menuitem", { name: "Switch to dark mode", exact: true })
    .click();
  expect(await page.evaluate(() => localStorage.getItem("dark-mode"))).toBe(
    "on",
  );
  await page.screenshot({
    path: join(guiEnvironment().screenshots, "390-header-dark.png"),
    fullPage: true,
    animations: "disabled",
  });
  await overflow.click();
  await page
    .getByRole("menuitem", { name: "Switch to light mode", exact: true })
    .click();
  await page.locator("#language-activator").click();
  await page.getByRole("option", { name: "简体中文", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "打开菜单", exact: true }),
  ).toBeVisible();
  await page.locator("#language-activator").click();
  await page.getByRole("option", { name: "English", exact: true }).click();
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole("button", { name: "Open help", exact: true }).click();
    const panel = page.locator(".help-menu-panel");
    await expect(panel).toBeVisible();
    const bounds = await panel.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThan(40);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900);
    await page.screenshot({
      path: join(guiEnvironment().screenshots, `${width}-help.png`),
      fullPage: true,
      animations: "disabled",
    });
    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible();
    await geometry(page);
  }
  const context = await browser.newContext();
  const login = await context.newPage();
  for (const width of [767, 768, 1440]) {
    await login.setViewportSize({ width, height: 900 });
    await login.goto(`${guiEnvironment().url}/login`);
    if (width >= 768) await expect(login.locator("aside")).toBeVisible();
    else await expect(login.locator("aside")).not.toBeVisible();
    await geometry(login);
  }
  await context.close();
});

for (const start of [390, 1440])
  test(`detail nested draft and focused target survive resize from ${start}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: start, height: 900 });
    await page.goto("/browser/demo-data/docs%2FREADME.md");
    const tags = page.getByRole("button", { name: "Tags", exact: true });
    await expect(tags).toBeVisible();
    await tags.click();
    const nested = page.getByRole("dialog", { name: "Edit Tags", exact: true });
    const input = nested.locator("#newTagKey");
    await expect(input).toBeVisible();
    await input.fill("t18-unsaved");
    await expect(input).toBeFocused();
    for (const width of [start === 390 ? 1440 : 390, start]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      await expect(input).toHaveValue("t18-unsaved");
      await expect(input).toBeFocused();
      expect(
        await input.evaluate((node) => {
          const r = node.getBoundingClientRect();
          return (
            document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) ===
            node
          );
        }),
      ).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(nested).toHaveCount(0);
    await expect(tags).toBeFocused();
    await page.setViewportSize({ width: 390, height: 900 });
    await expect(
      page.getByRole("dialog", { name: "Object details", exact: true }),
    ).toBeVisible();
    await geometry(page);
    await page.screenshot({
      path: join(
        guiEnvironment().screenshots,
        `390-detail-sheet-from-${start}.png`,
      ),
      fullPage: true,
      animations: "disabled",
    });
    const sheet = page.getByRole("dialog", {
      name: "Object details",
      exact: true,
    });
    if (start === 390) {
      await sheet.focus();
      await expect(sheet).toBeFocused();
      await page.keyboard.press("Escape");
    } else
      await sheet
        .getByRole("button", { name: "Close details", exact: true })
        .click();
    await expect(page).toHaveURL(/docs%2F$/);
    await expect(
      page
        .locator('[role="row"][tabindex="0"], [role="group"][tabindex="0"]')
        .first(),
    ).toBeFocused();
  });

test("390 buckets and objects have no moderate, serious or critical axe violations", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 900 });
  for (const route of ["/buckets", "/browser/demo-data"]) {
    await page.goto(route);
    await expect(page.locator(".page-header")).toBeVisible();
    const audit = await new AxeBuilder({ page }).analyze();
    await info.attach("whole-page-axe", {
      body: JSON.stringify(audit, null, 2),
      contentType: "application/json",
    });
    expect(
      audit.violations.filter((item) =>
        ["moderate", "serious", "critical"].includes(item.impact || ""),
      ),
    ).toEqual([]);
  }
});

test("IAM tabs change their real keyboard axis and retain the selected panel", async ({
  page,
}) => {
  for (const route of ["/identity/users/bob", "/policies/demo-reader"]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    const tabs = page.getByRole("tablist").first();
    await expect(tabs).toHaveAttribute("aria-orientation", "vertical");
    const second = tabs.getByRole("tab").nth(1);
    await tabs.getByRole("tab").first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(second).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(second).toHaveAttribute("aria-selected", "true");
    const panelId = await second.getAttribute("aria-controls");
    await page.setViewportSize({ width: 390, height: 900 });
    await expect(tabs).toHaveAttribute("aria-orientation", "horizontal");
    await expect(second).toBeFocused();
    await expect(page.locator(`[id="${panelId}"]`)).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.getByRole("tab").nth(2)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(tabs.getByRole("tab").nth(2)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await geometry(page);
  }
});

for (const entry of ["details", "row menu"])
  test(`mobile Versions remains reachable through ${entry}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    if (entry === "details") {
      await page.goto("/browser/demo-data/docs%2FREADME.md");
      await page
        .getByRole("button", { name: "Display Object Versions", exact: true })
        .click();
    } else {
      await page.goto("/browser/demo-data/docs%2F");
      const row = page.locator('[role="row"][data-fluid-key="docs/README.md"]');
      await row.focus();
      await page.keyboard.press("Shift+F10");
      await page
        .getByRole("menuitem", { name: "Display Object Versions", exact: true })
        .click();
    }
    const sheet = page.getByRole("dialog", {
      name: "Object details",
      exact: true,
    });
    await expect(sheet).toHaveCount(0);
    const version = page.locator(".mainFileVersionItem").first();
    await expect(version).toBeVisible();
    const versionId = (await version.locator(".versionID").innerText()).trim();
    await version.click();
    await page.locator("#version-object-details").click();
    await expect(sheet).toBeVisible();
    await expect(sheet).toContainText(versionId);
    const restrictedTags = sheet.getByRole("button", {
      name: "Tags",
      exact: true,
    });
    await expect(restrictedTags).toBeDisabled();
    await expect(restrictedTags).toHaveAccessibleDescription(
      "Tags can only be changed on the current version.",
    );
    const shareResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname ===
        "/api/v1/buckets/demo-data/objects/share",
    );
    await sheet.getByRole("button", { name: "Share", exact: true }).click();
    const response = await shareResponse;
    expect(response.ok()).toBe(true);
    const request = new URL(response.url());
    expect(request.searchParams.get("prefix")).toBe("docs/README.md");
    expect(request.searchParams.get("version_id")).toBe(versionId);
    const share = page.getByRole("dialog", { name: "Share File", exact: true });
    const copy = share.getByRole("button", {
      name: "Copy share URL",
      exact: true,
    });
    await expect(copy).toBeVisible();
    await expect(copy).toBeEnabled();
    await share.getByRole("button", { name: "Close", exact: true }).click();
    await expect(share).toHaveCount(0);
    await sheet.focus();
    await expect(sheet).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(version).toBeVisible();
    await expect(page).toHaveURL(/README.md$/);
    await geometry(page);
    await page.screenshot({
      path: join(
        guiEnvironment().screenshots,
        `390-versions-${entry.replace(" ", "-")}.png`,
      ),
      fullPage: true,
      animations: "disabled",
    });
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await expect(sheet).toBeVisible();
    await sheet.focus();
    await expect(sheet).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/docs%2F$/);
  });

test("desktop Versions with an open Tags draft retains its focused nested dialog on mobile", async ({
  page,
}) => {
  await page.goto("/browser/demo-data/docs%2FREADME.md");
  await page
    .getByRole("button", { name: "Display Object Versions", exact: true })
    .click();
  await expect(page.locator(".mainFileVersionItem").first()).toBeVisible();
  await page.getByRole("button", { name: "Tags", exact: true }).click();
  const tags = page.getByRole("dialog", { name: "Edit Tags", exact: true });
  const input = tags.locator("#newTagKey");
  await input.fill("versions-unsaved");
  for (const width of [390, 1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await expect(input).toBeFocused();
    await expect(input).toHaveValue("versions-unsaved");
    expect(
      await input.evaluate((node) => {
        const r = node.getBoundingClientRect();
        return (
          document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) ===
          node
        );
      }),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(tags).toHaveCount(0);
  await expect(page.locator(".mainFileVersionItem").first()).toBeVisible();
});

test("real object checkbox edges toggle once without navigation and preserve the single keyboard entry", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    hasTouch: true,
    storageState: guiEnvironment().auth,
  });
  const page = await context.newPage();
  await emulateCoarsePointer(page);
  try {
    await page.goto(`${guiEnvironment().url}/browser/demo-data/docs%2F`);
    const row = page.locator('[role="row"][data-fluid-key="docs/README.md"]');
    await expect(row).toBeVisible();
    const checkbox = row.getByRole("checkbox");
    const box = (await checkbox.boundingBox())!;
    const rowBox = (await row.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(40);
    expect(box.height).toBeGreaterThanOrEqual(40);
    expect(rowBox.height).toBeGreaterThanOrEqual(40);
    expect(box.x).toBeGreaterThanOrEqual(rowBox.x);
    expect(box.y + box.height).toBeLessThanOrEqual(
      rowBox.y + rowBox.height + 1,
    );
    await row.evaluate((node) => {
      node.setAttribute("data-selection-updates", "0");
      new MutationObserver((records) => {
        const updates = records.filter(
          (record) => record.attributeName === "aria-selected",
        ).length;
        if (updates)
          node.setAttribute(
            "data-selection-updates",
            String(
              Number(node.getAttribute("data-selection-updates")) + updates,
            ),
          );
      }).observe(node, {
        attributes: true,
        attributeFilter: ["aria-selected"],
      });
    });
    await page.touchscreen.tap(box.x + 2, box.y + 2);
    await expect(checkbox).toBeChecked();
    await expect(row).toHaveAttribute("data-selection-updates", "1");
    await expect(page).toHaveURL(/docs%2F$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(
      page.locator('[role="row"][aria-selected="true"]'),
    ).toHaveCount(1);
    // The selected-actions launcher changes the table's position. Tap the
    // current input's edge, as a user would, after that layout has settled.
    await expect(
      page.getByRole("button", { name: "Selected actions", exact: true }),
    ).toBeVisible();
    const selectedBox = (await checkbox.boundingBox())!;
    const edge = {
      x: selectedBox.x + selectedBox.width - 2,
      y: selectedBox.y + selectedBox.height - 2,
    };
    expect(
      await checkbox.evaluate(
        (node, point) => document.elementFromPoint(point.x, point.y) === node,
        edge,
      ),
    ).toBe(true);
    await page.touchscreen.tap(edge.x, edge.y);
    await expect(checkbox).not.toBeChecked();
    await expect(row).toHaveAttribute("data-selection-updates", "2");
    await expect(
      page.locator('[role="row"][aria-selected="true"]'),
    ).toHaveCount(0);
    const menu = row.getByRole("button", {
      name: "Object actions: docs/README.md",
      exact: true,
    });
    const menuBox = (await menu.boundingBox())!;
    expect(menuBox.width).toBeGreaterThanOrEqual(40);
    expect(menuBox.height).toBeGreaterThanOrEqual(40);
    await row.focus();
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () => !!document.activeElement?.closest('[role="row"][data-fluid-key]'),
      ),
    ).toBe(false);
    await menu.click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page).toHaveURL(/docs%2F$/);
    await page.keyboard.press("Escape");
    await geometry(page);
  } finally {
    await context.close();
  }
});

async function modalBounds(modal: Locator) {
  // Read the final geometry after the modal's entrance transform completes,
  // including the easing curve's small overshoot near its final position.
  await expect(modal).toHaveCSS(
    "transform",
    /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/,
  );
  await expect
    .poll(async () => (await modal.boundingBox())?.x)
    .toBeCloseTo(12, 0);
  const box = (await modal.boundingBox())!;
  expect(box.x).toBeCloseTo(12, 0);
  expect(box.width).toBeCloseTo(366, 0);
  expect(box.y).toBeGreaterThanOrEqual(12);
  expect(box.y + box.height).toBeLessThanOrEqual(888);
  expect(
    await modal.evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);
}
async function stackedButtons(first: Locator, second: Locator) {
  const a = (await first.boundingBox())!,
    b = (await second.boundingBox())!;
  expect(a.width).toBeGreaterThan(280);
  expect(b.width).toBeCloseTo(a.width, 0);
  expect(b.y).toBeGreaterThanOrEqual(a.y + a.height);
}

test("mobile form, confirmation and Wizard actions have bounded dialogs and stacked footers", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.route("**/api/v1/**", (route) =>
    ["GET", "HEAD"].includes(route.request().method())
      ? route.continue()
      : route.abort(),
  );
  await page.goto("/browser/demo-data/docs%2FREADME.md");
  await page.getByRole("button", { name: "Tags", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Edit Tags", exact: true });
  await expect(form.locator("#newTagKey")).toBeVisible();
  await modalBounds(form);
  await stackedButtons(form.locator("#clear"), form.locator("#saveTag"));
  await page.screenshot({
    path: join(guiEnvironment().screenshots, "390-form-footer.png"),
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await page.goto("/buckets");
  await page
    .getByRole("button", { name: "Actions for demo-data", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Delete bucket", exact: true })
    .click();
  const confirmation = page.getByRole("dialog", {
    name: "Delete Bucket",
    exact: true,
  });
  await expect(confirmation).toBeVisible();
  await modalBounds(confirmation);
  await stackedButtons(
    confirmation.locator("#confirm-cancel"),
    confirmation.locator("#confirm-ok"),
  );
  await confirmation
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await page
    .getByRole("row", { name: "demo-data", exact: true })
    .getByRole("checkbox")
    .check();
  await page.getByRole("button", { name: "Actions", exact: true }).click();
  await page
    .getByRole("menuitem", { name: "Set lifecycle", exact: true })
    .click();
  const wizard = page.getByRole("dialog", {
    name: "Set Lifecycle to multiple buckets",
    exact: true,
  });
  await expect(
    wizard.getByRole("button", { name: "Create Rules", exact: true }),
  ).toBeVisible();
  await modalBounds(wizard);
  expect(
    await wizard
      .locator(".buttonInnerContainer")
      .evaluate((node) => getComputedStyle(node).flexDirection),
  ).toBe("column");
  expect(
    (await wizard
      .getByRole("button", { name: "Create Rules", exact: true })
      .boundingBox())!.width,
  ).toBeGreaterThan(280);
  await wizard
    .getByRole("button", { name: "Create Rules", exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: join(guiEnvironment().screenshots, "390-wizard-footer.png"),
    animations: "disabled",
  });
  await wizard.getByRole("button", { name: "Close", exact: true }).click();
  await geometry(page);
});

test("sidebar brand keeps its size and focus through collapse and all Overview groups have real destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/overview");
  const expand = page.getByRole("button", { name: "Expand menu", exact: true });
  if (await expand.isVisible()) await expand.click();
  await expect(page.locator(".menuBox")).toHaveCSS("width", "240px");
  const emblem = page.locator(".brandMark img");
  const before = (await emblem.boundingBox())!;
  expect(before.width).toBe(28);
  expect(before.height).toBe(28);
  const wordmark = (await page.locator(".brandWordmark img").boundingBox())!;
  expect(wordmark.height / before.height).toBeCloseTo(0.7, 1);
  const brand = page.locator("button.brandHeader");
  await expect(brand).toHaveAccessibleName("Collapse menu");
  await expect(page.locator(".brandToggleSlot")).toHaveCount(0);
  await emblem.click();
  await expect(page.locator(".menuBox")).toHaveCSS("width", "64px");
  await expect(brand).toBeFocused();
  const collapsed = (await emblem.boundingBox())!;
  const rail = (await page.locator(".menuBox").boundingBox())!;
  expect(collapsed.width).toBe(before.width);
  expect(collapsed.height).toBe(before.height);
  expect(collapsed.y).toBe(before.y);
  expect(
    Math.abs(collapsed.x + collapsed.width / 2 - (rail.x + rail.width / 2)),
  ).toBeLessThan(1);
  const footer = await page
    .locator(".menuFooter .menuItemButton")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().toJSON()),
    );
  expect(footer).toHaveLength(3);
  expect(footer[1].top).toBeGreaterThanOrEqual(footer[0].bottom);
  expect(footer[2].top).toBeGreaterThanOrEqual(footer[1].bottom);
  await expand.press("Space");
  await expect(page.locator(".menuBox")).toHaveCSS("width", "240px");
  await expect(brand).toBeFocused();
  expect(await emblem.boundingBox()).toEqual(before);
  await page.emulateMedia({ reducedMotion: "reduce" });
  // The shared reduced-motion rule permits short color/opacity fades, but
  // sidebar geometry and icon transforms must snap to their destination.
  for (const target of [page.locator(".menuBox"), page.locator(".brandMark")]) {
    await expect(target).toHaveCSS(
      "transition-property",
      "opacity, color, background-color",
    );
  }
  await brand.press("Enter");
  expect(
    await page
      .locator(".menuBox")
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBe(64);
  expect(await emblem.boundingBox()).toEqual(collapsed);
  await expect(brand).toBeFocused();
  for (const [name, count] of [
    ["Identity", 5],
    ["Monitoring", 5],
    ["Settings", 4],
    ["Tools", 4],
  ] as const) {
    const group = page.getByRole("navigation", { name, exact: true });
    await expect(group.getByRole("link")).toHaveCount(count);
    for (const link of await group.getByRole("link").all()) {
      expect(await link.getAttribute("href")).toMatch(
        /^\/(support|settings|tools|identity|policies)/,
      );
    }
  }
});

test("Watch fields align and configuration tabs use one label column", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/tools/watch");
  const fields = page.locator(
    "#bucket-name-select, #prefix-resource, #suffix-resource, #start-watch",
  );
  await expect(fields).toHaveCount(4);
  const boxes = await fields.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().toJSON()),
  );
  for (const box of boxes) {
    expect(Math.abs(box.top - boxes[0].top)).toBeLessThan(1);
    expect(box.height).toBe(boxes[0].height);
  }
  await page.goto("/settings/configurations/logger_webhook");
  await expect(
    page.getByRole("grid", { name: "endpoints", exact: true }),
  ).toBeVisible();
  const offsets = await page
    .locator('[aria-orientation="vertical"] [role="tab"] .label')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().left),
    );
  expect(offsets.length).toBeGreaterThan(4);
  expect(new Set(offsets).size).toBe(1);
  await expect(page.getByText("Disabled", { exact: true })).toBeVisible();
  for (const [route, action] of [
    ["/settings/tiers", "add-tier"],
    ["/identity/users", "create-user"],
    ["/identity/groups", "create-group"],
    ["/policies", "create-policy"],
    ["/buckets", "create-bucket"],
  ]) {
    await page.goto(route);
    await expect(page.locator(`#${action}`)).toBeVisible();
    await expect(page.locator(`.page-header #${action}`)).toHaveCount(0);
    await geometry(page);
  }
});

test("webhook environment overrides display the effective enabled state", async ({
  page,
}) => {
  // Intercept only this read to cover an environment-disabled endpoint without
  // changing the shared demo server's environment or configuration.
  await page.route("**/api/v1/configs/logger_webhook", (route) =>
    route.fulfill({
      json: [
        {
          name: "environment-off",
          key_values: [
            {
              key: "enable",
              value: "on",
              env_override: {
                name: "MINIO_LOGGER_WEBHOOK_ENABLE",
                value: "off",
              },
            },
          ],
        },
        {
          name: "environment-on",
          key_values: [
            {
              key: "enable",
              value: "off",
              env_override: {
                name: "MINIO_LOGGER_WEBHOOK_ENABLE",
                value: "on",
              },
            },
          ],
        },
      ],
    }),
  );
  await page.goto("/settings/configurations/logger_webhook");
  await expect(
    page.getByRole("row", { name: "environment-off", exact: true }),
  ).toContainText("Disabled");
  await expect(
    page.getByRole("row", { name: "environment-on", exact: true }),
  ).toContainText("Enabled");
  await page.setViewportSize({ width: 390, height: 844 });
  const selected = page.getByRole("tab", {
    name: "Logger Webhook",
    exact: true,
  });
  await expect
    .poll(async () => {
      const bounds = (await selected.boundingBox())!;
      return bounds.x >= 0 && bounds.x + bounds.width <= 390;
    })
    .toBe(true);
});
