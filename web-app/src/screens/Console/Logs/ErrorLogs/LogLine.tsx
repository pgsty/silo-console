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
import React, { Fragment, useState } from "react";
import { DateTime } from "luxon";
import { LogMessage } from "../types";
import {
  Box,
  BoxArrowDown,
  BoxArrowUp,
  TableCell,
  TableRow,
  WarnFilledIcon,
} from "mds";

import getByKey from "lodash/get";
import { useT } from "i18n";

const timestampDisplayFmt = "HH:mm:ss ZZZZ MM/dd/yyyy"; //make this same as server logs format.
const messageForConsoleMsg = (log: LogMessage) => {
  // regex for terminal colors like e.g. `[31;4m `
  const tColorRegex = /((\[[0-9;]+m))/g;

  let fullMessage = log.ConsoleMsg;
  // remove the 0x1B character
  /* eslint-disable no-control-regex */
  fullMessage = fullMessage.replace(/\x1B/g, " ");
  /* eslint-enable no-control-regex */
  // get substring if there was a match for to split what
  // is going to be colored and what not, here we add color
  // only to the first match.
  fullMessage = fullMessage.replace(tColorRegex, "");
  return (
    <div
      style={{
        display: "table",
        tableLayout: "fixed",
        width: "100%",
        paddingInlineStart: 12,
        paddingInlineEnd: 12,
      }}
    >
      <div
        style={{
          display: "table-cell",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflowX: "auto",
        }}
      >
        <pre dir="ltr">{fullMessage}</pre>
      </div>
    </div>
  );
};
export const messageForError = (
  log: LogMessage,
  t: (text: string) => string,
) => {
  const dataStyle = {
    color: "var(--foreground)",
    fontWeight: 400,
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-caption)",
    lineHeight: "var(--lh-caption)",
  };
  const labelStyle = {
    color: "var(--muted-foreground)",
    fontWeight: 550,
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-caption)",
    lineHeight: "var(--lh-caption)",
  };

  const getLogEntryKey = (keyPath: string) => {
    return getByKey(log, keyPath, "");
  };

  const logTime = DateTime.fromFormat(
    log.time.toString(),
    "HH:mm:ss z MM/dd/yyyy",
    {
      zone: "UTC",
    },
  );
  return (
    <Fragment>
      <div>
        <b style={labelStyle}>{t("API:")} &nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("api.name")}</span>
      </div>
      <div>
        <b style={labelStyle}>{t("Time:")} &nbsp;</b>
        <span style={dataStyle}>{logTime.toFormat(timestampDisplayFmt)}</span>
      </div>
      <div>
        <b style={labelStyle}>{t("Deployment ID:")} &nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("deploymentid")}</span>
      </div>
      <div>
        <b style={labelStyle}>{t("Request ID:")} &nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("requestID")}</span>
      </div>
      <div>
        <b style={labelStyle}>{t("Remote host:")} &nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("remotehost")}</span>
      </div>
      <div>
        <b style={labelStyle}>{t("User agent:")} &nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("userAgent")}</span>
      </div>
      <div>
        <b style={labelStyle}>{t("Error:")} &nbsp;</b>
        <span style={{ ...dataStyle, color: "var(--destructive-text)" }}>
          {getLogEntryKey("error.message")}
        </span>
      </div>
      <br />
      <div>
        <b style={labelStyle}>{t("Backtrace:")} &nbsp;</b>
      </div>

      {(log.error.source || []).map((e: any, i: number) => {
        return (
          <div>
            <b style={labelStyle}>{i}:&nbsp;</b>
            <span style={dataStyle}>{e}</span>
          </div>
        );
      })}
    </Fragment>
  );
};

