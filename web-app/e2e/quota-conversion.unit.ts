// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, test } from "@playwright/test";
import {
  getQuotaBytes,
  isValidQuota,
} from "../src/screens/Console/Buckets/ListBuckets/AddBucket/addBucketValidation";

for (const [size, unit, exact] of [
  ["9007199254740991", "B", "9007199254740991"],
  ["7.99", "Pi", "8995940255672565"],
  [".5", "Gi", "536870912"],
  ["1.01", "Mi", "1059061"],
]) {
  test(`quota ${size} ${unit} keeps exact bytes on the JSON wire`, () => {
    expect(isValidQuota(size, unit)).toBe(true);
    expect(JSON.stringify({ amount: getQuotaBytes(size, unit) })).toBe(
      `{"amount":${exact}}`,
    );
  });
}

for (const [size, unit] of [
  ["9007199254740992", "B"],
  ["9007199254740993", "B"],
  ["9223372036854775807", "B"],
  ["7", "Ei"],
  ["1", "unknown"],
  ["1e3", "Gi"],
  ["0.5", "B"],
]) {
  test(`quota ${size} ${unit} cannot produce a supported write`, () => {
    expect(isValidQuota(size, unit)).toBe(false);
  });
}
