// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import type {
  Bucket,
  BucketUsageRecord,
  BucketUsageResponse,
  ListBucketsResponse,
} from "../src/api/consoleApi";
import { SERVER_ENDPOINT, adminAccessKey, adminSecretKey } from "./consts";
import { emulateCoarsePointer } from "./fixtures/emulateCoarsePointer";
import { browserExecutable } from "./fixtures/browserExecutable";

test.use({
  viewport: { width: 1440, height: 900 },
  launchOptions: { executablePath: browserExecutable() },
});
const at = "2026-10-24T00:00:00Z";
const buckets: Bucket[] = [
  {
    name: "alpha",
    objects: 2,
    size: 1024,
    rw_access: { read: true, write: true },
    details: { versioning: true },
    creation_date: at,
  },
  {
    name: "beta",
    objects: 4,
    size: 8192,
    rw_access: { read: true },
    details: {},
    creation_date: at,
  },
  { name: "team-01", details: {}, creation_date: at },
];

const usageRecord = (
  bucket: string,
  bytes: string | number,
  objects: number,
): BucketUsageRecord => ({
  bucket,
  state: "complete",
  versions_visible: true,
  last_good: {
    totals: {
      current_bytes: String(bytes),
      current_objects: objects,
      retained_bytes: "0",
      retained_versions: 0,
      delete_markers: 0,
    },
    scanned_entries: objects,
    started_at: at,
    updated_at: at,
  },
  last_completed_at: at,
});

const completedUsage = [
  usageRecord("alpha", 1024, 2),
  usageRecord("beta", 8192, 4),
  usageRecord("team-01", 0, 0),
];

async function mockUsage(
  page: Page,
  records: () => BucketUsageRecord[] = () => completedUsage,
) {
  await page.route(/\/api\/v1\/bucket-usage\/(status|refresh)$/, (route) => {
    expect(route.request().method()).toBe("POST");
    const names: string[] = route.request().postDataJSON().buckets;
    const available = new Map(records().map((row) => [row.bucket, row]));
    const response: BucketUsageResponse = {
      enabled: true,
      poll_after_ms: 250,
      coverage: { observer_alive: true, connected: true, reconciled: true },
      buckets: names.map(
        (bucket) =>
          available.get(bucket) ?? {
            bucket,
            state: "not_scanned",
            versions_visible: true,
          },
      ),
    };
    return route.fulfill({
      status: route.request().url().endsWith("/refresh") ? 202 : 200,
      json: response,
    });
  });
}

const selectionStatus = (page: Page) =>
  page.getByRole("status").filter({ hasText: /^\d+ buckets? selected$/ });

test("pending bucket search cannot replace navigation to an object workspace", async ({
  page,
}) => {
  await page.route("**/api/v1/buckets", (route) =>
    route.fulfill({ json: { buckets, usageUpdatedAt: at } }),
  );
  // Keep the old screen mounted while the object workspace chunk loads.
  let pendingWorkspace = false;
  await page.route("**/assets/BrowserHandler-*.js", () => {
    pendingWorkspace = true;
  });
  await page.goto(`${SERVER_ENDPOINT}/buckets`);
  const link = page.getByRole("link", { name: "alpha", exact: true });
  await expect(link).toBeVisible();
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.locator("#bucket-search").fill("alpha");
  await link.dispatchEvent("click");
  await expect(page).toHaveURL(`${SERVER_ENDPOINT}/browser/alpha`);
  await expect.poll(() => pendingWorkspace).toBe(true);
  await page.clock.runFor(250);
  await expect(page).toHaveURL(`${SERVER_ENDPOINT}/browser/alpha`);
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("language", "en");
    localStorage.setItem("dark-mode", "off");
    if (!sessionStorage.getItem("t18-sidebar-initialized")) {
      localStorage.removeItem("sidebarOpen");
      sessionStorage.setItem("t18-sidebar-initialized", "true");
    }
  });
  const login = await page.request.post(`${SERVER_ENDPOINT}/api/v1/login`, {
    data: {
      accessKey: process.env.CONSOLE_TEST_ACCESS_KEY || adminAccessKey,
      secretKey: process.env.CONSOLE_TEST_SECRET_KEY || adminSecretKey,
    },
  });
  expect(login.ok()).toBe(true);
  // These are mounted read-only tests: a mistaken submit must fail, never alter
  // an existing bucket or configure replication/lifecycle on the test server.
  await page.route("**/api/v1/**", (route) =>
    ["GET", "HEAD"].includes(route.request().method())
      ? route.continue()
      : route.abort(),
  );
  // Usage reads and refreshes are POSTs. Fulfill both locally so these tests
  // exercise the current usage contract without queuing real storage scans.
  await mockUsage(page);
});

