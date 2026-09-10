// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

// Backpressure keeps only a stream chunk in memory. A failed response or an
// abort rejects pipeTo and aborts the file writer, leaving no completed ZIP.
export async function streamZipResponse(
  response: Response,
  writable: WritableStream<Uint8Array>,
  signal: AbortSignal,
  progress: (bytes: number, total: number | null) => void,
) {
  if (!response.ok || !response.body) {
    await writable.abort();
    throw new Error("Unexpected response, download incomplete.");
  }
  const length = Number(response.headers.get("Content-Length"));
  const total =
    Number.isSafeInteger(length) &&
    length > 0 &&
    !response.headers.get("Content-Encoding")
      ? length
      : null;
  let received = 0;
  try {
    await response.body
      .pipeThrough(
        new TransformStream<Uint8Array, Uint8Array>({
          transform(chunk, controller) {
            received += chunk.byteLength;
            progress(received, total);
            controller.enqueue(chunk);
          },
          flush() {
            if (total !== null && received !== total)
              throw new Error("Unexpected response, download incomplete.");
          },
        }),
      )
      .pipeTo(writable, { signal, preventClose: true });
    // A response can reach EOF while the final disk write is still pending.
    // pipeTo's shutdown then ignores a late abort: explicitly check before
    // closing, since close commits a File System Access file to disk.
    signal.throwIfAborted();
    await writable.close();
  } catch (error) {
    await writable.abort().catch(() => {});
    throw error;
  }
}
