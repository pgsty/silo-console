// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  canDisplayObjectVersions,
  exactObjectVersions,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/ObjectDetails/objectVersions";

test.describe("object version eligibility", () => {
  test("filters prefix matches down to the exact object", () => {
    expect(
      exactObjectVersions(
        [
          { name: "a.txt", version_id: "null" },
          { name: "a.txt.bak", version_id: "other" },
          { name: "a.txt", version_id: "v1" },
        ],
        "a.txt",
      ),
    ).toEqual([
      { name: "a.txt", version_id: "null" },
      { name: "a.txt", version_id: "v1" },
    ]);
  });

  test("shows null versions in enabled or suspended buckets", () => {
    for (const versioningStatus of ["Enabled", "Suspended"]) {
      expect(
        canDisplayObjectVersions({
          currentVersionID: "null",
          distributedSetup: true,
          exactVersionCount: 1,
          versioningStatus,
        }),
      ).toBe(true);
    }
  });

  test("shows retained history after versioning is disabled", () => {
    expect(
      canDisplayObjectVersions({
        currentVersionID: "null",
        distributedSetup: true,
        exactVersionCount: 2,
        versioningStatus: "Disabled",
      }),
    ).toBe(true);
  });

  test("hides meaningless never-versioned and non-distributed views", () => {
    expect(
      canDisplayObjectVersions({
        currentVersionID: "null",
        distributedSetup: true,
        exactVersionCount: 1,
        versioningStatus: "Disabled",
      }),
    ).toBe(false);
    expect(
      canDisplayObjectVersions({
        currentVersionID: "v1",
        distributedSetup: false,
        exactVersionCount: 2,
        versioningStatus: "Enabled",
      }),
    ).toBe(false);
  });
});
