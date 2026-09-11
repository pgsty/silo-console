// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "@playwright/test";
import { streamZipResponse } from "../src/screens/Console/Buckets/ListBuckets/Objects/zipDownload";

for (const known of [true, false]) {
  test(`ZIP streams chunks with ${known ? "determinate" : "indeterminate"} progress`, async () => {
    const written: number[] = [];
    const progress: [number, number | null][] = [];
    let closed = false;
    const response = new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array([1, 2]));
          controller.enqueue(new Uint8Array([3]));
          controller.close();
        },
      }),
      { headers: known ? { "Content-Length": "3" } : {} },
    );
    // The implementation must never convert the full response to a Blob.
    response.blob = async () => {
      throw new Error("full response buffered");
    };
    await streamZipResponse(
      response,
      new WritableStream({
        write(chunk) {
          written.push(...chunk);
        },
        close() {
          closed = true;
        },
      }),
      new AbortController().signal,
      (bytes, total) => progress.push([bytes, total]),
    );
    expect(written).toEqual([1, 2, 3]);
    expect(closed).toBe(true);
    expect(progress).toEqual([
      [2, known ? 3 : null],
      [3, known ? 3 : null],
    ]);
  });
}
test("cancel aborts the writer and upstream without committing a file", async () => {
  const controller = new AbortController();
  let aborted = false,
    cancelled = false,
    closed = false;
  const response = new Response(
    new ReadableStream({
      pull(stream) {
        stream.enqueue(new Uint8Array(8192));
      },
      cancel() {
        cancelled = true;
      },
    }),
  );
  const writer = new WritableStream<Uint8Array>({
    write() {
      controller.abort();
    },
    abort() {
      aborted = true;
    },
    close() {
      closed = true;
    },
  });
  await expect(
    streamZipResponse(response, writer, controller.signal, () => {}),
  ).rejects.toThrow();
  expect(aborted).toBe(true);
  expect(cancelled).toBe(true);
  expect(closed).toBe(false);
});
for (const failure of ["http", "truncated", "network"] as const) {
  test(`${failure} failure never commits a completed ZIP`, async () => {
    let aborted = false,
      closed = false;
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(new Uint8Array([1]));
        if (failure === "network") c.error(new Error("connection lost"));
        else c.close();
      },
    });
    const response = new Response(body, {
      status: failure === "http" ? 403 : 200,
      headers: failure === "truncated" ? { "Content-Length": "100" } : {},
    });
    const writer = new WritableStream<Uint8Array>({
      abort() {
        aborted = true;
      },
      close() {
        closed = true;
      },
    });
    await expect(
      streamZipResponse(
        response,
        writer,
        new AbortController().signal,
        () => {},
      ),
    ).rejects.toThrow();
    expect(aborted).toBe(true);
    expect(closed).toBe(false);
  });
}

test("cancelling after EOF while the final write is pending never commits the file", async () => {
  const controller = new AbortController();
  let releaseWrite!: () => void;
  let writing!: () => void;
  const started = new Promise<void>((resolve) => {
    writing = resolve;
  });
  let closed = false,
    aborted = false;
  const response = new Response(new Uint8Array([1, 2, 3]));
  const writable = new WritableStream<Uint8Array>({
    async write() {
      writing();
      await new Promise<void>((resolve) => {
        releaseWrite = resolve;
      });
    },
    close() {
      closed = true;
    },
    abort() {
      aborted = true;
    },
  });
  const result = streamZipResponse(
    response,
    writable,
    controller.signal,
    () => {},
  );
  const rejected = expect(result).rejects.toThrow();
  await started;
  controller.abort();
  releaseWrite();
  await rejected;
  expect(aborted).toBe(true);
  expect(closed).toBe(false);
});
