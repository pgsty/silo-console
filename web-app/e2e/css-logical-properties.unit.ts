// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// RTL support uses logical CSS properties. In styled-components template
// literals they must be hyphenated (inset-inline-end); a run-together name
// such as "insetinlineend" is an unknown property that browsers drop.

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

test("logical CSS properties in template literals are hyphenated", () => {
  const malformed =
    /\b(?:inset|margin|padding|border)(?:inline|block)(?:start|end)?\s*:/;
  const offenders = roots.flatMap(sources).flatMap((path) =>
    readFileSync(path, "utf8")
      .split("\n")
      .map((line, index) => [path, index + 1, line] as const)
      .filter(([, , line]) => malformed.test(line))
      .map(([path, line]) => `${path}:${line}`),
  );
  expect(offenders).toEqual([]);
});
