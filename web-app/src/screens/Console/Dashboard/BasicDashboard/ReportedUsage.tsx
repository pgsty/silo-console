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

import React from "react";
import get from "lodash/get";
import styled, { useTheme } from "styled-components";
import { Box, HelpTip } from "mds";
import { useT } from "i18n";
import { UsageClarifyingContent } from "../../Common/UsageClarifyingContent";
import { Cell, Pie, PieChart } from "recharts";

const ReportedUsageMain = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  "& .usage-label": {
    fontSize: "var(--fs-body)",
    fontWeight: 550,
    color: "var(--muted-foreground)",
  },
  "& .unit-value": {
    fontSize: "var(--fs-display)",
    fontWeight: 700,
    lineHeight: "var(--lh-display)",
    color: "var(--foreground)",
    fontVariantNumeric: "tabular-nums",
  },
  "& .unit-type": {
    fontSize: "var(--fs-subtitle)",
    fontWeight: 550,
    marginInlineStart: 4,
    color: "var(--muted-foreground)",
  },
});

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
  const t = useT();

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
          gap: 16,
        }}
      >
        <div className="usage-label">{t("Reported Usage")}</div>

        <HelpTip content={<UsageClarifyingContent />} placement="left">
          <Box sx={{ display: "flex", alignItems: "baseline" }}>
            <span className={"unit-value"}>{total}</span>
            <span className={"unit-type"}>{unit}</span>
          </Box>
        </HelpTip>
      </Box>

      <PieChart
        width={96}
        height={96}
        role="img"
        aria-label={`${t("Reported Usage")}: ${total} ${unit}`}
      >
        <Pie
          aria-hidden="true"
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
