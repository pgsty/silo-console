// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { removeTrace } from "../../../ObjectBrowser/transferManager";
import { store } from "../../../../../store";
import { ContentType } from "api/consoleApi";
import { api } from "../../../../../api";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { translate } from "i18n";
import { attachDownloadRequestHandlers } from "./downloadRequest";
export { isPreviewAvailable, previewObjectType } from "./Preview/previewType";
export type { AllowedPreviews } from "./Preview/previewType";

// This module is not a component, so it reads the active language off the
// store the same way it already reads anonymousMode.
const t = (text: string) => translate(store.getState().system.language, text);
const downloadWithLink = (href: string, downloadFileName: string) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = downloadFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadBlob = (blob: Blob, downloadFileName: string) => {
  const href = window.URL.createObjectURL(blob);
  downloadWithLink(href, downloadFileName);
  window.setTimeout(() => window.URL.revokeObjectURL(href), 1000);
};

export const downloadSelectedAsZip = async (
  bucketName: string,
  objectList: string[],
  resultFileName: string,
) => {
  const state = store.getState();
  const anonymousMode = state.system.anonymousMode;

  try {
    const resp = await api.buckets.downloadMultipleObjects(
      bucketName,
      objectList,
      {
        type: ContentType.Json,
        headers: anonymousMode
          ? {
              "X-Anonymous": "1",
            }
          : undefined,
      },
    );
    const blob = await resp.blob();
    downloadBlob(blob, resultFileName);
  } catch (err: any) {
    const detail =
      err?.error?.detailedMessage ||
      err?.detailedError ||
      err?.statusText ||
      t("Unexpected response, download incomplete.");
    store.dispatch(
      setErrorSnackMessage({
        errorMessage: `${t("Download of multiple files failed.")} ${detail}`,
        detailedError: "",
      }),
    );
  }
};

const isFolder = (objectPath: string) => {
  return objectPath.endsWith("/");
};

export const download = (
  bucketName: string,
  objectPath: string,
  versionID: any,
  fileSize: number,
  overrideFileName: string | null = null,
  id: string,
  progressCallback: (progress: number) => void,
  completeCallback: () => void,
  errorCallback: (msg: string) => void,
  abortCallback: () => void,
  toastCallback: () => void,
) => {
  let basename = document.baseURI.replace(window.location.origin, "");
  const state = store.getState();
  const anonymousMode = state.system.anonymousMode;

  let path = `${
    window.location.origin
  }${basename}api/v1/buckets/${encodeURIComponent(bucketName)}/objects/download?prefix=${encodeURIComponent(objectPath)}${
    overrideFileName !== null && overrideFileName.trim() !== ""
      ? `&override_file_name=${encodeURIComponent(overrideFileName || "")}`
      : ""
  }`;
  if (versionID) {
    path = path.concat(`&version_id=${versionID}`);
  }

  // Prefix ZIPs have no usable total and can be arbitrarily large. Let the
  // browser stream them to disk instead of retaining the full archive in XHR.
  if (isFolder(objectPath) || fileSize > 5368709120) {
    const preflight = async (signal: AbortSignal) => {
      const requestParams = {
        headers: anonymousMode ? { "X-Anonymous": "1" } : undefined,
        signal,
      };

      if (isFolder(objectPath)) {
        const response = await api.buckets.listObjects(
          bucketName,
          { limit: 1, prefix: objectPath },
          requestParams,
        );
        if (!response.data.objects?.length) {
          throw new Error(t("Unexpected response, download incomplete."));
        }
        return;
      }

      await api.buckets.getObjectMetadata(
        bucketName,
        {
          prefix: objectPath,
          ...(versionID ? { versionID } : {}),
        },
        requestParams,
      );
    };

    return new BrowserDownload(
      path,
      id,
      completeCallback,
      errorCallback,
      abortCallback,
      toastCallback,
      preflight,
    );
  }

  let req = new XMLHttpRequest();
  req.open("GET", path, true);
  if (anonymousMode) {
    req.setRequestHeader("X-Anonymous", "1");
  }
  req.responseType = "blob";
  attachDownloadRequestHandlers(req, {
    expectedSize: fileSize,
    fallbackError: t("Unexpected response, download incomplete."),
    networkError: t("A network error occurred."),
    handlers: {
      abort: abortCallback,
      cleanup: () => removeTrace(id),
      complete: completeCallback,
      fail: errorCallback,
      progress: progressCallback,
      save: downloadBlob,
    },
  });

  return req;
};

class BrowserDownload {
  path: string;
  id: string;
  completeCallback: () => void;
  errorCallback: (message: string) => void;
  abortCallback: () => void;
  toastCallback: () => void;
  preflight: (signal: AbortSignal) => Promise<void>;
  controller = new AbortController();
  settled = false;

  constructor(
    path: string,
    id: string,
    completeCallback: () => void,
    errorCallback: (message: string) => void,
    abortCallback: () => void,
    toastCallback: () => void,
    preflight: (signal: AbortSignal) => Promise<void>,
  ) {
    this.path = path;
    this.id = id;
    this.completeCallback = completeCallback;
    this.errorCallback = errorCallback;
    this.abortCallback = abortCallback;
    this.toastCallback = toastCallback;
    this.preflight = preflight;
  }

  private finalize(kind: "abort" | "complete" | "error", message = "") {
    if (this.settled) {
      return;
    }
    this.settled = true;
    removeTrace(this.id);
    if (kind === "complete") {
      this.completeCallback();
    } else if (kind === "abort") {
      this.abortCallback();
    } else {
      this.errorCallback(
        message || t("Unexpected response, download incomplete."),
      );
    }
  }

  async send(): Promise<void> {
    try {
      await this.preflight(this.controller.signal);
    } catch (error: any) {
      if (this.controller.signal.aborted || error?.name === "AbortError") {
        this.finalize("abort");
      } else {
        this.finalize(
          "error",
          error?.error?.detailedMessage ||
            error?.detailedError ||
            error?.message ||
            t("Unexpected response, download incomplete."),
        );
      }
      return;
    }

    if (this.controller.signal.aborted || this.settled) {
      return;
    }
    this.toastCallback();
    const link = document.createElement("a");
    link.href = this.path;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.finalize("complete");
  }

  abort(): void {
    if (this.settled) {
      return;
    }
    this.controller.abort();
    this.finalize("abort");
  }
}
