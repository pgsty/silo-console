// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, {
  ComponentProps,
  Fragment,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useT } from "i18n";
import { ActionIcon, Hint } from "./shared";
import { orderOverflowItems } from "./overflowItems";
import {
  Elevated,
  useFluidHover,
  FluidHoverHighlight,
  useListPopup,
  listPopupStyle,
  enabledMenuItems,
  focusMenuKey,
  leaveMenuWithTab,
  revealListItem,
} from "mds";
import { typography } from "./typography";

export interface OverflowItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}
const Anchor = styled.div`
  display: inline-flex;
`;
const Menu = styled(Elevated).attrs({ offset: 2, shadowLevel: 3 })`
  ${listPopupStyle}
  position: fixed;
  z-index: 10000;
  width: 240px;
  max-width: calc(100vw - 24px);
  overflow-y: auto;
  padding: 4px;
  border: 0;
  border-radius: var(--radius-popover, 12px);
  isolation: isolate;
  [data-fluid-highlight] {
    z-index: -1;
  }
  > span,
  > span > span:first-child {
    width: 100%;
  }
`;
const MenuItem = styled.button<{ $danger?: boolean }>`
  ${typography.body}
  display: flex;
  position: relative;
  align-items: center;
  gap: var(--gap, 8px);
  width: 100%;
  height: var(--control-height, 36px);
  padding: 0 var(--control-padding, 12px);
  border: 0;
  border-radius: var(--radius-control, 8px);
  background: transparent;
  text-align: start;
  cursor: pointer;
  outline: none;
  color: ${({ $danger }) =>
    $danger ? "var(--destructive-text)" : "var(--muted-foreground)"};
  &&:focus-visible {
    outline: none;
    background: var(--hover);
  }
  &[data-fluid-hover] {
    color: ${({ $danger }) =>
      $danger ? "var(--destructive-text)" : "var(--foreground)"};
  }
  &[aria-disabled="true"] {
    color: var(--muted-foreground);
    cursor: not-allowed;
  }
  @media (pointer: coarse) {
    min-height: 40px;
  }
  svg {
    width: var(--icon-size, 16px);
    height: var(--icon-size, 16px);
    flex-shrink: 0;
    fill: currentColor;
  }
`;
const Divider = styled.div`
  border-top: 1px solid var(--border);
  margin: 4px 0;
`;

export const OverflowMenu = ({
  items,
  label,
  tooltipPlacement,
  tooltipLabel,
  triggerRef,
}: {
  items: OverflowItem[];
  label?: string;
  tooltipPlacement?: ComponentProps<typeof Hint>["placement"];
  tooltipLabel?: string;
  triggerRef?: React.Ref<HTMLButtonElement>;
}) => {
  const t = useT();
  const name = label || t("More actions");
  const id = useId();
  const anchor = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const search = useRef({ text: "", at: 0 });
  const ordered = orderOverflowItems(items);
  const close = (restore = false) => {
    setOpen(false);
    if (restore)
      anchor.current?.querySelector("button")?.focus({ preventScroll: true });
  };
  const presence = useListPopup(
    open,
    anchor.current,
    menu,
    () => close(),
    "end",
  );
  const hover = useFluidHover(menu, {
    gapClick: { maxDistance: 8 },
    disabled: !open || ordered.every((item) => item.danger),
    onActiveChange: (index) => {
      if (index !== null && open)
        menu.current
          ?.querySelector<HTMLElement>(`[data-fluid-index="${index}"]`)
          ?.focus({ preventScroll: true });
    },
  });
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() =>
      (enabledMenuItems(menu.current)[0] || menu.current)?.focus({
        preventScroll: true,
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [open]);
  const navigate = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key === "Tab") {
      leaveMenuWithTab(menu.current, anchor.current, close);
      return;
    }
    if (focusMenuKey(event, menu.current)) return;
    if (
      event.key.length === 1 &&
      event.key !== " " &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !event.nativeEvent.isComposing
    ) {
      const now = Date.now();
      search.current = {
        text:
          (now - search.current.at < 500 ? search.current.text : "") +
          event.key.toLocaleLowerCase(),
        at: now,
      };
      const candidates = enabledMenuItems(menu.current);
      const current = candidates.indexOf(document.activeElement as HTMLElement);
      const match = [
        ...candidates.slice(current + 1),
        ...candidates.slice(0, current + 1),
      ].find((item) =>
        item.textContent
          ?.trim()
          .toLocaleLowerCase()
          .startsWith(search.current.text),
      );
      if (match) {
        event.preventDefault();
        match.focus({ preventScroll: true });
        revealListItem(match);
      }
    }
  };
  return (
    <Anchor ref={anchor} id={`${id}-anchor`}>
      <Hint text={tooltipLabel ?? name} placement={tooltipPlacement}>
        <ActionIcon
          ref={triggerRef}
          type="button"
          aria-label={name}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          onClick={() => (open ? close() : items.length && setOpen(true))}
          onKeyDown={(event) => {
            if (["ArrowDown", "ArrowUp"].includes(event.key)) {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 24, lineHeight: 1 }}>
            ⋯
          </span>
        </ActionIcon>
      </Hint>
      {presence.mounted &&
        createPortal(
          <Menu
            ref={menu}
            id={id}
            role="menu"
            tabIndex={-1}
            aria-label={name}
            data-silo-popup="true"
            data-popup-anchor={`${id}-anchor`}
            data-side={presence.side}
            data-closing={!open}
            style={presence.style}
            onKeyDown={navigate}
            onKeyUp={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                close(true);
              }
            }}
          >
            <FluidHoverHighlight hover={hover} />
            {ordered.map((item, index) => {
              const button = (
                <MenuItem
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={item.disabled || undefined}
                  $danger={item.danger}
                  data-fluid-index={index}
                  data-fluid-key={item.label}
                  data-fluid-gap-click={item.danger ? "false" : undefined}
                  onClick={() => {
                    if (!item.disabled) {
                      close(true);
                      item.onClick();
                    }
                  }}
                >
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  {item.label}
                </MenuItem>
              );
              return (
                <Fragment key={`${item.label}-${index}`}>
                  {item.danger && index > 0 && !ordered[index - 1].danger && (
                    <Divider role="separator" />
                  )}
                  {item.disabled && item.disabledReason ? (
                    <Hint text={item.disabledReason}>{button}</Hint>
                  ) : (
                    button
                  )}
                </Fragment>
              );
            })}
          </Menu>,
          document.body,
        )}
    </Anchor>
  );
};
