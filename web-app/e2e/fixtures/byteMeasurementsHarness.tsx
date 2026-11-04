// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { SizeChart } from "mds";
import { calculateBytes as mdsBytes } from "../../packages/mds/src/global/utils";
import { calculateBytes } from "../../src/common/utils";
import { store } from "../../src/store";
import StyleHandler from "../../src/StyleHandler";
import SpeedTestUnit from "../../src/screens/Console/Speedtest/SpeedTestUnit";

(window as any).byteMeasurements = { calculateBytes, mdsBytes };
const value = new URLSearchParams(location.search).get("bytes") ?? "0";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StyleHandler>
      <SpeedTestUnit
        title="Download"
        icon={null}
        throughput={value}
        objects={0}
      />
      <SizeChart usedBytes={Number(value)} totalBytes={1024} label />
    </StyleHandler>
  </Provider>,
);
