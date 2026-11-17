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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFileItem, ObjectBrowserState } from "./types";
import { BucketObjectItem } from "../Buckets/ListBuckets/Objects/ListObjects/types";
import {
  BucketVersioningResponse,
  GetBucketRetentionConfig,
} from "api/consoleApi";
import { AppState } from "store";
import {
  commitObjectPage as commitPageState,
  initialObjectPageState,
  ObjectPageCommit,
  resetObjectPaging as resetPageState,
} from "./objectPaging";

import {
  activeTask,
  retrySubset,
  syncTargetProgress,
  targetIdentity,
  TaskTarget,
} from "../Common/ObjectManager/taskModel";

const defaultRewind = {
  rewindEnabled: false,
  bucketToRewind: "",
  dateToRewind: null,
};

const initialState: ObjectBrowserState = {
  selectedBucket: "",
  versionsMode: false,
  reloadObjectsList: false,
  requestInProgress: true,
  objectDetailsOpen: false,
  loadingVersions: true,
  loadingObjectInfo: true,
  objectMutationRevision: 0,
  connectionError: false,
  rewind: {
    ...defaultRewind,
  },
  objectManager: {
    objectsToManage: [],
    managerOpen: false,
    newItems: false,
    startedItems: [],
    currentDownloads: [],
    currentUploads: [],
  },
  searchObjects: "",
  versionedFile: "",
  searchVersions: "",
  selectedVersion: "",
  showDeleted: false,
  selectedInternalPaths: null,
  simplePath: null,
  // object browser
  records: [],
  objectPage: initialObjectPageState,
  loadingVersioning: true,
  versionInfo: {},
  lockingEnabled: false,
  loadingLocking: true,
  selectedObjects: [],
  downloadRenameModal: null,
  selectedPreview: null,
  previewOpen: false,
  shareFileModalOpen: false,
  anonymousAccessOpen: false,
  retentionConfig: {
    mode: undefined,
    unit: undefined,
    validity: 0,
  },
  maxShareLinkExpTime: 0,
  versionsLimit: 20,
};

