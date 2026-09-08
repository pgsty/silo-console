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
import { setSearchObjects } from "./objectBrowserSlice";
import SearchBox from "../Common/SearchBox";
import { AppState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { useT } from "i18n";

const FilterObjectsSB = () => {
  const dispatch = useAppDispatch();
  const t = useT();

  const searchObjects = useSelector(
    (state: AppState) => state.objectBrowser.searchObjects,
  );
  // The filter matches the loaded page in memory: the whole directory when
  // the first page held all of it, otherwise the page on screen.
  const pageComplete = useSelector(
    (state: AppState) => state.objectBrowser.objectPage.complete,
  );
  return (
    <SearchBox
      placeholder={
        pageComplete
          ? t("Start typing to filter objects in the bucket")
          : t("Start typing to filter objects on this page")
      }
      onChange={(value) => {
        dispatch(setSearchObjects(value));
      }}
      value={searchObjects}
    />
  );
};
export default FilterObjectsSB;
