// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, test } from "@playwright/test";
import {
  getStoredLanguage,
  isLanguage,
  languages,
  localeTag,
  localizeUrl,
  translate,
  translatePlural,
} from "../src/i18n/lang";

test("English remains default; stored locales and their tags are validated", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  try {
    for (const value of [
      null,
      "unknown",
      "constructor",
      "__proto__",
      "ar",
      "zh",
      "pt",
      "pt-BR",
    ]) {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: { getItem: () => value },
      });
      expect(getStoredLanguage()).toBe(
        value === "pt" ? "pt-BR" : isLanguage(value) ? value : "en",
      );
    }
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete (globalThis as { localStorage?: unknown }).localStorage;
  }
  expect(languages).toHaveLength(10);
  for (const language of languages)
    expect(Intl.getCanonicalLocales(localeTag(language))).toHaveLength(1);
  expect(localizeUrl("https://silo.pgsty.com/docs/", "fr")).toBe(
    "https://silo.pgsty.com/docs/",
  );
  expect(localizeUrl("https://pgsty.com/", "zh")).toBe("https://pgsty.com/zh/");
  expect(localizeUrl("https://silo.pgsty.com/zh/docs/", "zh")).toBe(
    "https://silo.pgsty.com/zh/docs/",
  );
});

test("plural forms use locale rules and missing entries use English rules", () => {
  expect(translatePlural("ru", 21, "{count} node", "{count} nodes")).toBe(
    "21 узел",
  );
  expect(translatePlural("ru", 22, "{count} node", "{count} nodes")).toBe(
    "22 узла",
  );
  expect(translatePlural("ru", 25, "{count} node", "{count} nodes")).toBe(
    "25 узлов",
  );
  expect(translatePlural("ru", 21, "{count} missing", "{count} missings")).toBe(
    "21 missings",
  );
  expect(translate("ru", "constructor")).toBe("constructor");
  expect(translate("en", "server error: {raw}")).toBe("server error: {raw}");
});
