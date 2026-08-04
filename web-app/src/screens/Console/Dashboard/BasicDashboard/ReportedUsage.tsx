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
import get from "lodash/get";
import styled, { useTheme } from "styled-components";
import { Box, HelpTip } from "mds";
import { Cell, Pie, PieChart } from "recharts";

const ReportedUsageMain = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  "& .usage-label": {
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.02em",
    color: get(theme, "mutedText", "#71717A"),
  },
  "& .unit-value": {
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 1,
    color: get(theme, "fontColor", "#18181B"),
    fontVariantNumeric: "tabular-nums",
  },
  "& .unit-type": {
    fontSize: 14,
    fontWeight: 500,
    marginLeft: 6,
    color: get(theme, "mutedText", "#71717A"),
  },
}));

export const usageClarifyingContent = (
  <Fragment>
    <div>
      <strong> Not what you expected?</strong>
      <br />
      This Usage value is comparable to <strong>mc du --versions</strong> which
      represents the size of all object versions that exist in the buckets.
      <br />
      Running{" "}
      <a
        target="_blank"
        href="https://silo.pgsty.com/reference/minio-mc/mc-du/"
      >
        mc du
      </a>{" "}
      without the <strong>--versions</strong> flag or{" "}
      <a target="_blank" href="https://man7.org/linux/man-pages/man1/df.1.html">
        df
      </a>{" "}
      will provide different values corresponding to the size of all{" "}
      <strong>current</strong> versions and the physical disk space occupied
      respectively.
    </div>
  </Fragment>
);

const ReportedUsage = ({
  usageValue,
  total,
  unit,
}: {
  usageValue: string;
  total: number | string;
  unit: string;
}) => {
  const theme = useTheme();

  const plotValues = [
    {
      value: total,
      color: get(theme, "borderColor", "#E4E4E7"),
      label: "Free Space",
    },
    {
      value: usageValue,
      color: get(theme, "signalColors.main", "#1D588C"),
      label: "Used Space",
    },
  ];

  return (
    <ReportedUsageMain>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div className="usage-label">Reported Usage</div>

        <HelpTip content={usageClarifyingContent} placement="left">
          <Box sx={{ display: "flex", alignItems: "baseline" }}>
            <label className={"unit-value"}>{total}</label>
            <label className={"unit-type"}>{unit}</label>
          </Box>
        </HelpTip>
      </Box>

      <PieChart width={96} height={96}>
        <Pie
          data={plotValues}
          cx={"50%"}
          cy={"50%"}
          dataKey="value"
          outerRadius={44}
          innerRadius={35}
          startAngle={-70}
          endAngle={360}
          animationDuration={1}
        >
          {plotValues.map((entry, index) => (
            <Cell key={`cellCapacity-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ReportedUsageMain>
  );
};

export default ReportedUsage;
