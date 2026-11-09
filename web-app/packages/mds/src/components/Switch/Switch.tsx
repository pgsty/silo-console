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

import React, { FC } from "react";
import styled from "styled-components";
import { SwitchProps } from "./Switch.types";
import InputLabel from "../InputLabel/InputLabel";
import { useDensity } from "../../global/Density";
import { type } from "../../global/typography";
import FieldHelp from "../InputLabel/FieldHelp";
import { useControlLabels } from "../../global/ControlLabels";
const Control = styled.div<{
  $compact: boolean;
  $sx: SwitchProps["sx"];
}>`
  ${type("body")}
  min-width: 0;
  --switch-direction: 1;
  &:dir(rtl) {
    --switch-direction: -1;
    .switch-thumb { transform-origin: right center; }
    input:checked + .switchRail .switch-thumb { transform-origin: left center; }
  }
  .switch-row,
  .switch-control {
    display: flex;
    align-items: center;
    gap: var(--gap, 8px);
  }
  .switch-row {
    justify-content: space-between;
    min-height: var(--control-height, 36px);
  }
  .switch-control {
    flex-shrink: 0;
  }
  .inputLabel {
    color: var(--foreground);
  }
  &:has(input:disabled) .inputLabel {
    color: var(--muted-foreground);
  }
  .switch-target {
    position: relative;
    display: block;
    width: ${({ $compact }) => ($compact ? 28 : 34)}px;
    height: ${({ $compact }) => ($compact ? 16 : 20)}px;
    cursor: pointer;
    flex-shrink: 0;
  }
  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }
  .switchRail {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: var(--accent);
    pointer-events: none;
  }
  .switch-thumb {
    position: absolute;
    inset-inline-start: 2px;
    top: 2px;
    width: ${({ $compact }) => ($compact ? 12 : 16)}px;
    height: ${({ $compact }) => ($compact ? 12 : 16)}px;
    border-radius: 999px;
    background: var(--surface-1);
    box-shadow: var(--shadow-2);
    transform-origin: left center;
    transition: transform var(--dur-moderate, 160ms)
      var(--ease-moderate, ease-out);
  }
  input:checked + .switchRail {
    background: var(--brand);
  }
  input:checked + .switchRail .switch-thumb {
    transform: translateX(calc(var(--switch-direction) * ${({ $compact }) => ($compact ? 12 : 14)}px));
    transform-origin: right center;
  }
  @media (hover: hover) and (pointer: fine) {
    input:hover:not(:disabled) + .switchRail .switch-thumb {
      transform: scaleX(${({ $compact }) => ($compact ? 14 / 12 : 18 / 16)});
    }
    input:checked:hover:not(:disabled) + .switchRail .switch-thumb {
      transform: translateX(calc(var(--switch-direction) * ${({ $compact }) => ($compact ? 12 : 14)}px))
        scaleX(${({ $compact }) => ($compact ? 14 / 12 : 18 / 16)});
    }
  }
  input:active:not(:disabled) + .switchRail .switch-thumb {
    transform: scale(
      ${({ $compact }) => ($compact ? 16 / 12 : 20 / 16)},
      ${({ $compact }) => ($compact ? 8 / 12 : 12 / 16)}
    );
  }
  input:checked:active:not(:disabled) + .switchRail .switch-thumb {
    transform: translateX(calc(var(--switch-direction) * ${({ $compact }) => ($compact ? 12 : 14)}px))
      scale(
        ${({ $compact }) => ($compact ? 16 / 12 : 20 / 16)},
        ${({ $compact }) => ($compact ? 8 / 12 : 12 / 16)}
      );
  }
  input:focus-visible + .switchRail {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
  input:disabled + .switchRail {
    background: var(--muted);
    box-shadow: inset 0 0 0 1px var(--input);
  }
  input:disabled + .switchRail .switch-thumb {
    background: var(--muted-foreground);
  }
  .switch-indicator,
  .actionDescription {
    ${type("caption")} color: var(--muted-foreground);
  }
  .switch-control:not(:has(input:checked)) .switch-indicator:first-child,
  .switch-control:has(input:checked) .switch-indicator:last-child {
    color: var(--foreground);
  }
  .actionDescription {
    margin-top: 4px;
    overflow-wrap: anywhere;
  }
  @media (max-width: 767.98px) {
    .switch-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .inputLabel {
      margin-inline-end: 0;
    }
  }
  @media (pointer: coarse) {
    .switch-target {
      width: 40px;
      height: 40px;
    }
    .switchRail {
      inset: ${({ $compact }) => ($compact ? "12px 6px" : "10px 3px")};
    }
  }
  [data-field-layout="stacked"] & {
    .switch-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .inputLabel {
      margin-inline-end: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .switch-thumb {
      transition: none;
    }
  }
  ${({ $sx }) => $sx}
`;
const Switch: FC<SwitchProps & React.InputHTMLAttributes<HTMLInputElement>> = ({
  tooltip,
  label,
  id,
  sx,
  className,
  switchOnly,
  indicatorLabels,
  description,
  checked,
  helpTip,
  helpTipPlacement,
  ...props
}) => {
  const { compact } = useDensity();
  const labels = useControlLabels();
  const indicators = indicatorLabels || [labels.on, labels.off];
  return (
    <Control
      $compact={compact}
      $sx={sx}
      className={`inputItem ${className || ""}`}
    >
      <div className="switch-row">
        {!switchOnly && label && (
          <InputLabel
            className="inputLabel"
            htmlFor={id}
            noMinWidth
            helpTip={helpTip}
            helpTipPlacement={helpTipPlacement}
          >
            {label}
            {tooltip && <FieldHelp text={tooltip} />}
          </InputLabel>
        )}
        <div className="switch-control">
          {!switchOnly && (
            <span className="switch-indicator">{indicators[1]}</span>
          )}
          <span id={`${id}-switch`} className="switch-target">
            <input
              type="checkbox"
              role="switch"
              id={id}
              checked={checked}
              aria-label={switchOnly ? label : undefined}
              aria-describedby={description ? `${id}-description` : undefined}
              {...props}
            />
            <span className="switchRail">
              <span className="switch-thumb" />
            </span>
          </span>
          {!switchOnly && (
            <span className="switch-indicator">{indicators[0]}</span>
          )}
        </div>
      </div>
      {description && (
        <div id={`${id}-description`} className="actionDescription">
          {description}
        </div>
      )}
    </Control>
  );
};
export default Switch;
