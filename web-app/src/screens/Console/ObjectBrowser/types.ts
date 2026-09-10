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

import { BucketObjectItem } from "../Buckets/ListBuckets/Objects/ListObjects/types";
import {
  BucketVersioningResponse,
  GetBucketRetentionConfig,
} from "api/consoleApi";
import { ObjectPageState } from "./objectPaging";

interface RewindItem {
  rewindEnabled: boolean;
  bucketToRewind: string;
  dateToRewind: string | null;
}

export interface ObjectBrowserState {
  selectedBucket: string;
  rewind: RewindItem;
  objectManager: ObjectManager;
  searchObjects: string;
  loadingVersions: boolean;
  reloadObjectsList: boolean;
  requestInProgress: boolean;
  loadingObjectInfo: boolean;
  versionsMode: boolean;
  versionedFile: string;
  searchVersions: string;
  selectedVersion: string;
  showDeleted: boolean;
  objectDetailsOpen: boolean;
  selectedInternalPaths: string | null;
  simplePath: string | null;
  // The committed page of the current listing and its paging state; both
  // change together, only when a page arrives in full.
  records: BucketObjectItem[];
  objectPage: ObjectPageState;
  loadingVersioning: boolean;
  versionInfo: BucketVersioningResponse;
  lockingEnabled: boolean | undefined;
  loadingLocking: boolean;
  selectedObjects: string[];
  downloadRenameModal: BucketObjectItem | null;
  selectedPreview: BucketObjectItem | null;
  previewOpen: boolean;
  shareFileModalOpen: boolean;
  retentionConfig: GetBucketRetentionConfig | null;
  longFileOpen: boolean;
  anonymousAccessOpen: boolean;
  connectionError: boolean;
  maxShareLinkExpTime: number;
  versionsLimit: number;
}

interface ObjectManager {
  objectsToManage: IFileItem[];
  managerOpen: boolean;
  newItems: boolean;
  startedItems: string[];
  currentDownloads: string[];
  currentUploads: string[];
}

export interface IFileItem {
  selectionKey?: string;
  browserManaged?: boolean;
  receivedBytes?: number;
  type: "download" | "upload";
  ID: string;
  instanceID: string;
  bucketName: string;
  prefix: string;
  percentage: number;
  done: boolean;
  waitingForFile: boolean;
  failed: boolean;
  cancelled: boolean;
  errorMessage: string;
}