test("URL sort/filter, history and selection retain bucket identities", async ({
  page,
}) => {
  await page.route("**/api/v1/buckets", (route) =>
    route.fulfill({ json: { buckets, usageUpdatedAt: at } }),
  );
  await page.goto(`${SERVER_ENDPOINT}/buckets?sort=size&dir=desc&keep=yes`);
  const rows = page.locator(".bucketRow");
  await expect(rows.first()).toHaveAttribute("aria-label", "beta");
  await rows.first().getByRole("checkbox").check();
  await expect(page).toHaveURL(/\/buckets\?/);
  await page.getByRole("button", { name: "Name", exact: true }).click();
  await expect(rows.first()).toHaveAttribute("aria-label", "alpha");
  await expect(
    page.getByRole("row", { name: "beta", exact: true }).getByRole("checkbox"),
  ).toBeChecked();
  await page.locator("#bucket-search").fill(" team ");
  await expect(rows).toHaveCount(1);
  await expect(page).toHaveURL(/q=/);
  await expect(
    page.getByRole("checkbox", { name: "Select all visible buckets" }),
  ).not.toBeChecked();
  await page
    .getByRole("checkbox", { name: "Select all visible buckets" })
    .check();
  await expect(selectionStatus(page)).toHaveText("2 buckets selected");
  await page.locator("#bucket-search").fill("absent");
  await expect(page.getByText("No buckets match “absent”")).toBeVisible();
  await page.locator("#clear-bucket-filter").click();
  await expect(rows).toHaveCount(3);
  expect(new URL(page.url()).searchParams.get("keep")).toBe("yes");
  await page.goBack();
  await expect(page.locator("#bucket-search")).toHaveValue("absent");
  await page.waitForTimeout(250);
  await expect(page.getByText("No buckets match “absent”")).toBeVisible();
});

test("header checkbox paint follows no, partial and full selection", async ({
  page,
}) => {
  await page.route("**/api/v1/buckets", (route) =>
    route.fulfill({ json: { buckets, usageUpdatedAt: at } }),
  );
  await page.goto(`${SERVER_ENDPOINT}/buckets`);
  const header = page.getByRole("checkbox", {
    name: "Select all visible buckets",
  });
  const svg = header.locator("..").locator("svg");
  const paint = () =>
    svg.evaluate((element) => ({
      fill: getComputedStyle(element).fill,
      offset: parseFloat(
        getComputedStyle(element.querySelector("path")!).strokeDashoffset,
      ),
    }));
  await expect(header).not.toBeChecked();
  expect((await paint()).fill).toBe("none");
  await page
    .getByRole("row", { name: "alpha", exact: true })
    .getByRole("checkbox")
    .check();
  await expect(header).not.toBeChecked();
  await expect(selectionStatus(page)).toHaveText("1 bucket selected");
  expect((await paint()).fill).toBe("none");
  await header.check();
  await expect(selectionStatus(page)).toHaveText("3 buckets selected");
  await expect.poll(async () => (await paint()).offset).toBe(0);
  await header.uncheck();
  await expect(header).not.toBeChecked();
  await expect.poll(async () => (await paint()).offset).toBe(1);
  expect((await paint()).fill).toBe("none");
});

