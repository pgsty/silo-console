// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Drives the real Object Manager middleware, wired to the real objectBrowser
// reducer, in a real browser page with a scripted socket (see
// fixtures/objectBrowserWSHarness.ts). The rules that matter across
// navigation and reconnects hold in the code that ships: a request made while
// the socket is down changes the scope at once and is sent once, for the
// newest listing only; a cancel drops queued work; a socket that closes
// mid-page queues that page again for the next socket while its own stale
// callbacks stay inert; frames of a superseded request never commit; an error
// keeps the committed page; the 403 fallback reads the permissions of the
// current store and is never a complete directory; and a 401 ends the session.

import { Browser, chromium, expect, Page, test } from "@playwright/test";
import { createServer, ViteDevServer } from "vite";
import { browserExecutable } from "./fixtures/browserExecutable";
import type { PermissionResource } from "../src/api/consoleApi";
import type { HarnessSnapshot } from "./fixtures/objectBrowserWSHarness";
import {
  nextPageRequest,
  ObjectListingRequest,
  ObjectPageRequest,
  pageSizeRequest,
  previousPageRequest,
} from "../src/screens/Console/ObjectBrowser/objectPaging";
import { permissionItems } from "../src/screens/Console/Buckets/ListBuckets/Objects/permissionItems";

test.describe.configure({ mode: "serial" });

const listing = (
  path: string,
  page?: ObjectPageRequest,
): ObjectListingRequest => ({
  bucketName: "b",
  path,
  rewindMode: false,
  date: "2026-09-07T00:00:00Z",
  page,
});

const row = (name: string) => ({
  name,
  size: 1,
  last_modified: "2026-09-07T00:00:00Z",
  version_id: "",
  delete_flag: false,
  is_latest: true,
});

const refused = (requestId: number) => ({
  request_id: requestId,
  error: { Code: 403, APIError: { message: "Access Denied." } },
  prefix: "",
  bucketName: "b",
});

