// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../src/store";
import { menuOpen, setDarkMode, setLanguage } from "../../src/systemSlice";
import { saveSessionResponse } from "../../src/screens/Console/consoleSlice";
import StyleHandler from "../../src/StyleHandler";
import Trace from "../../src/screens/Console/Trace/Trace";
import Profile from "../../src/screens/Console/Support/Profile";
import AddReplicationSites from "../../src/screens/Console/Configurations/SiteReplication/AddReplicationSites";

const query = new URLSearchParams(location.search);
const screen = query.get("screen") || "trace";
store.dispatch(setLanguage(query.get("lang") === "zh" ? "zh" : "en"));
store.dispatch(setDarkMode(query.get("theme") === "dark"));
store.dispatch(menuOpen(true));
store.dispatch(
  saveSessionResponse({
    serverEndPoint: "https://primary.example.invalid:9000",
    permissions: { "console-ui": ["admin:*"] },
  }),
);

const route =
  screen === "site"
    ? "/settings/site-replication/add"
    : screen === "profile"
      ? "/support/profile"
      : "/tools/trace";

// Only the surrounding width is simulated: 240 px is the expanded sidebar
// contract. All page content, CSS, translations, stores and controls are real.
// HTTP and WebSockets are intercepted by the test before this bundle mounts.
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StyleHandler>
      <MemoryRouter initialEntries={[route]}>
        <style>{`
          .mobile-acceptance-frame { display: grid; grid-template-columns: minmax(0, 1fr); }
          .mobile-acceptance-sidebar { display: none; }
          #mobile-acceptance-main { min-width: 0; }
          @media (min-width: 768px) {
            .mobile-acceptance-frame { grid-template-columns: 240px minmax(0, 1fr); }
            .mobile-acceptance-sidebar { display: block; background: var(--surface-2); }
          }
        `}</style>
        <div className="mobile-acceptance-frame">
          <aside className="mobile-acceptance-sidebar" aria-hidden="true" />
          <main id="mobile-acceptance-main">
            {screen === "trace" ? (
              <Trace />
            ) : screen === "profile" ? (
              <Profile />
            ) : (
              <AddReplicationSites />
            )}
          </main>
        </div>
      </MemoryRouter>
    </StyleHandler>
  </Provider>,
);
