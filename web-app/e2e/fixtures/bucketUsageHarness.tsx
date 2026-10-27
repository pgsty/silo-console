// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../../src/store";
import { saveSessionResponse } from "../../src/screens/Console/consoleSlice";
import {
  BucketUsageProvider,
  useBucketUsage,
} from "../../src/screens/Console/Buckets/ListBuckets/useBucketUsage";
import {
  BucketUsageNotice,
  BucketUsageStatus,
} from "../../src/screens/Console/Buckets/ListBuckets/BucketUsageStatus";
import { BucketUsage } from "../../src/screens/Console/Buckets/ListBuckets/BucketListCells";
store.dispatch(
  saveSessionResponse({
    accountAccessKey: "fixture",
    permissions: { "arn:aws:s3:::*": ["s3:*"] },
    features: [],
  }),
);
function Workbench() {
  const [names, setNames] = useState(["fixture-bucket"]);
  const usage = useBucketUsage(names);
  return (
    <BucketUsageProvider value={usage}>
      <button onClick={usage.refresh}>Refresh</button>
      <button onClick={() => setNames(["other-bucket"])}>Navigate</button>
      <BucketUsageNotice />
      {names.map((name) => (
        <section key={name} aria-label={name}>
          <BucketUsageStatus bucket={name} />
          <BucketUsage
            bucket={{ name, size: 9999999 }}
            field="size"
            canReadUsage={false}
          />
        </section>
      ))}
    </BucketUsageProvider>
  );
}
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Workbench />
  </Provider>,
);
