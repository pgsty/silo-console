// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { minioadminFile, SERVER_ENDPOINT } from "./consts";
import { expect, test } from "./fixtures/baseFixture";

test.use({ storageState: minioadminFile });

// The License page must report the Console version that is actually embedded
// in the running binary: the frontend package version, rendered as v<version>
// in the "this Console" row.
test("the License page reports the embedded Console version", async ({
  page,
}) => {
  const version = JSON.parse(
    readFileSync(
      join(fileURLToPath(new URL("..", import.meta.url)), "package.json"),
      "utf8",
    ),
  ).version as string;

  await page.goto(`${SERVER_ENDPOINT}/license`);
  const consoleRow = page.locator(".line", { hasText: "this Console" });
  await expect(consoleRow).toHaveCount(1);
  await expect(consoleRow.locator(".chip")).toHaveText(`v${version}`);
});
