// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from "react";
import styled from "styled-components";
import { useT, formatText, useLanguage } from "i18n";
import { typography } from "../../../../common/ui/typography";
import { useBucketUsageView } from "./useBucketUsage";

// One caption line under a bucket name or size. It never wraps, so table rows
// and cards keep a fixed rhythm; the full text remains available as a title.
const UsageCaption = styled.small`
  ${typography.caption}
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--muted-foreground);
`;

// A secondary measurement under a number. It may wrap between its label and
// value in a narrow column, but never clips the value itself.
export const UsageDetail = styled(UsageCaption)`
  white-space: normal;
  text-overflow: clip;
  .usageValue {
    white-space: nowrap;
  }
`;

export function BucketUsageStatus({ bucket }: { bucket: string }) {
  const usage = useBucketUsageView();
  const row = usage?.records[bucket];
  const t = useT();
  const locale = useLanguage() === "zh" ? "zh-CN" : "en";
  if (!usage || (!row && !usage.enabled)) return null;
  const labels = {
    not_scanned: t("Not scanned"),
    queued: t("Update queued"),
    running: t("Updating usage…"),
    complete: t("Updated"),
    error: t("Update failed — retry with Refresh"),
    limited: t("Scan limit reached — operator action required"),
    forbidden: t("Usage listing not permitted"),
    missing: t("Bucket no longer exists"),
    unavailable: t("Usage temporarily unavailable"),
  };
  const completed = row?.last_completed_at
    ? new Date(row.last_completed_at)
    : undefined;
  const text = [
    row ? labels[row.state] : t("Checking usage…"),
    row?.state === "running" && row.progress
      ? formatText(t("{count} entries scanned"), {
          count: row.progress.scanned_entries.toLocaleString(locale),
        })
      : "",
    completed && Number.isFinite(completed.getTime())
      ? completed.toLocaleTimeString(locale)
      : "",
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <UsageCaption
      title={
        completed && Number.isFinite(completed.getTime())
          ? `${text} (${completed.toLocaleString(locale)})`
          : text
      }
    >
      {text}
    </UsageCaption>
  );
}

export function BucketUsageNotice() {
  const usage = useBucketUsageView();
  const t = useT();
  // Chinese sentences end in full-width punctuation and need no extra space.
  const gap = useLanguage() === "zh" ? "" : " ";
  if (!usage) return null;
  const rows = Object.values(usage.records);
  const pending = rows.filter(
    (row) => row.state === "queued" || row.state === "running",
  ).length;
  const failed = rows.filter((row) =>
    ["error", "limited", "unavailable"].includes(row.state),
  ).length;
  const watching =
    usage.coverage?.observer_alive &&
    usage.coverage.connected &&
    usage.coverage.reconciled;
  return (
    <div role="status" aria-live="polite" style={{ marginBottom: 12 }}>
      {usage.requesting
        ? t("Requesting usage updates…")
        : pending
          ? formatText(
              t(
                "{count} usage updates queued or running. Last completed totals remain visible.",
              ),
              { count: pending },
            )
          : t("Refresh requests a new metadata scan of all listed buckets.")}
      {gap}
      {usage.error
        ? t("Usage status is unavailable. Retrying…")
        : usage.enabled
          ? watching
            ? t("Automatic change monitoring is active.")
            : t(
                "Automatic change monitoring is recovering; totals may be out of date.",
              )
          : usage.enabled === false
            ? t(
                "Automatic updates are not configured. Refresh calculates usage while this page is open.",
              )
            : t("Checking automatic updates…")}
      {failed > 0 && (
        <>
          {gap}
          {formatText(
            t("{count} updates need attention. Use Refresh to retry."),
            { count: failed },
          )}
        </>
      )}
    </div>
  );
}
