// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import type { CDPSession, Page } from "@playwright/test";
import { unzipSync } from "fflate";
import * as Minio from "minio";
import { minioadminFile, SERVER_ENDPOINT } from "./consts";
import { expect, generateUUID, test } from "./fixtures/baseFixture";

test.describe.configure({ mode: "serial" });
test.use({ storageState: minioadminFile });
test.setTimeout(60_000);

const bucketName = `download-progress-${generateUUID()}`;
const folderObject = "folder/data.bin";
const folderZeroObject = "folder/zero-byte";
const knownObject = "known.bin";
const zeroObject = "zero-byte";
const objectNames = [folderObject, folderZeroObject, knownObject, zeroObject];

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin",
});

const visitBucket = async (page: Page) => {
  await page.goto(`${SERVER_ENDPOINT}/browser/${bucketName}`);
  await page.locator('input[value="folder/"]').waitFor({ state: "attached" });
};

const selectObject = async (page: Page, objectName: string) => {
  const checkbox = page.locator(
    `input[type="checkbox"][value="${objectName}"]`,
  );
  await checkbox.waitFor({ state: "attached" });
  await page.locator("label").filter({ has: checkbox }).click();
};

const startDownload = async (page: Page, objectName: string) => {
  await selectObject(page, objectName);
  await page.getByRole("button", { name: "Download", exact: true }).click();
  await page.locator("#object-manager-toggle").waitFor({ state: "visible" });
};

const openObjectManager = async (page: Page) => {
  await page.locator("#object-manager-toggle").click();
  await expect(
    page.getByText("Downloads / Uploads", { exact: true }),
  ).toBeVisible();
};

const emulateDownloadRate = async (page: Page, bytesPerSecond: number) => {
  const session = await page.context().newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 30,
    downloadThroughput: bytesPerSecond,
    uploadThroughput: 10 * 1024 * 1024,
    connectionType: "wifi",
  });
  return session;
};

const restoreNetwork = async (session: CDPSession) => {
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
    connectionType: "none",
  });
  await session.send("Network.disable");
};

test.beforeAll(async () => {
  await minioClient.makeBucket(bucketName, "us-east-1");
  const payload = randomBytes(512 * 1024);
  await minioClient.putObject(bucketName, folderObject, payload);
  await minioClient.putObject(bucketName, folderZeroObject, Buffer.alloc(0));
  await minioClient.putObject(bucketName, knownObject, payload);
  await minioClient.putObject(bucketName, zeroObject, Buffer.alloc(0));
});

test.afterAll(async () => {
  await minioClient.removeObjects(bucketName, objectNames).catch(() => {});
  await minioClient.removeBucket(bucketName).catch(() => {});
});

test("folder download stays indeterminate and can be cancelled", async ({
  page,
}) => {
  const session = await emulateDownloadRate(page, 64 * 1024);
  try {
    await visitBucket(page);
    await startDownload(page, "folder/");
    await openObjectManager(page);
    await expect(
      page.getByText("folder/", { exact: true }).last(),
    ).toBeVisible();
    await page.waitForTimeout(500);

    await expect(page.locator(".progressPercentage")).toHaveCount(0);
    await expect(page.getByText(/(?:NaN|Infinity)%/)).toHaveCount(0);

    await page.locator(".closeButton").click({ force: true });
    await expect(page.getByText("Cancelled", { exact: true })).toBeVisible();
    await expect(page.getByText(/Unexpected response/)).toHaveCount(0);
  } finally {
    await restoreNetwork(session);
  }
});

test("folder download completes with a valid ZIP", async ({ page }) => {
  await visitBucket(page);
  const downloadPromise = page.waitForEvent("download");
  await startDownload(page, "folder/");
  const download = await downloadPromise;

  try {
    expect(download.suggestedFilename()).toBe("folder.zip");
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    const archive = unzipSync(new Uint8Array(await readFile(downloadPath!)));
    expect(Object.keys(archive)).toEqual(
      expect.arrayContaining([folderObject, folderZeroObject]),
    );
    expect(archive[folderZeroObject]).toHaveLength(0);

    await openObjectManager(page);
    await expect(page.locator(".progressPercentage")).toHaveText("100%");
  } finally {
    await download.delete();
  }
});

test("known-size download remains determinate", async ({ page }) => {
  const session = await emulateDownloadRate(page, 128 * 1024);
  const downloadPromise = page.waitForEvent("download");
  try {
    await visitBucket(page);
    await startDownload(page, knownObject);
    await openObjectManager(page);

    await expect(page.locator(".progressPercentage")).toBeVisible();
    await expect(page.locator(".progressPercentage")).toHaveText(/^\d+%$/);
    await expect(page.getByText(/(?:NaN|Infinity)%/)).toHaveCount(0);

    const download = await downloadPromise;
    await expect(page.locator(".progressPercentage")).toHaveText("100%");
    await download.delete();
  } finally {
    await restoreNetwork(session);
  }
});

test("zero-byte download completes without invalid progress", async ({
  page,
}) => {
  await visitBucket(page);
  const downloadPromise = page.waitForEvent("download");
  await startDownload(page, zeroObject);
  const download = await downloadPromise;
  await openObjectManager(page);

  try {
    await expect(page.getByText(/(?:NaN|Infinity)%/)).toHaveCount(0);
    await expect(page.locator(".progressPercentage")).toHaveText("100%");
  } finally {
    await download.delete();
  }
});
