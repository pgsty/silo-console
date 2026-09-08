// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

export const watchURL = (
  baseURI: string,
  bucket: string,
  prefix: string,
  suffix: string,
  development = false,
): string => {
  const url = new URL(`ws/watch/${encodeURIComponent(bucket)}`, baseURI);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  if (development) url.port = "9090";
  url.search = new URLSearchParams({ prefix, suffix }).toString();
  return url.toString();
};
