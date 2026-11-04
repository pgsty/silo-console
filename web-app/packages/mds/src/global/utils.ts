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

export const calculateBytes = (
  x: string | number,
  showDecimals = false,
  roundFloor = true,
  displayUnits: readonly string[] = units,
): IBytesCalc => {
  if (
    typeof x === "string" &&
    !/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(x.trim())
  ) {
    return { total: null, unit: "" };
  }
  const bytes = Number(x);
  if (!Number.isFinite(bytes) || bytes < 0 || displayUnits.length === 0) {
    return { total: null, unit: "" };
  }
  if (bytes === 0) {
    return { total: 0, unit: displayUnits[0] };
  }
  // Bound both ends: fractional rates stay in bytes, very large measurements
  // stay in the largest supported unit. Parse the entire decimal/exponent input.
  let i = 0;
  let bytesUnit = bytes;
  while (bytesUnit >= 1024 && i < displayUnits.length - 1) {
    bytesUnit /= 1024;
    i++;
  }
  const fractionDigits = showDecimals ? 1 : 0;
  const roundedUnit = roundFloor ? Math.floor(bytesUnit) : bytesUnit;
  return {
    total: Number(roundedUnit.toFixed(fractionDigits)),
    unit: displayUnits[i],
  };
};
