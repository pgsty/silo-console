// This file is part of MinIO Design System
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

import React, { FC, useEffect, useId, useRef } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { ColumnSelectorProps } from "./DataTable.types";
import { Elevated } from "../../global/SurfaceLevel";
import { useFluidHover } from "../../global/useFluidHover";
import { FluidHoverHighlight } from "../../global/FluidHoverHighlight";
import {
  useListPopup,
  listPopupStyle,
  enabledMenuItems,
  focusMenuKey,
  leaveMenuWithTab,
} from "../../global/listPopup";
import { type } from "../../global/typography";
import CheckCircleIcon from "../Icons/CheckCircleIcon";

const SelectorBox = styled(Elevated)`
  ${listPopupStyle}
  position: fixed;
  z-index: 10000;
  min-width: 180px;
  max-width: calc(100vw - 16px);
  padding: 4px;
  border-radius: var(--radius-popover, 12px);
  overflow: auto;
  .columnsSelectorTitle {
    ${type("body", { weight: "semibold" })} padding: 8px 12px;
    border-bottom: 1px solid var(--border);
  }
  .columnsSelectorContainer {
    position: relative;
    isolation: isolate;
  }
  [data-fluid-highlight] {
    z-index: -1;
  }
`;
const Item = styled.button`
  ${type("body")}
  display: flex;
  align-items: center;
  gap: var(--gap, 8px);
  width: 100%;
  height: var(--control-height, 36px);
  padding: 0 var(--control-padding, 12px);
  border: 0;
  border-radius: var(--radius-control, 8px);
  outline: none;
  color: var(--muted-foreground);
  background: transparent;
  cursor: pointer;
  text-align: start;
  &&:focus-visible {
    outline: none;
  }
  &[data-fluid-hover],
  &[aria-checked="true"] {
    color: var(--foreground);
  }
  svg {
    width: var(--icon-size, 16px);
    height: var(--icon-size, 16px);
  }
  .check {
    display: flex;
    width: var(--icon-size, 16px);
  }
  &[aria-checked="false"] .check {
    visibility: hidden;
  }
`;
const ColumnsSelector: FC<ColumnSelectorProps> = ({
  columns,
  selectedOptionIDs,
  onSelect,
  closeTriggerAction,
  open,
  anchorEl = null,
  title = "Shown Columns",
}) => {
  const popup = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();
  const presence = useListPopup(
    open,
    anchorEl,
    popup,
    closeTriggerAction,
    "end",
  );
  const hover = useFluidHover(list, {
    gapClick: { maxDistance: 16 },
    disabled: !open,
    onActiveChange: (index) => {
      if (index !== null && open)
        enabledMenuItems(list.current)[index]?.focus({ preventScroll: true });
    },
  });
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() =>
      enabledMenuItems(list.current)[0]?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [open]);
  if (!presence.mounted) return null;
  return createPortal(
    <SelectorBox
      ref={popup}
      offset={2}
      shadowLevel={3}
      data-silo-popup="true"
      data-popup-anchor={anchorEl?.id}
      data-side={presence.side}
      data-closing={!open}
      style={presence.style}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
        } else if (event.key === "Tab")
          leaveMenuWithTab(popup.current, anchorEl, closeTriggerAction);
        else focusMenuKey(event, list.current);
      }}
      onKeyUp={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          closeTriggerAction();
          anchorEl?.focus({ preventScroll: true });
        }
      }}
    >
      <div id={`${id}-title`} className="columnsSelectorTitle">
        {title}
      </div>
      <div
        ref={list}
        role="menu"
        aria-labelledby={`${id}-title`}
        className="columnsSelectorContainer"
      >
        <FluidHoverHighlight hover={hover} />
        {columns.map((column, index) => (
          <Item
            type="button"
            role="menuitemcheckbox"
            tabIndex={-1}
            key={column.elementKey || column.label}
            aria-checked={selectedOptionIDs.includes(column.elementKey || "")}
            data-fluid-index={index}
            data-fluid-key={column.elementKey || column.label}
            onClick={() => onSelect(column.elementKey || "")}
          >
            <span className="check" aria-hidden="true">
              <CheckCircleIcon />
            </span>
            {column.label}
          </Item>
        ))}
      </div>
    </SelectorBox>,
    document.body,
  );
};
export default ColumnsSelector;
