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
import styled from "styled-components";
import { Box, breakPoints, Tooltip } from "mds";

const CounterCardMain = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
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
  "& .cardBottom": {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
    minWidth: 0,
  },
  "& .cardValue": {
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 1,
    color: get(theme, "fontColor", "#18181B"),
    fontVariantNumeric: "tabular-nums",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    [`@media (max-width: ${breakPoints.sm}px)`]: {
      fontSize: 28,
    },
  },
}));

const CounterCard = ({
  counterValue,
  label = "",
  icon = null,
  actions = null,
}: {
  counterValue: string | number;
  label?: any;
  icon?: any;
  actions?: any;
}) => {
  return (
    <CounterCardMain>
      <Box className={"cardHeader"}>
        <Box className={"cardLabel"}>{label}</Box>
        {icon}
      </Box>
      <Box className={"cardBottom"}>
        <Tooltip tooltip={counterValue} placement="bottom">
          <Box className={"cardValue"}>{counterValue}</Box>
        </Tooltip>
        {actions ? <Box className={"cardActions"}>{actions}</Box> : null}
      </Box>
    </CounterCardMain>
  );
};

export default CounterCard;
