// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  isPreviewAvailable,
  legacyPreviewObjectType,
  previewObjectType,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/Preview/previewType";
import {
  loadTextPreview,
  MAX_TEXT_PREVIEW_BYTES,
  PreviewRequestGeneration,
  requestTextPreviewObject,
  TEXT_PREVIEW_RANGE,
  TextPreviewDownloadClient,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/Preview/textPreview";

const encoder = new TextEncoder();
const metadata = (contentType?: string) =>
  contentType ? { "Content-Type": contentType } : null;

test.describe("text preview classification", () => {
  test("locks the normative conflict matrix", () => {
    const cases = [
      ["report.txt", "image/png", "image"],
      ["report.json", "application/pdf", "pdf"],
      ["server.LOG", "application/octet-stream", "text"],
      ["README", "application/json; charset=utf-8", "text"],
      ["page.html", "text/plain", "none"],
      ["page.txt", "text/html", "text"],
      ["notes.md", "text/plain", "text"],
      ["image.svg", "image/svg+xml", "image"],
    ] as const;

    for (const [name, contentType, expected] of cases) {
      expect(previewObjectType(metadata(contentType), name)).toBe(expected);
    }
  });

  test("accepts only the four target extensions, case-insensitively", () => {
    for (const extension of ["log", "txt", "json", "xml"]) {
      expect(previewObjectType(null, `file.${extension}`)).toBe("text");
      expect(previewObjectType(null, `file.${extension.toUpperCase()}`)).toBe(
        "text",
      );
    }

    expect(previewObjectType(null, "file.md")).toBe("none");
    expect(previewObjectType(null, "file.csv")).toBe("none");
  });

  test("accepts four exact normalized MIME types with parameters", () => {
    for (const contentType of [
      "text/plain",
      "application/json",
      "application/xml",
      "text/xml",
    ]) {
      expect(previewObjectType(metadata(contentType), "README")).toBe("text");
      expect(
        previewObjectType(
          metadata(`  ${contentType.toUpperCase()} ; charset=utf-8`),
          "README",
        ),
      ).toBe("text");
    }
  });

  test("rejects active HTML and XHTML extensions after legacy fallback", () => {
    for (const extension of ["html", "htm", "xhtml", "HTML", "XHTML"]) {
      expect(
        previewObjectType(metadata("text/plain"), `page.${extension}`),
      ).toBe("none");
    }

    // A legacy media result still wins before the active-extension exclusion.
    expect(previewObjectType(metadata("image/png"), "page.html")).toBe("image");
  });

  test("does not broaden text MIME matching", () => {
    for (const contentType of [
      "text/csv",
      "text/*",
      "application/ld+json",
      "application/problem+json",
      "application/json-patch+json",
      "application/xml-dtd",
      "application/octet-stream",
    ]) {
      expect(previewObjectType(metadata(contentType), "README")).toBe("none");
    }
  });

  test("preserves every legacy media family and extension precedence", () => {
    const extensionCases = [
      ["jif", "image"],
      ["svg", "image"],
      ["png", "image"],
      ["heic", "image"],
      ["pdf", "pdf"],
      ["wav", "audio"],
      ["mp3", "audio"],
      ["pcm", "audio"],
      ["mp4", "video"],
      ["webm", "video"],
      ["mpeg-4", "video"],
    ] as const;

    for (const [extension, expected] of extensionCases) {
      expect(legacyPreviewObjectType(null, `file.${extension}`)).toBe(expected);
      expect(previewObjectType(null, `file.${extension}`)).toBe(expected);
    }

    expect(previewObjectType(metadata("image/png"), "file.bin")).toBe("image");
    expect(previewObjectType(metadata("application/pdf"), "file.bin")).toBe(
      "pdf",
    );
    expect(previewObjectType(metadata("audio/mpeg"), "file.bin")).toBe("audio");
    expect(previewObjectType(metadata("video/mp4"), "file.bin")).toBe("video");
    expect(previewObjectType(metadata("video/mp4"), "file.png")).toBe("image");
  });

  test("shares the full type, permission, marker, and prefix decision", () => {
    const eligible = {
      metaData: metadata("text/plain"),
      objectName: "file.txt",
      canGetObject: true,
    };

    expect(isPreviewAvailable(eligible)).toBe(true);
    expect(isPreviewAvailable({ ...eligible, canGetObject: false })).toBe(
      false,
    );
    expect(isPreviewAvailable({ ...eligible, isDeleteMarker: true })).toBe(
      false,
    );
    expect(isPreviewAvailable({ ...eligible, isPrefix: true })).toBe(false);
    expect(
      isPreviewAvailable({
        ...eligible,
        metaData: null,
        objectName: "file.bin",
      }),
    ).toBe(false);
  });
});

const response = (body: BodyInit | null, status = 200, headers?: HeadersInit) =>
  new Response(body, { status, headers });

const loadResponse = async (
  body: BodyInit | null,
  options: {
    knownSize?: number;
    status?: number;
    headers?: HeadersInit;
  } = {},
) => {
  const controller = new AbortController();
  let requests = 0;
  const result = await loadTextPreview({
    knownSize: options.knownSize,
    signal: controller.signal,
    request: async () => {
      requests += 1;
      return response(body, options.status, options.headers);
    },
  });
  return { requests, result };
};

test.describe("bounded text loading", () => {
  test("confirms zero bytes with the server", async () => {
    const loaded = await loadResponse(null, {
      knownSize: 0,
      headers: { "Content-Length": "0" },
    });
    expect(loaded.requests).toBe(1);
    expect(loaded.result).toEqual({ status: "empty", byteLength: 0 });
  });

  test("loads a one-byte object", async () => {
    const loaded = await loadResponse(encoder.encode("a"), { knownSize: 1 });
    expect(loaded.requests).toBe(1);
    expect(loaded.result).toEqual({
      status: "success",
      content: "a",
      byteLength: 1,
    });
  });

  test("accepts exactly 1 MiB", async () => {
    const bytes = new Uint8Array(MAX_TEXT_PREVIEW_BYTES).fill(0x61);
    const loaded = await loadResponse(bytes, {
      knownSize: MAX_TEXT_PREVIEW_BYTES,
    });
    expect(loaded.requests).toBe(1);
    expect(loaded.result.status).toBe("success");
    if (loaded.result.status === "success") {
      expect(loaded.result.byteLength).toBe(MAX_TEXT_PREVIEW_BYTES);
      expect(loaded.result.content).toHaveLength(MAX_TEXT_PREVIEW_BYTES);
    }
  });

  test("rejects known 1 MiB plus one without a body request", async () => {
    const loaded = await loadResponse(encoder.encode("must not be requested"), {
      knownSize: MAX_TEXT_PREVIEW_BYTES + 1,
    });
    expect(loaded.requests).toBe(0);
    expect(loaded.result).toEqual({
      status: "too_large",
      objectSize: MAX_TEXT_PREVIEW_BYTES + 1,
    });
  });

  test("bounds an unknown-size object", async () => {
    const loaded = await loadResponse(encoder.encode("unknown"));
    expect(loaded.requests).toBe(1);
    expect(loaded.result).toEqual({
      status: "success",
      content: "unknown",
      byteLength: 7,
    });
  });

  test("accepts a complete 206 response after inspecting Content-Range", async () => {
    const loaded = await loadResponse(encoder.encode("hello"), {
      status: 206,
      headers: {
        "Content-Range": "bytes 0-4/5",
        "Content-Length": "5",
      },
    });
    expect(loaded.result).toEqual({
      status: "success",
      content: "hello",
      byteLength: 5,
    });
  });

  test("rejects an incomplete or unverifiable 206 response", async () => {
    for (const contentRange of [
      undefined,
      "bytes 0-3/5",
      "bytes 1-4/5",
    ] as const) {
      const loaded = await loadResponse(encoder.encode("part"), {
        status: 206,
        headers: contentRange ? { "Content-Range": contentRange } : undefined,
      });
      expect(loaded.result).toEqual({ status: "error" });
    }
  });

  test("uses Content-Range to reject an oversized object", async () => {
    for (const objectSize of [
      MAX_TEXT_PREVIEW_BYTES + 1,
      MAX_TEXT_PREVIEW_BYTES * 4,
    ]) {
      const loaded = await loadResponse(
        encoder.encode("prefix must stay hidden"),
        {
          status: 206,
          headers: {
            "Content-Range": `bytes 0-${MAX_TEXT_PREVIEW_BYTES}/${objectSize}`,
          },
        },
      );
      expect(loaded.result).toEqual({
        status: "too_large",
        objectSize,
      });
    }
  });

  test("enforces the limit when Range is ignored with a 200", async () => {
    const bytes = new Uint8Array(MAX_TEXT_PREVIEW_BYTES + 1).fill(0x61);
    const loaded = await loadResponse(bytes);
    expect(loaded.result).toEqual({
      status: "too_large",
      objectSize: undefined,
    });
  });

  test("handles missing, malformed, and incorrect Content-Length safely", async () => {
    const missing = await loadResponse(encoder.encode("ok"));
    expect(missing.result.status).toBe("success");

    const malformed = await loadResponse(encoder.encode("ok"), {
      headers: { "Content-Length": "not-a-number" },
    });
    expect(malformed.result.status).toBe("success");

    const incorrect = await loadResponse(encoder.encode("two"), {
      headers: { "Content-Length": "2" },
    });
    expect(incorrect.result).toEqual({ status: "error" });
  });

  test("rejects a revealing oversized Content-Length before reading", async () => {
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      cancel: () => {
        cancelled = true;
      },
    });
    const controller = new AbortController();
    const result = await loadTextPreview({
      signal: controller.signal,
      request: async () =>
        response(stream, 200, {
          "Content-Length": `${MAX_TEXT_PREVIEW_BYTES + 1}`,
        }),
    });
    expect(result).toEqual({
      status: "too_large",
      objectSize: MAX_TEXT_PREVIEW_BYTES + 1,
    });
    expect(cancelled).toBe(true);
  });

  test("treats list size as a hint and displays the complete current object", async () => {
    const loaded = await loadResponse(encoder.encode("changed"), {
      knownSize: 1,
    });
    expect(loaded.result).toEqual({
      status: "success",
      content: "changed",
      byteLength: 7,
    });
  });
});

