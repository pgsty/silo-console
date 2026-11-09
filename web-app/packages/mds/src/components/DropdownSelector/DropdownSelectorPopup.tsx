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

import React, { FC, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { DropdownSelectorProps } from "./DropdownSelector.types";
import { Elevated } from "../../global/SurfaceLevel";
import { useFluidHover } from "../../global/useFluidHover";
import { FluidHoverHighlight } from "../../global/FluidHoverHighlight";
import {
  enabledMenuItems,
  focusMenuKey,
  leaveMenuWithTab,
  listPopupStyle,
  useListPopup,
} from "../../global/listPopup";
import { type } from "../../global/typography";

const DropdownBlock = styled(Elevated)`
  ${listPopupStyle}
  position: fixed;
  z-index: 10000;
  min-width: 150px;
  max-width: calc(100vw - 16px);
  overflow: auto;
  padding: 4px;
  border-radius: var(--radius-popover, 12px);
  isolation: isolate;
  [data-fluid-highlight] {
    z-index: -1;
  }
`;
const DropdownItem = styled.div<{ label: string }>`
  ${type("body")}
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--gap, 8px);
  height: var(--control-height, 36px);
  padding: 0 var(--control-padding, 12px);
  border-radius: var(--radius-control, 8px);
  color: var(--muted-foreground, #737373);
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  user-select: none;
  &&:focus-visible {
    outline: none;
  }
  &[data-fluid-hover],
  &[aria-selected="true"] {
    color: var(--foreground, #171717);
  }
  &[aria-selected="true"] {
    font-weight: var(--fw-semibold, 550);
  }
  &[aria-disabled="true"] {
    cursor: not-allowed;
  }
  svg {
    width: var(--icon-size, 16px);
    height: var(--icon-size, 16px);
    flex-shrink: 0;
  }
  .label {
    display: grid;
    flex: 1;
    min-width: 0;
  }
  .label > span {
    grid-area: 1 / 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .measure {
    visibility: hidden;
    font-weight: var(--fw-semibold, 550);
  }
`;

const DropdownSelector: FC<DropdownSelectorProps> = ({
  id,
  options,
  selectedOption = "",
  onSelect,
  hideTriggerAction,
  open,
  anchorEl = null,
  useAnchorWidth = false,
  anchorOrigin = "start",
  role = "listbox",
  ariaLabel,
  ariaLabelledBy,
  autoFocus = true,
}) => {
  const popup = useRef<HTMLDivElement>(null);
  const activeValue = useRef<string | null>(null);
  const wasOpen = useRef(false);
  const presence = useListPopup(
    open,
    anchorEl,
    popup,
    hideTriggerAction,
    anchorOrigin,
    useAnchorWidth,
  );
  const hover = useFluidHover(popup, {
    gapClick: { maxDistance: 16 },
    disabled: !open,
    onActiveChange: (index) => {
      if (!open || index === null) return;
      activeValue.current = options[index]?.value ?? null;
      const row = popup.current?.querySelector<HTMLElement>(
        `[data-fluid-index="${index}"]`,
      );
      if (autoFocus) row?.focus({ preventScroll: true });
      else
        anchorEl?.setAttribute(
          "aria-activedescendant",
          `${id}-option-${index}`,
        );
    },
  });
  const restoreFocus = () => {
    if (!anchorEl?.isConnected) return;
    const target = anchorEl.matches("button,input,[tabindex]")
      ? anchorEl
      : anchorEl.querySelector<HTMLElement>(
          "button,input:not([type=hidden]),[tabindex]",
        );
    target?.focus({ preventScroll: true });
  };
  const select = (index: number) => {
    const option = options[index];
    if (!option || !open) return;
    hideTriggerAction();
    restoreFocus();
    if (!option.disabled)
      onSelect(option.value, option.extraValue ?? null, option.label, index);
  };
  useLayoutEffect(() => {
    if (!open || !presence.mounted) {
      wasOpen.current = false;
      activeValue.current = null;
      anchorEl?.removeAttribute("aria-activedescendant");
      return;
    }
    const enabled = enabledMenuItems(popup.current);
    const retained = wasOpen.current
      ? enabled.find((row) => row.contains(document.activeElement)) ||
        enabled.find((row) => row.dataset.fluidKey === activeValue.current)
      : undefined;
    const next = retained || (autoFocus ? enabled[0] : undefined);
    wasOpen.current = true;
    activeValue.current = next?.dataset.fluidKey ?? null;
    if (autoFocus) (next || popup.current)?.focus({ preventScroll: true });
    else if (next) anchorEl?.setAttribute("aria-activedescendant", next.id);
    else anchorEl?.removeAttribute("aria-activedescendant");
    hover.refresh();
    return () => anchorEl?.removeAttribute("aria-activedescendant");
  }, [open, presence.mounted, options, autoFocus, anchorEl, hover]);
  useLayoutEffect(() => {
    if (!open) return;
    const root = popup.current;
    const input = anchorEl;
    const keydown = (event: KeyboardEvent) => {
      if (event.isComposing || event.keyCode === 229) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (event.key === "Tab") {
        leaveMenuWithTab(root, anchorEl, hideTriggerAction);
        return;
      }
      if (autoFocus && focusMenuKey(event, root)) return;
      if (
        !autoFocus &&
        ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
      ) {
        event.preventDefault();
        event.stopPropagation();
        const enabled = options
          .map((option, index) => (option.disabled ? -1 : index))
          .filter((index) => index >= 0);
        const at = enabled.indexOf(
          options.findIndex((option) => option.value === activeValue.current),
        );
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? enabled.length - 1
              : (at + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) %
                enabled.length;
        hover.setActiveIndex(enabled[next] ?? null);
        return;
      }
      if (event.key === "Enter" || (autoFocus && event.key === " ")) {
        const focused =
          autoFocus && root?.contains(document.activeElement)
            ? document.activeElement?.closest<HTMLElement>("[data-fluid-index]")
            : null;
        const index = focused
          ? Number(focused.dataset.fluidIndex)
          : options.findIndex((option) => option.value === activeValue.current);
        if (index >= 0) {
          event.preventDefault();
          event.stopPropagation();
          select(index);
        }
      }
    };
    // Close on keyup so an inherited modal keyup listener cannot consume the same Escape.
    const keyup = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        hideTriggerAction();
        restoreFocus();
      }
    };
    root?.addEventListener("keydown", keydown);
    root?.addEventListener("keyup", keyup);
    input?.addEventListener("keydown", keydown);
    input?.addEventListener("keyup", keyup);
    return () => {
      root?.removeEventListener("keydown", keydown);
      root?.removeEventListener("keyup", keyup);
      input?.removeEventListener("keydown", keydown);
      input?.removeEventListener("keyup", keyup);
    };
  });
  if (!presence.mounted) return null;
  return createPortal(
    <DropdownBlock
      ref={popup}
      id={id}
      role={role}
      tabIndex={-1}
      offset={2}
      shadowLevel={3}
      aria-label={
        ariaLabel ||
        (!ariaLabelledBy
          ? anchorEl?.getAttribute("aria-label") ||
            anchorEl?.textContent ||
            undefined
          : undefined)
      }
      aria-labelledby={ariaLabelledBy}
      data-silo-popup="true"
      data-popup-anchor={anchorEl?.id}
      data-side={presence.side}
      data-closing={!open}
      style={presence.style}
      onMouseDown={(event) => {
        if (!autoFocus) event.preventDefault();
      }}
    >
      <FluidHoverHighlight hover={hover} selected />
      <FluidHoverHighlight hover={hover} />
      {options.map((option, index) => (
        <DropdownItem
          key={option.value}
          id={`${id}-option-${index}`}
          role={role === "listbox" ? "option" : "menuitem"}
          aria-selected={
            role === "listbox" ? selectedOption === option.value : undefined
          }
          aria-disabled={option.disabled || undefined}
          data-fluid-selected={selectedOption === option.value}
          data-fluid-index={index}
          data-fluid-key={option.value}
          tabIndex={-1}
          className={selectedOption === option.value ? "selected" : ""}
          lang={option.lang}
          dir={option.dir}
          label={option.label}
          onClick={() => select(index)}
        >
          {option.icon}
          <span className="label">
            {typeof option.label === "string" && (
              <span aria-hidden="true" className="measure">
                {option.label}
              </span>
            )}
            <span>{option.label}</span>
          </span>
          {option.indicator}
        </DropdownItem>
      ))}
    </DropdownBlock>,
    document.body,
  );
};
export default DropdownSelector;
