// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Live-stack regression for issue #16: object-scoped requests must not act on
// the wrong object. Runs against the CI Console + SILO stack like the other
// specs; the deterministic ordering rules live in the Node unit tests.

import type { Page, Request, Route } from "@playwright/test";
import * as Minio from "minio";
import { minioadminFile, SERVER_ENDPOINT } from "./consts";
import { expect, generateUUID, test } from "./fixtures/baseFixture";

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);

const bucketName = `stale-object-${generateUUID()}`;
// A and B are read-only fixtures shared by every test; the tests that mutate
// state (restore, delete) each own a dedicated object so the suite does not
// depend on its execution order.
const objectA = "alpha.txt";
const objectB = "beta.txt";
const restoreObject = "gamma.txt";
const deleteVersionObject = "delta.txt";
const deleteCurrentObject = "epsilon.txt";

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin",
});

// Version ids as reported by the server when the fixtures were written.
const versionIds: Record<string, string[]> = {
  [objectA]: [],
  [objectB]: [],
  [restoreObject]: [],
  [deleteVersionObject]: [],
  [deleteCurrentObject]: [],
};

const putVersion = async (name: string, body: string) => {
  const result = await minioClient.putObject(
    bucketName,
    name,
    Buffer.from(body),
  );
  versionIds[name].push(result.versionId || "null");
};

interface ListedVersion {
  name?: string;
  versionId?: string;
}

const listAllVersions = () =>
  new Promise<ListedVersion[]>((resolve, reject) => {
    const items: ListedVersion[] = [];
    minioClient
      .listObjects(bucketName, "", true, { IncludeVersion: true })
      .on("data", (item: ListedVersion) => items.push(item))
      .on("error", reject)
      .on("end", () => resolve(items));
  });

test.beforeAll(async () => {
  await minioClient.makeBucket(bucketName, "us-east-1");
  await minioClient.setBucketVersioning(bucketName, { Status: "Enabled" });
  await putVersion(objectA, "alpha version one");
  await putVersion(objectA, "alpha version two");
  await putVersion(objectB, "beta version one");
  await putVersion(objectB, "beta version two");
  await putVersion(restoreObject, "gamma version one");
  await putVersion(restoreObject, "gamma version two");
  await putVersion(deleteVersionObject, "delta version one");
  await putVersion(deleteVersionObject, "delta version two");
  await putVersion(deleteCurrentObject, "epsilon version one");
});

test.afterAll(async () => {
  const versions = await listAllVersions().catch(() => []);
  await minioClient
    .removeObjects(
      bucketName,
      versions.map((item) => ({
        name: item.name || "",
        versionId: item.versionId,
      })),
    )
    .catch(() => {});
  await minioClient.removeBucket(bucketName).catch(() => {});
});

const browserURL = `${SERVER_ENDPOINT}/browser/${bucketName}`;
const apiPrefix = `/api/v1/buckets/${bucketName}/objects`;

const isListing = (request: Request, name: string): boolean => {
  const url = new URL(request.url());
  return (
    url.pathname.endsWith(apiPrefix) &&
    url.searchParams.get("prefix") === name &&
    url.searchParams.get("with_versions") === "true"
  );
};

const objectRow = (page: Page, name: string) =>
  page
    .locator("#object-list-wrapper .ReactVirtualized__Table__row")
    .filter({ hasText: name });

const detailsPanel = (page: Page) => page.locator("#details-panel");

const panelName = (page: Page) =>
  detailsPanel(page).locator(".objectNameContainer");

const openObject = async (page: Page, name: string) => {
  await objectRow(page, name).click();
};

const visitBucket = async (page: Page) => {
  await page.goto(browserURL);
  await expect(objectRow(page, objectA)).toBeVisible();
  await expect(objectRow(page, objectB)).toBeVisible();
};

const versionRows = (page: Page) => page.locator(".ctrItem");

