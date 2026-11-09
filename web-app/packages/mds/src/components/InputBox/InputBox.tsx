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

import React, { FC, useState, RefObject } from "react";
import { useControlLabels } from "../../global/ControlLabels";
import styled from "styled-components";
import { fieldChrome, fieldLayout } from "../../global/controlStyles";
import get from "lodash/get";
import { InputBoxElement, InputContainerProps } from "./InputBox.types";
import FieldHelp from "../InputLabel/FieldHelp";
import IconButton from "../IconButton/IconButton";
import InputLabel from "../InputLabel/InputLabel";
import VisibilityOffIcon from "../Icons/VisibilityOffIcon";
import VisibilityOnIcon from "../Icons/VisibilityOnIcon";
import Box from "../Box/Box";

// Matches the forced-LTR input types in web-app/src/index.css.
const ltrFieldTypes = ["password", "url", "email", "number"];

const InputBase = styled.input<InputBoxElement>`
  ${fieldChrome}
  padding-inline-start: ${({ startIcon }) =>
    startIcon ? "36px" : "var(--control-padding,12px)"};
  padding-inline-end: ${({ overlayIcon, overlayObject, originType }) =>
    overlayIcon || overlayObject || originType === "password"
      ? "40px"
      : "var(--control-padding,12px)"};
`;

const InputContainer = styled.div<
  InputContainerProps & { $reserveErrorSpace?: boolean }
>(({ theme, sx, $reserveErrorSpace }) => ({
  ...fieldLayout,
  "& .errorText": {
    fontSize: "var(--fs-caption,12px)",
    lineHeight: "var(--lh-caption,16px)",
    color: "var(--destructive-text)",
    marginTop: 3,
  },
  "& .textBoxContainer": {
    width: "100%",
    flexGrow: 1,
    position: "relative",
    minWidth: 0,
    minHeight: $reserveErrorSpace
      ? "calc(var(--field-height, var(--control-height,36px)) + var(--lh-caption,16px) + 3px)"
      : undefined,
  },
  "& .overlayAction": {
    position: "absolute",
    insetInlineEnd: 5,
    top: "calc(var(--field-height, var(--control-height,36px)) / 2)",
    transform: "translateY(-50%)",
  },
  "& .startOverlayIcon": {
    position: "absolute",
    insetInlineStart: 10,
    top: "calc((var(--field-height, var(--control-height,36px)) - var(--icon-size,16px)) / 2)",
    "& svg": {
      width: 14,
      height: 14,
      fill: get(theme, "inputBox.color", "#07193E"),
      color: get(theme, "inputBox.color", "#07193E"),
    },
  },
  ...sx,
}));

const InputBox = React.forwardRef<HTMLInputElement, InputBoxElement>(
  (
    {
      id,
      tooltip = "",
      index,
      type,
      overlayIcon,
      noLabelMinWidth,
      overlayId,
      overlayAction,
      overlayObject,
      label = "",
      required,
      startIcon,
      className,
      error,
      reserveErrorSpace = false,
      sx,
      helpTip,
      helpTipPlacement,
      ...props
    },
    ref,
  ) => {
    const labels = useControlLabels();
    const [toggleTextInput, setToggleTextInput] = useState<boolean>(false);

    let inputBoxWrapperIcon = overlayIcon;
    let inputBoxWrapperType = type;

    if (type === "password" && !overlayIcon) {
      inputBoxWrapperIcon = toggleTextInput ? (
        <VisibilityOffIcon />
      ) : (
        <VisibilityOnIcon />
      );
      inputBoxWrapperType = toggleTextInput ? "text" : "password";
    }

    return (
      <InputContainer
        $reserveErrorSpace={reserveErrorSpace}
        error={!!error && error !== ""}
        sx={sx}
        className={`inputItem ${className}`}
      >
        {label !== "" && (
          <InputLabel
            htmlFor={id}
            noMinWidth={noLabelMinWidth}
            className={"inputLabel"}
            helpTip={helpTip}
            helpTipPlacement={helpTipPlacement}
          >
            {label}
            {required ? "*" : ""}
            {tooltip !== "" && <FieldHelp text={tooltip} />}
          </InputLabel>
        )}

        {/* Protocol fields (passwords, URLs, e-mail, numbers) stay LTR in RTL
            layouts. Lay out their icons and overlay button in the same
            direction, or the button sits over the start of the text. */}
        <Box
          className={"textBoxContainer"}
          dir={ltrFieldTypes.includes(type ?? "") ? "ltr" : undefined}
        >
          {startIcon && <Box className={"startOverlayIcon"}>{startIcon}</Box>}
          <InputBase
            id={id}
            fullWidth
            aria-label={props["aria-label"] || label || props.placeholder}
            type={inputBoxWrapperType}
            error={error}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${id}-error` : props["aria-describedby"]}
            className={"inputRebase"}
            data-index={index}
            startIcon={startIcon}
            overlayObject={overlayObject}
            overlayIcon={overlayIcon}
            originType={type}
            ref={ref as RefObject<HTMLInputElement> | null | undefined}
            {...props}
          />
          {inputBoxWrapperIcon && (
            <Box className={"overlayAction"}>
              <IconButton
                onClick={
                  overlayAction
                    ? () => {
                        overlayAction();
                      }
                    : () => setToggleTextInput(!toggleTextInput)
                }
                id={overlayId}
                size={"25px"}
                type={"button"}
                disabled={props.disabled}
                aria-label={
                  type === "password"
                    ? toggleTextInput
                      ? labels.hidePassword
                      : labels.showPassword
                    : label || labels.inputAction
                }
              >
                {inputBoxWrapperIcon}
              </IconButton>
            </Box>
          )}
          {overlayObject && (
            <Box className={"overlayAction"}>{overlayObject}</Box>
          )}
          {error && (
            <Box id={`${id}-error`} className={"errorText"} dir="auto">
              {error}
            </Box>
          )}
        </Box>
      </InputContainer>
    );
  },
);

export default InputBox;
