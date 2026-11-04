// This file is part of MinIO Design System
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { IBytesCalc } from "./global.types";

export const breakPoints = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 };
export const units = [
  "B",
  "KiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB",
];

export const fractionToPerc = (fraction: "auto" | number | boolean) => {
  if (fraction === "auto" || (typeof fraction === "boolean" && fraction)) {
    return "100%";
  } else if (fraction === false) {
    return "initial";
  }

  let fr = Math.floor(fraction);

  if (fr > 12) {
    fr = 12;
    console.warn("Grid fraction cannot be greater than 12");
  } else if (fr < 1) {
    fr = 1;
    console.warn("Grid fraction cannot be smaller than 1");
  }

  const percCalculate = (fr * 100) / 12;

  return `${percCalculate}%`;
};

// parseByteMeasurement accepts complete non-negative decimal/exponent strings
// and finite numbers. Anything else, including hexadecimal, blank, null and
// negative input, is unavailable rather than a misleading zero.
export const parseByteMeasurement = (x: unknown): number | null => {
  if (typeof x === "string") {
    if (!/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(x.trim())) {
      return null;
    }
  } else if (typeof x !== "number") {
    return null;
  }
  const bytes = Number(x);
  return Number.isFinite(bytes) && bytes >= 0 ? bytes : null;
};

// scaleBytes selects the largest bounded unit and carries a value that rounds
// up to the next unit, so 1048575 bytes is "1 MiB" rather than "1024 KiB".
export const scaleBytes = (
  bytes: number,
  displayUnits: readonly string[],
  round: (value: number) => number,
): { value: number; unit: number } => {
  let unit = 0;
  let value = bytes;
  while (value >= 1024 && unit < displayUnits.length - 1) {
    value /= 1024;
    unit++;
  }
  if (round(value) >= 1024 && unit < displayUnits.length - 1) {
    value /= 1024;
    unit++;
  }
  return { value, unit };
};

export const calculateBytes = (
  x: string | number,
  showDecimals = false,
  roundFloor = true,
  displayUnits: readonly string[] = units,
): IBytesCalc => {
  const bytes = parseByteMeasurement(x);
  if (bytes === null || displayUnits.length === 0) {
    return { total: null, unit: "" };
  }
  if (bytes === 0) {
    return { total: 0, unit: displayUnits[0] };
  }
  // Bound both ends: fractional rates stay in bytes, very large measurements
  // stay in the largest supported unit. Parse the entire decimal/exponent input.
  const fractionDigits = showDecimals ? 1 : 0;
  const round = (value: number) =>
    Number((roundFloor ? Math.floor(value) : value).toFixed(fractionDigits));
  const scaled = scaleBytes(bytes, displayUnits, round);
  return {
    total: round(scaled.value),
    unit: displayUnits[scaled.unit],
  };
};
