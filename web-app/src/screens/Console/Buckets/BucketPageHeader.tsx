// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BucketsIcon,
  Button,
  FolderIcon,
  IconButton,
  RefreshIcon,
  SettingsIcon,
  Tabs,
  TrashIcon,
} from "mds";
import styled from "styled-components";
import { DateTime } from "luxon";
import type { Bucket } from "../../../api/consoleApi";
import { useAppSelector } from "../../../store";
import { selSiteRep } from "../../../systemSlice";
import { hasPermission } from "../../../common/SecureComponent";
import { deleteBucketPermissions } from "../../../common/SecureComponent/permissions";
import { Freshness, OverflowMenu } from "../../../common/ui";
import { ModalPresence } from "../../../common/ui/ModalPresence";
import { typography } from "../../../common/ui/typography";
import { niceBytesInt } from "../../../common/utils";
import { useRecentBuckets } from "../../../navigation/RecentBucketsProvider";
import { useRouteContext } from "../../../navigation/useRouteContext";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import withSuspense from "../Common/Components/withSuspense";
import { useMobile } from "common/ui/useMediaQuery";
import { OverflowItem } from "common/ui/OverflowMenu";
import { formatText, localeTag, useLanguage, useT } from "i18n";
import { bucketTabs } from "./bucketTabs";
import { bucketStatistic } from "./bucketMetadata";

const DeleteBucket = withSuspense(
  React.lazy(() => import("./ListBuckets/DeleteBucket")),
);
const Breadcrumb = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  a {
    color: var(--muted-foreground);
    text-decoration: none;
  }
  a:hover {
    color: var(--foreground);
  }
  > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px 24px 12px;
  @media (max-width: 1199px) {
    padding-inline: 16px;
  }
  @media (max-width: 767px) {
    padding-inline: 12px;
    .bucketIdentity {
      flex-basis: 100%;
    }
  }
  .bucketIdentity {
    min-width: 0;
    flex: 1;
  }
  h1 {
    ${typography.title} margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-wrap: anywhere;
  }
  h1 svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: var(--muted-foreground);
  }
  .bucketActions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;
const Metadata = styled.div`
  ${typography.caption}
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 4px;
  column-gap: 12px;
  margin-top: 8px;
  > span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  @media (min-width: 768px) {
    > span + span::before {
      content: "·";
      margin-right: 4px;
    }
  }
`;
const TabShell = styled.div`
  min-width: 0;
  > .tabs-container {
    height: auto;
  }
  > .tabs-container > .optionsContainer {
    padding: 0 24px 12px;
    border-bottom: 1px solid var(--border);
    @media (max-width: 767px) {
      padding-inline: 12px;
    }
  }
  > .tabs-container > .tabsPanels {
    padding: 0;
  }
`;

interface Props {
  bucketName: string;
  bucketInfo?: Bucket | null;
  primaryAction?: React.ReactNode;
  refreshAction?: OverflowItem & { id: string };
  onRefresh?: () => void;
  anonymous?: boolean;
  children: React.ReactElement;
}

