// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Supplemental inventory: the components that issue object-scoped requests must
// import the shared identity/guard modules, the panels must be keyed and gated
// by the route identity, and no object listing may be issued without a signal.
// This cannot prove every commit is guarded; the pure tests cover the rules.

import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const objectsRoot = new URL(
  "../src/screens/Console/Buckets/ListBuckets/Objects/",
  import.meta.url,
);
const bucketDetailsRoot = new URL(
  "../src/screens/Console/Buckets/BucketDetails/",
  import.meta.url,
);

const read = (base: URL, relative: string): string =>
  readFileSync(fileURLToPath(new URL(relative, base)), "utf8");

const guardedComponents: Array<[URL, string]> = [
  [objectsRoot, "ListObjects/ObjectDetailPanel.tsx"],
  [objectsRoot, "ObjectDetails/VersionsNavigator.tsx"],
  [objectsRoot, "ObjectDetails/ShareFile.tsx"],
  [bucketDetailsRoot, "BrowserHandler.tsx"],
];

test("object-scoped components use the shared identity and request guard", () => {
  for (const [base, relative] of guardedComponents) {
    const source = read(base, relative);
    expect(source, relative).toContain("objectIdentity");
    expect(source, relative).toContain("ObjectRequestGuard");
  }
});

test("object listings are always issued with an abort signal", () => {
  const pattern = /api\.buckets\s*\.listObjects\(([\s\S]*?)\)\s*\n\s*\.then/g;
  for (const relative of [
    "ListObjects/ObjectDetailPanel.tsx",
    "ObjectDetails/VersionsNavigator.tsx",
    "ObjectDetails/ShareFile.tsx",
  ]) {
    const source = read(objectsRoot, relative);
    const calls = Array.from(source.matchAll(pattern));
    expect(calls.length, relative).toBeGreaterThan(0);
    for (const call of calls) {
      expect(call[1], `${relative}: ${call[0]}`).toContain("signal");
    }
  }
});

test("bucket status requests are issued with an abort signal", () => {
  const source = read(bucketDetailsRoot, "BrowserHandler.tsx");
  for (const method of [
    "getBucketVersioning",
    "getBucketObjectLockingStatus",
  ]) {
    const call = new RegExp(
      `\\.${method}\\(([\\s\\S]*?)\\)\\s*\\n\\s*\\.then`,
    ).exec(source);
    expect(call, method).not.toBeNull();
    expect(call![1], method).toContain("signal");
  }
});

test("the panels are keyed and gated by the route identity", () => {
  const source = read(objectsRoot, "ListObjects/ListObjectsTable.tsx");
  expect(source).toContain("setSelectedObjectView");
  const listObjects = read(objectsRoot, "ListObjects/ListObjects.tsx");
  for (const component of ["ObjectDetailPanel", "VersionsNavigator"]) {
    const usage = new RegExp(
      `detailsIdentityMatches && \\(\\s*<${component}\\s+key=\\{detailsIdentityKey\\}`,
    );
    expect(listObjects, component).toMatch(usage);
  }
  expect(listObjects).toContain(
    "routeObjectIdentity(location.pathname, bucketName)",
  );
  expect(listObjects).toMatch(/<ShareFile\s+key=\{shareSubjectKey\(/);
});

test("the mutation dialogs address validated targets", () => {
  for (const [relative, prop] of [
    ["ObjectDetails/SetRetention.tsx", "target: ObjectTarget"],
    ["ObjectDetails/TagsModal.tsx", "target: ObjectTarget"],
    ["ObjectDetails/SetLegalHoldModal.tsx", "target: ObjectTarget"],
    ["ObjectDetails/RestoreFileVersion.tsx", "target: ObjectTarget"],
    ["ObjectDetails/DeleteSelectedVersions.tsx", "targets: ObjectTarget[]"],
    ["ListObjects/DeleteNonCurrent.tsx", "location: ObjectLocation"],
  ] as const) {
    expect(read(objectsRoot, relative), relative).toContain(prop);
  }
});
