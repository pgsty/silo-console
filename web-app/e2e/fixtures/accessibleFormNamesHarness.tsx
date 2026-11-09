// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import StyleHandler from "../../src/StyleHandler";
import { store } from "../../src/store";
import { setDarkMode, setLanguage } from "../../src/systemSlice";
import { saveSessionResponse } from "../../src/screens/Console/consoleSlice";
import { useT } from "../../src/i18n";
import RenameLongFileName from "../../src/screens/Console/ObjectBrowser/RenameLongFilename";
import KeyRevealer from "../../src/screens/Console/Tools/KeyRevealer";
import AddBulkReplicationModal from "../../src/screens/Console/Buckets/ListBuckets/BulkReplicationModal";
import DeleteReplicationRule from "../../src/screens/Console/Buckets/BucketDetails/DeleteReplicationRule";
import DeleteNonCurrentVersions from "../../src/screens/Console/Buckets/ListBuckets/Objects/ListObjects/DeleteNonCurrent";
import ModalWrapper from "../../src/screens/Console/Common/ModalWrapper/ModalWrapper";

const query = new URLSearchParams(location.search);
const originalName = `${"long-name-".repeat(24)}.txt`;
store.dispatch(setLanguage(query.get("lang") === "zh" ? "zh" : "en"));
store.dispatch(setDarkMode(query.get("lang") === "zh"));
store.dispatch(
  saveSessionResponse({
    accountAccessKey: "admin",
    permissions: { "console-ui": ["admin:*"], "demo-data": ["s3:*"] },
    features: [],
  }),
);

function Fields() {
  const t = useT();
  const [open, setOpen] = useState(true);
  const [closed, setClosed] = useState<boolean[]>([]);
  const close = (refresh = false) => {
    setClosed((current) => [...current, refresh]);
    setOpen(false);
  };
  const scenario = query.get("case");
  return (
    <main>
      <h1>Accessible form names fixture</h1>
      <output data-testid="closed">{JSON.stringify(closed)}</output>
      {scenario === "rename" ? (
        <RenameLongFileName
          open={open}
          closeModal={() => close()}
          currentItem={originalName}
          bucketName="demo-data"
          internalPaths={originalName}
          actualInfo={{ name: originalName, size: 5 }}
        />
      ) : scenario === "key" ? (
        <ModalWrapper
          modalOpen={open}
          onClose={() => close()}
          title={t("Inspect Decryption Key")}
        >
          <KeyRevealer value="fixture-decryption-key" />
        </ModalWrapper>
      ) : scenario === "bulk" || scenario === "bulk-remote" ? (
        <AddBulkReplicationModal
          open={open}
          closeModalAndRefresh={close}
          buckets={["source-one", `bucket-${"a".repeat(56)}`]}
        />
      ) : scenario === "replication-delete" ? (
        <DeleteReplicationRule
          deleteOpen={open}
          closeDeleteModalAndRefresh={close}
          selectedBucket="demo-data"
          rulesToDelete={["rule-one", "rule-two"]}
          remainingRules={2}
          allSelected
          deleteSelectedRules
        />
      ) : (
        <DeleteNonCurrentVersions
          deleteOpen={open}
          closeDeleteModalAndRefresh={close}
          location={{ bucket: "demo-data", key: "docs/report.txt" }}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StyleHandler>
      <MemoryRouter>
        <Fields />
      </MemoryRouter>
    </StyleHandler>
  </Provider>,
);
