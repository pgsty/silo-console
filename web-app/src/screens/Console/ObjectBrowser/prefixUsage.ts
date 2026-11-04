// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { PrefixUsageFrame, PrefixUsageStats } from "api/consoleApi";

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const count = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const bytes = (value: unknown): value is string =>
  typeof value === "string" &&
  /^(0|[1-9][0-9]{0,19})$/.test(value) &&
  BigInt(value) <= 18446744073709551615n;
const stats = (value: unknown): value is PrefixUsageStats =>
  record(value) &&
  bytes(value.current_bytes) &&
  bytes(value.retained_bytes) &&
  count(value.current_objects) &&
  count(value.retained_versions) &&
  count(value.delete_markers);
const entries = (value: PrefixUsageStats) =>
  value.current_objects + value.retained_versions + value.delete_markers;

type Identity = Pick<PrefixUsageFrame, "bucket" | "prefix" | "mode">;

export function parsePrefixUsageFrame(
  value: unknown,
  identity: Identity,
): PrefixUsageFrame {
  if (
    !record(value) ||
    value.bucket !== identity.bucket ||
    value.prefix !== identity.prefix ||
    value.mode !== identity.mode ||
    !["scanning", "complete", "limited", "failed"].includes(
      String(value.status),
    ) ||
    typeof value.started_at !== "string" ||
    !Number.isFinite(Date.parse(value.started_at)) ||
    typeof value.updated_at !== "string" ||
    !Number.isFinite(Date.parse(value.updated_at)) ||
    !count(value.scanned_entries) ||
    !stats(value.totals) ||
    entries(value.totals) !== value.scanned_entries ||
    !Array.isArray(value.folders) ||
    value.folders.length > 10000
  ) {
    throw new Error("Invalid folder usage response.");
  }
  const seen = new Set<string>();
  let childBytes = 0n,
    childRetainedBytes = 0n,
    childEntries = 0;
  for (const folder of value.folders) {
    if (
      !record(folder) ||
      typeof folder.prefix !== "string" ||
      !folder.prefix.startsWith(identity.prefix) ||
      !folder.prefix.endsWith("/") ||
      folder.prefix === identity.prefix ||
      folder.prefix.slice(identity.prefix.length, -1).includes("/") ||
      seen.has(folder.prefix) ||
      !stats(folder.usage)
    ) {
      throw new Error("Invalid folder usage response.");
    }
    seen.add(folder.prefix);
    childBytes += BigInt(folder.usage.current_bytes);
    childRetainedBytes += BigInt(folder.usage.retained_bytes);
    childEntries += entries(folder.usage);
  }
  if (
    childBytes > BigInt(value.totals.current_bytes) ||
    childRetainedBytes > BigInt(value.totals.retained_bytes) ||
    childEntries > value.scanned_entries
  ) {
    throw new Error("Invalid folder usage response.");
  }
  return value as unknown as PrefixUsageFrame;
}

// A missing terminal frame is a failed scan, never a complete or zero total.
// Bound each NDJSON record rather than buffering an entire recursive listing.
export async function readPrefixUsageStream(
  response: Response,
  identity: Identity,
  onFrame: (frame: PrefixUsageFrame) => void,
): Promise<void> {
  if (
    !response.ok ||
    !response.body ||
    !response.headers.get("Content-Type")?.startsWith("application/x-ndjson")
  ) {
    throw new Error("Folder usage is unavailable.");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let buffer = "",
    terminal = false,
    previous: PrefixUsageFrame | undefined;
  const accept = (line: string) => {
    if (terminal || line.length > 16 * 1024 * 1024)
      throw new Error("Invalid folder usage response.");
    const frame = parsePrefixUsageFrame(JSON.parse(line), identity);
    if (
      previous &&
      (frame.started_at !== previous.started_at ||
        frame.scanned_entries < previous.scanned_entries ||
        BigInt(frame.totals.current_bytes) <
          BigInt(previous.totals.current_bytes) ||
        BigInt(frame.totals.retained_bytes) <
          BigInt(previous.totals.retained_bytes))
    ) {
      throw new Error("Invalid folder usage response.");
    }
    previous = frame;
    terminal = frame.status !== "scanning";
    onFrame(frame);
  };
  try {
    for (;;) {
      const { done, value } = await reader.read();
      buffer += done
        ? decoder.decode()
        : decoder.decode(value, { stream: true });
      let newline: number;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        if (line.trim()) accept(line);
      }
      if (buffer.length > 16 * 1024 * 1024)
        throw new Error("Invalid folder usage response.");
      if (done) break;
    }
    if (buffer.trim()) accept(buffer);
    if (!terminal)
      throw new Error("Folder usage was interrupted. Totals are partial.");
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

// Integer arithmetic preserves exact byte strings, including values above 2^53.
export function formatUsageBytes(decimal: string): string {
  const value = BigInt(decimal);
  const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB"];
  let unit = 0,
    divisor = 1n;
  while (value >= divisor * 1024n && unit < units.length - 1) {
    divisor *= 1024n;
    unit++;
  }
  const tenths = (value * 10n) / divisor;
  return `${tenths / 10n}${unit ? `.${tenths % 10n}` : ""} ${units[unit]}`;
}
