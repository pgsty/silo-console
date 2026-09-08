// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Pure paging rules for the object browser. This module must stay free of
// store/react imports: the slice, the Object Manager WebSocket middleware, the
// table and the unit tests share one definition of how pages, cursors,
// completeness and the pending page evolve.

import type { BucketObjectItem } from "../Buckets/ListBuckets/Objects/ListObjects/types";

// One page is one ListObjectsV2 call, so the largest page is the most one S3
// response can hold; there is no "all" mode.
export const OBJECT_PAGE_SIZES = [50, 100, 250, 500, 1000] as const;
export const DEFAULT_OBJECT_PAGE_SIZE = 100;

export interface ObjectPageState {
  // Committed page size; it changes only once a page of the new size has
  // arrived, so a failed size change leaves the selector on the old value.
  pageSize: number;
  // Zero-based index of the committed page.
  pageIndex: number;
  // tokens[i] is the continuation token that produced page i (tokens[0] is
  // ""), so "previous" replays a saved cursor and never derives one from a
  // displayed name. Empty until a page has been committed.
  tokens: string[];
  // Cursor of the page after the committed one; "" when there is none.
  nextToken: string;
  // The committed page is the whole directory: it was requested without a
  // cursor and the server reported no further page.
  complete: boolean;
  // A rewind listing was cut short by the row cap or the time budget.
  truncated: boolean;
}

export const initialObjectPageState: ObjectPageState = {
  pageSize: DEFAULT_OBJECT_PAGE_SIZE,
  pageIndex: 0,
  tokens: [],
  nextToken: "",
  complete: false,
  truncated: false,
};

// One page request as planned against the committed state.
export interface ObjectPageRequest {
  pageSize: number;
  pageIndex: number;
  token: string;
}

// What a successful page commits, together with its rows.
export interface ObjectPageCommit extends ObjectPageRequest {
  nextToken: string;
  truncated: boolean;
  // The rows were synthesized from the session's permissions after a 403,
  // not listed from S3; such a page is never a complete directory.
  synthesized: boolean;
}

export const isObjectPageSize = (size: number): boolean =>
  (OBJECT_PAGE_SIZES as readonly number[]).includes(size);

export const firstPageRequest = (
  state: ObjectPageState,
): ObjectPageRequest => ({
  pageSize: state.pageSize,
  pageIndex: 0,
  token: "",
});

// The committed page again, from the same cursor; the first page when nothing
// has been committed yet.
export const refreshPageRequest = (
  state: ObjectPageState,
): ObjectPageRequest => {
  if (state.tokens.length === 0) {
    return firstPageRequest(state);
  }
  const pageIndex = Math.min(state.pageIndex, state.tokens.length - 1);
  return {
    pageSize: state.pageSize,
    pageIndex,
    token: state.tokens[pageIndex],
  };
};

export const nextPageRequest = (
  state: ObjectPageState,
): ObjectPageRequest | null =>
  state.nextToken === ""
    ? null
    : {
        pageSize: state.pageSize,
        pageIndex: state.pageIndex + 1,
        token: state.nextToken,
      };

export const previousPageRequest = (
  state: ObjectPageState,
): ObjectPageRequest | null =>
  state.pageIndex === 0 || state.tokens.length < state.pageIndex
    ? null
    : {
        pageSize: state.pageSize,
        pageIndex: state.pageIndex - 1,
        token: state.tokens[state.pageIndex - 1],
      };

// A new page size restarts at the first page; unknown sizes are ignored.
export const pageSizeRequest = (
  state: ObjectPageState,
  size: number,
): ObjectPageRequest => ({
  pageSize: isObjectPageSize(size) ? size : state.pageSize,
  pageIndex: 0,
  token: "",
});

// Applies a successful page. Data, page size and cursor history change
// together and only here; a failed or canceled request never reaches it.
export const commitObjectPage = (
  state: ObjectPageState,
  commit: ObjectPageCommit,
): ObjectPageState => {
  // History belongs to one page size, and a page can only extend a history
  // that reaches it; anything else restarts the history at this page.
  const history =
    commit.pageSize === state.pageSize &&
    commit.pageIndex <= state.tokens.length
      ? state.tokens.slice(0, commit.pageIndex)
      : [];
  const pageIndex = history.length;
  return {
    pageSize: commit.pageSize,
    pageIndex,
    tokens: [...history, commit.token],
    nextToken: commit.nextToken,
    complete:
      pageIndex === 0 &&
      commit.token === "" &&
      commit.nextToken === "" &&
      !commit.truncated &&
      !commit.synthesized,
    truncated: commit.truncated,
  };
};

// Forgets the cursor history when the listing moves to another directory,
// bucket or mode; the page size is a user preference and survives.
export const resetObjectPaging = (state: ObjectPageState): ObjectPageState => ({
  ...initialObjectPageState,
  pageSize: state.pageSize,
});

// ---- what a listing request is for ----------------------------------------

export interface ListingIdentity {
  bucketName: string;
  path: string;
  rewindMode: boolean;
  date: string;
}

const sameListingLocation = (a: ListingIdentity, b: ListingIdentity): boolean =>
  a.bucketName === b.bucketName && a.path === b.path;

