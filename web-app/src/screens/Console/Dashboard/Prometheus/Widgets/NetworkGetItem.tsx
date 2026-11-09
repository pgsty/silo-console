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

import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import { Box, breakPoints, Loader, NetworkGetIcon } from "mds";

const NetworkGetBase = styled.div(({ theme }) => ({
  "& .valueText": {
    fontSize: "var(--fs-display)",
    fontWeight: 700,
    lineHeight: "var(--lh-display)",
    minHeight: "1em",
    color: "var(--foreground)",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    "& .unitText": {
      fontSize: "var(--fs-subtitle)",
      fontWeight: 550,
      marginInlineStart: 4,
      color: "var(--muted-foreground)",
    },
    [`@media (max-width: ${breakPoints.sm}px)`]: {
      fontSize: "var(--fs-display-compact)",
      lineHeight: "var(--lh-display-compact)",
    },
  },
  "& .getLabel": {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginTop: 8,

    "& .min-icon": {
      height: 14,
      width: 14,
      flexShrink: 0,
      fill: get(theme, "signalColors.good", "#4CCB92"),
      color: get(theme, "signalColors.good", "#4CCB92"),
    },

    "& .getText": {
      fontSize: "var(--fs-caption)",
      fontWeight: 550,
      color: "var(--muted-foreground)",
    },
  },
}));

const NetworkGetItem = ({
  value,
  loading,
}: {
  value: any;
  loading: boolean;
  title?: any;
  id?: number;
}) => {
  return (
    <NetworkGetBase>
      <Box className={"valueText"}>{value}</Box>
      <Box className={"getLabel"}>
        <Box className={"getText"}>GET</Box>
        {loading ? (
          <Loader style={{ width: "14px", height: "14px" }} />
        ) : (
          <NetworkGetIcon />
        )}
      </Box>
    </NetworkGetBase>
  );
};

export default NetworkGetItem;
