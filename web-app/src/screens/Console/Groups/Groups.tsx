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

import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddIcon,
  Button,
  DeleteIcon,
  GroupsIcon,
  HelpBox,
  IAMPoliciesIcon,
  PageLayout,
  UsersIcon,
  DataTable,
  Grid,
  Box,
  ProgressBar,
  ActionLink,
} from "mds";

import { api } from "api";
import { stringSort } from "../../../utils/sortFunctions";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import {
  applyPolicyPermissions,
  CONSOLE_UI_RESOURCE,
  createGroupPermissions,
  deleteGroupPermissions,
  displayGroupsPermissions,
  getGroupPermissions,
  IAM_PAGES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import { errorToHandler } from "../../../api/errors";
import withSuspense from "../Common/Components/withSuspense";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import SearchBox from "../Common/SearchBox";
import { interpolate, useLocalizedLink, useT } from "i18n";

const DeleteGroup = withSuspense(React.lazy(() => import("./DeleteGroup")));
const SetPolicy = withSuspense(
  React.lazy(() => import("../Policies/SetPolicy")),
);

const Groups = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const localize = useLocalizedLink();

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [checkedGroups, setCheckedGroups] = useState<string[]>([]);

  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    dispatch(setHelpName("groups"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayGroups = hasPermission(
    CONSOLE_UI_RESOURCE,
    displayGroupsPermissions,
  );

  const deleteGroup = hasPermission(
    CONSOLE_UI_RESOURCE,
    deleteGroupPermissions,
  );

  const getGroup = hasPermission(CONSOLE_UI_RESOURCE, getGroupPermissions);

  const applyPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    applyPolicyPermissions,
    true,
  );

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value = "", checked = false } = {} } = e;

    let elements: string[] = [...checkedGroups]; // We clone the checkedUsers array

    if (checked) {
      // If the user has checked this field we need to push this to checkedUsersList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }

    setCheckedGroups(elements);

    return elements;
  };

  useEffect(() => {
    if (loading) {
      if (displayGroups) {
        const fetchRecords = () => {
          api.groups
            .listGroups()
            .then((res) => {
              let resGroups: string[] = [];
              if (res.data.groups) {
                resGroups = res.data.groups.sort(stringSort);
              }
              setRecords(resGroups);
              isLoading(false);
            })
            .catch((err) => {
              dispatch(setErrorSnackMessage(errorToHandler(err.error)));
              isLoading(false);
            });
        };
        fetchRecords();
      } else {
        isLoading(false);
      }
    }
  }, [loading, dispatch, displayGroups]);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    setCheckedGroups([]);
    if (refresh) {
      isLoading(true);
    }
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.includes(filter),
  );

  const viewAction = (group: any) => {
    navigate(`${IAM_PAGES.GROUPS}/${encodeURIComponent(group)}`);
  };

  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
      isDisabled: () => !getGroup,
    },
    {
      type: "edit",
      onClick: viewAction,
      isDisabled: () => !getGroup,
    },
  ];

  return (
    <Fragment>
      {deleteOpen && (
        <DeleteGroup
          deleteOpen={deleteOpen}
          selectedGroups={checkedGroups}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      {policyOpen && (
        <SetPolicy
          open={policyOpen}
          selectedGroups={checkedGroups}
          selectedUser={null}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
          }}
        />
      )}
      <PageHeaderWrapper label={t("Groups")} actions={<HelpMenu />} />

      <PageLayout>
        <Grid container>
          <Grid item xs={12} sx={actionsTray.actionsTray}>
            <SecureComponent
              resource={CONSOLE_UI_RESOURCE}
              scopes={displayGroupsPermissions}
              errorProps={{ disabled: true }}
            >
              <SearchBox
                placeholder={t("Search Groups")}
                onChange={setFilter}
                value={filter}
                sx={{ maxWidth: 380 }}
              />
            </SecureComponent>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <SecureComponent
                resource={CONSOLE_UI_RESOURCE}
                scopes={applyPolicyPermissions}
                matchAll
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper
                  tooltip={
                    checkedGroups.length < 1
                      ? t(
                          "Please select Groups on which you want to apply Policies",
                        )
                      : applyPolicy
                        ? t("Select Policy")
                        : permissionTooltipHelper(
                            applyPolicyPermissions,
                            "apply policies to Groups",
                          )
                  }
                >
                  <Button
                    id={"assign-policy"}
                    onClick={() => {
                      setPolicyOpen(true);
                    }}
                    label={t("Assign Policy")}
                    icon={<IAMPoliciesIcon />}
                    disabled={checkedGroups.length < 1 || !applyPolicy}
                    variant={"regular"}
                  />
                </TooltipWrapper>
              </SecureComponent>
              <SecureComponent
                resource={CONSOLE_UI_RESOURCE}
                scopes={deleteGroupPermissions}
                matchAll
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper
                  tooltip={
                    checkedGroups.length === 0
                      ? t("Select Groups to delete")
                      : getGroup
                        ? t("Delete Selected")
                        : permissionTooltipHelper(
                            getGroupPermissions,
                            "delete Groups",
                          )
                  }
                >
                  <Button
                    id="delete-selected-groups"
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                    label={t("Delete Selected")}
                    icon={<DeleteIcon />}
                    variant="secondary"
                    disabled={checkedGroups.length === 0 || !getGroup}
                  />
                </TooltipWrapper>
              </SecureComponent>
              <SecureComponent
                resource={CONSOLE_UI_RESOURCE}
                scopes={createGroupPermissions}
                matchAll
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper tooltip={t("Create Group")}>
                  <Button
                    id={"create-group"}
                    label={t("Create Group")}
                    variant="callAction"
                    icon={<AddIcon />}
                    onClick={() => {
                      navigate(`${IAM_PAGES.GROUPS_ADD}`);
                    }}
                  />
                </TooltipWrapper>
              </SecureComponent>
            </Box>
          </Grid>
          {loading && <ProgressBar />}
          {!loading && (
            <Fragment>
              {records.length > 0 && (
                <Fragment>
                  <Grid item xs={12} sx={{ marginBottom: 15 }}>
                    <SecureComponent
                      resource={CONSOLE_UI_RESOURCE}
                      scopes={displayGroupsPermissions}
                      errorProps={{ disabled: true }}
                    >
                      <DataTable
                        itemActions={tableActions}
                        columns={[{ label: t("Name") }]}
                        isLoading={loading}
                        selectedItems={checkedGroups}
                        onSelect={
                          deleteGroup || getGroup ? selectionChanged : undefined
                        }
                        onSelectAll={
                          deleteGroup || getGroup
                            ? () => {
                                const allVisible =
                                  filteredRecords.length > 0 &&
                                  filteredRecords.every((g) =>
                                    checkedGroups.includes(g),
                                  );
                                setCheckedGroups(
                                  allVisible
                                    ? checkedGroups.filter(
                                        (g) => !filteredRecords.includes(g),
                                      )
                                    : Array.from(
                                        new Set([
                                          ...checkedGroups,
                                          ...filteredRecords,
                                        ]),
                                      ),
                                );
                              }
                            : undefined
                        }
                        records={filteredRecords}
                        entityName={t("Groups")}
                        customEmptyMessage={t("There are no Groups yet.")}
                        idField=""
                      />
                    </SecureComponent>
                  </Grid>
                  <Grid item xs={12}>
                    <HelpBox
                      title={t("Groups")}
                      iconComponent={<GroupsIcon />}
                      help={
                        <Fragment>
                          {t(
                            "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.",
                          )}
                          <br />
                          <br />
                          {interpolate(t("You can learn more at the {link}."), {
                            link: (
                              <a
                                href={localize(
                                  "https://silo.pgsty.com/administration/identity-access-management/minio-group-management/",
                                )}
                                target="_blank"
                                rel="noopener"
                              >
                                {t("documentation")}
                              </a>
                            ),
                          })}
                        </Fragment>
                      }
                    />
                  </Grid>
                </Fragment>
              )}
              {records.length === 0 && (
                <Grid container>
                  <Grid item xs={8}>
                    <HelpBox
                      title={t("Groups")}
                      iconComponent={<UsersIcon />}
                      help={
                        <Fragment>
                          {t(
                            "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.",
                          )}
                          <SecureComponent
                            resource={CONSOLE_UI_RESOURCE}
                            scopes={createGroupPermissions}
                            matchAll
                          >
                            <br />
                            <br />
                            {interpolate(t("To get started, {link}."), {
                              link: (
                                <ActionLink
                                  onClick={() => {
                                    navigate(`${IAM_PAGES.GROUPS_ADD}`);
                                  }}
                                >
                                  {t("Create a Group")}
                                </ActionLink>
                              ),
                            })}
                          </SecureComponent>
                        </Fragment>
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </Fragment>
          )}
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default Groups;
