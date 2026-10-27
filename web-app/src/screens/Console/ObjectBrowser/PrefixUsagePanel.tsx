// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from "react";
import { Button } from "mds";
import { useT } from "i18n";
import { formatUsageBytes } from "./prefixUsage";
import type { usePrefixUsage } from "./usePrefixUsage";

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
    <section
      aria-label={t("Folder sizes")}
      style={{
        padding: "var(--silo-space-12)",
        border: "1px solid var(--silo-border)",
        borderRadius: 6,
        marginBottom: "var(--silo-space-12)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--silo-space-12)",
        }}
      >
        <Button
          id="calculate-folder-sizes"
          label={t("Calculate folder sizes")}
          variant="regular"
          disabled={!!scan?.running}
          onClick={() =>
            void usage.start(prefix, versions && canListVersions, true)
          }
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={versions && canListVersions}
            disabled={!!scan?.running || !canListVersions}
            onChange={(event) => setVersions(event.target.checked)}
          />
          {t("Include retained versions")}
        </label>
        {scan?.running && (
          <Button
            id="cancel-folder-sizes"
            label={t("Cancel")}
            variant="regular"
            onClick={usage.cancel}
          />
        )}
      </div>
      <p
        style={{
          margin: "8px 0",
          color: "var(--silo-text-muted)",
          fontSize: 12,
        }}
      >
        {t(
          "Scans object metadata without downloading files. Contents can change during the scan. Sizes are logical bytes, not physical disk usage.",
        )}
      </p>
      {scan && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{ overflowWrap: "anywhere" }}
        >
          <strong>{status}</strong>
          {" · "}
          {scan.prefix || "/"}
          {frame && (
            <>
              <div>
                {t("Current objects")}:{" "}
                {frame.totals.current_objects.toLocaleString()}
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
                  {frame.totals.retained_versions.toLocaleString()}
                  {" · "}
                  {t("Retained size")}:{" "}
                  <span title={`${frame.totals.retained_bytes} B`}>
                    {complete ? "" : "≥ "}
                    {formatUsageBytes(frame.totals.retained_bytes)}
                  </span>
                  {" · "}
                  {t("Delete markers")}:{" "}
                  {frame.totals.delete_markers.toLocaleString()}
                </div>
              )}
              <div>
                {t("Entries scanned")}: {frame.scanned_entries.toLocaleString()}
                {" · "}
                {t("Calculated at")}:{" "}
                <time dateTime={frame.updated_at}>
                  {new Date(frame.updated_at).toLocaleString()}
                </time>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
