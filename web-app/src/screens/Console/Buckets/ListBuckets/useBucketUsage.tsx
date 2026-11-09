// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "api";
import type {
  BucketUsageRecord,
  BucketUsageResponse,
  BucketUsageSnapshot,
} from "api/consoleApi";
import { hasPermission } from "common/SecureComponent";
import { IAM_SCOPES } from "common/SecureComponent/permissions";
import { useTaskSession } from "../../Common/ObjectManager/useTaskSession";
import {
  readPrefixUsageStream,
  usageBytes,
  usageCount,
} from "../../ObjectBrowser/prefixUsage";

export type UsageView = {
  enabled?: boolean;
  requesting: boolean;
  records: Record<string, BucketUsageRecord>;
  coverage?: BucketUsageResponse["coverage"];
  error?: boolean;
  refresh: () => void;
};
const UsageContext = createContext<UsageView | undefined>(undefined);
export const BucketUsageProvider = UsageContext.Provider;
export const useBucketUsageView = () => useContext(UsageContext);
const usagePending = (row: BucketUsageRecord) =>
  row.state === "queued" || row.state === "running";
// A busy server (429) is retried with jittered, capped backoff for about
// half a minute before the bucket is reported as failed.
const usageBusyAttempts = 8;
const usageBusyWait = (attempt: number, signal: AbortSignal) =>
  new Promise<boolean>((resolve) => {
    if (signal.aborted) return resolve(false);
    const cap = Math.min(8000, 1000 * 2 ** (attempt - 1));
    const timer = setTimeout(finish, cap / 2 + (Math.random() * cap) / 2);
    function finish() {
      signal.removeEventListener("abort", abort);
      resolve(!signal.aborted);
    }
    function abort() {
      clearTimeout(timer);
      finish();
    }
    signal.addEventListener("abort", abort, { once: true });
  });
const usageStates: readonly string[] = [
  "not_scanned",
  "queued",
  "running",
  "complete",
  "error",
  "limited",
  "forbidden",
  "missing",
  "unavailable",
];
const optional = (value: unknown, valid: (value: unknown) => boolean) =>
  value === undefined || value === null || valid(value);
const validSnapshot = (value: unknown): value is BucketUsageSnapshot => {
  if (typeof value !== "object" || value === null) return false;
  const snapshot = value as Partial<BucketUsageSnapshot>;
  const totals = snapshot.totals;
  return (
    !!totals &&
    usageBytes(totals.current_bytes) &&
    usageCount(totals.current_objects) &&
    optional(totals.retained_bytes, usageBytes) &&
    optional(totals.retained_versions, usageCount) &&
    optional(totals.delete_markers, usageCount) &&
    usageCount(snapshot.scanned_entries)
  );
};
// Sorting and formatting use exact integer arithmetic. A malformed saved
// observation is unknown, never a crash or a zero.
const sanitizeRecord = (
  row: BucketUsageRecord,
): BucketUsageRecord | undefined => {
  if (!row || typeof row.bucket !== "string") return undefined;
  if (!usageStates.includes(row.state))
    return {
      bucket: row.bucket,
      state: "unavailable",
      versions_visible: false,
    };
  return {
    ...row,
    last_good: validSnapshot(row.last_good) ? row.last_good : undefined,
    progress: validSnapshot(row.progress) ? row.progress : undefined,
  };
};
const currentOnly = (snapshot: BucketUsageSnapshot): BucketUsageSnapshot => ({
  ...snapshot,
  totals: {
    current_bytes: snapshot.totals.current_bytes,
    current_objects: snapshot.totals.current_objects,
  },
});
// A transient outage keeps the totals this view already showed; permission
// and existence answers never do. Retained data needs current authorization.
const mergeRecord = (
  row: BucketUsageRecord,
  old: BucketUsageRecord | undefined,
): BucketUsageRecord =>
  row.state === "unavailable" && !row.last_good && old?.last_good
    ? {
        ...row,
        last_good: row.versions_visible
          ? old.last_good
          : currentOnly(old.last_good),
        last_completed_at: old.last_completed_at,
      }
    : row;

