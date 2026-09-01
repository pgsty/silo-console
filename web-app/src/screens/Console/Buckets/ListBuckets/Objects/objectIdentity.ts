// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Object identity for the object browser.
//
// Every object-scoped request and action carries one of these identities so a
// response can be checked against what the user is looking at now, and an
// action can never combine the current route with a stale version or a stale
// bucket. The module is pure (no React, no API client) so the identity rules
// are unit-tested in Node.

/** A bucket and an object key, with no version. */
export interface ObjectLocation {
  bucket: string;
  key: string;
}

/**
 * What the user asked for: the current object ("latest") or one explicit
 * version. The literal S3 null version is an explicit id, not "latest".
 */
export type VersionSelector =
  | { kind: "latest" }
  | { kind: "id"; versionId: string };

export interface RequestedObject extends ObjectLocation {
  version: VersionSelector;
}

/** A concrete object version. */
export interface ObjectTarget extends ObjectLocation {
  versionId: string;
}

/** The subset of a listed object the identity rules read. */
export interface ObjectInfoLike {
  name?: string;
  version_id?: string;
  is_latest?: boolean;
  is_delete_marker?: boolean;
}

/**
 * A listing response tagged with the bucket and key it was requested for, and
 * with the kind of listing it is: "versions" comes from a `with_versions`
 * request and carries concrete version ids; "current" is the plain listing
 * Console issues when versions are not requested, whose entries may omit the
 * version id because only the current object exists in that view.
 */
export interface TaggedResult<T extends ObjectInfoLike> {
  bucket: string;
  key: string;
  kind: "versions" | "current";
  items: T[];
}

/** The requested selector, the version it resolved to, and the listed entry. */
export interface ValidatedObject<T extends ObjectInfoLike> {
  requested: RequestedObject;
  resolved: ObjectTarget;
  info: T;
}

export const versionSelectorFromRedux = (
  selectedVersion: string,
): VersionSelector =>
  selectedVersion === ""
    ? { kind: "latest" }
    : { kind: "id", versionId: selectedVersion };

export const sameLocation = (a: ObjectLocation, b: ObjectLocation): boolean =>
  a.bucket === b.bucket && a.key === b.key;

const sameVersionSelector = (
  a: VersionSelector,
  b: VersionSelector,
): boolean =>
  a.kind === "latest"
    ? b.kind === "latest"
    : b.kind === "id" && a.versionId === b.versionId;

export const sameRequestedObject = (
  a: RequestedObject,
  b: RequestedObject,
): boolean => sameLocation(a, b) && sameVersionSelector(a.version, b.version);

/**
 * Collision-free serialization of identity parts, usable as a React key. A
 * delimiter-joined string is not enough: ["xy", "z"] and
 * ["x", "yz"] would collide.
 */
export const identityKey = (parts: readonly string[]): string =>
  JSON.stringify(parts);

export const targetKey = (target: ObjectTarget): string =>
  identityKey(["target", target.bucket, target.key, target.versionId]);

export const requestedObjectKey = (requested: RequestedObject): string =>
  identityKey([
    "requested",
    requested.bucket,
    requested.key,
    ...(requested.version.kind === "latest"
      ? ["latest"]
      : ["id", requested.version.versionId]),
  ]);

export const isObjectTarget = (
  subject: RequestedObject | ObjectTarget,
): subject is ObjectTarget => "versionId" in subject;

const tagMatches = <T extends ObjectInfoLike>(
  result: TaggedResult<T>,
  location: ObjectLocation,
): boolean => result.bucket === location.bucket && result.key === location.key;

const exactEntries = <T extends ObjectInfoLike>(result: TaggedResult<T>): T[] =>
  result.items.filter((item) => item.name === result.key);

/**
 * The concrete version an entry of a "current" listing stands for: the
 * omitted version id of a non-version listing is the null version. Only this
 * listing kind may normalize; a "versions" entry without an id is invalid.
 */
const currentEntryVersion = (info: ObjectInfoLike): string =>
  info.version_id ? info.version_id : "null";

/**
 * Resolves the requested object against a tagged listing. Returns null when the
 * listing is missing, was requested for another bucket or key, or does not
 * contain the requested version. A delete marker resolves (it is displayed),
 * callers decide which actions it supports.
 */
export const resolveObject = <T extends ObjectInfoLike>(
  requested: RequestedObject,
  result: TaggedResult<T> | null,
): ValidatedObject<T> | null => {
  if (!result || !tagMatches(result, requested)) {
    return null;
  }
  const entries = exactEntries(result);
  let info: T | undefined;
  let versionId: string | undefined;

  if (result.kind === "current") {
    if (requested.version.kind === "latest") {
      info = entries[0];
    } else {
      const wanted = requested.version.versionId;
      info = entries.find((entry) => currentEntryVersion(entry) === wanted);
    }
    if (info) {
      versionId = currentEntryVersion(info);
    }
  } else if (requested.version.kind === "latest") {
    info = entries.find((entry) => entry.is_latest === true);
    versionId = info?.version_id || undefined;
  } else {
    const wanted = requested.version.versionId;
    info = entries.find(
      (entry) => !!entry.version_id && entry.version_id === wanted,
    );
    versionId = info?.version_id || undefined;
  }

  if (!info || !versionId) {
    return null;
  }
  return {
    requested,
    resolved: { bucket: requested.bucket, key: requested.key, versionId },
    info,
  };
};

/**
 * The concrete target a clicked row stands for. Null unless the listing was
 * requested for the same bucket and key, the row is one of its entries for
 * that key, and the row carries a concrete version id.
 */
export const rowTarget = <T extends ObjectInfoLike>(
  location: ObjectLocation,
  result: TaggedResult<T> | null,
  row: T,
): ObjectTarget | null => {
  if (!result || !tagMatches(result, location)) {
    return null;
  }
  if (!result.items.includes(row) || row.name !== location.key) {
    return null;
  }
  if (!row.version_id) {
    return null;
  }
  return {
    bucket: location.bucket,
    key: location.key,
    versionId: row.version_id,
  };
};

/**
 * The version a delete request names. A "latest" request deletes the current
 * object (which creates a delete marker in a versioned bucket) and therefore
 * sends no version id; only an explicitly selected version names one.
 */
export const deleteRequestVersion = <T extends ObjectInfoLike>(
  validated: ValidatedObject<T>,
): string | undefined =>
  validated.requested.version.kind === "id"
    ? validated.requested.version.versionId
    : undefined;

const decodeOnce = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

/**
 * The object location a browser route names. The pathname is percent-encoded
 * (`/browser/<bucket>/<encoded key>`) and is decoded exactly once, so a literal
 * `%2F` in a key arrives as `%252F` in the pathname. A pathname outside the
 * bucket's browser route yields an empty key.
 */
export const routeObjectIdentity = (
  pathname: string,
  bucketName: string,
): ObjectLocation => {
  const candidates = [
    `/browser/${encodeURIComponent(bucketName)}/`,
    `/browser/${bucketName}/`,
  ];
  for (const prefix of candidates) {
    const index = pathname.indexOf(prefix);
    if (index >= 0) {
      return {
        bucket: bucketName,
        key: decodeOnce(pathname.slice(index + prefix.length)),
      };
    }
  }
  return { bucket: bucketName, key: "" };
};
