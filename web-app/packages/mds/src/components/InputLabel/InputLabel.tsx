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
import { InputLabelProps } from "./InputLabel.types";
import HelpTip from "../HelpTip/HelpTip";

const CustomLabel = styled.label<InputLabelProps>(({ sx }) => ({
  fontWeight: 400,
  marginInlineEnd: 10,
  fontSize: "var(--fs-body,13px)",
  lineHeight: "var(--lh-body,20px)",
  color: "var(--foreground)",
  textAlign: "start" as const,
  alignItems: "center",
  display: "flex",
  userSelect: "none",
  minWidth: 0,
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  "& > span": {
    display: "flex",
    alignItems: "center",
    width: 160,
    minWidth: 0,
    "&.noMinWidthLabel": {
      minWidth: "initial",
      width: "auto",
    },
  },
  "@media (max-width: 767.98px)": {
    marginInlineEnd: 0,
    "& > span": { width: "auto", minWidth: 0 },
  },
  '[data-field-layout="stacked"] &': {
    marginInlineEnd: 0,
    "& > span": { width: "auto", minWidth: 0 },
  },
  ...sx,
}));

const InputLabel: FC<InputLabelProps> = ({
  children,
  sx,
  noMinWidth,
  htmlFor,
  helpTip,
  helpTipPlacement,
  ...props
}) => {
  return (
    <CustomLabel sx={sx} htmlFor={htmlFor} {...props}>
      <span className={`${noMinWidth ? "noMinWidthLabel" : ""}`}>
        {helpTip ? (
          <HelpTip placement={helpTipPlacement} content={helpTip}>
            {children}
          </HelpTip>
        ) : (
          children
        )}
      </span>
    </CustomLabel>
  );
};

export default InputLabel;
