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
import { Box, breakPoints } from "mds";

const DualSTCardContent = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 12,
  height: "100%",
  width: "100%",
  cursor: "default",
  "& .cardHeader": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    "& .cardLabel": {
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: "0.02em",
      color: get(theme, "mutedText", "#71717A"),
    },
    "& .min-icon": {
      width: 18,
      height: 18,
      flexShrink: 0,
      color: get(theme, "secondaryText", "#52525B"),
      fill: get(theme, "secondaryText", "#52525B"),
    },
  },
  "& .statRow": {
    display: "flex",
    alignItems: "flex-end",
    gap: 48,
    [`@media (max-width: ${breakPoints.lg}px)`]: {
      gap: 32,
    },
  },
  "& .stat-value": {
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 1,
    color: get(theme, "fontColor", "#18181B"),
    fontVariantNumeric: "tabular-nums",
    [`@media (max-width: ${breakPoints.sm}px)`]: {
      fontSize: 28,
    },
  },
}));

const DualStatCard = ({
  statItemLeft = null,
  statItemRight = null,
  icon = null,
  label = "",
}: {
  statItemLeft: any;
  statItemRight: any;
  icon: any;
  label: string;
}) => {
  return (
    <DualSTCardContent>
      <Box className={"cardHeader"}>
        <Box className={"cardLabel"}>{label}</Box>
        {icon}
      </Box>
      <Box className={"statRow"}>
        {statItemLeft}
        {statItemRight}
      </Box>
    </DualSTCardContent>
  );
};

export default DualStatCard;
