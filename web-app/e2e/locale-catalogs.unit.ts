// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
import { test, expect } from "@playwright/test";
import { LOCALES } from "../src/i18n/locales";
import { readCatalogs, validateCatalogs } from "../hack/i18n-catalogs.mjs";

test("all registered catalogs have valid partitions, placeholders and plural forms", () => {
  expect(validateCatalogs(readCatalogs(), LOCALES)).toEqual([]);
});
test("missing maintained copy is allowed, malformed translations are not", () => {
  const registry = {
    en: { tag: "en", dir: "ltr", tier: "source" },
    zh: { tag: "zh-CN", dir: "ltr", tier: "core" },
    ar: { tag: "ar", dir: "rtl", tier: "maintained" },
  };
  const zh = {
    chrome: { Login: "登录" },
    help: {},
    screens: { "{count} items": "{count} 项" },
  };
  const ar = { chrome: {}, help: {}, screens: {} };
  expect(validateCatalogs({ zh, ar }, registry)).toEqual([]);
  expect(
    validateCatalogs(
      {
        zh,
        ar: {
          ...ar,
          chrome: { Login: "", Unknown: "غير معروف" },
          screens: { "{count} items": { one: "عنصر", other: "{count} عنصر" } },
        },
      },
      registry,
    ),
  ).toEqual(
    expect.arrayContaining([
      expect.stringContaining("unknown key or wrong partition"),
      expect.stringContaining("empty or invalid translation"),
      expect.stringContaining("placeholder mismatch"),
      expect.stringContaining("missing plural form two"),
      expect.stringContaining("missing plural form few"),
    ]),
  );
});
