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

import React, { Fragment, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import get from "lodash/get";
import { Box, breakPoints, Loader } from "mds";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IBarChartConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";
import ExpandGraphLink from "./ExpandGraphLink";
import DownloadWidgetDataButton from "../../DownloadWidgetDataButton";
import BarChartTooltip from "./tooltips/BarChartTooltip";
import api from "../../../../../common/api";
import { useT } from "i18n";

interface IBarChartWidget {
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
  zoomActivated?: boolean;
}

const BarChartMain = styled.div(({ theme }) => ({
  ...widgetCommon(theme),
  "& .loadingAlign": {
    width: "100%",
    height: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const CustomizedAxisTick = ({ y, payload, fill }: any) => {
  return (
    <text
      width={50}
      fontSize={11}
      textAnchor="start"
      fill={fill || "#333"}
      transform={`translate(5,${y})`}
      fontWeight={400}
      dy={3}
    >
      {payload.value}
    </text>
  );
};

const BarChartWidget = ({
  title,
  panelItem,
  timeStart,
  timeEnd,
  apiPrefix,
  zoomActivated = false,
}: IBarChartWidget) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const t = useT();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [result, setResult] = useState<IDashboardPanel | null>(null);
  const [hover, setHover] = useState<boolean>(false);
  const [biggerThanMd, setBiggerThanMd] = useState<boolean>(
    window.innerWidth >= breakPoints.md,
  );

  const componentRef = useRef<HTMLElement>(null);
  const widgetVersion = useSelector(
    (state: AppState) => state.dashboard.widgetLoadVersion,
  );

  const onHover = () => {
    setHover(true);
  };
  const onStopHover = () => {
    setHover(false);
  };

  useEffect(() => {
    setLoading(true);
  }, [widgetVersion]);

  useEffect(() => {
    const handleWindowResize = () => {
      let extMD = false;
      if (window.innerWidth >= breakPoints.md) {
        extMD = true;
      }
      setBiggerThanMd(extMD);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

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
          `/api/v1/${apiPrefix}/info/widgets/${
            panelItem.id
          }/?step=${stepCalc}&${
            timeStart !== null ? `&start=${timeStart.toUnixInteger()}` : ""
          }${timeStart !== null && timeEnd !== null ? "&" : ""}${
            timeEnd !== null ? `end=${timeEnd.toUnixInteger()}` : ""
          }`,
        )
        .then((res: any) => {
          const widgetsWithValue = widgetDetailsToPanel(res, panelItem);
          setData(widgetsWithValue.data);
          setResult(widgetsWithValue);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, dispatch, apiPrefix]);

  const barChartConfiguration = result
    ? (result.widgetConfiguration as IBarChartConfiguration[])
    : [];

  let greatestIndex = 0;
  let currentValue = 0;

  if (barChartConfiguration.length === 1) {
    const dataGraph = barChartConfiguration[0];
    data.forEach((item: any, index: number) => {
      if (item[dataGraph.dataKey] > currentValue) {
        currentValue = item[dataGraph.dataKey];
        greatestIndex = index;
      }
    });
  }

  return (
    <BarChartMain>
      <Box
        className={zoomActivated ? "" : "singleValueContainer"}
        onMouseOver={onHover}
        onMouseLeave={onStopHover}
      >
        {!zoomActivated && (
          <Box className={"widgetHeader"}>
            <Box className={"titleContainer"}>{title}</Box>
            <Box className={"widgetActions"}>
              <Box className={"actionSlot"}>
                {hover && <ExpandGraphLink panelItem={panelItem} />}
              </Box>
              <DownloadWidgetDataButton
                title={title}
                componentRef={componentRef}
                data={data}
              />
            </Box>
          </Box>
        )}
        <div ref={componentRef as React.RefObject<HTMLDivElement>}>
          {loading && (
            <Box className={"loadingAlign"}>
              <Loader />
            </Box>
          )}
          {!loading && data.length === 0 && (
            <Box className={"emptyStateContainer"}>
              {t("No data available")}
            </Box>
          )}
          {!loading && data.length > 0 && (
            <div
              className={zoomActivated ? "zoomChartCont" : "contentContainer"}
            >
              <ResponsiveContainer
                width="99%"
                initialDimension={{ width: 820, height: 200 }}
              >
                <BarChart
                  data={data as object[]}
                  layout={"vertical"}
                  barCategoryGap={1}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    interval={0}
                    tick={
                      <CustomizedAxisTick
                        fill={get(theme, "mutedText", "#87888d")}
                      />
                    }
                    tickLine={false}
                    axisLine={false}
                    width={150}
                    hide={!biggerThanMd}
                    style={{
                      fontSize: "12px",
                      fontWeight: 100,
                    }}
                  />
                  {barChartConfiguration.map((bar) => (
                    <Bar
                      key={`bar-${bar.dataKey}`}
                      dataKey={bar.dataKey}
                      fill={bar.color}
                      background={{
                        ...bar.background,
                        fill: get(theme, "borderColor", "#E2E2E2"),
                        fillOpacity: 0.35,
                      }}
                      barSize={zoomActivated ? 25 : 12}
                    >
                      {barChartConfiguration.length === 1 ? (
                        <Fragment>
                          {data.map((_: any, index: number) => (
                            <Cell
                              key={`chart-bar-${index.toString()}`}
                              fill={
                                index === greatestIndex
                                  ? bar.greatestColor
                                  : bar.color
                              }
                            />
                          ))}
                        </Fragment>
                      ) : null}
                    </Bar>
                  ))}
                  <Tooltip
                    cursor={{
                      fill: get(theme, "boxBackground", "#FBFAFA"),
                      fillOpacity: 0.6,
                    }}
                    content={
                      <BarChartTooltip
                        barChartConfiguration={barChartConfiguration}
                      />
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Box>
    </BarChartMain>
  );
};

export default BarChartWidget;
