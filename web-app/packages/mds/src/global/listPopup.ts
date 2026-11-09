// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { css, keyframes } from "styled-components";

const enter = keyframes`from { opacity: 0; transform: translateY(var(--popup-slide, -4px)) scaleY(.96); } to { opacity: 1; transform: none; }`;
const exit = keyframes`from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(var(--popup-slide, -4px)) scaleY(.96); }`;
export const listPopupStyle = css`
  transform-origin: top;
  animation: ${enter} var(--dur-fast, 80ms) var(--ease-fast, ease-out) both;
  &[data-side="top"] {
    --popup-slide: 4px;
    transform-origin: bottom;
  }
  &[data-closing="true"] {
    animation: ${exit} var(--dur-fast-exit, 60ms) var(--ease-exit, ease-in) both;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: opacity var(--dur-fast, 80ms) ease;
    &[data-closing="true"] {
      animation: none;
      opacity: 0;
      transform: none;
    }
  }
`;

/** Shared by the owned list popups. Context/elevation stays with each popup root. */
export function useListPopup(
  open: boolean,
  anchor: HTMLElement | null,
  popup: RefObject<HTMLDivElement>,
  close: () => void,
  align: "start" | "end" = "start",
  matchWidth = false,
  point?: { x: number; y: number },
) {
  const [present, setPresent] = useState(open);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    maxHeight: 450,
    width: undefined as number | undefined,
    side: "bottom",
  });
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }
    const value =
      popup.current &&
      getComputedStyle(popup.current).getPropertyValue("--dur-fast-exit");
    const timeout = setTimeout(
      () => setPresent(false),
      parseFloat(value || "60") || 60,
    );
    return () => clearTimeout(timeout);
  }, [open, popup]);
  useLayoutEffect(() => {
    if (popup.current) popup.current.inert = !open;
    if (!open || !popup.current || !anchor) return;
    const place = () => {
      if (!popup.current) return;
      if (!anchor.isConnected) {
        closeRef.current();
        return;
      }
      const bounds = point
        ? { left: point.x, right: point.x, top: point.y, bottom: point.y, width: 0 }
        : anchor.getBoundingClientRect();
      const availableBelow = window.innerHeight - bounds.bottom - 12;
      const availableAbove = bounds.top - 12;
      const height = Math.min(popup.current.scrollHeight, 450);
      const above = height > availableBelow && availableAbove > availableBelow;
      const maxHeight = Math.max(
        36,
        Math.min(450, above ? availableAbove : availableBelow),
      );
      const width = matchWidth ? bounds.width : popup.current.offsetWidth;
      const alignRight = (align === "end") !== (getComputedStyle(anchor).direction === "rtl");
      setPosition({
        left: Math.max(
          8,
          Math.min(
            alignRight ? bounds.right - width : bounds.left,
            window.innerWidth - width - 8,
          ),
        ),
        top: above
          ? Math.max(8, bounds.top - Math.min(height, maxHeight) - 4)
          : bounds.bottom + 4,
        maxHeight,
        width: matchWidth ? width : undefined,
        side: above ? "top" : "bottom",
      });
    };
    let frame = 0;
    const refresh = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          place();
        });
    };
    const outside = (event: Event) => {
      if (
        event.target instanceof Node &&
        !anchor.contains(event.target) &&
        !popup.current?.contains(event.target)
      )
        closeRef.current();
    };
    place();
    const resize = new ResizeObserver(refresh);
    resize.observe(popup.current);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("scroll", refresh, true);
    window.addEventListener("resize", refresh);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("scroll", refresh, true);
      window.removeEventListener("resize", refresh);
    };
  }, [open, anchor, popup, align, matchWidth, point]);
  const { side, ...style } = position;
  return { mounted: open || present, side, style };
}

/** Exiting popups stay painted for a fade, but immediately leave the Tab order. */
export function leaveMenuWithTab(
  popup: HTMLElement | null,
  anchor: HTMLElement | null,
  close: () => void,
) {
  if (popup) popup.inert = true;
  const trigger = anchor?.matches("button,input,[tabindex]")
    ? anchor
    : anchor?.querySelector<HTMLElement>(
        "button,input:not([type=hidden]),[tabindex]",
      );
  trigger?.focus({ preventScroll: true });
  close();
  // The native Tab default now proceeds from the trigger, in either direction.
}

export function enabledMenuItems(root: HTMLElement | null) {
  return root
    ? Array.from(
        root.querySelectorAll<HTMLElement>("[data-fluid-index]"),
      ).filter((element) => !element.matches(":disabled,[aria-disabled=true]"))
    : [];
}

export function focusMenuKey(
  event: { key: string; preventDefault(): void; stopPropagation(): void },
  root: HTMLElement | null,
) {
  const items = enabledMenuItems(root);
  if (
    !items.length ||
    !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
  )
    return false;
  const current = items.indexOf(document.activeElement as HTMLElement);
  const index =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
          items.length;
  event.preventDefault();
  event.stopPropagation();
  const item = items[index];
  item.focus({ preventScroll: true });
  if (root) {
    revealListItem(item);
  }
  return true;
}

/** Reveal keyboard focus in the actual scrollports, including a list's parent. */
export function revealListItem(item: HTMLElement) {
  for (
    let parent = item.parentElement;
    parent && parent !== document.body;
    parent = parent.parentElement
  ) {
    const style = getComputedStyle(parent);
    const bounds = parent.getBoundingClientRect();
    const target = item.getBoundingClientRect();
    const sy = bounds.height / parent.offsetHeight || 1;
    const sx = bounds.width / parent.offsetWidth || 1;
    const top = bounds.top + parent.clientTop * sy;
    const left = bounds.left + parent.clientLeft * sx;
    if (
      /(auto|scroll)/.test(style.overflowY) &&
      parent.scrollHeight > parent.clientHeight
    ) {
      if (target.top < top) parent.scrollTop += (target.top - top) / sy;
      else if (target.bottom > top + parent.clientHeight * sy)
        parent.scrollTop += (target.bottom - top) / sy - parent.clientHeight;
    }
    if (
      /(auto|scroll)/.test(style.overflowX) &&
      parent.scrollWidth > parent.clientWidth
    ) {
      if (target.left < left) parent.scrollLeft += (target.left - left) / sx;
      else if (target.right > left + parent.clientWidth * sx)
        parent.scrollLeft += (target.right - left) / sx - parent.clientWidth;
    }
  }
}
