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
import LanguageActivator from "../../src/screens/Console/Common/LanguageActivator/LanguageActivator";
import { store } from "../../src/store";
import StyleHandler from "../../src/StyleHandler";
import { setLanguage } from "../../src/systemSlice";

Object.assign(window, {
  catalogHarness: { setPortuguese: () => store.dispatch(setLanguage("pt-BR")) },
});

const Copy = () => {
  const t = useT();
  const memoizedCopy = useMemo(() => t("Remote host:"), [t]);
  return (
    <>
      <input id="unsaved" aria-label="Unsaved input" />
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
