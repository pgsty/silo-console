// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// The paging rules of the object browser: how pages are planned against the
// committed state, how a page is assembled from WebSocket frames, when the
// rows on screen are a complete directory, and how the loaded page is
// filtered and sorted without a request.

import { expect, test } from "@playwright/test";
import {
  applyListingFrame,
  commitObjectPage,
  DEFAULT_OBJECT_PAGE_SIZE,
  firstPageRequest,
  initialObjectPageState,
  isObjectPageSize,
  ListingIdentity,
  nextPageRequest,
  OBJECT_PAGE_SIZES,
  ObjectPageState,
  pageScope,
  pageSizeRequest,
  PendingListing,
  planListingRequest,
  previousPageRequest,
  refreshPageRequest,
  resetObjectPaging,
  visiblePageObjects,
} from "../src/screens/Console/ObjectBrowser/objectPaging";
import { BucketObjectItem } from "../src/screens/Console/Buckets/ListBuckets/Objects/ListObjects/types";

const item = (
  name: string,
  size = 1,
  last_modified = "2026-01-01T00:00:00Z",
): BucketObjectItem => ({ name, size, last_modified, version_id: "" });

const commit = (
  state: ObjectPageState,
  pageIndex: number,
  token: string,
  nextToken: string,
  pageSize = state.pageSize,
): ObjectPageState =>
  commitObjectPage(state, {
    pageSize,
    pageIndex,
    token,
    nextToken,
    truncated: false,
    synthesized: false,
  });

test.describe("page sizes", () => {
  test("offer 50 to 1000 with 100 as the default and no all mode", () => {
    expect([...OBJECT_PAGE_SIZES]).toEqual([50, 100, 250, 500, 1000]);
    expect(DEFAULT_OBJECT_PAGE_SIZE).toBe(100);
    expect(initialObjectPageState.pageSize).toBe(100);
    expect(isObjectPageSize(1000)).toBe(true);
    expect(isObjectPageSize(5000)).toBe(false);
    expect(isObjectPageSize(0)).toBe(false);
  });

  test("a new size restarts at the first page and an unknown size is ignored", () => {
    const state = commit(initialObjectPageState, 0, "", "t1");
    const onPageTwo = commit(state, 1, "t1", "t2");
    expect(pageSizeRequest(onPageTwo, 500)).toEqual({
      pageSize: 500,
      pageIndex: 0,
      token: "",
    });
    expect(pageSizeRequest(onPageTwo, 5000)).toEqual({
      pageSize: 100,
      pageIndex: 0,
      token: "",
    });
  });
});

test.describe("cursor history", () => {
  test("next and previous replay the server's tokens, never a row name", () => {
    let state = commit(initialObjectPageState, 0, "", "after-b");
    expect(state).toMatchObject({
      pageIndex: 0,
      tokens: [""],
      nextToken: "after-b",
      complete: false,
    });

    const next = nextPageRequest(state);
    expect(next).toEqual({ pageSize: 100, pageIndex: 1, token: "after-b" });
    state = commit(state, 1, "after-b", "after-e");
    expect(state.tokens).toEqual(["", "after-b"]);
    expect(nextPageRequest(state)).toEqual({
      pageSize: 100,
      pageIndex: 2,
      token: "after-e",
    });

    // The last page has no next token but is still page-local.
    state = commit(state, 2, "after-e", "");
    expect(state.pageIndex).toBe(2);
    expect(state.complete).toBe(false);
    expect(nextPageRequest(state)).toBeNull();

    // Previous replays the saved cursor of page 2, then of page 1.
    const previous = previousPageRequest(state);
    expect(previous).toEqual({ pageSize: 100, pageIndex: 1, token: "after-b" });
    state = commit(state, 1, "after-b", "after-e");
    expect(state.tokens).toEqual(["", "after-b"]);
    expect(previousPageRequest(state)).toEqual({
      pageSize: 100,
      pageIndex: 0,
      token: "",
    });
    expect(previousPageRequest(commit(state, 0, "", "after-b"))).toBeNull();
  });

  test("a refresh asks for the committed page from its own cursor", () => {
    const fresh = refreshPageRequest(initialObjectPageState);
    expect(fresh).toEqual(firstPageRequest(initialObjectPageState));

    let state = commit(initialObjectPageState, 0, "", "t1");
    state = commit(state, 1, "t1", "t2");
    state = commit(state, 2, "t2", "t3");
    expect(refreshPageRequest(state)).toEqual({
      pageSize: 100,
      pageIndex: 2,
      token: "t2",
    });
    // Refreshing the third page keeps it the third page.
    state = commit(state, 2, "t2", "t3b");
    expect(state).toMatchObject({
      pageIndex: 2,
      tokens: ["", "t1", "t2"],
      nextToken: "t3b",
    });
  });

  test("a page of another size starts a new history", () => {
    let state = commit(initialObjectPageState, 0, "", "t1");
    state = commit(state, 1, "t1", "t2");
    state = commit(state, 0, "", "u1", 500);
    expect(state).toMatchObject({
      pageSize: 500,
      pageIndex: 0,
      tokens: [""],
      nextToken: "u1",
    });
  });

  test("a move to another listing forgets the cursors and keeps the size preference", () => {
    let state = commit(initialObjectPageState, 0, "", "u1", 250);
    state = commit(state, 1, "u1", "u2", 250);
    expect(resetObjectPaging(state)).toEqual({
      ...initialObjectPageState,
      pageSize: 250,
    });
  });
});

