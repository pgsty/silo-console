// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, test } from "@playwright/test";
import * as Minio from "minio";
import { SERVER_ENDPOINT } from "./consts";

test("normal sharing remains available in the list, details and versions", async ({
  page,
}, testInfo) => {
  test.setTimeout(90_000);
  const accessKey = process.env.SILO_SHARE_TEST_ACCESS_KEY || "minioadmin";
  const secretKey = process.env.SILO_SHARE_TEST_SECRET_KEY || "minioadmin";
  const client = new Minio.Client({
    endPoint: "127.0.0.1",
    port: Number(process.env.SILO_TEST_PORT || 9000),
    useSSL: false,
    accessKey,
    secretKey,
  });
  const bucket = `share-ui-${Date.now()}`;
  const versions: string[] = [];
  await client.makeBucket(bucket, "us-east-1");
  try {
    await client.setBucketVersioning(bucket, { Status: "Enabled" });
    for (const body of ["first version", "second version"]) {
      const result = await client.putObject(
        bucket,
        "hello.txt",
        Buffer.from(body),
      );
      versions.push(result.versionId!);
    }
    await page.goto(`${SERVER_ENDPOINT}/browser/${bucket}`);
    await page.getByPlaceholder("Username").fill(accessKey);
    await page.getByPlaceholder("Password").fill(secretKey);
    await page.getByRole("button", { name: "Login", exact: true }).click();
    const row = page
      .locator("#object-list-wrapper .ReactVirtualized__Table__row")
      .filter({ hasText: "hello.txt" });
    await expect(row).toBeVisible();
    const checkbox = page.locator('input[type="checkbox"][value="hello.txt"]');
    await page.locator("label").filter({ has: checkbox }).click();
    await expect(
      page.getByRole("button", { name: "Share", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Download", exact: true }),
    ).toBeVisible();
    await row.click();
    const panel = page.locator("#details-panel");
    await expect(panel.locator(".objectNameContainer")).toHaveText("hello.txt");
    await expect(
      panel.getByRole("button", { name: "Share", exact: true }),
    ).toBeVisible();
    await panel.getByRole("button", { name: "Share", exact: true }).click();
    await expect(page.locator("#copy-share-url")).toBeEnabled();
    await page.reload();
    await expect(panel.locator(".objectNameContainer")).toHaveText("hello.txt");
    await panel
      .getByRole("button", { name: "Display Object Versions", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Download this version", exact: true }),
    ).toHaveCount(2);
    await expect(
      page.getByRole("button", { name: "Share this version", exact: true }),
    ).toHaveCount(2);
    await page.screenshot({
      path: testInfo.outputPath("sharing.png"),
    });
  } finally {
    for (const versionId of versions) {
      await client.removeObject(bucket, "hello.txt", { versionId });
    }
    await client.removeBucket(bucket);
  }
});
