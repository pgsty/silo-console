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

import React, { Fragment } from "react";
import {
  ArrowRightIcon,
  Box,
  breakPoints,
  BucketsIcon,
  Button,
  DiagnosticsMenuIcon,
  DrivesIcon,
  FormatDrivesIcon,
  HealIcon,
  HelpBox,
  PrometheusErrorIcon,
  ServersIcon,
  StorageIcon,
  TotalObjectsIcon,
  UptimeIcon,
} from "mds";
import {
  calculateBytes,
  niceDays,
  representationNumber,
} from "../../../../common/utils";
import StatusCountCard from "./StatusCountCard";
import groupBy from "lodash/groupBy";
import ServersList from "./ServersList";
import CounterCard from "./CounterCard";
import ReportedUsage from "./ReportedUsage";
import { Link } from "react-router-dom";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import TimeStatItem from "../TimeStatItem";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import SimpleWidget from "../Prometheus/Widgets/SimpleWidget";
import {
  ErasureHealthRenderer,
  SimpleWidgetRenderProps,
  UsageAgeRenderer,
} from "../Prometheus/Widgets/InfoStatRenderers";
import { panelsConfiguration } from "../Prometheus/utils";
import {
  AdminInfoResponse,
  ServerDrives,
  ServerProperties,
} from "api/consoleApi";
import { useLocalizedLink, useT } from "i18n";

const BoxItem = ({ children }: { children: any }) => {
  return (
    <Box
      withBorders
      sx={{
        padding: "16px 20px",
        borderRadius: 12,
        height: "136px",
        maxWidth: "100%",
        [`@media (max-width: ${breakPoints.sm}px)`]: {
          padding: 10,
          maxWidth: "initial",
        },
      }}
    >
      {children}
    </Box>
  );
};

interface IDashboardProps {
  usage: AdminInfoResponse | undefined;
}