// Two requests list the same thing when bucket, directory and mode agree; the
// date only matters while rewinding.
const sameListing = (a: ListingIdentity, b: ListingIdentity): boolean =>
  sameListingLocation(a, b) &&
  a.rewindMode === b.rewindMode &&
  (!a.rewindMode || a.date === b.date);

// What a listing request asks for: the directory and mode, and optionally an
// explicit page from the pager.
export interface ObjectListingRequest extends ListingIdentity {
  page?: ObjectPageRequest;
}

interface ListingPlan {
  request: ObjectPageRequest;
  // The filter text belongs to a directory; a move clears it.
  clearFilter: boolean;
  // Rows and cursors belong to one listing; a move to another listing
  // clears them at once so the old directory is never shown under the new
  // path. Paging and refreshing within a listing keep the committed page
  // until the new one arrives.
  clearListing: boolean;
}

// Plans the page for a listing request: within the committed listing an
// explicit page from the pager is taken as is and anything else refreshes the
// committed page; any other listing starts at its first page, whatever was
// asked for.
export const planListingRequest = (
  state: ObjectPageState,
  previous: ListingIdentity | null,
  next: ListingIdentity,
  explicit?: ObjectPageRequest,
): ListingPlan => {
  const repeated = previous !== null && sameListing(previous, next);
  let request = firstPageRequest(state);
  if (repeated) {
    request = explicit ?? refreshPageRequest(state);
  }
  return {
    request,
    clearFilter: previous === null || !sameListingLocation(previous, next),
    clearListing: !repeated,
  };
};

// ---- assembling one page from WebSocket frames ------------------------------

interface ListingFrame<T> {
  request_id: number;
  request_end?: boolean;
  data?: T[];
  error?: unknown;
  next_continuation_token?: string;
  truncated?: boolean;
}

// The page of the request in flight. Rows are buffered here and reach the
// store only when the request ends successfully, so an error, a cancellation
// or a disconnect leaves the committed page untouched.
export interface PendingListing<T> {
  requestId: number;
  request: ObjectPageRequest;
  records: T[];
  failed: boolean;
}

type ListingFrameOutcome<T> =
  | { kind: "stale" }
  | { kind: "buffered" }
  | { kind: "failed" }
  | { kind: "committed"; records: T[]; commit: ObjectPageCommit }
  | { kind: "ended" };

export const applyListingFrame = <T>(
  pending: PendingListing<T> | null,
  frame: ListingFrame<T>,
): { pending: PendingListing<T> | null; outcome: ListingFrameOutcome<T> } => {
  if (pending === null || frame.request_id !== pending.requestId) {
    return { pending, outcome: { kind: "stale" } };
  }
  if (frame.error) {
    return {
      pending: { ...pending, failed: true },
      outcome: { kind: "failed" },
    };
  }
  if (frame.request_end) {
    if (pending.failed) {
      return { pending: null, outcome: { kind: "ended" } };
    }
    return {
      pending: null,
      outcome: {
        kind: "committed",
        records: pending.records,
        commit: {
          ...pending.request,
          nextToken: frame.next_continuation_token ?? "",
          truncated: !!frame.truncated,
          synthesized: false,
        },
      },
    };
  }
  if (frame.data && frame.data.length > 0 && !pending.failed) {
    return {
      pending: { ...pending, records: pending.records.concat(frame.data) },
      outcome: { kind: "buffered" },
    };
  }
  return { pending, outcome: { kind: "buffered" } };
};

// ---- the visible page ----------------------------------------------------------

export type ObjectSortField = "name" | "last_modified" | "size";

const compareObjects = (
  field: ObjectSortField,
): ((a: BucketObjectItem, b: BucketObjectItem) => number) => {
  switch (field) {
    case "last_modified":
      return (a, b) =>
        new Date(a.last_modified).getTime() -
        new Date(b.last_modified).getTime();
    case "size":
      return (a, b) => (a.size ?? -1) - (b.size ?? -1);
    default:
      return (a, b) => a.name.localeCompare(b.name);
  }
};

// Filters and sorts the committed page in memory. Neither the filter nor the
// sort reaches the server: a large directory is filtered and sorted page by
// page, a complete directory as a whole.
export const visiblePageObjects = (
  records: readonly BucketObjectItem[],
  search: string,
  field: ObjectSortField,
  direction: "ASC" | "DESC" | undefined,
): BucketObjectItem[] => {
  const needle = search.toLowerCase();
  const visible = records.filter(
    (item) => needle === "" || item.name.toLowerCase().includes(needle),
  );
  visible.sort(compareObjects(field));
  if (direction === "DESC") {
    visible.reverse();
  }
  return visible;
};

type PageScope =
  | { kind: "complete"; count: number }
  | { kind: "page"; page: number; count: number }
  | { kind: "truncated"; count: number };

// What the rows on screen represent: the whole directory, one page of a larger
// one, or a history listing that was cut short.
export const pageScope = (state: ObjectPageState, count: number): PageScope => {
  if (state.truncated) {
    return { kind: "truncated", count };
  }
  if (state.complete) {
    return { kind: "complete", count };
  }
  return { kind: "page", page: state.pageIndex + 1, count };
};
