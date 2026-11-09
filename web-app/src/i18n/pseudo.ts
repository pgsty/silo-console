// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// Imported only in development; pseudo locales never enter the public registry.
import { CATALOGS } from "./locales";

const pseudoText = (text: string, rtl = false): string => {
  const accents: Record<string, string> = {
    a: "á",
    e: "ë",
    i: "ï",
    o: "ø",
    u: "ü",
    A: "Á",
    E: "Ë",
    I: "Ï",
    O: "Ø",
    U: "Ü",
  };
  const protectedParts = /(`[^`]+`|https?:\/\/[^\s]+|\{\w+\})/g;
  const expanded = text
    .split(protectedParts)
    .map((part, index) =>
      index % 2 ? part : part.replace(/[aeiouAEIOU]/g, (c) => accents[c]),
    )
    .join("");
  const padding = "·".repeat(
    Math.ceil(text.replace(protectedParts, "").length * 0.4),
  );
  return `⟦${rtl ? "\u2067" : ""}${expanded} ${padding}${rtl ? "\u2069" : ""}⟧`;
};

export function initializePseudoLocale(): boolean {
  const locale = new URLSearchParams(location.search).get("pseudo");
  if (locale !== "en-XA" && locale !== "ar-XB") return false;
  CATALOGS.en = Object.fromEntries(
    Object.keys(CATALOGS.zh).map((key) => [
      key,
      pseudoText(key, locale === "ar-XB"),
    ]),
  );
  document.documentElement.dataset.pseudoLocale = locale;
  return true;
}
