// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from "react";
import styled from "styled-components";
import { Button, Checkbox } from "mds";
import { useLanguage, useT } from "i18n";
import { typography } from "../../../common/ui/typography";
import { formatUsageBytes } from "./prefixUsage";
import type { usePrefixUsage } from "./usePrefixUsage";

// A strip inside the listing card: it shares the card's border instead of
// drawing a second box, and uses the caption scale for secondary text.
const Panel = styled.section`
  padding: var(--silo-space-12) var(--silo-space-16);
  border-bottom: 1px solid var(--border);
  .usageActions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--silo-space-12);
  }
  .usageHint {
    ${typography.caption}
    margin: var(--silo-space-8) 0 0;
    color: var(--muted-foreground);
  }
  .usageResult {
    margin-top: var(--silo-space-8);
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
`;

type Usage = ReturnType<typeof usePrefixUsage>;
export function PrefixUsagePanel({
  usage,
  prefix,
  versions,
  setVersions,
  canListVersions,
}: {
  usage: Usage;
  prefix: string;
  versions: boolean;
  setVersions: (value: boolean) => void;
  canListVersions: boolean;
}) {
  const t = useT();
  const locale = useLanguage() === "zh" ? "zh-CN" : "en";
  const { scan } = usage;
  const frame = scan?.frame;
  const complete = !scan?.outcome && frame?.status === "complete";
  const status = scan?.running
    ? t("Calculating")
    : scan?.outcome === "canceled"
      ? t("Canceled — totals are partial")
      : scan?.outcome === "error" || frame?.status === "failed"
        ? t("Calculation failed — totals are partial")
        : frame?.status === "limited"
          ? t("Scan limit reached — totals are partial. Try a smaller folder.")
          : complete
            ? t("Completed")
            : "";
  return (
    <Panel aria-label={t("Folder sizes")}>
      <div className="usageActions">
        <Button
          id="calculate-folder-sizes"
          label={t("Calculate folder sizes")}
          variant="regular"
          disabled={!!scan?.running}
          onClick={() =>
            void usage.start(prefix, versions && canListVersions, true)
          }
        />
        <Checkbox
          id="folder-sizes-versions"
          label={t("Include retained versions")}
          checked={versions && canListVersions}
          disabled={!!scan?.running || !canListVersions}
          onChange={(event) => setVersions(event.target.checked)}
        />
        {scan?.running && (
          <Button
            id="cancel-folder-sizes"
            label={t("Cancel")}
            variant="regular"
            onClick={usage.cancel}
          />
        )}
      </div>
      <p className="usageHint">
        {t(
          "Scans object metadata without downloading files. Contents can change during the scan. Sizes are logical bytes, not physical disk usage.",
        )}
      </p>
      {scan && (
        <div
          className="usageResult"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <strong>{status}</strong>
          {" · "}
          {scan.prefix || "/"}
          {frame && (
            <>
              <div>
                {t("Current objects")}:{" "}
                {frame.totals.current_objects.toLocaleString(locale)}
                {" · "}
                {t("Current size")}:{" "}
                <span title={`${frame.totals.current_bytes} B`}>
                  {complete ? "" : "≥ "}
                  {formatUsageBytes(frame.totals.current_bytes)}
                </span>
              </div>
              {frame.mode === "versions" && (
                <div>
                  {t("Retained versions")}:{" "}
                  {frame.totals.retained_versions.toLocaleString(locale)}
                  {" · "}
                  {t("Retained size")}:{" "}
                  <span title={`${frame.totals.retained_bytes} B`}>
                    {complete ? "" : "≥ "}
                    {formatUsageBytes(frame.totals.retained_bytes)}
                  </span>
                  {" · "}
                  {t("Delete markers")}:{" "}
                  {frame.totals.delete_markers.toLocaleString(locale)}
                </div>
              )}
              <div>
                {t("Entries scanned")}:{" "}
                {frame.scanned_entries.toLocaleString(locale)}
                {" · "}
                {t("Calculated at")}:{" "}
                <time dateTime={frame.updated_at}>
                  {new Date(frame.updated_at).toLocaleString(locale)}
                </time>
              </div>
            </>
          )}
        </div>
      )}
    </Panel>
  );
}
