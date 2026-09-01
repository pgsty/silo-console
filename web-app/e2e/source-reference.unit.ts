// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  LEGAL_DOCUMENT_PATHS,
  readSourceReference,
} from "../src/common/sourceReference";

const meta =
  (tags: Record<string, string>) =>
  (name: string): string | null =>
    name in tags ? tags[name] : null;

test.describe("corresponding source reference", () => {
  test("accepts an available exact source", () => {
    const ref = readSourceReference(
      meta({
        "silo-console-source-status": "available",
        "silo-console-source":
          "https://github.com/pgsty/silo-console/tree/v2.3.0",
        "silo-console-source-reason": "",
        "silo-console-build": "2.3.0 0123456789abcdef",
      }),
    );
    expect(ref).toEqual({
      available: true,
      url: "https://github.com/pgsty/silo-console/tree/v2.3.0",
      reason: "",
      build: "2.3.0 0123456789abcdef",
    });
  });

  test("reports the server's reason when no source is claimed", () => {
    const ref = readSourceReference(
      meta({
        "silo-console-source-status": "unavailable",
        "silo-console-source": "",
        "silo-console-source-reason":
          "the working tree was modified when this binary was built",
        "silo-console-build": "(dev) (dev)",
      }),
    );
    expect(ref.available).toBe(false);
    expect(ref.url).toBe("");
    expect(ref.reason).toContain("modified");
  });

  test("never trusts a claim the server did not make or a non-public URL", () => {
    expect(
      readSourceReference(
        meta({ "silo-console-source": "https://x.example/y" }),
      ).available,
    ).toBe(false);
    for (const url of [
      "http://github.com/pgsty/silo-console",
      "https://user:pw@github.com/pgsty/silo-console",
      "https://github.com/pgsty/silo-console?x=1",
      "https://github.com/pgsty/silo-console#frag",
      "javascript:alert(1)",
      "",
    ]) {
      const ref = readSourceReference(
        meta({
          "silo-console-source-status": "available",
          "silo-console-source": url,
        }),
      );
      expect(ref.available, url).toBe(false);
      expect(ref.url, url).toBe("");
    }
  });

  test("explains a missing injection", () => {
    const ref = readSourceReference(meta({}));
    expect(ref.available).toBe(false);
    expect(ref.reason).toContain("did not report");
  });

  test("legal documents are addressed relative to the base href", () => {
    for (const path of Object.values(LEGAL_DOCUMENT_PATHS)) {
      expect(path.startsWith("/")).toBe(false);
      expect(path.startsWith("legal/")).toBe(true);
    }
  });
});
