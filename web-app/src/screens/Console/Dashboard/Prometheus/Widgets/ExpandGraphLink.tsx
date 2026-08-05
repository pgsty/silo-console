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
import { useTheme } from "styled-components";
import get from "lodash/get";
import { Box, ExpandIcon } from "mds";

import { IDashboardPanel } from "../types";

import { openZoomPage } from "../../dashboardSlice";
import { useAppDispatch } from "../../../../../store";

const ExpandGraphLink = ({ panelItem }: { panelItem: IDashboardPanel }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  return (
    <Box
      sx={{
        "& .zoom-graph-icon": {
          backgroundColor: "transparent",
          border: 0,
          padding: 0,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          cursor: "pointer",
          "& svg": {
            color: get(theme, "mutedText", "#87888d"),
            width: 18,
            height: 18,
          },
          "&:hover": {
            "& svg": {
              color: get(theme, "fontColor", "#404143"),
            },
          },
        },
      }}
    >
      <button
        onClick={() => {
          dispatch(openZoomPage(panelItem));
        }}
        className={"zoom-graph-icon"}
        aria-label={"Expand graph"}
      >
        <ExpandIcon />
      </button>
    </Box>
  );
};

export default ExpandGraphLink;
