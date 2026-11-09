// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
import { test, expect } from "@playwright/test";
import { LOCALES } from "../src/i18n/locales";
import { readCatalogs, validateCatalogs } from "../hack/i18n-catalogs.mjs";

test("all registered catalogs have valid partitions, placeholders and plural forms", () => {
  const catalogs = readCatalogs();
  expect(validateCatalogs(catalogs, LOCALES)).toEqual([]);
  const anomalies: string[] = [];
  for (const [lang, parts] of Object.entries(catalogs)) {
    for (const [part, dict] of Object.entries(
      parts as Record<string, Record<string, unknown>>,
    )) {
      for (const [key, value] of Object.entries(dict)) {
        const forms =
          typeof value === "string"
            ? [value]
            : Object.values(value as Record<string, string>);
        for (const text of forms) {
          if (text.includes("\n") && !key.includes("\n"))
            anomalies.push(`${lang}/${part}: unexpected newline in ${key}`);
          if (text.includes("\u200b"))
            anomalies.push(`${lang}/${part}: zero-width space in ${key}`);
        }
      }
    }
  }
  expect(anomalies).toEqual([]);
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