export default function BucketPageHeader({
  bucketName,
  bucketInfo,
  primaryAction,
  refreshAction,
  onRefresh,
  anonymous = false,
  children,
}: Props) {
  const t = useT();
  const mobile = useMobile();
  const language = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const context = useRouteContext();
  const site = useAppSelector(selSiteRep);
  const { listing, visit, objectRoute, refresh } = useRecentBuckets();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const listed = listing?.buckets?.find((bucket) => bucket.name === bucketName);
  const details = bucketInfo?.name === bucketName ? bucketInfo : undefined;
  const metadata = listed || details;
  const usageUpdatedAt = listed ? listing?.usageUpdatedAt : undefined;
  const size = bucketStatistic(metadata, "size", usageUpdatedAt);
  const objectsCount = bucketStatistic(metadata, "objects", usageUpdatedAt);
  const access = details?.access || listed?.access;
  const rw = listed?.rw_access;
  const accessLabel = access
    ? t(access.toLowerCase())
    : rw?.read
      ? rw.write
        ? t("Read and write")
        : t("Read only")
      : rw?.write
        ? t("Write only")
        : undefined;
  const date = metadata?.creation_date
    ? DateTime.fromISO(metadata.creation_date).setLocale(localeTag(language))
    : undefined;
  const tabs = bucketTabs(bucketName, context, site.enabled && site.curSite);
  const objects = tabs.find((tab) => tab.id === "objects");
  const summary = tabs.find((tab) => tab.id === "summary");
  const isObjects = location.pathname.startsWith("/browser/");
  const active = isObjects ? objects?.to : location.pathname;
  useEffect(() => {
    if (!anonymous) visit(bucketName);
    setDeleteTarget(null);
  }, [bucketName, anonymous, visit]);
  const actions = [
    ...(!isObjects && objects
      ? [
          {
            label: t("Browse Bucket"),
            icon: <FolderIcon />,
            onClick: () => navigate(objectRoute(bucketName)),
          },
        ]
      : []),
    ...(isObjects && summary
      ? [
          {
            label: t("Configure Bucket"),
            icon: <SettingsIcon />,
            onClick: () => navigate(summary.to),
          },
        ]
      : []),
    ...(!anonymous && hasPermission(bucketName, deleteBucketPermissions)
      ? [
          {
            label: t("Delete Bucket"),
            icon: <TrashIcon />,
            danger: true,
            onClick: () => setDeleteTarget(bucketName),
          },
        ]
      : []),
  ];
  return (
    <>
      {!anonymous && (
        <PageHeaderWrapper
          sx={{ minHeight: 56 }}
          label={
            <Breadcrumb>
              <Link to="/buckets">{t("Buckets")}</Link>
              <span aria-hidden="true">/</span>
              <span>{bucketName}</span>
            </Breadcrumb>
          }
          help
        />
      )}
      <Heading>
        <div className="bucketIdentity">
          <h1>
            <BucketsIcon aria-hidden="true" />
            {bucketName}
          </h1>
          {!anonymous && (
            <Metadata>
              {[
                date?.isValid ? (
                  <span title={date.toLocaleString(DateTime.DATETIME_FULL)}>
                    {formatText(t("Created {date}"), {
                      date: date.toLocaleString(DateTime.DATE_MED),
                    })}
                  </span>
                ) : null,
                accessLabel || null,
                size !== undefined ? niceBytesInt(size) : null,
                objectsCount !== undefined
                  ? formatText(t("{count} objects"), {
                      count: objectsCount.toLocaleString(language),
                    })
                  : null,
                listed && listing?.usageUpdatedAt ? (
                  <Freshness at={listing.usageUpdatedAt} prefix="Calculated" />
                ) : null,
              ]
                .filter((item) => item !== null)
                .map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
            </Metadata>
          )}
        </div>
        <div className="bucketActions">
          {primaryAction}
          {!mobile && (
            <IconButton
              id={refreshAction?.id || "refresh-bucket-info"}
              label={refreshAction?.label || t("Refresh")}
              disabled={refreshAction?.disabled}
              disabledReason={refreshAction?.disabledReason}
              onClick={
                refreshAction?.onClick ||
                (() => {
                  onRefresh?.();
                  refresh();
                })
              }
            >
              <RefreshIcon />
            </IconButton>
          )}
          <OverflowMenu
            label={t("Bucket actions")}
            items={[
              ...(mobile
                ? [
                    refreshAction || {
                      label: t("Refresh"),
                      onClick: () => {
                        onRefresh?.();
                        refresh();
                      },
                      icon: <RefreshIcon />,
                    },
                  ]
                : []),
              ...actions,
            ]}
          />
        </div>
      </Heading>
      {anonymous ? (
        children
      ) : (
        <TabShell>
          <Tabs
            horizontal
            useRouteTabs
            currentTabOrPath={active || ""}
            options={tabs.map(({ id, label, to }) => ({
              tabConfig: { id, label: t(label), to },
            }))}
            onTabClick={(to) =>
              navigate(to === objects?.to ? objectRoute(bucketName) : to)
            }
            routes={children}
          />
        </TabShell>
      )}
      <ModalPresence open={deleteTarget !== null}>
        {deleteTarget !== null && (
          <DeleteBucket
            deleteOpen
            selectedBucket={deleteTarget}
            closeDeleteModalAndRefresh={(deleted) => {
              setDeleteTarget(null);
              if (deleted) {
                refresh();
                navigate("/buckets");
              }
            }}
          />
        )}
      </ModalPresence>
    </>
  );
}
