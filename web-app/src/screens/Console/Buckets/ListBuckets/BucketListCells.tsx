// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import { useNavigate } from "react-router-dom";
import { FolderIcon, SettingsIcon, TrashIcon } from "mds";
import { DateTime } from "luxon";
import { formatText, useLanguage, useT } from "i18n";
import type { Bucket } from "../../../../api/consoleApi";
import { hasPermission } from "../../../../common/SecureComponent";
import {
  browseBucketPermissions,
  deleteBucketPermissions,
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import { OverflowMenu, StatusBadge } from "../../../../common/ui";
import { Hint } from "../../../../common/ui/shared";
import { niceBytesInt } from "../../../../common/utils";
import { hasUsageTimestamp, listBucketStatistic } from "./bucketList";
import { useBucketUsageView } from "./useBucketUsage";
import { formatUsageBytes } from "../../ObjectBrowser/prefixUsage";

export const bucketCapabilities = (name: string, obOnly: boolean) => ({
  browse: hasPermission(name, browseBucketPermissions),
  settings:
    !obOnly &&
    hasPermission(name, IAM_PAGES_PERMISSIONS[IAM_PAGES.BUCKETS_ADMIN_VIEW]),
  delete: !obOnly && hasPermission(name, deleteBucketPermissions),
  select:
    !obOnly &&
    hasPermission(name, [
      IAM_SCOPES.S3_PUT_LIFECYCLE_CONFIGURATION,
      IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
      IAM_SCOPES.S3_PUT_ACTIONS,
    ]),
});
export interface BucketDisplayProps {
  bucket: Bucket;
  canReadUsage: boolean;
  usageUpdatedAt?: string | null;
  obOnly: boolean;
  selected: boolean;
  onSelect?: (name: string) => void;
  onDelete: (name: string) => void;
}
export const BucketUsage = ({
  bucket,
  field,
  canReadUsage,
  usageUpdatedAt,
}: {
  bucket: Bucket;
  field: "size" | "objects";
  canReadUsage: boolean;
  usageUpdatedAt?: string | null;
}) => {
  const t = useT();
  const language = useLanguage();
  const usage = useBucketUsageView();
  const row = usage?.records[bucket.name];
  const totals = row?.last_good?.totals;
  if (totals)
    return field === "objects" ? (
      <>{totals.current_objects.toLocaleString(language)}</>
    ) : (
      <>
        <span title={`${totals.current_bytes} B`}>
          {formatUsageBytes(totals.current_bytes)}
        </span>
        {totals.retained_bytes != null && (
          <small
            style={{ display: "block" }}
            title={`${totals.retained_bytes} B`}
          >
            {t("Retained")}: {formatUsageBytes(totals.retained_bytes)}
          </small>
        )}
      </>
    );
  if (usage) return <span>—</span>;
  const value = listBucketStatistic(
    bucket,
    field,
    canReadUsage,
    usageUpdatedAt,
  );
  return value === undefined ? (
    <Hint
      text={
        canReadUsage && !hasUsageTimestamp(usageUpdatedAt)
          ? t("Calculating…")
          : t("Unknown")
      }
    >
      <span tabIndex={0}>—</span>
    </Hint>
  ) : (
    <>
      {field === "size" ? niceBytesInt(value) : value.toLocaleString(language)}
    </>
  );
};
export const BucketAccess = ({ bucket }: { bucket: Bucket }) => {
  const t = useT();
  return (
    <>
      {bucket.rw_access?.read
        ? bucket.rw_access.write
          ? t("Read & write")
          : t("Read only")
        : bucket.rw_access?.write
          ? t("Write only")
          : t("Unknown")}
    </>
  );
};
export const BucketFeature = ({
  enabled,
  suspended = false,
}: {
  enabled?: boolean;
  suspended?: boolean;
}) => {
  const t = useT();
  return (
    <StatusBadge
      tone={suspended ? "warning" : enabled ? "success" : "neutral"}
      label={
        suspended
          ? t("Suspended")
          : enabled === undefined
            ? t("Unknown")
            : enabled
              ? t("Enabled")
              : t("Disabled")
      }
    />
  );
};
export const BucketCreated = ({ at }: { at?: string }) => {
  const language = useLanguage();
  const date = at
    ? DateTime.fromISO(at).setLocale(language === "zh" ? "zh-CN" : "en")
    : undefined;
  return date?.isValid ? (
    <Hint text={date.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}>
      <time dateTime={at} tabIndex={0}>
        {date.toRelative()}
      </time>
    </Hint>
  ) : (
    <>—</>
  );
};
export const BucketRowActions = ({
  bucket,
  obOnly,
  onDelete,
}: Pick<BucketDisplayProps, "bucket" | "obOnly" | "onDelete">) => {
  const t = useT();
  const navigate = useNavigate();
  const permissions = bucketCapabilities(bucket.name, obOnly);
  const encoded = encodeURIComponent(bucket.name);
  const items = [
    ...(permissions.browse
      ? [
          {
            label: t("Browse"),
            icon: <FolderIcon />,
            onClick: () => navigate(`/browser/${encoded}`),
          },
        ]
      : []),
    ...(permissions.settings
      ? [
          {
            label: t("Settings"),
            icon: <SettingsIcon />,
            onClick: () => navigate(`/buckets/${encoded}/admin/summary`),
          },
        ]
      : []),
    ...(permissions.delete
      ? [
          {
            label: t("Delete bucket"),
            icon: <TrashIcon />,
            danger: true,
            onClick: () => onDelete(bucket.name),
          },
        ]
      : []),
  ];
  return items.length ? (
    <div
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <OverflowMenu
        label={formatText(t("Actions for {bucket}"), { bucket: bucket.name })}
        tooltipPlacement="left"
        tooltipLabel={t("Actions")}
        items={items}
      />
    </div>
  ) : null;
};
