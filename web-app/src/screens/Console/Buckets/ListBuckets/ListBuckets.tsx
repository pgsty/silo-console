// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import { useMobile } from "common/ui/useMediaQuery";
import { OverflowMenu } from "common/ui/OverflowMenu";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  AddIcon,
  BucketsIcon,
  Button,
  LifecycleConfigIcon,
  MultipleBucketsIcon,
  PageLayout,
  RefreshIcon,
  IconButton,
} from "mds";
import { api } from "../../../../api";
import type { ListBucketsResponse } from "../../../../api/consoleApi";
import { errorToHandler } from "../../../../api/errors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { selSession } from "../../consoleSlice";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import hasPermission from "../../../../common/SecureComponent/accessControl";
import { hasCreateBucketPermission } from "../../../../common/SecureComponent/createBucketPermission";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PERMISSIONS,
  IAM_ROLES,
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../common/SecureComponent/permissions";
import { EmptyState, SkeletonRows } from "../../../../common/ui";
import { ModalPresence } from "../../../../common/ui/ModalPresence";
import { typography } from "../../../../common/ui/typography";
import { useRecentBuckets } from "../../../../navigation/RecentBucketsProvider";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import withSuspense from "../../Common/Components/withSuspense";
import SearchBox from "../../Common/SearchBox";
import { formatText, useT } from "i18n";
import BucketListItem from "./BucketListItem";
import { BucketUsageProvider, useBucketUsage } from "./useBucketUsage";
import { BucketUsageNotice } from "./BucketUsageStatus";
import BucketsTable from "./BucketsTable";
import { bucketCapabilities } from "./BucketListCells";
import {
  BucketView,
  filterSortBuckets,
  parseBucketView,
  toggleVisibleBuckets,
} from "./bucketList";
import { useBucketListQuery } from "./useBucketListQuery";

const BulkReplicationModal = withSuspense(
  React.lazy(() => import("./BulkReplicationModal")),
);
const BulkLifecycleModal = withSuspense(
  React.lazy(() => import("./BulkLifecycleModal")),
);
const DeleteBucket = withSuspense(React.lazy(() => import("./DeleteBucket")));
const BrowserTitle = styled.h1`
  ${typography.title}
  margin: 0 0 16px;
`;
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  .bucketSearch {
    min-width: 160px;
    flex: 1 1 190px;
  }
  .bucketActions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    margin-left: auto;
  }
  .bucketView {
    display: flex;
    gap: 4px;
  }
  @media (max-width: 767.98px) {
    .bucketFreshness {
      order: 3;
      flex-basis: 100%;
    }
    .bucketSearch {
      flex-basis: 100%;
    }
    .bucketActions {
      flex-basis: 100%;
      flex-wrap: nowrap;
      justify-content: flex-start;
      gap: 8px;
    }
    .bucketView {
      margin-right: auto;
    }
  }
`;
const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 1199.98px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 767.98px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
const Selection = styled.div`
  ${typography.caption}
  color: var(--muted-foreground);
  margin-bottom: 8px;
`;
const Frame = styled.div`
  background: var(--surface-3);
  box-shadow: var(--shadow-2);
  border-radius: var(--radius-card);
  min-height: 180px;
