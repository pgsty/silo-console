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
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Grid, HelpBox, InfoIcon, Loader, PageLayout } from "mds";
import {
  DiagStatError,
  DiagStatInProgress,
  DiagStatSuccess,
  HealthInfoMessage,
  ReportMessage,
} from "./types";
import { AppState, useAppDispatch } from "../../../store";
import {
  WSCloseAbnormalClosure,
  WSCloseInternalServerErr,
  WSClosePolicyViolation,
  wsProtocol,
} from "../../../utils/wsUtils";
import { setHelpName, setServerDiagStat } from "../../../systemSlice";
import {
  healthInfoMessageReceived,
  healthInfoResetMessage,
} from "./healthInfoSlice";
import { useT } from "i18n";
import TestWrapper from "../Common/TestWrapper/TestWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import HealthInfoResults from "./HealthInfoResults";
import { useDiagnosticSocket } from "../Common/Hooks/useDiagnosticSocket";

const HealthInfo = () => {
  const dispatch = useAppDispatch();
  const t = useT();

  const message = useSelector((state: AppState) => state.healthInfo.message);

  const serverDiagnosticStatus = useSelector(
    (state: AppState) => state.system.serverDiagnosticStatus,
  );
  const [startDiagnostic, setStartDiagnostic] = useState(false);

  const [downloadDisabled, setDownloadDisabled] = useState(true);
  const [localMessage, setMessage] = useState<string>("");
  const [buttonStartText, setButtonStartText] = useState<string>(
    "Start Health Report",
  );
  const [title, setTitle] = useState<string>("Health Report");
  const [diagFileContent, setDiagFileContent] = useState<string>("");
  const [reportStatus, setReportStatus] = useState<string>("");
  const [serverHealthInfo, setServerHealthInfo] = useState<HealthInfoMessage>();

  const download = () => {
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:application/gzip;base64,${diagFileContent}`,
    );
    element.setAttribute("download", "diagnostic.json.gz");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  useEffect(() => {
    if (serverDiagnosticStatus === DiagStatInProgress) {
      setTitle("Health Report in progress...");
      setMessage(
        "Health Report started. Please do not refresh page during diagnosis.",
      );
      return;
    }

    if (serverDiagnosticStatus === DiagStatSuccess) {
      setTitle("Health Report complete");
      setMessage("Health Report file is ready to be downloaded.");
      setButtonStartText("Start Health Report");
      return;
    }

    if (serverDiagnosticStatus === DiagStatError) {
      setTitle("Error");
      setMessage("An error occurred while getting the Health Report file.");
      setButtonStartText("Retry Health Report");
      return;
    }
  }, [serverDiagnosticStatus, startDiagnostic]);

  useEffect(() => {
    if (
      serverDiagnosticStatus === DiagStatSuccess &&
      message &&
      Object.keys(message).length > 0
    ) {
      // Allow download of diagnostics file only when
      // it succeded fetching all the results and info is not empty.
      setDownloadDisabled(false);
    }
    if (serverDiagnosticStatus === DiagStatInProgress) {
      // Disable Start Health Report and Disable Download buttons
      // if a Diagnosis is in progress.
      setDownloadDisabled(true);
    }
    setStartDiagnostic(false);
  }, [serverDiagnosticStatus, message]);

  const healthSocket = useDiagnosticSocket();

  // A report that is still running when the page unmounts is cancelled with
  // its socket (the hook closes it); reset the shared status so the page does
  // not come back in an "in progress" state nothing can finish.
  useEffect(() => {
    return () => {
      dispatch(setServerDiagStat(""));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!startDiagnostic) {
      return;
    }
    dispatch(healthInfoResetMessage());
    setDiagFileContent("");
    setServerHealthInfo(undefined);
    const url = new URL(window.location.toString());
    const isDev = process.env.NODE_ENV === "development";
    const port = isDev ? "9090" : url.port;

    const wsProt = wsProtocol(url.protocol);

    // check if we are using base path, if not this always is `/`
    const baseLocation = new URL(document.baseURI);
    const baseUrl = baseLocation.pathname;

    healthSocket.open({
      url: `${wsProt}://${url.hostname}:${port}${baseUrl}ws/health-info?deadline=1h`,
      openMessage: "ok",
      heartbeatMs: 10 * 1000,
      onOpen: () => {
        setMessage(
          "Health Report started. Please do not refresh page during diagnosis.",
        );
        dispatch(setServerDiagStat(DiagStatInProgress));
      },
      onMessage: (message: MessageEvent) => {
        let m: ReportMessage = JSON.parse(message.data.toString());
        if (m.serverHealthInfo) {
          dispatch(healthInfoMessageReceived(m.serverHealthInfo));
          setServerHealthInfo(m.serverHealthInfo);
        }
        if (m.encoded !== "") {
          setDiagFileContent(m.encoded);
        }
        if (m.reportStatus) {
          setReportStatus(m.reportStatus);
        }
      },
      onError: (error) => {
        console.error("error closing websocket:", error);
        healthSocket.close(1000);
        dispatch(setServerDiagStat(DiagStatError));
      },
      onClose: (event: CloseEvent) => {
        if (
          event.code === WSCloseInternalServerErr ||
          event.code === WSClosePolicyViolation ||
          event.code === WSCloseAbnormalClosure
        ) {
          // handle close with error
          console.log("connection closed by server with code:", event.code);
          setMessage("An error occurred while getting the Health Report file.");
          dispatch(setServerDiagStat(DiagStatError));
        } else {
          console.log("connection closed by server");

          setMessage("Health Report file is ready to be downloaded.");
          dispatch(setServerDiagStat(DiagStatSuccess));
        }
      },
    });
  }, [startDiagnostic, dispatch, healthSocket]);

  const startDiagnosticAction = () => {
    setStartDiagnostic(true);
  };

  useEffect(() => {
    dispatch(setHelpName("health_info"));
  }, [dispatch]);

  return (
    <Fragment>
      <PageHeaderWrapper label="Health" actions={<HelpMenu />} />

      <PageLayout>
        <Box withBorders>
          <TestWrapper title={t(title)}>
            <Grid
              container
              sx={{
                justifyContent: "flex-start",
                gap: 20,
              }}
            >
              <Grid
                key="start-download"
                item
                xs={12}
                sx={{
                  textAlign: "center",
                  marginBottom: 25,
                }}
              >
                <h2>{t(localMessage)}</h2>
                <Box
                  sx={{
                    textAlign: "center",
                    marginBottom: 25,
                  }}
                >
                  {" "}
                  {reportStatus !== "" &&
                    !reportStatus.toLowerCase().includes("error") && (
                      <Grid item xs={12}>
                        <strong>
                          {t("Health report generated successfully!")}
                        </strong>
                        &nbsp;{" "}
                        <strong>
                          {t(
                            "You can download the the Health report JSON File.",
                          )}
                        </strong>
                      </Grid>
                    )}
                  {(reportStatus === "" ||
                    reportStatus.toLowerCase().includes("error")) &&
                    serverDiagnosticStatus === DiagStatSuccess && (
                      <Grid item xs={12}>
                        <strong>{t("Something went wrong.")}</strong>
                        &nbsp;{" "}
                        <strong>
                          {t(
                            "May try again or download Health report JSON File.",
                          )}
                        </strong>
                      </Grid>
                    )}
                </Box>
                {serverDiagnosticStatus === DiagStatInProgress ? (
                  <Box
                    sx={{
                      paddingTop: 8,
                      paddingLeft: 40,
                    }}
                  >
                    <Loader style={{ width: 25, height: 25 }} />
                  </Box>
                ) : (
                  <Fragment>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box>
                        {serverDiagnosticStatus !== DiagStatError &&
                          !downloadDisabled && (
                            <Button
                              id={"download"}
                              type="submit"
                              variant="callAction"
                              onClick={() => download()}
                              disabled={downloadDisabled}
                              label={t("Download")}
                            />
                          )}
                      </Box>
                      <Box>
                        <Button
                          id="start-new-diagnostic"
                          type="submit"
                          variant={"callAction"}
                          disabled={startDiagnostic}
                          onClick={startDiagnosticAction}
                          label={t(buttonStartText)}
                        />
                      </Box>
                    </Box>
                  </Fragment>
                )}
              </Grid>
            </Grid>
          </TestWrapper>
        </Box>
        {!startDiagnostic && (
          <Fragment>
            <br />
            {serverHealthInfo === undefined ? (
              <HelpBox
                title={t(
                  "Cluster Health Report will be generated, you will be able to download the JSON File.",
                )}
                iconComponent={<InfoIcon />}
                help={t(
                  "If the Health report cannot be generated at this time, please wait a moment and try again.",
                )}
              />
            ) : (
              <HealthInfoResults
                serverHealthInfo={serverHealthInfo}
              ></HealthInfoResults>
            )}
          </Fragment>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default HealthInfo;
