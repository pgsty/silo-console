// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../../../store";
import { getClientOS } from "../../../common/utils";
import { BucketObjectItem } from "../Buckets/ListBuckets/Objects/ListObjects/types";
import { makeid, storeCallForObjectWithID } from "./transferManager";
import {
  download,
  downloadSelectedAsZip,
} from "../Buckets/ListBuckets/Objects/utils";
import {
  cancelObjectInList,
  completeObject,
  failObject,
  setAnonymousAccessOpen,
  setDownloadRenameModal,
  setMaxShareLinkExpTime,
  setNewObject,
  setPreviewOpen,
  setRequestInProgress,
  setSelectedPreview,
  setShareFileModalOpen,
  updateProgress,
} from "./objectBrowserSlice";
import { ObjectListingRequest, ObjectPageRequest } from "./objectPaging";
import { setSnackBarMessage } from "../../../systemSlice";
import { DateTime } from "luxon";
import { api } from "api";
import { translate } from "i18n/lang";

// One page of the committed listing, asked for by the pager: first, previous,
// next, or the first page at another size. The listing's bucket, directory
// and mode come from the store, so the page belongs to what is on screen; the
// rows and the page number change only once the page has arrived.
export const requestObjectPage = createAsyncThunk(
  "objectBrowser/requestObjectPage",
  async (request: ObjectPageRequest, { getState, dispatch }) => {
    const { objectBrowser } = getState() as AppState;
    if (
      objectBrowser.selectedBucket === "" ||
      objectBrowser.simplePath === null
    ) {
      return;
    }
    const { rewindEnabled, dateToRewind } = objectBrowser.rewind;
    const payload: ObjectListingRequest = {
      bucketName: objectBrowser.selectedBucket,
      path: objectBrowser.simplePath,
      rewindMode: rewindEnabled || objectBrowser.showDeleted,
      date:
        dateToRewind !== null && rewindEnabled
          ? dateToRewind
          : new Date().toISOString(),
      page: request,
    };
    dispatch(setRequestInProgress(true));
    // The previous listing is stale the moment a new one is requested.
    dispatch({ type: "socket/OBCancelLast" });
    dispatch({ type: "socket/OBRequest", payload });
  },
);

export const downloadSelected = createAsyncThunk(
  "objectBrowser/downloadSelected",
  async (bucketName: string, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;

    const downloadObject = (object: BucketObjectItem) => {
      const identityDownload = encodeURIComponent(
        `${bucketName}-${object.name}-${new Date().getTime()}-${Math.random()}`,
      );

      const ID = makeid(8);

      const downloadCall = download(
        bucketName,
        object.name,
        object.version_id,
        object.size || 0,
        null,
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
                state.system.language,
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
          prefix: object.name,
          type: "download",
          waitingForFile: true,
          failed: false,
          cancelled: false,
          errorMessage: "",
        }),
      );
    };

    if (state.objectBrowser.selectedObjects.length !== 0) {
      let itemsToDownload: BucketObjectItem[] = [];

      const filterFunction = (currValue: BucketObjectItem) =>
        state.objectBrowser.selectedObjects.includes(currValue.name);

      itemsToDownload = state.objectBrowser.records.filter(filterFunction);

      // In case just one element is selected, then we trigger download modal validation.
      if (itemsToDownload.length === 1) {
        if (
          itemsToDownload[0].name.length > 200 &&
          getClientOS().toLowerCase().includes("win")
        ) {
          dispatch(setDownloadRenameModal(itemsToDownload[0]));
          return;
        } else {
          downloadObject(itemsToDownload[0]);
        }
      } else {
        if (itemsToDownload.length === 1) {
          downloadObject(itemsToDownload[0]);
        } else if (itemsToDownload.length > 1) {
          const fileName = `${DateTime.now().toFormat(
            "LL-dd-yyyy-HH-mm-ss",
          )}_files_list.zip`;

          // We are enforcing zip download when multiple files are selected for better user experience
          const multiObjList = itemsToDownload.reduce((dwList: any[], bi) => {
            // Download objects/prefixes(recursively) as zip
            // Skip any deleted files selected via "Show deleted objects" in selection and log for debugging
            const isDeleted = bi?.delete_flag;
            if (bi && !isDeleted) {
              dwList.push(bi.name);
            } else {
              console.log(`Skipping ${bi?.name} from download.`);
            }
            return dwList;
          }, []);

          downloadSelectedAsZip(
            bucketName,
            multiObjList,
            fileName,
            itemsToDownload.some(
              (item) => item.name.endsWith("/") || item.size == null,
            )
              ? null
              : itemsToDownload.reduce(
                  (size, item) => size + (item.size || 0),
                  0,
                ),
          );
          return;
        }
      }
    }
  },
);

export const openPreview = createAsyncThunk(
  "objectBrowser/openPreview",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;

    if (state.objectBrowser.selectedObjects.length === 1) {
      let fileObject: BucketObjectItem | undefined;

      const findFunction = (currValue: BucketObjectItem) =>
        state.objectBrowser.selectedObjects.includes(currValue.name);

      fileObject = state.objectBrowser.records.find(findFunction);

      if (fileObject) {
        dispatch(setSelectedPreview(fileObject));
        dispatch(setPreviewOpen(true));
      }
    }
  },
);

export const openShare = createAsyncThunk(
  "objectBrowser/openShare",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;

    if (state.objectBrowser.selectedObjects.length === 1) {
      let fileObject: BucketObjectItem | undefined;

      const findFunction = (currValue: BucketObjectItem) =>
        state.objectBrowser.selectedObjects.includes(currValue.name);

      fileObject = state.objectBrowser.records.find(findFunction);

      if (fileObject) {
        dispatch(setSelectedPreview(fileObject));
        dispatch(setShareFileModalOpen(true));
      }
    }
  },
);

export const openAnonymousAccess = createAsyncThunk(
  "objectBrowser/openAnonymousAccess",
  async (_, { getState, dispatch }) => {
    const state = getState() as AppState;

    if (
      state.objectBrowser.selectedObjects.length === 1 &&
      state.objectBrowser.selectedObjects[0].endsWith("/")
    ) {
      dispatch(setAnonymousAccessOpen(true));
    }
  },
);

export const getMaxShareLinkExpTime = createAsyncThunk(
  "objectBrowser/maxShareLinkExpTime",
  async (_, { rejectWithValue, dispatch }) => {
    return api.buckets
      .getMaxShareLinkExp()
      .then((res) => {
        dispatch(setMaxShareLinkExpTime(res.data.exp));
      })
      .catch(async (res) => {
        return rejectWithValue(res.error);
      });
  },
);
