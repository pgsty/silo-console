// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later
import { test, expect, Page } from "@playwright/test";
import { randomUUID, randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { unzipSync } from "fflate";
import * as Minio from "minio";
import { minioadminFile, SERVER_ENDPOINT } from "./consts";

test.describe.configure({ mode: "serial" });
test.use({ storageState: minioadminFile });
const bucket = `multi-zip-${randomUUID()}`;
const client = new Minio.Client({
  endPoint: "localhost",
  port: Number(process.env.SILO_TEST_PORT || 9000),
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin",
});
const files = {
  "data.bin": randomBytes(256 * 1024),
  "zero.txt": Buffer.alloc(0),
  "nested/中文.txt": Buffer.from("nested content"),
};
const sizeAdvice =
  "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.";
test.beforeAll(async () => {
  await client.makeBucket(bucket);
  for (const [key, body] of Object.entries(files))
    await client.putObject(bucket, key, body);
});
test.afterAll(async () => {
  await client.removeObjects(bucket, Object.keys(files));
  await client.removeBucket(bucket);
});
async function select(page: Page, names: string[]) {
  await page.goto(`${SERVER_ENDPOINT}/browser/${bucket}`);
  for (const name of names) {
    const checkbox = page.locator(`input[type="checkbox"][value="${name}"]`);
    await checkbox.waitFor({ state: "attached" });
    await page.locator("label").filter({ has: checkbox }).click();
  }
}
async function picker(page: Page, delay = 0) {
  await page.addInitScript((delay) => {
    const state = {
      chunks: [] as number[][],
      closed: false,
      aborted: false,
      writes: 0,
      releaseWrite: undefined as (() => void) | undefined,
    };
    (window as any).__zipState = state;
    (window as any).showSaveFilePicker = async () => ({
      createWritable: async () =>
        new WritableStream({
          async write(chunk: Uint8Array) {
            state.writes++;
            if (delay === -1 && state.writes === 1) {
              await new Promise<void>((resolve) => {
                state.releaseWrite = resolve;
              });
            } else if (delay > 0) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
            state.chunks.push([...chunk]);
          },
          close() {
            state.closed = true;
          },
          abort() {
            state.aborted = true;
          },
        }),
    });
  }, delay);
}
async function openManager(page: Page) {
  await page.locator("#object-manager-toggle").click();
}

test("native multi-selection and recursive prefixes produce a real ZIP", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).showSaveFilePicker = undefined;
  });
  await select(page, ["data.bin", "nested/"]);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download", exact: true }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toMatch(/\.zip$/);
  const zipped = unzipSync(
    new Uint8Array(await readFile((await download.path())!)),
  );
  expect(Buffer.from(zipped["data.bin"])).toEqual(files["data.bin"]);
  expect(new TextDecoder().decode(zipped["nested/中文.txt"])).toBe(
    "nested content",
  );
  // A recursive prefix has an unknown total; native handoff must not replace
  // its advisory with the normal browser-manager toast.
  await expect(page.getByText(sizeAdvice, { exact: true })).toBeVisible();
  await openManager(page);
  await expect(
    page
      .getByText(
        "Track or cancel this download in your browser's download manager.",
        { exact: true },
      )
      .last(),
  ).toBeVisible();
  await download.delete();
});

test("large selection keeps its MCLI advisory while streaming", async ({
  page,
}) => {
  await picker(page);
  await page.routeWebSocket("**/ws/objectManager", (socket) => {
    const server = socket.connectToServer();
    server.onMessage((message) => {
      const json = JSON.parse(message.toString());
      // Test the size decision without uploading gigabytes of fixture data.
      for (const object of json.data || []) object.size = 6 * 1024 ** 3;
      socket.send(JSON.stringify(json));
    });
  });
  await select(page, ["data.bin", "zero.txt"]);
  await page.getByRole("button", { name: "Download", exact: true }).click();
  await expect(page.getByText(sizeAdvice, { exact: true })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as any).__zipState.closed))
    .toBe(true);
});

test("file writer streams multiple files and blocks duplicate clicks", async ({
  page,
}) => {
  await picker(page, 100);
  let requests = 0;
  page.on("request", (request) => {
    if (request.url().includes("/download-multiple")) requests++;
  });
  await select(page, ["data.bin", "zero.txt"]);
  await page.getByRole("button", { name: "Download", exact: true }).dblclick();
  await expect
    .poll(() => page.evaluate(() => (window as any).__zipState.closed))
    .toBe(true);
  expect(requests).toBe(1);
  const chunks = await page.evaluate(
    () => (window as any).__zipState.chunks as number[][],
  );
  const zipped = unzipSync(new Uint8Array(chunks.flat()));
  expect(Buffer.from(zipped["data.bin"])).toEqual(files["data.bin"]);
  expect(zipped["zero.txt"]).toHaveLength(0);
});

test("cancel aborts a running ZIP file writer", async ({ page }) => {
  await picker(page, -1);
  await select(page, ["data.bin", "nested/"]);
  await page.getByRole("button", { name: "Download", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__zipState.writes))
    .toBeGreaterThan(0);
  await openManager(page);
  await page
    .getByRole("button", { name: "Cancel transfer", exact: true })
    .click();
  await page.evaluate(() => (window as any).__zipState.releaseWrite());
  await expect
    .poll(() => page.evaluate(() => (window as any).__zipState.aborted))
    .toBe(true);
  expect(await page.evaluate(() => (window as any).__zipState.closed)).toBe(
    false,
  );
});

test("server failure aborts the selected file without a successful download", async ({
  page,
}) => {
  await picker(page);
  await page.route("**/objects/download-multiple", (route) =>
    route.fulfill({ status: 403, json: { message: "Access denied" } }),
  );
  await select(page, ["data.bin", "zero.txt"]);
  await page.getByRole("button", { name: "Download", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__zipState.aborted))
    .toBe(true);
  expect(await page.evaluate(() => (window as any).__zipState.closed)).toBe(
    false,
  );
  await openManager(page);
  await expect(
    page.getByText("Error: Unexpected response, download incomplete.", {
      exact: true,
    }),
  ).toBeVisible();
});
