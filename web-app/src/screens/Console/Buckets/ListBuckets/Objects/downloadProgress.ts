// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

type DownloadProgressEvent = Pick<
  ProgressEvent,
  "loaded" | "lengthComputable" | "total"
>;

export const calculateDownloadPercent = (
  event: DownloadProgressEvent,
  objectSize: number,
): number | null => {
  let total: number | null = null;

  if (Number.isFinite(objectSize) && objectSize > 0) {
    total = objectSize;
  } else if (
    event.lengthComputable &&
    Number.isFinite(event.total) &&
    event.total > 0
  ) {
    total = event.total;
  }

  if (total === null || !Number.isFinite(event.loaded) || event.loaded < 0) {
    return null;
  }

  return Math.min(100, Math.max(0, Math.round((event.loaded / total) * 100)));
};
