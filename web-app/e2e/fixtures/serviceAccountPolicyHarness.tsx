// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeHandler } from "mds";
import { lightTheme } from "../../packages/mds/src/global/themes";
import { store } from "../../src/store";
import EditServiceAccount from "../../src/screens/Console/Account/EditServiceAccount";
import MainError from "../../src/screens/Console/Common/MainError/MainError";
import { setLanguage } from "../../src/systemSlice";

const query = new URLSearchParams(location.search);
const selectedAccessKey = query.has("unselected")
  ? null
  : (query.get("accessKey") ?? "test-access");
store.dispatch(setLanguage(query.get("lang") === "zh" ? "zh" : "en"));

const Harness = () => {
  const [accessKey, setAccessKey] = useState(selectedAccessKey);
  return (
    <>
      <MainError />
      <button
        id="select-next-account"
        onClick={() => setAccessKey("next-access")}
      >
        Select next account
      </button>
      <EditServiceAccount
        open={true}
        selectedAccessKey={accessKey}
        readOnly={query.has("readOnly")}
        closeModalAndRefresh={() => undefined}
      />
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeHandler customTheme={lightTheme}>
      <BrowserRouter>
        <Harness />
      </BrowserRouter>
    </ThemeHandler>
  </Provider>,
);
