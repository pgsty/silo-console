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

import { EmptyState, SkeletonRows } from "common/ui";
import { useMobile } from "common/ui/useMediaQuery";
import { hasPermission } from "common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "common/SecureComponent/permissions";
import { TraceIcon } from "mds";
import { Fragment, useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import {
  Box,
  breakPoints,
  Button,
  Checkbox,
  DataTable,
  FilterIcon,
  IconButton,
  InputBox,
  PageLayout,
  PreviewIcon,
} from "mds";
import { AppState, useAppDispatch } from "../../../store";
import { TraceMessage } from "./types";
import TraceDetails from "./TraceDetails";
import { niceBytes, timeFromDate } from "../../../common/utils";
import { wsProtocol } from "../../../utils/wsUtils";
import {
  setTraceStarted,
  traceMessageReceived,
  traceResetMessages,
} from "./traceSlice";
import { setHelpName } from "../../../systemSlice";
import { i18nKey, useT } from "i18n";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import useWebSocket, { ReadyState } from "react-use-websocket";

const Trace = () => {
  const dispatch = useAppDispatch();
  const t = useT();
  const mobile = useMobile();
  const [selectedTrace, setSelectedTrace] = useState<TraceMessage | null>(null);
  const detailsOrigin = useRef<{
    element: HTMLElement | null;
    action: boolean;
  } | null>(null);

  const showTraceDetails = (event: TraceMessage, origin?: HTMLElement) => {
    detailsOrigin.current = {
      element:
        origin ||
        (document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null),
      action: Boolean(origin),
    };
    setSelectedTrace(event);
  };

  const restoreTraceFocus = () => {
    const row = document
      .getElementById("trace-results")
      ?.querySelector<HTMLElement>(`[data-fluid-key="${selectedTrace?.key}"]`);
    const origin = detailsOrigin.current;
    if (origin?.element && row?.contains(origin.element)) return origin.element;
    // A live or resized virtual table can replace the original button while
    // its detail is open. Keep the same event and entry point on return.
    return (
      (origin?.action
        ? row?.querySelector<HTMLButtonElement>(".trace-details-cell button")
        : null) ||
      row ||
      document.getElementById("trace-results-title")
    );
  };

  const messages = useSelector((state: AppState) => state.trace.messages);
  const traceStarted = useSelector(
    (state: AppState) => state.trace.traceStarted,
  );

  const canStartTrace = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_SERVER_TRACE,
  ]);
  const [statusCode, setStatusCode] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [func, setFunc] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(0);
  const [all, setAll] = useState<boolean>(false);
  const [s3, setS3] = useState<boolean>(true);
  const [internal, setInternal] = useState<boolean>(false);
  const [storage, setStorage] = useState<boolean>(false);
  const [os, setOS] = useState<boolean>(false);
  const [errors, setErrors] = useState<boolean>(false);

  const [toggleFilter, setToggleFilter] = useState<boolean>(false);
  const [logActive, setLogActive] = useState(false);
  const [wsUrl, setWsUrl] = useState<string>("");

  useEffect(() => {
    const url = new URL(window.location.toString());
    const wsProt = wsProtocol(url.protocol);
    const port = process.env.NODE_ENV === "development" ? "9090" : url.port;
    const calls = all
      ? "all"
      : (() => {
          const c = [];
          if (s3) c.push("s3");
          if (internal) c.push("internal");
          if (storage) c.push("storage");
          if (os) c.push("os");
          return c.join(",");
        })();

    // check if we are using base path, if not this always is `/`
    const baseLocation = new URL(document.baseURI).pathname;

    const wsUrl = new URL(
      `${wsProt}://${url.hostname}:${port}${baseLocation}ws/trace`,
    );
    wsUrl.searchParams.append("calls", calls);
    wsUrl.searchParams.append("threshold", threshold.toString());
    wsUrl.searchParams.append("onlyErrors", errors ? "yes" : "no");
    wsUrl.searchParams.append("statusCode", statusCode);
    wsUrl.searchParams.append("method", method);
    wsUrl.searchParams.append("funcname", func);
    wsUrl.searchParams.append("path", path);
    setWsUrl(wsUrl.href);
  }, [
    all,
    s3,
    internal,
    storage,
    os,
    threshold,
    errors,
    statusCode,
    method,
    func,
    path,
  ]);

  const { sendMessage, lastJsonMessage, readyState } =
    useWebSocket<TraceMessage>(
      wsUrl,
      {
        heartbeat: {
          message: "ok",
          interval: 10 * 1000, // send ok every 10 seconds
          timeout: 365 * 24 * 60 * 60 * 1000, // disconnect after 365 days (workaround, because heartbeat gets no response)
        },
      },
      logActive,
    );

  useEffect(() => {
    if (readyState === ReadyState.CONNECTING) {
      dispatch(traceResetMessages());
    } else if (readyState === ReadyState.OPEN) {
      dispatch(setTraceStarted(true));
    } else if (readyState === ReadyState.CLOSED) {
      dispatch(setTraceStarted(false));
    }
  }, [readyState, dispatch, sendMessage]);

  useEffect(() => {
    if (lastJsonMessage) {
      lastJsonMessage.ptime = DateTime.fromISO(lastJsonMessage.time).toJSDate();
      lastJsonMessage.key = Math.random();
      dispatch(traceMessageReceived(lastJsonMessage));
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    dispatch(setHelpName("trace"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper titleElement="h1" label={i18nKey("Trace")} help />
      <PageLayout>
        <Box
          withBorders
          sx={{
            minWidth: 0,
            padding: 24,
            "& h2": {
              margin: "0 0 16px",
              fontSize: "var(--fs-title)",
              lineHeight: "var(--lh-title)",
              fontWeight: 550,
            },
            "& h2:focus-visible": {
              outline: "2px solid var(--focus-ring)",
              outlineOffset: 2,
            },
            [`@media (max-width: ${breakPoints.md - 0.02}px)`]: {
              padding: 16,
            },
          }}
        >
          <h2>{t("Calls to Trace")}</h2>
          <Box
            className="trace-toolbar"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 16,
              minWidth: 0,
            }}
          >
            <Box
              role="group"
              aria-label={t("Calls to Trace")}
              sx={{
                display: "flex",
                flex: "1 1 280px",
                flexWrap: "wrap",
                gap: "8px 16px",
                minWidth: 0,
                "& .inputItem": { margin: 0 },
                "& label": { marginInlineEnd: 0 },
              }}
            >
              <Checkbox
                checked={all}
                id="all_calls"
                name="all_calls"
                label={t("All")}
                onChange={() => setAll(!all)}
                value="all"
                disabled={traceStarted}
              />
              <Checkbox
                checked={s3 || all}
                id="s3_calls"
                name="s3_calls"
                label="S3"
                onChange={() => setS3(!s3)}
                value="s3"
                disabled={all || traceStarted}
              />
              <Checkbox
                checked={internal || all}
                id="internal_calls"
                name="internal_calls"
                label={t("Internal")}
                onChange={() => setInternal(!internal)}
                value="internal"
                disabled={all || traceStarted}
              />
              <Checkbox
                checked={storage || all}
                id="storage_calls"
                name="storage_calls"
                label={t("Storage")}
                onChange={() => setStorage(!storage)}
                value="storage"
                disabled={all || traceStarted}
              />
              <Checkbox
                checked={os || all}
                id="os_calls"
                name="os_calls"
                label="OS"
                onChange={() => setOS(!os)}
                value="os"
                disabled={all || traceStarted}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
                [`@media (max-width: ${breakPoints.md - 0.02}px)`]: {
                  width: "100%",
                  "& > *": { flex: 1, minWidth: 0 },
                  "& button": { width: "100%" },
                },
              }}
            >
              <TooltipWrapper tooltip={t("More filter options")}>
                <Button
                  id="filter-toggle"
                  onClick={() => setToggleFilter(!toggleFilter)}
                  label={t("Filters")}
                  icon={<FilterIcon />}
                  variant="regular"
                  collapseOnSmall={false}
                  aria-expanded={toggleFilter}
                  aria-controls={toggleFilter ? "trace-filters" : undefined}
                />
              </TooltipWrapper>
              {!traceStarted ? (
                <Button
                  id="start-trace"
                  disabled={
                    !canStartTrace || readyState === ReadyState.CONNECTING
                  }
                  label={t("Start")}
                  data-test-id="trace-start-button"
                  variant="callAction"
                  onClick={() => setLogActive(true)}
                />
              ) : (
                <Button
                  id="stop-trace"
                  label={t("Stop")}
                  variant="regular"
                  onClick={() => setLogActive(false)}
                />
              )}
            </Box>
          </Box>
          {toggleFilter && (
            <Box
              id="trace-filters"
              role="group"
              aria-label={t("Filters")}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
                marginTop: 24,
                paddingTop: 24,
                borderTop: "1px solid var(--border)",
                "& .trace-filter-field": {
                  flexDirection: "column",
                  minWidth: 0,
                  margin: 0,
                  gap: 8,
                  "& > .inputLabel": {
                    margin: 0,
                    minHeight: 0,
                    fontWeight: 550,
                    whiteSpace: "normal",
                  },
                },
                [`@media (max-width: ${breakPoints.lg - 0.02}px)`]: {
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                },
                [`@media (max-width: ${breakPoints.md - 0.02}px)`]: {
                  gridTemplateColumns: "minmax(0, 1fr)",
                },
              }}
            >
              <InputBox
                className="trace-filter-field"
                noLabelMinWidth
                id="trace-status-code"
                name="trace-status-code"
                label={t("Status Code")}
                placeholder={t("e.g. 503")}
                value={statusCode}
                onChange={(e) => setStatusCode(e.target.value)}
                disabled={traceStarted}
              />
              <InputBox
                className="trace-filter-field"
                noLabelMinWidth
                id="trace-function-name"
                name="trace-function-name"
                label={t("Function Name")}
                placeholder={t("e.g. FunctionName2055")}
                value={func}
                onChange={(e) => setFunc(e.target.value)}
                disabled={traceStarted}
              />
              <InputBox
                className="trace-filter-field"
                noLabelMinWidth
                id="trace-method"
                name="trace-method"
                label={t("Method")}
                placeholder={t("e.g. Method 2056")}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                disabled={traceStarted}
              />
              <InputBox
                className="trace-filter-field"
                noLabelMinWidth
                id="trace-path"
                name="trace-path"
                label={t("Path")}
                placeholder={t("e.g. my-bucket/my-prefix/*")}
                value={path}
                onChange={(e) => setPath(e.target.value)}
                disabled={traceStarted}
              />
              <InputBox
                className="trace-filter-field"
                noLabelMinWidth
                id="trace-fthreshold"
                name="trace-fthreshold"
                label={t("Response Threshold")}
                type="number"
                min={0}
                value={`${threshold}`}
                onChange={(e) =>
                  setThreshold(parseInt(e.target.value, 10) || 0)
                }
                disabled={traceStarted}
              />
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Checkbox
                  checked={errors}
                  id="only_errors"
                  name="only_errors"
                  label={t("Display only Errors")}
                  onChange={() => setErrors(!errors)}
                  value="only_errors"
                  disabled={traceStarted}
                />
              </Box>
            </Box>
          )}
          <Box id="trace-results" sx={{ marginTop: 24, minWidth: 0 }}>
            <h2 id="trace-results-title" tabIndex={-1}>
              {t("Trace Results")}
            </h2>
            <DataTable
              columns={[
                {
                  label: t("Time"),
                  elementKey: "ptime",
                  renderFunction: (time: Date) => {
                    const formatted = timeFromDate(new Date(time));
                    return (
                      <bdi dir="ltr">
                        {mobile ? formatted.slice(0, 8) : formatted}
                      </bdi>
                    );
                  },
                  width: mobile ? 76 : 104,
                  priority: "high",
                },
                {
                  label: t("Name"),
                  elementKey: "api",
                  priority: "high",
                  renderFunction: (name: string) => <bdi dir="ltr">{name}</bdi>,
                },
                {
                  label: t("Status"),
                  elementKey: "statusCode",
                  renderFunction: (event: TraceMessage) => (
                    <bdi dir="ltr">
                      {mobile
                        ? event.statusCode
                        : `${event.statusCode} ${event.statusMsg}`}
                    </bdi>
                  ),
                  renderFullObject: true,
                  width: mobile ? 64 : 112,
                  priority: "high",
                },
                {
                  label: t("Location"),
                  elementKey: "host",
                  renderFunction: (event: TraceMessage) => (
                    <bdi dir="ltr">{`${event.host} ${event.client}`}</bdi>
                  ),
                  renderFullObject: true,
                  priority: "low",
                },
                {
                  label: t("Load Time"),
                  elementKey: "callStats.duration",
                  width: 88,
                  priority: "low",
                },
                {
                  label: t("Upload"),
                  elementKey: "callStats.rx",
                  renderFunction: niceBytes,
                  width: 80,
                  priority: "low",
                },
                {
                  label: t("Download"),
                  elementKey: "callStats.tx",
                  renderFunction: niceBytes,
                  width: 80,
                  priority: "low",
                },
                {
                  label: t("View"),
                  elementKey: "details",
                  renderFullObject: true,
                  width: 44,
                  priority: "high",
                  enableSort: false,
                  globalClass: "trace-details-cell",
                  renderFunction: (event: TraceMessage) => (
                    <IconButton
                      label={`${t("View")} ${event.api}`}
                      aria-haspopup="dialog"
                      aria-expanded={selectedTrace?.key === event.key}
                      size="small"
                      onClick={(click) => {
                        click.stopPropagation();
                        showTraceDetails(event, click.currentTarget);
                      }}
                    >
                      <PreviewIcon />
                    </IconButton>
                  ),
                },
              ]}
              itemActions={[{ type: "view", onClick: showTraceDetails }]}
              sx={{
                "&.responsiveColumns .trace-details-cell": {
                  padding: 0,
                  textAlign: "center",
                  overflow: "visible",
                  "& .sortHeader": { justifyContent: "center" },
                },
                "& [role=row]:focus-visible": {
                  outline: "2px solid var(--focus-ring)",
                  outlineOffset: -2,
                },
              }}
              isLoading={readyState === ReadyState.CONNECTING}
              loadingState={<SkeletonRows rows={5} columns={3} />}
              records={messages}
              entityName={t("Trace Results")}
              idField="key"
              emptyState={
                <EmptyState
                  icon={<TraceIcon />}
                  title={
                    traceStarted
                      ? t("Waiting for trace events")
                      : t("Trace is not running")
                  }
                  description={
                    traceStarted
                      ? t(
                          "Requests matching the selected calls and filters will appear here.",
                        )
                      : t(
                          "Choose the calls and filters, then start tracing to inspect live requests.",
                        )
                  }
                  action={
                    !traceStarted &&
                    canStartTrace && (
                      <Button
                        id="empty-start-trace"
                        variant="callAction"
                        label={t("Start")}
                        onClick={() => setLogActive(true)}
                      />
                    )
                  }
                />
              }
              customPaperHeight="clamp(240px, 50vh, 600px)"
              autoScrollToBottom
            />
          </Box>
        </Box>
      </PageLayout>
      {selectedTrace && (
        <TraceDetails
          trace={selectedTrace}
          onClose={() => setSelectedTrace(null)}
          restoreFocusTo={restoreTraceFocus}
        />
      )}
    </Fragment>
  );
};

export default Trace;