test.describe("Object Manager middleware", () => {
  let viteServer: ViteDevServer;
  let browser: Browser;
  let page: Page;
  let baseURL: string;

  // The harness API, one page.evaluate per step; every step returns the store
  // snapshot after it.
  const h = {
    reset: (allow: PermissionResource[] = []) =>
      page.evaluate((allow) => window.__obHarness.reset(allow), allow),
    dispatch: (action: { type: string; payload?: unknown }) =>
      page.evaluate((action) => window.__obHarness.dispatch(action), action),
    state: (): Promise<HarnessSnapshot> =>
      page.evaluate(() => window.__obHarness.state()),
    sockets: () => page.evaluate(() => window.__obHarness.sockets()),
    open: (index: number) =>
      page.evaluate((index) => window.__obHarness.open(index), index),
    drop: (index: number) =>
      page.evaluate((index) => window.__obHarness.drop(index), index),
    receive: (index: number, frame: unknown) =>
      page.evaluate(
        ([index, frame]) => window.__obHarness.receive(index, frame),
        [index, frame] as const,
      ),
    fire: (index: number, event: "open" | "close") =>
      page.evaluate(([index, event]) => window.__obHarness.fire(index, event), [
        index,
        event,
      ] as const),
    setAllowResources: (resources: PermissionResource[]) =>
      page.evaluate(
        (resources) => window.__obHarness.setAllowResources(resources),
        resources,
      ),
  };

  const connect = () => h.dispatch({ type: "socket/OBConnect" });
  const request = (path: string, pageRequest?: ObjectPageRequest) =>
    h.dispatch({
      type: "socket/OBRequest",
      payload: listing(path, pageRequest),
    });
  const cancel = () => h.dispatch({ type: "socket/OBCancelLast" });
  const sent = async (index: number) => (await h.sockets())[index].sent;
  const socketCount = async () => (await h.sockets()).length;
  // One complete page: its rows, then request_end with the next cursor.
  const deliver = async (
    index: number,
    requestId: number,
    rows: string[],
    nextToken = "",
  ) => {
    await h.receive(index, { request_id: requestId, data: rows.map(row) });
    return h.receive(index, {
      request_id: requestId,
      request_end: true,
      next_continuation_token: nextToken,
    });
  };

  test.beforeAll(async () => {
    viteServer = await createServer({
      logLevel: "silent",
      server: { host: "127.0.0.1", port: 0 },
    });
    await viteServer.listen();
    const address = viteServer.httpServer?.address();
    if (!address || typeof address === "string") {
      throw new Error("Vite test server did not expose a port");
    }
    baseURL = `http://127.0.0.1:${address.port}`;
    browser = await chromium.launch({ executablePath: browserExecutable() });
    page = await browser.newPage();
    await page.goto(`${baseURL}/e2e/fixtures/object-browser-ws-harness.html`);
    await page.waitForFunction(() => window.__obHarness !== undefined);
  });

  test.afterAll(async () => {
    await browser.close();
    await viteServer.close();
  });

  test.beforeEach(async () => {
    await h.reset();
  });

  test("a request made while the socket connects changes the scope at once and is sent once, for the newest listing", async () => {
    await connect();
    expect((await h.sockets())[0].readyState).toBe(0);

    expect(await request("a/")).toMatchObject({
      selectedBucket: "b",
      simplePath: "a/",
      requestInProgress: true,
      records: [],
    });
    expect((await request("docs/")).simplePath).toBe("docs/");

    // A connect while one is connecting opens no second socket, and nothing
    // is sent before the socket is open.
    await connect();
    expect(await socketCount()).toBe(1);
    expect(await sent(0)).toEqual([]);

    await h.open(0);
    expect(await sent(0)).toEqual([
      {
        mode: "objects",
        bucket_name: "b",
        prefix: "docs/",
        date: "2026-09-07T00:00:00Z",
        request_id: 1,
        page_size: 100,
      },
    ]);
    const state = await deliver(0, 1, ["docs/x.txt", "docs/y.txt"]);
    expect(state.records).toEqual(["docs/x.txt", "docs/y.txt"]);
    expect(state.objectPage).toMatchObject({
      pageIndex: 0,
      tokens: [""],
      nextToken: "",
      complete: true,
    });
    expect(state.requestInProgress).toBe(false);
  });

  test("a cancel drops a queued request and releases the loading flag", async () => {
    await connect();
    await request("a/");
    expect((await cancel()).requestInProgress).toBe(false);

    await h.open(0);
    expect(await sent(0)).toEqual([]);

    // The socket serves the next request as usual.
    expect((await request("a/")).requestInProgress).toBe(true);
    expect(await sent(0)).toEqual([
      expect.objectContaining({ prefix: "a/", request_id: 1 }),
    ]);
  });

  test("frames of a superseded request never commit; the newest request does", async () => {
    await connect();
    await h.open(0);
    await request("a/");
    await h.receive(0, { request_id: 1, data: [row("a/1.txt")] });

    expect((await request("docs/")).records).toEqual([]);
    expect(
      (await sent(0)).map(
        (frame) => (frame as { request_id: number }).request_id,
      ),
    ).toEqual([1, 2]);

    // The late end of request 1 commits nothing under the new directory.
    const late = await h.receive(0, { request_id: 1, request_end: true });
    expect(late.records).toEqual([]);
    expect(late.requestInProgress).toBe(true);

    const state = await deliver(0, 2, ["docs/x.txt"]);
    expect(state.records).toEqual(["docs/x.txt"]);
    expect(state.simplePath).toBe("docs/");
  });

  test("an error keeps the committed page, and refresh, next, previous and a new size continue from it", async () => {
    await connect();
    await h.open(0);
    await request("a/");
    const pageOne = (await deliver(0, 1, ["a/1.txt", "a/2.txt"], "after-2"))
      .objectPage;
    expect(pageOne).toMatchObject({
      pageIndex: 0,
      nextToken: "after-2",
      complete: false,
    });

    // The committed page stays while page 2 is in flight, and after it fails.
    const inFlight = await request("a/", nextPageRequest(pageOne)!);
    expect(inFlight.records).toEqual(["a/1.txt", "a/2.txt"]);
    expect((await sent(0))[1]).toMatchObject({
      request_id: 2,
      prefix: "a/",
      page_size: 100,
      continuation_token: "after-2",
    });
    await h.receive(0, { request_id: 2, data: [row("a/3.txt")] });
    await h.receive(0, {
      request_id: 2,
      error: { Code: 500, APIError: { message: "boom" } },
    });
    const failed = await h.receive(0, { request_id: 2, request_end: true });
    expect(failed.records).toEqual(["a/1.txt", "a/2.txt"]);
    expect(failed.objectPage).toEqual(pageOne);
    expect(failed.requestInProgress).toBe(false);

    // A refresh asks for the committed page again, from its own cursor.
    await request("a/");
    const refresh = (await sent(0))[2] as Record<string, unknown>;
    expect(refresh).toMatchObject({ request_id: 3, page_size: 100 });
    expect(refresh.continuation_token).toBeUndefined();
    await deliver(0, 3, ["a/1.txt", "a/2.txt"], "after-2");

    // Next, then previous, replay the server's tokens.
    await request("a/", nextPageRequest((await h.state()).objectPage)!);
    const pageTwo = await deliver(0, 4, ["a/3.txt"]);
    expect(pageTwo.objectPage).toMatchObject({
      pageIndex: 1,
      tokens: ["", "after-2"],
      nextToken: "",
      complete: false,
    });
    expect(pageTwo.records).toEqual(["a/3.txt"]);

    await request("a/", previousPageRequest(pageTwo.objectPage)!);
    const previous = (await sent(0))[4] as Record<string, unknown>;
    expect(previous).toMatchObject({ request_id: 5 });
    expect(previous.continuation_token).toBeUndefined();
    const back = await deliver(0, 5, ["a/1.txt", "a/2.txt"], "after-2");
    expect(back.objectPage).toMatchObject({
      pageIndex: 0,
      tokens: [""],
      nextToken: "after-2",
    });

    // A new size restarts at the first page with that size.
    await request("a/", pageSizeRequest(back.objectPage, 250));
    const resized = (await sent(0))[5] as Record<string, unknown>;
    expect(resized).toMatchObject({ request_id: 6, page_size: 250 });
    expect(resized.continuation_token).toBeUndefined();
  });

  test("a socket that closes mid-page queues that page for the next socket, whose predecessor's callbacks are inert", async () => {
    await connect();
    await h.open(0);
    await request("a/");
    const pageOne = await deliver(0, 1, ["a/1.txt"], "after-1");
    await request("a/", nextPageRequest(pageOne.objectPage)!);
    expect((await sent(0))[1]).toMatchObject({
      request_id: 2,
      continuation_token: "after-1",
    });

    // The committed page stays, nothing is complete, the page is still
    // loading.
    const dropped = await h.drop(0);
    expect(dropped.records).toEqual(["a/1.txt"]);
    expect(dropped.requestInProgress).toBe(true);
    expect(dropped.objectPage.pageIndex).toBe(0);

    // The reconnect timer dispatches OBConnect; here the test does. A second
    // OBConnect while connecting opens no further socket.
    await connect();
    await connect();
    expect(await socketCount()).toBe(2);
    await h.open(1);
    expect(await sent(1)).toEqual([
      expect.objectContaining({
        request_id: 3,
        prefix: "a/",
        continuation_token: "after-1",
        page_size: 100,
      }),
    ]);

    // Callbacks of the replaced socket must not touch the page in flight.
    await h.fire(0, "close");
    await h.receive(0, { request_id: 3, request_end: true });
    const stale = await h.fire(0, "open");
    expect(stale.requestInProgress).toBe(true);
    expect(stale.objectPage.pageIndex).toBe(0);

    const pageTwo = await deliver(1, 3, ["a/2.txt"]);
    expect(pageTwo.records).toEqual(["a/2.txt"]);
    expect(pageTwo.objectPage).toMatchObject({
      pageIndex: 1,
      tokens: ["", "after-1"],
      complete: false,
    });

    // While a socket is open, a connect opens nothing.
    await connect();
    expect(await socketCount()).toBe(2);
  });

  test("a navigation during a disconnect clears the old rows at once and only the newest directory reaches the next socket", async () => {
    await connect();
    await h.open(0);
    await request("a/");
    await deliver(0, 1, ["a/1.txt"]);
    await h.drop(0);

    const moved = await request("docs/");
    expect(moved.records).toEqual([]);
    expect(moved.simplePath).toBe("docs/");
    // The request started a connection.
    expect(await socketCount()).toBe(2);

    const movedAgain = await request("other/");
    expect(movedAgain.simplePath).toBe("other/");
    expect(await socketCount()).toBe(2);

    await h.open(1);
    expect(await sent(1)).toEqual([
      expect.objectContaining({ prefix: "other/", request_id: 2 }),
    ]);
    expect(await sent(0)).toHaveLength(1);
  });

  test("the 403 fallback reads the permissions of the current store and is never a complete directory", async () => {
    await connect();
    await h.open(0);
    // The permissions arrive after the socket was opened.
    const allow: PermissionResource[] = [
      {
        resource: "arn:aws:s3:::b/docs/*",
        conditionOperator: "",
        prefixes: [],
      },
    ];
    await h.setAllowResources(allow);
    const expected = permissionItems("b", "", allow)!.map((item) => item.name);
    expect(expected.length).toBeGreaterThan(0);

    await request("");
    const fallback = await h.receive(0, refused(1));
    expect(fallback.records).toEqual(expected);
    expect(fallback.objectPage).toMatchObject({
      pageIndex: 0,
      tokens: [""],
      nextToken: "",
      complete: false,
    });
    expect(fallback.requestInProgress).toBe(false);
    // The end frame of the refused request changes nothing.
    const ended = await h.receive(0, { request_id: 1, request_end: true });
    expect(ended.records).toEqual(expected);
    expect(ended.objectPage.complete).toBe(false);

    // Without matching permissions the refusal is an error: the page on
    // screen stays and nothing is loading.
    await h.setAllowResources([]);
    await request("");
    await h.receive(0, refused(2));
    const error = await h.receive(0, { request_id: 2, request_end: true });
    expect(error.records).toEqual(expected);
    expect(error.requestInProgress).toBe(false);
  });

  // Last: the expired session leaves the harness page for the login page.
  test("a 401 drops the page in flight and ends the session", async () => {
    await connect();
    await h.open(0);
    await request("a/");
    await h.receive(0, { request_id: 1, data: [row("a/1.txt")] });
    const navigation = page.waitForURL(/\/login$/, { waitUntil: "commit" });
    await page.evaluate(() =>
      window.__obHarness.receive(0, {
        request_id: 1,
        error: { Code: 401, APIError: { message: "invalid session" } },
      }),
    );
    await navigation;
    expect(new URL(page.url()).pathname).toBe("/login");
  });
});
