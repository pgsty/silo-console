// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { store } from "../../src/store";
import { useDropzone } from "react-dropzone";
import {
  setAnonymousMode,
  globalSetDistributedSetup,
} from "../../src/systemSlice";
import { useTaskSession } from "../../src/screens/Console/Common/ObjectManager/useTaskSession";
import VersionsNavigator from "../../src/screens/Console/Buckets/ListBuckets/Objects/ObjectDetails/VersionsNavigator";
import { saveSessionResponse } from "../../src/screens/Console/consoleSlice";
import StyleHandler from "../../src/StyleHandler";
import TaskDepartureGuard from "../../src/screens/Console/Common/ObjectManager/TaskDepartureGuard";
import {
  setNewObject,
  completeObject,
  resetTasks,
  setSelectedBucket,
  setSelectedObjectView,
} from "../../src/screens/Console/ObjectBrowser/objectBrowserSlice";
import {
  registerTaskControl,
  resetTaskRuntime,
} from "../../src/screens/Console/ObjectBrowser/transferManager";
const params = new URLSearchParams(location.search);
const versionFixture = params.has("versions");
const base = params.get("base") || "/";
if (versionFixture) {
  store.dispatch(
    saveSessionResponse({ permissions: { "arn:aws:s3:::*": ["s3:*"] } }),
  );
  store.dispatch(globalSetDistributedSetup(true));
  store.dispatch(setSelectedBucket("b"));
  store.dispatch(setSelectedObjectView("owned"));
}
history.replaceState(null, "", `${base === "/" ? "" : base}/a`);
const effects: string[] = [];
let cancelled = 0;
let queuedUploads = 0;
let extractionFinished = false;
let releaseExtraction: (() => void) | undefined;
const DropSource = () => {
  const current = useTaskSession();
  const { getRootProps, getInputProps } = useDropzone({
    getFilesFromEvent: () =>
      new Promise<File[]>((resolve) => {
        releaseExtraction = () => {
          extractionFinished = true;
          resolve([new File(["old account"], "owned.txt")]);
        };
      }),
    onDrop: () => {
      if (current()) queuedUploads++;
    },
  });
  return (
    <div data-testid="drop-source" {...getRootProps()}>
      <input {...getInputProps()} />
    </div>
  );
};
const Harness = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    effects.push(location.pathname);
    if (/^\/logout\/*$/i.test(location.pathname))
      void fetch("/api/v1/logout", { method: "POST" });
  }, [location.pathname]);
  const add = (type: "upload" | "delete") => {
    registerTaskControl("job", {
      cancel: () => {
        cancelled++;
        effects.push("cancel");
      },
    });
    store.dispatch(
      setNewObject({
        ID: "job",
        instanceID: "job",
        type,
        prefix: "owned",
        bucketName: "b",
        percentage: 0,
        done: false,
        failed: false,
        cancelled: false,
        waitingForFile: false,
        errorMessage: "",
      }),
    );
  };
  Object.assign(window, {
    taskGuardEvidence: () => ({
      effects: [...effects],
      cancelled,
      queuedUploads,
      extractionFinished,
      anonymous: store.getState().system.anonymousMode,
    }),
    releaseExtraction: () => releaseExtraction?.(),
  });
  return (
    <main>
      {!/^\/login\/*$/i.test(location.pathname) && <DropSource />}
      <button onClick={() => store.dispatch(setAnonymousMode())}>
        Anonymous
      </button>
      <button onClick={() => navigate("/LOGIN/")}>Anonymous Login</button>
      <button onClick={() => navigate("/LOGOUT/")}>Logout variant</button>
      <output data-testid="location">
        {location.pathname}
        {location.search}
        {location.hash}
      </output>
      <button
        onClick={() =>
          navigate("/b?sort=name#anchor", { state: { marker: "kept" } })
        }
      >
        Push B
      </button>
      <button onClick={() => navigate("/c", { replace: true })}>
        Replace C
      </button>
      <button onClick={() => navigate("/logout")}>Logout</button>
      <button
        onClick={() =>
          navigate("/browser/b/dir%252Fname%2F", {
            state: { marker: "encoded" },
          })
        }
      >
        Encoded
      </button>
      <button onClick={() => add("delete")}>Start delete</button>
      <button onClick={() => add("upload")}>Start upload</button>
      <button onClick={() => store.dispatch(completeObject("job"))}>
        Complete
      </button>
      <button
        onClick={() => {
          resetTaskRuntime();
          store.dispatch(resetTasks());
        }}
      >
        Reset
      </button>
      <output data-testid="state">{JSON.stringify(location.state)}</output>
    </main>
  );
};
const router = createBrowserRouter(
  [
    {
      path: "*",
      element: (
        <>
          <TaskDepartureGuard />
          <Routes>
            <Route
              path="*"
              element={
                versionFixture ? (
                  <VersionsNavigator internalPaths="owned" bucketName="b" />
                ) : (
                  <Harness />
                )
              }
            />
          </Routes>
        </>
      ),
    },
  ],
  { basename: base },
);
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StyleHandler>
      <RouterProvider router={router} />
    </StyleHandler>
  </Provider>,
);
