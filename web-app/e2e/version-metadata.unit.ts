// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// Release metadata lives in three files that must agree: the frontend package
// version, the generated version module the License page renders, and the
// newest CHANGELOG section. On ordinary changes the CHANGELOG head is
// "Unreleased"; at release time (RELEASE_METADATA_MUST_BE_FINAL=1, set by the
// tag workflow) it must be the release heading.

const webApp = fileURLToPath(new URL("..", import.meta.url));
const repo = join(webApp, "..");

const packageVersion = (): string =>
  JSON.parse(readFileSync(join(webApp, "package.json"), "utf8")).version;

const generatedVersion = (): string => {
  const source = readFileSync(join(webApp, "src", "version.tsx"), "utf8");
  const match = source.match(/export const version = "([^"]+)";/);
  if (!match) {
    throw new Error("src/version.tsx does not export a version literal");
  }
  return match[1];
};

const changelogHead = (): string => {
  const changelog = readFileSync(join(repo, "CHANGELOG.md"), "utf8");
  const match = changelog.match(/^## (.+)$/m);
  if (!match) {
    throw new Error("CHANGELOG.md has no section heading");
  }
  return match[1].trim();
};

test.describe("release version metadata", () => {
  test("package.json and the generated version module agree", () => {
    expect(generatedVersion()).toBe(packageVersion());
  });

  test("the version is a plain semantic version without a v prefix", () => {
    expect(packageVersion()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test("the newest CHANGELOG section is Unreleased or this exact release", () => {
    const head = changelogHead();
    const mustBeFinal = process.env.RELEASE_METADATA_MUST_BE_FINAL === "1";
    if (mustBeFinal) {
      expect(head, "release metadata must be final at tag time").toBe(
        `Release v${packageVersion()}`,
      );
      return;
    }
    expect([`Unreleased`, `Release v${packageVersion()}`]).toContain(head);
  });
});
