// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import type { Bucket, BucketUsageRecord } from "../../../../api/consoleApi";
import { bucketStatistic } from "../bucketMetadata";

export type BucketSort = "name" | "objects" | "size" | "created";
export type BucketView = "table" | "cards";
export interface BucketQuery {
  sort: BucketSort;
  dir: "asc" | "desc";
  q: string;
}
const sorts: readonly string[] = ["name", "objects", "size", "created"];
export const parseBucketQuery = (params: URLSearchParams): BucketQuery => ({
  sort: sorts.includes(params.get("sort") || "")
    ? (params.get("sort") as BucketSort)
    : "name",
  dir: params.get("dir") === "desc" ? "desc" : "asc",
  q: params.get("q") || "",
});
export const updateBucketQuery = (
  params: URLSearchParams,
  patch: Partial<BucketQuery>,
) => {
  const next = new URLSearchParams(params);
  const query = { ...parseBucketQuery(params), ...patch };
  for (const key of ["sort", "dir", "q"] as const) {
    if (
      !query[key] ||
      (key === "sort" && query.sort === "name") ||
      (key === "dir" && query.dir === "asc")
    )
      next.delete(key);
    else next.set(key, query[key]);
  }
  return next;
};
export const parseBucketView = (value: string | null): BucketView =>
  value === "cards" ? "cards" : "table";

export const hasUsageTimestamp = (at?: string | null) =>
  Boolean(at && Number.isFinite(Date.parse(at)));

export const listBucketStatistic = (
  bucket: Bucket | undefined,
  field: "objects" | "size",
  canReadUsage: boolean,
  at?: string | null,
): number | undefined => {
  if (!bucket || (canReadUsage && !hasUsageTimestamp(at))) return undefined;
  // AccountInfo encodes zero as an omitted scalar. Non-admins cannot read the
  // separate scanner timestamp, so preserve their existing reported values.
  if (!canReadUsage && bucket[field] === undefined) return 0;
  return bucketStatistic(bucket, field, at);
};

export const filterSortBuckets = (
  records: readonly Bucket[],
  query: BucketQuery,
  canReadUsage: boolean,
  at?: string | null,
  usage?: Record<string, BucketUsageRecord>,
) => {
  const needle = query.q.trim().toLocaleLowerCase();
  const value = (bucket: Bucket): string | number | bigint | undefined => {
    if (query.sort === "name") return bucket.name;
    if (query.sort === "created") {
      const date = Date.parse(bucket.creation_date || "");
      return Number.isFinite(date) ? date : undefined;
    }
    if (usage) {
      const totals = usage[bucket.name]?.last_good?.totals;
      return totals
        ? query.sort === "size"
          ? BigInt(totals.current_bytes)
          : totals.current_objects
        : undefined;
    }
    return listBucketStatistic(bucket, query.sort, canReadUsage, at);
  };
  return records
    .filter((bucket) => bucket.name.toLocaleLowerCase().includes(needle))
    .sort((a, b) => {
      const av = value(a),
        bv = value(b);
      // Unknowns remain last in either direction; equal values have stable names.
      if (av === undefined && bv !== undefined) return 1;
      if (bv === undefined && av !== undefined) return -1;
      const order =
        av === bv
          ? 0
          : av === undefined || bv === undefined
            ? 0
            : av < bv
              ? -1
              : 1;
      return (
        order * (query.dir === "desc" ? -1 : 1) || a.name.localeCompare(b.name)
      );
    });
};

export const toggleVisibleBuckets = (
  selected: readonly string[],
  visible: readonly string[],
) =>
  visible.length > 0 && visible.every((name) => selected.includes(name))
    ? selected.filter((name) => !visible.includes(name))
    : Array.from(new Set([...selected, ...visible]));
