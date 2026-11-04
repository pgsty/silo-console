// Copyright (c) 2026 PGSTY
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeHandler } from "mds";
import { lightTheme } from "../../packages/mds/src/global/themes";
import { store } from "../../src/store";
import EnableQuota from "../../src/screens/Console/Buckets/BucketDetails/EnableQuota";
import SetRetentionConfig from "../../src/screens/Console/Buckets/BucketDetails/SetRetentionConfig";
import AddBucketReplication from "../../src/screens/Console/Buckets/BucketDetails/AddBucketReplication";
import AddReplicationModal from "../../src/screens/Console/Buckets/BucketDetails/AddReplicationModal";
import AddBulkReplicationModal from "../../src/screens/Console/Buckets/ListBuckets/BulkReplicationModal";

const query = new URLSearchParams(location.search);

function BucketConfigHarness() {
  const [open, setOpen] = useState(true);
  const quota = query.get("quota");
  return (
    <>
      {query.get("replication") === "page" ? (
        <AddBucketReplication />
      ) : query.get("replication") === "modal" ? (
        <AddReplicationModal
          open={open}
          bucketName="test-bucket"
          setReplicationRules={[]}
          closeModalAndRefresh={() => setOpen(false)}
        />
      ) : query.get("replication") === "bulk" ? (
        <AddBulkReplicationModal
          open={open}
          buckets={["test-bucket"]}
          closeModalAndRefresh={() => setOpen(false)}
        />
      ) : query.has("retention") ? (
        <SetRetentionConfig
          open={open}
          bucketName="test-bucket"
          closeModalAndRefresh={() => setOpen(false)}
        />
      ) : (
        <EnableQuota
          open={open}
          selectedBucket="test-bucket"
          enabled={quota !== null}
          cfg={quota === null ? null : { quota: Number(quota), type: "hard" }}
          closeModalAndRefresh={() => setOpen(false)}
        />
      )}
      <output data-testid="closed">{String(!open)}</output>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeHandler customTheme={lightTheme}>
      <MemoryRouter>
        <BucketConfigHarness />
      </MemoryRouter>
    </ThemeHandler>
  </Provider>,
);