// One bounded request loop per view. Requests and direct scans stop on logout,
// navigation or a newer refresh; persistent jobs continue independently.
export function useBucketUsage(names: string[]): UsageView {
  const identity = JSON.stringify(names);
  const currentSession = useTaskSession();
  const active = useRef<AbortController>();
  const [generation, setGeneration] = useState(0);
  const manual = useRef(false);
  const [view, setView] = useState<Omit<UsageView, "refresh">>({
    requesting: false,
    records: {},
  });
  const refresh = useCallback(() => {
    manual.current = true;
    setGeneration((value) => value + 1);
  }, []);
  useEffect(() => {
    const buckets: string[] = JSON.parse(identity);
    const controller = new AbortController();
    active.current?.abort();
    active.current = controller;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const current = () => !controller.signal.aborted && currentSession();
    const explicitlyRequested = manual.current;
    manual.current = false;
    // A bucket-list reload can restart this effect before an explicit refresh
    // was delivered. Carry that request into the next run instead of losing it.
    let consumed = !explicitlyRequested;
    setView((previous) => ({
      ...previous,
      records: Object.fromEntries(
        Object.entries(previous.records)
          .filter(([name]) => buckets.includes(name))
          // Foreground scans end with their effect; none is running any more.
          .flatMap(([name, row]) =>
            previous.enabled === false && row.state === "running"
              ? row.last_good
                ? [[name, { ...row, state: "complete", progress: undefined }]]
                : []
              : [[name, row]],
          ),
      ),
    }));
    const direct = async () => {
      setView((previous) => ({ ...previous, requesting: true }));
      const pending = [...buckets];
      const run = async () => {
        while (current() && pending.length) {
          const bucket = pending.shift()!;
          const versions = hasPermission(bucket, [
            IAM_SCOPES.S3_LIST_BUCKET_VERSIONS,
          ]);
          let row: BucketUsageRecord = {
            bucket,
            state: "running",
            versions_visible: versions,
          };
          const publish = () =>
            current() &&
            setView((previous) => {
              const old = previous.records[bucket];
              const keep =
                old?.versions_visible === versions &&
                row.state !== "forbidden" &&
                row.state !== "missing";
              return {
                ...previous,
                records: {
                  ...previous.records,
                  [bucket]: {
                    ...row,
                    last_good:
                      row.last_good ?? (keep ? old?.last_good : undefined),
                    last_completed_at:
                      row.last_completed_at ??
                      (keep ? old?.last_completed_at : undefined),
                  },
                },
              };
            });
          publish();
          for (let attempt = 1; ; attempt++) {
            try {
              let completed: BucketUsageSnapshot | undefined;
              const response = await api.buckets.prefixUsage(
                bucket,
                { prefix: "", versions, folders: false },
                { signal: controller.signal },
              );
              await readPrefixUsageStream(
                response,
                { bucket, prefix: "", mode: versions ? "versions" : "current" },
                (frame) => {
                  const totals = {
                    ...frame.totals,
                    ...(versions
                      ? {}
                      : {
                          retained_bytes: undefined,
                          retained_versions: undefined,
                          delete_markers: undefined,
                        }),
                  };
                  const snapshot = {
                    totals,
                    scanned_entries: frame.scanned_entries,
                    started_at: frame.started_at,
                    updated_at: frame.updated_at,
                  };
                  row = {
                    ...row,
                    state:
                      frame.status === "scanning" || frame.status === "complete"
                        ? "running"
                        : frame.status === "failed"
                          ? "error"
                          : frame.status,
                    progress: snapshot,
                  };
                  if (frame.status === "complete") completed = snapshot;
                  publish();
                },
              );
              // Only replace last-good after the entire stream validates. A
              // malformed trailer or disconnect must not publish new totals.
              if (completed) {
                row = {
                  ...row,
                  state: "complete",
                  last_good: completed,
                  last_completed_at: completed.updated_at,
                };
                publish();
              }
              break;
            } catch (error) {
              const status = error instanceof Response ? error.status : 0;
              // Prefix-usage slots are shared by every Console session, so a
              // busy server answers 429. Wait and retry the same bucket
              // instead of reporting it as failed.
              if (
                status === 429 &&
                attempt < usageBusyAttempts &&
                (await usageBusyWait(attempt, controller.signal))
              )
                continue;
              row = {
                ...row,
                state:
                  status === 401 || status === 403
                    ? "forbidden"
                    : status === 404
                      ? "missing"
                      : "error",
              };
              publish();
              break;
            }
          }
        }
      };
      await Promise.all([run(), run()]);
      if (current())
        setView((previous) => ({ ...previous, requesting: false }));
    };
    const load = async (queue: boolean) => {
      if (!current()) return;
      if (queue)
        setView((previous) => ({
          ...previous,
          requesting: true,
          error: false,
        }));
      try {
        let enabled = false,
          delay = 2000,
          coverage: BucketUsageResponse["coverage"],
          rows: BucketUsageRecord[] = [];
        // A bounded body and bounded server probes avoid a fan-out per bucket.
        for (
          let offset = 0;
          offset < Math.max(buckets.length, 1);
          offset += 100
        ) {
          const body = { buckets: buckets.slice(offset, offset + 100) };
          const response = queue
            ? await api.bucketUsage.bucketUsageRefresh(body, {
                signal: controller.signal,
              })
            : await api.bucketUsage.bucketUsageStatus(body, {
                signal: controller.signal,
              });
          enabled = response.data.enabled;
          delay = response.data.poll_after_ms;
          coverage = response.data.coverage;
          rows.push(...response.data.buckets);
          if (!enabled) break;
        }
        if (!current()) return;
        if (enabled && queue) consumed = true;
        setView((previous) => ({
          enabled,
          requesting: false,
          records: enabled
            ? Object.fromEntries(
                rows.flatMap((received) => {
                  const row = sanitizeRecord(received);
                  return row
                    ? [
                        [
                          row.bucket,
                          mergeRecord(row, previous.records[row.bucket]),
                        ],
                      ]
                    : [];
                }),
              )
            : previous.enabled === false
              ? previous.records
              : {},
          coverage,
        }));
        if (!enabled) {
          if (queue) {
            await direct();
            if (current()) consumed = true;
          }
          return;
        }
        const pending = rows.some(usagePending);
        timer = setTimeout(
          () => void load(false),
          Math.min(60000, Math.max(250, delay) * (pending ? 1 : 10)),
        );
      } catch {
        if (current()) {
          consumed = true;
          setView((previous) => ({
            ...previous,
            requesting: false,
            error: true,
          }));
          timer = setTimeout(() => void load(false), 10000);
        }
      }
    };
    void load(explicitlyRequested);
    return () => {
      if (!consumed && currentSession()) manual.current = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [identity, generation, currentSession]);
  return { ...view, refresh };
}
