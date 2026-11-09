// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Embedded Console is commonly served over plain HTTP (http://<ip>:9001), where
// browsers omit secure-context APIs. A call to one of them throws before the
// surrounding request starts, so features silently do nothing.

import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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
