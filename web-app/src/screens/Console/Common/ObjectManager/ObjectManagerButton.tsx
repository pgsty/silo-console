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
import styled from "styled-components";
import { ObjectManagerIcon, type } from "mds";
import { useSelector } from "react-redux";
import { toggleList } from "../../ObjectBrowser/objectBrowserSlice";
import { AppState, useAppDispatch } from "../../../../store";
import { useT, formatText } from "i18n";
import HeaderIconButton from "../PageHeaderWrapper/HeaderIconButton";
import { activeTask } from "./taskModel";

const Badge = styled.span`
  position: absolute;
  insetinlineend: -1px;
  top: -1px;
  border-radius: 10px;
  padding: 0 4px;
  min-width: 16px;
  height: 16px;
  background: var(--foreground);
  color: var(--background);
  ${type("micro")}
  display: grid;
  place-items: center;
  font-weight: 550;
  font-variant-numeric: tabular-nums;
  box-shadow: var(--shadow-1);
`;
const ObjectManagerButton = () => {
  const dispatch = useAppDispatch();
  const t = useT();
  const manager = useSelector(
    (state: AppState) => state.objectBrowser.objectManager,
  );
  const running = manager.objectsToManage.filter(activeTask).length;
  if (!manager.objectsToManage.length) return null;
  return (
    <HeaderIconButton
      id="object-manager-toggle"
      aria-label={
        running
          ? formatText(t("Tasks: {count} running"), { count: running })
          : t("Tasks")
      }
      title={
        running
          ? formatText(t("Tasks: {count} running"), { count: running })
          : t("Tasks")
      }
      aria-haspopup="dialog"
      aria-expanded={manager.managerOpen}
      onClick={() => dispatch(toggleList())}
      style={{ position: "relative" }}
    >
      <ObjectManagerIcon />
      {running > 0 && (
        <Badge aria-hidden="true">{running > 99 ? "99+" : running}</Badge>
      )}
    </HeaderIconButton>
  );
};
export default ObjectManagerButton;
