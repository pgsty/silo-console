// Copyright (c) 2026 PGSTY
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures/bucketConfigFixture";

test.describe.configure({ mode: "default" });

async function mount(
  page: Page,
  config: { validity?: number; unit?: string; mode?: string } = {},
) {
  const writes: unknown[] = [];
  await page.route("**/api/v1/**", (route) => {
    const request = route.request();
    if (request.method() !== "GET") {
      writes.push({
        method: request.method(),
        path: new URL(request.url()).pathname,
        body: request.postDataJSON(),
      });
    }
    return route.fulfill({
      json: request.method() === "GET" ? config : {},
    });
  });
  await page.goto("http://bucket-config.test/?retention");
  await expect(page.locator("#retention_validity")).toBeVisible();
  return writes;
}

for (const value of ["", "0", "-1", "1.5", "2147483648"]) {
  test(`retention rejects ${JSON.stringify(value)} even on direct submit`, async ({
    configPage: page,
  }) => {
    const writes = await mount(page, { validity: 30 });
    await page.locator("#retention_validity").fill(value);
    await expect(page.locator("#set")).toBeDisabled();
    await page.locator("form").dispatchEvent("submit");
    await expect(page.getByTestId("closed")).toHaveText("false");
    expect(writes).toEqual([]);
  });
}

for (const [validity, unit] of [
  [1, "days"],
  [30, "days"],
  [36500, "days"],
  [100, "years"],
  [2147483647, "days"],
] as const) {
  test(`retention keeps ${validity} ${unit} and the selected mode`, async ({
    configPage: page,
  }) => {
    const writes = await mount(page, {
      validity: 2,
      unit,
      mode: "governance",
    });
    await page.locator("#retention_validity").fill(String(validity));
    await page.locator("#set").click();
    await expect(page.getByTestId("closed")).toHaveText("true");
    expect(writes).toEqual([
      {
        method: "PUT",
        path: "/api/v1/buckets/test-bucket/retention",
        body: { mode: "governance", unit, validity },
      },
    ]);
  });
}

test("a missing default retention still starts at one day", async ({
  configPage: page,
}) => {
  const writes = await mount(page);
  await expect(page.locator("#retention_validity")).toHaveValue("1");
  await page.locator("#set").click();
  await expect(page.getByTestId("closed")).toHaveText("true");
  expect(writes).toEqual([
    {
      method: "PUT",
      path: "/api/v1/buckets/test-bucket/retention",
      body: { mode: "compliance", unit: "days", validity: 1 },
    },
  ]);
});

test("a loaded zero is invalid rather than silently replaced with one", async ({
  configPage: page,
}) => {
  const writes = await mount(page, { validity: 0 });
  await expect(page.locator("#retention_validity")).toHaveValue("0");
  await expect(page.locator("#set")).toBeDisabled();
  await page.locator("form").dispatchEvent("submit");
  expect(writes).toEqual([]);
});
