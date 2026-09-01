// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  deleteRequestVersion,
  identityKey,
  isObjectTarget,
  requestedObjectKey,
  resolveObject,
  routeObjectIdentity,
  rowTarget,
  sameRequestedObject,
  targetKey,
  TaggedResult,
  ValidatedObject,
  versionSelectorFromRedux,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/objectIdentity";

interface Entry {
  name?: string;
  version_id?: string;
  is_latest?: boolean;
  is_delete_marker?: boolean;
  size?: number;
}

const versionsOf = (
  bucket: string,
  key: string,
  items: Entry[],
): TaggedResult<Entry> => ({ bucket, key, kind: "versions", items });

const currentOf = (
  bucket: string,
  key: string,
  items: Entry[],
): TaggedResult<Entry> => ({ bucket, key, kind: "current", items });

const latest = { kind: "latest" } as const;
const id = (versionId: string) => ({ kind: "id", versionId }) as const;

test.describe("requested object resolution", () => {
  const listing = versionsOf("b", "docs/a.txt", [
    { name: "docs/a.txt", version_id: "v2", is_latest: true, size: 2 },
    { name: "docs/a.txt", version_id: "v1", size: 1 },
    { name: "docs/a.txt.bak", version_id: "x", is_latest: true },
  ]);

  test("latest resolves to the is_latest entry of the exact key", () => {
    const validated = resolveObject(
      { bucket: "b", key: "docs/a.txt", version: latest },
      listing,
    );
    expect(validated?.resolved).toEqual({
      bucket: "b",
      key: "docs/a.txt",
      versionId: "v2",
    });
    expect(validated?.info.size).toBe(2);
  });

  test("an explicit id resolves only to that exact version", () => {
    expect(
      resolveObject(
        { bucket: "b", key: "docs/a.txt", version: id("v1") },
        listing,
      )?.resolved.versionId,
    ).toBe("v1");
    expect(
      resolveObject(
        { bucket: "b", key: "docs/a.txt", version: id("v9") },
        listing,
      ),
    ).toBeNull();
  });

  test("a version transition leaves the object unresolved until the listing has it", () => {
    // V1 is displayed from an older listing; the user selected V2.
    const onlyV1 = versionsOf("b", "a", [
      { name: "a", version_id: "v1", is_latest: true },
    ]);
    expect(
      resolveObject({ bucket: "b", key: "a", version: id("v2") }, onlyV1),
    ).toBeNull();
  });

  test("the literal null version is an explicit id, not latest", () => {
    const nullListing = versionsOf("b", "a", [
      { name: "a", version_id: "null", is_latest: true },
    ]);
    expect(versionSelectorFromRedux("")).toEqual(latest);
    expect(versionSelectorFromRedux("null")).toEqual(id("null"));
    expect(
      resolveObject({ bucket: "b", key: "a", version: id("null") }, nullListing)
        ?.resolved.versionId,
    ).toBe("null");
  });

  test("a versions entry without a version id never resolves", () => {
    const missingId = versionsOf("b", "a", [{ name: "a", is_latest: true }]);
    expect(
      resolveObject({ bucket: "b", key: "a", version: latest }, missingId),
    ).toBeNull();
    expect(
      resolveObject({ bucket: "b", key: "a", version: id("") }, missingId),
    ).toBeNull();
  });

  test("a versions entry with omitted is_latest does not resolve latest", () => {
    const noLatest = versionsOf("b", "a", [{ name: "a", version_id: "v1" }]);
    expect(
      resolveObject({ bucket: "b", key: "a", version: latest }, noLatest),
    ).toBeNull();
  });

  test("a current listing normalizes an omitted version to null", () => {
    const current = currentOf("b", "a", [{ name: "a", size: 3 }]);
    const validated = resolveObject(
      { bucket: "b", key: "a", version: latest },
      current,
    );
    expect(validated?.resolved).toEqual({
      bucket: "b",
      key: "a",
      versionId: "null",
    });
    expect(
      resolveObject({ bucket: "b", key: "a", version: id("null") }, current)
        ?.resolved.versionId,
    ).toBe("null");
    expect(
      resolveObject({ bucket: "b", key: "a", version: id("v1") }, current),
    ).toBeNull();
  });

  test("a listing tagged for another bucket or key is rejected", () => {
    const requested = { bucket: "b", key: "docs/a.txt", version: latest };
    expect(
      resolveObject(
        requested,
        versionsOf("other", "docs/a.txt", listing.items),
      ),
    ).toBeNull();
    expect(
      resolveObject(requested, versionsOf("b", "docs/b.txt", listing.items)),
    ).toBeNull();
    expect(resolveObject(requested, null)).toBeNull();
  });

  test("a delete marker resolves for display", () => {
    const marker = versionsOf("b", "a", [
      { name: "a", version_id: "m", is_latest: true, is_delete_marker: true },
    ]);
    expect(
      resolveObject({ bucket: "b", key: "a", version: latest }, marker)?.info
        .is_delete_marker,
    ).toBe(true);
  });
});

