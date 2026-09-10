// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { cloneElement, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Tooltip as MDSTooltip } from "mds";

// Preserve the MDS call-site API while providing keyboard focus, a stable
// accessible description while open, Escape dismissal and a hoverable tooltip.
export const Tooltip = ({
  children,
  tooltip,
  errorProps,
  placement = "bottom",
}: React.ComponentProps<typeof MDSTooltip>) => {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [bounds, setBounds] = useState<DOMRect | null>(null);
  const cancelHide = () => clearTimeout(timer.current);
  const show = () => {
    cancelHide();
    setBounds(anchor.current?.getBoundingClientRect() || null);
  };
  const hide = () => {
    cancelHide();
    timer.current = setTimeout(() => {
      if (!anchor.current?.contains(document.activeElement)) setBounds(null);
    }, 150);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!bounds) return;
    const dismiss = () => setBounds(null);
    const onMove = () => {
      if (anchor.current?.contains(document.activeElement)) {
        setBounds(anchor.current.getBoundingClientRect());
      } else dismiss();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [bounds]);
  if (!tooltip)
    return errorProps ? cloneElement(children, errorProps) : children;
  const above =
    bounds && (placement === "top" || bounds.bottom > window.innerHeight - 100);
  return (
    <span
      ref={anchor}
      style={{ display: "inline-flex", position: "relative" }}
      onFocusCapture={show}
      onBlurCapture={hide}
      onPointerEnter={show}
      onPointerLeave={hide}
    >
      {cloneElement(children, {
        ...errorProps,
        "aria-describedby": [children.props["aria-describedby"], bounds ? id : undefined]
          .filter(Boolean)
          .join(" "),
      })}
      {bounds &&
        createPortal(
          <div
            role="tooltip"
            id={id}
            onPointerEnter={cancelHide}
            onPointerLeave={hide}
            style={{
              position: "fixed",
              zIndex: 10001,
              borderRadius: 4,
              padding: 8,
              background: "#454b54",
              color: "#fff",
              fontSize: 12,
              maxWidth: "min(350px, calc(100vw - 16px))",
              left: Math.max(8, Math.min(bounds.left, window.innerWidth - 358)),
              top: above ? bounds.top - 8 : bounds.bottom + 8,
              transform: above ? "translateY(-100%)" : undefined,
            }}
          >
            {tooltip}
          </div>,
          document.body,
        )}
    </span>
  );
};
