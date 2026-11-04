// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

const quotaPattern = /^\d*(?:\.\d{1,2})?$/;
const quotaUnits = ["B", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei"];

// Preserve decimal input through scaling and truncate only fractional bytes.
// JSON numbers are exact only through MAX_SAFE_INTEGER; larger quotas must be
// managed with mcli until the API has a decimal-string quota contract.
export const getQuotaBytes = (size: string, unit: string): number => {
  const exponent = quotaUnits.indexOf(unit);
  if (!size || size.length > 32 || !quotaPattern.test(size) || exponent < 0) {
    return NaN;
  }
  const [whole, fraction = ""] = size.split(".");
  const scale = 10n ** BigInt(fraction.length);
  const scalar = BigInt(whole || "0") * scale + BigInt(fraction || "0");
  const amount = (scalar * 1024n ** BigInt(exponent)) / scale;
  return amount <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(amount) : NaN;
};

// Units offered by browser quota forms. Even 0.01 Ei exceeds the exact JSON
// integer range, so an "Ei" option could never produce a valid write.
export const quotaUnitOptions = ["B", "Mi", "Gi", "Ti", "Pi"].map((unit) => ({
  label: unit,
  value: unit,
}));

export const isValidQuota = (size: string, unit: string): boolean => {
  const amount = getQuotaBytes(size, unit);
  return Number.isSafeInteger(amount) && amount > 0;
};

export const isValidRetentionValidity = (value: number): boolean =>
  Number.isInteger(value) && value >= 1 && value <= 2147483647;
