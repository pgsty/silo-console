// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

export const isValidPathname = (pathname: string): boolean => {
  try {
    // Keep the decoded value observable: production tree shaking may elide an
    // unused decodeURIComponent call even though malformed input can throw.
    return typeof decodeURIComponent(pathname) === "string";
  } catch {
    return false;
  }
};