test.describe("completeness", () => {
  test("only a first page with no further page is the whole directory", () => {
    const whole = commit(initialObjectPageState, 0, "", "");
    expect(whole.complete).toBe(true);
    expect(pageScope(whole, 37)).toEqual({ kind: "complete", count: 37 });

    const first = commit(initialObjectPageState, 0, "", "t1");
    expect(first.complete).toBe(false);
    expect(pageScope(first, 100)).toEqual({
      kind: "page",
      page: 1,
      count: 100,
    });

    const last = commit(first, 1, "t1", "");
    expect(last.complete).toBe(false);
    expect(pageScope(last, 23)).toEqual({ kind: "page", page: 2, count: 23 });
  });

  test("a synthesized permission listing and a truncated history are never complete", () => {
    const synthesized = commitObjectPage(initialObjectPageState, {
      pageSize: 100,
      pageIndex: 0,
      token: "",
      nextToken: "",
      truncated: false,
      synthesized: true,
    });
    expect(synthesized.complete).toBe(false);
    expect(pageScope(synthesized, 2)).toEqual({
      kind: "page",
      page: 1,
      count: 2,
    });

    const truncated = commitObjectPage(initialObjectPageState, {
      pageSize: 100,
      pageIndex: 0,
      token: "",
      nextToken: "",
      truncated: true,
      synthesized: false,
    });
    expect(truncated.complete).toBe(false);
    expect(pageScope(truncated, 1000)).toEqual({
      kind: "truncated",
      count: 1000,
    });
    expect(pageScope(truncated, 0)).toEqual({ kind: "truncated", count: 0 });
  });
});

test.describe("planning a listing request", () => {
  const docs: ListingIdentity = {
    bucketName: "b",
    path: "docs/",
    rewindMode: false,
    date: "2026-01-01T00:00:00Z",
  };
  const onPageTwo = commit(
    commit(initialObjectPageState, 0, "", "t1"),
    1,
    "t1",
    "t2",
  );

  test("the first listing and a move to another directory start at page one and clear everything", () => {
    expect(planListingRequest(onPageTwo, null, docs)).toEqual({
      request: { pageSize: 100, pageIndex: 0, token: "" },
      clearFilter: true,
      clearListing: true,
    });
    expect(
      planListingRequest(onPageTwo, docs, { ...docs, path: "docs/new/" }),
    ).toMatchObject({ clearFilter: true, clearListing: true });
    expect(
      planListingRequest(onPageTwo, docs, { ...docs, bucketName: "other" }),
    ).toMatchObject({ clearFilter: true, clearListing: true });
  });

  test("a repeated listing refreshes the committed page and keeps rows and filter", () => {
    expect(
      planListingRequest(onPageTwo, docs, {
        ...docs,
        date: "2026-02-02T00:00:00Z",
      }),
    ).toEqual({
      request: { pageSize: 100, pageIndex: 1, token: "t1" },
      clearFilter: false,
      clearListing: false,
    });
  });

  test("an explicit page within the listing is taken as is and keeps the filter", () => {
    const next = nextPageRequest(onPageTwo)!;
    expect(planListingRequest(onPageTwo, docs, docs, next)).toEqual({
      request: next,
      clearFilter: false,
      clearListing: false,
    });
  });

  test("a change of history mode clears the rows at once but keeps the filter", () => {
    const rewind = { ...docs, rewindMode: true };
    expect(planListingRequest(onPageTwo, docs, rewind)).toEqual({
      request: { pageSize: 100, pageIndex: 0, token: "" },
      clearFilter: false,
      clearListing: true,
    });
    // Two rewind listings of the same directory differ by their date.
    expect(
      planListingRequest(onPageTwo, rewind, {
        ...rewind,
        date: "2025-01-01T00:00:00Z",
      }),
    ).toMatchObject({ clearListing: true, clearFilter: false });
    expect(planListingRequest(onPageTwo, rewind, rewind)).toMatchObject({
      clearListing: false,
    });
  });

  test("an explicit page never carries over to another listing", () => {
    const next = nextPageRequest(onPageTwo)!;
    expect(
      planListingRequest(onPageTwo, docs, { ...docs, path: "other/" }, next),
    ).toEqual({
      request: { pageSize: 100, pageIndex: 0, token: "" },
      clearFilter: true,
      clearListing: true,
    });
  });
});

