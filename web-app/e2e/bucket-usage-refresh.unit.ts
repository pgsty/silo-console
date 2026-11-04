// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Browser, chromium, expect, Page, test } from "@playwright/test";
import { createServer, ViteDevServer } from "vite";
import { browserExecutable } from "./fixtures/browserExecutable";
import type { BucketUsageRecord } from "../src/api/consoleApi";
import { filterSortBuckets } from "../src/screens/Console/Buckets/ListBuckets/bucketList";
test.describe.configure({ mode: "serial" });
let server: ViteDevServer, browser: Browser, page: Page, base: string;
const snapshot = {
  totals: {
    current_bytes: "1536",
    current_objects: 2,
    retained_bytes: "512",
    retained_versions: 1,
    delete_markers: 0,
  },
  scanned_entries: 3,
  started_at: "2026-10-26T10:00:00Z",
  updated_at: "2026-10-26T10:00:01Z",
};
test.beforeAll(async () => {
  server = await createServer({
    logLevel: "silent",
    server: { host: "127.0.0.1", port: 0 },
  });
  await server.listen();
  const address = server.httpServer!.address();
  if (!address || typeof address === "string") throw Error("Missing test port");
  base = `http://127.0.0.1:${address.port}/e2e/fixtures/bucket-usage-harness.html`;
  browser = await chromium.launch({ executablePath: browserExecutable() });
});
test.beforeEach(async () => {
  page = await browser.newPage();
});
test.afterEach(async () => {
  await page.close();
});
test.afterAll(async () => {
  await browser.close();
  await server.close();
});
test("refresh enqueues once, shows queued and running progress, then replaces last-good totals", async () => {
  let state: BucketUsageRecord["state"] = "complete",
    refreshes = 0,
    polls = 0;
  await page.route("**/api/v1/bucket-usage/*", async (route) => {
    const queue = route.request().url().endsWith("/refresh");
    expect(route.request().postDataJSON()).toEqual({
      buckets: ["fixture-bucket"],
    });
    if (queue) {
      refreshes++;
      state = "queued";
      polls = 0;
    } else if (state !== "complete") {
      polls++;
      state = polls === 1 ? "running" : "complete";
    }
    await route.fulfill({
      status: queue ? 202 : 200,
      json: {
        enabled: true,
        poll_after_ms: 250,
        coverage: { observer_alive: true, connected: true, reconciled: true },
        buckets: [
          {
            bucket: "fixture-bucket",
            state,
            versions_visible: true,
            last_good: {
              ...snapshot,
              totals: {
                ...snapshot.totals,
                current_bytes:
                  refreshes && state === "complete" ? "3072" : "1536",
              },
            },
            progress: snapshot,
            last_completed_at: snapshot.updated_at,
          },
        ],
      },
    });
  });
  await page.goto(base);
  await expect(
    page.getByRole("region", { name: "fixture-bucket" }),
  ).toContainText("1.5 KiB");
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "fixture-bucket" }),
  ).toContainText("Update queued");
  await expect(
    page.getByRole("region", { name: "fixture-bucket" }),
  ).toContainText("Updating usage…");
  await expect(
    page.getByRole("region", { name: "fixture-bucket" }),
  ).toContainText("3.0 KiB");
  await expect(
    page.getByRole("region", { name: "fixture-bucket" }),
  ).toContainText("Retained: 512 B");
  expect(refreshes).toBe(1);
  await expect(page.getByRole("status")).toContainText(
    "Automatic change monitoring is active.",
  );
});
test("navigation discards the former bucket's totals and never discloses forbidden cached usage", async () => {
  await page.route("**/api/v1/bucket-usage/*", async (route) => {
    const name = route.request().postDataJSON().buckets[0];
    await route.fulfill({
      json: {
        enabled: true,
        poll_after_ms: 250,
        buckets: [
          name === "fixture-bucket"
            ? {
                bucket: name,
                state: "complete",
                versions_visible: true,
                last_good: snapshot,
              }
            : { bucket: name, state: "forbidden", versions_visible: false },
        ],
      },
    });
  });
  await page.goto(base);
  await expect(
    page.getByRole("region", { name: "fixture-bucket" }),
  ).toContainText("1.5 KiB");
  await page.getByRole("button", { name: "Navigate" }).click();
  const row = page.getByRole("region", { name: "other-bucket" });
  await expect(row).toContainText("Usage listing not permitted");
  await expect(row).not.toContainText("1.5 KiB");
  await expect(row).toContainText("—");
});
test("queue outage is visible and is not reported as successful refresh", async () => {
  await page.route("**/api/v1/bucket-usage/*", (route) =>
    route.fulfill({
      status: 503,
      json: { message: "temporarily unavailable" },
    }),
  );
  await page.goto(base);
  await expect(page.getByRole("status")).toContainText(
    "Usage status is unavailable",
  );
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "Usage status is unavailable",
  );
  await expect(
    page.getByRole("region", { name: "fixture-bucket" }),
  ).not.toContainText("Updated");
});
test("sorts current usage with exact integers, keeps unknowns last, and leaves account records untouched", () => {
  const records = [
    { name: "large", size: 0 },
    { name: "larger", size: 1 },
    { name: "unknown", size: 999 },
  ];
  const row = (bucket: string, bytes: string): BucketUsageRecord => ({
    bucket,
    state: "complete",
    versions_visible: true,
    last_good: {
      ...snapshot,
      totals: { ...snapshot.totals, current_bytes: bytes },
    },
  });
  const usage = {
    large: row("large", "9007199254740992"),
    larger: row("larger", "9007199254740993"),
  };
  expect(
    filterSortBuckets(
      records,
      { sort: "size", dir: "desc", q: "" },
      false,
      undefined,
      usage,
    ).map((x) => x.name),
  ).toEqual(["larger", "large", "unknown"]);
  expect(records.map((x) => x.size)).toEqual([0, 1, 999]);
  expect(
    filterSortBuckets(
      records,
      { sort: "size", dir: "desc", q: "" },
      false,
      undefined,
      {},
    ).map((x) => x.name),
  ).toEqual(["large", "larger", "unknown"]);
});

