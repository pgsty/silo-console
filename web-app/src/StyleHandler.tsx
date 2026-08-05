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

import React, { Fragment, useEffect } from "react";
import { GlobalStyles, ThemeHandler } from "mds";
import { ThemeProvider } from "styled-components";
import merge from "lodash/merge";
import "react-virtualized/styles.css";

import { generateOverrideTheme } from "./utils/stylesUtils";
import {
  siloDarkThemeOverrides,
  siloLightThemeOverrides,
} from "./common/siloTheme";
import "./index.css";
import { useSelector } from "react-redux";
import { AppState } from "./store";

interface IStyleHandler {
  children: React.ReactNode;
}

const StyleHandler = ({ children }: IStyleHandler) => {
  const colorVariants = useSelector(
    (state: AppState) => state.system.overrideStyles,
  );
  const darkMode = useSelector((state: AppState) => state.system.darkMode);
  const language = useSelector((state: AppState) => state.system.language);

  // Keep <html lang> in sync for accessibility and the zh CSS overrides in
  // index.css; this wraps both the login page and the console.
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

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
      <GlobalStyles />
      <ThemeHandler darkMode={darkMode} customTheme={thm}>
        {colorVariants ? (
          children
        ) : (
          <ThemeProvider theme={applySiloTheme}>{children}</ThemeProvider>
        )}
      </ThemeHandler>
    </Fragment>
  );
};

export default StyleHandler;
