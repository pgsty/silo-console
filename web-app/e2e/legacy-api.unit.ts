// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { expect, test } from "@playwright/test";
import { API } from "../src/common/api";

test("a dropped connection rejects without trying to end the browser session", async () => {
  const server = createServer((request) => request.socket.destroy());
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const { port } = server.address() as AddressInfo;
    await expect(
      new API().invoke("GET", `http://127.0.0.1:${port}/api/v1/buckets`),
    ).rejects.toEqual({
      errorMessage: "A network error occurred.",
      detailedError: "",
      statusCode: 0,
    });
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("a status-zero XHR error reaches the caller as a transport failure", async () => {
  await expect(new API().onError({ status: 0 })).rejects.toMatchObject({
    statusCode: 0,
    errorMessage: "A network error occurred.",
  });
});

test("HTTP failures retain their server message and status", async () => {
  await expect(
    new API().onError({
      status: 403,
      response: { body: { message: "access denied" } },
    }),
  ).rejects.toEqual({
    errorMessage: "Access denied",
    detailedError: "",
    statusCode: 403,
  });
});
