// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import { getBytes } from "../../../../../common/utils";

const quotaPattern = /^\d*(?:\.\d{1,2})?$/;
const maxQuotaBytes = 2 ** 63;

export const getQuotaBytes = (size: string, unit: string): number =>
  Math.trunc(Number(getBytes(size, unit, true)));

export const isValidQuota = (size: string, unit: string): boolean => {
  if (size.trim() === "" || !quotaPattern.test(size)) {
    return false;
  }

  const amount = getQuotaBytes(size, unit);
  return Number.isFinite(amount) && amount > 0 && amount < maxQuotaBytes;
};

export const isValidRetentionValidity = (value: number): boolean =>
  Number.isInteger(value) && value >= 1 && value <= 2147483647;
