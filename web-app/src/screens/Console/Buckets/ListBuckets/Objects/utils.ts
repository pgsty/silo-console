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

import { BucketObjectItem } from "./ListObjects/types";
import { removeTrace } from "../../../ObjectBrowser/transferManager";
import { store } from "../../../../../store";
import { ContentType, PermissionResource } from "api/consoleApi";
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

export const sortListObjects = (fieldSort: string) => {
  switch (fieldSort) {
    case "name":
      return (a: BucketObjectItem, b: BucketObjectItem) =>
        a.name.localeCompare(b.name);
    case "last_modified":
      return (a: BucketObjectItem, b: BucketObjectItem) =>
        new Date(a.last_modified).getTime() -
        new Date(b.last_modified).getTime();
    case "size":
      return (a: BucketObjectItem, b: BucketObjectItem) =>
        (a.size ?? -1) - (b.size ?? -1);
  }
};

export const permissionItems = (
  bucketName: string,
  currentPath: string,
  permissionsArray: PermissionResource[],
): BucketObjectItem[] | null => {
  if (permissionsArray.length === 0) {
    return null;
  }

  // We get permissions applied to the current bucket
  const filteredPermissionsForBucket = permissionsArray.filter(
    (permissionItem) =>
      permissionItem.resource?.endsWith(`:${bucketName}`) ||
      permissionItem.resource?.includes(`:${bucketName}/`),
  );

  // No permissions for this bucket. we can throw the error message at this point
  if (filteredPermissionsForBucket.length === 0) {
    return null;
  }

  let returnElements: BucketObjectItem[] = [];

  // We split current path
  const splitCurrentPath = currentPath.split("/");

  filteredPermissionsForBucket.forEach((permissionElement) => {
    // We review paths in resource address

    // We split ARN & get the last item to check the URL
    const splitARN = permissionElement.resource?.split(":");
    const urlARN = splitARN?.pop() || "";

    // We split the paths of the URL & compare against current location to see if there are more items to include. In case current level is a wildcard or is the last one, we omit this validation

    const splitURLARN = urlARN.split("/");

    // splitURL has more items than bucket name, we can continue validating
    if (splitURLARN.length > 1) {
      splitURLARN.every((currentElementInPath, index) => {
        // It is a wildcard element. We can store the verification as value should be included (?)
        if (currentElementInPath === "*") {
          return false;
        }

        // Element is not included in the path. The user is trying to browse something else.
        if (
          splitCurrentPath[index] &&
          splitCurrentPath[index] !== currentElementInPath
        ) {
          return false;
        }

        // This element is not included by index in the current paths list. We add it so user can browse into it
        if (!splitCurrentPath[index]) {
          returnElements.push({
            name: `${currentElementInPath}/`,
            size: 0,
            last_modified: "",
            version_id: "",
          });
        }

        return true;
      });
    }

    // We review prefixes in allow resources for StringEquals variant only.
    if (
      permissionElement.conditionOperator === "StringEquals" ||
      permissionElement.conditionOperator === "StringLike"
    ) {
      permissionElement.prefixes?.forEach((prefixItem) => {
        // Prefix Item is not empty?
        if (prefixItem !== "") {
          const splitItems = prefixItem.split("/");

          let pathToRouteElements: string[] = [];

          // We verify if currentPath is contained in the path begin, if is not contained the  user has no access to this subpath
          const cleanCurrPath = currentPath.replace(/\/$/, "");

          if (!prefixItem.startsWith(cleanCurrPath) && currentPath !== "") {
            return;
          }

          // For every split element we iterate and check if we can construct a URL
          splitItems.every((splitElement, index) => {
            if (!splitElement.includes("*") && splitElement !== "") {
              if (splitElement !== splitCurrentPath[index]) {
                returnElements.push({
                  name: `${pathToRouteElements.join("/")}${
                    pathToRouteElements.length > 0 ? "/" : ""
                  }${splitElement}/`,
                  size: 0,
                  last_modified: "",
                  version_id: "",
                });
                return false;
              }
              if (splitElement !== "") {
                pathToRouteElements.push(splitElement);
              }

              return true;
            }
            return false;
          });
        }
      });
    }
  });

  // We clean duplicated name entries
  if (returnElements.length > 0) {
    let clElements: BucketObjectItem[] = [];
    let keys: string[] = [];

    returnElements.forEach((itm) => {
      if (!keys.includes(itm.name)) {
        clElements.push(itm);
        keys.push(itm.name);
      }
    });

    returnElements = clElements;
  }

  return returnElements;
};