test.describe("strict UTF-8 and source fidelity", () => {
  test("strips BOM while preserving Chinese, emoji, TAB, LF, and CRLF", async () => {
    const text = "中文🙂\tcolumn\nline\r\nend";
    const encoded = encoder.encode(text);
    const bytes = new Uint8Array(encoded.byteLength + 3);
    bytes.set([0xef, 0xbb, 0xbf]);
    bytes.set(encoded, 3);

    const loaded = await loadResponse(bytes, { knownSize: bytes.byteLength });
    expect(loaded.result).toEqual({
      status: "success",
      content: text,
      byteLength: bytes.byteLength,
    });
  });

  test("rejects invalid UTF-8 without replacement", async () => {
    const loaded = await loadResponse(new Uint8Array([0xc3, 0x28]));
    expect(loaded.result).toEqual({ status: "invalid_text" });
  });

  test("rejects decoded NUL as binary content", async () => {
    const loaded = await loadResponse(new Uint8Array([0x61, 0x00, 0x62]));
    expect(loaded.result).toEqual({ status: "invalid_text" });
  });

  test("preserves JSON big integers, duplicate keys, and whitespace", async () => {
    const json = '{\n  "n": 900719925474099312345,\n  "dup": 1, "dup": 2\n}\n';
    const loaded = await loadResponse(encoder.encode(json));
    expect(loaded.result).toEqual({
      status: "success",
      content: json,
      byteLength: encoder.encode(json).byteLength,
    });
  });

  test("preserves XML declarations, stylesheet, DOCTYPE, and CDATA", async () => {
    const xml =
      '<?xml version="1.0"?>\n<?xml-stylesheet href="https://invalid.example/x.xsl"?>\n<!DOCTYPE root [<!ENTITY ext SYSTEM "https://invalid.example/entity">]>\n<root><![CDATA[<script>alert(1)</script>]]></root>\n';
    const loaded = await loadResponse(encoder.encode(xml));
    expect(loaded.result).toEqual({
      status: "success",
      content: xml,
      byteLength: encoder.encode(xml).byteLength,
    });
  });
});

