// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  multipartUploadAdvisorySize,
  shouldRecommendMultipartUpload,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/ListObjects/uploadAdvisory";

test("recommends multipart only above the single-request advisory size", () => {
  expect(shouldRecommendMultipartUpload([])).toBe(false);
  expect(
    shouldRecommendMultipartUpload([{ size: multipartUploadAdvisorySize }]),
  ).toBe(false);
  expect(
    shouldRecommendMultipartUpload([
      { size: 1 },
      { size: multipartUploadAdvisorySize + 1 },
    ]),
  ).toBe(true);
});
