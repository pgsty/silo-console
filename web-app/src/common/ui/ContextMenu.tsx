// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { Fragment, ReactNode, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import {
  Elevated,
  useListPopup,
  listPopupStyle,
  useFluidHover,
  FluidHoverHighlight,
  revealListItem,
  leaveMenuWithTab,
} from "mds";
import { useT } from "i18n";
import { Hint } from "./shared";
import { typography } from "./typography";

export interface ContextAction {
  label: string;
  action: () => void;
  icon?: ReactNode;
  state: { disabled: boolean; reason?: string };
  danger?: boolean;
}
export interface ContextMenuPosition {
  open: boolean;
  anchor: HTMLElement;
  fallback?: HTMLElement | null;
  point?: { x: number; y: number };
  close: (reason: "dismiss" | "restore" | "action") => void;
}
const Surface = styled(Elevated).attrs({ offset: 2, shadowLevel: 3 })`
  ${listPopupStyle}
  position: fixed;
  z-index: 10000;
  width: 256px;
  max-width: calc(100vw - 24px);
  overflow: auto;
  padding: 4px;
  border-radius: var(--radius-popover);
  isolation: isolate;
  [data-fluid-highlight] {
    z-index: -1;
  }
  > span,
  > span > span:first-child {
    width: 100%;
  }
  [role="separator"] {
    border-top: 1px solid var(--border);
    margin: 4px 0;
  }
`;
const Item = styled.button<{ $danger?: boolean }>`
  ${typography.body}
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--gap, 8px);
  width: 100%;
  min-height: var(--control-height, 36px);
  padding: 4px 12px;
  border: 0;
  border-radius: var(--radius-control);
  text-align: start;
  background: transparent;
  cursor: pointer;
  color: ${({ $danger }) =>
    $danger ? "var(--destructive-text)" : "var(--muted-foreground)"};
  outline: none;
  &:focus-visible {
    outline: none;
    background: var(--hover);
  }
  &[data-fluid-hover] {
    color: ${({ $danger }) =>
      $danger ? "var(--destructive-text)" : "var(--foreground)"};
  }
  @media (pointer: coarse) {
    min-height: 40px;
  }
  &[aria-disabled="true"] {
    cursor: not-allowed;
    color: var(--muted-foreground);
  }
  svg {
    width: var(--icon-size, 16px);
    height: var(--icon-size, 16px);
    flex-shrink: 0;
  }
`;
export function ContextMenu({
  open,
  anchor,
  fallback,
  point,
  close,
  items,
  label,
}: ContextMenuPosition & { items: ContextAction[]; label: string }) {
  const menu = useRef<HTMLDivElement>(null);
  const t = useT();
  const presence = useListPopup(
    open,
    anchor,
    menu,
    () => {
      restore();
      close("dismiss");
    },
    "start",
    false,
    point,
  );
  const hover = useFluidHover(menu, { gapClick: false, disabled: !open });
  const candidates = () => [
    ...(menu.current?.querySelectorAll<HTMLButtonElement>(
      '[role="menuitem"]',
    ) || []),
  ];
  const restore = () => {
    (anchor.isConnected ? anchor : fallback)?.focus({ preventScroll: true });
  };
  useLayoutEffect(() => {
    if (!open) return;
    if (!menu.current?.contains(document.activeElement))
      (candidates()[0] || menu.current)?.focus({ preventScroll: true });
  }, [open, items]);
  return presence.mounted
    ? createPortal(
        <div role="region" aria-label={label}>
          <Surface
            ref={menu}
            role="menu"
            aria-label={label}
            tabIndex={-1}
            data-silo-popup="true"
            data-side={presence.side}
            data-closing={!open}
            style={presence.style}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Escape") {
                event.preventDefault();
                return;
              }
              if (event.key === "Tab") {
                leaveMenuWithTab(menu.current, anchor, () => close("dismiss"));
                return;
              }
              const nodes = candidates();
              const index = nodes.indexOf(
                document.activeElement as HTMLButtonElement,
              );
              let next = -1;
              if (event.key === "ArrowDown") next = (index + 1) % nodes.length;
              if (event.key === "ArrowUp")
                next = (index - 1 + nodes.length) % nodes.length;
              if (event.key === "Home") next = 0;
              if (event.key === "End") next = nodes.length - 1;
              if (
                event.key.length === 1 &&
                event.key !== " " &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey
              ) {
                next = nodes.findIndex(
                  (node, i) =>
                    i > index &&
                    node.textContent
                      ?.trim()
                      .toLocaleLowerCase()
                      .startsWith(event.key.toLocaleLowerCase()),
                );
                if (next < 0)
                  next = nodes.findIndex((node) =>
                    node.textContent
                      ?.trim()
                      .toLocaleLowerCase()
                      .startsWith(event.key.toLocaleLowerCase()),
                  );
              }
              if (nodes[next]) {
                event.preventDefault();
                nodes[next].focus({ preventScroll: true });
                revealListItem(nodes[next]);
              }
            }}
            onKeyUp={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                close("restore");
                restore();
              }
            }}
          >
            <FluidHoverHighlight hover={hover} />
            {items.map((item, index) => (
              <Fragment key={item.label}>
                {item.danger && index > 0 && !items[index - 1].danger && (
                  <div role="separator" />
                )}
                <Hint
                  text={item.state.reason ? t(item.state.reason) : ""}
                  placement="right"
                >
                  <Item
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    $danger={item.danger}
                    aria-disabled={item.state.disabled || undefined}
                    data-fluid-index={index}
                    data-fluid-key={item.label}
                    onClick={() => {
                      if (!item.state.disabled) {
                        restore();
                        close("action");
                        item.action();
                      }
                    }}
                  >
                    {item.icon && <span aria-hidden="true">{item.icon}</span>}
                    {item.label}
                  </Item>
                </Hint>
              </Fragment>
            ))}
          </Surface>
        </div>,
        document.body,
      )
    : null;
}