const getServersList = (usage: AdminInfoResponse | undefined) => {
  if (usage && usage.servers) {
    return [...usage.servers].sort(function (a, b) {
      const nameA = a.endpoint?.toLowerCase() || "";
      const nameB = b.endpoint?.toLowerCase() || "";
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  return [];
};

const prettyUsage = (usage: string | undefined) => {
  if (usage === undefined) {
    return { total: "0", unit: "Mi" };
  }

  return calculateBytes(usage);
};

const getClusterUptime = (servers: ServerProperties[]) => {
  const onlineUptimes = servers
    .filter(
      (server) =>
        server.state === "online" &&
        typeof server.uptime === "number" &&
        server.uptime >= 0,
    )
    .map((server) => server.uptime as number);

  if (!onlineUptimes.length) {
    return "n/a";
  }

  return niceDays(Math.min(...onlineUptimes).toString()).trim() || "0 seconds";
};

const BasicDashboard = ({ usage }: IDashboardProps) => {
  const t = useT();
  const localize = useLocalizedLink();
  const usageValue = usage && usage.usage ? usage.usage.toString() : "0";
  const usageToRepresent = prettyUsage(usageValue);
  const serverList = getServersList(usage);
  const upTime = getClusterUptime(serverList);
  // Same widget definitions (and therefore the same PromQL semantics) as the
  // Usage tab; "not configured" hides the rows, "unavailable" shows Unknown.
  const metricsStatus = usage?.advancedMetricsStatus;
  const erasureHealthPanel = panelsConfiguration.find((p) => p.id === 80);
  const usageAgePanel = panelsConfiguration.find((p) => p.id === 81);

  let allDrivesArray: ServerDrives[] = [];

  serverList.forEach((server) => {
    const drivesInput = server.drives?.map((drive) => {
      return drive;
    });
    if (drivesInput) {
      allDrivesArray = [...allDrivesArray, ...drivesInput];
    }
  });

  const serversGroup = groupBy(serverList, "state");
  const { offline: offlineServers = [], online: onlineServers = [] } =
    serversGroup;
  const drivesGroup = groupBy(allDrivesArray, "state");
  const { offline: offlineDrives = [], ok: onlineDrives = [] } = drivesGroup;
  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "1fr",
          gap: 27,
          marginBottom: 40,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "136px",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              [`@media (max-width: ${breakPoints.sm}px)`]: {
                gridTemplateColumns: "1fr",
              },
              [`@media (max-width: ${breakPoints.md}px)`]: {
                marginBottom: 0,
              },
            }}
          >
            <BoxItem>
              <CounterCard
                label={t("Buckets")}
                icon={<BucketsIcon />}
                counterValue={usage ? representationNumber(usage.buckets) : 0}
                actions={
                  <Link
                    to={IAM_PAGES.BUCKETS}
                    style={{ textDecoration: "none" }}
                  >
                    <TooltipWrapper tooltip={t("Browse")}>
                      <Button
                        id={"browse-dashboard"}
                        onClick={() => {}}
                        label={t("Browse")}
                        icon={<ArrowRightIcon />}
                        variant={"regular"}
                        style={{
                          height: 30,
                          fontSize: 13,
                          padding: "0 12px",
                        }}
                      />
                    </TooltipWrapper>
                  </Link>
                }
              />
            </BoxItem>
            <BoxItem>
              <CounterCard
                label={t("Objects")}
                icon={<TotalObjectsIcon />}
                counterValue={usage ? representationNumber(usage.objects) : 0}
              />
            </BoxItem>

            <BoxItem>
              <StatusCountCard
                onlineCount={onlineServers.length}
                offlineCount={offlineServers.length}
                label={t("Servers")}
                icon={<ServersIcon />}
              />
            </BoxItem>
            <BoxItem>
              <StatusCountCard
                offlineCount={
                  usage?.backend?.offlineDrives || offlineDrives.length
                }
                onlineCount={
                  usage?.backend?.onlineDrives || onlineDrives.length
                }
                label={t("Drives")}
                icon={<DrivesIcon />}
              />
            </BoxItem>

            <Box
              withBorders
              sx={{
                gridRowStart: "1",
                gridRowEnd: "3",
                gridColumnStart: "3",
                padding: "16px 20px",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 14,
                [`@media (max-width: ${breakPoints.sm}px)`]: {
                  gridRowStart: "auto",
                  gridRowEnd: "auto",
                  gridColumnStart: "1",
                  gridColumnEnd: "2",
                },
              }}
            >
              <ReportedUsage
                usageValue={usageValue}
                total={usageToRepresent.total}
                unit={usageToRepresent.unit}
              />

              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  gap: "14px",
                }}
              >
                {metricsStatus === "available" &&
                  erasureHealthPanel &&
                  usageAgePanel && (
                    <Fragment>
                      <SimpleWidget
                        title={t("Erasure Health")}
                        panelItem={erasureHealthPanel}
                        timeStart={null}
                        timeEnd={null}
                        apiPrefix={"admin"}
                        iconWidget={<HealIcon />}
                        renderFn={(props: SimpleWidgetRenderProps) => (
                          <ErasureHealthRenderer {...props} />
                        )}
                      />
                      <SimpleWidget
                        title={t("Usage Data Age")}
                        panelItem={usageAgePanel}
                        timeStart={null}
                        timeEnd={null}
                        apiPrefix={"admin"}
                        iconWidget={<DiagnosticsMenuIcon />}
                        renderFn={(props: SimpleWidgetRenderProps) => (
                          <UsageAgeRenderer {...props} />
                        )}
                      />
                    </Fragment>
                  )}
                {metricsStatus === "unavailable" && (
                  <Fragment>
                    <TimeStatItem
                      icon={<HealIcon />}
                      label={t("Erasure Health")}
                      value={t("Unknown")}
                      status="muted"
                    />
                    <TimeStatItem
                      icon={<DiagnosticsMenuIcon />}
                      label={t("Usage Data Age")}
                      value={t("Unknown")}
                      status="muted"
                    />
                  </Fragment>
                )}
                <TimeStatItem
                  icon={<UptimeIcon />}
                  label={t("Uptime")}
                  value={upTime}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "14px",
              [`@media (max-width: ${breakPoints.lg}px)`]: {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            <TimeStatItem
              icon={<StorageIcon />}
              label={t("Backend type")}
              value={usage?.backend?.backendType ?? "Unknown"}
            />
            <TimeStatItem
              icon={<FormatDrivesIcon />}
              label={t("Standard storage class parity")}
              value={usage?.backend?.standardSCParity?.toString() ?? "n/a"}
            />
            <TimeStatItem
              icon={<FormatDrivesIcon />}
              label={t("Reduced redundancy storage class parity")}
              value={usage?.backend?.rrSCParity?.toString() ?? "n/a"}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "auto",
              gridTemplateColumns: "1fr",
              gap: "auto",
            }}
          >
            <ServersList data={serverList} />
          </Box>
        </Box>
        {usage?.advancedMetricsStatus === "not configured" && (
          <Box>
            <HelpBox
              iconComponent={<PrometheusErrorIcon />}
              title={t("We can’t retrieve advanced metrics at this time.")}
              help={
                <Box>
                  <Box
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    {t(
                      "Console Dashboard will display basic metrics as we couldn’t connect to Prometheus successfully. Please try again in a few minutes. If the problem persists, you can review your configuration and confirm that Prometheus server is up and running.",
                    )}
                  </Box>
                  <Box
                    sx={{
                      paddingTop: 12,
                      fontSize: 14,
                    }}
                  >
                    <a
                      href={localize(
                        "https://silo.pgsty.com/operations/monitoring/collect-minio-metrics-using-prometheus/",
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      {t("Read more about Prometheus on the Docs site.")}
                    </a>
                  </Box>
                </Box>
              }
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BasicDashboard;
