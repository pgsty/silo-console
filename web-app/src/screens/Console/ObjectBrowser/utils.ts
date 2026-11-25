// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import { makeid, storeCallForObjectWithID } from "./transferManager";
import { download } from "../Buckets/ListBuckets/Objects/utils";
import {
  cancelObjectInList,
  completeObject,
  failObject,
  setNewObject,
  updateProgress,
} from "./objectBrowserSlice";
import { AppDispatch } from "../../../store";
import { setSnackBarMessage } from "../../../systemSlice";
import { BucketObject } from "api/consoleApi";
import { getStoredLanguage, translate } from "i18n/lang";

export const windowsDownloadNameLimit = 200;
export const downloadFileName = (key: string) =>
  key.slice(key.lastIndexOf("/") + 1);

export const downloadObject = (
  dispatch: AppDispatch,
  bucketName: string,
  internalPaths: string,
  object: BucketObject,
  overrideFileName: string | null = null,
) => {
  const identityDownload = encodeURIComponent(
    `${bucketName}-${object.name}-${new Date().getTime()}-${Math.random()}`,
  );

  const ID = makeid(8);

  const downloadCall = download(
    bucketName,
    internalPaths,
    object.version_id,
    object.size || 0,
    overrideFileName,
    ID,
    (progress) => {
      dispatch(
        updateProgress({
          instanceID: identityDownload,
          progress: progress,
        }),
      );
    },
    () => {
      dispatch(completeObject(identityDownload));
    },
    (msg: string) => {
      dispatch(failObject({ instanceID: identityDownload, msg }));
    },
    () => {
      dispatch(cancelObjectInList(identityDownload));
    },
    () => {
      dispatch(
        setSnackBarMessage(
          translate(
            getStoredLanguage(),
            "File download will be handled directly by the browser.",
          ),
        ),
      );
    },
  );

  storeCallForObjectWithID(ID, downloadCall);
  dispatch(
    setNewObject({
      ID,
      bucketName,
      done: false,
      instanceID: identityDownload,
      percentage: 0,
      prefix: object.name || "",
      type: "download",
      kind: internalPaths.endsWith("/") ? "zip" : "download",
      browserManaged:
        internalPaths.endsWith("/") || (object.size || 0) > 5368709120,
      waitingForFile: true,
      failed: false,
      cancelled: false,
      errorMessage: "",
    }),
  );
};
