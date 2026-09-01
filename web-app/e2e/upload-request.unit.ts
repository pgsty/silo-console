// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  attachUploadRequestHandlers,
  uploadControl,
  uploadErrorMessage,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/uploadRequest";

type Listener = (event: ProgressEvent) => void;

class FakeUploadRequest {
  status = 0;
  response: unknown = "";
  sent = false;
  done = false;
  throwOnSend = false;
  body: FormData | null = null;
  onload: XMLHttpRequest["onload"] = null;
  onerror: XMLHttpRequest["onerror"] = null;
  onabort: XMLHttpRequest["onabort"] = null;
  ontimeout: XMLHttpRequest["ontimeout"] = null;
  private listeners: Record<string, Listener[]> = { progress: [], error: [] };
  upload = {
    addEventListener: (type: "progress" | "error", listener: Listener) => {
      this.listeners[type].push(listener);
    },
  };

  private fire(handler: ((this: XMLHttpRequest, ev: any) => any) | null) {
    handler?.call(this as unknown as XMLHttpRequest, {} as ProgressEvent);
  }

  // XMLHttpRequest.send(): throws unless the request is OPENED and unsent.
  send(body: FormData) {
    if (this.sent || this.throwOnSend) {
      throw new Error("InvalidStateError");
    }
    this.sent = true;
    this.body = body;
  }

  load(status: number, response: unknown = "") {
    this.status = status;
    this.response = response;
    this.done = true;
    this.fire(this.onload);
  }

  networkError() {
    this.fire(this.onerror);
  }

  uploadError() {
    this.listeners.error.forEach((listener) => listener({} as ProgressEvent));
  }

  // XMLHttpRequest.abort(): the abort event fires only while a sent request
  // is still in flight (WHATWG XHR, "abort()" and the request error steps).
  abort() {
    if (this.sent && !this.done) {
      this.done = true;
      this.fire(this.onabort);
    }
  }

  timeout() {
    this.fire(this.ontimeout);
  }

  progress(loaded: number, total: number, lengthComputable = true) {
    this.listeners.progress.forEach((listener) =>
      listener({ lengthComputable, loaded, total } as ProgressEvent),
    );
  }
}

const setup = () => {
  const request = new FakeUploadRequest();
  const calls = {
    order: [] as string[],
    abort: 0,
    cleanup: 0,
    complete: [] as number[],
    failures: [] as Array<{ message: string; status: number }>,
    progress: [] as number[],
  };
  const lifecycle = attachUploadRequestHandlers(request, {
    fallbackError: "upload failed",
    malformedError: "something went wrong",
    networkError: "network",
    statusErrors: { 413: "too large" },
    handlers: {
      cleanup: () => {
        calls.cleanup++;
        calls.order.push("cleanup");
      },
      complete: (status) => {
        calls.complete.push(status);
        calls.order.push("complete");
      },
      fail: (message, status) => {
        calls.failures.push({ message, status });
        calls.order.push("fail");
      },
      abort: () => {
        calls.abort++;
        calls.order.push("abort");
      },
      progress: (percent) => calls.progress.push(percent),
    },
  });
  return { calls, lifecycle, request };
};

