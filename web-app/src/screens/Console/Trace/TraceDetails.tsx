// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { Fragment } from "react";
import { Box, ModalBox, TraceIcon } from "mds";
import { useT } from "i18n";
import { niceBytesInt } from "common/utils";
import { TraceMessage } from "./types";

const TraceDetails = ({
  trace,
  onClose,
  restoreFocusTo,
}: {
  trace: TraceMessage;
  onClose: () => void;
  restoreFocusTo: () => HTMLElement | null;
}) => {
  const t = useT();
  const fields = [
    [t("Name"), trace.api],
    [t("Time"), trace.time],
    [t("Status"), `${trace.statusCode} ${trace.statusMsg}`],
    [t("Location"), `${trace.host} · ${trace.client}`],
    [
      t("Path"),
      `${trace.path}${trace.query ? `?${trace.query.replace(/^\?/, "")}` : ""}`,
    ],
    [t("Load Time"), trace.callStats.duration],
    [t("Upload"), niceBytesInt(trace.callStats.rx)],
    [t("Download"), niceBytesInt(trace.callStats.tx)],
  ];

  return (
    <ModalBox
      open
      title={t("Trace")}
      titleIcon={<TraceIcon />}
      onClose={onClose}
      closeLabel={t("Close")}
      restoreFocusTo={restoreFocusTo}
    >
      <Box
        sx={{
          "& dl": {
            display: "grid",
            gridTemplateColumns: "minmax(72px, auto) minmax(0, 1fr)",
            gap: "12px 16px",
            margin: 0,
          },
          "& dt": { color: "var(--muted-foreground)" },
          "& dd": {
            margin: 0,
            minWidth: 0,
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap",
            fontVariantNumeric: "tabular-nums",
          },
        }}
      >
        <dl>
          {fields.map(([label, value]) => (
            <Fragment key={label}>
              <dt>{label}</dt>
              <dd dir="ltr">{value}</dd>
            </Fragment>
          ))}
        </dl>
      </Box>
    </ModalBox>
  );
};

export default TraceDetails;
