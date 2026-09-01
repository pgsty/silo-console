// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Live-stack regression for issue #23: a diagnostic WebSocket (logs,
// profiling, health report) must not outlive the page that opened it when the
// user navigates away inside the application.

import type { Page, WebSocket } from "@playwright/test";
import { expect, test } from "./fixtures/baseFixture";
import { minioadminFile, SERVER_ENDPOINT } from "./consts";

test.use({ storageState: minioadminFile });
test.setTimeout(60_000);

const closedPromise = (socket: WebSocket): Promise<void> =>
  new Promise((resolve) => {
    if (socket.isClosed()) {
      resolve();
      return;
    }
    socket.on("close", () => resolve());
  });

const startAndLeave = async (
  page: Page,
  path: string,
  start: string,
  socketPath: string,
) => {
  const opened = page.waitForEvent("websocket", (socket) =>
    socket.url().includes(socketPath),
  );
  await page.goto(`${SERVER_ENDPOINT}${path}`);
  await page.locator(start).click();
  const socket = await opened;
  const closed = closedPromise(socket);

  // Client-side navigation: the page unmounts without a document reload.
  await page.locator("#buckets").click();
  await expect(page).toHaveURL(/\/buckets$/);
  await closed;
  expect(socket.isClosed()).toBe(true);
};

test("the logs socket closes when the user leaves the page", async ({
  page,
}) => {
  await startAndLeave(page, "/tools/logs", "#start-logs", "/ws/console/");
});

test("the profiling socket closes when the user leaves the page", async ({
  page,
}) => {
  await startAndLeave(
    page,
    "/support/profile",
    "#start-profiling",
    "/ws/profile",
  );
});

test("the health report socket closes when the user leaves the page", async ({
  page,
}) => {
  await startAndLeave(
    page,
    "/support/diagnostics",
    "#start-new-diagnostic",
    "/ws/health-info",
  );
});
