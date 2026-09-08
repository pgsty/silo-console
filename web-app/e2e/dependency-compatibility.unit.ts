// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { createServer } from "node:http";
import { createRequire } from "node:module";
import type { AddressInfo } from "node:net";
import { expect, test } from "@playwright/test";
import { Client as ESMClient } from "minio";

const require = createRequire(import.meta.url);
const CommonJSClient: typeof ESMClient = require("minio").Client;

test("TestCafe's decoder does not construct a function from an error name", () => {
  // TestCafe replaced the vulnerable standalone replicator with its own decoder.
  // Verify the security fix, not just the disappearance of the package in audit.
  const Replicator = require("testcafe/lib/utils/replicator");
  const decoded = new Replicator().decode(
    JSON.stringify([
      {
        "@t": "[[Error]]",
        data: { name: "Function", message: "return 42", stack: "fixture" },
      },
    ]),
  );
  expect(decoded).toBeInstanceOf(Error);
  expect(decoded.message).toBe("return 42");
});

// The fixed stream-json release changed the JSONL parser's entrypoint and
// stream factory. Exercise the SDK, including its actual HTTP stream, so
// either published build reverting to the old API fails here.
for (const [name, Client] of [
  ["ESM", ESMClient],
  ["CommonJS", CommonJSClient],
] as const) {
  for (const malformed of [false, true]) {
    test(`${name} SDK notification parser ${malformed ? "reports malformed JSON" : "accepts fragmented UTF-8 JSONL"}`, async () => {
      const record = { eventName: "s3:ObjectCreated:Put", key: "中文.txt" };
      const payload = malformed
        ? Buffer.from("{broken}\n")
        : Buffer.from(`\n{}\n${JSON.stringify({ Records: [record] })}\n`);
      const server = createServer((_request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" });
        // Split in the middle of a UTF-8 character, not just between lines.
        const split = malformed ? 3 : payload.indexOf(Buffer.from("中")) + 1;
        response.write(payload.subarray(0, split));
        setImmediate(() => response.end(payload.subarray(split)));
      });
      await new Promise<void>((resolve) =>
        server.listen(0, "127.0.0.1", resolve),
      );
      const client = new Client({
        endPoint: "127.0.0.1",
        port: (server.address() as AddressInfo).port,
        useSSL: false,
        region: "us-east-1",
        accessKey: "test-access-key",
        secretKey: "test-secret-key",
      });
      const poller = client.listenBucketNotification("fixture", "", "", [
        "s3:ObjectCreated:Put",
      ]);
      try {
        const event = await new Promise<{ record?: unknown; error?: unknown }>(
          (resolve, reject) => {
            const timer = setTimeout(
              () => reject(new Error("SDK parser stalled")),
              3000,
            );
            poller.once("notification", (record) => {
              clearTimeout(timer);
              poller.stop();
              resolve({ record });
            });
            poller.once("error", (error) => {
              clearTimeout(timer);
              poller.stop();
              resolve({ error });
            });
          },
        );
        if (malformed) {
          expect(event.error).toBeInstanceOf(SyntaxError);
        } else {
          expect(event.error).toBeUndefined();
          expect(event.record).toEqual(record);
        }
      } finally {
        poller.stop();
        server.closeAllConnections();
        await new Promise<void>((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        );
      }
    });
  }
}
