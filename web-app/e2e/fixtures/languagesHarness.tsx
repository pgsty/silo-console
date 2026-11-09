// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CodeEditor, ReadBox, Switch, Menu, Tabs } from "mds";
import { store } from "../../src/store";
import { useT, useTN } from "../../src/i18n";
import { setLanguage } from "../../src/systemSlice";
import { initializePseudoLocale } from "../../src/i18n/pseudo";
import { saveSessionResponse } from "../../src/screens/Console/consoleSlice";
import StyleHandler from "../../src/StyleHandler";
import AddReplicationSites from "../../src/screens/Console/Configurations/SiteReplication/AddReplicationSites";
import PageHeaderWrapper from "../../src/screens/Console/Common/PageHeaderWrapper/PageHeaderWrapper";
import LogLine from "../../src/screens/Console/Logs/ErrorLogs/LogLine";
const raw = "archive/日本語/ملف.json";
store.dispatch(
  saveSessionResponse({ permissions: { "console-ui": ["admin:*"] } }),
);
function Data() {
  const t = useT(),
    tn = useTN();
  const [drawer, setDrawer] = useState(false);
  const [tab, setTab] = useState("objects");
  return (
    <>
      <PageHeaderWrapper label={t("Objects")} />
      <main style={{ padding: 16, minWidth: 0 }}>
        <div data-testid="quantity">
          {tn(22, "{count} version", "{count} versions")}
        </div>
        <ReadBox label={t("Object")}>
          <bdi data-testid="raw-path" dir="ltr">
            {raw}
          </bdi>
        </ReadBox>
        <CodeEditor
          label={t("Policy")}
          value={'{"Resource":"arn:aws:s3:::archive/*","Effect":"Allow"}'}
          onChange={() => {}}
        />
        <button id="drawer-trigger" onClick={() => setDrawer(true)}>
          {t("Open menu")}
        </button>
        <Menu
          isOpen
          collapseAction={() => setDrawer(false)}
          mobileMode="auto"
          mobileOpen={drawer}
          onMobileOpenChange={setDrawer}
          mobileLabel={t("Menu")}
          callPathAction={() => {}}
          options={[{ name: t("Objects"), path: "/browser", icon: null }]}
        />
        <Tabs
          horizontal
          currentTabOrPath={tab}
          onTabClick={setTab}
          options={[
            { tabConfig: { id: "objects", label: t("Objects") } },
            { tabConfig: { id: "settings", label: t("Settings") } },
            { tabConfig: { id: "policies", label: t("Policies") } },
          ]}
        />
        <Switch id="enabled" label={t("Enabled")} checked onChange={() => {}} />
        <table>
          <tbody>
            <LogLine
              log={
                {
                  time: "12:00:00 UTC 01/01/2026",
                  api: { name: "GetObject" },
                  deploymentid: "deployment-test",
                  requestID: "request-test",
                  remotehost: "127.0.0.1",
                  userAgent: "raw agent",
                  error: {
                    message: "Access Denied raw server message",
                    source: ["raw stack payload"],
                  },
                } as any
              }
            />
          </tbody>
        </table>
      </main>
    </>
  );
}
async function start() {
  if (await initializePseudoLocale()) store.dispatch(setLanguage("en"));
  createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <StyleHandler>
        <MemoryRouter initialEntries={["/settings/site-replication/add"]}>
          {new URLSearchParams(location.search).get("screen") === "raw" ? (
            <Data />
          ) : (
            <AddReplicationSites />
          )}
        </MemoryRouter>
      </StyleHandler>
    </Provider>,
  );
}
void start();
