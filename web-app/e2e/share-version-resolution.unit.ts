// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  resolveShareVersion,
  resolveUnversionedShareSubject,
  ShareSubject,
  shareSubjectKey,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/ObjectDetails/shareSubject";
import {
  isObjectTarget,
  RequestedObject,
  TaggedResult,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/objectIdentity";
import { ObjectRequestGuard } from "../src/screens/Console/Buckets/ListBuckets/Objects/requestGuard";

interface Entry {
  name?: string;
  version_id?: string;
  is_latest?: boolean;
  is_delete_marker?: boolean;
}

const versionsOf = (
  bucket: string,
  key: string,
  items: Entry[],
): TaggedResult<Entry> => ({ bucket, key, kind: "versions", items });

const latestOf = (bucket: string, key: string): RequestedObject => ({
  bucket,
  key,
  version: { kind: "latest" },
});

test.describe("share version resolution", () => {
  test("resolves the exact latest version and ignores prefix matches", () => {
    const listing = versionsOf("b", "a.txt", [
      { name: "a.txt.bak", version_id: "x", is_latest: true },
      { name: "a.txt", version_id: "v2", is_latest: true },
      { name: "a.txt", version_id: "v1" },
    ]);
    expect(resolveShareVersion(latestOf("b", "a.txt"), listing)).toEqual({
      kind: "version",
      versionId: "v2",
    });
  });

  test("resolves an explicitly requested version against the same listing", () => {
    const listing = versionsOf("b", "a.txt", [
      { name: "a.txt", version_id: "v2", is_latest: true },
      { name: "a.txt", version_id: "v1" },
    ]);
    expect(
      resolveShareVersion(
        { bucket: "b", key: "a.txt", version: { kind: "id", versionId: "v1" } },
        listing,
      ),
    ).toEqual({ kind: "version", versionId: "v1" });
    expect(
      resolveShareVersion(
        { bucket: "b", key: "a.txt", version: { kind: "id", versionId: "v9" } },
        listing,
      ),
    ).toEqual({ kind: "none", reason: "not-found" });
  });

  test("fails closed on delete markers, missing objects and stale listings", () => {
    expect(
      resolveShareVersion(
        latestOf("b", "a.txt"),
        versionsOf("b", "a.txt", [
          {
            name: "a.txt",
            version_id: "m",
            is_latest: true,
            is_delete_marker: true,
          },
        ]),
      ),
    ).toEqual({ kind: "none", reason: "delete-marker" });
    expect(
      resolveShareVersion(latestOf("b", "a.txt"), versionsOf("b", "a.txt", [])),
    ).toEqual({ kind: "none", reason: "not-found" });
    expect(
      resolveShareVersion(
        latestOf("b", "a.txt"),
        versionsOf("b", "other.txt", [
          { name: "a.txt", version_id: "v1", is_latest: true },
        ]),
      ),
    ).toEqual({ kind: "none", reason: "stale-listing" });
    expect(
      resolveShareVersion(
        latestOf("b", "a.txt"),
        versionsOf("other", "a.txt", [
          { name: "a.txt", version_id: "v1", is_latest: true },
        ]),
      ),
    ).toEqual({ kind: "none", reason: "stale-listing" });
  });

  test("an unversioned bucket in a distributed setup resolves the null version", () => {
    expect(
      resolveShareVersion(
        latestOf("b", "a.txt"),
        versionsOf("b", "a.txt", [
          { name: "a.txt", version_id: "null", is_latest: true },
        ]),
      ),
    ).toEqual({ kind: "version", versionId: "null" });
  });

  test("without versions only the null version can be shared", () => {
    expect(resolveUnversionedShareSubject(latestOf("b", "a"))).toEqual({
      kind: "version",
      versionId: "null",
    });
    expect(
      resolveUnversionedShareSubject({
        bucket: "b",
        key: "a",
        version: { kind: "id", versionId: "null" },
      }),
    ).toEqual({ kind: "version", versionId: "null" });
    expect(
      resolveUnversionedShareSubject({
        bucket: "b",
        key: "a",
        version: { kind: "id", versionId: "v1" },
      }),
    ).toEqual({ kind: "none", reason: "unversioned" });
  });

  test("subject keys distinguish targets, latest requests and explicit requests", () => {
    const subjects: ShareSubject[] = [
      { bucket: "b", key: "k", versionId: "v1" },
      { bucket: "b", key: "k", version: { kind: "latest" } },
      { bucket: "b", key: "k", version: { kind: "id", versionId: "v1" } },
    ];
    expect(new Set(subjects.map(shareSubjectKey)).size).toBe(3);
    expect(subjects.map(isObjectTarget)).toEqual([true, false, false]);
  });

  test("a listing for A that settles after the dialog moved to B never shares A", async () => {
    const guard = new ObjectRequestGuard<string>();
    const shared: Array<{ key: string; versionId: string }> = [];
    const listA = new Promise<TaggedResult<Entry>>((resolve) => {
      setTimeout(
        () =>
          resolve(
            versionsOf("b", "A", [
              { name: "A", version_id: "a1", is_latest: true },
            ]),
          ),
        20,
      );
    });
    const listB = Promise.resolve(
      versionsOf("b", "B", [{ name: "B", version_id: "b1", is_latest: true }]),
    );

    const run = (
      subject: RequestedObject,
      listing: Promise<TaggedResult<Entry>>,
    ) => {
      const ticket = guard.begin(shareSubjectKey(subject));
      return listing.then((result) => {
        if (!ticket.isCurrent()) {
          return;
        }
        const resolution = resolveShareVersion(subject, result);
        if (resolution.kind === "version") {
          shared.push({ key: subject.key, versionId: resolution.versionId });
        }
      });
    };

    const runA = run(latestOf("b", "A"), listA);
    const runB = run(latestOf("b", "B"), listB);
    await Promise.all([runA, runB]);
    expect(shared).toEqual([{ key: "B", versionId: "b1" }]);
  });
});
