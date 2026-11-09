// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Embedded Console is commonly served over plain HTTP (http://<ip>:9001), where
// browsers omit secure-context APIs. A call to one of them throws before the
// surrounding request starts, so features silently do nothing. The share-link
// expiry must also survive browsers whose locale formats digits natively.

import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Settings } from "luxon";
import { shareExpiryTimestamp } from "../src/screens/Console/Common/FormComponents/DaysSelector/shareExpiry";

const roots = ["../src/", "../packages/mds/src/"].map((relative) =>
  fileURLToPath(new URL(relative, import.meta.url)),
);
const sources = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sources(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });

test("source avoids APIs that plain-HTTP pages do not expose", () => {
  const offenders = roots
    .flatMap(sources)
    .filter((path) =>
      /crypto\.randomUUID|crypto\.subtle|navigator\.clipboard/.test(
        readFileSync(path, "utf8"),
      ),
    );
  expect(offenders).toEqual([]);
});

test("share expiry stays parseable under native-digit locales", () => {
  const previous = Settings.defaultLocale;
  try {
    for (const locale of ["en-US", "ar", "ar-EG", "ar-SA", "fa", "zh-CN"]) {
      Settings.defaultLocale = locale;
      const value = shareExpiryTimestamp("2026-11-16T10:20:30.456+08:00");
      expect(value, locale).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/);
      expect(Number.isNaN(new Date(`${value}`).getTime()), locale).toBe(false);
    }
  } finally {
    Settings.defaultLocale = previous;
  }
});