test.describe("authenticated object browser", () => {
  test.use({ storageState: minioadminFile });

  test("a late listing for A cannot replace B's details or actions", async ({
    page,
  }) => {
    await visitBucket(page);

    // Hold every versions listing for A until B has been displayed.
    const held: Route[] = [];
    await page.route(
      (url) =>
        url.pathname.endsWith(apiPrefix) &&
        url.searchParams.get("prefix") === objectA &&
        url.searchParams.get("with_versions") === "true",
      (route) => {
        held.push(route);
      },
    );

    const listingA = page.waitForRequest((request) =>
      isListing(request, objectA),
    );
    await openObject(page, objectA);
    await listingA;
    await openObject(page, objectB);
    await expect(panelName(page)).toHaveText(objectB);

    // Release A late: the panel and its actions must stay on B.
    await page.unroute(
      (url) =>
        url.pathname.endsWith(apiPrefix) &&
        url.searchParams.get("prefix") === objectA &&
        url.searchParams.get("with_versions") === "true",
    );
    for (const route of held) {
      // The client aborted this request when the route changed; continuing an
      // aborted route is a no-op we accept explicitly.
      await route.continue().catch(() => {});
    }
    await page.waitForTimeout(500);
    await expect(panelName(page)).toHaveText(objectB);
    await expect(page).toHaveURL(new RegExp(`/${objectB}$`));

    const shareRequest = page.waitForRequest((request) =>
      new URL(request.url()).pathname.endsWith(`${apiPrefix}/share`),
    );
    await detailsPanel(page)
      .getByRole("button", { name: "Share", exact: true })
      .click();
    const share = new URL((await shareRequest).url());
    expect(share.searchParams.get("prefix")).toBe(objectB);
    expect(share.searchParams.get("version_id")).toBe(versionIds[objectB][1]);
    await expect(page.locator("#copy-share-url")).toBeVisible();
  });

  test("a version transition shows the selected version and its metadata, never the previous one", async ({
    page,
  }) => {
    await visitBucket(page);
    await openObject(page, objectA);
    await expect(panelName(page)).toHaveText(objectA);
    await expect(detailsPanel(page).getByText("Content-Type")).toBeVisible();

    await detailsPanel(page)
      .getByRole("button", { name: "Display Object Versions", exact: true })
      .click();
    await expect(versionRows(page)).toHaveCount(2);

    const [olderVersion, currentVersion] = versionIds[objectA];
    // Hold the metadata request for the older version.
    const heldMetadata: Route[] = [];
    await page.route(
      (url) =>
        url.pathname.endsWith(`${apiPrefix}/metadata`) &&
        url.searchParams.get("versionID") === olderVersion,
      (route) => {
        heldMetadata.push(route);
      },
    );

    // Rows are sorted newest first: the second row is the older version.
    await versionRows(page).nth(1).click();

    // Base details switch immediately to the selected version...
    await expect(detailsPanel(page).getByText(olderVersion)).toBeVisible();
    await expect(detailsPanel(page).getByText(currentVersion)).toHaveCount(0);
    await expect(
      detailsPanel(page).getByRole("button", {
        name: "Delete version",
        exact: true,
      }),
    ).toBeVisible();
    // ...while metadata-dependent content stays absent until its request settles.
    await expect(detailsPanel(page).getByText("Content-Type")).toHaveCount(0);

    await page.unroute(
      (url) =>
        url.pathname.endsWith(`${apiPrefix}/metadata`) &&
        url.searchParams.get("versionID") === olderVersion,
    );
    for (const route of heldMetadata) {
      await route.continue().catch(() => {});
    }
    await expect(detailsPanel(page).getByText("Content-Type")).toBeVisible();
  });

  test("restore acts on the clicked row's version", async ({ page }) => {
    await visitBucket(page);
    await openObject(page, restoreObject);
    await expect(panelName(page)).toHaveText(restoreObject);
    await detailsPanel(page)
      .getByRole("button", { name: "Display Object Versions", exact: true })
      .click();
    await expect(versionRows(page)).toHaveCount(2);

    const [olderVersion] = versionIds[restoreObject];
    // Button ids repeat per row; scope to the older row.
    await versionRows(page).nth(1).locator("#version-action-restore-3").click();
    const restoreRequest = page.waitForRequest(
      (request) =>
        request.method() === "PUT" &&
        new URL(request.url()).pathname.endsWith(`${apiPrefix}/restore`),
    );
    await page.locator("#confirm-ok").click();
    const restore = new URL((await restoreRequest).url());
    expect(restore.searchParams.get("prefix")).toBe(restoreObject);
    expect(restore.searchParams.get("version_id")).toBe(olderVersion);
  });

  test("deleting an explicitly selected version names that version only", async ({
    page,
  }) => {
    await visitBucket(page);
    await openObject(page, deleteVersionObject);
    await expect(panelName(page)).toHaveText(deleteVersionObject);
    await detailsPanel(page)
      .getByRole("button", { name: "Display Object Versions", exact: true })
      .click();
    await expect(versionRows(page)).toHaveCount(2);

    const [olderVersion] = versionIds[deleteVersionObject];
    await versionRows(page).nth(1).click();
    await expect(
      detailsPanel(page).getByRole("button", {
        name: "Delete version",
        exact: true,
      }),
    ).toBeVisible();
    await detailsPanel(page).locator("#delete-element-click").click();
    const deleteRequest = page.waitForRequest(
      (request) =>
        request.method() === "DELETE" &&
        new URL(request.url()).pathname.endsWith(apiPrefix),
    );
    await page.locator("#confirm-ok").click();
    const deleted = new URL((await deleteRequest).url());
    expect(deleted.searchParams.get("prefix")).toBe(deleteVersionObject);
    expect(deleted.searchParams.get("version_id")).toBe(olderVersion);
  });

  test("deleting the current object sends no version id", async ({ page }) => {
    await visitBucket(page);
    await openObject(page, deleteCurrentObject);
    await expect(panelName(page)).toHaveText(deleteCurrentObject);
    await detailsPanel(page).locator("#delete-element-click").click();
    const deleteRequest = page.waitForRequest(
      (request) =>
        request.method() === "DELETE" &&
        new URL(request.url()).pathname.endsWith(apiPrefix),
    );
    await page.locator("#confirm-ok").click();
    const deleted = new URL((await deleteRequest).url());
    expect(deleted.searchParams.get("prefix")).toBe(deleteCurrentObject);
    expect(deleted.searchParams.has("version_id")).toBe(false);
  });

  test("history navigation never shows an actionable panel for another route", async ({
    page,
  }) => {
    await visitBucket(page);
    await openObject(page, objectA);
    await expect(panelName(page)).toHaveText(objectA);
    await visitBucket(page);
    await openObject(page, objectA);
    await expect(panelName(page)).toHaveText(objectA);

    await page.goBack();
    // Sample the panel while the route settles: whatever is shown must belong
    // to the current URL.
    for (let i = 0; i < 20; i++) {
      const url = new URL(page.url());
      const names = await panelName(page).allTextContents();
      for (const name of names) {
        if (name.trim() !== "") {
          expect(decodeURIComponent(url.pathname)).toContain(name.trim());
        }
      }
      await page.waitForTimeout(50);
    }
    await page.goForward();
    await expect(page).toHaveURL(new RegExp(`/${objectA}$`));
    await expect(panelName(page)).toHaveText(objectA);
  });
});

test.describe("anonymous object browser", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeAll(async () => {
    await minioClient.setBucketPolicy(
      bucketName,
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetBucketLocation", "s3:ListBucket"],
            Resource: [`arn:aws:s3:::${bucketName}`],
          },
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      }),
    );
  });

  test("public browsing lists the bucket and opens the clicked object", async ({
    page,
  }) => {
    await page.goto(browserURL);
    await expect(objectRow(page, objectA)).toBeVisible();

    const opened = Promise.race([
      page.waitForEvent("download").then(() => "download" as const),
      page
        .getByText("alpha version two", { exact: true })
        .waitFor({ state: "visible" })
        .then(() => "preview" as const),
    ]);
    await openObject(page, objectA);
    await expect(opened).resolves.toMatch(/download|preview/);
  });
});
