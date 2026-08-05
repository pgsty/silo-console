// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
import { DateTime } from "luxon";

// Built per render so the labels follow the active language; callers pass the
// t() they already hold.
export const accountTableColumns = (t: (text: string) => string) => [
  { label: t("Access Key"), elementKey: "accessKey" },
  {
    label: t("Expiry"),
    elementKey: "expiration",
    renderFunction: (expTime: string) => {
      if (expTime !== "1970-01-01T00:00:00Z") {
        const fmtDate = DateTime.fromISO(expTime)
          .toUTC()
          .toFormat("y/M/d hh:mm:ss z");

        return <span title={fmtDate}>{fmtDate}</span>;
      } else {
        return <span>{t("no-expiry")}</span>;
      }
    },
  },
  {
    label: t("Status"),
    elementKey: "accountStatus",
    renderFunction: (status: string) => {
      if (status === "off") {
        return t("Disabled");
      } else {
        return t("Enabled");
      }
    },
  },
  { label: t("Name"), elementKey: "name" },
  { label: t("Description"), elementKey: "description" },
];
