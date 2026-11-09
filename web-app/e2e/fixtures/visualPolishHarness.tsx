// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { DataTable, DensityProvider } from "mds";
import { store } from "../../src/store";
import { globalSetDistributedSetup, setLanguage } from "../../src/systemSlice";
import { lightTokens, tokenCssVariables } from "../../src/common/ui/tokens";
import { siloLightThemeOverrides } from "../../src/common/siloTheme";
import { useBoundedTable } from "../../src/common/ui/useBoundedTable";
import { OverflowMenu } from "../../src/common/ui/OverflowMenu";
import Inspect from "../../src/screens/Console/Tools/Inspect";

store.dispatch(globalSetDistributedSetup(true));
for (const [name, value] of Object.entries(tokenCssVariables(lightTokens)))
  document.documentElement.style.setProperty(name, value);

function Table({ count, loading }: { count: number; loading: boolean }) {
  const bounded = useBoundedTable(count, loading);
  return (
    <DataTable
      {...bounded}
      parentClassName="bounded-fixture"
      isLoading={loading}
      loadingState={<div style={{ height: 180 }}>Loading rows</div>}
      emptyState={<div style={{ padding: 24 }}>No records</div>}
      columns={[{ label: "Name", elementKey: "name" }]}
      records={Array.from({ length: count }, (_, n) => ({
        name: `record-${n}`,
      }))}
      idField="name"
      entityName="Records"
    />
  );
}
function Harness() {
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [compact, setCompact] = useState(false);
  const table = new URLSearchParams(location.search).has("table");
  return (
    <Provider store={store}>
      <ThemeProvider theme={siloLightThemeOverrides}>
        <MemoryRouter>
          {table ? (
            <>
              <button id="zero" onClick={() => setCount(0)}>
                Empty
              </button>
              <button id="one" onClick={() => setCount(1)}>
                One row
              </button>
              <button id="loading" onClick={() => setLoading(!loading)}>
                Loading
              </button>
              <button id="many" onClick={() => setCount(200)}>
                Many rows
              </button>
              <button id="two" onClick={() => setCount(2)}>
                Two rows
              </button>
              <button id="compact" onClick={() => setCompact(!compact)}>
                Density
              </button>
              <DensityProvider density={compact ? "compact" : "default"}>
                <Table count={count} loading={loading} />
              </DensityProvider>
            </>
          ) : (
            <>
              <button id="en" onClick={() => store.dispatch(setLanguage("en"))}>
                English
              </button>
              <button id="zh" onClick={() => store.dispatch(setLanguage("zh"))}>
                中文
              </button>
              <Inspect />
              <OverflowMenu
                label="Fixture actions"
                items={[{ label: "Download", onClick: () => {} }]}
              />
            </>
          )}
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
}
createRoot(document.getElementById("root")!).render(<Harness />);
