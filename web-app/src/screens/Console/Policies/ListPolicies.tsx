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

import { useBoundedTable } from "common/ui/useBoundedTable";
import { ModalPresence } from "common/ui/ModalPresence";
import React, { Fragment, useEffect, useState } from "react";
import {
  AddIcon,
  Button,
  DataTable,
  Grid,
  HelpBox,
  IAMPoliciesIcon,
  PageLayout,
  RefreshIcon,
  IconButton,
  Select,
} from "mds";
import { Link, useNavigate } from "react-router-dom";
import { OverflowMenu, SkeletonRows } from "common/ui";
import { useMobile } from "common/ui/useMediaQuery";
import { FilteredEmptyState } from "common/ui/FilteredEmptyState";
import { PolicyTypeBadge } from "./PolicyTypeBadge";
import {
  attachmentCount,
  policyAction,
  visiblePolicies,
  PolicyFilter,
  PolicySort,
} from "./policyPresentation";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import {
  CONSOLE_UI_RESOURCE,
  createPolicyPermissions,
  deletePolicyPermissions,
  IAM_PAGES,
  IAM_SCOPES,
  listPolicyPermissions,
  permissionTooltipHelper,
  viewPolicyPermissions,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import { Policy } from "../../../api/consoleApi";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { api } from "../../../api";
import SearchBox from "../Common/SearchBox";
import withSuspense from "../Common/Components/withSuspense";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { formatText, i18nKey, useLocalizedLink, useT } from "i18n";

const DeletePolicy = withSuspense(React.lazy(() => import("./DeletePolicy")));

const attachmentCountDisplay = (count: number | null | undefined) =>
  attachmentCount(count) ?? "—";

const ListPolicies = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const localize = useLocalizedLink();
  const mobile = useMobile();

  const [records, setRecords] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [revision, setRevision] = useState(0);
  const [typeFilter, setTypeFilter] = useState<PolicyFilter>("all");
  const [sort, setSort] = useState<{
    field: PolicySort;
    direction: "ASC" | "DESC";
  }>({ field: "name", direction: "ASC" });
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [filterPolicies, setFilterPolicies] = useState<string>("");
  const viewPolicy = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_POLICY,
  ]);

  const canDeletePolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    deletePolicyPermissions,
  );

  const canDisplayPolicies = hasPermission(
    CONSOLE_UI_RESOURCE,
    listPolicyPermissions,
  );

  const canCreatePolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    createPolicyPermissions,
  );

  const canViewPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    viewPolicyPermissions,
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    if (!canDisplayPolicies) {
      setLoading(false);
      return;
    }
    api.policies
      .listPolicies(undefined, { signal: controller.signal })
      .then((res) => {
        if (!controller.signal.aborted) setRecords(res.data.policies ?? []);
      })
      .catch((err: ErrorResponseHandler) => {
        if (!controller.signal.aborted) {
          setFailed(true);
          dispatch(setErrorSnackMessage(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision, dispatch, canDisplayPolicies]);

  const fetchRecords = () => setRevision((value) => value + 1);
  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) fetchRecords();
  };
  const filteredRecords = visiblePolicies(
    records,
    filterPolicies,
    typeFilter,
    sort.field,
    sort.direction,
  );

  useEffect(() => {
    dispatch(setHelpName("list_policies"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const boundedTable = useBoundedTable(
    failed ? 0 : filteredRecords.length,
    loading,
  );

  return (
    <Fragment>
      <ModalPresence open={deleteOpen}>
        {selectedPolicy && (
          <DeletePolicy
            deleteOpen={deleteOpen}
            policy={selectedPolicy}
            closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
          />
        )}
      </ModalPresence>
      <PageHeaderWrapper label={t("IAM Policies")} titleElement="h1" help />

      <PageLayout>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              ...actionsTray.actionsTray,
              justifyContent: "flex-start",
              gap: 12,
              "& button": { marginInlineStart: 0 },
            }}
          >
            <SearchBox
              onChange={setFilterPolicies}
              placeholder={t("Search Policies")}
              value={filterPolicies}
              sx={{
                maxWidth: mobile ? "100%" : 380,
                width: mobile ? "100%" : undefined,
              }}
            />

            <Select
              id="policy-type-filter"
              label={t("Type")}
              noLabelMinWidth
              sx={{
                maxWidth: 220,
                flexGrow: 0,
                gap: 8,
                marginInlineEnd: "auto",
              }}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as PolicyFilter)}
              options={[
                { label: t("All"), value: "all" },
                { label: t("Built-in"), value: "builtin" },
                { label: t("Custom"), value: "custom" },
              ]}
            />
            <IconButton
              id="refresh-policies"
              aria-label={t("Refresh")}
              size="medium"
              disabled={loading}
              onClick={fetchRecords}
            >
              <RefreshIcon />
            </IconButton>
            <Button
              id={"create-policy"}
              label={t("Create Policy")}
              icon={<AddIcon />}
              disabled={
                !canCreatePolicy ||
                !hasPermission(CONSOLE_UI_RESOURCE, [
                  IAM_SCOPES.ADMIN_CREATE_POLICY,
                ])
              }
              disabledReason={permissionTooltipHelper(
                createPolicyPermissions,
                i18nKey("create a Policy"),
              )}
              onClick={() => navigate(IAM_PAGES.POLICY_ADD)}
              variant="primary"
              collapseOnSmall={false}
            />
          </Grid>
          <Grid item xs={12}>
            <SecureComponent
              scopes={[IAM_SCOPES.ADMIN_LIST_USER_POLICIES]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper
                tooltip={
                  canViewPolicy
                    ? ""
                    : permissionTooltipHelper(
                        viewPolicyPermissions,
                        i18nKey("view Policy details"),
                      )
                }
              >
                <DataTable
                  {...boundedTable}
                  sx={{
                    ...boundedTable.sx,
                    "& .text-right .sortHeader": {
                      justifyContent: "flex-end",
                    },
                  }}
                  columns={[
                    {
                      label: t("Name"),
                      elementKey: "name",
                      enableSort: true,
                      priority: "high",
                      renderFullObject: true,
                      renderFunction: (policy: Policy) =>
                        viewPolicy ? (
                          <Link
                            to={`${IAM_PAGES.POLICIES}/${encodeURIComponent(policy.name || "")}`}
                          >
                            {policy.name}
                          </Link>
                        ) : (
                          policy.name
                        ),
                    },
                    {
                      label: t("Type"),
                      priority: "high",
                      width: 160,
                      renderFullObject: true,
                      renderFunction: (policy: Policy) => (
                        <PolicyTypeBadge policy={policy} />
                      ),
                    },
                    {
                      label: t("Users"),
                      elementKey: "userCount",
                      enableSort: true,
                      priority: "medium",
                      headerTextAlign: "right",
                      contentTextAlign: "right",
                      renderFunction: attachmentCountDisplay,
                    },
                    {
                      label: t("Groups"),
                      elementKey: "groupCount",
                      enableSort: true,
                      priority: "medium",
                      headerTextAlign: "right",
                      contentTextAlign: "right",
                      renderFunction: attachmentCountDisplay,
                    },
                    {
                      label: t("Actions"),
                      priority: "high",
                      width: 48,
                      globalClass: "mds-row-actions",
                      renderFullObject: true,
                      renderFunction: (policy: Policy) => {
                        const action = policyAction(policy, canDeletePolicy);
                        return (
                          <span onClick={(event) => event.stopPropagation()}>
                            <OverflowMenu
                              label={formatText(t("Actions for {name}"), {
                                name: policy.name || "",
                              })}
                              items={[
                                {
                                  label: t("View"),
                                  disabled: !viewPolicy,
                                  disabledReason: permissionTooltipHelper(
                                    viewPolicyPermissions,
                                    i18nKey("view Policy details"),
                                  ),
                                  onClick: () =>
                                    navigate(
                                      `${IAM_PAGES.POLICIES}/${encodeURIComponent(policy.name || "")}`,
                                    ),
                                },
                                ...(action
                                  ? [
                                      {
                                        label:
                                          action === "reset"
                                            ? t("Reset to default")
                                            : t("Delete"),
                                        danger: true,
                                        onClick: () => {
                                          setSelectedPolicy(policy);
                                          setDeleteOpen(true);
                                        },
                                      },
                                    ]
                                  : []),
                              ]}
                            />
                          </span>
                        );
                      },
                    },
                  ]}
                  sortConfig={sort}
                  onSortChange={(field, direction) =>
                    setSort({ field: field as PolicySort, direction })
                  }
                  loadingState={<SkeletonRows rows={5} columns={5} />}
                  emptyState={
                    <FilteredEmptyState
                      filtered={
                        !failed &&
                        (!!filterPolicies.trim() || typeFilter !== "all")
                      }
                      onClear={() => {
                        setFilterPolicies("");
                        setTypeFilter("all");
                      }}
                      icon={<IAMPoliciesIcon />}
                      title={
                        failed
                          ? t("Could not load policies")
                          : t("There are no Policies yet.")
                      }
                      description={
                        failed
                          ? t("Refresh to try again.")
                          : t(
                              "Create a policy to define permissions for users and groups.",
                            )
                      }
                      action={
                        failed ? (
                          <Button
                            id="retry-policies"
                            label={t("Refresh")}
                            onClick={fetchRecords}
                          />
                        ) : (
                          canCreatePolicy && (
                            <Button
                              id="empty-create-policy"
                              label={t("Create Policy")}
                              onClick={() => navigate(IAM_PAGES.POLICY_ADD)}
                            />
                          )
                        )
                      }
                    />
                  }
                  isLoading={loading}
                  records={failed ? [] : filteredRecords}
                  entityName={t("Policies")}
                  idField="name"
                />
              </TooltipWrapper>
            </SecureComponent>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 16 }}>
            <HelpBox
              title={t("IAM policies")}
              iconComponent={<IAMPoliciesIcon />}
              help={
                <Fragment>
                  {t(
                    "Policies define allowed actions and resources for users and groups.",
                  )}{" "}
                  <a
                    href={localize(
                      "https://silo.pgsty.com/administration/identity-access-management/policy-based-access-control/",
                    )}
                    target="_blank"
                    rel="noopener"
                  >
                    {t("Learn more")}
                  </a>
                </Fragment>
              }
            />
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default ListPolicies;
