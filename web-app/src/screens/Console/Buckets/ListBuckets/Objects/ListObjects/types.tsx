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

import { ApiError, BucketObject } from "api/consoleApi";
import { IFileInfo } from "../ObjectDetails/types";

export interface BucketObjectItem {
  name: string;
  size: number;
  etag?: string;
  last_modified: string;
  content_type?: string;
  version_id: string;
  delete_flag?: boolean;
  is_latest?: boolean;
}

export interface WebsocketRequest {
  mode: "objects" | "rewind" | "close" | "cancel";
  bucket_name?: string;
  prefix?: string;
  date?: string;
  request_id: number;
  // One "objects" page: how many entries it may hold and the opaque cursor
  // returned with the previous page's request_end (empty for the first page).
  page_size?: number;
  continuation_token?: string;
}

export interface WebsocketResponse {
  request_id: number;
  error?: WebsocketErrorResponse;
  request_end?: boolean;
  data?: ObjectResponse[];
  prefix?: string;
  bucketName?: string;
  // On request_end: the cursor of the page that follows, empty at the end of
  // the prefix; and whether a rewind listing was cut short by its row cap or
  // time budget.
  next_continuation_token?: string;
  truncated?: boolean;
}

interface WebsocketErrorResponse {
  Code: number;
  APIError: ApiError;
}

interface ObjectResponse {
  name: string;
  last_modified: string;
  size: number;
  version_id: string;
  delete_flag: boolean;
  is_latest: boolean;
}

export interface IRestoreLocalObjectList {
  prefix: string;
  objectInfo: BucketObject;
}
