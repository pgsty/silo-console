// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Pure i18n primitives. This module must stay free of store/react imports:
// systemSlice initializes its state from here, so importing the store back
// would create a circular dependency.

import { pt } from "./pt";
import { ptHelp } from "./ptHelp";
import { zh } from "./zh";
import { zhHelp } from "./zhHelp";

export type Lang = "en" | "zh" | "pt";

// Mark an English literal that is translated later (menus, tabs, form metadata).
// Identity only: keep the raw key until the rendering component calls t().
export const i18nKey = <T extends string>(key: T): T => key;

export const DEFAULT_LANG: Lang = "en";

const LANGUAGE_CYCLE: Record<Lang, Lang> = { en: "zh", zh: "pt", pt: "en" };

export const nextLanguage = (lang: Lang): Lang => LANGUAGE_CYCLE[lang];

const isLang = (value: string | null): value is Lang =>
  value !== null && Object.hasOwn(LANGUAGE_CYCLE, value);

const LOCALE_TAGS: Record<Lang, string> = {
  en: "en",
  zh: "zh-CN",
  pt: "pt-BR",
};

export const localeTag = (lang: Lang): string => LOCALE_TAGS[lang];

const LANGUAGE_STORAGE_KEY = "language";

// Default is always English by design — no browser-language detection.
export const getStoredLanguage = (): Lang => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLang(stored) ? stored : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
};

export const storeLanguage = (lang: Lang) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // The current session still works when persistent storage is unavailable.
  }
};

// Precedence on duplicate keys: curated chrome (zh, pt) > feature screens
// (zhScreens, ptScreens) > help topics (zhHelp, ptHelp).
const dictionaries: Record<Lang, Record<string, string> | null> = {
  en: null,
  zh: { ...zhHelp, ...zh },
  pt: { ...ptHelp, ...pt },
};

// The lazy Console owns feature-screen copy. Register before rendering its
// first screen, keeping login/common copy synchronous and precedence intact.
export const registerScreenTranslations = (
  screens: Record<string, string>,
  lang: "zh" | "pt" = "zh",
) => {
  dictionaries[lang] =
    lang === "zh"
      ? { ...zhHelp, ...screens, ...zh }
      : { ...ptHelp, ...screens, ...pt };
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
  const dictionary = dictionaries[lang];
  if (dictionary && Object.prototype.hasOwnProperty.call(dictionary, text)) {
    return dictionary[text];
  }
  return text;
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
  if (lang !== "zh") {
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
    if (parsed.hostname === "silo.pgsty.com") {
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
