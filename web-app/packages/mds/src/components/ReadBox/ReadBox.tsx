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
import { fieldLayout } from "../../global/controlStyles";
import { ReadBoxBaseProps, ReadBoxProps } from "./ReadBox.types";
import InputLabel from "../InputLabel/InputLabel";
import Box from "../Box/Box";

const ReadBoxBase = styled.div<ReadBoxBaseProps>(({ sx }) => ({
  ...fieldLayout,
  "& .predefinedList": {
    backgroundColor: "var(--muted)",
    boxShadow: "inset 0 0 0 1px var(--input)",
    padding: "8px var(--control-padding,12px)",
    color: "var(--foreground)",
    fontSize: "var(--fs-body,13px)",
    lineHeight: "var(--lh-body,20px)",
    fontWeight: 400,
    minHeight: "var(--field-height, var(--control-height,36px))",
    boxSizing: "border-box",
    borderRadius: 8,
    width: "100%",
    minWidth: 0,
  },
  "& .innerContent": {
    width: "100%",
    overflowX: "auto",
    whiteSpace: "nowrap",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  "& .innerContentMultiline": {
    width: "100%",
    maxHeight: 100,
    overflowWrap: "anywhere",
    overflowY: "auto" as const,
    scrollbarWidth: "none" as const,
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  "& .includesActionButton": {
    paddingInlineEnd: 45,
    position: "relative" as const,
  },
  "& .overlayShareOption": {
    position: "absolute" as const,
    width: 45,
    insetInlineEnd: 0,
    top: "50%",
    transform: "translate(0, -50%)",
  },
  ...sx,
}));

const ReadBox: FC<ReadBoxProps> = ({
  label = "",
  children,
  multiLine,
  actionButton,
  sx,
  helpTip,
  helpTipPlacement,
}) => {
  return (
    <ReadBoxBase
      className={"inputItem"}
      label={label}
      multiLine={multiLine}
      sx={sx}
    >
      {label !== "" && (
        <InputLabel
          className={"inputLabel"}
          helpTip={helpTip}
          helpTipPlacement={helpTipPlacement}
        >
          {label}
        </InputLabel>
      )}
      <Box
        className={`predefinedList ${
          actionButton ? "includesActionButton" : ""
        }`}
      >
        <Box dir="auto" className={multiLine ? "innerContentMultiline" : "innerContent"}>
          {children}
        </Box>
        {actionButton && (
          <Box className={"overlayShareOption"}>{actionButton}</Box>
        )}
      </Box>
    </ReadBoxBase>
  );
};

export default ReadBox;