test("row menus and retained delete dialogs never follow another bucket", async ({
  page,
}) => {
  await page.route("**/api/v1/buckets", (route) =>
    route.fulfill({ json: { buckets, usageUpdatedAt: at } }),
  );
  await page.goto(`${SERVER_ENDPOINT}/buckets`);
  const menu = (name: string) =>
    page.getByRole("button", { name: `Actions for ${name}`, exact: true });
  await menu("alpha").click();
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page).toHaveURL(`${SERVER_ENDPOINT}/buckets`);
  await page
    .getByRole("menu", { name: "Actions for alpha", exact: true })
    .getByRole("menuitem", { name: "Delete bucket", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("alpha");
  await page.keyboard.press("Escape");
  await menu("beta").click();
  await page
    .getByRole("menu", { name: "Actions for beta", exact: true })
    .getByRole("menuitem", { name: "Delete bucket", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("beta");
  await expect(page.getByRole("dialog")).not.toContainText("alpha");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("row", { name: "alpha", exact: true })
    .getByRole("link", { name: "alpha", exact: true })
    .click();
  await expect(page).toHaveURL(`${SERVER_ENDPOINT}/browser/alpha`);
});

for (const width of [1440, 390]) {
  test(`cancelled row action hints leave adjacent rows and long names clickable at ${width}px`, async ({
    page,
  }, testInfo) => {
    const longName = `z${"long-bucket-".repeat(5)}z9`;
    expect(longName.length).toBe(63);
    await page.route("**/api/v1/buckets", (route) =>
      route.fulfill({
        json: {
          buckets: [...buckets, { ...buckets[0], name: longName }],
          usageUpdatedAt: at,
        },
      }),
    );
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${SERVER_ENDPOINT}/buckets`);
    if (width === 390) {
      await expect(page.locator(".menuBox:visible")).toHaveCount(0);
      const hamburger = page.getByRole("button", {
        name: "Open menu",
        exact: true,
      });
      await hamburger.click();
      await expect(page.locator("#console-mobile-menu")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator("#console-mobile-menu")).not.toBeVisible();
      await expect(hamburger).toBeFocused();
      expect(
        await page.evaluate(() => localStorage.getItem("sidebarOpen")),
      ).toBeNull();
    }
    const cancel = async (name: string) => {
      const trigger = page.getByRole("button", {
        name: `Actions for ${name}`,
        exact: true,
      });
      await trigger.click();
      await page
        .getByRole("menu", { name: `Actions for ${name}`, exact: true })
        .getByRole("menuitem", { name: "Delete bucket", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toContainText(name);
      await expect(page.locator("#confirm-cancel")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(trigger).toBeFocused();
      const hint = page.getByRole("tooltip", { name: "Actions", exact: true });
      await expect(hint).toBeVisible();
      await expect(hint).toHaveText("Actions");
      const geometry = await hint.evaluate((e) => ({
        text: e.textContent,
        rect: e.getBoundingClientRect().toJSON(),
        viewport: innerWidth,
      }));
      await testInfo.attach(`hint-${name}-${width}`, {
        body: JSON.stringify(geometry),
        contentType: "application/json",
      });
    };
    await cancel("alpha");
    await cancel("beta");
    await cancel("alpha");
    await page
      .getByRole("row", { name: "alpha", exact: true })
      .getByRole("link", { name: "alpha", exact: true })
      .click({ timeout: 2000 });
    await expect(page).toHaveURL(`${SERVER_ENDPOINT}/browser/alpha`);
    await page.goto(`${SERVER_ENDPOINT}/buckets`);
    await cancel(longName);
    await page
      .getByRole("row", { name: longName, exact: true })
      .getByRole("link", { name: longName, exact: true })
      .click({ timeout: 2000 });
    await expect(page).toHaveURL(`${SERVER_ENDPOINT}/browser/${longName}`);
  });
}

test("usage separates unscanned, completed zero and forbidden totals from legacy metadata", async ({
  page,
}) => {
  let usage: BucketUsageRecord[] = buckets.map(({ name }) => ({
    bucket: name,
    state: "not_scanned",
    versions_visible: true,
  }));
  await mockUsage(page, () => usage);
  await page.route("**/api/v1/buckets", (route) =>
    route.fulfill({ json: { buckets, usageUpdatedAt: at } }),
  );
  await page.goto(`${SERVER_ENDPOINT}/buckets`);
  const alpha = page.getByRole("row", { name: "alpha", exact: true });
  await expect(alpha).toContainText("Not scanned");
  await expect(alpha.getByRole("cell").nth(2)).toHaveText("—");
  await expect(alpha.getByRole("cell").nth(3)).toHaveText("—");
  usage = completedUsage;
  await page.locator("#refresh-buckets").click();
  await expect(alpha).toContainText("Updated");
  await expect(alpha.getByRole("cell").nth(2)).toHaveText("2");
  await expect(alpha.locator('span[title="1024 B"]')).toBeVisible();
  const empty = page.getByRole("row", { name: "team-01", exact: true });
  await expect(empty.getByRole("cell").nth(2)).toHaveText("0");
  await expect(
    empty.getByRole("cell").nth(3).locator('span[title="0 B"]'),
  ).toHaveText("0 B");
  // Bob's account administration grants do not authorize DataUsageInfo/ListBucket.
  await page.route("**/api/v1/session", async (route) => {
    const result = await route.fetch();
    const session = await result.json();
    const actions = [
      "s3:GetObject",
      "s3:GetBucketLocation",
      "admin:CreateServiceAccount",
      "admin:ChangeMyPassword",
    ];
    await route.fulfill({
      json: {
        ...session,
        accountAccessKey: "t16-bob",
        permissions: { "console-ui": actions, "arn:aws:s3:::*": actions },
      },
    });
  });
  usage = buckets.map(({ name }) => ({
    bucket: name,
    state: "forbidden",
    versions_visible: false,
  }));
  await page.reload();
  await expect(alpha).toContainText("Usage listing not permitted");
  // The listing still contains old scanner totals; neither those nor the
  // completed administrator snapshot may appear for an unauthorized caller.
  await expect(alpha.getByRole("cell").nth(1)).toHaveText("—");
  await expect(alpha.getByRole("cell").nth(2)).toHaveText("—");
  await expect(alpha.getByText("Retained:", { exact: false })).toHaveCount(0);
  await expect(alpha.getByRole("link")).toHaveCount(0);
  await expect(page.locator("#set-lifecycle")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Actions for alpha", exact: true })
    .click();
  await expect(
    page.getByRole("menuitem", { name: "Browse", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("menuitem", { name: "Settings", exact: true }),
  ).toBeVisible();
});

test("loading, true empty, refresh failure and filtered empty remain distinct", async ({
  page,
}) => {
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  let response: ListBucketsResponse = { buckets: [], usageUpdatedAt: at };
  let failed = false;
  await page.route("**/api/v1/buckets", async (route) => {
    await pending;
    await route.fulfill(
      failed
        ? { status: 503, json: { message: "fixture failure" } }
        : { json: response },
    );
  });
  await page.goto(`${SERVER_ENDPOINT}/buckets`);
  await expect(page.locator('[role="status"][aria-busy="true"]')).toBeVisible();
  await expect(page.getByText("No buckets yet", { exact: true })).toHaveCount(
    0,
  );
  release();
  await expect(page.getByText("No buckets yet", { exact: true })).toBeVisible();
  await expect(page.locator("#empty-create-bucket")).toBeEnabled();
  await expect(page.locator("#set-replication")).toBeDisabled();
  await page.locator("#set-replication").locator("..").hover();
  await expect(page.getByRole("tooltip")).toContainText(
    "Select one or more buckets first.",
  );
  response = { buckets, usageUpdatedAt: at };
  await page.locator("#refresh-buckets").click();
  await expect(page.locator(".bucketRow")).toHaveCount(3);
  failed = true;
  await page.locator("#refresh-buckets").click();
  await expect(page.locator(".bucketRow")).toHaveCount(3);
  await expect(page.getByText("No buckets yet", { exact: true })).toHaveCount(
    0,
  );
});

test("2,000 buckets virtualize with a stationary header and identity-safe sorting", async ({
  page,
}, testInfo) => {
  const many = Array.from({ length: 2000 }, (_, index) => ({
    ...buckets[0],
    name: `bucket-${String(index).padStart(4, "0")}`,
    size: index,
  }));
  await mockUsage(page, () =>
    many.map((bucket) => usageRecord(bucket.name, bucket.size, 2)),
  );
  await page.route("**/api/v1/buckets", (route) =>
    route.fulfill({ json: { buckets: many, usageUpdatedAt: at } }),
  );
  await page.goto(`${SERVER_ENDPOINT}/buckets`);
  await expect(
    page.getByRole("table", { name: "Buckets", exact: true }),
  ).toHaveAttribute("aria-rowcount", "2001");
  const body = page.getByRole("rowgroup", { name: "Bucket rows" });
  const header = page.getByRole("columnheader", { name: "Name", exact: true });
  const top = (await header.boundingBox())!.y;
  const samples: { fraction: number; domRows: number; headerY: number }[] = [];
  for (const fraction of [0, 0.25, 0.5, 1]) {
    await body.evaluate((element, fraction) => {
      element.scrollTop =
        (element.scrollHeight - element.clientHeight) * fraction;
    }, fraction);
    await page.waitForTimeout(80);
    const domRows = await page.locator(".bucketRow").count(),
      headerY = (await header.boundingBox())!.y;
    samples.push({ fraction, domRows, headerY });
    expect(domRows).toBeLessThanOrEqual(60);
    expect(headerY).toBe(top);
  }
  await testInfo.attach("virtualized-scroll", {
    body: JSON.stringify({ recordCount: many.length, samples }),
    contentType: "application/json",
  });
  await expect(
    page.getByRole("row", { name: "bucket-1999", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("row", { name: "bucket-1999", exact: true })
    .getByRole("checkbox")
    .check();
  await page.getByRole("button", { name: "Current size", exact: true }).click();
  await expect(
    page.getByRole("columnheader", { name: "Current size", exact: true }),
  ).toHaveAttribute("aria-sort", "ascending");
  await page.getByRole("button", { name: "Current size", exact: true }).click();
  await expect(
    page.getByRole("columnheader", { name: "Current size", exact: true }),
  ).toHaveAttribute("aria-sort", "descending");
  await body.evaluate((element) => {
    element.scrollTop = 0;
  });
  await expect(
    page
      .getByRole("row", { name: "bucket-1999", exact: true })
      .getByRole("checkbox"),
  ).toBeChecked();
});

test("compact cards persist across navigation and fit every target width", async ({
  page,
}) => {
  await page.route("**/api/v1/buckets", (route) =>
    route.fulfill({ json: { buckets, usageUpdatedAt: at } }),
  );
  await page.goto(`${SERVER_ENDPOINT}/buckets`);
  await page.locator("#buckets-view-cards").click();
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    if (width === 768) {
      await expect(
        page.getByRole("button", { name: "Expand menu", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Open menu", exact: true }),
      ).toHaveCount(0);
    }
    if (width === 390) {
      await expect(page.locator(".menuBox:visible")).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Open menu", exact: true }),
      ).toBeVisible();
    }
    expect(
      await page.evaluate(() => localStorage.getItem("sidebarOpen")),
    ).toBeNull();
    await expect(page.locator(".bucket-card")).toHaveCount(3);
    for (const card of await page.locator(".bucket-card").all()) {
      await expect(card).toContainText("Updated");
      await expect(
        card.getByText("Current size", { exact: true }),
      ).toBeVisible();
      await expect(
        card.getByText("Retained: 0 B", { exact: true }),
      ).toBeVisible();
      // The compact card includes scan status and a second line of size data.
      expect((await card.boundingBox())!.height).toBeLessThanOrEqual(148);
      expect(
        await card.evaluate(
          (element) =>
            element.scrollHeight <= element.clientHeight &&
            element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.reload();
  await expect(page.locator("#buckets-view-cards")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".bucket-card")).toHaveCount(3);
});

for (const expanded of [true, false]) {
  test(`explicit ${expanded ? "expanded" : "collapsed"} sidebar survives tablet, phone and reload`, async ({
    page,
  }) => {
    await page.route("**/api/v1/buckets", (route) =>
      route.fulfill({ json: { buckets, usageUpdatedAt: at } }),
    );
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto(`${SERVER_ENDPOINT}/buckets`);
    await expect(
      page.getByRole("button", { name: "Expand menu", exact: true }),
    ).toBeVisible();
    await page.evaluate(
      (open) => localStorage.setItem("sidebarOpen", JSON.stringify({ open })),
      expanded,
    );
    await page.reload();
    for (const width of [768, 1440, 390, 768]) {
      await page.setViewportSize({ width, height: 900 });
      if (width >= 768) {
        await expect(
          page.getByRole("button", {
            name: expanded ? "Collapse menu" : "Expand menu",
            exact: true,
          }),
        ).toBeVisible();
      } else {
        await expect(page.locator(".menuBox:visible")).toHaveCount(0);
        await expect(
          page.getByRole("button", { name: "Open menu", exact: true }),
        ).toBeVisible();
      }
      const bounds = await page
        .getByRole("table", { name: "Buckets", exact: true })
        .boundingBox();
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      const name = page
        .getByRole("row", { name: "alpha", exact: true })
        .locator(".bucketHigh")
        .first();
      expect((await name.boundingBox())!.width).toBeGreaterThan(60);
      expect(
        await page.evaluate(() =>
          JSON.parse(localStorage.getItem("sidebarOpen") || "null"),
        ),
      ).toEqual({ open: expanded });
    }
  });
}

test.describe("coarse bucket selection", () => {
  test.use({ hasTouch: true });
  test("40px touch targets select once within correctly spaced usage rows", async ({
    page,
  }) => {
    const many = Array.from({ length: 2000 }, (_, index) => ({
      ...buckets[0],
      name: `touch-${String(index).padStart(4, "0")}`,
    }));
    await mockUsage(page, () =>
      many.map((bucket) => usageRecord(bucket.name, 1024, 2)),
    );
    await page.route("**/api/v1/buckets", (route) =>
      route.fulfill({ json: { buckets: many, usageUpdatedAt: at } }),
    );
    await page.setViewportSize({ width: 390, height: 900 });
    await emulateCoarsePointer(page);
    await page.goto(`${SERVER_ENDPOINT}/buckets`);
    expect(
      await page.evaluate(() => matchMedia("(pointer: coarse)").matches),
    ).toBe(true);
    const first = page.getByRole("row", { name: "touch-0000", exact: true });
    await expect(first).toContainText("Updated");
    const checkbox = first.getByRole("checkbox");
    const box = await checkbox.boundingBox();
    expect(box!.width).toBe(40);
    expect(box!.height).toBe(40);
    await checkbox.click({ position: { x: 1, y: 1 } });
    await expect(checkbox).toBeChecked();
    await expect(selectionStatus(page)).toHaveText("1 bucket selected");
    await checkbox.click({ position: { x: 39, y: 39 } });
    await expect(checkbox).not.toBeChecked();
    await expect(page).toHaveURL(`${SERVER_ENDPOINT}/buckets`);
    const actionBox = await first
      .getByRole("button", { name: "Actions for touch-0000", exact: true })
      .boundingBox();
    expect(actionBox!.width).toBeGreaterThanOrEqual(40);
    expect(actionBox!.height).toBeGreaterThanOrEqual(40);
    const firstBox = await first.boundingBox();
    const secondBox = await page
      .getByRole("row", { name: "touch-0001", exact: true })
      .boundingBox();
    expect(firstBox!.height).toBe(64);
    expect(secondBox!.y - firstBox!.y).toBe(64);
    expect(box!.x + box!.width).toBeLessThanOrEqual(
      (await first.locator(".bucketHigh").first().boundingBox())!.x,
    );
    const body = page.getByRole("rowgroup", {
      name: "Bucket rows",
      exact: true,
    });
    await body.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    const last = page.getByRole("row", { name: "touch-1999", exact: true });
    await expect(last).toBeVisible();
    expect((await last.boundingBox())!.height).toBe(64);
    expect(await page.locator(".bucketRow").count()).toBeLessThanOrEqual(60);
  });
});
