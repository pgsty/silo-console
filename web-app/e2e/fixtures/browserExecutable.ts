// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Locates the Chromium the unit-project browser harnesses launch: the
// configured Playwright executable when it is installed, otherwise the newest
// headless shell in the Playwright browser cache.

import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const findBrowserExecutable = (directory: string, depth = 0): string | null => {
  if (!existsSync(directory) || depth > 5) {
    return null;
  }

  const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    b.name.localeCompare(a.name),
  );
  for (const entry of entries) {
    const candidate = join(directory, entry.name);
    if (
      entry.isFile() &&
      (entry.name === "chrome-headless-shell" ||
        entry.name === "chrome-headless-shell.exe")
    ) {
      return candidate;
    }
    if (entry.isDirectory()) {
      const nested = findBrowserExecutable(candidate, depth + 1);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
};

export const browserExecutable = (): string => {
  const configured = chromium.executablePath();
  if (existsSync(configured)) {
    return configured;
  }

  const cacheRoots =
    process.platform === "darwin"
      ? [join(homedir(), "Library", "Caches", "ms-playwright")]
      : [join(homedir(), ".cache", "ms-playwright")];
  for (const root of cacheRoots) {
    const executable = findBrowserExecutable(root);
    if (executable) {
      return executable;
    }
  }

  throw new Error("No Playwright Chromium executable is installed");
};
