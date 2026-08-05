// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Pure i18n primitives. This module must stay free of store/react imports:
// systemSlice initializes its state from here, so importing the store back
// would create a circular dependency.

import { zh } from "./zh";
import { zhHelp } from "./zhHelp";
import { zhScreens } from "./zhScreens";

export type Lang = "en" | "zh";

export const DEFAULT_LANG: Lang = "en";

const LANGUAGE_STORAGE_KEY = "language";

// Default is always English by design — no browser-language detection.
export const getStoredLanguage = (): Lang =>
  localStorage.getItem(LANGUAGE_STORAGE_KEY) === "zh" ? "zh" : DEFAULT_LANG;

export const storeLanguage = (lang: Lang) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
};

// Precedence on duplicate keys: curated chrome (zh) > feature screens
// (zhScreens) > help topics (zhHelp).
const dictionaries: Record<Lang, Record<string, string> | null> = {
  en: null,
  zh: { ...zhHelp, ...zhScreens, ...zh },
};

// Escape hatch for the rare case where one English string needs two different
// translations: call t("Word@context") and add that exact key to the
// dictionary. The suffix is stripped before falling back, so English UI never
// shows it. Only bare lowercase suffixes are treated as context markers —
// emails and the like are left untouched.
const CONTEXT_SUFFIX = /@[a-z]+$/;

export const translate = (lang: Lang, text: string): string => {
  const dictionary = dictionaries[lang];
  if (dictionary) {
    const hit = dictionary[text];
    if (hit !== undefined) {
      return hit;
    }
  }
  return text.includes("@") ? text.replace(CONTEXT_SUFFIX, "") : text;
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
