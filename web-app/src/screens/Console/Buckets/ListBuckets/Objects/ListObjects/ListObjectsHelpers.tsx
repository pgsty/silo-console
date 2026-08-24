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

import { DateTime } from "luxon";
import { BucketObjectItem } from "./types";
import { niceBytes } from "../../../../../../common/utils";
import { displayFileIconName } from "./utils";

// The table definitions below are built by callers that already hold a
// translator, so this module stays free of store/react imports.
type Translator = (text: string) => string;

// Functions

const displayParsedDate = (t: Translator) => (object: BucketObjectItem) => {
  if (object.name.endsWith("/")) {
    return "";
  }

  const currTime = DateTime.now();
  const objectTime = DateTime.fromISO(object.last_modified);

  const isToday =
    currTime.hasSame(objectTime, "day") &&
    currTime.hasSame(objectTime, "month") &&
    currTime.hasSame(objectTime, "year");

  if (isToday) {
    return t("Today, {time}").replace("{time}", () =>
      objectTime.toFormat("HH:mm"),
    );
  }

  // Standard timezone-carrying stamp, shared by both languages.
  return objectTime.toFormat("yyyy-MM-dd HH:mm (ZZZZ)");
};

const displayNiceBytes = (object: BucketObjectItem) => {
  if (object.name.endsWith("/") || object.size === undefined) {
    return "-";
  }
  return niceBytes(String(object.size));
};

const displayDeleteFlag = (t: Translator) => (state: boolean) => {
  return state ? t("Yes") : t("No");
};

// Table Props

export const listModeColumns = (t: Translator) => [
  {
    label: t("Name"),
    elementKey: "name",
    renderFunction: displayFileIconName,
    enableSort: true,
  },
  {
    label: t("Last Modified"),
    elementKey: "last_modified",
    renderFunction: displayParsedDate(t),
    renderFullObject: true,
    enableSort: true,
  },
  {
    label: t("Size"),
    elementKey: "size",
    renderFunction: displayNiceBytes,
    renderFullObject: true,
    width: 100,
    enableSort: true,
  },
];

export const rewindModeColumns = (t: Translator) => [
  {
    label: t("Name"),
    elementKey: "name",
    renderFunction: displayFileIconName,
    enableSort: true,
  },
  {
    label: t("Object Date"),
    elementKey: "last_modified",
    renderFunction: displayParsedDate(t),
    renderFullObject: true,
    enableSort: true,
  },
  {
    label: t("Size"),
    elementKey: "size",
    renderFunction: displayNiceBytes,
    renderFullObject: true,
    width: 100,
    enableSort: true,
  },
  {
    label: t("Deleted"),
    elementKey: "delete_flag",
    renderFunction: displayDeleteFlag(t),
    width: 60,
  },
];