test.describe("request identity, permissions, and cancellation", () => {
  test("uses the generated client contract for current and historical objects", async () => {
    const calls: any[] = [];
    const client: TextPreviewDownloadClient = {
      downloadObject: async (...args) => {
        calls.push(args);
        return response(encoder.encode("ok"));
      },
    };

    const currentController = new AbortController();
    await requestTextPreviewObject({
      client,
      bucketName: "bucket name",
      objectName: "folder/current.txt",
      anonymous: false,
      signal: currentController.signal,
    });

    const versionController = new AbortController();
    await requestTextPreviewObject({
      client,
      bucketName: "bucket name",
      objectName: "folder/history.json",
      versionID: "version-123",
      anonymous: true,
      signal: versionController.signal,
    });

    expect(calls[0][1]).toEqual({ prefix: "folder/current.txt" });
    expect(calls[0][1]).not.toHaveProperty("preview");
    expect(calls[0][2]).toEqual({
      credentials: "same-origin",
      headers: { Range: TEXT_PREVIEW_RANGE },
      signal: currentController.signal,
    });
    expect(calls[1][1]).toEqual({
      prefix: "folder/history.json",
      version_id: "version-123",
    });
    expect(calls[1][1]).not.toHaveProperty("preview");
    expect(calls[1][2]).toEqual({
      credentials: "same-origin",
      headers: { Range: TEXT_PREVIEW_RANGE, "X-Anonymous": "1" },
      signal: versionController.signal,
    });
  });

  test("preserves the null version ID", async () => {
    let query: Record<string, unknown> | undefined;
    const client: TextPreviewDownloadClient = {
      downloadObject: async (_bucket, requestQuery) => {
        query = requestQuery;
        return response(null);
      },
    };
    const controller = new AbortController();

    await requestTextPreviewObject({
      client,
      bucketName: "bucket",
      objectName: "legacy.txt",
      versionID: "null",
      anonymous: false,
      signal: controller.signal,
    });
    expect(query).toEqual({ prefix: "legacy.txt", version_id: "null" });
  });

  test("maps HTTP failures without consuming their bodies", async () => {
    const cases = [
      [401, "forbidden"],
      [403, "forbidden"],
      [404, "not_found"],
      [416, "not_found"],
      [500, "error"],
    ] as const;

    for (const [status, expected] of cases) {
      const errorResponse = response(
        encoder.encode(`<script>status-${status}</script>`),
        status,
      );
      const controller = new AbortController();
      const result = await loadTextPreview({
        signal: controller.signal,
        request: async () => {
          throw errorResponse;
        },
      });
      expect(result.status).toBe(expected);
      expect(errorResponse.bodyUsed).toBe(false);
      expect(result).not.toHaveProperty("content");
    }
  });

  test("treats an aborted request as silent cancellation", async () => {
    const controller = new AbortController();
    const pending = loadTextPreview({
      signal: controller.signal,
      request: () =>
        new Promise<Response>((_resolve, reject) => {
          controller.signal.addEventListener("abort", () => {
            reject(new DOMException("closed", "AbortError"));
          });
        }),
    });

    controller.abort();
    await expect(pending).resolves.toEqual({ status: "aborted" });
  });

  test("cancels cleanly while a response stream is still open", async () => {
    const controller = new AbortController();
    const stream = new ReadableStream<Uint8Array>({
      start(streamController) {
        streamController.enqueue(encoder.encode("old object"));
        controller.signal.addEventListener("abort", () => {
          streamController.error(new DOMException("switched", "AbortError"));
        });
      },
    });
    const pending = loadTextPreview({
      signal: controller.signal,
      request: async () => response(stream),
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    controller.abort();
    await expect(pending).resolves.toEqual({ status: "aborted" });
  });

  test("invalidates late generations after a switch or close", () => {
    const generations = new PreviewRequestGeneration();
    const oldObject = generations.begin();
    const newObject = generations.begin();

    expect(generations.isCurrent(oldObject)).toBe(false);
    expect(generations.isCurrent(newObject)).toBe(true);

    generations.invalidate();
    expect(generations.isCurrent(newObject)).toBe(false);
  });
});
