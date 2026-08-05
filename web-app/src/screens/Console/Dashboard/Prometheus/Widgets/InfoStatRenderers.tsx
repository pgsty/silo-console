// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
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
import { Box } from "mds";
import TimeStatItem, { TimeStatStatus } from "../../TimeStatItem";
import { niceDays } from "../../../../../common/utils";
import { useT } from "i18n";

export type SimpleWidgetRenderProps = {
  valueToRender?: any;
  loading?: boolean;
  title?: any;
  id?: number;
  iconWidget?: any;
};

const RowShell = ({ children }: { children: any }) => (
  <Box
    sx={{
      display: "flex",
      height: 47,
      borderRadius: 2,

      "& .dashboard-time-stat-item": {
        height: "100%",
        width: "100%",
      },
    }}
  >
    {children}
  </Box>
);

// Erasure Health (widget 80). The backend query resolves to 1 (healthy),
// 0 (unhealthy — produced by the write-quorum guard, because the server skips
// exporting zero-valued samples) or empty (metrics unreachable / erasure group
// absent), so "no data" must render as Unknown, never as a health verdict.
export const ErasureHealthRenderer = ({
  valueToRender = "",
  loading = false,
  title = "Erasure Health",
  iconWidget = null,
}: SimpleWidgetRenderProps) => {
  const t = useT();
  const raw = `${valueToRender}`.trim();
  const num = raw === "" ? NaN : Number(raw);

  let value = t("Unknown");
  let status: TimeStatStatus = "muted";
  if (!Number.isNaN(num)) {
    if (num >= 1) {
      value = t("Healthy");
      status = "ok";
    } else {
      value = t("Unhealthy");
      status = "danger";
    }
  }

  return (
    <RowShell>
      <TimeStatItem
        loading={loading}
        icon={iconWidget}
        label={<Box>{title}</Box>}
        value={value}
        status={status}
      />
    </RowShell>
  );
};

// Usage Data Age (widget 81): age in seconds of the scanner-produced usage
// data behind the Usage/Objects/Buckets cards. Empty until the first scanner
// cycle completes (or when metrics are unreachable).
export const UsageAgeRenderer = ({
  valueToRender = "",
  loading = false,
  title = "Usage Data Age",
  iconWidget = null,
}: SimpleWidgetRenderProps) => {
  const t = useT();
  const raw = `${valueToRender}`.trim();
  const seconds = raw === "" ? NaN : Number(raw);

  let value = t("Unknown");
  let status: TimeStatStatus = "muted";
  if (!Number.isNaN(seconds)) {
    value = niceDays(`${Math.max(0, Math.floor(seconds))}`);
    if (seconds < 3600) {
      status = "ok";
    } else if (seconds < 86400) {
      status = "warn";
    } else {
      status = "danger";
    }
  }

  return (
    <RowShell>
      <TimeStatItem
        loading={loading}
        icon={iconWidget}
        label={<Box>{title}</Box>}
        value={value}
        status={status}
      />
    </RowShell>
  );
};
