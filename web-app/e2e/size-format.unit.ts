// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import { niceBytes, niceBytesInt } from "../src/common/utils";

test("zero-byte objects are displayed as 0 B", () => {
  for (const value of ["0", "0.0", "0e9"]) {
    expect(niceBytes(value)).toBe("0 B");
    expect(niceBytes(value, true)).toBe("0 B");
  }
  expect(niceBytesInt(0)).toBe("0 B");
});

test("byte strings consume the whole decimal or exponent value", () => {
  for (const [input, expected] of [
    ["1.5", "1.5 B"],
    ["5e-7", "0.0 B"],
    ["1.073741824e+9", "1.0 GiB"],
    ["1e+21", "867.4 EiB"],
    [" 1024 ", "1.0 KiB"],
  ]) {
    expect(niceBytes(input)).toBe(expected);
  }
});

test("numeric chart ticks remain valid formatter inputs", () => {
  for (const [value, expected] of [
    [0, "0 B"],
    [0.5, "0.5 B"],
    [1024, "1.0 KiB"],
    [1024 ** 3, "1.0 GiB"],
    [1e21, "867.4 EiB"],
    [NaN, "N/A"],
    [Infinity, "N/A"],
  ] as const) {
    expect(niceBytes(value)).toBe(expected);
  }
});

test("invalid and nonfinite byte values are unavailable rather than zero", () => {
  for (const input of [
    "",
    " ",
    "NaN",
    "Infinity",
    "+Inf",
    "-Infinity",
    "1e309",
    "1024bytes",
    "invalid",
  ]) {
    expect(niceBytes(input)).toBe("N/A");
    expect(niceBytes(input, true)).toBe("N/A");
  }
  for (const value of [NaN, Infinity, -Infinity]) {
    expect(niceBytesInt(value)).toBe("N/A");
    expect(niceBytesInt(value, true)).toBe("N/A");
  }
});

test("ordinary sizes retain binary units and one decimal place", () => {
  for (const [bytes, iec, k8s] of [
    [1, "1.0 B", "1.0 B"],
    [1023, "1023.0 B", "1023.0 B"],
    [1024, "1.0 KiB", "1.0 Ki"],
    [1536, "1.5 KiB", "1.5 Ki"],
    [1024 ** 3, "1.0 GiB", "1.0 Gi"],
    [1024 ** 6, "1.0 EiB", "1.0 Ei"],
  ] as const) {
    expect(niceBytes(String(bytes))).toBe(iec);
    expect(niceBytesInt(bytes)).toBe(iec);
    expect(niceBytes(String(bytes), true)).toBe(k8s);
    expect(niceBytesInt(bytes, true)).toBe(k8s);
  }
});

test("values beyond the unit tables keep the largest available unit", () => {
  expect(niceBytesInt(1024 ** 9)).toBe("1024.0 YiB");
  expect(niceBytesInt(1024 ** 7, true)).toBe("1024.0 Ei");
  expect(niceBytesInt(Number.MAX_VALUE)).toMatch(/ YiB$/);
  expect(niceBytesInt(Number.MAX_VALUE, true)).toMatch(/ Ei$/);
});
