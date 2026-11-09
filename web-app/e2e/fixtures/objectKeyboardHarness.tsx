// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useRef, useState, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { AppState, store } from "../../src/store";
import StyleHandler from "../../src/StyleHandler";
import { saveSessionResponse } from "../../src/screens/Console/consoleSlice";
import ListObjectsTable from "../../src/screens/Console/Buckets/ListBuckets/Objects/ListObjects/ListObjectsTable";
import FilterObjectsSB from "../../src/screens/Console/ObjectBrowser/FilterObjectsSB";
import {
  commitObjectPage,
  setSelectedBucket,
  setSimplePathHandler,
  setNewObject,
  resetTasks,
  setSelectedObjectView,
  setPreviewOpen,
  setRewindEnable,
  setSelectedVersion,
  setIsVersioned,
} from "../../src/screens/Console/ObjectBrowser/objectBrowserSlice";
import { ModalPresence } from "../../src/common/ui/ModalPresence";
import { ShortcutHelpHost } from "../../src/common/ui/ShortcutHelp";
import TaskDepartureGuard from "../../src/screens/Console/Common/ObjectManager/TaskDepartureGuard";
import {
  setAnonymousMode,
  resetSystem,
  globalSetDistributedSetup,
} from "../../src/systemSlice";
import PreviewFileModal from "../../src/screens/Console/Buckets/ListBuckets/Objects/Preview/PreviewFileModal";
import { ModalBox, DensityProvider } from "mds";
import { KBarProvider, useKBar } from "kbar";
import CommandBar from "../../src/screens/Console/CommandBar";
store.dispatch(
  saveSessionResponse({
    permissions: { "arn:aws:s3:::*": ["s3:*", "admin:*"] },
  }),
);
store.dispatch(setSelectedBucket("b"));
store.dispatch(setSimplePathHandler("docs/"));
store.dispatch(
  commitObjectPage({
    records: Array.from({ length: 100 }, (_, i) => ({
      name: `docs/${String(i).padStart(3, "0")}.txt`,
      size: i + 1,
      last_modified: "2026-10-24T00:00:00Z",
      version_id: "",
    })),
    commit: {
      pageSize: 100,
      pageIndex: 0,
      token: "",
      nextToken: "another-page",
      truncated: false,
      synthesized: false,
    },
  }),
);
const Never = React.lazy(
  () => new Promise<{ default: React.ComponentType }>(() => {}),
);
const showSpecialRow = (name: string, rewind = false) => {
  store.dispatch(
    commitObjectPage({
      records: [
        {
          name,
          size: 1,
          version_id: rewind ? "rewind-v1" : "",
          last_modified: "2026-10-24T00:00:00Z",
        },
      ],
      commit: {
        pageSize: 100,
        pageIndex: 0,
        token: "",
        nextToken: "",
        truncated: false,
        synthesized: false,
      },
    }),
  );
  if (rewind) {
    store.dispatch(
      setRewindEnable({
        state: true,
        bucket: "b",
        dateRewind: "2026-10-24T00:00:00Z",
      }),
    );
    store.dispatch(globalSetDistributedSetup(true));
    store.dispatch(
      saveSessionResponse({
        permissions: {
          "arn:aws:s3:::*": [
            "s3:ListBucketVersions",
            "s3:ListBucket",
            "s3:GetObjectVersion",
          ],
        },
      }),
    );
  }
};
function Harness() {
  const filter = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [secondPending, setSecondPending] = useState(false);
  const [modal, setModal] = useState(false);
  const command = useKBar((state) => ({ disabled: state.disabled }));
  const [compact, setCompact] = useState(false);
  const location = useLocation();
  const selection = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
  );
  const objectState = useSelector((state: AppState) => state.objectBrowser);
  const snack = useSelector((state: AppState) => state.system.snackBar.message);
  return (
    <DensityProvider density={compact ? "compact" : "default"}>
      <CommandBar />
      <output data-testid="command-disabled">{String(command.disabled)}</output>
      <button onClick={() => setCompact(!compact)}>Toggle compact</button>
      <button onClick={() => setPending(!pending)}>Toggle pending</button>
      <button onClick={() => setSecondPending(!secondPending)}>
        Toggle second pending
      </button>
      <button onClick={() => setModal(true)}>Open dialog</button>
      <button
        onClick={() =>
          store.dispatch(
            setNewObject({
              ID: "held",
              instanceID: "held",
              type: "upload",
              bucketName: "b",
              prefix: "held",
              percentage: 0,
              done: false,
              failed: false,
              cancelled: false,
              waitingForFile: false,
              errorMessage: "",
            }),
          )
        }
      >
        Start task
      </button>
      <button onClick={() => store.dispatch(resetTasks())}>Reset tasks</button>
      <button onClick={() => store.dispatch(setAnonymousMode())}>
        Public mode
      </button>
      <button
        onClick={() =>
          store.dispatch(
            saveSessionResponse({
              permissions: { "arn:aws:s3:::*": ["s3:ListBucket"] },
            }),
          )
        }
      >
        Read denied
      </button>
      <button
        onClick={() => store.dispatch(setSelectedObjectView("docs/000.txt"))}
      >
        Details A
      </button>
      <button
        onClick={() => store.dispatch(setSelectedObjectView("docs/001.txt"))}
      >
        Details B
      </button>
      <button
        onClick={() => store.dispatch(setSelectedVersion("other-version"))}
      >
        Other version
      </button>
      <button
        onClick={() => {
          showSpecialRow("docs/folder/");
          store.dispatch(setIsVersioned({ status: "Enabled" }));
        }}
      >
        Folder row
      </button>
      <button onClick={() => showSpecialRow("docs/no-extension", true)}>
        Version-only extensionless
      </button>
      <button onClick={() => store.dispatch(resetSystem())}>
        Reset session
      </button>
      <output data-testid="revision">
        {objectState.objectMutationRevision}
      </output>
      <output data-testid="tasks">
        {JSON.stringify(objectState.objectManager.objectsToManage)}
      </output>
      <ModalPresence open={objectState.previewOpen}>
        {objectState.previewOpen && objectState.selectedPreview && (
          <PreviewFileModal
            open
            bucketName="b"
            actualInfo={objectState.selectedPreview}
            onClosePreview={() => store.dispatch(setPreviewOpen(false))}
          />
        )}
      </ModalPresence>
      <input aria-label="Typing" />
      <div contentEditable suppressContentEditableWarning aria-label="Editable">
        Editable
      </div>
      <output data-testid="location">{location.pathname}</output>
      <output data-testid="selection">{JSON.stringify(selection)}</output>
      <output data-testid="notice">{snack}</output>
      <FilterObjectsSB inputRef={filter} />
      <ListObjectsTable
        filterRef={filter}
        emptyActions={() => [
          { label: "Refresh", action: () => {}, state: { disabled: false } },
        ]}
      />
      <ModalPresence open={pending}>
        {pending && (
          <Suspense fallback={null}>
            <Never />
          </Suspense>
        )}
      </ModalPresence>
      <ModalPresence open={secondPending}>
        {secondPending && (
          <Suspense fallback={null}>
            <Never />
          </Suspense>
        )}
      </ModalPresence>
      <ModalPresence open={modal}>
        {modal && (
          <ModalBox
            open
            title="Test dialog"
            onClose={() => setModal(false)}
            closeLabel="Close"
          >
            <input aria-label="Dialog input" />
          </ModalBox>
        )}
      </ModalPresence>
      <TaskDepartureGuard />
      <ShortcutHelpHost />
      <button>After list</button>
    </DensityProvider>
  );
}
history.replaceState(null, "", "/browser/b/docs%2F");
const router = createBrowserRouter([
  { path: "/browser/:bucketName/*", element: <Harness /> },
]);
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StyleHandler>
      <KBarProvider>
        <RouterProvider router={router} />
      </KBarProvider>
    </StyleHandler>
  </Provider>,
);
