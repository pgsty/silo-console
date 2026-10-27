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
import type { BucketUsageRecord, BucketUsageResponse } from "api/consoleApi";
import { hasPermission } from "common/SecureComponent";
import { IAM_SCOPES } from "common/SecureComponent/permissions";
import { useTaskSession } from "../../Common/ObjectManager/useTaskSession";
import { readPrefixUsageStream } from "../../ObjectBrowser/prefixUsage";

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
export const usagePending = (row: BucketUsageRecord) =>
  row.state === "queued" || row.state === "running";

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
    setView((previous) => ({
      ...previous,
      records: Object.fromEntries(
        Object.entries(previous.records).filter(([name]) =>
          buckets.includes(name),
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
            setView((previous) => ({
              ...previous,
              records: { ...previous.records, [bucket]: { ...row } },
            }));
          publish();
          try {
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
                    frame.status === "scanning"
                      ? "running"
                      : frame.status === "failed"
                        ? "error"
                        : frame.status,
                  progress: snapshot,
                  ...(frame.status === "complete"
                    ? {
                        last_good: snapshot,
                        last_completed_at: frame.updated_at,
                      }
                    : {}),
                };
                publish();
              },
            );
          } catch {
            row = { ...row, state: "error" };
            publish();
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
        setView({
          enabled,
          requesting: false,
          records: Object.fromEntries(rows.map((row) => [row.bucket, row])),
          coverage,
        });
        if (!enabled) {
          if (queue) await direct();
          return;
        }
        const pending = rows.some(usagePending);
        timer = setTimeout(
          () => void load(false),
          Math.min(60000, Math.max(250, delay) * (pending ? 1 : 10)),
        );
      } catch {
        if (current()) {
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
      controller.abort();
      clearTimeout(timer);
    };
  }, [identity, generation, currentSession]);
  return { ...view, refresh };
}
