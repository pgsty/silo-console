// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// React bindings for the i18n primitives in ./lang. Components subscribe to
// the language through Redux, so a toggle re-renders every consumer.

import React, { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../store";
import { Lang, localizeUrl, translate, translateLegend } from "./lang";

export const useLanguage = (): Lang =>
  useSelector((state: AppState) => state.system.language);

export const useT = (): ((text: string) => string) => {
  const lang = useLanguage();
  return useMemo(() => (text: string) => translate(lang, text), [lang]);
};

export const useLocalizedLink = (): ((url: string) => string) => {
  const lang = useLanguage();
  return useMemo(() => (url: string) => localizeUrl(url, lang), [lang]);
};

export const useLegendT = (): ((text: string) => string) => {
  const lang = useLanguage();
  return useMemo(() => (text: string) => translateLegend(lang, text), [lang]);
};

// Renders a translated template with React nodes in {slot} positions, so
// paragraphs that mix text and links stay one dictionary entry:
//   interpolate(t("Maintained by {pigsty}."), { pigsty: <a …>Pigsty</a> })
export const interpolate = (
  template: string,
  slots: Record<string, React.ReactNode>,
): React.ReactNode[] =>
  template.split(/(\{\w+\})/g).map((part, index) => {
    const match = /^\{(\w+)\}$/.exec(part);
    return (
      <Fragment key={index}>
        {match ? (slots[match[1]] ?? part) : part}
      </Fragment>
    );
  });

export * from "./lang";