test.describe("assembling a page from frames", () => {
  const request = { pageSize: 3, pageIndex: 1, token: "after-b" };
  const start = (): PendingListing<BucketObjectItem> => ({
    requestId: 7,
    request,
    records: [],
    failed: false,
  });

  test("rows are buffered and committed together with the cursor at request_end", () => {
    let pending: PendingListing<BucketObjectItem> | null = start();
    let step = applyListingFrame(pending, {
      request_id: 7,
      data: [item("c/"), item("d")],
    });
    expect(step.outcome).toEqual({ kind: "buffered" });
    step = applyListingFrame(step.pending, {
      request_id: 7,
      data: [item("e")],
    });
    expect(step.pending?.records.map((row) => row.name)).toEqual([
      "c/",
      "d",
      "e",
    ]);
    step = applyListingFrame(step.pending, {
      request_id: 7,
      request_end: true,
      next_continuation_token: "after-e",
    });
    expect(step.pending).toBeNull();
    expect(step.outcome).toEqual({
      kind: "committed",
      records: [item("c/"), item("d"), item("e")],
      commit: {
        ...request,
        nextToken: "after-e",
        truncated: false,
        synthesized: false,
      },
    });
  });

  test("an empty page commits with no rows and no next token", () => {
    const step = applyListingFrame(start(), {
      request_id: 7,
      request_end: true,
    });
    expect(step.outcome).toMatchObject({
      kind: "committed",
      records: [],
      commit: { nextToken: "", truncated: false },
    });
  });

  test("frames of another request are stale, before and after the page", () => {
    expect(
      applyListingFrame(start(), { request_id: 6, data: [item("x")] }),
    ).toEqual({
      pending: start(),
      outcome: { kind: "stale" },
    });
    expect(
      applyListingFrame(null, { request_id: 7, request_end: true }).outcome,
    ).toEqual({ kind: "stale" });
  });

  test("an error drops the buffered rows and the end of a failed request commits nothing", () => {
    let step = applyListingFrame(start(), {
      request_id: 7,
      data: [item("c/")],
    });
    step = applyListingFrame(step.pending, {
      request_id: 7,
      error: { Code: 500, APIError: { message: "boom" } },
    });
    expect(step.outcome).toEqual({ kind: "failed" });
    expect(step.pending?.failed).toBe(true);
    // Late rows of a failed request are ignored.
    step = applyListingFrame(step.pending, {
      request_id: 7,
      data: [item("d")],
    });
    expect(step.pending?.records.map((row) => row.name)).toEqual(["c/"]);
    step = applyListingFrame(step.pending, {
      request_id: 7,
      request_end: true,
      next_continuation_token: "after-e",
    });
    expect(step).toEqual({ pending: null, outcome: { kind: "ended" } });
  });

  test("a truncated history listing carries its marker into the commit", () => {
    const step = applyListingFrame(start(), {
      request_id: 7,
      request_end: true,
      truncated: true,
    });
    expect(step.outcome).toMatchObject({
      kind: "committed",
      commit: { truncated: true },
    });
  });
});

test.describe("the visible page", () => {
  const page = [
    item("b.txt", 30, "2026-01-03T00:00:00Z"),
    item("a/", 0, "0001-01-01T00:00:00Z"),
    item("C.txt", 10, "2026-01-02T00:00:00Z"),
    item("readme.md", 20, "2026-01-01T00:00:00Z"),
  ];

  test("filters by case-insensitive substring and sorts by the chosen field", () => {
    expect(
      visiblePageObjects(page, "", "name", "ASC").map((row) => row.name),
    ).toEqual(["a/", "b.txt", "C.txt", "readme.md"]);
    expect(
      visiblePageObjects(page, "", "size", "DESC").map((row) => row.name),
    ).toEqual(["b.txt", "readme.md", "C.txt", "a/"]);
    expect(
      visiblePageObjects(page, "", "last_modified", "ASC").map(
        (row) => row.name,
      ),
    ).toEqual(["a/", "readme.md", "C.txt", "b.txt"]);
    expect(
      visiblePageObjects(page, "c.TXT", "name", "ASC").map((row) => row.name),
    ).toEqual(["C.txt"]);
  });

  test("a filter without matches yields an empty page and leaves the input untouched", () => {
    expect(visiblePageObjects(page, "zzz", "name", "ASC")).toEqual([]);
    expect(page.map((row) => row.name)).toEqual([
      "b.txt",
      "a/",
      "C.txt",
      "readme.md",
    ]);
  });
});
