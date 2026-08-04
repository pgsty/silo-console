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
import styled from "styled-components";
import get from "lodash/get";
import { Box, Loader, SuccessIcon } from "mds";

const TimeStatBase = styled.div(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "16px minmax(0, 1fr) auto 14px",
  alignItems: "center",
  gap: 10,
  minHeight: 40,
  padding: "8px 14px",
  borderRadius: 8,
  background: get(theme, "boxBackground", "#FAFAFA"),
  "& > .min-icon": {
    height: 14,
    width: 14,
    color: get(theme, "secondaryText", "#52525B"),
    fill: get(theme, "secondaryText", "#52525B"),
  },
  "& .ok-icon": {
    height: 8,
    width: 8,
    fill: get(theme, "signalColors.good", "#10B981"),
    color: get(theme, "signalColors.good", "#10B981"),
  },
  "& .timeStatLabel": {
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.35,
    color: get(theme, "secondaryText", "#52525B"),
  },
  "& .timeStatValue": {
    fontSize: 13,
    fontWeight: 600,
    justifySelf: "end",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
    color: get(theme, "fontColor", "#18181B"),
    "&.is-na": {
      fontWeight: 500,
      color: get(theme, "mutedText", "#71717A"),
    },
  },
}));

const TimeStatItem = ({
  icon,
  label,
  value,
  loading = false,
}: {
  icon: any;
  label: any;
  value: string;
  loading?: boolean;
}) => {
  return (
    <TimeStatBase className="dashboard-time-stat-item">
      {loading ? <Loader style={{ width: 12, height: 12 }} /> : icon}
      <Box className={"timeStatLabel"}>{label}</Box>
      <Box className={`timeStatValue ${value === "n/a" ? "is-na" : ""}`}>
        {value}
      </Box>
      {value !== "n/a" ? <SuccessIcon className="ok-icon" /> : null}
    </TimeStatBase>
  );
};

export default TimeStatItem;
