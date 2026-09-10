// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "@playwright/test";
import { isValidPathname } from "../src/utils/routePath";
import { getStoredSidebarOpen } from "../src/utils/sidebarState";
import { uiSourceViolations } from "../hack/ui-source-guard.mjs";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

for (const raw of [
  "{",
  "null",
  "false",
  "[]",
  '"open"',
  '{"open":"false"}',
  '{"open":0}',
]) {
  test(`invalid sidebar preference ${raw} falls back safely`, () => {
    expect(getStoredSidebarOpen(() => raw)).toBe(true);
  });
}
test("valid sidebar preference survives and inaccessible storage falls back", () => {
  expect(getStoredSidebarOpen(() => '{"open":false}')).toBe(false);
  expect(
    getStoredSidebarOpen(() => {
      throw new Error("blocked");
    }),
  ).toBe(true);
});
for (const value of [
  "/browser/b/%",
  "/browser/b/%FF",
  "/console/subpath/browser/b/%E0%A4%A",
]) {
  test(`reject malformed route ${value}`, () =>
    expect(isValidPathname(value)).toBe(false));
}
for (const value of [
  "/browser/b/中文",
  "/browser/b/%E4%B8%AD%E6%96%87",
  "/browser/b/%252F",
  "/console/subpath/browser/b/a%2Fb%25c",
]) {
  test(`accept encoded object route ${value}`, () =>
    expect(isValidPathname(value)).toBe(true));
}
test("UI literals and icon controls respect localization and accessible names", () => {
  expect(uiSourceViolations()).toEqual([]);
});
test("literal accessible labels fail the guard while localized labels and ID references pass", () => {
  const dir = mkdtempSync(join(tmpdir(), "console-ui-labels-"));
  try {
    writeFileSync(
      join(dir, "Example.tsx"),
      '<><button aria-label="delete-selected-users"/><button aria-label={"Delete"}/><button aria-label={t("Delete")}/><button aria-labelledby="existing-label"/></>',
    );
    expect(uiSourceViolations(dir)).toHaveLength(2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
