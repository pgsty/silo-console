// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import {
  identityKey,
  isObjectTarget,
  ObjectInfoLike,
  ObjectTarget,
  RequestedObject,
  requestedObjectKey,
  resolveObject,
  TaggedResult,
  targetKey,
} from "../objectIdentity";

/**
 * What the share dialog was opened for: a concrete version (from the detail
 * panel or the versions list) or a requested object captured from the object
 * list, whose concrete version is resolved by the dialog itself.
 */
export type ShareSubject = RequestedObject | ObjectTarget;

export type ShareVersionResolution =
  | { kind: "version"; versionId: string }
  | {
      kind: "none";
      reason: "not-found" | "delete-marker" | "stale-listing" | "unversioned";
    };

/** Encodes the full discriminated subject, so no two subjects share a key. */
export const shareSubjectKey = (subject: ShareSubject): string =>
  isObjectTarget(subject)
    ? identityKey(["share", targetKey(subject)])
    : identityKey(["share", requestedObjectKey(subject)]);

/**
 * Resolves a requested share subject against the exact-key versions listing
 * the dialog fetched. Fails closed: a listing for another object, a missing
 * version, or a delete marker yields no target and therefore no share URL.
 */
export const resolveShareVersion = <T extends ObjectInfoLike>(
  subject: RequestedObject,
  result: TaggedResult<T>,
): ShareVersionResolution => {
  if (result.bucket !== subject.bucket || result.key !== subject.key) {
    return { kind: "none", reason: "stale-listing" };
  }
  const validated = resolveObject(subject, result);
  if (!validated) {
    return { kind: "none", reason: "not-found" };
  }
  if (validated.info.is_delete_marker) {
    return { kind: "none", reason: "delete-marker" };
  }
  return { kind: "version", versionId: validated.resolved.versionId };
};

/**
 * Resolves a requested subject without a versions listing, for deployments
 * that do not expose versions: the only version is the null version.
 */
export const resolveUnversionedShareSubject = (
  subject: RequestedObject,
): ShareVersionResolution =>
  subject.version.kind === "latest" || subject.version.versionId === "null"
    ? { kind: "version", versionId: "null" }
    : { kind: "none", reason: "unversioned" };
