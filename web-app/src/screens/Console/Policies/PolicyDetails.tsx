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
import { ModalPresence } from "common/ui/ModalPresence";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { IAMPolicy, IAMStatement } from "./types";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  BackLink,
  Box,
  Button,
  DataTable,
  Grid,
  IconButton,
  PageLayout,
  ProgressBar,
  RefreshIcon,
  ScreenTitle,
  SectionTitle,
  Tabs,
  TrashIcon,
  HelpTip,
} from "mds";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";

import { ErrorResponseHandler } from "../../../common/types";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";

import {
  CONSOLE_UI_RESOURCE,
  createPolicyPermissions,
  deletePolicyPermissions,
  getGroupPermissions,
  IAM_PAGES,
  IAM_SCOPES,
  listGroupPermissions,
  listUsersPermissions,
  permissionTooltipHelper,
  viewPolicyPermissions,
  viewUserPermissions,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";

import withSuspense from "../Common/Components/withSuspense";

import PolicyView from "./PolicyView";
import {
  setErrorSnackMessage,
  setHelpName,
  setSnackBarMessage,
} from "../../../systemSlice";
import { selFeatures } from "../consoleSlice";
import { useAppDispatch } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { ApiError, Policy } from "../../../api/consoleApi";
import { api } from "../../../api";
import SearchBox from "../Common/SearchBox";
import { i18nKey, useLocalizedLink, useT } from "i18n";
import { PolicyTypeBadge } from "./PolicyTypeBadge";
import { policyKind, policyAction } from "./policyPresentation";

const DeletePolicy = withSuspense(React.lazy(() => import("./DeletePolicy")));

const policyRequestError = (
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

const PolicyDetailsContent = () => {
  const mobile = useMobile();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const t = useT();
  const localize = useLocalizedLink();
  const errorTranslator = useRef(t);
  useEffect(() => {
    errorTranslator.current = t;
  }, [t]);

  const features = useSelector(selFeatures);

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [policyStatements, setPolicyStatements] = useState<IAMStatement[]>([]);
  const [userList, setUserList] = useState<string[]>([]);
  const [groupList, setGroupList] = useState<string[]>([]);
  const [addLoading, setAddLoading] = useState<boolean>(false);

  const policyName = params.policyName || "";

  const [policyDefinition, setPolicyDefinition] = useState<string>("");
  const [loadingPolicy, setLoadingPolicy] = useState<boolean>(true);
  const [filterUsers, setFilterUsers] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [filterGroups, setFilterGroups] = useState<string>("");
  const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("summary");
  const [override, setOverride] = useState(false);
  const [revision, setRevision] = useState(0);
  const [policyFailed, setPolicyFailed] = useState(false);
  const alive = useRef(true);
  const submitting = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const ldapIsEnabled = (features && features.includes("ldap-idp")) || false;

  const displayGroups = hasPermission(
    CONSOLE_UI_RESOURCE,
    listGroupPermissions,
    true,
  );

  const viewGroup = hasPermission(
    CONSOLE_UI_RESOURCE,
    getGroupPermissions,
    true,
  );

  const displayUsers = hasPermission(
    CONSOLE_UI_RESOURCE,
    listUsersPermissions,
    true,
  );

  const viewUser = hasPermission(
    CONSOLE_UI_RESOURCE,
    viewUserPermissions,
    true,
  );

  const displayPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    viewPolicyPermissions,
    true,
  );

  const canDeletePolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    deletePolicyPermissions,
    true,
  );

  const canEditPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    createPolicyPermissions,
    true,
  );

  const kind = policy ? policyKind(policy) : "unknown";
  const writable =
    canEditPolicy &&
    !loadingPolicy &&
    (kind === "custom" ||
      kind === "modified" ||
      (kind === "builtin" && override));
  const destructiveAction = policy
    ? policyAction(policy, canDeletePolicy)
    : null;
  const refreshPolicyDetails = () => {
    setOverride(false);
    setRevision((value) => value + 1);
  };
  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !writable ||
      submitting.current ||
      addLoading ||
      deleteOpen ||
      !policyName.trim()
    )
      return;
    submitting.current = true;
    setAddLoading(true);
    api.policies
      .addPolicy({ name: policyName, policy: policyDefinition })
      .then(() => {
        if (!alive.current) return;
        dispatch(setSnackBarMessage(t("Policy successfully updated")));
        refreshPolicyDetails();
      })
      .catch((err) => {
        if (!alive.current) return;
        dispatch(
          setErrorSnackMessage({
            errorMessage: t("There was an error updating the Policy "),
            detailedError: t(
              "There was an error updating the Policy: {details}. Please check Policy syntax.",
            ).replace("{details}", () => err.error?.detailedMessage || ""),
          }),
        );
      })
      .finally(() => {
        submitting.current = false;
        if (alive.current) setAddLoading(false);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const active = () => !controller.signal.aborted;
    setOverride(false);
    setLoadingPolicy(displayPolicy);
    setPolicyFailed(false);
    setLoadingUsers(displayUsers && !ldapIsEnabled);
    setLoadingGroups(displayGroups && !ldapIsEnabled);
    if (displayPolicy)
      api.policy
        .policyInfo(policyName, { signal: controller.signal })
        .then(({ data }) => {
          if (!active()) return;
          const parsed: IAMPolicy = JSON.parse(data.policy || "{}");
          setPolicy(data);
          setPolicyDefinition(JSON.stringify(parsed, null, 4));
          setPolicyStatements(parsed.Statement || []);
        })
        .catch((err: unknown) => {
          if (active()) {
            setPolicyFailed(true);
            setPolicy(null);
            setPolicyDefinition("");
            setPolicyStatements([]);
            dispatch(
              setErrorSnackMessage(
                policyRequestError(
                  err,
                  errorTranslator.current(i18nKey("Could not load policy")),
                ),
              ),
            );
          }
        })
        .finally(() => {
          if (active()) setLoadingPolicy(false);
        });
    if (displayUsers && !ldapIsEnabled)
      api.policies
        .listUsersForPolicy(policyName, { signal: controller.signal })
        .then(({ data }) => {
          if (active()) setUserList(data ?? []);
        })
        .catch((err: unknown) => {
          if (active())
            dispatch(
              setErrorSnackMessage(
                policyRequestError(
                  err,
                  errorTranslator.current(
                    i18nKey("Could not load users for this policy"),
                  ),
                ),
              ),
            );
        })
        .finally(() => {
          if (active()) setLoadingUsers(false);
        });
    if (displayGroups && !ldapIsEnabled)
      api.policies
        .listGroupsForPolicy(policyName, { signal: controller.signal })
        .then(({ data }) => {
          if (active()) setGroupList(data ?? []);
        })
        .catch((err: unknown) => {
          if (active())
            dispatch(
              setErrorSnackMessage(
                policyRequestError(
                  err,
                  errorTranslator.current(
                    i18nKey("Could not load groups for this policy"),
                  ),
                ),
              ),
            );
        })
        .finally(() => {
          if (active()) setLoadingGroups(false);
        });
    return () => controller.abort();
  }, [
    policyName,
    revision,
    displayUsers,
    displayGroups,
    displayPolicy,
    ldapIsEnabled,
    dispatch,
  ]);

  const validSave = policyName.trim() !== "" && writable && !policyFailed;
  const deletePolicy = () => {
    if (destructiveAction && !addLoading && !submitting.current)
      setDeleteOpen(true);
  };
  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      if (destructiveAction === "delete") navigate(IAM_PAGES.POLICIES);
      else refreshPolicyDetails();
    }
  };

  const userViewAction = (user: string) => {
    navigate(`${IAM_PAGES.USERS}/${encodeURIComponent(user)}`);
  };
  const userTableActions = [
    {
      type: "view",
      onClick: userViewAction,
      isDisabled: () => !viewUser,
    },
  ];

  const filteredUsers = userList.filter((elementItem) =>
    elementItem.includes(filterUsers),
  );

  const groupViewAction = (group: string) => {
    navigate(`${IAM_PAGES.GROUPS}/${encodeURIComponent(group)}`);
  };

  const groupTableActions = [
    {
      type: "view",
      onClick: groupViewAction,
      isDisabled: () => !viewGroup,
    },
  ];

  const filteredGroups = groupList.filter((elementItem) =>
    elementItem.includes(filterGroups),
  );

  useEffect(() => {
    dispatch(setHelpName("policy_details_summary"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <ModalPresence open={deleteOpen}>
        {policy && (
          <DeletePolicy
            deleteOpen={deleteOpen}
            policy={policy}
            closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
          />
        )}
      </ModalPresence>
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label={t("Policy")}
              onClick={() => navigate(IAM_PAGES.POLICIES)}
            />
          </Fragment>
        }
        help
      />
      <PageLayout>
        <ScreenTitle
          icon={null}
          title={policyName}
          subTitle={
            <Fragment>
              {t("IAM Policy")} {policy && <PolicyTypeBadge policy={policy} />}
            </Fragment>
          }
          actions={
            <Fragment>
              {destructiveAction && (
                <SecureComponent
                  scopes={[IAM_SCOPES.ADMIN_DELETE_POLICY]}
                  resource={CONSOLE_UI_RESOURCE}
                  errorProps={{ disabled: true }}
                >
                  <TooltipWrapper
                    tooltip={
                      canDeletePolicy
                        ? ""
                        : permissionTooltipHelper(
                            deletePolicyPermissions,
                            i18nKey("delete Policies"),
                          )
                    }
                  >
                    <Button
                      id={"delete-policy"}
                      label={
                        destructiveAction === "reset"
                          ? t("Reset to default")
                          : t("Delete Policy")
                      }
                      variant="danger"
                      icon={<TrashIcon />}
                      onClick={deletePolicy}
                      disabled={!canDeletePolicy || addLoading}
                    />
                  </TooltipWrapper>
                </SecureComponent>
              )}

              <IconButton
                id={"refresh-policy"}
                label={t("Refresh")}
                onClick={refreshPolicyDetails}
                disabled={loadingPolicy || addLoading}
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
        {policyFailed && (
          <p role="alert">
            {t("Could not load policy. Refresh to try again.")}
          </p>
        )}
        {!policyFailed && (
          <Box>
            <Tabs
              horizontal={mobile}
              options={[
                {
                  tabConfig: {
                    label: t("Summary"),
                    disabled: !displayPolicy,
                    id: "summary",
                  },
                  content: (
                    <Fragment>
                      <Grid
                        onMouseMove={() =>
                          dispatch(setHelpName("policy_details_summary"))
                        }
                      >
                        <SectionTitle
                          headingLevel={2}
                          separator
                          sx={{ marginBottom: 15 }}
                        >
                          {t("Policy Summary")}
                        </SectionTitle>
                        <Box withBorders>
                          <PolicyView policyStatements={policyStatements} />
                        </Box>
                      </Grid>
                    </Fragment>
                  ),
                },
                {
                  tabConfig: {
                    label: t("Users"),
                    disabled: !displayUsers || ldapIsEnabled,
                    id: "users",
                  },
                  content: (
                    <Fragment>
                      <Grid
                        onMouseMove={() =>
                          dispatch(setHelpName("policy_details_users"))
                        }
                      >
                        <SectionTitle
                          headingLevel={2}
                          separator
                          sx={{ marginBottom: 15 }}
                        >
                          {t("Users")}
                        </SectionTitle>
                        <Grid container>
                          {userList.length > 0 && (
                            <Grid
                              item
                              xs={12}
                              sx={{
                                ...actionsTray.actionsTray,
                                marginBottom: 15,
                              }}
                            >
                              <SearchBox
                                value={filterUsers}
                                placeholder={t("Search Users")}
                                id="search-resource"
                                onChange={(val) => {
                                  setFilterUsers(val);
                                }}
                              />
                            </Grid>
                          )}
                          <DataTable
                            itemActions={userTableActions}
                            columns={[{ label: t("Name"), elementKey: "name" }]}
                            isLoading={loadingUsers}
                            records={filteredUsers}
                            entityName={t("Users with this Policy associated")}
                            customEmptyMessage={t(
                              "There are no Users with this Policy associated yet.",
                            )}
                            idField="name"
                            customPaperHeight={"500px"}
                          />
                        </Grid>
                      </Grid>
                    </Fragment>
                  ),
                },
                {
                  tabConfig: {
                    label: t("Groups"),
                    disabled: !displayGroups || ldapIsEnabled,
                    id: "groups",
                  },
                  content: (
                    <Fragment>
                      <Grid
                        onMouseMove={() =>
                          dispatch(setHelpName("policy_details_groups"))
                        }
                      >
                        <SectionTitle
                          headingLevel={2}
                          separator
                          sx={{ marginBottom: 15 }}
                        >
                          {t("Groups")}
                        </SectionTitle>
                        <Grid container>
                          {groupList.length > 0 && (
                            <Grid
                              item
                              xs={12}
                              sx={{
                                ...actionsTray.actionsTray,
                                marginBottom: 15,
                              }}
                            >
                              <SearchBox
                                value={filterGroups}
                                placeholder={t("Search Groups")}
                                id="search-resource"
                                onChange={(val) => {
                                  setFilterGroups(val);
                                }}
                              />
                            </Grid>
                          )}
                          <DataTable
                            itemActions={groupTableActions}
                            columns={[{ label: t("Name"), elementKey: "name" }]}
                            isLoading={loadingGroups}
                            records={filteredGroups}
                            entityName={t("Groups with this Policy associated")}
                            customEmptyMessage={t(
                              "There are no Groups with this Policy associated yet.",
                            )}
                            idField="name"
                            customPaperHeight={"500px"}
                          />
                        </Grid>
                      </Grid>
                    </Fragment>
                  ),
                },
                {
                  tabConfig: {
                    label: t("Raw Policy"),
                    disabled: !displayPolicy,
                    id: "raw-policy",
                  },
                  content: (
                    <Fragment>
                      <Grid
                        onMouseMove={() =>
                          dispatch(setHelpName("policy_details_policy"))
                        }
                      >
                        <HelpTip
                          content={
                            <Fragment>
                              <a
                                target="blank"
                                href={localize(
                                  "https://silo.pgsty.com/administration/identity-access-management/policy-based-access-control/#policy-document-structure",
                                )}
                              >
                                {t("Guide to access policy structure")}
                              </a>
                            </Fragment>
                          }
                          placement="right"
                        >
                          <SectionTitle headingLevel={2}>
                            <label htmlFor="code_wrapper">
                              {t("Raw Policy")}
                            </label>
                          </SectionTitle>
                        </HelpTip>
                        {kind === "builtin" && (
                          <Box
                            sx={{
                              padding: 16,
                              background: "var(--hover)",
                              borderRadius: 8,
                              marginBottom: 16,
                            }}
                          >
                            <p>
                              {t(
                                "Built-in policies can be overridden by saving a modified version; you can reset it later.",
                              )}
                            </p>
                            {!override ? (
                              <Button
                                id="override-policy"
                                label={t("Override policy")}
                                variant="regular"
                                disabled={!canEditPolicy || loadingPolicy}
                                onClick={() => setOverride(true)}
                              />
                            ) : (
                              <Button
                                id="cancel-policy-override"
                                label={t("Cancel editing")}
                                variant="regular"
                                disabled={addLoading}
                                onClick={() => {
                                  setOverride(false);
                                  setPolicyDefinition(
                                    JSON.stringify(
                                      JSON.parse(policy?.policy || "{}"),
                                      null,
                                      4,
                                    ),
                                  );
                                }}
                              />
                            )}
                          </Box>
                        )}
                        <form
                          noValidate
                          autoComplete="off"
                          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            saveRecord(e);
                          }}
                        >
                          <Grid container>
                            <Grid item xs={12}>
                              <CodeMirrorWrapper
                                value={policyDefinition}
                                readOnly={!writable || addLoading}
                                onChange={(value) => {
                                  if (writable && !addLoading) {
                                    setPolicyDefinition(value);
                                  }
                                }}
                                editorHeight={"350px"}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingTop: 16,
                                gap: 8,
                              }}
                            >
                              <SecureComponent
                                scopes={[IAM_SCOPES.ADMIN_CREATE_POLICY]}
                                resource={CONSOLE_UI_RESOURCE}
                                errorProps={{ disabled: true }}
                              >
                                <TooltipWrapper
                                  tooltip={
                                    canEditPolicy
                                      ? ""
                                      : permissionTooltipHelper(
                                          createPolicyPermissions,
                                          i18nKey("edit a Policy"),
                                        )
                                  }
                                >
                                  <Button
                                    id={"save"}
                                    type="submit"
                                    variant="callAction"
                                    color="primary"
                                    disabled={
                                      addLoading ||
                                      deleteOpen ||
                                      !validSave ||
                                      !canEditPolicy
                                    }
                                    label={t("Save")}
                                  />
                                </TooltipWrapper>
                              </SecureComponent>
                            </Grid>
                            {addLoading && (
                              <Grid item xs={12}>
                                <ProgressBar />
                              </Grid>
                            )}
                          </Grid>
                        </form>
                      </Grid>
                    </Fragment>
                  ),
                },
              ]}
              currentTabOrPath={selectedTab}
              onTabClick={(tab) => setSelectedTab(tab)}
            />
          </Box>
        )}
      </PageLayout>
    </Fragment>
  );
};

const PolicyDetails = () => {
  const { policyName } = useParams();
  return <PolicyDetailsContent key={policyName} />;
};
export default PolicyDetails;
