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
import { Box, DrivesIcon, Loader, type } from "mds";
import styled from "styled-components";
import { api } from "api";
import { ServerProperties } from "api/consoleApi";
import { SiloBrand } from "../../../../common/SiloBrand";
import { formatText, useT, useTN } from "i18n";

interface ITestWrapper {
  title: any;
  children: any;
}

const ReportTitle = styled.h2`
  ${type("title")}
  margin: 0;
  color: var(--foreground);
`;

const TestWrapper = ({ title, children }: ITestWrapper) => {
  const t = useT();
  const tn = useTN();
  const [version, setVersion] = useState<string>("N/A");
  const [totalNodes, setTotalNodes] = useState<number>(0);
  const [totalDrives, setTotalDrives] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      api.admin
        .adminInfo({
          defaultOnly: true,
        })
        .then((res) => {
          const totalServers = res.data.servers?.length;
          setTotalNodes(totalServers || 0);

          if (res.data.servers && res.data.servers.length > 0) {
            setVersion(res.data.servers[0].version || "N/A");

            const totalServers = res.data.servers.reduce(
              (prevTotal: number, currentElement: ServerProperties) => {
                let c = currentElement.drives
                  ? currentElement.drives.length
                  : 0;
                return prevTotal + c;
              },
              0,
            );
            setTotalDrives(totalServers);
          }

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [loading]);

  return (
    <Box sx={{ display: "grid", gap: 16 }}>
      <ReportTitle>{title}</ReportTitle>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px 24px",
          fontSize: "var(--fs-body)",
          lineHeight: "var(--lh-body)",
          color: "var(--muted-foreground)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {!loading ? (
          <Fragment>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                "& svg": {
                  width: 20,
                  height: 20,
                  color: "var(--muted-foreground)",
                },
              }}
            >
              <DrivesIcon />
              <span>
                {tn(totalNodes, "{count} node", "{count} nodes")}
                {" · "}
                {tn(totalDrives, "{count} drive", "{count} drives")}
              </span>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
                "& strong": {
                  fontWeight: 550,
                  color: "var(--foreground)",
                  overflowWrap: "anywhere",
                },
              }}
            >
              <SiloBrand
                variant="emblem"
                alt=""
                aria-hidden="true"
                style={{ width: 24, height: 24, objectFit: "contain" }}
              />
              <span>{t("SILO version")}</span>
              <strong>{version}</strong>
            </Box>
          </Fragment>
        ) : (
          <Loader style={{ width: 24, height: 24 }} />
        )}
      </Box>
      {children}
    </Box>
  );
};

export default TestWrapper;