test.describe("upload request lifecycle", () => {
  test("success cleans up first and exactly once", () => {
    const { calls, lifecycle, request } = setup();
    request.progress(1, 4);
    request.progress(4, 4);
    request.load(200);
    request.networkError();
    request.abort();

    expect(calls.progress).toEqual([25, 100]);
    expect(calls.order).toEqual(["cleanup", "complete"]);
    expect(calls.complete).toEqual([200]);
    expect(calls.cleanup).toBe(1);
    expect(lifecycle.isSettled()).toBe(true);
  });

  test("HTTP failures map status, JSON details and malformed bodies", () => {
    const { calls, request } = setup();
    request.load(413, "<html>too large</html>");
    expect(calls.failures).toEqual([{ message: "too large", status: 413 }]);
    expect(calls.cleanup).toBe(1);

    const json = setup();
    json.request.load(403, JSON.stringify({ detailedMessage: "denied" }));
    expect(json.calls.failures).toEqual([{ message: "denied", status: 403 }]);

    const malformed = setup();
    malformed.request.load(500, "not json");
    expect(malformed.calls.failures).toEqual([
      { message: "something went wrong", status: 500 },
    ]);

    const empty = setup();
    empty.request.load(502, "");
    expect(empty.calls.failures).toEqual([
      { message: "upload failed", status: 502 },
    ]);
  });

  test("network errors on the request and on the upload stream settle once", () => {
    const { calls, request } = setup();
    request.uploadError();
    request.networkError();
    request.load(0);
    expect(calls.failures).toEqual([{ message: "network", status: 0 }]);
    expect(calls.cleanup).toBe(1);

    const timedOut = setup();
    timedOut.request.timeout();
    expect(timedOut.calls.failures).toEqual([
      { message: "network", status: 0 },
    ]);
    expect(timedOut.calls.cleanup).toBe(1);
  });

  test("aborts release the trace and never report a failure", () => {
    const { calls, request } = setup();
    request.send(new FormData());
    request.abort();
    request.networkError();
    request.load(200);
    expect(calls.order).toEqual(["cleanup", "abort"]);
    expect(calls.failures).toEqual([]);
    expect(calls.complete).toEqual([]);
    expect(calls.cleanup).toBe(1);
  });

  test("setup failures settle through the same path", () => {
    const { calls, lifecycle, request } = setup();
    expect(lifecycle.finalize("error", "setup exploded")).toBe(true);
    expect(lifecycle.finalize("error", "again")).toBe(false);
    request.load(200);
    expect(calls.failures).toEqual([{ message: "setup exploded", status: 0 }]);
    expect(calls.cleanup).toBe(1);
  });

  test("progress is ignored once settled and when the size is unknown", () => {
    const { calls, request } = setup();
    request.progress(1, 0, false);
    request.progress(5, 4);
    request.load(201);
    request.progress(2, 4);
    expect(calls.progress).toEqual([100]);
  });

  test("a throwing outcome handler cannot keep the trace alive", () => {
    const request = new FakeUploadRequest();
    let cleaned = 0;
    attachUploadRequestHandlers(request, {
      fallbackError: "upload failed",
      malformedError: "something went wrong",
      networkError: "network",
      handlers: {
        cleanup: () => cleaned++,
        complete: () => {
          throw new Error("consumer bug");
        },
        fail: () => {},
        abort: () => {},
        progress: () => {},
      },
    });
    expect(() => request.load(200)).toThrow("consumer bug");
    expect(cleaned).toBe(1);
  });

  test("uploadErrorMessage prefers the status table, then JSON fields", () => {
    const options = {
      fallbackError: "fallback",
      malformedError: "malformed",
      statusErrors: { 413: "too large" },
    };
    expect(uploadErrorMessage(413, '{"message":"x"}', options)).toBe(
      "too large",
    );
    expect(uploadErrorMessage(400, '{"message":"bad"}', options)).toBe("bad");
    expect(uploadErrorMessage(400, "{}", options)).toBe("fallback");
    expect(uploadErrorMessage(400, "{", options)).toBe("malformed");
    expect(uploadErrorMessage(400, new Blob(), options)).toBe("fallback");
  });
});

test.describe("upload control", () => {
  const controlled = () => {
    const base = setup();
    const control = uploadControl(
      base.request,
      new FormData(),
      base.lifecycle,
      "setup failed",
    );
    return { ...base, control };
  };

  test("cancelling a queued upload settles it although no abort event fires", () => {
    const { calls, control, request } = controlled();
    control.cancel();
    expect(request.sent).toBe(false);
    expect(calls.order).toEqual(["cleanup", "abort"]);
    expect(calls.cleanup).toBe(1);
    expect(calls.failures).toEqual([]);
    // Its turn in the queue must not send it after all.
    control.send();
    expect(request.sent).toBe(false);
  });

  test("cancelling an upload in flight settles it exactly once", () => {
    const { calls, control, request } = controlled();
    control.send();
    expect(request.sent).toBe(true);
    control.cancel();
    expect(calls.order).toEqual(["cleanup", "abort"]);
    expect(calls.abort).toBe(1);
    expect(calls.cleanup).toBe(1);
  });

  test("a synchronous send failure settles as an error", () => {
    const { calls, control, request } = controlled();
    request.throwOnSend = true;
    control.send();
    expect(calls.failures).toEqual([
      { message: "InvalidStateError", status: 0 },
    ]);
    expect(calls.cleanup).toBe(1);
    control.cancel();
    expect(calls.cleanup).toBe(1);
  });

  test("cancelling after completion changes nothing", () => {
    const { calls, control, request } = controlled();
    control.send();
    request.load(200);
    control.cancel();
    expect(calls.order).toEqual(["cleanup", "complete"]);
  });
});
