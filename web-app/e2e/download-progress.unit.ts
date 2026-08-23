// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import { createServer, ViteDevServer } from "vite";
import { calculateDownloadPercent } from "../src/screens/Console/Buckets/ListBuckets/Objects/downloadProgress";
import type { IFileItem } from "../src/screens/Console/ObjectBrowser/types";

test.describe.configure({ mode: "serial" });

const progressEvent = (
  loaded: number,
  lengthComputable = false,
  total = 0,
) => ({ loaded, lengthComputable, total });

test.describe("calculateDownloadPercent", () => {
  test("preserves known object-size progress", () => {
    expect(calculateDownloadPercent(progressEvent(50), 100)).toBe(50);
  });

  test("keeps an unknown prefix total indeterminate", () => {
    expect(calculateDownloadPercent(progressEvent(1024), 0)).toBeNull();
    expect(calculateDownloadPercent(progressEvent(0), 0)).toBeNull();
  });

  test("falls back to a computable response total", () => {
    expect(calculateDownloadPercent(progressEvent(50, true, 200), 0)).toBe(25);
  });

  test("rejects zero and non-finite totals", () => {
    expect(calculateDownloadPercent(progressEvent(0, true, 0), 0)).toBeNull();
    expect(
      calculateDownloadPercent(progressEvent(10, true, Infinity), 0),
    ).toBeNull();
    expect(calculateDownloadPercent(progressEvent(10), NaN)).toBeNull();
    expect(
      calculateDownloadPercent(
        progressEvent(10),
        undefined as unknown as number,
      ),
    ).toBeNull();
  });

  test("rejects invalid loaded bytes", () => {
    expect(calculateDownloadPercent(progressEvent(-1), 100)).toBeNull();
    expect(calculateDownloadPercent(progressEvent(Infinity), 100)).toBeNull();
  });

  test("clamps progress to the determinate range", () => {
    expect(calculateDownloadPercent(progressEvent(150), 100)).toBe(100);
  });
});

const downloadItem = (): IFileItem => ({
  ID: "request-id",
  instanceID: "instance-id",
  bucketName: "bucket",
  prefix: "folder/",
  percentage: 0,
  type: "download",
  waitingForFile: true,
  done: false,
  failed: false,
  cancelled: false,
  errorMessage: "",
});

test.describe("download progress state", () => {
  let viteServer: ViteDevServer;
  let objectBrowserReducer: (state: any, action: any) => any;
  let cancelObjectInList: (instanceID: string) => any;
  let completeObject: (instanceID: string) => any;
  let failObject: (payload: { instanceID: string; msg: string }) => any;
  let setNewObject: (item: IFileItem) => any;
  let updateProgress: (payload: {
    instanceID: string;
    progress: number;
  }) => any;
  const stateWithDownload = () =>
    objectBrowserReducer(undefined, setNewObject(downloadItem()));

  test.beforeAll(async () => {
    viteServer = await createServer({
      appType: "custom",
      logLevel: "silent",
      server: { middlewareMode: true },
      ssr: { noExternal: ["@reduxjs/toolkit"] },
    });
    const objectBrowserSlice = await viteServer.ssrLoadModule(
      "/src/screens/Console/ObjectBrowser/objectBrowserSlice.ts",
    );
    ({
      default: objectBrowserReducer,
      cancelObjectInList,
      completeObject,
      failObject,
      setNewObject,
      updateProgress,
    } = objectBrowserSlice);
  });

  test.afterAll(async () => {
    await viteServer.close();
  });

  test("starts indeterminate and becomes determinate on valid progress", () => {
    const initial = stateWithDownload();
    expect(initial.objectManager.objectsToManage[0].waitingForFile).toBe(true);

    const progressed = objectBrowserReducer(
      initial,
      updateProgress({ instanceID: "instance-id", progress: 50 }),
    );
    expect(progressed.objectManager.objectsToManage[0]).toMatchObject({
      waitingForFile: false,
      percentage: 50,
      done: false,
    });
  });

  test("completion exits indeterminate at 100 percent", () => {
    const completed = objectBrowserReducer(
      stateWithDownload(),
      completeObject("instance-id"),
    );
    expect(completed.objectManager.objectsToManage[0]).toMatchObject({
      waitingForFile: false,
      percentage: 100,
      done: true,
    });
  });

  test("failure exits indeterminate", () => {
    const failed = objectBrowserReducer(
      stateWithDownload(),
      failObject({ instanceID: "instance-id", msg: "failed" }),
    );
    expect(failed.objectManager.objectsToManage[0]).toMatchObject({
      waitingForFile: false,
      done: true,
      failed: true,
      errorMessage: "failed",
    });
  });

  test("cancellation exits indeterminate", () => {
    const cancelled = objectBrowserReducer(
      stateWithDownload(),
      cancelObjectInList("instance-id"),
    );
    expect(cancelled.objectManager.objectsToManage[0]).toMatchObject({
      waitingForFile: false,
      percentage: 0,
      done: true,
      cancelled: true,
    });
  });
});
