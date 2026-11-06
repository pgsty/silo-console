// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { useT } from "../../src/i18n";
import { registerScreenLoader } from "../../src/i18n/lang";
import { ptScreens } from "../../src/i18n/ptScreens";
import LanguageActivator from "../../src/screens/Console/Common/LanguageActivator/LanguageActivator";
import { store, syncLanguageCatalogBriefly } from "../../src/store";
import StyleHandler from "../../src/StyleHandler";
import { setLanguage } from "../../src/systemSlice";

const pendingScreens: ((screens: Record<string, string>) => void)[] = [];
registerScreenLoader(
  () => new Promise((resolve) => pendingScreens.push(resolve)),
);

Object.assign(window, {
  catalogHarness: {
    pendingScreenLoads: () => pendingScreens.length,
    releaseScreens: () => {
      pendingScreens.forEach((resolve) => resolve(ptScreens));
    },
    setPortuguese: () => store.dispatch(setLanguage("pt")),
    waitBriefly: syncLanguageCatalogBriefly,
  },
});

const Copy = () => {
  const t = useT();
  const memoizedCopy = useMemo(() => t("Remote host:"), [t]);
  return (
    <>
      <p id="common">{t("Login")}</p>
      <p id="screen">{memoizedCopy}</p>
    </>
  );
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <StyleHandler>
      <Copy />
      <LanguageActivator />
    </StyleHandler>
  </Provider>,
);
