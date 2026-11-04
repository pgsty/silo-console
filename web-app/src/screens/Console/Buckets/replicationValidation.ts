// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import { getBytes } from "common/utils";

// Zero is unlimited. Keep JSON byte amounts within the exact integer range;
// parseInt would silently turn an exponent-form byte string into its prefix.
export const getReplicationBandwidth = (
  scalar: string,
  unit: string,
  mode: "async" | "sync",
): number | null => {
  if (mode === "sync") return 0;
  if (
    scalar.trim() === "" ||
    !/^\d*(?:\.\d{1,2})?$/.test(scalar) ||
    !["Mi", "Gi", "Ti", "Pi", "Ei"].includes(unit)
  ) {
    return null;
  }
  const bytes = Math.trunc(Number(getBytes(scalar, unit, true)));
  return Number.isSafeInteger(bytes) &&
    bytes >= 0 &&
    (Number(scalar) === 0 || bytes > 0)
    ? bytes
    : null;
};
