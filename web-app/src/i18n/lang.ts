// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Pure i18n primitives. This module must stay free of store/react imports:
// systemSlice initializes its state from here, so importing the store back
// would create a circular dependency.

import {
  CATALOGS,
  DEFAULT_LANG,
  isLanguage,
  Lang,
  localeSpec,
  localeTag,
} from "./locales";
export {
  DEFAULT_LANG,
  isLanguage,
  languages,
  LOCALES,
  localeSpec,
  localeTag,
} from "./locales";
export type { Lang } from "./locales";
export type { Dictionary, PluralForms } from "./catalog";

export const i18nKey = <T extends string>(key: T): T => key;
const LANGUAGE_STORAGE_KEY = "language";
export const getStoredLanguage = (): Lang => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    // Accept the unpublished PR's old preference for people who tested it.
    const value = stored === "pt" ? "pt-BR" : stored;
    return isLanguage(value) ? value : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
};
export const storeLanguage = (language: Lang) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    /* Session-only preference. */
  }
};
const translation = (language: Lang, key: string) => {
  const dictionary = CATALOGS[language];
  return Object.prototype.hasOwnProperty.call(dictionary, key)
    ? dictionary[key]
    : undefined;
};

// Keep placeholder matching shared by plain-text and React-node formatting.
// Values are inserted by a callback so replacement metacharacters such as
// "$&" stay literal, and the single pass does not rescan braces in values.
export const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;

export const formatText = (
  template: string,
  variables: Readonly<Record<string, unknown>>,
): string =>
  template.replace(PLACEHOLDER_PATTERN, (placeholder, name: string) =>
    Object.prototype.hasOwnProperty.call(variables, name)
      ? String(variables[name])
      : placeholder,
  );

// A miss returns the input unchanged, unconditionally — t() also receives
// live data (user agents, RSS titles, object names), so no suffix stripping
// or other rewriting is allowed here. The own-property check keeps inherited
// Object.prototype members ("constructor", "toString", …) from leaking out
// of the dictionary for hostile inputs.
export const translate = (lang: Lang, text: string): string => {
  const value = translation(lang, text);
  return typeof value === "string" ? value : (value?.other ?? text);
};

// Chart legends arrive as "Prefix [server:drive]" strings — the prefix comes
// from a Go-side legendFormat template and the bracket suffix from label
// substitution. Translate only the static prefix so instance suffixes (and
// the data-layer matching that relies on raw legends) stay untouched.
const LEGEND_SUFFIX = /^(.*?)( \[[^\]]*\])$/;

export const translateLegend = (lang: Lang, text: string): string => {
  const match = LEGEND_SUFFIX.exec(text);
  if (match) {
    return translate(lang, match[1]) + match[2];
  }
  return translate(lang, text);
};

// Site link localization rules (confirmed against the live sites):
// - silo.pgsty.com serves Chinese under a /zh path prefix.
// - The Pigsty site is a domain pair with no prefix: pigsty.io (EN) and
//   pigsty.cc (ZH).
// Anything else (GitHub, min.io, AWS, YouTube, …) has no Chinese mirror and is
// returned untouched, as are relative or malformed URLs.
export const localizeUrl = (url: string, lang: Lang): string => {
  if (localeSpec(lang).siteLang !== "zh") {
    return url;
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return url;
    }
    if (parsed.hostname === "pigsty.io") {
      parsed.hostname = "pigsty.cc";
      return parsed.toString();
    }
    if (
      parsed.hostname === "silo.pgsty.com" ||
      parsed.hostname === "pgsty.com"
    ) {
      if (parsed.pathname === "/zh" || parsed.pathname.startsWith("/zh/")) {
        return url;
      }
      parsed.pathname =
        parsed.pathname === "/" ? "/zh/" : `/zh${parsed.pathname}`;
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
};

// Store multi-form entries under the English plural key. If no translation is
// available, select the ENGLISH form using English rules, not the user's rules.
export const translatePlural = (
  language: Lang,
  count: number,
  one: string,
  other: string,
  variables: Readonly<Record<string, unknown>> = {},
): string => {
  const category = new Intl.PluralRules(localeTag(language)).select(count);
  const value = translation(language, other);
  const fallback =
    new Intl.PluralRules("en").select(count) === "one" ? one : other;
  let template = fallback;
  if (typeof value === "object") template = value[category] ?? value.other;
  else if (typeof value === "string")
    template = category === "one" ? translate(language, one) : value;
  return formatText(template, {
    count: new Intl.NumberFormat(localeTag(language)).format(count),
    ...variables,
  });
};
