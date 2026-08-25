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
import {
  ActionLink,
  AddIcon,
  Box,
  Button,
  CircleIcon,
  DataTable,
  Grid,
  HelpBox,
  LambdaIcon,
  PageLayout,
  ProgressBar,
  RefreshIcon,
} from "mds";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "api";
import { NotificationEndpointItem } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import styled from "styled-components";
import get from "lodash/get";
import { TransformedEndpointItem } from "./types";
import { getNotificationConfigKey, notificationTransform } from "./utils";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import {
  recordServerRestartRequirement,
  setErrorSnackMessage,
} from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { setDestinationLoading } from "./destinationsSlice";
import SearchBox from "../Common/SearchBox";
import ConfirmDeleteDestinationModal from "./ConfirmDeleteDestinationModal";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import { interpolate, useLocalizedLink, useT } from "i18n";

const StatusDisplay = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "& svg": {
    width: 16,
    marginRight: 5,
    fill: get(theme, "signalColors.good", "#4CCB92"),
  },
  "& svg.offline": {
    fill: get(theme, "signalColors.danger", "#C51B3F"),
  },
}));

const ListEventDestinations = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const localize = useLocalizedLink();
  // Reducer States
  const isLoading = useSelector((state: AppState) => state.destination.loading);

  //Local States
  const [records, setRecords] = useState<TransformedEndpointItem[]>([]);
  const [filter, setFilter] = useState<string>("");

  const [isDelConfirmOpen, setIsDelConfirmOpen] = useState<boolean>(false);
  const [selNotifyEndPoint, setSelNotifyEndpoint] =
    useState<TransformedEndpointItem | null>();

  //Effects
  // load records on mount
  useEffect(() => {
    if (isLoading) {
      const fetchRecords = () => {
        api.admin
          .notificationEndpointList()
          .then((res) => {
            let resNotEndList: NotificationEndpointItem[] = [];
            if (res.data.notification_endpoints) {
              resNotEndList = res.data.notification_endpoints;
            }
            setRecords(notificationTransform(resNotEndList));
            dispatch(setDestinationLoading(false));
          })
          .catch((err) => {
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
            dispatch(setDestinationLoading(false));
          });
      };
      fetchRecords();
    }
  }, [isLoading, dispatch]);

  useEffect(() => {
    dispatch(setDestinationLoading(true));
  }, [dispatch]);

  const resetNotificationConfig = (
    ep: TransformedEndpointItem | undefined | null,
  ) => {
    if (ep?.name) {
      const configKey = getNotificationConfigKey(ep.name);
      let accountId = `:${ep.account_id}`;
      if (configKey) {
        api.configs
          .resetConfig(`${configKey}${accountId}`)
          .then((res) => {
            dispatch(recordServerRestartRequirement(res.data.restart === true));
            setSelNotifyEndpoint(null);
            setIsDelConfirmOpen(false);
            dispatch(setDestinationLoading(true));
          })
          .catch((err) => {
            setIsDelConfirmOpen(false);
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          });
      } else {
        setSelNotifyEndpoint(null);
        setIsDelConfirmOpen(false);
        console.log(`Unable to find Config key for ${ep.name}`);
      }
    }
  };

  const confirmDelNotifyEndpoint = (record: TransformedEndpointItem) => {
    setSelNotifyEndpoint(record);
    setIsDelConfirmOpen(true);
  };

  const tableActions = [{ type: "delete", onClick: confirmDelNotifyEndpoint }];

  const filteredRecords = records.filter((b: TransformedEndpointItem) => {
    if (filter === "") {
      return true;
    }
    return b.service_name.indexOf(filter) >= 0;
  });

  const statusDisplay = (status: string) => {
    return (
      <StatusDisplay>
        <CircleIcon className={status === "Offline" ? "offline" : ""} />
        {status ? t(status) : status}
      </StatusDisplay>
    );
  };

  return (
    <Fragment>
      <PageLayout>
        <Grid item xs={12} sx={actionsTray.actionsTray}>
          <SearchBox
            placeholder={t("Search target")}
            onChange={setFilter}
            value={filter}
            sx={{ maxWidth: 380 }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 5,
            }}
          >
            <TooltipWrapper tooltip={t("Refresh List")}>
              <Button
                id={"reload-event-destinations"}
                label={t("Refresh")}
                variant="regular"
                icon={<RefreshIcon />}
                onClick={() => {
                  dispatch(setDestinationLoading(true));
                }}
              />
            </TooltipWrapper>
            <TooltipWrapper tooltip={t("Add Event Destination")}>
              <Button
                id={"add-notification-target"}
                label={t("Add Event Destination")}
                variant="callAction"
                icon={<AddIcon />}
                onClick={() => {
                  navigate(IAM_PAGES.EVENT_DESTINATIONS_ADD);
                }}
              />
            </TooltipWrapper>
          </Box>
        </Grid>
        {isLoading && <ProgressBar />}
        {!isLoading && (
          <Fragment>
            {records.length > 0 && (
              <Fragment>
                <Box sx={{ width: "100%" }}>
                  <DataTable
                    itemActions={tableActions}
                    columns={[
                      {
                        label: t("Status"),
                        elementKey: "status",
                        renderFunction: statusDisplay,
                        width: 150,
                      },
                      { label: t("Service"), elementKey: "service_name" },
                    ]}
                    isLoading={isLoading}
                    records={filteredRecords}
                    entityName={t("Event Destinations")}
                    customEmptyMessage={t(
                      "There are no Event Destinations yet.",
                    )}
                    idField="service_name"
                    customPaperHeight={"400px"}
                  />
                </Box>
                <Grid item xs={12} sx={{ marginTop: 15 }}>
                  <HelpBox
                    title={t("Event Destinations")}
                    iconComponent={<LambdaIcon />}
                    help={
                      <Fragment>
                        {t(
                          "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.",
                        )}
                        <br />
                        <br />
                        {interpolate(t("You can learn more at the {link}."), {
                          link: (
                            <a
                              href={localize(
                                "https://silo.pgsty.com/administration/monitoring/bucket-notifications/#minio-bucket-notifications",
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
              <Grid
                container
                sx={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid item xs={8}>
                  <HelpBox
                    title={t("Event Destinations")}
                    iconComponent={<LambdaIcon />}
                    help={
                      <Fragment>
                        {t(
                          "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.",
                        )}
                        <br />
                        <br />
                        {interpolate(t("To get started, {link}."), {
                          link: (
                            <ActionLink
                              onClick={() => {
                                navigate(IAM_PAGES.EVENT_DESTINATIONS_ADD);
                              }}
                            >
                              {t("Add an Event Destination")}
                            </ActionLink>
                          ),
                        })}
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Fragment>
        )}

        {isDelConfirmOpen ? (
          <ConfirmDeleteDestinationModal
            onConfirm={() => {
              resetNotificationConfig(selNotifyEndPoint);
            }}
            status={`${selNotifyEndPoint?.status}`}
            serviceName={`${selNotifyEndPoint?.service_name}`}
            onClose={() => {
              setIsDelConfirmOpen(false);
            }}
          />
        ) : null}
      </PageLayout>
    </Fragment>
  );
};

export default ListEventDestinations;
