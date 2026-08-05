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

import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import get from "lodash/get";
import { Box, breakPoints, Loader, ReportedUsageIcon } from "mds";
import { Cell, Pie, PieChart } from "recharts";
import { useSelector } from "react-redux";
import api from "../../../../../common/api";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import {
  calculateBytes,
  capacityColors,
  niceBytesInt,
} from "../../../../../common/utils";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";

const CapacityItemMain = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 6,
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
  "& .capacityRow": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    minWidth: 0,
  },
  "& .usedLabel": {
    color: get(theme, "mutedText", "#87888d"),
    fontWeight: 500,
    fontSize: 12,
  },
  "& .totalUsed": {
    display: "flex",
    alignItems: "baseline",
    marginTop: 4,
    "& .value": {
      fontSize: 40,
      fontWeight: 600,
      lineHeight: 1,
      color: get(theme, "fontColor", "#18181B"),
      fontVariantNumeric: "tabular-nums",
      [`@media (max-width: ${breakPoints.sm}px)`]: {
        fontSize: 28,
      },
    },
    "& .unit": {
      color: get(theme, "mutedText", "#87888d"),
      fontWeight: 500,
      fontSize: 14,
      marginLeft: 6,
    },
  },
  "& .ofUsed": {
    marginTop: 4,
    "& .value": {
      color: get(theme, "mutedText", "#87888d"),
      fontSize: 12,
    },
  },
  "& .donutCenter": {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    "& .pct": {
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.1,
      color: get(theme, "fontColor", "#18181B"),
      fontVariantNumeric: "tabular-nums",
    },
    "& .pctLabel": {
      fontSize: 9,
      color: get(theme, "mutedText", "#87888d"),
    },
  },
}));

const CapacityItem = ({
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
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);

  const [totalUsableFree, setTotalUsableFree] = useState<number>(0);
  const [totalUsableFreeRatio, setTotalUsableFreeRatio] = useState<number>(0);
  const [totalUsed, setTotalUsed] = useState<number>(0);
  const [totalUsable, setTotalUsable] = useState<number>(0);
  const widgetVersion = useSelector(
    (state: AppState) => state.dashboard.widgetLoadVersion,
  );

  useEffect(() => {
    setLoading(true);
  }, [widgetVersion]);

  useEffect(() => {
    if (loading) {
      let stepCalc = 0;
      if (timeStart !== null && timeEnd !== null) {
        const secondsInPeriod =
          timeEnd.toUnixInteger() - timeStart.toUnixInteger();
        const periods = Math.floor(secondsInPeriod / 60);

        stepCalc = periods < 1 ? 15 : periods;
      }

      api
        .invoke(
          "GET",
          `/api/v1/${apiPrefix}/info/widgets/${value.id}/?step=${stepCalc}&${
            timeStart !== null ? `&start=${timeStart.toUnixInteger()}` : ""
          }${timeStart !== null && timeEnd !== null ? "&" : ""}${
            timeEnd !== null ? `end=${timeEnd.toUnixInteger()}` : ""
          }`,
        )
        .then((res: any) => {
          const widgetsWithValue = widgetDetailsToPanel(res, value);

          let tUsable = 0;
          let tUsed = 0;
          let tFree = 0;

          widgetsWithValue.data.forEach((eachArray: any[]) => {
            eachArray.forEach((itemSum) => {
              switch (itemSum.legend) {
                case "Total Usable":
                  tUsable += itemSum.value;
                  break;
                case "Used Space":
                  tUsed += itemSum.value;
                  break;
                case "Usable Free":
                  tFree += itemSum.value;
                  break;
              }
            });
          });

          const freeRatio = Math.round((tFree / tUsable) * 100);

          setTotalUsableFree(tFree);
          setTotalUsableFreeRatio(freeRatio);
          setTotalUsed(tUsed);
          setTotalUsable(tUsable);

          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, value, timeEnd, timeStart, dispatch, apiPrefix]);

  const usedConvert = calculateBytes(totalUsed, true, false);

  const plotValues = [
    {
      value: totalUsableFree,
      color: get(theme, "borderColor", "#E4E4E7"),
      label: "Usable Available Space",
    },
    {
      value: totalUsed,
      color: capacityColors(totalUsed, totalUsable),
      label: "Used Space",
    },
  ];
  return (
    <CapacityItemMain>
      <Box className={"cardHeader"}>
        <Box className={"cardLabel"}>Capacity</Box>
        {loading ? (
          <Loader style={{ width: 16, height: 16 }} />
        ) : (
          <ReportedUsageIcon />
        )}
      </Box>
      <Box className={"capacityRow"}>
        <Box>
          <Box className={"usedLabel"}>Used:</Box>
          <Box className={"totalUsed"}>
            <div className="value">{usedConvert.total}</div>
            <div className="unit">{usedConvert.unit}</div>
          </Box>
          <Box className={"ofUsed"}>
            <div className="value">Of: {niceBytesInt(totalUsable)}</div>
          </Box>
        </Box>
        <Box
          sx={{
            position: "relative",
            width: 72,
            height: 72,
            flexShrink: 0,
          }}
        >
          <Box className={"donutCenter"}>
            <div className="pct">{`${totalUsableFreeRatio}%`}</div>
            <div className="pctLabel">Free</div>
          </Box>
          <PieChart width={72} height={72}>
            <Pie
              data={plotValues}
              cx={"50%"}
              cy={"50%"}
              dataKey="value"
              outerRadius={34}
              innerRadius={27}
              startAngle={-70}
              endAngle={360}
              animationDuration={1}
            >
              {plotValues.map((entry, index) => (
                <Cell key={`cellCapacity-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </Box>
      </Box>
    </CapacityItemMain>
  );
};

export default CapacityItem;