test("without the persistent service, Refresh calculates current totals and never relabels scanner bytes", async () => {
  let scans = 0;
  await page.route("**/api/v1/bucket-usage/*", (route) =>
    route.fulfill({
      json: { enabled: false, poll_after_ms: 250, buckets: [] },
    }),
  );
  await page.route(
    "**/api/v1/buckets/fixture-bucket/prefix-usage*",
    (route) => {
      scans++;
      const query = new URL(route.request().url()).searchParams;
      expect(query.get("prefix")).toBe("");
      expect(query.get("folders")).toBe("false");
      return route.fulfill({
        contentType: "application/x-ndjson",
        body:
          JSON.stringify({
            ...snapshot,
            bucket: "fixture-bucket",
            prefix: "",
            mode: "versions",
            status: "complete",
            folders: [],
          }) + "\n",
      });
    },
  );
  await page.goto(base);
  await expect(page.getByRole("status")).toContainText(
    "Automatic updates are not configured",
  );
  const row = page.getByRole("region", { name: "fixture-bucket" });
  await expect(row).toContainText("—");
  expect(scans).toBe(0);
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(row).toContainText("1.5 KiB");
  await expect(row).toContainText("Updated");
  expect(scans).toBe(1);
});

for (const outcome of [
  "outage",
  "limited",
  "malformed",
  "forbidden",
  "missing",
] as const) {
  test(`a second foreground refresh handles ${outcome} without losing or disclosing old totals`, async () => {
    let scans = 0;
    let release: (() => void) | undefined;
    await page.route("**/api/v1/bucket-usage/*", (route) =>
      route.fulfill({
        json: { enabled: false, poll_after_ms: 250, buckets: [] },
      }),
    );
    await page.route(
      "**/api/v1/buckets/fixture-bucket/prefix-usage*",
      async (route) => {
        scans++;
        const frame = {
          ...snapshot,
          bucket: "fixture-bucket",
          prefix: "",
          mode: "versions",
          status: "complete",
          folders: [],
        };
        if (scans === 1)
          return route.fulfill({
            contentType: "application/x-ndjson",
            body: JSON.stringify(frame) + "\n",
          });
        await new Promise<void>((resolve) => {
          release = resolve;
        });
        if (outcome === "limited")
          return route.fulfill({
            contentType: "application/x-ndjson",
            body: JSON.stringify({ ...frame, status: "limited" }) + "\n",
          });
        if (outcome === "malformed")
          return route.fulfill({
            contentType: "application/x-ndjson",
            body:
              JSON.stringify({
                ...frame,
                totals: { ...snapshot.totals, current_bytes: "3072" },
              }) + "\ninvalid\n",
          });
        return route.fulfill({
          status:
            outcome === "forbidden" ? 403 : outcome === "missing" ? 404 : 503,
          json: { message: "unavailable" },
        });
      },
    );
    await page.goto(base);
    await expect(page.getByRole("status")).toContainText(
      "Automatic updates are not configured",
    );
    const row = page.getByRole("region", { name: "fixture-bucket" });
    await page.getByRole("button", { name: "Refresh", exact: true }).click();
    await expect(row).toContainText("Updated");
    await expect(row).toContainText("1.5 KiB");
    await page.getByRole("button", { name: "Refresh", exact: true }).click();
    await expect.poll(() => scans).toBe(2);
    await expect(row).toContainText("Updating usage…");
    await expect(row).toContainText("1.5 KiB");
    release!();
    await expect(row).toContainText(
      outcome === "forbidden"
        ? "Usage listing not permitted"
        : outcome === "missing"
          ? "Bucket no longer exists"
          : outcome === "limited"
            ? "Scan limit reached"
            : "Update failed",
    );
    if (outcome === "forbidden" || outcome === "missing") {
      await expect(row).not.toContainText("1.5 KiB");
      await expect(row).toContainText("—");
    } else {
      await expect(row).toContainText("1.5 KiB");
      await expect(row).not.toContainText("3.0 KiB");
    }
  });
}

