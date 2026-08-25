// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import { retainRestartRequirement } from "../src/utils/restartRequirement";

test("a hot-applied change does not clear an earlier restart requirement", () => {
  expect(retainRestartRequirement(false, false)).toBe(false);
  expect(retainRestartRequirement(false, true)).toBe(true);
  expect(retainRestartRequirement(true, false)).toBe(true);
  expect(retainRestartRequirement(true, true)).toBe(true);
});
