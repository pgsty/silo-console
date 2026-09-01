// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// The log stream is unbounded on the server side; the client keeps only the
// newest entries so a session left open for hours does not grow without limit.
export const MAX_LOG_MESSAGES = 10000;

// Drops the oldest items in place until at most `max` remain.
export const trimToNewest = <T>(items: T[], max: number): T[] => {
  if (max > 0 && items.length > max) {
    items.splice(0, items.length - max);
  }
  return items;
};