const objectBrowserSlice = createSlice({
  name: "objectBrowser",
  initialState,
  reducers: {
    setRewindEnable: (
      state,
      action: PayloadAction<{
        state: boolean;
        bucket: string;
        dateRewind: any;
      }>,
    ) => {
      state.rewind.rewindEnabled = action.payload.state;
      state.rewind.bucketToRewind = action.payload.bucket;
      state.rewind.dateToRewind = action.payload.dateRewind;
    },
    resetRewind: (state) => {
      state.rewind.rewindEnabled = false;
      state.rewind.bucketToRewind = "";
      state.rewind.dateToRewind = null;
    },
    setVersionsModeEnabled: (
      state,
      action: PayloadAction<{
        status: boolean;
        objectName?: string;
      }>,
    ) => {
      let objN = "";
      if (action.payload.objectName) {
        objN = action.payload.objectName;
      }
      const objectN = !action.payload.status ? "" : objN;
      state.versionsMode = action.payload.status;
      state.versionedFile = objectN;
      state.selectedVersion = "";
    },
    setNewObject: {
      prepare: (item: IFileItem) => ({
        payload: {
          ...item,
          kind: item.kind ?? item.type,
          status:
            item.status ??
            (item.done ? ("done" as const) : ("queued" as const)),
          attempt: item.attempt ?? 1,
          startedAt: item.startedAt ?? Date.now(),
        },
      }),
      reducer: (state, action: PayloadAction<IFileItem>) => {
        state.objectManager.objectsToManage.push(action.payload);
        state.objectManager.newItems = true;
      },
    },
    resetTasks: (state) => {
      state.objectManager = { ...initialState.objectManager };
    },
    updateTaskTarget: (
      state,
      action: PayloadAction<{
        instanceID: string;
        attempt: number;
        identity: string;
        result: Partial<TaskTarget>;
        now: number;
      }>,
    ) => {
      const item = state.objectManager.objectsToManage.find(
        (item) => item.instanceID === action.payload.instanceID,
      );
      if (!item || item.attempt !== action.payload.attempt || item.done) return;
      const target = item.targets?.find(
        (target) => targetIdentity(target) === action.payload.identity,
      );
      if (!target || !["queued", "running"].includes(target.status)) return;
      Object.assign(target, action.payload.result);
      syncTargetProgress(item, action.payload.now);
    },
    retryTask: (
      state,
      action: PayloadAction<{ instanceID: string; now: number }>,
    ) => {
      const item = state.objectManager.objectsToManage.find(
        (item) => item.instanceID === action.payload.instanceID,
      );
      if (!item || !item.done || !item.targets) return;
      const retry = retrySubset(item.targets);
      if (!retry.length) return;
      retry.forEach((target) => {
        target.status = "queued";
        delete target.error;
        delete target.retryable;
        delete target.uncertain;
      });
      item.attempt = (item.attempt ?? 1) + 1;
      item.startedAt = action.payload.now;
      delete item.finishedAt;
      item.done = item.failed = item.cancelled = false;
      item.errorMessage = "";
      syncTargetProgress(item, action.payload.now);
    },
    updateProgress: (
      state,
      action: PayloadAction<{
        instanceID: string;
        progress: number;
      }>,
    ) => {
      const itemUpdate = state.objectManager.objectsToManage.findIndex(
        (item) => item.instanceID === action.payload.instanceID,
      );

      if (
        itemUpdate === -1 ||
        state.objectManager.objectsToManage[itemUpdate].done ||
        !Number.isFinite(action.payload.progress)
      ) {
        return;
      }

      state.objectManager.objectsToManage[itemUpdate].percentage = Math.max(
        0,
        Math.min(99, action.payload.progress),
      );
      state.objectManager.objectsToManage[itemUpdate].waitingForFile = false;
    },
    updateDownloadProgress: (
      state,
      action: PayloadAction<{
        instanceID: string;
        bytes: number;
        total: number | null;
      }>,
    ) => {
      const item = state.objectManager.objectsToManage.find(
        (item) => item.instanceID === action.payload.instanceID,
      );
      if (
        !item ||
        item.done ||
        !Number.isFinite(action.payload.bytes) ||
        action.payload.bytes < 0
      )
        return;
      item.receivedBytes = action.payload.bytes;
      item.waitingForFile =
        action.payload.total === null ||
        !Number.isFinite(action.payload.total) ||
        action.payload.total <= 0;
      if (!item.waitingForFile && action.payload.total !== null)
        item.percentage = Math.min(
          99,
          Math.floor((action.payload.bytes / action.payload.total) * 100),
        );
    },
    completeObject: {
      prepare: (instanceID: string) => ({
        payload: instanceID,
        meta: { now: Date.now() },
      }),
      reducer: (
        state,
        action: PayloadAction<string, string, { now: number }>,
      ) => {
        const objectToComplete = state.objectManager.objectsToManage.findIndex(
          (item) => item.instanceID === action.payload,
        );

        if (
          objectToComplete === -1 ||
          state.objectManager.objectsToManage[objectToComplete].done
        ) {
          return;
        }

        state.objectManager.objectsToManage[objectToComplete].status = "done";
        state.objectManager.objectsToManage[objectToComplete].finishedAt =
          action.meta.now;
        state.objectManager.objectsToManage[objectToComplete].percentage = 100;
        state.objectManager.objectsToManage[objectToComplete].waitingForFile =
          false;
        state.objectManager.objectsToManage[objectToComplete].done = true;

        // We cancel from in-progress lists
        const type = state.objectManager.objectsToManage[objectToComplete].type;
        const ID = state.objectManager.objectsToManage[objectToComplete].ID;

        if (type === "download") {
          state.objectManager.currentDownloads =
            state.objectManager.currentDownloads.filter((item) => item !== ID);
        } else if (type === "upload") {
          state.objectManager.currentUploads =
            state.objectManager.currentUploads.filter((item) => item !== ID);
        }
      },
    },
    failObject: {
      prepare: (payload: { instanceID: string; msg: string }) => ({
        payload,
        meta: { now: Date.now() },
      }),
      reducer: (
        state,
        action: PayloadAction<
          { instanceID: string; msg: string },
          string,
          { now: number }
        >,
      ) => {
        const objectToFail = state.objectManager.objectsToManage.findIndex(
          (item) => item.instanceID === action.payload.instanceID,
        );

        if (objectToFail === -1) {
          return;
        }

        const failedItem = state.objectManager.objectsToManage[objectToFail];
        // Native handoff can still report a late error document in its owned frame.
        if (
          failedItem.done &&
          !(
            failedItem.browserManaged &&
            !failedItem.failed &&
            !failedItem.cancelled
          )
        )
          return;
        failedItem.status = "failed";
        failedItem.finishedAt = action.meta.now;
        state.objectManager.objectsToManage[objectToFail].failed = true;
        state.objectManager.objectsToManage[objectToFail].waitingForFile =
          false;
        state.objectManager.objectsToManage[objectToFail].done = true;
        state.objectManager.objectsToManage[objectToFail].errorMessage =
          action.payload.msg;

        // We cancel from in-progress lists
        const type = state.objectManager.objectsToManage[objectToFail].type;
        const ID = state.objectManager.objectsToManage[objectToFail].ID;

        if (type === "download") {
          state.objectManager.currentDownloads =
            state.objectManager.currentDownloads.filter((item) => item !== ID);
        } else if (type === "upload") {
          state.objectManager.currentUploads =
            state.objectManager.currentUploads.filter((item) => item !== ID);
        }
      },
    },
    cancelObjectInList: {
      prepare: (instanceID: string) => ({
        payload: instanceID,
        meta: { now: Date.now() },
      }),
      reducer: (
        state,
        action: PayloadAction<string, string, { now: number }>,
      ) => {
        const objectToCancel = state.objectManager.objectsToManage.findIndex(
          (item) => item.instanceID === action.payload,
        );

        if (
          objectToCancel === -1 ||
          state.objectManager.objectsToManage[objectToCancel].done
        ) {
          return { ...state };
        }

        state.objectManager.objectsToManage[objectToCancel].status =
          "cancelled";
        state.objectManager.objectsToManage[objectToCancel].finishedAt =
          action.meta.now;
        state.objectManager.objectsToManage[objectToCancel].cancelled = true;
        state.objectManager.objectsToManage[objectToCancel].done = true;
        state.objectManager.objectsToManage[objectToCancel].percentage = 0;
        state.objectManager.objectsToManage[objectToCancel].waitingForFile =
          false;

        // We cancel from in-progress lists
        const type = state.objectManager.objectsToManage[objectToCancel].type;
        const ID = state.objectManager.objectsToManage[objectToCancel].ID;

        if (type === "download") {
          state.objectManager.currentDownloads =
            state.objectManager.currentDownloads.filter((item) => item !== ID);
        } else if (type === "upload") {
          state.objectManager.currentUploads =
            state.objectManager.currentUploads.filter((item) => item !== ID);
        }
      },
    },
    deleteFromList: (state, action: PayloadAction<string>) => {
      const notObject = state.objectManager.objectsToManage.filter(
        (element) => element.instanceID !== action.payload,
      );

      state.objectManager.objectsToManage = notObject;
      state.objectManager.managerOpen =
        notObject.length === 0 ? false : state.objectManager.managerOpen;
    },
    cleanList: (state) => {
      const nonCompletedList = state.objectManager.objectsToManage.filter(
        (item) => activeTask(item),
      );
      state.objectManager.objectsToManage = nonCompletedList;
      state.objectManager.managerOpen =
        nonCompletedList.length === 0 ? false : state.objectManager.managerOpen;
      state.objectManager.newItems = false;
    },
    toggleList: (state) => {
      state.objectManager.managerOpen = !state.objectManager.managerOpen;
      state.objectManager.newItems = false;
    },
    openList: (state) => {
      state.objectManager.managerOpen = true;
    },
    closeList: (state) => {
      state.objectManager.managerOpen = false;
    },
    setSearchObjects: (state, action: PayloadAction<string>) => {
      // The filter changes which rows "select all" covers, so a selection
      // made under another filter is dropped.
      if (state.searchObjects !== action.payload) {
        state.selectedObjects = [];
      }
      state.searchObjects = action.payload;
    },
    setRequestInProgress: (state, action: PayloadAction<boolean>) => {
      state.requestInProgress = action.payload;
    },
    setSearchVersions: (state, action: PayloadAction<string>) => {
      state.searchVersions = action.payload;
    },
    setSelectedVersion: (state, action: PayloadAction<string>) => {
      state.selectedVersion = action.payload;
    },
    setShowDeletedObjects: (state, action: PayloadAction<boolean>) => {
      state.showDeleted = action.payload;
    },
    setLoadingVersions: (state, action: PayloadAction<boolean>) => {
      state.loadingVersions = action.payload;
    },
    setLoadingObjectInfo: (state, action: PayloadAction<boolean>) => {
      state.loadingObjectInfo = action.payload;
    },
    setObjectDetailsView: (state, action: PayloadAction<boolean>) => {
      state.objectDetailsOpen = action.payload;
      state.selectedInternalPaths = action.payload
        ? state.selectedInternalPaths
        : null;
    },
    setSelectedObjectView: (state, action: PayloadAction<string | null>) => {
      state.selectedInternalPaths = action.payload;
    },
    setSimplePathHandler: (state, action: PayloadAction<string>) => {
      state.simplePath = action.payload;
    },
    newDownloadInit: (state, action: PayloadAction<string>) => {
      const item = state.objectManager.objectsToManage.find(
        (item) => item.ID === action.payload,
      );
      if (
        !item ||
        item.done ||
        state.objectManager.currentDownloads.includes(action.payload)
      )
        return;
      item.status = "running";
      state.objectManager.currentDownloads.push(action.payload);
    },
    newUploadInit: (state, action: PayloadAction<string>) => {
      const item = state.objectManager.objectsToManage.find(
        (item) => item.ID === action.payload,
      );
      if (
        !item ||
        item.done ||
        state.objectManager.currentUploads.includes(action.payload)
      )
        return;
      item.status = "running";
      state.objectManager.currentUploads.push(action.payload);
    },
    // The listing moves to another directory, bucket or mode: the rows,
    // cursors and selection of the previous listing leave at once, before the
    // new page is requested, so nothing of the old scope shows under the new.
    resetObjectListing: (
      state,
      action: PayloadAction<{ clearFilter: boolean }>,
    ) => {
      state.records = [];
      state.objectPage = resetPageState(state.objectPage);
      state.selectedObjects = [];
      if (action.payload.clearFilter) {
        state.searchObjects = "";
      }
    },
    // A page arrived in full: rows, page size, cursor history and page number
    // change together, and only here. A failed or canceled page never
    // reaches this reducer, so the previous page stays on screen.
    commitObjectPage: (
      state,
      action: PayloadAction<{
        records: BucketObjectItem[];
        commit: ObjectPageCommit;
      }>,
    ) => {
      state.records = action.payload.records;
      state.objectPage = commitPageState(
        state.objectPage,
        action.payload.commit,
      );
      state.requestInProgress = false;
    },
    setLoadingVersioning: (state, action: PayloadAction<boolean>) => {
      state.loadingVersioning = action.payload;
    },
    setIsVersioned: (
      state,
      action: PayloadAction<BucketVersioningResponse>,
    ) => {
      state.versionInfo = action.payload;
    },
    setLockingEnabled: (state, action: PayloadAction<boolean | undefined>) => {
      state.lockingEnabled = action.payload;
    },
    setLoadingLocking: (state, action: PayloadAction<boolean>) => {
      state.loadingLocking = action.payload;
    },
    // Drops the listing on screen together with its cursors and selection;
    // used when the listing can no longer be shown (no permission) or when
    // its mode changes. A plain reload keeps the page until the new one
    // arrives, see setReloadObjectsList.
    resetMessages: (state) => {
      state.records = [];
      state.objectPage = resetPageState(state.objectPage);
      state.selectedObjects = [];
    },
    // Asks the browser handler to request the committed page again. The rows
    // stay on screen until the new page arrives, so a failed reload leaves
    // the previous page rather than an empty table.
    invalidateMutationView: (
      state,
      action: PayloadAction<{
        kind: "delete" | "restore";
        targets: TaskTarget[];
      }>,
    ) => {
      const affected = action.payload.targets.filter(
        (target) =>
          target.bucket === state.selectedBucket &&
          (target.status === "done" || target.uncertain),
      );
      if (!affected.length) return;
      state.reloadObjectsList = true;
      const key = state.selectedInternalPaths;
      const matching = affected.filter(
        (target) =>
          key !== null &&
          (target.key === key ||
            (target.recursive && key.startsWith(target.key))),
      );
      if (!matching.length) return;
      // A completion refreshes the object still being viewed, including an
      // in-flight details request, without closing Versions or touching B
      // after a detached task for A completes.
      state.objectMutationRevision++;
      state.loadingVersions = true;
      state.loadingObjectInfo = true;
      if (
        action.payload.kind === "delete" &&
        matching.some(
          (target) =>
            target.recursive ||
            target.allVersions ||
            target.nonCurrent ||
            target.versionId === state.selectedVersion,
        )
      ) {
        state.selectedVersion = "";
      }
    },
    setReloadObjectsList: (state, action: PayloadAction<boolean>) => {
      state.reloadObjectsList = action.payload;
    },
    setSelectedObjects: (state, action: PayloadAction<string[]>) => {
      state.selectedObjects = action.payload;
    },
    setDownloadRenameModal: (
      state,
      action: PayloadAction<BucketObjectItem | null>,
    ) => {
      state.downloadRenameModal = action.payload;
    },
    setSelectedPreview: (
      state,
      action: PayloadAction<BucketObjectItem | null>,
    ) => {
      state.selectedPreview = action.payload;
    },
    setPreviewOpen: (state, action: PayloadAction<boolean>) => {
      state.previewOpen = action.payload;
    },
    setShareFileModalOpen: (state, action: PayloadAction<boolean>) => {
      state.shareFileModalOpen = action.payload;
    },
    setRetentionConfig: (
      state,
      action: PayloadAction<GetBucketRetentionConfig | null>,
    ) => {
      state.retentionConfig = action.payload;
    },
    setSelectedBucket: (state, action: PayloadAction<string>) => {
      state.selectedBucket = action.payload;
    },
    setAnonymousAccessOpen: (state, action: PayloadAction<boolean>) => {
      state.anonymousAccessOpen = action.payload;
    },
    setMaxShareLinkExpTime: (state, action: PayloadAction<number>) => {
      state.maxShareLinkExpTime = action.payload;
    },
    errorInConnection: (state, action: PayloadAction<boolean>) => {
      state.connectionError = action.payload;
      if (action.payload) {
        state.requestInProgress = false;
        state.loadingObjectInfo = false;
        state.objectDetailsOpen = false;
      }
    },
    setVersionsLimit: (state, action: PayloadAction<number>) => {
      state.versionsLimit = action.payload;
    },
  },
});
export const {
  setRewindEnable,
  resetRewind,
  setVersionsModeEnabled,
  setNewObject,
  resetTasks,
  updateTaskTarget,
  retryTask,
  closeList,
  updateProgress,
  updateDownloadProgress,
  completeObject,
  failObject,
  deleteFromList,
  cleanList,
  toggleList,
  openList,
  setSearchObjects,
  setRequestInProgress,
  cancelObjectInList,
  setSearchVersions,
  setSelectedVersion,
  setShowDeletedObjects,
  setLoadingVersions,
  setLoadingObjectInfo,
  setObjectDetailsView,
  setSelectedObjectView,
  setSimplePathHandler,
  newDownloadInit,
  newUploadInit,
  resetObjectListing,
  commitObjectPage,
  resetMessages,
  setLoadingVersioning,
  setIsVersioned,
  setLoadingLocking,
  setLockingEnabled,
  setSelectedObjects,
  setDownloadRenameModal,
  setSelectedPreview,
  setPreviewOpen,
  setShareFileModalOpen,
  setReloadObjectsList,
  invalidateMutationView,
  setRetentionConfig,
  setSelectedBucket,
  setAnonymousAccessOpen,
  setMaxShareLinkExpTime,
  errorInConnection,
  setVersionsLimit,
} = objectBrowserSlice.actions;

export const maxShareLinkExpTime = (state: AppState) =>
  state.objectBrowser.maxShareLinkExpTime;

export default objectBrowserSlice.reducer;
