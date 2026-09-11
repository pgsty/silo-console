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

import {
  makeid,
  removeTrace,
  storeCallForObjectWithID,
} from "../../../ObjectBrowser/transferManager";
import {
  cancelObjectInList,
  completeObject,
  failObject,
  setNewObject,
  updateDownloadProgress,
} from "../../../ObjectBrowser/objectBrowserSlice";
import { streamZipResponse } from "./zipDownload";
import { store } from "../../../../../store";
import { ContentType } from "api/consoleApi";
import { api } from "../../../../../api";
import { expireSession } from "../../../../../api/session";
import { setSnackBarMessage } from "../../../../../systemSlice";
import { translate } from "i18n";
import { attachDownloadRequestHandlers } from "./downloadRequest";
export { isPreviewAvailable, previewObjectType } from "./Preview/previewType";
export type { AllowedPreviews } from "./Preview/previewType";

// This module is not a component, so it reads the active language off the
// store the same way it already reads anonymousMode.
const t = (text: string) => translate(store.getState().system.language, text);
// Individual bounded downloads still use the existing XHR/Blob path.
const downloadBlob = (blob: Blob, name: string) => {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
};

type SaveFilePicker = (options: {
  suggestedName: string;
}) => Promise<FileSystemFileHandle>;

export const downloadSelectedAsZip = (
  bucketName: string,
  objectList: string[],
  resultFileName: string,
  selectedSize: number | null = null,
) => {
  if (objectList.length === 0) return;
  const needsSizeAdvice = selectedSize === null || selectedSize > 5 * 1024 ** 3;
  const state = store.getState();
  const selectionKey = JSON.stringify([
    bucketName,
    [...new Set(objectList)].sort(),
  ]);
  if (
    state.objectBrowser.objectManager.objectsToManage.some(
      (item) =>
        item.selectionKey === selectionKey &&
        !item.failed &&
        !item.cancelled &&
        (!item.done || item.browserManaged),
    )
  ) {
    store.dispatch(
      setSnackBarMessage(
        t(
          "This download has already started. Dismiss its transfer entry to start it again.",
        ),
      ),
    );
    return;
  }
  const picker = (window as Window & { showSaveFilePicker?: SaveFilePicker })
    .showSaveFilePicker;
  // Open the picker in the click's user activation, before entering the queue.
  // Capture rejection immediately, even when other transfers keep it queued.
  const picked = picker
    ? Promise.resolve()
        .then(() => picker.call(window, { suggestedName: resultFileName }))
        .then(
          (handle) => ({ handle, error: null }),
          (error) => ({ handle: null, error }),
        )
    : null;
  const ID = makeid(16);
  const instanceID = `zip-${ID}`;
  const controller = new AbortController();
  let started = false;
  let settled = false;
  let frame: HTMLIFrameElement | null = null;
  const fail = (error: any) => {
    if (settled && !frame) return;
    settled = true;
    removeTrace(ID);
    if (frame) store.dispatch(setSnackBarMessage(""));
    frame?.remove();
    frame = null;
    if (controller.signal.aborted || error?.name === "AbortError") {
      store.dispatch(cancelObjectInList(instanceID));
    } else {
      store.dispatch(
        failObject({
          instanceID,
          msg:
            error?.error?.detailedMessage ||
            error?.message ||
            t("Unexpected response, download incomplete."),
        }),
      );
    }
  };
  const control = {
    abort() {
      controller.abort();
      if (frame) {
        frame.remove();
        frame = null;
        removeTrace(ID);
      }
      if (!settled) fail(new DOMException("Cancelled", "AbortError"));
    },
    async send() {
      if (started || settled) return;
      started = true;
      await Promise.resolve();
      if (controller.signal.aborted || settled) return;
      try {
        if (picked) {
          const result = await picked;
          if (result.error) throw result.error;
          if (controller.signal.aborted || !result.handle) return;
          const writable = await result.handle.createWritable();
          // The writer must also be aborted if HTTP setup fails before pipeTo.
          try {
            const response = await api.buckets.downloadMultipleObjects(
              bucketName,
              objectList,
              {
                type: ContentType.Json,
                signal: controller.signal,
                headers: state.system.anonymousMode
                  ? { "X-Anonymous": "1" }
                  : undefined,
              },
            );
            await streamZipResponse(
              response,
              writable,
              controller.signal,
              (bytes, total) => {
                store.dispatch(
                  updateDownloadProgress({ instanceID, bytes, total }),
                );
              },
            );
          } catch (error) {
            await writable.abort().catch(() => {});
            throw error;
          }
          settled = true;
          removeTrace(ID);
          store.dispatch(completeObject(instanceID));
        } else {
          if (!state.system.anonymousMode) {
            try {
              await api.session.sessionCheck({ signal: controller.signal });
            } catch (error: any) {
              // Session probes intentionally do not redirect anonymous pages;
              // this probe belongs to a known authenticated download.
              if (error?.status === 401) expireSession();
              throw error;
            }
            if (controller.signal.aborted || settled) return;
          }
          // Native POST attachments stream to the browser's download manager;
          // it owns progress, cancellation and any network/partial ZIP errors.
          frame = document.createElement("iframe");
          frame.name = `download-${ID}`;
          frame.hidden = true;
          frame.onload = () => {
            if (!frame) return;
            try {
              const doc = frame.contentDocument;
              // Attachments do not navigate the frame. A blocked error page
              // (for example a proxy's DENY response) is opaque, not success.
              if (!doc) {
                fail(new Error(t("Unexpected response, download incomplete.")));
                return;
              }
              const body = doc.body?.textContent?.trim();
              if (body) fail(new Error(body.slice(0, 500)));
            } catch {
              fail(new Error(t("Unexpected response, download incomplete.")));
            }
          };
          document.body.appendChild(frame);
          const form = document.createElement("form");
          form.method = "POST";
          form.action = `${api.baseUrl}/buckets/${encodeURIComponent(bucketName)}/objects/download-multiple`;
          form.target = frame.name;
          for (const [name, value] of Object.entries({
            objects: JSON.stringify(objectList),
            anonymous: state.system.anonymousMode ? "1" : "0",
          })) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
          form.remove();
          settled = true;
          store.dispatch(completeObject(instanceID));
          // Keep the size advisory visible instead of immediately replacing it
          // on native handoff. The transfer entry always explains browser control.
          if (!needsSizeAdvice) {
            store.dispatch(
              setSnackBarMessage(
                t(
                  "Track or cancel this download in your browser's download manager.",
                ),
              ),
            );
          }
        }
      } catch (error) {
        fail(error);
      }
    },
  };
  storeCallForObjectWithID(ID, control);
  store.dispatch(
    setNewObject({
      ID,
      instanceID,
      bucketName,
      prefix: resultFileName,
      selectionKey,
      browserManaged: !picker,
      type: "download",
      percentage: 0,
      done: false,
      waitingForFile: true,
      failed: false,
      cancelled: false,
      errorMessage: "",
    }),
  );
  // The OS picker can be cancelled before the scheduler grants a slot.
  // Settle its entry immediately instead of waiting for unrelated downloads.
  void picked?.then((result) => {
    if (result.error) fail(result.error);
  });
  if (needsSizeAdvice) {
    store.dispatch(
      setSnackBarMessage(
        t(
          "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.",
        ),
      ),
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