test.describe("delete request version", () => {
  const listing = versionsOf("b", "a", [
    { name: "a", version_id: "v2", is_latest: true },
    { name: "a", version_id: "v1" },
  ]);

  test("a latest request deletes the current object without a version id", () => {
    const validated: ValidatedObject<Entry> | null = resolveObject(
      { bucket: "b", key: "a", version: latest },
      listing,
    );
    expect(validated?.resolved.versionId).toBe("v2");
    expect(deleteRequestVersion(validated!)).toBeUndefined();
  });

  test("an explicit version request names that version", () => {
    const validated = resolveObject(
      { bucket: "b", key: "a", version: id("v1") },
      listing,
    );
    expect(deleteRequestVersion(validated!)).toBe("v1");
  });
});

test.describe("row targets", () => {
  const rowV1 = { name: "a", version_id: "v1" };
  const rowV3 = { name: "a", version_id: "v3", is_latest: true };
  const rowNoId = { name: "a", is_latest: true };
  const listing = versionsOf("b", "a", [rowV3, rowV1, rowNoId]);
  const location = { bucket: "b", key: "a" };

  test("a clicked row yields its own concrete version, not the latest", () => {
    expect(rowTarget(location, listing, rowV1)).toEqual({
      bucket: "b",
      key: "a",
      versionId: "v1",
    });
  });

  test("rows outside the listing, for another key, or without an id yield nothing", () => {
    expect(
      rowTarget(location, listing, { name: "a", version_id: "v1" }),
    ).toBeNull();
    expect(
      rowTarget(
        location,
        versionsOf("b", "a", [{ name: "other", version_id: "v1" }]),
        {
          name: "other",
          version_id: "v1",
        },
      ),
    ).toBeNull();
    expect(rowTarget(location, listing, rowNoId)).toBeNull();
  });

  test("a listing for the same key in another bucket is rejected", () => {
    expect(rowTarget({ bucket: "B", key: "a" }, listing, rowV1)).toBeNull();
    expect(rowTarget(location, null, rowV1)).toBeNull();
  });
});

test.describe("identity keys", () => {
  test("serialization is collision free", () => {
    expect(identityKey(["xy", "z"])).not.toBe(identityKey(["x", "yz"]));
    expect(identityKey(["a,b", "c"])).not.toBe(identityKey(["a", "b,c"]));
  });

  test("requested and target keys encode the discriminator and selector", () => {
    const keys = new Set([
      targetKey({ bucket: "b", key: "k", versionId: "v1" }),
      requestedObjectKey({ bucket: "b", key: "k", version: latest }),
      requestedObjectKey({ bucket: "b", key: "k", version: id("v1") }),
      requestedObjectKey({ bucket: "b", key: "k", version: id("latest") }),
    ]);
    expect(keys.size).toBe(4);
  });

  test("subjects are discriminated by the presence of versionId", () => {
    expect(isObjectTarget({ bucket: "b", key: "k", versionId: "v1" })).toBe(
      true,
    );
    expect(isObjectTarget({ bucket: "b", key: "k", version: latest })).toBe(
      false,
    );
    expect(
      sameRequestedObject(
        { bucket: "b", key: "k", version: id("v1") },
        { bucket: "b", key: "k", version: id("v1") },
      ),
    ).toBe(true);
    expect(
      sameRequestedObject(
        { bucket: "b", key: "k", version: id("v1") },
        { bucket: "b", key: "k", version: latest },
      ),
    ).toBe(false);
  });
});

test.describe("route identity", () => {
  test("decodes the object key exactly once", () => {
    expect(routeObjectIdentity("/browser/b/docs%2Fa.txt", "b")).toEqual({
      bucket: "b",
      key: "docs/a.txt",
    });
    expect(routeObjectIdentity("/browser/b/literal%252Fslash", "b").key).toBe(
      "literal%2Fslash",
    );
    expect(
      routeObjectIdentity("/browser/b/%E6%96%87%E6%A1%A3.txt", "b").key,
    ).toBe("文档.txt");
  });

  test("handles console subpaths, directories and foreign routes", () => {
    expect(routeObjectIdentity("/console/browser/b/dir%2F", "b").key).toBe(
      "dir/",
    );
    expect(routeObjectIdentity("/browser/b/", "b").key).toBe("");
    expect(routeObjectIdentity("/browser/b", "b").key).toBe("");
    expect(routeObjectIdentity("/browser/other/a", "b").key).toBe("");
    expect(routeObjectIdentity("/browser/b/%E0%A4%A", "b").key).toBe(
      "%E0%A4%A",
    );
  });
});
