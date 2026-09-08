// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, test } from "@playwright/test";
import { watchURL } from "../src/screens/Console/Watch/watchURL";
import { getStoredSidebarOpen } from "../src/utils/sidebarState";
import { inspectDownload } from "../src/screens/Console/Tools/inspectDownload";
import { hasCreateBucketPermission } from "../src/common/SecureComponent/createBucketPermission";

test("Watch filters survive encoding, subpaths and IPv6", () => {
  for (const base of [
    "http://localhost:9090/",
    "https://console.example/console/",
    "https://[::1]/silo/",
  ]) {
    for (const prefix of [
      "a+b",
      "foo#bar",
      "x&suffix=injected",
      "中文 /?%2F",
    ]) {
      const url = new URL(watchURL(base, "bucket", prefix, "+#&.txt"));
      expect(url.searchParams.get("prefix")).toBe(prefix);
      expect(url.searchParams.get("suffix")).toBe("+#&.txt");
      expect([...url.searchParams.keys()]).toEqual(["prefix", "suffix"]);
      expect(url.hash).toBe("");
      expect(url.pathname).toBe(new URL(base).pathname + "ws/watch/bucket");
      expect(url.host).toBe(new URL(base).host);
      expect(url.protocol).toBe(base.startsWith("https:") ? "wss:" : "ws:");
    }
  }
  expect(
    new URL(watchURL("http://[::1]:5005/app/", "bucket", "", "", true)).host,
  ).toBe("[::1]:9090");
});

test("Invalid sidebar preferences recover without discarding valid choices", () => {
  for (const stored of [
    null,
    "{",
    "null",
    "[]",
    "false",
    "1",
    "{}",
    '{"open":"false"}',
    '{"open":null}',
  ]) {
    expect(getStoredSidebarOpen(() => stored)).toBe(true);
  }
  expect(getStoredSidebarOpen(() => '{"open":false}')).toBe(false);
  expect(getStoredSidebarOpen(() => '{"open":true}')).toBe(true);
  expect(
    getStoredSidebarOpen(() => {
      throw new Error("storage unavailable");
    }),
  ).toBe(true);
});

test("Create bucket capability preserves constrained and wildcard action grants", () => {
  for (const permissions of [
    undefined,
    {},
    { "console-ui": ["admin:CreateUser"] },
    { "arn:aws:s3:::*": ["s3:GetObject", "s3:ListBucket"] },
  ]) {
    expect(hasCreateBucketPermission(permissions)).toBe(false);
  }
  for (const action of [
    "s3:*",
    "s3:CreateBucket",
    "s3:Create*",
    "s3:*Bucket",
  ]) {
    expect(hasCreateBucketPermission({ "arn:aws:s3:::team-*": [action] })).toBe(
      true,
    );
  }
});

test("Inspect errors are read once and retain useful server details", async () => {
  for (const body of [
    '{"message":"Access Denied","detailedMessage":"Missing permission"}',
    "<html>proxy error</html>",
    "null",
  ]) {
    const response = new Response(body, { status: 403 });
    let blobCalled = false;
    response.blob = async () => {
      blobCalled = true;
      throw new Error("should not download an error");
    };
    await expect(
      inspectDownload("/inspect", "Inspect failed", async () => response),
    ).rejects.toMatchObject({
      errorMessage: body.startsWith("{") ? "Access Denied" : "Inspect failed",
      detailedError: body.startsWith("{") ? "Missing permission" : "HTTP 403",
    });
    expect(blobCalled).toBe(false);
    expect(response.bodyUsed).toBe(true);
  }
});

test("Inspect downloads tolerate missing headers and network failure", async () => {
  for (const disposition of [
    null,
    'attachment; filename="inspect.abc.zip"',
    "attachment; filename=bad%",
  ]) {
    const response = new Response("zip data", {
      headers: disposition ? { "content-disposition": disposition } : {},
    });
    const result = await inspectDownload(
      "/inspect",
      "Inspect failed",
      async () => response,
    );
    expect(await result.blob.text()).toBe("zip data");
    expect(result.filename).toBe(
      disposition?.includes('"') ? "inspect.abc.zip" : "inspect.zip",
    );
  }
  await expect(
    inspectDownload("/inspect", "Inspect failed", async () => {
      throw new TypeError("Failed to fetch");
    }),
  ).rejects.toEqual({
    errorMessage: "Inspect failed",
    detailedError: "Failed to fetch",
  });
});
