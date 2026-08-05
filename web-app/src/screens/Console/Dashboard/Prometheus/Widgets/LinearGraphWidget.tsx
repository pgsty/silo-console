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
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, breakPoints, Loader } from "mds";
import { ILinearGraphConfiguration } from "./types";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";
import api from "../../../../../common/api";
import LineChartTooltip from "./tooltips/LineChartTooltip";
import ExpandGraphLink from "./ExpandGraphLink";
import DownloadWidgetDataButton from "../../DownloadWidgetDataButton";
import { useT } from "i18n";

interface ILinearGraphWidget {
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
  hideYAxis?: boolean;
  yAxisFormatter?: (item: string) => string;
  xAxisFormatter?: (item: string, var1: boolean, var2: boolean) => string;
  areaWidget?: boolean;
  zoomActivated?: boolean;
}

const LinearGraphMain = styled.div(({ theme }) => ({
  ...widgetCommon(theme),
  "& .chartCont": {
    position: "relative",
    flex: "1 1 auto",
    minWidth: 0,
    height: 200,
  },
  "& .legendChart": {
    display: "flex",
    flexDirection: "column",
    flex: "0 0 auto",
    maxWidth: "44%",
    // 8 whole 22px rows + 7 row gaps; keeps the overflow cutoff on a row boundary
    maxHeight: 8 * 22 + 7 * 2,
    margin: 0,
    overflowY: "auto",
    scrollbarWidth: "thin",
    position: "relative",
    justifyContent: "flex-start",
    gap: 2,
    paddingLeft: 12,
    color: get(theme, "mutedText", "#87888d"),
    fontWeight: 400,
    fontSize: 12,
    [`@media (max-width: ${breakPoints.md}px)`]: {
      display: "none",
    },
  },
  "& .loadingAlign": {
    width: 40,
    height: 40,
    textAlign: "center",
    margin: "80px auto",
  },
}));

