// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "./fixtures/baseFixture";
import { minioadminFile, SERVER_ENDPOINT } from "./consts";

test.use({ storageState: minioadminFile });

for (const reason of ["failed", "timedout"] as const) {
  test(`a ${reason} background request preserves the authenticated session`, async ({
    page,
  }) => {
    await page.route("**/api/v1/admin/site-replication", (route) =>
      route.abort(reason),
    );
    const failed = page.waitForEvent("requestfailed", (request) =>
      request.url().endsWith("/api/v1/admin/site-replication"),
    );
    await page.goto(`${SERVER_ENDPOINT}/browser`);
    await failed;
    // Continue using the protected UI after the failed request has settled.
    await page.locator("#buckets").click();
    await expect(page).toHaveURL(`${SERVER_ENDPOINT}/buckets`);
    await expect(page.locator(".page-header-label")).toHaveText("Buckets");
  });
}

test("an explicit invalid-session response still returns to login", async ({
  page,
}) => {
  await page.route("**/api/v1/admin/site-replication", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "invalid session" }),
    }),
  );
  await page.goto(`${SERVER_ENDPOINT}/browser`);
  await expect(page).toHaveURL(`${SERVER_ENDPOINT}/login`);
  await expect(page.locator("#do-login")).toBeVisible();
});
