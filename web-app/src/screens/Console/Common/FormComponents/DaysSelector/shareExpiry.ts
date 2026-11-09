// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { DateTime } from "luxon";

// Returns a local timestamp ("yyyy-MM-ddTHH:mm:ss") that `new Date()` parses.
// Luxon's toFormat follows the browser locale and emits Arabic-Indic or
// Persian digits for ar-EG, ar-SA and fa, so use its technical ISO output.
export const shareExpiryTimestamp = (iso: string): string | null =>
  DateTime.fromISO(iso)
    .startOf("second")
    .toISO({ includeOffset: false, suppressMilliseconds: true });
