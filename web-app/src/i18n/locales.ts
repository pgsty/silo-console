// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Dictionary } from "./catalog";
import zh_chrome from "./locales/zh/chrome";
import zh_help from "./locales/zh/help";
import zh_screens from "./locales/zh/screens";
import fr_chrome from "./locales/fr/chrome";
import fr_help from "./locales/fr/help";
import fr_screens from "./locales/fr/screens";
import de_chrome from "./locales/de/chrome";
import de_help from "./locales/de/help";
import de_screens from "./locales/de/screens";
import ru_chrome from "./locales/ru/chrome";
import ru_help from "./locales/ru/help";
import ru_screens from "./locales/ru/screens";
import es_chrome from "./locales/es/chrome";
import es_help from "./locales/es/help";
import es_screens from "./locales/es/screens";
import pt_BR_chrome from "./locales/pt-BR/chrome";
import pt_BR_help from "./locales/pt-BR/help";
import pt_BR_screens from "./locales/pt-BR/screens";
import ja_chrome from "./locales/ja/chrome";
import ja_help from "./locales/ja/help";
import ja_screens from "./locales/ja/screens";
import ar_chrome from "./locales/ar/chrome";
import ar_help from "./locales/ar/help";
import ar_screens from "./locales/ar/screens";
import tr_chrome from "./locales/tr/chrome";
import tr_help from "./locales/tr/help";
import tr_screens from "./locales/tr/screens";

export interface LocaleSpec {
  label: string;
  tag: string;
  dir: "ltr" | "rtl";
  tier: "source" | "core" | "maintained";
  siteLang?: "zh";
  enabled?: boolean;
}

// The only registry of supported languages. Labels are language autonyms.
// English is the source and fallback; only Chinese is a release-gating catalog.
export const LOCALES = {
  en: { label: "English", tag: "en", dir: "ltr", tier: "source" },
  zh: {
    label: "简体中文",
    tag: "zh-CN",
    dir: "ltr",
    tier: "core",
    siteLang: "zh",
  },
  fr: { label: "Français", tag: "fr", dir: "ltr", tier: "maintained" },
  de: { label: "Deutsch", tag: "de", dir: "ltr", tier: "maintained" },
  ru: { label: "Русский", tag: "ru", dir: "ltr", tier: "maintained" },
  es: { label: "Español", tag: "es", dir: "ltr", tier: "maintained" },
  "pt-BR": {
    label: "Português (Brasil)",
    tag: "pt-BR",
    dir: "ltr",
    tier: "maintained",
  },
  ja: { label: "日本語", tag: "ja", dir: "ltr", tier: "maintained" },
  ar: { label: "العربية", tag: "ar", dir: "rtl", tier: "maintained" },
  tr: { label: "Türkçe", tag: "tr", dir: "ltr", tier: "maintained" },
} as const satisfies Record<string, LocaleSpec>;

export type Lang = keyof typeof LOCALES;
export const DEFAULT_LANG: Lang = "en";
export const localeSpec = (language: Lang): LocaleSpec => LOCALES[language];
export const localeTag = (language: Lang): string => LOCALES[language].tag;
export const isLanguage = (value: unknown): value is Lang =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(LOCALES, value) &&
  localeSpec(value as Lang).enabled !== false;
export const languages = (Object.keys(LOCALES) as Lang[]).filter(isLanguage);

// All dictionaries are bundled statically: switching language needs no network
// request, loading state or retry. Keep precedence chrome > screens > help.
export const CATALOGS: Record<Lang, Dictionary> = {
  en: {},
  zh: { ...zh_help, ...zh_screens, ...zh_chrome },
  fr: { ...fr_help, ...fr_screens, ...fr_chrome },
  de: { ...de_help, ...de_screens, ...de_chrome },
  ru: { ...ru_help, ...ru_screens, ...ru_chrome },
  es: { ...es_help, ...es_screens, ...es_chrome },
  "pt-BR": { ...pt_BR_help, ...pt_BR_screens, ...pt_BR_chrome },
  ja: { ...ja_help, ...ja_screens, ...ja_chrome },
  ar: { ...ar_help, ...ar_screens, ...ar_chrome },
  tr: { ...tr_help, ...tr_screens, ...tr_chrome },
};
