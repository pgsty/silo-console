// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Isolated feature entry: use the same deferred catalogue boundary as Console.
import {
  registerScreenLoader,
  registerScreenTranslations,
} from "../../src/i18n/lang";
import { zhScreens } from "../../src/i18n/zhScreens";
registerScreenTranslations(zhScreens);
registerScreenLoader(() =>
  import("../../src/i18n/ptScreens").then((module) => module.ptScreens),
);

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ThemeHandler } from "mds";
import { lightTheme } from "../../packages/mds/src/global/themes";
import { AppState, store } from "../../src/store";
import { saveSessionResponse } from "../../src/screens/Console/consoleSlice";
import PolicyDetails from "../../src/screens/Console/Policies/PolicyDetails";
import ListPolicies from "../../src/screens/Console/Policies/ListPolicies";
import UserDetails from "../../src/screens/Console/Users/UserDetails";
import GroupsDetails from "../../src/screens/Console/Groups/GroupsDetails";
import IDPLDAPConfigurationDetails from "../../src/screens/Console/IDP/LDAP/IDPLDAPConfigurationDetails";
import MainError from "../../src/screens/Console/Common/MainError/MainError";
import { setDarkMode, setLanguage } from "../../src/systemSlice";
import StyleHandler from "../../src/StyleHandler";

const errorActions: { plain: boolean; payload: unknown }[] = [];
const dispatch = store.dispatch;
store.dispatch = ((action: Parameters<typeof dispatch>[0]) => {
  if (
    typeof action === "object" &&
    action.type === "system/setErrorSnackMessage" &&
    "payload" in action
  ) {
    const payload = action.payload;
    errorActions.push({
      plain:
        payload !== null &&
        typeof payload === "object" &&
        Object.getPrototypeOf(payload) === Object.prototype,
      payload,
    });
  }
  return dispatch(action);
}) as typeof dispatch;

const ErrorState = () => {
  const error = useSelector((state: AppState) => state.system.snackBar);
  return (
    <>
      <output data-testid="error-state">{JSON.stringify(error)}</output>
      <output data-testid="error-actions">
        {JSON.stringify(errorActions)}
      </output>
    </>
  );
};

const fixture = new URLSearchParams(location.search);
if (fixture.has("lang"))
  store.dispatch(setLanguage(fixture.get("lang") === "zh" ? "zh" : "en"));
const groupLayout = fixture.get("layout") === "group";
if (groupLayout) store.dispatch(setDarkMode(fixture.get("lang") === "zh"));
const FixtureStyles = ({ children }: { children: React.ReactNode }) =>
  groupLayout ? (
    <StyleHandler>{children}</StyleHandler>
  ) : (
    <ThemeHandler customTheme={lightTheme}>{children}</ThemeHandler>
  );
store.dispatch(
  saveSessionResponse({
    accountAccessKey: fixture.get("account") || "admin",
    permissions: {
      "console-ui":
        fixture.get("access") === "read-only"
          ? ["admin:GetPolicy", "admin:ListUserPolicies", "admin:GetUser"]
          : ["admin:*"],
    },
    features: [],
  }),
);
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <FixtureStyles>
      <BrowserRouter>
        <MainError />
        {!groupLayout && <ErrorState />}
        {!groupLayout && (
          <nav>
            <Link to="/policies">Policies fixture</Link>{" "}
            <Link to="/policies/readwrite">Readwrite fixture</Link>{" "}
            <Link to="/identity/users/alice">Alice fixture</Link>{" "}
            <Link to="/identity/users/bob">Bob fixture</Link>
          </nav>
        )}
        <Routes>
          <Route path="/policies" element={<ListPolicies />} />
          <Route path="/policies/:policyName" element={<PolicyDetails />} />
          <Route path="/identity/users/:userName" element={<UserDetails />} />
          <Route
            path="/identity/groups/:groupName"
            element={
              <main
                style={
                  fixture.has("sidebar")
                    ? { marginLeft: 240, width: "calc(100% - 240px)" }
                    : undefined
                }
              >
                <GroupsDetails />
              </main>
            }
          />
          <Route
            path="/identity/ldap"
            element={<IDPLDAPConfigurationDetails />}
          />
        </Routes>
      </BrowserRouter>
    </FixtureStyles>
  </Provider>,
);
