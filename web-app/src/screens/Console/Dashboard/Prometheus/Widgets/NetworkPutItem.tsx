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
import { Box, breakPoints, Loader, NetworkPutIcon } from "mds";

const NetworkPutBase = styled.div(({ theme }) => ({
  "& .valueText": {
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 1,
    minHeight: "1em",
    color: get(theme, "fontColor", "#18181B"),
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    "& .unitText": {
      fontSize: 14,
      fontWeight: 500,
      marginLeft: 4,
      color: get(theme, "mutedText", "#87888d"),
    },
    [`@media (max-width: ${breakPoints.sm}px)`]: {
      fontSize: 28,
    },
  },
  "& .putLabel": {
    display: "flex",
    gap: 6,
    alignItems: "center",
    marginTop: 7,

    "& .min-icon": {
      height: 14,
      width: 14,
      flexShrink: 0,
      fill: get(theme, "signalColors.info", "#2781B0"),
    },

    "& .putText": {
      fontSize: 12,
      fontWeight: 500,
      color: get(theme, "mutedText", "#87888d"),
    },
  },
}));

const NetworkPutItem = ({
  value,
  loading,
}: {
  value: any;
  loading: boolean;
  title?: any;
  id?: number;
}) => {
  return (
    <NetworkPutBase>
      <Box className={"valueText"}>{value}</Box>
      <Box className={"putLabel"}>
        <Box className={"putText"}>PUT</Box>
        {loading ? (
          <Loader style={{ width: "14px", height: "14px" }} />
        ) : (
          <NetworkPutIcon />
        )}
      </Box>
    </NetworkPutBase>
  );
};

export default NetworkPutItem;