test("malformed saved observations are unknown instead of crashing exact sorting", async () => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/v1/bucket-usage/*", (route) =>
    route.fulfill({
      json: {
        enabled: true,
        poll_after_ms: 250,
        coverage: { observer_alive: true, connected: true, reconciled: true },
        buckets: [
          {
            bucket: "fixture-bucket",
            state: "complete",
            versions_visible: true,
            last_good: {
              ...snapshot,
              totals: { ...snapshot.totals, current_bytes: "1.5e3" },
            },
          },
        ],
      },
    }),
  );
  await page.goto(base);
  const row = page.getByRole("region", { name: "fixture-bucket" });
  await expect(row).toContainText("Updated");
  await expect(row).toContainText("—");
  await expect(row).not.toContainText("Retained");
  expect(errors).toEqual([]);
});

test("a temporarily unavailable bucket keeps the current totals already shown", async () => {
  let unavailable = false;
  await page.route("**/api/v1/bucket-usage/*", (route) => {
    if (route.request().url().endsWith("/refresh")) unavailable = true;
    return route.fulfill({
      json: {
        enabled: true,
        poll_after_ms: 250,
        coverage: { observer_alive: true, connected: true, reconciled: true },
        buckets: [
          unavailable
            ? {
                bucket: "fixture-bucket",
                state: "unavailable",
                versions_visible: false,
                message: "Usage checks timed out.",
              }
            : {
                bucket: "fixture-bucket",
                state: "complete",
                versions_visible: true,
                last_good: snapshot,
                last_completed_at: snapshot.updated_at,
              },
        ],
      },
    });
  });
  await page.goto(base);
  const row = page.getByRole("region", { name: "fixture-bucket" });
  await expect(row).toContainText("Retained: 512 B");
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(row).toContainText("Usage temporarily unavailable");
  await expect(row).toContainText("1.5 KiB");
  // Retained data needs a current version-list authorization.
  await expect(row).not.toContainText("Retained");
});

test("a bucket-list change during Refresh still requests the refresh", async () => {
  const refreshed: string[][] = [];
  await page.route("**/api/v1/bucket-usage/*", async (route) => {
    const buckets: string[] = route.request().postDataJSON().buckets;
    if (route.request().url().endsWith("/refresh")) {
      refreshed.push(buckets);
      // Hold the first refresh so the list change aborts it in flight.
      if (refreshed.length === 1)
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    await route
      .fulfill({
        json: {
          enabled: true,
          poll_after_ms: 250,
          buckets: buckets.map((bucket) => ({
            bucket,
            state: "queued",
            versions_visible: true,
          })),
        },
      })
      .catch(() => {});
  });
  await page.goto(base);
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect.poll(() => refreshed.length).toBe(1);
  await page.getByRole("button", { name: "Add bucket" }).click();
  await expect
    .poll(() => refreshed)
    .toEqual([["fixture-bucket"], ["fixture-bucket", "other-bucket"]]);
  await expect(
    page.getByRole("region", { name: "other-bucket" }),
  ).toContainText("Update queued");
});

test("a list change during a foreground Refresh restarts it instead of leaving rows running", async () => {
  const scanned: string[] = [];
  await page.route("**/api/v1/bucket-usage/*", (route) =>
    route.fulfill({
      json: { enabled: false, poll_after_ms: 250, buckets: [] },
    }),
  );
  await page.route("**/api/v1/buckets/*/prefix-usage*", async (route) => {
    const bucket = new URL(route.request().url()).pathname.split("/")[4];
    scanned.push(bucket);
    if (scanned.length === 1)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    await route
      .fulfill({
        contentType: "application/x-ndjson",
        body:
          JSON.stringify({
            ...snapshot,
            bucket,
            prefix: "",
            mode: "versions",
            status: "complete",
            folders: [],
          }) + "\n",
      })
      .catch(() => {});
  });
  await page.goto(base);
  await expect(page.getByRole("status")).toContainText(
    "Automatic updates are not configured",
  );
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect.poll(() => scanned.length).toBe(1);
  await page.getByRole("button", { name: "Add bucket" }).click();
  for (const name of ["fixture-bucket", "other-bucket"]) {
    const row = page.getByRole("region", { name });
    await expect(row).toContainText("Updated");
    await expect(row).toContainText("1.5 KiB");
  }
  expect([...scanned].sort()).toEqual([
    "fixture-bucket",
    "fixture-bucket",
    "other-bucket",
  ]);
});
