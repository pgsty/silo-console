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
import { useNavigate } from "react-router-dom";
import {
  AddIcon,
  Button,
  DeleteIcon,
  GroupsIcon,
  HelpBox,
  PageLayout,
  UsersIcon,
  DataTable,
  Grid,
  Select,
} from "mds";

import { OverflowMenu, SkeletonRows, StatusBadge } from "common/ui";
import { useMobile } from "common/ui/useMediaQuery";
import { FilteredEmptyState } from "common/ui/FilteredEmptyState";
import IdentityChips from "./IdentityChips";
import { filterUsers, UserStatusFilter } from "./userList";

import { User, UsersList } from "./types";
import { usersSort } from "../../../utils/sortFunctions";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import {
  addUserToGroupPermissions,
  CONSOLE_UI_RESOURCE,
  deleteUserPermissions,
  IAM_PAGES,
  IAM_SCOPES,
  listUsersPermissions,
  permissionTooltipHelper,
  S3_ALL_RESOURCES,
  viewUserPermissions,
} from "../../../common/SecureComponent/permissions";
import api from "../../../common/api";
import SearchBox from "../Common/SearchBox";
import withSuspense from "../Common/Components/withSuspense";

import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import DeleteUser from "./DeleteUser";
import { formatText, i18nKey, useLocalizedLink, useT } from "i18n";

const AddToGroup = withSuspense(React.lazy(() => import("./BulkAddToGroup")));

