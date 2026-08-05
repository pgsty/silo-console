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
import { Box, breakPoints, SpeedtestIcon } from "mds";
import { IDashboardPanel } from "../types";
import SingleValueWidget from "./SingleValueWidget";
import NetworkGetItem from "./NetworkGetItem";
import NetworkPutItem from "./NetworkPutItem";
import { useT } from "i18n";

const NetworkItemBase = styled.div(({ theme }) => ({
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
    minWidth: 0,
    [`@media (max-width: ${breakPoints.lg}px)`]: {
      gap: 32,
    },
  },
}));

const NetworkItem = ({
  value,
  timeStart,
  timeEnd,
  apiPrefix,
}: {
  value: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
}) => {
  const t = useT();
  const { mergedPanels = [] } = value;
  const [leftPanel, rightPanel] = mergedPanels;

  const rightCmp = (
    <SingleValueWidget
      title={value.title}
      panelItem={leftPanel}
      timeStart={timeStart}
      timeEnd={timeEnd}
      apiPrefix={apiPrefix}
      renderFn={({ valueToRender, loading, title, id }) => {
        return (
          <NetworkPutItem
            value={valueToRender}
            loading={loading}
            title={title}
            id={id}
          />
        );
      }}
    />
  );
  const leftCmp = (
    <SingleValueWidget
      title={value.title}
      panelItem={rightPanel}
      timeStart={timeStart}
      timeEnd={timeEnd}
      apiPrefix={apiPrefix}
      renderFn={({ valueToRender, loading, title, id }) => {
        return (
          <NetworkGetItem
            value={valueToRender}
            loading={loading}
            title={title}
            id={id}
          />
        );
      }}
    />
  );

  return (
    <NetworkItemBase>
      <Box className={"cardHeader"}>
        <Box className={"cardLabel"}>{t("Network")}</Box>
        <SpeedtestIcon />
      </Box>
      <Box className={"statRow"}>
        {leftCmp}
        {rightCmp}
      </Box>
    </NetworkItemBase>
  );
};

export default NetworkItem;
