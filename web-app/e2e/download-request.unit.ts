// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  attachDownloadRequestHandlers,
  downloadErrorMessage,
  downloadFilename,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/downloadRequest";

class FakeDownloadRequest {
  readyState = 1;
  response = new Blob();
  status = 0;
  onabort: XMLHttpRequest["onabort"] = null;
  onerror: XMLHttpRequest["onerror"] = null;
  onreadystatechange: XMLHttpRequest["onreadystatechange"] = null;
  private headers = new Map<string, string>();
  private progressListener: ((event: ProgressEvent) => void) | null = null;

  addEventListener(
    _type: "progress",
    listener: (event: ProgressEvent) => void,
  ) {
    this.progressListener = listener;
  }

  getResponseHeader(name: string) {
    return this.headers.get(name.toLowerCase()) || null;
  }

  setHeader(name: string, value: string) {
    this.headers.set(name.toLowerCase(), value);
  }

  finish(status: number, response: Blob) {
    this.status = status;
    this.response = response;
    this.readyState = 4;
    this.onreadystatechange?.call(
      this as unknown as XMLHttpRequest,
      {} as Event,
    );
  }

  progress(loaded: number, total: number) {
    this.progressListener?.({
      lengthComputable: total > 0,
      loaded,
      total,
    } as ProgressEvent);
  }
}

const setup = () => {
  const request = new FakeDownloadRequest();
  const calls = {
    abort: 0,
    cleanup: 0,
    complete: 0,
    errors: [] as string[],
    progress: [] as number[],
    saved: [] as Array<{ blob: Blob; filename: string }>,
  };
  const lifecycle = attachDownloadRequestHandlers(request, {
    expectedSize: 4,
    fallbackError: "incomplete",
    networkError: "network",
    handlers: {
      abort: () => calls.abort++,
      cleanup: () => calls.cleanup++,
      complete: () => calls.complete++,
      fail: (message) => calls.errors.push(message),
      progress: (percent) => calls.progress.push(percent),
      save: (blob, filename) => calls.saved.push({ blob, filename }),
    },
  });
  return { calls, lifecycle, request };
};

test.describe("download request lifecycle", () => {
  test("completes and cleans up exactly once", () => {
    const { calls, lifecycle, request } = setup();
    request.setHeader("Content-Disposition", 'attachment; filename="file.txt"');
    request.progress(2, 4);
    request.finish(200, new Blob(["data"]));
    request.onerror?.call(
      request as unknown as XMLHttpRequest,
      {} as ProgressEvent<EventTarget>,
    );

    expect(calls.progress).toEqual([50]);
    expect(calls.saved[0].filename).toBe("file.txt");
    expect(calls.complete).toBe(1);
    expect(calls.cleanup).toBe(1);
    expect(calls.errors).toEqual([]);
    expect(lifecycle.isSettled()).toBe(true);
  });

  test("reads parameterized JSON error blobs", async () => {
    const { calls, request } = setup();
    request.setHeader("Content-Type", "application/json; charset=utf-8");
    request.finish(
      403,
      new Blob([JSON.stringify({ detailedMessage: "denied" })]),
    );
    await expect.poll(() => calls.errors).toEqual(["denied"]);
    expect(calls.cleanup).toBe(1);
  });

  test("falls back for malformed JSON", async () => {
    expect(
      await downloadErrorMessage(
        new Blob(["not json"]),
        "application/json",
        "fallback",
      ),
    ).toBe("fallback");
  });

  test("settles network errors exactly once", () => {
    const { calls, request } = setup();
    request.onerror?.call(
      request as unknown as XMLHttpRequest,
      {} as ProgressEvent<EventTarget>,
    );
    request.onerror?.call(
      request as unknown as XMLHttpRequest,
      {} as ProgressEvent<EventTarget>,
    );
    expect(calls.errors).toEqual(["network"]);
    expect(calls.cleanup).toBe(1);
  });

  test("settles aborts exactly once", () => {
    const { calls, request } = setup();
    request.onabort?.call(
      request as unknown as XMLHttpRequest,
      {} as ProgressEvent<EventTarget>,
    );
    request.onerror?.call(
      request as unknown as XMLHttpRequest,
      {} as ProgressEvent<EventTarget>,
    );
    expect(calls.abort).toBe(1);
    expect(calls.cleanup).toBe(1);
    expect(calls.errors).toEqual([]);
  });

  test("does not treat status zero ready-state changes as HTTP errors", () => {
    const { calls, request } = setup();
    request.finish(0, new Blob());
    expect(calls.cleanup).toBe(0);
    request.onabort?.call(
      request as unknown as XMLHttpRequest,
      {} as ProgressEvent<EventTarget>,
    );
    expect(calls.abort).toBe(1);
  });

  test("decodes the server filename defensively", () => {
    expect(downloadFilename('attachment; filename="folder%20name.zip"')).toBe(
      "folder name.zip",
    );
    expect(downloadFilename("%not-encoded")).toBe("download");
  });
});