const LogLine = (props: { log: LogMessage }) => {
  const { log } = props;
  const t = useT();
  const [open, setOpen] = useState<boolean>(false);

  const getLogLineKey = (keyPath: string) => {
    return getByKey(log, keyPath, "");
  };

  let logMessage = "";
  let consoleMsg = getLogLineKey("ConsoleMsg");
  let errMsg = getLogLineKey("error.message");
  if (consoleMsg !== "") {
    logMessage = consoleMsg;
  } else if (errMsg !== "") {
    logMessage = errMsg;
  }
  // remove any non ascii characters, exclude any control codes
  let titleLogMessage = (logMessage || "").replace(/━|┏|┓|┃|┗|┛/g, "");
  // remove any non ascii characters, exclude any control codes
  titleLogMessage = titleLogMessage.replace(/([^\x20-\x7F])/g, "");

  // regex for terminal colors like e.g. `[31;4m `
  const tColorRegex = /((\[[0-9;]+m))/g;

  let fullMessage = <Fragment />;
  if (consoleMsg !== "") {
    fullMessage = messageForConsoleMsg(log);
  } else if (errMsg !== "") {
    fullMessage = messageForError(log, t);
  }

  titleLogMessage = (titleLogMessage || "").replace(tColorRegex, "");

  const logTime = DateTime.fromFormat(
    log.time.toString(),
    "HH:mm:ss z MM/dd/yyyy",
    {
      zone: "UTC",
    },
  );
  const dateOfLine = logTime.toJSDate(); //DateTime.fromJSDate(log.time);

  let dateStr = <Fragment>{logTime.toFormat(timestampDisplayFmt)}</Fragment>;

  if (dateOfLine.getFullYear() === 1) {
    dateStr = <Fragment>{t("Not available")}</Fragment>;
  }

  return (
    <React.Fragment key={logTime.toString()}>
      <TableRow
        sx={{
          cursor: "pointer",
          borderInlineStart: "0",
          borderInlineEnd: "0",
        }}
      >
        <TableCell
          onClick={() => setOpen(!open)}
          sx={{
            width: 280,
            color: "var(--muted-foreground)",
            fontSize: "var(--fs-caption)",
            lineHeight: "var(--lh-caption)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 8,
              alignItems: "center",

              "& .min-icon": {
                width: 16,
                height: 16,
                color: "var(--muted-foreground)",
              },
              fontWeight: 550,
              lineHeight: "var(--lh-caption)",
            }}
          >
            <WarnFilledIcon />
            <div>{dateStr}</div>
          </Box>
        </TableCell>
        <TableCell
          onClick={() => setOpen(!open)}
          sx={{
            width: 200,
            color: "var(--muted-foreground)",
            fontSize: "var(--fs-caption)",
            lineHeight: "var(--lh-caption)",
          }}
        >
          <Box
            sx={{
              "& .min-icon": {
                width: 16,
                height: 16,
                color: "var(--muted-foreground)",
              },
              fontWeight: 550,
              lineHeight: "var(--lh-caption)",
            }}
          >
            {log.errKind}
          </Box>
        </TableCell>
        <TableCell onClick={() => setOpen(!open)}>
          <Box
            sx={{
              display: "table",
              tableLayout: "fixed",
              width: "100%",
              paddingInlineStart: 12,
              paddingInlineEnd: 12,
            }}
          >
            <Box
              sx={{
                display: "table-cell",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              <bdi dir="ltr">{titleLogMessage}</bdi>
            </Box>
          </Box>
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ width: 40 }}>
          <Box
            sx={{
              "& .min-icon": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                color: "var(--muted-foreground)",
              },
              "&:hover .min-icon": {
                color: "var(--foreground)",
              },
            }}
          >
            {open ? <BoxArrowUp /> : <BoxArrowDown />}
          </Box>
        </TableCell>
      </TableRow>
      {open ? (
        <TableRow>
          <TableCell
            sx={{
              paddingBottom: 0,
              paddingTop: 0,
              width: 200,
              verticalAlign: "top",
              textAlign: "end",
              color: "var(--muted-foreground)",
              fontWeight: 550,
            }}
          >
            <Box sx={{ marginTop: 12 }}>{t("Log Details")}</Box>
          </TableCell>
          <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
            <Box
              sx={{
                margin: "8px 0 12px",
                padding: 12,
                fontSize: "var(--fs-caption)",
                lineHeight: "var(--lh-caption)",
                background: "var(--muted)",
                borderRadius: "var(--radius-control)",
                "& pre": {
                  margin: 0,
                  font: "inherit",
                  fontFamily: "var(--font-mono)",
                },
              }}
            >
              <div dir="ltr">{fullMessage}</div>
            </Box>
          </TableCell>
          <TableCell sx={{ paddingBottom: 0, paddingTop: 0, width: 40 }} />
        </TableRow>
      ) : null}
    </React.Fragment>
  );
};

export default LogLine;
