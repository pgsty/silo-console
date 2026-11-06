// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { localeTag, useT } from "i18n";
import React, { Fragment, useLayoutEffect } from "react";
import { GlobalStyles, ThemeHandler, ControlLabelsProvider } from "mds";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import merge from "lodash/merge";
import "react-virtualized/styles.css";

import { generateOverrideTheme } from "./utils/stylesUtils";
import {
  siloDarkThemeOverrides,
  siloLightThemeOverrides,
} from "./common/siloTheme";
import { darkTokens, lightTokens, tokenCssVariables } from "./common/ui/tokens";
import { DensityProvider } from "./common/ui/Density";
import "./index.css";
import { useSelector } from "react-redux";
import { AppState } from "./store";

const tokenRules = (tokens: typeof lightTokens | typeof darkTokens) =>
  Object.entries(tokenCssVariables(tokens))
    .map(([name, value]) => `${name}: ${value};`)
    .join("\n");
const TokenStyles = createGlobalStyle`
  :root, :root[data-theme="light"] { color-scheme: light; ${tokenRules(lightTokens)} }
  :root[data-theme="dark"] { color-scheme: dark; ${tokenRules(darkTokens)} }
`;

interface IStyleHandler {
  children: React.ReactNode;
}

const StyleHandler = ({ children }: IStyleHandler) => {
  const t = useT();
  const colorVariants = useSelector(
    (state: AppState) => state.system.overrideStyles,
  );
  const darkMode = useSelector((state: AppState) => state.system.darkMode);
  const language = useSelector((state: AppState) => state.system.language);

  // Keep <html lang> in sync for accessibility and the zh CSS overrides in
  // index.css; this wraps both the login page and the console. Layout effect
  // so a persisted Chinese preference applies before first paint.
  useLayoutEffect(() => {
    document.documentElement.lang = localeTag(language);
  }, [language]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  let thm = undefined;

  if (colorVariants) {
    thm = generateOverrideTheme(colorVariants);
  }

  // Deep-merge the SILO look over whichever base theme mds resolved.
  // Server-provided override styles keep full precedence when present.
  const applySiloTheme = (outerTheme: object) =>
    merge(
      {},
      outerTheme,
      darkMode ? siloDarkThemeOverrides : siloLightThemeOverrides,
    );

  return (
    <Fragment>
      <TokenStyles />
      <ControlLabelsProvider
        labels={{
          close: t("Close"),
          showPassword: t("Show password"),
          hidePassword: t("Hide password"),
          inputAction: t("Input action"),
          chooseDate: t("Choose date"),
          chooseDateTime: t("Choose date and time"),
          calendarLocale: localeTag(language),
          time: t("Time"),
          hour: t("Hour"),
          minute: t("Minute"),
          second: t("Second"),
          meridiem: t("AM/PM"),
          am: t("AM"),
          pm: t("PM"),
          previousCalendarPeriod: t("Previous calendar period"),
          nextCalendarPeriod: t("Next calendar period"),
          progress: t("Progress"),
          remove: t("Remove"),
          on: t("On"),
          off: t("Off"),
        }}
      >
        <DensityProvider>
          <ThemeHandler darkMode={darkMode} customTheme={thm}>
            {colorVariants ? (
              <>
                <GlobalStyles />
                {children}
              </>
            ) : (
              <ThemeProvider theme={applySiloTheme}>
                <GlobalStyles />
                {children}
              </ThemeProvider>
            )}
          </ThemeHandler>
        </DensityProvider>
      </ControlLabelsProvider>
    </Fragment>
  );
};

export default StyleHandler;
