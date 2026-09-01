// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Upload request lifecycle. Every terminal state of the XMLHttpRequest that
// carries a browser upload (success, HTTP failure, network failure, abort,
// timeout) goes through one idempotent finalize step that first releases the
// transfer-manager trace holding the request and its FormData/Blob, then
// reports the outcome exactly once. Handlers stay inert after that, so late
// events cannot resurrect an entry or settle a promise twice.

interface UploadRequestLike {
  status: number;
  response: unknown;
  onload: XMLHttpRequest["onload"];
  onerror: XMLHttpRequest["onerror"];
  onabort: XMLHttpRequest["onabort"];
  ontimeout: XMLHttpRequest["ontimeout"];
  upload: {
    addEventListener(
      type: "progress" | "error",
      listener: (event: ProgressEvent) => void,
    ): void;
  };
}

interface UploadRequestHandlers {
  cleanup: () => void;
  complete: (status: number) => void;
  fail: (message: string, status: number) => void;
  abort: () => void;
  progress: (percent: number) => void;
}

interface AttachUploadRequestOptions {
  fallbackError: string;
  malformedError: string;
  networkError: string;
  statusErrors?: Record<number, string>;
  handlers: UploadRequestHandlers;
}

type UploadOutcome = "abort" | "complete" | "error";

export const uploadErrorMessage = (
  status: number,
  response: unknown,
  options: Pick<
    AttachUploadRequestOptions,
    "fallbackError" | "malformedError" | "statusErrors"
  >,
): string => {
  const byStatus = options.statusErrors?.[status];
  if (byStatus) {
    return byStatus;
  }
  if (typeof response !== "string" || response === "") {
    return options.fallbackError;
  }
  try {
    const body = JSON.parse(response) as {
      detailedMessage?: unknown;
      message?: unknown;
    };
    if (typeof body.detailedMessage === "string" && body.detailedMessage) {
      return body.detailedMessage;
    }
    if (typeof body.message === "string" && body.message) {
      return body.message;
    }
    return options.fallbackError;
  } catch {
    return options.malformedError;
  }
};

export const attachUploadRequestHandlers = (
  request: UploadRequestLike,
  options: AttachUploadRequestOptions,
) => {
  let settled = false;

  const finalize = (kind: UploadOutcome, message = "", status = 0): boolean => {
    if (settled) {
      return false;
    }
    settled = true;
    // Release the request and its FormData/Blob before anything else runs, so
    // a throwing outcome handler cannot keep them alive.
    options.handlers.cleanup();

    if (kind === "complete") {
      options.handlers.complete(status);
    } else if (kind === "abort") {
      options.handlers.abort();
    } else {
      options.handlers.fail(message || options.fallbackError, status);
    }
    return true;
  };

  request.upload.addEventListener("progress", (event) => {
    if (settled || !event.lengthComputable || event.total <= 0) {
      return;
    }
    options.handlers.progress(
      Math.min(100, Math.floor((event.loaded * 100) / event.total)),
    );
  });
  request.upload.addEventListener("error", () => {
    finalize("error", options.networkError);
  });

  request.onload = () => {
    if (request.status >= 200 && request.status < 300) {
      finalize("complete", "", request.status);
      return;
    }
    finalize(
      "error",
      uploadErrorMessage(request.status, request.response, options),
      request.status,
    );
  };
  request.onerror = () => {
    finalize("error", options.networkError);
  };
  request.ontimeout = () => {
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