const LinearGraphWidget = ({
  title,
  timeStart,
  timeEnd,
  panelItem,
  apiPrefix,
  hideYAxis = false,
  areaWidget = false,
  yAxisFormatter = (item: string) => item,
  xAxisFormatter = (item: string, var1: boolean, var2: boolean) => item,
  zoomActivated = false,
}: ILinearGraphWidget) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const [data, setData] = useState<object[]>([]);
  const [csvData, setCsvData] = useState<object[]>([]);
  const [dataMax, setDataMax] = useState<number>(0);
  const [result, setResult] = useState<IDashboardPanel | null>(null);
  const widgetVersion = useSelector(
    (state: AppState) => state.dashboard.widgetLoadVersion,
  );

  const componentRef = useRef(null);

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
          let maxVal = 0;
          for (const dp of widgetsWithValue.data) {
            for (const key in dp) {
              if (key === "name") {
                continue;
              }
              let val = parseFloat(dp[key]);

              if (isNaN(val)) {
                val = 0;
              }

              if (maxVal < val) {
                maxVal = val;
              }
            }
          }
          setDataMax(maxVal);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, dispatch, apiPrefix]);

  let intervalCount = Math.floor(data.length / 5);

  const onHover = () => {
    setHover(true);
  };

  const onStopHover = () => {
    setHover(false);
  };

  useEffect(() => {
    const fmtData = data.map((el: any) => {
      const date = new Date(el?.name * 1000);
      return {
        ...el,
        name: date,
      };
    });

    setCsvData(fmtData);
  }, [data]);

  const linearConfiguration = result
    ? (result?.widgetConfiguration as ILinearGraphConfiguration[])
    : [];

  const CustomizedDot = (prop: any) => {
    const { cx, cy, index } = prop;

    if (index % 3 !== 0) {
      return null;
    }
    return <circle cx={cx} cy={cy} r={3} strokeWidth={0} fill="#07264A" />;
  };

  let dspLongDate = false;

  if (zoomActivated) {
    dspLongDate = true;
  }

  return (
    <LinearGraphMain>
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
              {componentRef !== null && (
                <DownloadWidgetDataButton
                  title={title}
                  componentRef={componentRef}
                  data={csvData}
                />
              )}
            </Box>
          </Box>
        )}
        <div ref={componentRef}>
          <Box
            sx={
              zoomActivated
                ? { flexDirection: "column" }
                : {
                    display: "flex",
                    alignItems: "stretch",
                  }
            }
          >
            {loading && <Loader className={"loadingAlign"} />}
            {!loading && data.length === 0 && (
              <Box className={"emptyStateContainer"}>
                {t("No data available")}
              </Box>
            )}
            {!loading && data.length > 0 && (
              <Fragment>
                <Box className={zoomActivated ? "zoomChartCont" : "chartCont"}>
                  <ResponsiveContainer
                    width="99%"
                    initialDimension={{ width: 820, height: 200 }}
                  >
                    <AreaChart
                      data={data}
                      margin={{
                        top: 5,
                        right: 20,
                        left: hideYAxis ? 20 : 5,
                        bottom: 0,
                      }}
                    >
                      {areaWidget && (
                        <defs>
                          <linearGradient
                            id="colorUv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#2781B0"
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor={get(theme, "bgColor", "#ffffff")}
                              stopOpacity={0}
                            />

                            <stop
                              offset="95%"
                              stopColor={get(theme, "bgColor", "#ffffff")}
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        </defs>
                      )}
                      <CartesianGrid
                        strokeWidth={1}
                        strokeOpacity={0.6}
                        stroke={get(theme, "borderColor", "#E2E2E2")}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tickFormatter={(value: any) =>
                          xAxisFormatter(value, dspLongDate, true)
                        }
                        interval={intervalCount}
                        tick={{
                          fontSize: 11,
                          fill: get(theme, "mutedText", "#87888d"),
                        }}
                        tickLine={false}
                        tickCount={10}
                        stroke={get(theme, "borderColor", "#E2E2E2")}
                      />
                      <YAxis
                        type={"number"}
                        domain={[0, dataMax * 1.1]}
                        hide={hideYAxis}
                        tickFormatter={(value: any) => yAxisFormatter(value)}
                        tick={{
                          fontSize: 11,
                          fill: get(theme, "mutedText", "#87888d"),
                        }}
                        tickLine={false}
                        stroke={get(theme, "borderColor", "#E2E2E2")}
                      />
                      {linearConfiguration.map((section, index) => {
                        return (
                          <Area
                            key={`area-${section.dataKey}-${index.toString()}`}
                            type="monotone"
                            dataKey={section.dataKey}
                            isAnimationActive={false}
                            stroke={!areaWidget ? section.lineColor : "#D7E5F8"}
                            fill={
                              areaWidget ? "url(#colorUv)" : section.fillColor
                            }
                            fillOpacity={areaWidget ? 0.65 : 0}
                            strokeWidth={!areaWidget ? 2 : 0}
                            strokeLinecap={"round"}
                            dot={areaWidget ? <CustomizedDot /> : false}
                          />
                        );
                      })}
                      <Tooltip
                        content={
                          <LineChartTooltip
                            linearConfiguration={linearConfiguration}
                            yAxisFormatter={yAxisFormatter}
                          />
                        }
                        wrapperStyle={{
                          zIndex: 5000,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                {!areaWidget && (
                  <Fragment>
                    {zoomActivated && (
                      <Fragment>
                        <strong>{t("Series")}</strong>
                        <br />
                        <br />
                      </Fragment>
                    )}

                    <Box className={"legendChart"}>
                      {linearConfiguration.map((section, index) => {
                        return (
                          <Box
                            className={"singleLegendContainer"}
                            key={`legend-${
                              section.keyLabel
                            }-${index.toString()}`}
                          >
                            <Box
                              className={"colorContainer"}
                              style={{ backgroundColor: section.lineColor }}
                            />
                            <Box
                              className={"legendLabel"}
                              title={section.keyLabel}
                            >
                              {section.keyLabel}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Fragment>
                )}
              </Fragment>
            )}
          </Box>
        </div>
      </Box>
    </LinearGraphMain>
  );
};

export default LinearGraphWidget;
