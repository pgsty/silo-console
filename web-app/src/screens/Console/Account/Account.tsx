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
import { AccessKeyRowMenu } from "./AccessKeyRowMenu";
import { SkeletonRows } from "common/ui";
import { FilteredEmptyState } from "common/ui/FilteredEmptyState";
import { ModalPresence } from "common/ui/ModalPresence";
import React, { Fragment, useEffect, useState } from "react";
import {
  AccountIcon,
  AddIcon,
  Box,
  Button,
  DataTable,
  DeleteIcon,
  Grid,
  HelpBox,
  PageLayout,
  PasswordKeyIcon,
} from "mds";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";

import ChangePasswordModal from "./ChangePasswordModal";
import SearchBox from "../Common/SearchBox";
import withSuspense from "../Common/Components/withSuspense";

import { selectSAs } from "../Configurations/utils";
import DeleteMultipleServiceAccounts from "../Users/DeleteMultipleServiceAccounts";
import EditServiceAccount from "./EditServiceAccount";

import { selFeatures } from "../consoleSlice";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { accountTableColumns } from "./AccountUtils";
import { useLocalizedLink, useT } from "i18n";
import { useAppDispatch } from "store";
import { ServiceAccounts } from "api/consoleApi";
import {
  setErrorSnackMessage,
  setHelpName,
  setSnackBarMessage,
} from "systemSlice";
import { usersSort } from "utils/sortFunctions";
import { hasPermission, SecureComponent } from "common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "common/SecureComponent/permissions";

const DeleteServiceAccount = withSuspense(
  React.lazy(() => import("./DeleteServiceAccount")),
);

