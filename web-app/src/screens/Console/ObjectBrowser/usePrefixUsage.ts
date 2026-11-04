// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "api";
import type { PrefixUsageFrame } from "api/consoleApi";
import { readPrefixUsageStream } from "./prefixUsage";
import { registerTaskControl, removeTrace } from "./transferManager";
import { useTaskSession } from "../Common/ObjectManager/useTaskSession";

type Scan = {
  owner: string;
  prefix: string;
  running: boolean;
  frame?: PrefixUsageFrame;
  outcome?: "canceled" | "error";
};

export function usePrefixUsage(
  bucket: string,
  prefix: string,
  enabled: boolean,
) {
  const owner = JSON.stringify([bucket, prefix, enabled]);
  const isCurrentSession = useTaskSession();
  const [scan, setScan] = useState<Scan>();
  const active = useRef<AbortController | null>(null);
  const serial = useRef(0);
  useEffect(() => {
    setScan(undefined);
    return () => {
      serial.current++;
      active.current?.abort();
    };
  }, [owner]);
  const start = useCallback(
    async (target: string, versions: boolean, folders: boolean) => {
      if (!enabled || !isCurrentSession()) return;
      active.current?.abort();
      const request = ++serial.current;
      const controller = new AbortController();
      active.current = controller;
      const task = `prefix-usage-${crypto.randomUUID()}`;
      registerTaskControl(task, { cancel: () => controller.abort() });
      const current = () => serial.current === request && isCurrentSession();
      setScan({ owner, prefix: target, running: true });
      try {
        const response = await api.buckets.prefixUsage(
          bucket,
          { prefix: target, versions, folders },
          { signal: controller.signal },
        );
        await readPrefixUsageStream(
          response,
          { bucket, prefix: target, mode: versions ? "versions" : "current" },
          (frame) => {
            if (current())
              setScan({ owner, prefix: target, running: true, frame });
          },
        );
      } catch {
        if (current())
          setScan(
            (previous) =>
              previous && {
                ...previous,
                outcome: controller.signal.aborted ? "canceled" : "error",
              },
          );
      } finally {
        removeTrace(task);
        if (current()) {
          active.current = null;
          setScan((previous) => previous && { ...previous, running: false });
        }
      }
    },
    [bucket, enabled, isCurrentSession, owner],
  );
  return {
    scan: scan?.owner === owner ? scan : undefined,
    start,
    cancel: () => active.current?.abort(),
  };
}
