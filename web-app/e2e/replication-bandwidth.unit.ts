// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures/bucketConfigFixture";

async function mount(page: Page, scenario: string) {
  const requests: Record<string, unknown>[] = [];
  await page.route("**/api/v1/**", async (route) => {
    if (route.request().url().endsWith("/buckets-replication")) {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ json: { replicationState: [] } });
    } else {
      await route.fulfill({ json: { buckets: [] } });
    }
  });
  await page.goto(
    `http://bucket-config.test/?replication=${scenario}&bucketName=test-bucket`,
  );
  await page.locator("#accessKey").fill("test-access");
  await page.locator("#secretKey").fill("test-secret");
  await page.locator("#targetURL").fill("target.example");
  if (scenario !== "bulk")
    await page.locator("#targetBucket").fill("target-bucket");
  return requests;
}

async function selectUnit(page: Page, unit: string) {
  await page.locator("#quota_unit-button").click();
  await page.getByRole("option", { name: unit, exact: true }).click();
}

async function submit(page: Page, scenario: string) {
  if (scenario === "bulk") {
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.locator("#assign-bucket-0").fill("target-bucket");
    await page.getByRole("button", { name: "Create", exact: true }).click();
  } else {
    await page.getByRole("button", { name: "Save", exact: true }).click();
  }
}

for (const scenario of ["page", "modal", "bulk"]) {
  test(`${scenario} rejects malformed, negative and unsafe bandwidth without submission`, async ({
    configPage: page,
  }) => {
    const requests = await mount(page, scenario);
    const action = page.getByRole("button", {
      name: scenario === "bulk" ? "Next" : "Save",
      exact: true,
    });
    for (const [value, unit] of [
      ["", "Gi"],
      ["-1", "Gi"],
      ["1e3", "Gi"],
      ["1.234", "Gi"],
      ["1000", "Ei"],
      ["8", "Pi"],
    ]) {
      await page.locator("#bandwidth_scalar").fill(value);
      await selectUnit(page, unit);
      await expect(action).toBeDisabled();
      if (scenario !== "bulk")
        await page.locator("form").dispatchEvent("submit");
      await expect(
        page.getByText(
          "Enter a non-negative bandwidth below 8 PiB/s, with at most two decimals (0 means unlimited).",
          { exact: true },
        ),
      ).toBeVisible();
      expect(requests).toEqual([]);
    }
    // Changing only the unit must recover the form without resetting the scalar.
    await selectUnit(page, "Mi");
    await expect(action).toBeEnabled();
    await submit(page, scenario);
    await expect.poll(() => requests.length).toBe(1);
    expect(requests[0].bandwidth).toBe(8388608);
  });

  for (const [scalar, bytes] of [
    [".5", 536870912],
    ["0", 0],
  ] as const) {
    test(`${scenario} submits ${scalar} Gi without changing its meaning`, async ({
      configPage: page,
    }) => {
      const requests = await mount(page, scenario);
      await page.locator("#bandwidth_scalar").fill(scalar);
      await submit(page, scenario);
      await expect.poll(() => requests.length).toBe(1);
      expect(requests[0]).toMatchObject({
        bandwidth: bytes,
        syncMode: "async",
        bucketsRelation: [
          { originBucket: "test-bucket", destinationBucket: "target-bucket" },
        ],
      });
    });
  }

  test(`${scenario} synchronous mode ignores an invalid hidden bandwidth`, async ({
    configPage: page,
  }) => {
    const requests = await mount(page, scenario);
    await page.locator("#bandwidth_scalar").fill("bad");
    await page
      .getByRole("button", {
        name: "Replication Mode Asynchronous",
        exact: true,
      })
      .click();
    await page
      .getByRole("option", { name: "Synchronous", exact: true })
      .click();
    await submit(page, scenario);
    await expect.poll(() => requests.length).toBe(1);
    expect(requests[0]).toMatchObject({ bandwidth: 0, syncMode: "sync" });
  });
}
