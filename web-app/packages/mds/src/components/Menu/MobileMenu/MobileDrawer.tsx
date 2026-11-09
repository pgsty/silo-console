// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { useNativeModal } from "../../../global/ModalState";
import { MenuProps } from "../Menu.types";
import VerticalMenu from "../Vertical/VerticalMenu";

const slideIn = keyframes`
  from { transform: translateX(var(--drawer-offset, -100%)); }
  to { transform: translateX(0); }
`;

const Drawer = styled.dialog`
  position: fixed;
  inset-block: 0;
  inset-inline-start: 0;
  inset-inline-end: auto;
  &:dir(rtl) { --drawer-offset: 100%; }
  margin: 0;
  padding: 0;
  border: 0;
  width: 250px;
  max-width: calc(100vw - 40px);
  height: 100dvh;
  max-height: 100dvh;
  overflow: auto;
  background: transparent;
  &::backdrop {
    background: rgba(4, 10, 22, 0.55);
  }
  &[open] {
    animation: ${slideIn} var(--dur-slow, 240ms) var(--ease-slow, ease-out);
  }
  & .menuBox {
    width: 100%;
    min-width: 0;
    height: 100dvh;
  }
  @media (prefers-reduced-motion: reduce) {
    &[open] {
      animation: none;
    }
  }
`;

const MobileDrawer = ({
  mobileOpen = false,
  onMobileOpenChange,
  mobileLabel = "Menu",
  ...props
}: MenuProps) => {
  useNativeModal(mobileOpen);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onOpenChange = useRef(onMobileOpenChange);
  onOpenChange.current = onMobileOpenChange;
  const previousPath = useRef(props.currentPath);

  useEffect(() => {
    if (previousPath.current !== props.currentPath) {
      previousPath.current = props.currentPath;
      if (mobileOpen) onOpenChange.current?.(false);
    }
  }, [props.currentPath, mobileOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!mobileOpen || !dialog) return;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    // A native modal makes the background inert and contains focus, including
    // assistive-technology navigation. Opening also focuses the first control.
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus();
    };
  }, [mobileOpen]);

  const close = () => onMobileOpenChange?.(false);

  return createPortal(
    <Drawer
      ref={dialogRef}
      id="console-mobile-menu"
      aria-label={mobileLabel}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX >= bounds.right ||
          event.clientY < bounds.top ||
          event.clientY >= bounds.bottom
        )
          close();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
          ),
        ).filter(
          (element) =>
            element.tabIndex >= 0 && element.getClientRects().length > 0,
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <VerticalMenu
        {...props}
        isOpen
        collapseAction={close}
        callPathAction={(path) => {
          close();
          props.callPathAction(path);
        }}
        options={props.options?.map((option) => ({
          ...option,
          onClick: option.onClick
            ? (path) => {
                close();
                option.onClick?.(path);
              }
            : undefined,
        }))}
        signOutAction={
          props.signOutAction
            ? () => {
                close();
                props.signOutAction?.();
              }
            : undefined
        }
      />
    </Drawer>,
    document.body,
  );
};

export default MobileDrawer;
