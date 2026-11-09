// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { SkeletonRows } from "common/ui";
import { FilteredEmptyState } from "common/ui/FilteredEmptyState";
import { LockIcon } from "mds";
import React, { useEffect, useState } from "react";
import {
  AddIcon,
  Button,
  IconButton,
  DataTable,
  Grid,
  PageLayout,
  RefreshIcon,
} from "mds";
import { useNavigate } from "react-router-dom";
import { i18nKey, useT } from "i18n";
import api from "../../../common/api";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../common/types";
import { useAppDispatch } from "../../../store";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import SearchBox from "../Common/SearchBox";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

const ListKeys = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();

  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [records, setRecords] = useState<[]>([]);

  const createKey = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_CREATE_KEY,
  ]);

  const displayKeys = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_LIST_KEYS,
  ]);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [filter]);

  useEffect(() => {
    if (loading) {
      if (displayKeys) {
        let pattern = filter.trim() === "" ? "*" : filter.trim();
        api
          .invoke("GET", `/api/v1/kms/keys?pattern=${pattern}`)
          .then((res) => {
            setLoading(false);
            setRecords(res.results ?? []);
          })
          .catch((err: ErrorResponseHandler) => {
            setLoading(false);
            dispatch(setErrorSnackMessage(err));
          });
      } else {
        setLoading(false);
      }
    }
  }, [loading, setLoading, setRecords, dispatch, displayKeys, filter]);

  const fetchRecords = () => {
    setLoading(true);
  };

  useEffect(() => {
    dispatch(setHelpName("list_keys"));
  }, [dispatch]);

  return (
    <React.Fragment>
      <PageHeaderWrapper
        titleElement="h1"
        label={i18nKey("Key Management Service Keys")}
        help
      />

      <PageLayout>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              "& button": {
                marginInlineStart: "8px",
              },
            }}
          >
            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_KEYS]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <SearchBox
                onChange={setFilter}
                placeholder={t("Search Keys with pattern")}
                value={filter}
              />
            </SecureComponent>

            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_KEYS]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <IconButton
                aria-label={t("Refresh list")}
                id={"refresh-keys"}
                onClick={() => setLoading(true)}
              >
                <RefreshIcon />
              </IconButton>
            </SecureComponent>
            {createKey ? (
              <SecureComponent
                scopes={[IAM_SCOPES.KMS_CREATE_KEY]}
                resource={CONSOLE_UI_RESOURCE}
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper tooltip={t("Create Key")}>
                  <Button
                    id={"create-key"}
                    label={t("Create Key")}
                    variant={"callAction"}
                    icon={<AddIcon />}
                    onClick={() => navigate(IAM_PAGES.KMS_KEYS_ADD)}
                  />
                </TooltipWrapper>
              </SecureComponent>
            ) : null}
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "5px" }}>
            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_KEYS]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <DataTable
                columns={[
                  { label: t("Name"), elementKey: "name" },
                  { label: t("Created By"), elementKey: "createdBy" },
                  { label: t("Created At"), elementKey: "createdAt" },
                ]}
                isLoading={loading}
                records={records}
                entityName="Keys"
                loadingState={<SkeletonRows rows={5} columns={3} />}
                emptyState={
                  <FilteredEmptyState
                    headingLevel={2}
                    filtered={Boolean(filter.trim())}
                    onClear={() => setFilter("")}
                    icon={<LockIcon />}
                    title={t("No encryption keys yet")}
                    description={t(
                      "Create a key to encrypt objects with the configured key management service.",
                    )}
                    action={
                      createKey && (
                        <Button
                          id="empty-list-action"
                          variant="callAction"
                          label={t("Create Key")}
                          onClick={() => navigate(IAM_PAGES.KMS_KEYS_ADD)}
                        />
                      )
                    }
                  />
                }
                idField="name"
              />
            </SecureComponent>
          </Grid>
        </Grid>
      </PageLayout>
    </React.Fragment>
  );
};

export default ListKeys;