const Account = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const localize = useLocalizedLink();

  const features = useSelector(selFeatures);

  const [records, setRecords] = useState<ServiceAccounts>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedServiceAccount, setSelectedServiceAccount] = useState<
    string | null
  >(null);
  const [changePasswordModalOpen, setChangePasswordModalOpen] =
    useState<boolean>(false);
  const [selectedSAs, setSelectedSAs] = useState<string[]>([]);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [serviceAccountReadOnly, setServiceAccountReadOnly] =
    useState<boolean>(false);

  const userIDP = (features && features.includes("external-idp")) || false;
  const canUpdateServiceAccount = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_UPDATE_SERVICEACCOUNT,
  ]);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    dispatch(setHelpName("accessKeys"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) {
      api.serviceAccounts
        .listUserServiceAccounts()
        .then((res) => {
          setLoading(false);
          const sortedRows = res.data.sort(usersSort);
          setRecords(sortedRows);
        })
        .catch((res) => {
          dispatch(
            setErrorSnackMessage(
              errorToHandler(res?.error || t("Error retrieving access keys")),
            ),
          );
          setLoading(false);
        });
    }
  }, [loading, setLoading, setRecords, dispatch]);

  const fetchRecords = () => {
    setLoading(true);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      setSelectedSAs([]);
      fetchRecords();
    }
  };

  const closeDeleteMultipleModalAndRefresh = (refresh: boolean) => {
    setDeleteMultipleOpen(false);
    if (refresh) {
      dispatch(setSnackBarMessage(t("Access keys deleted successfully.")));
      setSelectedSAs([]);
      setLoading(true);
    }
  };

  const serviceAccountModalOpen = (
    selectedServiceAccount: string,
    readOnly: boolean,
  ) => {
    setSelectedServiceAccount(selectedServiceAccount);
    setServiceAccountReadOnly(readOnly);
    setIsEditOpen(true);
  };

  const closePolicyModal = () => {
    setIsEditOpen(false);
    setServiceAccountReadOnly(false);
    setLoading(true);
  };

  const confirmDeleteServiceAccount = (selectedServiceAccount: string) => {
    setSelectedServiceAccount(selectedServiceAccount);
    setDeleteOpen(true);
  };

  const tableActions = [
    {
      type: "view",
      onClick: (value: any) => {
        if (value) {
          serviceAccountModalOpen(value.accessKey, true);
        }
      },
    },
    {
      type: "delete",
      onClick: (value: any) => {
        if (value) {
          confirmDeleteServiceAccount(value.accessKey);
        }
      },
    },
    {
      type: "edit",
      isDisabled: () => !canUpdateServiceAccount,
      onClick: (value: any) => {
        if (value) {
          serviceAccountModalOpen(value.accessKey, false);
        }
      },
    },
  ];

  const filteredRecords = records.filter((elementItem) =>
    elementItem?.accessKey?.toLowerCase().includes(filter.trim().toLowerCase()),
  );

  const boundedTable = useBoundedTable(filteredRecords.length, loading);

  return (
    <React.Fragment>
      <ModalPresence open={Boolean(deleteOpen)}>
        {deleteOpen && (
          <DeleteServiceAccount
            deleteOpen={deleteOpen}
            selectedServiceAccount={selectedServiceAccount}
            closeDeleteModalAndRefresh={(refresh: boolean) => {
              closeDeleteModalAndRefresh(refresh);
            }}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(deleteMultipleOpen)}>
        {deleteMultipleOpen && (
          <DeleteMultipleServiceAccounts
            deleteOpen={deleteMultipleOpen}
            selectedSAs={selectedSAs}
            closeDeleteModalAndRefresh={closeDeleteMultipleModalAndRefresh}
          />
        )}
      </ModalPresence>

      <ModalPresence open={Boolean(isEditOpen)}>
        {isEditOpen && (
          <EditServiceAccount
            open={isEditOpen}
            selectedAccessKey={selectedServiceAccount}
            closeModalAndRefresh={closePolicyModal}
            readOnly={serviceAccountReadOnly}
          />
        )}
      </ModalPresence>
      <ChangePasswordModal
        open={changePasswordModalOpen}
        closeModal={() => setChangePasswordModalOpen(false)}
      />
      <PageHeaderWrapper label={t("Access Keys")} titleElement="h1" help />

      <PageLayout>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              ...actionsTray.actionsTray,
              gap: 12,
              "& button": { marginInlineStart: 0 },
            }}
          >
            <SearchBox
              placeholder={t("Search Access Keys")}
              onChange={setFilter}
              sx={{ marginInlineEnd: "auto", maxWidth: 380 }}
              value={filter}
            />
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                gap: 8,
              }}
            >
              <TooltipWrapper tooltip={t("Delete Selected")}>
                <Button
                  id={"delete-selected-accounts"}
                  onClick={() => {
                    setDeleteMultipleOpen(true);
                  }}
                  label={t("Delete Selected")}
                  icon={<DeleteIcon />}
                  disabled={selectedSAs.length === 0}
                  variant={"danger"}
                />
              </TooltipWrapper>
              <SecureComponent
                scopes={[IAM_SCOPES.ADMIN_CHANGE_MY_PASSWORD]}
                resource={CONSOLE_UI_RESOURCE}
                matchAll
                errorProps={{ disabled: true }}
              >
                <Button
                  id={"change-password"}
                  onClick={() => setChangePasswordModalOpen(true)}
                  label={t("Change Password")}
                  icon={<PasswordKeyIcon />}
                  variant={"regular"}
                  disabled={userIDP}
                />
              </SecureComponent>
              <SecureComponent
                scopes={[IAM_SCOPES.ADMIN_CREATE_SERVICEACCOUNT]}
                resource={CONSOLE_UI_RESOURCE}
                matchAll
                errorProps={{ disabled: true }}
              >
                <Button
                  id={"create-service-account"}
                  onClick={() => {
                    navigate(`${IAM_PAGES.ACCOUNT_ADD}`);
                  }}
                  label={t("Create access key")}
                  icon={<AddIcon />}
                  variant={"callAction"}
                />
              </SecureComponent>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <DataTable
              {...boundedTable}
              itemActions={tableActions.filter(
                (action) => action.type === "view",
              )}
              entityName={t("Access Keys")}
              loadingState={<SkeletonRows rows={5} columns={4} />}
              emptyState={
                <FilteredEmptyState
                  headingLevel={2}
                  filtered={Boolean(filter.trim())}
                  onClear={() => setFilter("")}
                  icon={<AccountIcon />}
                  title={t("No access keys yet")}
                  description={t(
                    "Access keys let applications connect with the permissions of your account.",
                  )}
                  action={
                    hasPermission(CONSOLE_UI_RESOURCE, [
                      IAM_SCOPES.ADMIN_CREATE_SERVICEACCOUNT,
                    ]) && (
                      <Button
                        id="empty-list-action"
                        variant="callAction"
                        label={t("Create access key")}
                        onClick={() => navigate(IAM_PAGES.ACCOUNT_ADD)}
                      />
                    )
                  }
                />
              }
              columns={[
                ...accountTableColumns(t),
                {
                  label: t("Actions"),
                  elementKey: "actions",
                  priority: "high",
                  width: 48,
                  globalClass: "mds-row-actions",
                  renderFullObject: true,
                  renderFunction: (record: ServiceAccounts[number]) => (
                    <AccessKeyRowMenu record={record} actions={tableActions} />
                  ),
                },
              ]}
              onSelect={(e) => selectSAs(e, setSelectedSAs, selectedSAs)}
              onSelectAll={() => {
                // Toggle the visible rows only; selections hidden by the
                // current filter are preserved.
                const visible = filteredRecords.map((r) => `${r.accessKey}`);
                const allVisible =
                  visible.length > 0 &&
                  visible.every((v) => selectedSAs.includes(v));
                setSelectedSAs(
                  allVisible
                    ? selectedSAs.filter((v) => !visible.includes(v))
                    : Array.from(new Set([...selectedSAs, ...visible])),
                );
              }}
              selectedItems={selectedSAs}
              isLoading={loading}
              records={filteredRecords}
              idField="accessKey"
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 16 }}>
            <HelpBox
              title={t("Access keys")}
              iconComponent={<AccountIcon />}
              help={
                <Fragment>
                  {t(
                    "Access keys inherit their parent user’s permissions. An inline policy can only restrict them further.",
                  )}{" "}
                  <a
                    href={localize(
                      "https://silo.pgsty.com/administration/identity-access-management/minio-user-management/#access-keys",
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
    </React.Fragment>
  );
};

export default Account;
