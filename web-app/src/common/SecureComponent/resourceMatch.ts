// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// IAM resource matching for the permission-aware UI. Policy resources are
// patterns with exactly two wildcards, `*` (any sequence, including empty and
// including `/`) and `?` (exactly one byte); every other character is literal.
// This mirrors silo-pkg's wildcard.Match and policy.Resource.Match byte for
// byte, so the UI shows what SILO will allow. SILO stays the authority: a
// wrong answer here hides or shows a button, it never grants access.

const S3_RESOURCE_PREFIX = "arn:aws:s3:::";

const STAR = 0x2a; // '*'
const QUESTION = 0x3f; // '?'

const encoder = new TextEncoder();

// resourcePattern strips the S3 ARN prefix so a grant can be compared with the
// bucket/prefix paths the UI works with.
export const resourcePattern = (arn: string): string =>
  arn.startsWith(S3_RESOURCE_PREFIX)
    ? arn.slice(S3_RESOURCE_PREFIX.length)
    : arn;

export const hasResourceWildcard = (pattern: string): boolean =>
  pattern.includes("*") || pattern.includes("?");

// matchWildcard reports whether name satisfies pattern with `*` and `?`
// semantics on UTF-8 bytes (the server compares bytes, so a multi-byte
// character needs one `?` per byte). Anchored at both ends, linear space, and
// O(len(pattern) * len(name)) at worst, so a hostile pattern cannot hang the
// page the way a backtracking regular expression could.
export const matchWildcard = (pattern: string, name: string): boolean => {
  if (typeof pattern !== "string" || typeof name !== "string") {
    return false;
  }
  if (pattern === "") {
    return name === "";
  }
  if (pattern === "*") {
    return true;
  }
  const p = encoder.encode(pattern);
  const n = encoder.encode(name);
  let pi = 0;
  let ni = 0;
  let starPi = -1;
  let starNi = 0;
  while (ni < n.length) {
    if (pi < p.length && (p[pi] === QUESTION || p[pi] === n[ni])) {
      pi++;
      ni++;
    } else if (pi < p.length && p[pi] === STAR) {
      starPi = pi;
      starNi = ni;
      pi++;
    } else if (starPi !== -1) {
      pi = starPi + 1;
      starNi++;
      ni = starNi;
    } else {
      return false;
    }
  }
  while (pi < p.length && p[pi] === STAR) {
    pi++;
  }
  return pi === p.length;
};

// cleanResourcePath is Go's path.Clean, which the server applies before the
// exact comparison: it collapses repeated slashes, drops `.` elements,
// resolves `..`, and removes a trailing slash.
export const cleanResourcePath = (path: string): string => {
  if (path === "") {
    return ".";
  }
  const rooted = path.startsWith("/");
  const out: string[] = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") {
      continue;
    }
    if (part === "..") {
      if (out.length > 0 && out[out.length - 1] !== "..") {
        out.pop();
      } else if (!rooted) {
        out.push("..");
      }
      continue;
    }
    out.push(part);
  }
  const joined = out.join("/");
  if (rooted) {
    return `/${joined}`;
  }
  return joined === "" ? "." : joined;
};

// matchResource is policy.Resource.Match without condition variables: the
// cleaned resource equals the pattern, or the pattern matches it as a
// wildcard. Non-string input fails closed.
export const matchResource = (pattern: string, resource: string): boolean => {
  if (typeof pattern !== "string" || typeof resource !== "string") {
    return false;
  }
  const cleaned = cleanResourcePath(resource);
  if (cleaned !== "." && cleaned === pattern) {
    return true;
  }
  return matchWildcard(pattern, resource);
};

// grantMatchesResource decides whether a session grant (keyed by its policy
// resource) applies to a resource the UI asks about: an exact key, or, for
// S3 ARNs, a pattern match on the part after the ARN prefix. Any other key
// (`console-ui`, other ARN types) matches only exactly.
export const grantMatchesResource = (
  grantKey: string,
  resource: string,
): boolean => {
  if (typeof grantKey !== "string" || typeof resource !== "string") {
    return false;
  }
  if (grantKey === resource) {
    return true;
  }
  if (!grantKey.startsWith(S3_RESOURCE_PREFIX)) {
    return false;
  }
  return matchResource(resourcePattern(grantKey), resourcePattern(resource));
};
