// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

export const MAX_TEXT_PREVIEW_BYTES = 1_048_576;
export const TEXT_PREVIEW_RANGE = `bytes=0-${MAX_TEXT_PREVIEW_BYTES}`;

export type TextPreviewResult =
  | { status: "success"; content: string; byteLength: number }
  | { status: "empty"; byteLength: number }
  | { status: "too_large"; objectSize?: number }
  | { status: "invalid_text" }
  | { status: "forbidden" }
  | { status: "not_found" }
  | { status: "error" }
  | { status: "aborted" };

export interface TextPreviewDownloadClient {
  downloadObject: (
    bucketName: string,
    query: {
      prefix: string;
      version_id?: string;
    },
    params: {
      credentials: "same-origin";
      headers: Record<string, string>;
      signal: AbortSignal;
    },
  ) => Promise<Response>;
}

interface TextPreviewRequest {
  client: TextPreviewDownloadClient;
  bucketName: string;
  objectName: string;
  versionID?: string;
  anonymous: boolean;
  signal: AbortSignal;
}

export const requestTextPreviewObject = ({
  client,
  bucketName,
  objectName,
  versionID,
  anonymous,
  signal,
}: TextPreviewRequest): Promise<Response> =>
  client.downloadObject(
    bucketName,
    {
      prefix: objectName,
      ...(versionID ? { version_id: versionID } : {}),
    },
    {
      credentials: "same-origin",
      headers: {
        Range: TEXT_PREVIEW_RANGE,
        ...(anonymous ? { "X-Anonymous": "1" } : {}),
      },
      signal,
    },
  );

interface ContentRange {
  start: number;
  end: number;
  total?: number;
}

const parseNonNegativeInteger = (value: string | null): number | undefined => {
  if (!value || !/^\d+$/.test(value.trim())) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
};

const parseContentRange = (value: string | null): ContentRange | undefined => {
  if (!value) {
    return undefined;
  }

  const match = /^bytes\s+(\d+)-(\d+)\/(\d+|\*)$/i.exec(value.trim());
  if (!match) {
    return undefined;
  }

  const start = Number(match[1]);
  const end = Number(match[2]);
  const total = match[3] === "*" ? undefined : Number(match[3]);

  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    end < start ||
    (total !== undefined &&
      (!Number.isSafeInteger(total) || total <= end || total < 1))
  ) {
    return undefined;
  }

  return { start, end, total };
};

const resultForHTTPStatus = (status: number): TextPreviewResult => {
  if (status === 401 || status === 403) {
    return { status: "forbidden" };
  }

  if (status === 404 || status === 410 || status === 412 || status === 416) {
    return { status: "not_found" };
  }

  return { status: "error" };
};

const errorStatus = (error: unknown): number | undefined => {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return undefined;
};

const isAbortError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "name" in error &&
  error.name === "AbortError";

const cancelResponseBody = async (response: Response): Promise<void> => {
  if (!response.body) {
    return;
  }

  try {
    await response.body.cancel();
  } catch {
    // The response may already have been cancelled by the request signal.
  }
};

const readTextPreviewResponse = async (
  response: Response,
  signal: AbortSignal,
): Promise<TextPreviewResult> => {
  if (signal.aborted) {
    await cancelResponseBody(response);
    return { status: "aborted" };
  }

  if (!response.ok) {
    await cancelResponseBody(response);
    return resultForHTTPStatus(response.status);
  }

  const contentRangeHeader = response.headers.get("Content-Range");
  const contentRange = parseContentRange(contentRangeHeader);
  const contentLength = parseNonNegativeInteger(
    response.headers.get("Content-Length"),
  );

  if (response.status === 206) {
    if (
      !contentRange ||
      contentRange.start !== 0 ||
      contentRange.total === undefined
    ) {
      await cancelResponseBody(response);
      return { status: "error" };
    }
  } else if (contentRangeHeader && !contentRange) {
    await cancelResponseBody(response);
    return { status: "error" };
  }

  const contentRangeSize = contentRange?.total;
  if (
    (contentRangeSize !== undefined &&
      contentRangeSize > MAX_TEXT_PREVIEW_BYTES) ||
    (contentLength !== undefined && contentLength > MAX_TEXT_PREVIEW_BYTES)
  ) {
    await cancelResponseBody(response);
    return {
      status: "too_large",
      objectSize: contentRangeSize ?? contentLength,
    };
  }

  if (
    response.status === 206 &&
    contentRange &&
    contentRange.total !== undefined &&
    contentRange.end !== contentRange.total - 1
  ) {
    await cancelResponseBody(response);
    return { status: "error" };
  }

  if (!response.body) {
    return contentLength === undefined || contentLength === 0
      ? { status: "empty", byteLength: 0 }
      : { status: "error" };
  }

  const reader = response.body.getReader();
  const retainedBytes = new Uint8Array(MAX_TEXT_PREVIEW_BYTES + 1);
  let byteLength = 0;

  try {
    while (true) {
      if (signal.aborted) {
        await reader.cancel();
        return { status: "aborted" };
      }

      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!value || value.byteLength === 0) {
        continue;
      }

      const copyLength = Math.min(
        value.byteLength,
        retainedBytes.byteLength - byteLength,
      );
      retainedBytes.set(value.subarray(0, copyLength), byteLength);
      byteLength += copyLength;

      if (
        byteLength > MAX_TEXT_PREVIEW_BYTES ||
        copyLength < value.byteLength
      ) {
        await reader.cancel();
        return { status: "too_large", objectSize: contentRangeSize };
      }
    }
  } catch (error) {
    if (signal.aborted || isAbortError(error)) {
      return { status: "aborted" };
    }
    return { status: "error" };
  } finally {
    reader.releaseLock();
  }

  if (
    (contentRangeSize !== undefined && contentRangeSize !== byteLength) ||
    (contentLength !== undefined && contentLength !== byteLength)
  ) {
    return { status: "error" };
  }

  let content: string;
  try {
    content = new TextDecoder("utf-8", { fatal: true }).decode(
      retainedBytes.subarray(0, byteLength),
    );
  } catch {
    return { status: "invalid_text" };
  }

  if (content.includes("\0")) {
    return { status: "invalid_text" };
  }

  return content.length === 0
    ? { status: "empty", byteLength }
    : { status: "success", content, byteLength };
};

interface LoadTextPreviewOptions {
  knownSize?: number;
  signal: AbortSignal;
  request: () => Promise<Response>;
}

export const loadTextPreview = async ({
  knownSize,
  signal,
  request,
}: LoadTextPreviewOptions): Promise<TextPreviewResult> => {
  const usableKnownSize =
    knownSize !== undefined && Number.isSafeInteger(knownSize) && knownSize >= 0
      ? knownSize
      : undefined;

  if (
    usableKnownSize !== undefined &&
    usableKnownSize > MAX_TEXT_PREVIEW_BYTES
  ) {
    return { status: "too_large", objectSize: usableKnownSize };
  }

  let response: Response;
  try {
    response = await request();
  } catch (error) {
    if (signal.aborted || isAbortError(error)) {
      return { status: "aborted" };
    }

    const status = errorStatus(error);
    return status === undefined
      ? { status: "error" }
      : resultForHTTPStatus(status);
  }

  return readTextPreviewResponse(response, signal);
};

export class PreviewRequestGeneration {
  private current = 0;

  begin(): number {
    this.current += 1;
    return this.current;
  }

  invalidate(): void {
    this.current += 1;
  }

  isCurrent(generation: number): boolean {
    return generation === this.current;
  }
}
