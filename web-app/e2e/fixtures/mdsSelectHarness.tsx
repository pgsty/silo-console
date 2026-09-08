// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Select, ThemeHandler } from "mds";

function Harness() {
  const [value, setValue] = useState("");
  return (
    <ThemeHandler>
      <div style={{ width: 400, margin: 30 }}>
        <Select
          id="target"
          label="Target"
          placeholder="Choose target"
          value={value}
          onChange={(next) => setValue(next as string)}
          options={[
            { value: "first", label: "First" },
            { value: "second", label: "Second" },
            { value: "disabled", label: "Disabled", disabled: true },
            { value: "last", label: "Last" },
          ]}
        />
        <output id="chosen">{value}</output>
      </div>
    </ThemeHandler>
  );
}

createRoot(document.getElementById("root")!).render(<Harness />);