`;

const ListBuckets = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const mobile = useMobile();
  const session = useAppSelector(selSession);
  const obOnly = !!session.features?.includes("object-browser-only");
  const canReadUsage = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_DATA_USAGE_INFO,
  ]);
  const canCreate = !obOnly && hasCreateBucketPermission(session.permissions);
  const { updateListing } = useRecentBuckets();
  const { query, search, setSearch, sort, clear } = useBucketListQuery();
  const [listing, setListing] = useState<ListBucketsResponse>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulk, setBulk] = useState<{
    type: "replication" | "lifecycle";
    names: string[];
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [view, setView] = useState<BucketView>(() => {
    try {
      return parseBucketView(localStorage.getItem("silo.buckets.view"));
    } catch {
      return "table";
    }
  });
  const refresh = useCallback(() => setGeneration((value) => value + 1), []);
  useEffect(() => {
    dispatch(setHelpName("ob_bucket_list"));
  }, [dispatch]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    api.buckets
      .listBuckets({ signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(response.data?.buckets))
          throw new Error(t("The bucket list could not be loaded."));
        setListing(response.data);
        updateListing(response.data);
        const names = new Set(
          response.data.buckets.map((bucket) => bucket.name),
        );
        setSelected((previous) => previous.filter((name) => names.has(name)));
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setFailed(true);
          dispatch(setErrorSnackMessage(errorToHandler(error)));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [generation, dispatch, updateListing, session.accountAccessKey, t]);
  useEffect(() => {
    try {
      localStorage.setItem("silo.buckets.view", view);
    } catch {
      /* Usable without storage. */
    }
  }, [view]);
  const records = listing?.buckets || [];
  const usage = useBucketUsage(records.map((bucket) => bucket.name));
  const refreshUsage = () => {
    refresh();
    usage.refresh();
  };
  const filtered = useMemo(
    () =>
      filterSortBuckets(
        records,
        query,
        canReadUsage,
        listing?.usageUpdatedAt,
        usage.records,
      ),
    [
      records,
      query.sort,
      query.dir,
      query.q,
      canReadUsage,
      listing?.usageUpdatedAt,
      usage.records,
    ],
  );
  const canSelect =
    !obOnly &&
    hasPermission("*", [
      IAM_SCOPES.S3_PUT_LIFECYCLE_CONFIGURATION,
      IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
      IAM_SCOPES.S3_PUT_ACTIONS,
    ]);
  const select = (name: string) =>
    setSelected((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name],
    );
  const selectAll = () =>
    setSelected((previous) =>
      toggleVisibleBuckets(
        previous,
        filtered
          .filter((bucket) => bucketCapabilities(bucket.name, obOnly).select)
          .map((bucket) => bucket.name),
      ),
    );
  const lifecycleAllowed = selected.every((name) =>
    hasPermission(name, IAM_PERMISSIONS[IAM_ROLES.BUCKET_LIFECYCLE], true),
  );
  const replicationAllowed = selected.every((name) =>
    hasPermission(name, [
      IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
      IAM_SCOPES.S3_PUT_ACTIONS,
    ]),
  );
  const noSelection = t("Select one or more buckets first.");
  const bulkReason = (allowed: boolean, scopes: string[]) =>
    !selected.length
      ? noSelection
      : !allowed
        ? permissionTooltipHelper(scopes, t("configure the selected buckets"))
        : undefined;
  const closeBulk = (clearSelection: boolean) => {
    setBulk(null);
    if (clearSelection) {
      setSelected([]);
      refresh();
    }
  };
  const shared = {
    canReadUsage,
    usageUpdatedAt: listing?.usageUpdatedAt,
    obOnly,
    onSelect: canSelect ? select : undefined,
    onDelete: setDeleteTarget,
  };
  const create = canCreate ? (
    <Button
      id="empty-create-bucket"
      variant="callAction"
      label={t("Create bucket")}
      onClick={() => navigate(IAM_PAGES.ADD_BUCKETS)}
    />
  ) : undefined;
  return (
    <BucketUsageProvider value={usage}>
      <ModalPresence open={bulk?.type === "replication"}>
        {bulk?.type === "replication" && (
          <BulkReplicationModal
            open
            buckets={bulk.names}
            closeModalAndRefresh={closeBulk}
          />
        )}
      </ModalPresence>
      <ModalPresence open={bulk?.type === "lifecycle"}>
        {bulk?.type === "lifecycle" && (
          <BulkLifecycleModal
            open
            buckets={bulk.names}
            closeModalAndRefresh={closeBulk}
          />
        )}
      </ModalPresence>
      <ModalPresence open={deleteTarget !== null}>
        {deleteTarget !== null && (
          <DeleteBucket
            deleteOpen
            selectedBucket={deleteTarget}
            closeDeleteModalAndRefresh={(reload) => {
              setDeleteTarget(null);
              if (reload) {
                setSelected((previous) =>
                  previous.filter((name) => name !== deleteTarget),
                );
                refresh();
              }
            }}
          />
        )}
      </ModalPresence>
      {!obOnly && (
        <PageHeaderWrapper label={t("Buckets")} titleElement="h1" help />
      )}
      <PageLayout>
        {obOnly && <BrowserTitle>{t("Buckets")}</BrowserTitle>}
        <Toolbar>
          <div className="bucketSearch">
            <SearchBox
              id="bucket-search"
              placeholder={t("Search buckets")}
              value={search}
              onChange={setSearch}
              sx={{ width: "100%" }}
            />
          </div>
          <div className="bucketActions">
            <div
              className="bucketView"
              role="group"
              aria-label={t("Bucket view")}
            >
              <Button
                id="buckets-view-table"
                collapseOnSmall={false}
                label={t("Table")}
                variant={view === "table" ? "secondary" : "ghost"}
                aria-pressed={view === "table"}
                onClick={() => setView("table")}
              />
              <Button
                id="buckets-view-cards"
                collapseOnSmall={false}
                label={t("Cards")}
                variant={view === "cards" ? "secondary" : "ghost"}
                aria-pressed={view === "cards"}
                onClick={() => setView("cards")}
              />
            </div>
            <IconButton
              id="refresh-buckets"
              aria-label={t("Refresh buckets")}
              size="medium"
              disabled={loading || usage.requesting}
              onClick={refreshUsage}
            >
              <RefreshIcon />
            </IconButton>
            {canSelect &&
              (mobile ? (
                <OverflowMenu
                  label={t("Actions")}
                  items={[
                    {
                      label: t("Set replication"),
                      icon: <MultipleBucketsIcon />,
                      disabled:
                        loading || !selected.length || !replicationAllowed,
                      disabledReason: bulkReason(replicationAllowed, [
                        IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
                      ]),
                      onClick: () =>
                        setBulk({ type: "replication", names: [...selected] }),
                    },
                    {
                      label: t("Set lifecycle"),
                      icon: <LifecycleConfigIcon />,
                      disabled:
                        loading || !selected.length || !lifecycleAllowed,
                      disabledReason: bulkReason(
                        lifecycleAllowed,
                        IAM_PERMISSIONS[IAM_ROLES.BUCKET_LIFECYCLE],
                      ),
                      onClick: () =>
                        setBulk({ type: "lifecycle", names: [...selected] }),
                    },
                  ]}
                />
              ) : (
                <>
                  <Button
                    id="set-replication"
                    collapseOnSmall={false}
                    label={t("Set replication")}
                    icon={<MultipleBucketsIcon />}
                    disabled={
                      loading || !selected.length || !replicationAllowed
                    }
                    disabledReason={bulkReason(replicationAllowed, [
                      IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
                    ])}
                    onClick={() =>
                      setBulk({ type: "replication", names: [...selected] })
                    }
                  />
                  <Button
                    id="set-lifecycle"
                    collapseOnSmall={false}
                    label={t("Set lifecycle")}
                    icon={<LifecycleConfigIcon />}
                    disabled={loading || !selected.length || !lifecycleAllowed}
                    disabledReason={bulkReason(
                      lifecycleAllowed,
                      IAM_PERMISSIONS[IAM_ROLES.BUCKET_LIFECYCLE],
                    )}
                    onClick={() =>
                      setBulk({ type: "lifecycle", names: [...selected] })
                    }
                  />
                </>
              ))}
            {!obOnly && (
              <Button
                id={"create-bucket"}
                label={t("Create bucket")}
                icon={<AddIcon />}
                disabled={!canCreate}
                disabledReason={
                  canCreate
                    ? undefined
                    : permissionTooltipHelper(
                        [IAM_SCOPES.S3_CREATE_BUCKET],
                        t("create a bucket"),
                      )
                }
                onClick={() => navigate(IAM_PAGES.ADD_BUCKETS)}
                variant="primary"
                collapseOnSmall={false}
              />
            )}
          </div>
        </Toolbar>
        <BucketUsageNotice />
        {selected.length > 0 && (
          <Selection role="status">
            {formatText(
              t(
                selected.length === 1
                  ? "1 bucket selected"
                  : "{count} buckets selected",
              ),
              {
                count: selected.length,
              },
            )}
          </Selection>
        )}
        {loading && !listing ? (
          <Frame>
            <SkeletonRows rows={5} columns={4} />
          </Frame>
        ) : failed && !listing ? (
          <Frame>
            <EmptyState
              compact
              icon={<BucketsIcon />}
              title={t("The bucket list could not be loaded.")}
              action={
                <Button
                  id="retry-buckets"
                  label={t("Retry")}
                  onClick={refresh}
                />
              }
            />
          </Frame>
        ) : filtered.length === 0 ? (
          <Frame>
            {query.q.trim() ? (
              <EmptyState
                compact
                icon={<BucketsIcon />}
                title={formatText(t("No buckets match “{q}”"), {
                  q: query.q.trim(),
                })}
                action={
                  <Button
                    id="clear-bucket-filter"
                    label={t("Clear filter")}
                    onClick={clear}
                  />
                }
              />
            ) : (
              <EmptyState
                icon={<BucketsIcon />}
                title={t("No buckets yet")}
                description={t("Create a bucket to start storing objects.")}
                action={create}
              />
            )}
          </Frame>
        ) : view === "table" ? (
          <BucketsTable
            {...shared}
            records={filtered}
            query={query}
            onSort={sort}
            selected={selected}
            onSelectAll={selectAll}
          />
        ) : (
          <Cards role="list" aria-label={t("Buckets")}>
            {filtered.map((bucket) => (
              <BucketListItem
                key={bucket.name}
                {...shared}
                bucket={bucket}
                selected={selected.includes(bucket.name)}
              />
            ))}
          </Cards>
        )}
      </PageLayout>
    </BucketUsageProvider>
  );
};
export default ListBuckets;
