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
import { EmptyState, SkeletonRows, StatusBadge } from "common/ui";
import { GroupsIcon } from "mds";
import { ModalPresence } from "common/ui/ModalPresence";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddIcon,
  BackLink,
  Box,
  Button,
  DataTable,
  Grid,
  IAMPoliciesIcon,
  IconButton,
  PageLayout,
  PasswordKeyIcon,
  RefreshIcon,
  ScreenTitle,
  UsersIcon,
  SectionTitle,
  Switch,
  Tabs,
  TrashIcon,
} from "mds";
import { nonEmptyNames } from "./userList";
import { IPolicyItem } from "./types";
import { ErrorResponseHandler } from "../../../common/types";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { ApiError } from "../../../api/consoleApi";
import {
  assignGroupPermissions,
  assignIAMPolicyPermissions,
  CONSOLE_UI_RESOURCE,
  deleteUserPermissions,
  disableUserPermissions,
  enableDisableUserPermissions,
  enableUserPermissions,
  getGroupPermissions,
  IAM_PAGES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../common/SecureComponent";
import { AppState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { policyDetailsSort } from "../../../utils/sortFunctions";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { api } from "../../../api";
import UserOverview from "./UserOverview";
import ChangeUserGroups from "./ChangeUserGroups";
import SetUserPolicies from "./SetUserPolicies";
import UserServiceAccountsPanel from "./UserServiceAccountsPanel";
import ChangeUserPasswordModal from "../Account/ChangeUserPasswordModal";
import DeleteUser from "./DeleteUser";
import { i18nKey, useT } from "i18n";
import { getUserServiceAccountCapabilities } from "./userServiceAccountControls";

interface IGroupItem {
  group: string;
}

const userRequestError = (
  response: unknown,
  fallback: string,
): ErrorResponseHandler => {
  const error = (response as { error?: ApiError } | null)?.error;
  return {
    errorMessage:
      typeof error?.message === "string" && error.message
        ? error.message
        : fallback,
    detailedError:
      typeof error?.detailedMessage === "string" ? error.detailedMessage : "",
  };
};

const UserDetailsContent = () => {
  const mobile = useMobile();
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const t = useT();

  const [loading, setLoading] = useState<boolean>(true);
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [statusKnown, setStatusKnown] = useState(false);
  const [currentGroups, setCurrentGroups] = useState<IGroupItem[]>([]);
  const [currentPolicies, setCurrentPolicies] = useState<IPolicyItem[]>([]);
  const [changeUserPasswordModalOpen, setChangeUserPasswordModalOpen] =
    useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [hasPolicy, setHasPolicy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  const userName = params.userName || "";
  const [revision, setRevision] = useState(0);
  const [userFailed, setUserFailed] = useState(false);
  const alive = useRef(true);
  const statusPending = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  // The session response names the account; it is empty for identity-provider
  // sessions, which must never read as a match.
  const currentAccount = useSelector(
    (state: AppState) => state.console.session.accountAccessKey || "",
  );
  const isCurrentUser = currentAccount !== "" && currentAccount === userName;
  const enableEnabled =
    hasPermission(CONSOLE_UI_RESOURCE, enableUserPermissions) &&
    !enabled &&
    !isCurrentUser;
  const disableEnabled =
    hasPermission(CONSOLE_UI_RESOURCE, disableUserPermissions) &&
    enabled &&
    !isCurrentUser;

  const changeUserPassword = () => {
    setChangeUserPasswordModalOpen(true);
  };

  const deleteUser = () => {
    setDeleteOpen(true);
  };

  const canAssignPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    assignIAMPolicyPermissions,
    true,
  );
  const canAssignGroup = hasPermission(
    CONSOLE_UI_RESOURCE,
    assignGroupPermissions,
    true,
  );

  const viewGroup = hasPermission(CONSOLE_UI_RESOURCE, getGroupPermissions);
  const canListServiceAccounts = getUserServiceAccountCapabilities((scope) =>
    hasPermission(CONSOLE_UI_RESOURCE, [scope]),
  ).canList;

  const getUserInformation = useCallback(
    () => setRevision((value) => value + 1),
    [],
  );
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setUserFailed(false);
    api.user
      .getUserInfo(userName, { signal: controller.signal })
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        setCurrentGroups(
          nonEmptyNames(data.memberOf).map((group) => ({ group })),
        );
        setCurrentPolicies(
          nonEmptyNames(data.policy)
            .map((policy) => ({ policy }))
            .sort(policyDetailsSort),
        );
        setEnabled(data.status === "enabled");
        setStatusKnown(data.status === "enabled" || data.status === "disabled");
        setHasPolicy(data.hasPolicy === true);
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setUserFailed(true);
          dispatch(
            setErrorSnackMessage(
              userRequestError(err, t("Could not load user")),
            ),
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [userName, revision, dispatch, t]);

  const saveRecord = (isEnabled: boolean) => {
    if (
      statusPending.current ||
      loading ||
      userFailed ||
      !statusKnown ||
      (isEnabled ? !enableEnabled : !disableEnabled)
    ) {
      return;
    }
    statusPending.current = true;
    setAddLoading(true);
    api.user
      .updateUserInfo(userName, {
        status: isEnabled ? "enabled" : "disabled",
      })
      .then(({ data }) => {
        if (!alive.current) return;
        setEnabled(data.status === "enabled");
        setStatusKnown(data.status === "enabled" || data.status === "disabled");
        setAddLoading(false);
      })
      .catch((err: unknown) => {
        if (!alive.current) return;
        setAddLoading(false);
        dispatch(
          setErrorSnackMessage(
            userRequestError(err, t("Could not update user status")),
          ),
        );
      })
      .finally(() => {
        statusPending.current = false;
      });
  };

  useEffect(() => {
    dispatch(setHelpName("user_details_groups"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      getUserInformation();
    }
  };

  const groupViewAction = (group: IGroupItem) => {
    navigate(`${IAM_PAGES.GROUPS}/${encodeURIComponent(group.group)}`);
  };

  const groupTableActions = [
    {
      type: "view",
      onClick: groupViewAction,
      isDisabled: () => !viewGroup,
    },
  ];

  const statusControl = (
    <>
      <StatusBadge
        tone={
          loading || userFailed || !statusKnown
            ? "neutral"
            : enabled
              ? "success"
              : "neutral"
        }
        label={
          loading || userFailed || !statusKnown
            ? t("Unknown")
            : enabled
              ? t("Enabled")
              : t("Disabled")
        }
      />
      <TooltipWrapper
        tooltip={
          isCurrentUser
            ? t("You cannot enable or disable the currently logged in User")
            : enableEnabled || disableEnabled
              ? ""
              : hasPermission(CONSOLE_UI_RESOURCE, enableUserPermissions)
                ? permissionTooltipHelper(
                    disableUserPermissions,
                    i18nKey("disable users"),
                  )
                : hasPermission(CONSOLE_UI_RESOURCE, disableUserPermissions)
                  ? permissionTooltipHelper(
                      enableUserPermissions,
                      i18nKey("enable users"),
                    )
                  : permissionTooltipHelper(
                      enableDisableUserPermissions,
                      i18nKey("enable or disable users"),
                    )
        }
      >
        <Switch
          aria-label={t("Status")}
          indicatorLabels={[t("Enabled"), t("Disabled")]}
          checked={enabled}
          value={"user_enabled"}
          id="user-status"
          name="user-status"
          onChange={() => {
            saveRecord(!enabled);
          }}
          switchOnly
          disabled={
            loading ||
            userFailed ||
            !statusKnown ||
            addLoading ||
            (!enableEnabled && !disableEnabled)
          }
        />
      </TooltipWrapper>
    </>
  );

  return (
    <Fragment>
      <ModalPresence open={Boolean(addGroupOpen)}>
        {addGroupOpen && (
          <ChangeUserGroups
            open={addGroupOpen}
            selectedUser={userName}
            closeModalAndRefresh={() => {
              setAddGroupOpen(false);
              getUserInformation();
            }}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(policyOpen)}>
        {policyOpen && (
          <SetUserPolicies
            open={policyOpen}
            selectedUser={userName}
            currentPolicies={currentPolicies}
            closeModalAndRefresh={() => {
              setPolicyOpen(false);
              getUserInformation();
            }}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(deleteOpen)}>
        {deleteOpen && (
          <DeleteUser
            deleteOpen={deleteOpen}
            selectedUsers={[userName]}
            closeDeleteModalAndRefresh={(refresh: boolean) => {
              closeDeleteModalAndRefresh(refresh);
            }}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(changeUserPasswordModalOpen)}>
        {changeUserPasswordModalOpen && (
          <ChangeUserPasswordModal
            open={changeUserPasswordModalOpen}
            userName={userName}
            closeModal={() => setChangeUserPasswordModalOpen(false)}
          />
        )}
      </ModalPresence>
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label={t("Users")}
              onClick={() => navigate(IAM_PAGES.USERS)}
            />
          </Fragment>
        }
        help
      />
      <PageLayout>
        <Grid container>
          <Grid item xs={12}>
            <ScreenTitle
              icon={null}
              title={userName}
              subTitle={""}
              actions={
                <Fragment>
                  <TooltipWrapper
                    tooltip={
                      hasPermission(CONSOLE_UI_RESOURCE, deleteUserPermissions)
                        ? isCurrentUser
                          ? t("You cannot delete the currently logged in User")
                          : t("Delete User")
                        : permissionTooltipHelper(
                            deleteUserPermissions,
                            i18nKey("delete user"),
                          )
                    }
                  >
                    <Button
                      aria-label={t("Delete user")}
                      id={"delete-user"}
                      onClick={deleteUser}
                      icon={<TrashIcon />}
                      variant={"danger"}
                      disabled={
                        !hasPermission(
                          CONSOLE_UI_RESOURCE,
                          deleteUserPermissions,
                        ) || isCurrentUser
                      }
                    />
                  </TooltipWrapper>

                  <TooltipWrapper tooltip={t("Change Password")}>
                    <Button
                      aria-label={t("Change password")}
                      id={"change-user-password"}
                      onClick={changeUserPassword}
                      icon={<PasswordKeyIcon />}
                      variant={"regular"}
                      disabled={isCurrentUser}
                    />
                  </TooltipWrapper>

                  <IconButton
                    id="refresh-user-overview"
                    label={t("Refresh")}
                    onClick={getUserInformation}
                    disabled={loading || addLoading}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Fragment>
              }
              sx={{
                marginBottom: 16,
                "&.screenTitle-container .stContainer": {
                  display: "flex",
                  flexFlow: "row wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0 0 16px",
                  borderBottom: "none",
                  gap: 16,
                },
                "& .titleColumn h1": {
                  fontSize: "var(--fs-title)",
                  lineHeight: "var(--lh-title)",
                  fontWeight: 550,
                },
                "&.screenTitle-container .rightItems": {
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "auto",
                  marginInlineStart: "auto",
                  justifyContent: "flex-end",
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Tabs
              horizontal={mobile}
              currentTabOrPath={selectedTab}
              onTabClick={setSelectedTab}
              options={[
                {
                  tabConfig: { id: "overview", label: t("Overview") },
                  content: loading ? (
                    <SkeletonRows rows={5} columns={2} />
                  ) : userFailed ? (
                    <EmptyState
                      icon={<UsersIcon />}
                      title={t("Could not load user")}
                      description={t("Refresh to try again.")}
                      action={
                        <Button
                          id="retry-user"
                          label={t("Refresh")}
                          onClick={getUserInformation}
                        />
                      }
                    />
                  ) : (
                    <UserOverview
                      user={userName}
                      policies={currentPolicies.map((item) => item.policy)}
                      groups={currentGroups.map((item) => item.group)}
                      statusControl={statusControl}
                    />
                  ),
                },
                {
                  tabConfig: {
                    id: "groups",
                    label: t("Groups"),
                    disabled: !canAssignGroup,
                  },
                  content: (
                    <Fragment>
                      <Box
                        onMouseMove={() =>
                          dispatch(setHelpName("user_details_groups"))
                        }
                      >
                        <SectionTitle
                          headingLevel={2}
                          separator
                          sx={{ marginBottom: 15 }}
                          actions={
                            <TooltipWrapper
                              tooltip={
                                canAssignGroup
                                  ? t("Assign groups")
                                  : permissionTooltipHelper(
                                      assignGroupPermissions,
                                      i18nKey("add users to groups"),
                                    )
                              }
                            >
                              <Button
                                id={"add-groups"}
                                label={t("Add to Groups")}
                                onClick={() => {
                                  setAddGroupOpen(true);
                                }}
                                icon={<AddIcon />}
                                variant={"callAction"}
                                disabled={!canAssignGroup}
                              />
                            </TooltipWrapper>
                          }
                        >
                          {t("Groups")}
                        </SectionTitle>
                      </Box>
                      <Grid
                        item
                        xs={12}
                        onMouseMove={() =>
                          dispatch(setHelpName("user_details_groups"))
                        }
                      >
                        <DataTable
                          itemActions={groupTableActions}
                          columns={[{ label: t("Name"), elementKey: "group" }]}
                          isLoading={loading}
                          records={currentGroups}
                          entityName={t("Groups")}
                          loadingState={<SkeletonRows rows={5} columns={1} />}
                          emptyState={
                            <EmptyState
                              icon={<GroupsIcon />}
                              title={t("No groups assigned")}
                              description={t(
                                "Add this user to a group to share its access policies.",
                              )}
                              action={
                                canAssignGroup && (
                                  <Button
                                    id="empty-list-action"
                                    variant="callAction"
                                    label={t("Add to Groups")}
                                    onClick={() => setAddGroupOpen(true)}
                                  />
                                )
                              }
                            />
                          }
                          idField="group"
                        />
                      </Grid>
                    </Fragment>
                  ),
                },
                {
                  tabConfig: {
                    id: "service_accounts",
                    label: t("Service Accounts"),
                    disabled: !canListServiceAccounts,
                  },
                  content: (
                    <UserServiceAccountsPanel
                      user={userName}
                      hasPolicy={hasPolicy}
                    />
                  ),
                },
                {
                  tabConfig: {
                    id: "policies",
                    label: t("Policies"),
                    disabled: !canAssignPolicy,
                  },
                  content: (
                    <Fragment>
                      <Box
                        onMouseMove={() =>
                          dispatch(setHelpName("user_details_policies"))
                        }
                      >
                        <SectionTitle
                          headingLevel={2}
                          separator
                          sx={{ marginBottom: 15 }}
                          actions={
                            <TooltipWrapper
                              tooltip={
                                canAssignPolicy
                                  ? t("Assign Policies")
                                  : permissionTooltipHelper(
                                      assignIAMPolicyPermissions,
                                      i18nKey("assign policies"),
                                    )
                              }
                            >
                              <Button
                                id={"assign-policies"}
                                label={t("Assign Policies")}
                                onClick={() => {
                                  setPolicyOpen(true);
                                }}
                                icon={<IAMPoliciesIcon />}
                                variant={"callAction"}
                                disabled={!canAssignPolicy}
                              />
                            </TooltipWrapper>
                          }
                        >
                          {t("Policies")}
                        </SectionTitle>
                      </Box>
                      <Box>
                        <DataTable
                          itemActions={[
                            {
                              type: "view",
                              onClick: (policy: IPolicyItem) => {
                                navigate(
                                  `${IAM_PAGES.POLICIES}/${encodeURIComponent(
                                    policy.policy,
                                  )}`,
                                );
                              },
                            },
                          ]}
                          columns={[{ label: t("Name"), elementKey: "policy" }]}
                          isLoading={loading}
                          records={currentPolicies}
                          entityName={t("Policies")}
                          loadingState={<SkeletonRows rows={5} columns={1} />}
                          emptyState={
                            <EmptyState
                              icon={<IAMPoliciesIcon />}
                              title={t("No policies assigned")}
                              description={t(
                                "Policies define which actions and resources this user can access.",
                              )}
                              action={
                                canAssignPolicy && (
                                  <Button
                                    id="empty-list-action"
                                    variant="callAction"
                                    label={t("Assign Policies")}
                                    onClick={() => setPolicyOpen(true)}
                                  />
                                )
                              }
                            />
                          }
                          idField="policy"
                        />
                      </Box>
                    </Fragment>
                  ),
                },
              ]}
            />
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

const UserDetails = () => {
  const { userName } = useParams();
  return <UserDetailsContent key={userName} />;
};
export default UserDetails;
