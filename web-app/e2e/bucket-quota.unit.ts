// Copyright (c) 2026 PGSTY
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures/bucketConfigFixture";

test.describe.configure({ mode: "default" });

async function mount(page: Page, quota?: number, delay = 0) {
  const requests: unknown[] = [];
  await page.route("**/api/v1/**", async (route) => {
    requests.push({
      method: route.request().method(),
      path: new URL(route.request().url()).pathname,
      body: route.request().postDataJSON(),
    });
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    return route.fulfill({ json: {} });
  });
  await page.goto(
    `http://bucket-config.test/${quota === undefined ? "" : `?quota=${quota}`}`,
  );
  await expect(page.getByRole("dialog")).toBeVisible();
  return requests;
}

async function selectUnit(page: Page, unit: string) {
  await page.locator("#quota_unit-button").click();
  await page.getByRole("option", { name: unit, exact: true }).click();
  await expect(page.locator("#quota_unit-button")).toHaveText(unit);
}

for (const [bytes, size, unit] of [
  [1, "1", "B"],
  [1024, "1024", "B"],
  [1025, "1025", "B"],
  [1024 ** 2, "1", "Mi"],
  [1.25 * 1024 ** 3, "1.25", "Gi"],
  [110 * 1024 ** 3, "110", "Gi"],
  [1025 * 1024 ** 3, "1025", "Gi"],
  [1024 ** 5, "1", "Pi"],
  [Number.MAX_SAFE_INTEGER, "9007199254740991", "B"],
] as const) {
  test(`unchanged quota ${bytes} B keeps ${size} ${unit} without writing`, async ({
    configPage: page,
  }) => {
    const requests = await mount(page, bytes);
    await expect(page.locator("#quota_size")).toHaveValue(size);
    await expect(page.locator("#quota_unit-button")).toHaveText(unit);
    await page.locator("#save").click();
    await expect(page.getByTestId("closed")).toHaveText("true");
    expect(requests).toEqual([]);
  });
}

for (const [size, unit] of [
  ["", "Gi"],
  ["0", "Gi"],
  ["-1", "Gi"],
  ["1.234", "Gi"],
  ["8", "Pi"],
  ["8192", "Ti"],
  ["9007199254740992", "B"],
  ["9007199254740993", "B"],
  ["9223372036854775807", "B"],
  ["0.5", "B"],
] as const) {
  test(`enabled quota rejects ${JSON.stringify(size)} ${unit}`, async ({
    configPage: page,
  }) => {
    const requests = await mount(page, 1024 ** 3);
    await page.locator("#quota_size").fill(size);
    await selectUnit(page, unit);
    await expect(page.locator("#save")).toBeDisabled();
    // Exercise the submit handler even when its button is disabled.
    await page.locator("form").dispatchEvent("submit");
    await expect(page.getByTestId("closed")).toHaveText("false");
    expect(requests).toEqual([]);
  });
}

for (const [size, unit, amount] of [
  [".5", "Gi", 536870912],
  ["1.25", "Gi", 1342177280],
  ["1.01", "Mi", 1059061],
  ["1025", "B", 1025],
  ["1", "Pi", 1024 ** 5],
  ["9007199254740991", "B", 9007199254740991],
  ["7.99", "Pi", 8995940255672565],
] as const) {
  test(`enabled quota writes ${size} ${unit} as ${amount} bytes`, async ({
    configPage: page,
  }) => {
    const requests = await mount(page);
    await page.locator("#bucket_quota").check();
    await page.locator("#quota_size").fill(size);
    await selectUnit(page, unit);
    await page.locator("#save").click();
    await expect(page.getByTestId("closed")).toHaveText("true");
    expect(requests).toEqual([
      {
        method: "PUT",
        path: "/api/v1/buckets/test-bucket/quota",
        body: { enabled: true, amount, quota_type: "hard" },
      },
    ]);
  });
}

test("changing only the unit revalidates the quota", async ({
  configPage: page,
}) => {
  await mount(page, 1024 ** 3);
  await page.locator("#quota_size").fill("8");
  await expect(page.locator("#save")).toBeEnabled();
  await selectUnit(page, "Pi");
  await expect(page.locator("#save")).toBeDisabled();
  await selectUnit(page, "Gi");
  await expect(page.locator("#save")).toBeEnabled();
});

test("disabling quota clears it even with invalid size text", async ({
  configPage: page,
}) => {
  const requests = await mount(page, 1024 ** 3);
  await page.locator("#quota_size").fill("");
  await page.locator("#bucket_quota").uncheck();
  await page.locator("#save").click();
  await expect(page.getByTestId("closed")).toHaveText("true");
  expect(requests).toEqual([
    {
      method: "PUT",
      path: "/api/v1/buckets/test-bucket/quota",
      body: { enabled: false, amount: 0, quota_type: "hard" },
    },
  ]);
});

test("saving an already disabled quota does not write", async ({
  configPage: page,
}) => {
  const requests = await mount(page);
  await page.locator("#save").click();
  await expect(page.getByTestId("closed")).toHaveText("true");
  expect(requests).toEqual([]);
});

for (const bytes of [2 ** 53, 7 * 1024 ** 6, 2 ** 63]) {
  test(`an existing unsafe quota ${bytes} cannot be silently rewritten`, async ({
    configPage: page,
  }) => {
    const requests = await mount(page, bytes);
    await expect(page.locator("#quota_size")).toHaveValue("");
    await expect(page.locator("#save")).toBeDisabled();
    await expect(
      page.getByText(
        "The current quota is 8 PiB or larger, which the browser cannot edit exactly. Change it with mcli, enter a smaller quota, or disable it here.",
      ),
    ).toBeVisible();
    await page.locator("form").dispatchEvent("submit");
    expect(requests).toEqual([]);
    // Clearing remains available, and does not serialize the rounded old value.
    await page.locator("#bucket_quota").uncheck();
    await page.locator("#save").click();
    await expect(page.getByTestId("closed")).toHaveText("true");
    expect(requests).toEqual([
      {
        method: "PUT",
        path: "/api/v1/buckets/test-bucket/quota",
        body: { enabled: false, amount: 0, quota_type: "hard" },
      },
    ]);
  });
}

test("the unit menu offers no unit that can never be written", async ({
  configPage: page,
}) => {
  await mount(page, 1024 ** 3);
  await page.locator("#quota_unit-button").click();
  await expect(page.getByRole("option")).toHaveCount(5);
  for (const unit of ["B", "Mi", "Gi", "Ti", "Pi"])
    await expect(
      page.getByRole("option", { name: unit, exact: true }),
    ).toBeVisible();
  await expect(
    page.getByRole("option", { name: "Ei", exact: true }),
  ).toHaveCount(0);
});

test("repeated submits write the quota once", async ({ configPage: page }) => {
  const requests = await mount(page, undefined, 500);
  await page.locator("#bucket_quota").check();
  await page.locator("#quota_size").fill("2");
  await selectUnit(page, "Gi");
  const form = page.locator("form");
  await form.dispatchEvent("submit");
  await form.dispatchEvent("submit");
  await form.dispatchEvent("submit");
  await expect(page.locator("#save")).toBeDisabled();
  await expect(page.getByTestId("closed")).toHaveText("true");
  expect(requests).toEqual([
    {
      method: "PUT",
      path: "/api/v1/buckets/test-bucket/quota",
      body: { enabled: true, amount: 2 * 1024 ** 3, quota_type: "hard" },
    },
  ]);
});
