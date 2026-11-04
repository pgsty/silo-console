// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, test } from "@playwright/test";
import {
  formatUsageBytes,
  parsePrefixUsageFrame,
  readPrefixUsageStream,
} from "../src/screens/Console/ObjectBrowser/prefixUsage";
import type { PrefixUsageFrame } from "../src/api/consoleApi";
const identity = { bucket: "test", prefix: "", mode: "current" as const };
const frame = (
  status: PrefixUsageFrame["status"] = "complete",
): PrefixUsageFrame => ({
  ...identity,
  status,
  started_at: "2026-10-26T00:00:00Z",
  updated_at: "2026-10-26T00:00:01Z",
  scanned_entries: 1,
  totals: {
    current_bytes: "9007199254740993",
    current_objects: 1,
    retained_bytes: "0",
    retained_versions: 0,
    delete_markers: 0,
  },
  folders: [
    {
      prefix: "数据/",
      usage: {
        current_bytes: "9007199254740993",
        current_objects: 1,
        retained_bytes: "0",
        retained_versions: 0,
        delete_markers: 0,
      },
    },
  ],
});
const response = (parts: Uint8Array[]) =>
  new Response(
    new ReadableStream({
      start(controller) {
        for (const part of parts) controller.enqueue(part);
        controller.close();
      },
    }),
    { headers: { "Content-Type": "application/x-ndjson" } },
  );
const encode = (value: unknown) =>
  new TextEncoder().encode(JSON.stringify(value) + "\n");

test("preserves exact bytes and validates scoped folder totals", () => {
  expect(parsePrefixUsageFrame(frame(), identity).totals.current_bytes).toBe(
    "9007199254740993",
  );
  expect(formatUsageBytes("0")).toBe("0 B");
  expect(formatUsageBytes("1536")).toBe("1.5 KiB");
  expect(formatUsageBytes("9007199254740993")).toBe("8.0 PiB");
});
test("reads split UTF-8 and NDJSON frames incrementally", async () => {
  const bytes = encode(frame());
  const chunks = Array.from(bytes, (_, i) => bytes.slice(i, i + 1));
  const received: PrefixUsageFrame[] = [];
  await readPrefixUsageStream(
    response([encode(frame("scanning")), ...chunks]),
    identity,
    (f) => received.push(f),
  );
  expect(received.map((f) => f.status)).toEqual(["scanning", "complete"]);
  expect(received[1].folders[0].prefix).toBe("数据/");
});
test("truncated streams retain partial progress and cannot become complete", async () => {
  const received: PrefixUsageFrame[] = [];
  await expect(
    readPrefixUsageStream(
      response([encode(frame("scanning"))]),
      identity,
      (f) => received.push(f),
    ),
  ).rejects.toThrow("interrupted");
  expect(received.map((f) => f.status)).toEqual(["scanning"]);
});
test("limited and failed results are valid terminal partial results", async () => {
  for (const status of ["limited", "failed"] as const) {
    const received: PrefixUsageFrame[] = [];
    await readPrefixUsageStream(
      response([encode(frame(status))]),
      identity,
      (f) => received.push(f),
    );
    expect(received[0].status).toBe(status);
  }
});
test("rejects account/path mixups, invalid counts and misleading child totals", () => {
  const cases: unknown[] = [
    { ...frame(), bucket: "other" },
    { ...frame(), prefix: "other/" },
    { ...frame(), mode: "versions" },
    { ...frame(), scanned_entries: 2 },
    {
      ...frame(),
      totals: { ...frame().totals, current_bytes: 9007199254740993 },
    },
    { ...frame(), folders: [...frame().folders, ...frame().folders] },
    {
      ...frame(),
      folders: [{ ...frame().folders[0], prefix: "nested/deep/" }],
    },
    {
      ...frame(),
      folders: [
        {
          ...frame().folders[0],
          usage: { ...frame().totals, current_bytes: "9007199254740994" },
        },
      ],
    },
    { ...frame(), updated_at: "invalid" },
  ];
  for (const value of cases)
    expect(() => parsePrefixUsageFrame(value, identity)).toThrow("Invalid");
});
test("rejects malformed, regressing, and post-terminal data", async () => {
  const regressed = {
    ...frame(),
    totals: { ...frame().totals, current_bytes: "0" },
    folders: [],
  };
  for (const parts of [
    [new TextEncoder().encode("not-json\n")],
    [encode(frame("scanning")), encode(regressed)],
    [encode(frame()), encode(frame())],
  ]) {
    await expect(
      readPrefixUsageStream(response(parts), identity, () => {}),
    ).rejects.toThrow();
  }
});
test("rejects non-streaming gateway responses", async () => {
  await expect(
    readPrefixUsageStream(
      new Response("<html>login</html>"),
      identity,
      () => {},
    ),
  ).rejects.toThrow("unavailable");
});

test("sorts folders by calculated bytes without rounding or changing row metadata", async () => {
  const { visiblePageObjects } =
    await import("../src/screens/Console/ObjectBrowser/objectPaging");
  const rows = [
    { name: "a/", size: 0, last_modified: "" },
    { name: "b/", size: 0, last_modified: "" },
    { name: "file", size: 9, last_modified: "" },
  ];
  const sizes = new Map([
    ["a/", "9007199254740993"],
    ["b/", "9007199254740992"],
  ]);
  expect(
    visiblePageObjects(rows, "", "size", "DESC", sizes).map((r) => r.name),
  ).toEqual(["a/", "b/", "file"]);
  expect(rows[0].size).toBe(0);
});