const ListUsers = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const localize = useLocalizedLink();
  const mobile = useMobile();

  const [records, setRecords] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("all");
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);

  const displayListUsers = hasPermission(
    CONSOLE_UI_RESOURCE,
    listUsersPermissions,
  );

  const viewUser = hasPermission(CONSOLE_UI_RESOURCE, viewUserPermissions);

  const addUserToGroup = hasPermission(
    CONSOLE_UI_RESOURCE,
    addUserToGroupPermissions,
  );

  const deleteUser = hasPermission(CONSOLE_UI_RESOURCE, deleteUserPermissions);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      setLoading(true);
      setCheckedUsers([]);
    }
  };

  const closeAddGroupBulk = (unCheckAll: boolean = false) => {
    setAddGroupOpen(false);
    if (unCheckAll) {
      setCheckedUsers([]);
    }
  };

  useEffect(() => {
    if (loading) {
      if (displayListUsers) {
        api
          .invoke("GET", `/api/v1/users`)
          .then((res: UsersList) => {
            const users = res.users === null ? [] : res.users;

            setLoading(false);
            setRecords(users.sort(usersSort));
          })
          .catch((err: ErrorResponseHandler) => {
            setLoading(false);
            dispatch(setErrorSnackMessage(err));
          });
      } else {
        setLoading(false);
      }
    }
  }, [loading, dispatch, displayListUsers]);

  const filteredRecords = filterUsers(records, filter, statusFilter);
  const canCreateUser = hasPermission(
    CONSOLE_UI_RESOURCE,
    [
      IAM_SCOPES.ADMIN_CREATE_USER,
      IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
      IAM_SCOPES.ADMIN_LIST_GROUPS,
      IAM_SCOPES.ADMIN_ATTACH_USER_OR_GROUP_POLICY,
    ],
    true,
  );

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value = "", checked = false } = {} } = e;

    let elements: string[] = [...checkedUsers]; // We clone the checkedUsers array

    if (checked) {
      // If the user has checked this field we need to push this to checkedUsersList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }

    setCheckedUsers(elements);

    return elements;
  };

  const viewAction = (selectionElement: any): void => {
    navigate(
      `${IAM_PAGES.USERS}/${encodeURIComponent(selectionElement.accessKey)}`,
    );
  };

  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
      isDisabled: () => !viewUser,
    },
  ];

  useEffect(() => {
    dispatch(setHelpName("list_users"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const boundedTable = useBoundedTable(filteredRecords.length, loading);

  return (
    <Fragment>
      <ModalPresence open={Boolean(deleteOpen)}>
        {deleteOpen && (
          <DeleteUser
            deleteOpen={deleteOpen}
            selectedUsers={checkedUsers}
            closeDeleteModalAndRefresh={(refresh: boolean) => {
              closeDeleteModalAndRefresh(refresh);
            }}
          />
        )}
      </ModalPresence>
      <ModalPresence open={addGroupOpen}>
        <AddToGroup
          open={addGroupOpen}
          checkedUsers={checkedUsers}
          closeModalAndRefresh={(close: boolean) => {
            closeAddGroupBulk(close);
          }}
        />
      </ModalPresence>
      <PageHeaderWrapper label={t("Users")} titleElement="h1" help />

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
              placeholder={t("Search Users")}
              onChange={setFilter}
              value={filter}
              sx={{
                maxWidth: mobile ? "100%" : 320,
                width: mobile ? "100%" : undefined,
              }}
            />
            <Select
              id="user-status-filter"
              name="user-status-filter"
              label={t("Status")}
              noLabelMinWidth
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as UserStatusFilter)}
              options={[
                { label: t("All"), value: "all" },
                { label: t("Enabled"), value: "enabled" },
                { label: t("Disabled"), value: "disabled" },
              ]}
              sx={{
                width: 200,
                flexGrow: 0,
                flexShrink: 0,
                gap: 8,
                marginInlineStart: mobile ? 0 : 12,
                marginInlineEnd: "auto",
              }}
            />
            {mobile ? (
              <OverflowMenu
                label={t("Actions")}
                items={[
                  {
                    label: t("Delete Selected"),
                    icon: <DeleteIcon />,
                    danger: true,
                    disabled: !deleteUser || checkedUsers.length === 0,
                    disabledReason: !deleteUser
                      ? permissionTooltipHelper(
                          deleteUserPermissions,
                          i18nKey("delete users"),
                        )
                      : t("Select Users to delete"),
                    onClick: () => {
                      if (deleteUser && checkedUsers.length)
                        setDeleteOpen(true);
                    },
                  },
                  {
                    label: t("Add to Group"),
                    icon: <GroupsIcon />,
                    disabled: !addUserToGroup || checkedUsers.length === 0,
                    disabledReason: !addUserToGroup
                      ? permissionTooltipHelper(
                          addUserToGroupPermissions,
                          i18nKey("add users to groups"),
                        )
                      : t("Select Users to group"),
                    onClick: () => {
                      if (addUserToGroup && checkedUsers.length)
                        setAddGroupOpen(true);
                    },
                  },
                ]}
              />
            ) : (
              <>
                <SecureComponent
                  resource={CONSOLE_UI_RESOURCE}
                  scopes={[IAM_SCOPES.ADMIN_DELETE_USER]}
                  matchAll
                  errorProps={{ disabled: true }}
                >
                  <TooltipWrapper
                    tooltip={
                      hasPermission("console", [IAM_SCOPES.ADMIN_DELETE_USER])
                        ? checkedUsers.length === 0
                          ? t("Select Users to delete")
                          : t("Delete Selected")
                        : permissionTooltipHelper(
                            [IAM_SCOPES.ADMIN_DELETE_USER],
                            i18nKey("delete users"),
                          )
                    }
                  >
                    <Button
                      id={"delete-selected-users"}
                      onClick={() => {
                        setDeleteOpen(true);
                      }}
                      label={t("Delete Selected")}
                      icon={<DeleteIcon />}
                      disabled={checkedUsers.length === 0}
                      variant={"danger"}
                      aria-label={t("Delete selected users")}
                    />
                  </TooltipWrapper>
                </SecureComponent>
                <SecureComponent
                  scopes={[IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP]}
                  resource={CONSOLE_UI_RESOURCE}
                  errorProps={{ disabled: true }}
                >
                  <TooltipWrapper
                    tooltip={
                      hasPermission("console", [
                        IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP,
                      ])
                        ? checkedUsers.length === 0
                          ? t("Select Users to group")
                          : t("Add to Group")
                        : permissionTooltipHelper(
                            [IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP],
                            i18nKey("add users to groups"),
                          )
                    }
                  >
                    <Button
                      id={"add-to-group"}
                      label={t("Add to Group")}
                      icon={<GroupsIcon />}
                      disabled={checkedUsers.length <= 0}
                      onClick={() => {
                        if (checkedUsers.length > 0) {
                          setAddGroupOpen(true);
                        }
                      }}
                      variant={"regular"}
                    />
                  </TooltipWrapper>
                </SecureComponent>
              </>
            )}
            <Button
              id={"create-user"}
              label={t("Create User")}
              icon={<AddIcon />}
              onClick={() => navigate(IAM_PAGES.USER_ADD)}
              disabled={
                !canCreateUser ||
                !hasPermission(
                  S3_ALL_RESOURCES,
                  [
                    IAM_SCOPES.ADMIN_CREATE_USER,
                    IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
                    IAM_SCOPES.ADMIN_LIST_GROUPS,
                  ],
                  true,
                )
              }
              disabledReason={permissionTooltipHelper(
                [
                  IAM_SCOPES.ADMIN_CREATE_USER,
                  IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
                  IAM_SCOPES.ADMIN_LIST_GROUPS,
                  IAM_SCOPES.ADMIN_ATTACH_USER_OR_GROUP_POLICY,
                ],
                i18nKey("create users"),
              )}
              variant="primary"
              collapseOnSmall={false}
            />
          </Grid>

          <Fragment>
            <Grid item xs={12} sx={{ marginBottom: 16 }}>
              <SecureComponent
                scopes={[IAM_SCOPES.ADMIN_LIST_USERS]}
                resource={CONSOLE_UI_RESOURCE}
                errorProps={{ disabled: true }}
              >
                <DataTable
                  {...boundedTable}
                  itemActions={tableActions}
                  columns={[
                    {
                      label: t("Access Key"),
                      elementKey: "accessKey",
                      priority: "high",
                    },
                    {
                      label: t("Status"),
                      elementKey: "status",
                      priority: "high",
                      width: 120,
                      renderFunction: (status: string) => (
                        <StatusBadge
                          tone={status === "enabled" ? "success" : "neutral"}
                          label={
                            status === "enabled"
                              ? t("Enabled")
                              : status === "disabled"
                                ? t("Disabled")
                                : t("Unknown")
                          }
                        />
                      ),
                    },
                    {
                      label: t("Policies"),
                      elementKey: "policy",
                      priority: "medium",
                      renderFunction: (names: string[]) => (
                        <IdentityChips names={names} />
                      ),
                    },
                    {
                      label: t("Groups"),
                      elementKey: "memberOf",
                      priority: "low",
                      renderFunction: (names: string[]) => (
                        <IdentityChips names={names} />
                      ),
                    },
                    {
                      label: t("Actions"),
                      priority: "high",
                      width: 48,
                      globalClass: "mds-row-actions",
                      renderFullObject: true,
                      renderFunction: (user: User) => (
                        <span onClick={(event) => event.stopPropagation()}>
                          <OverflowMenu
                            label={formatText(t("Actions for {name}"), {
                              name: user.accessKey,
                            })}
                            items={[
                              {
                                label: t("View"),
                                disabled: !viewUser,
                                disabledReason: permissionTooltipHelper(
                                  viewUserPermissions,
                                  i18nKey("view User details"),
                                ),
                                onClick: () => {
                                  if (viewUser) viewAction(user);
                                },
                              },
                              {
                                label: t("Edit"),
                                disabled: !viewUser,
                                disabledReason: permissionTooltipHelper(
                                  viewUserPermissions,
                                  i18nKey("view User details"),
                                ),
                                onClick: () => {
                                  if (viewUser) viewAction(user);
                                },
                              },
                            ]}
                          />
                        </span>
                      ),
                    },
                  ]}
                  onSelect={
                    addUserToGroup || deleteUser ? selectionChanged : undefined
                  }
                  onSelectAll={
                    addUserToGroup || deleteUser
                      ? () => {
                          const visible = filteredRecords.map(
                            (r) => `${r.accessKey}`,
                          );
                          const allVisible =
                            visible.length > 0 &&
                            visible.every((v) => checkedUsers.includes(v));
                          setCheckedUsers(
                            allVisible
                              ? checkedUsers.filter((v) => !visible.includes(v))
                              : Array.from(
                                  new Set([...checkedUsers, ...visible]),
                                ),
                          );
                        }
                      : undefined
                  }
                  selectedItems={checkedUsers}
                  isLoading={loading}
                  records={filteredRecords}
                  entityName={t("Users")}
                  loadingState={<SkeletonRows rows={5} columns={4} />}
                  emptyState={
                    <FilteredEmptyState
                      filtered={
                        Boolean(filter.trim()) || statusFilter !== "all"
                      }
                      onClear={() => {
                        setFilter("");
                        setStatusFilter("all");
                      }}
                      icon={<UsersIcon />}
                      title={t("No users yet")}
                      description={t(
                        "Users authenticate with an access key and secret key, and receive permissions through policies and groups.",
                      )}
                      action={
                        canCreateUser && (
                          <Button
                            id="empty-create-user"
                            variant="callAction"
                            label={t("Create user")}
                            onClick={() => navigate(IAM_PAGES.USER_ADD)}
                          />
                        )
                      }
                    />
                  }
                  idField="accessKey"
                />
              </SecureComponent>
            </Grid>
            <HelpBox
              title={t("Users")}
              iconComponent={<UsersIcon />}
              help={
                <Fragment>
                  {t(
                    "Users inherit policies from their groups. Access is denied unless explicitly granted.",
                  )}{" "}
                  <a
                    href={localize(
                      "https://silo.pgsty.com/administration/identity-access-management/minio-user-management/",
                    )}
                    target="_blank"
                    rel="noopener"
                  >
                    {t("Learn more")}
                  </a>
                </Fragment>
              }
            />
          </Fragment>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default ListUsers;
