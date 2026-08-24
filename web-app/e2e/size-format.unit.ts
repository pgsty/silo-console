// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import { niceBytes, niceBytesInt } from "../src/common/utils";

test("zero-byte objects are displayed as 0 B", () => {
  expect(niceBytes("0")).toBe("0 B");
  expect(niceBytesInt(0)).toBe("0 B");
});
