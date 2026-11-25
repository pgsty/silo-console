// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import { buildHarness as build } from "./fixtures/buildHarness";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";

// downloadObject is the entry point of every single-object Download button.
// The network request and the client OS are stubbed so the test observes
// only what the button does with the click.
test.describe("downloadObject", () => {
  test.describe.configure({ mode: "serial" });
  let harness: any;

  test.beforeAll(async () => {
    const utilsPath = fileURLToPath(
      new URL("../src/screens/Console/ObjectBrowser/utils.ts", import.meta.url),
    );
    const entry = fileURLToPath(
      new URL("./download-object-test.ts", import.meta.url),
    );
    const downloadStub = "\0download-stub";
    const clientStub = "\0client-stub";
    const result = await build({
      configFile: false,
      logLevel: "silent",
      resolve: { tsconfigPaths: true },
      define: { "process.env.NODE_ENV": '"production"' },
      plugins: [
        {
          name: "download-object-test",
          enforce: "pre",
          resolveId: (id) => {
            if (id === entry || id === downloadStub || id === clientStub)
              return id;
            if (id.endsWith("Buckets/ListBuckets/Objects/utils"))
              return downloadStub;
            if (id.endsWith("common/utils")) return clientStub;
            return null;
          },
          load: (id) => {
            if (id === entry)
              return `export { downloadObject } from ${JSON.stringify(utilsPath)};
                      export { calls } from ${JSON.stringify(downloadStub)};`;
            if (id === downloadStub)
              return `export const calls = [];
                      export const download = (...args) => {
                        calls.push(args);
                        return { send() {}, abort() {} };
                      };`;
            if (id === clientStub)
              return `export const getClientOS = () => "Win32";`;
            return null;
          },
        },
      ],
      build: {
        write: false,
        lib: { entry, name: "DownloadObject", formats: ["iife"] },
      },
    });
    const output = Array.isArray(result) ? result[0] : result;
    if (!("output" in output)) throw new Error("No harness bundle");
    const script = output.output.find((chunk) => chunk.type === "chunk");
    if (!script || script.type !== "chunk") throw new Error("No harness code");
    harness = runInNewContext(script.code + ";DownloadObject;", {
      console,
      window: { matchMedia: () => ({ matches: false }) },
      localStorage: { getItem: () => null },
    });
  });

  test("an object with a long key on Windows still starts a download", () => {
    // A short file name inside a deep prefix: the full key exceeds 200
    // characters although the saved file name does not.
    const key = `${"nested-folder/".repeat(15)}report.pdf`;
    expect(key.length).toBeGreaterThan(200);

    const actions: any[] = [];
    harness.downloadObject(
      (action: any) => actions.push(action),
      "bucket",
      key,
      {
        name: key,
        size: 3,
      },
    );

    expect(harness.calls).toHaveLength(1);
    expect(actions.map((action) => action.type)).toContain(
      "objectBrowser/setNewObject",
    );
  });

  test("the rename dialog's file name reaches the download request", () => {
    const key = `${"x".repeat(250)}.txt`;
    harness.downloadObject(
      () => {},
      "bucket",
      key,
      { name: key, size: 3 },
      "short.txt",
    );
    const call = harness.calls[harness.calls.length - 1];
    // download(bucket, path, versionID, size, overrideFileName, ...)
    expect(call[4]).toBe("short.txt");
  });
});
