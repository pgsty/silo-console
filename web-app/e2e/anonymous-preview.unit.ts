// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import { resolveAnonymousOpen } from "../src/screens/Console/Buckets/ListBuckets/Objects/Preview/anonymousPreview";

test.describe("anonymous preview resolution", () => {
  test("keeps legacy media on the download path", async () => {
    let metadataRequests = 0;
    const decision = await resolveAnonymousOpen({
      object: { name: "image.png", content_type: "image/png" },
      isCurrent: () => true,
      loadMetadata: async () => {
        metadataRequests += 1;
        return {};
      },
    });

    expect(decision).toBe("download");
    expect(metadataRequests).toBe(0);
  });

  test("uses fetched metadata before admitting text", async () => {
    const decision = await resolveAnonymousOpen({
      object: { name: "README" },
      isCurrent: () => true,
      loadMetadata: async () => ({ "Content-Type": "text/plain" }),
    });

    expect(decision).toBe("preview");
  });

  test("drops a late metadata result after another open action", async () => {
    let current = true;
    let resolveMetadata!: (value: Record<string, unknown>) => void;
    const metadata = new Promise<Record<string, unknown>>((resolve) => {
      resolveMetadata = resolve;
    });
    const result = resolveAnonymousOpen({
      object: { name: "README" },
      isCurrent: () => current,
      loadMetadata: () => metadata,
    });

    current = false;
    resolveMetadata({ "Content-Type": "text/plain" });
    await expect(result).resolves.toBe("stale");
  });

  test("does not turn an aborted metadata error into a download", async () => {
    const decision = await resolveAnonymousOpen({
      object: { name: "README" },
      isCurrent: () => false,
      loadMetadata: async () => {
        throw new DOMException("aborted", "AbortError");
      },
    });

    expect(decision).toBe("stale");
  });
});
