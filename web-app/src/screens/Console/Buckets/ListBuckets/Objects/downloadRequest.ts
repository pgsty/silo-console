// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { calculateDownloadPercent } from "./downloadProgress";

interface DownloadRequestLike {
  readyState: number;
  response: Blob;
  status: number;
  onabort: XMLHttpRequest["onabort"];
  onerror: XMLHttpRequest["onerror"];
  onreadystatechange: XMLHttpRequest["onreadystatechange"];
  addEventListener: (
    type: "progress",
    listener: (event: ProgressEvent) => void,
  ) => void;
  getResponseHeader: (name: string) => string | null;
}

interface DownloadRequestHandlers {
  cleanup: () => void;
  complete: () => void;
  fail: (message: string) => void;
  abort: () => void;
  progress: (percent: number) => void;
  save: (blob: Blob, filename: string) => void;
}

interface AttachDownloadRequestOptions {
  expectedSize: number;
  fallbackError: string;
  networkError: string;
  handlers: DownloadRequestHandlers;
}

const normalizedContentType = (contentType: string | null): string =>
  (contentType || "").split(";", 1)[0].trim().toLowerCase();

export const downloadErrorMessage = async (
  response: Blob,
  contentType: string | null,
  fallback: string,
): Promise<string> => {
  if (normalizedContentType(contentType) !== "application/json") {
    return fallback;
  }

  try {
    const body = JSON.parse(await response.text()) as {
      detailedMessage?: unknown;
      message?: unknown;
    };
    if (typeof body.detailedMessage === "string" && body.detailedMessage) {
      return body.detailedMessage;
    }
    if (typeof body.message === "string" && body.message) {
      return body.message;
    }
  } catch {
    // A malformed server error must still settle the transfer with fallback UI.
  }

  return fallback;
};

export const downloadFilename = (contentDisposition: string | null): string => {
  if (!contentDisposition) {
    return "download";
  }

  try {
    const decoded = decodeURIComponent(contentDisposition);
    return /filename="([^"]*)"/i.exec(decoded)?.[1] || "download";
  } catch {
    return "download";
  }
};

export const attachDownloadRequestHandlers = (
  request: DownloadRequestLike,
  options: AttachDownloadRequestOptions,
) => {
  let settled = false;

  const finalize = (
    kind: "abort" | "complete" | "error",
    message = "",
  ): boolean => {
    if (settled) {
      return false;
    }
    settled = true;
    options.handlers.cleanup();

    if (kind === "complete") {
      options.handlers.complete();
    } else if (kind === "abort") {
      options.handlers.abort();
    } else {
      options.handlers.fail(message || options.fallbackError);
    }
    return true;
  };

  request.addEventListener("progress", (event) => {
    if (settled) {
      return;
    }
    const percent = calculateDownloadPercent(event, options.expectedSize);
    if (percent !== null) {
      options.handlers.progress(percent);
    }
  });

  request.onreadystatechange = () => {
    if (settled || request.readyState !== 4 || request.status === 0) {
      return;
    }

    if (
      request.status === 200 &&
      request.response.size === options.expectedSize
    ) {
      try {
        options.handlers.save(
          request.response,
          downloadFilename(request.getResponseHeader("Content-Disposition")),
        );
        finalize("complete");
      } catch {
        finalize("error", options.fallbackError);
      }
      return;
    }

    void downloadErrorMessage(
      request.response,
      request.getResponseHeader("Content-Type"),
      options.fallbackError,
    ).then((message) => finalize("error", message));
  };

  request.onerror = () => {
    finalize("error", options.networkError);
  };
  request.onabort = () => {
    finalize("abort");
  };

  return {
    finalize,
    isSettled: () => settled,
  };
};
