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
import { OverflowMenu, SkeletonRows } from "common/ui";
import { useMobile } from "common/ui/useMediaQuery";
import { FilteredEmptyState } from "common/ui/FilteredEmptyState";
import { ModalPresence } from "common/ui/ModalPresence";
import React, { Fragment, useEffect, useState } from "react";
import {
  AddIcon,
  Box,
  Button,
  CircleIcon,
  DataTable,
  Grid,
  HelpBox,
  IconButton,
  LambdaIcon,
  PageLayout,
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
import { hasPermission } from "common/SecureComponent";
import {
  IAM_PAGES,
  IAM_SCOPES,
  CONSOLE_UI_RESOURCE,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import {
  recordServerRestartRequirement,
  setErrorSnackMessage,
} from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { setDestinationLoading } from "./destinationsSlice";
import SearchBox from "../Common/SearchBox";
import ConfirmDeleteDestinationModal from "./ConfirmDeleteDestinationModal";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import { formatText, i18nKey, useLocalizedLink, useT } from "i18n";

const StatusDisplay = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "& svg": {
    width: 16,
    marginInlineEnd: 5,
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
  const mobile = useMobile();
  const canConfigure = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_CONFIG_UPDATE,
  ]);
  const [hasLoaded, setHasLoaded] = useState(false);
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
            setHasLoaded(true);
            dispatch(setDestinationLoading(false));
          })
          .catch((err) => {
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
            setHasLoaded(true);
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

  const filteredRecords = records.filter((b: TransformedEndpointItem) => {
    if (filter.trim() === "") {
      return true;
    }
    return b.service_name.indexOf(filter.trim()) >= 0;
  });

  const statusDisplay = (status: string) => {
    return (
      <StatusDisplay>
        <CircleIcon className={status === "Offline" ? "offline" : ""} />
        {status ? t(status) : status}
      </StatusDisplay>
    );
  };

  const boundedTable = useBoundedTable(
    filteredRecords.length,
    isLoading || !hasLoaded,
  );

  return (
    <Fragment>
      <PageLayout>
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
            placeholder={t("Search target")}
            onChange={setFilter}
            value={filter}
            sx={{
              maxWidth: mobile ? "100%" : 380,
              width: mobile ? "100%" : undefined,
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            {mobile ? (
              <OverflowMenu
                label={t("Actions")}
                items={[
                  {
                    label: t("Refresh List"),
                    icon: <RefreshIcon />,
                    onClick: () => dispatch(setDestinationLoading(true)),
                  },
                ]}
              />
            ) : (
              <IconButton
                id={"reload-event-destinations"}
                label={t("Refresh List")}
                onClick={() => {
                  dispatch(setDestinationLoading(true));
                }}
              >
                <RefreshIcon />
              </IconButton>
            )}
            <TooltipWrapper tooltip={t("Add Event Destination")}>
              <Button
                id={"add-notification-target"}
                disabled={!canConfigure}
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

        <Box sx={{ width: "100%" }}>
          <DataTable
            {...boundedTable}
            columns={[
              {
                label: t("Service"),
                elementKey: "service_name",
                priority: "high",
              },
              {
                label: t("Status"),
                elementKey: "status",
                renderFunction: statusDisplay,
                width: 100,
                priority: "high",
              },
              {
                label: t("Actions"),
                priority: "high",
                width: 48,
                globalClass: "mds-row-actions",
                renderFullObject: true,
                renderFunction: (record: TransformedEndpointItem) => (
                  <span onClick={(event) => event.stopPropagation()}>
                    <OverflowMenu
                      label={formatText(t("Actions for {name}"), {
                        name: record.service_name,
                      })}
                      items={[
                        {
                          label: t("Delete"),
                          danger: true,
                          disabled: !canConfigure,
                          disabledReason: permissionTooltipHelper(
                            [IAM_SCOPES.ADMIN_CONFIG_UPDATE],
                            i18nKey("configure event destinations"),
                          ),
                          onClick: () => {
                            if (canConfigure) confirmDelNotifyEndpoint(record);
                          },
                        },
                      ]}
                    />
                  </span>
                ),
              },
            ]}
            isLoading={isLoading || !hasLoaded}
            records={filteredRecords}
            entityName={t("Event Destinations")}
            loadingState={<SkeletonRows rows={5} columns={2} />}
            emptyState={
              <FilteredEmptyState
                headingLevel={2}
                filtered={Boolean(filter.trim())}
                onClear={() => setFilter("")}
                icon={<LambdaIcon />}
                title={t("No event destinations yet")}
                description={t(
                  "Connect an external service to receive bucket and object notifications.",
                )}
                action={
                  canConfigure && (
                    <Button
                      id="empty-list-action"
                      variant="callAction"
                      label={t("Add Event Destination")}
                      onClick={() => navigate(IAM_PAGES.EVENT_DESTINATIONS_ADD)}
                    />
                  )
                }
              />
            }
            idField="service_name"
          />
        </Box>
        <Grid item xs={12} sx={{ marginTop: 16 }}>
          <HelpBox
            title={t("Event destinations")}
            iconComponent={<LambdaIcon />}
            help={
              <Fragment>
                {t(
                  "Configure a destination, then add bucket notification rules to send S3 events to it.",
                )}{" "}
                <a
                  href={localize(
                    "https://silo.pgsty.com/administration/monitoring/bucket-notifications/#minio-bucket-notifications",
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

        <ModalPresence open={Boolean(isDelConfirmOpen)}>
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
        </ModalPresence>
      </PageLayout>
    </Fragment>
  );
};

export default ListEventDestinations;
