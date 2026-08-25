// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src", import.meta.url));

const sourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(entryPath);
    }
    return entry.name.endsWith(".tsx") ? [entryPath] : [];
  });

test("DataTable actions use the current isDisabled contract", () => {
  const violations = sourceFiles(sourceRoot)
    .filter((sourcePath) =>
      readFileSync(sourcePath, "utf8").includes("disableButtonFunction"),
    )
    .map((sourcePath) => path.relative(sourceRoot, sourcePath));

  expect(violations).toEqual([]);
});
