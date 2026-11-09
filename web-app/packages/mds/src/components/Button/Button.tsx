// This file is part of MinIO Design System
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

import React, { forwardRef } from "react";
import styled, { css, keyframes } from "styled-components";
import { ButtonProps } from "./Button.types";
import { useDensity } from "../../global/Density";
import { type } from "../../global/typography";
import DisabledButtonTooltip from "../Tooltip/DisabledButtonTooltip";

// Legacy names remain accepted; secondary now has its ordinary neutral meaning.
export const buttonVariant = (variant: ButtonProps["variant"]) =>
  (
    ({
      regular: "outline",
      callAction: "primary",
      subAction: "secondary",
      text: "ghost",
    }) as const
  )[variant as "regular"] ||
  variant ||
  "outline";
const spin = keyframes`to { transform: rotate(360deg); }`;
const CustomButton = styled.button<{
  $variant: string;
  $compact: boolean;
  $full: boolean;
  $collapse: boolean;
  $icon: boolean;
  $side: string;
  $loading: boolean;
  $held: boolean;
  $sx: ButtonProps["sx"];
}>`
  ${({ $compact }) => type("body", { compact: $compact, weight: "semibold" })}
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;
  height: ${({ $compact }) => ($compact ? 28 : 36)}px;
  @media (pointer: coarse) { min-height: 40px; }
  width: ${({ $full }) => ($full ? "100%" : "auto")};
  border: 0;
  border-radius: 8px;
  margin: 0;
  padding: 0 ${({ $compact }) => ($compact ? 12 : 16)}px;
  gap: ${({ $compact }) => ($compact ? 4 : 8)}px;
  cursor: pointer;
  text-transform: none;
  letter-spacing: normal;
  white-space: nowrap;
  background: transparent;
  --button-fill: var(--tint);
  --button-hover: var(--tint-hover);
  --button-press: var(--tint);
  color: var(--foreground);
  ${({ $variant }) =>
    $variant === "primary" &&
    css`
      --button-fill: var(--foreground);
      --button-hover: color-mix(
        in oklab,
        var(--foreground) 90%,
        var(--surface-1)
      );
      --button-press: color-mix(
        in oklab,
        var(--foreground) 80%,
        var(--surface-1)
      );
      color: var(--surface-1);
    `}
  ${({ $variant }) =>
    $variant === "danger" &&
    css`
      color: var(--destructive-text);
    `}
  ${({ $variant }) =>
    $variant === "danger-fill" &&
    css`
      --button-fill: var(--destructive-text);
      --button-hover: var(--destructive-text);
      --button-press: var(--destructive-text);
      color: var(--surface-1);
    `}
  ${({ $variant }) =>
    ["ghost", "outline"].includes($variant) &&
    css`
      --button-fill: transparent;
      --button-hover: var(--hover);
      --button-press: var(--active);
    `}
  ${({ $icon, $side, $compact }) =>
    $icon &&
    ($side === "start"
      ? css`
          padding-inline-start: ${$compact ? 8 : 12}px;
        `
      : css`
          padding-inline-end: ${$compact ? 8 : 12}px;
        `)}
  .button-surface {
    position: absolute;
    z-index: -1;
    inset: 1px;
    border-radius: 7px;
    pointer-events: none;
    background: var(--button-fill);
    box-shadow: 0 0 0 1px var(--button-fill);
    transition:
      box-shadow 180ms cubic-bezier(0.23, 1, 0.32, 1),
      background-color var(--dur-fast, 80ms) ease;
    ${({ $variant }) =>
      $variant === "outline" &&
      css`
        box-shadow:
          0 0 0 1px var(--border),
          inset 0 0 0 0 var(--border);
      `}
  }
  &:hover:not(:disabled) .button-surface {
    background: var(--button-hover);
    box-shadow: 0 0 0 1px var(--button-hover);
  }
  ${({ $variant }) =>
    $variant === "outline" &&
    css`
      &:hover:not(:disabled) .button-surface {
        box-shadow:
          0 0 0 1px var(--border),
          inset 0 0 0 0 var(--border);
      }
    `}
  ${({ $held }) =>
    $held &&
    css`
      .button-surface {
        background: var(--button-press);
      }
    `}
  &:active:not(:disabled) .button-surface {
    background: var(--button-press);
    box-shadow: 0 0 0 0 var(--button-press);
    transition-duration: var(--dur-fast, 80ms);
  }
  ${({ $variant }) =>
    $variant === "outline" &&
    css`
      &:active:not(:disabled) .button-surface {
        box-shadow:
          0 0 0 0 var(--border),
          inset 0 0 0 1px var(--border);
      }
    `}
  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
  &:disabled {
    cursor: not-allowed;
    color: var(--foreground);
    --button-fill: var(--muted);
  }
  .button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: inherit;
    opacity: ${({ $loading }) => ($loading ? 0 : 1)};
  }
  .button-label {
    white-space: nowrap;
  }
  .buttonIcon {
    display: inline-flex;
  }
  .buttonIcon svg {
    width: ${({ $compact }) => ($compact ? 14 : 16)}px;
    height: ${({ $compact }) => ($compact ? 14 : 16)}px;
    fill: currentColor;
    color: inherit;
  }
  .button-spinner {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 1.5px solid currentColor;
    border-inline-end-color: transparent;
    border-radius: 50%;
    animation: ${spin} 800ms linear infinite;
  }
  @media (max-width: 767px) {
    ${({ $collapse, $icon }) =>
      $collapse &&
      $icon &&
      css`
        .button-label {
          display: none;
        }
        padding: 0 12px;
      `}
  }
  @media (prefers-reduced-motion: reduce) {
    .button-surface {
      transition: background-color var(--dur-fast, 80ms) ease;
    }
    .button-spinner {
      animation: none;
    }
  }
  ${({ $sx }) => $sx}
`;
const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    {
      label,
      variant = "regular",
      icon,
      iconLocation = "end",
      disabled,
      disabledReason,
      fullWidth = false,
      collapseOnSmall = true,
      children,
      className,
      sx,
      loading = false,
      active = false,
      ...props
    },
    ref,
  ) => {
    const { compact } = useDensity();
    const button = (
      <CustomButton
        ref={ref}
        {...props}
        $variant={buttonVariant(variant)}
        $compact={compact}
        $full={fullWidth}
        $collapse={collapseOnSmall}
        $icon={!!icon}
        $side={iconLocation}
        $loading={loading}
        $held={active}
        $sx={sx}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-label={props["aria-label"] || label}
        className={`${className || ""} button-${variant}`}
      >
        <span className="button-surface" aria-hidden="true" />
        <span className="button-content">
          {icon && iconLocation === "start" && (
            <span className="buttonIcon">{icon}</span>
          )}
          <span className="button-label">
            {children}
            {children && label ? " " : ""}
            {label}
          </span>
          {icon && iconLocation === "end" && (
            <span className="buttonIcon">{icon}</span>
          )}
        </span>
        {loading && <span className="button-spinner" aria-hidden="true" />}
      </CustomButton>
    );
    return disabled && disabledReason ? (
      <DisabledButtonTooltip reason={disabledReason} fullWidth={fullWidth}>
        {button}
      </DisabledButtonTooltip>
    ) : (
      button
    );
  },
);
Button.displayName = "Button";
export default Button;
