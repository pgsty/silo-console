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

import React, { FC, Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { DateTime } from "luxon";
import { DateTimeInputProps } from "./DateTimeInput.types";
import Box from "../Box/Box";
import InputLabel from "../InputLabel/InputLabel";
import FieldHelp from "../InputLabel/FieldHelp";
import IconButton from "../IconButton/IconButton";
import CollapseCaret from "../Icons/CollapseCaret";
import ExpandCaret from "../Icons/ExpandCaret";
import { InputContainerProps } from "../InputBox/InputBox.types";
import DateTimeSelector from "./DateTimeSelector";
import { fieldChrome, fieldLayout } from "../../global/controlStyles";
import { useAvailableWidth } from "../../global/useAvailableWidth";
import { useControlLabels } from "../../global/ControlLabels";
import { useModalPresence } from "../../global/ModalState";

const InputBase = styled.input`
  ${fieldChrome}
  display: block;
  padding-inline-end: calc(var(--field-height, var(--control-height, 36px)) + 4px);
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const InputContainer = styled.div<InputContainerProps>(({ sx }) => ({
  ...fieldLayout,
  position: "relative",
  "& .dateTimeInputContainer": {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    flexGrow: 1,
    minWidth: 0,
  },
  "& .dateTimeControl": { position: "relative", flex: 1, minWidth: 0 },
  "& .startComponent": {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: "var(--muted-foreground)",
    fontSize: "var(--fs-caption,12px)",
    whiteSpace: "nowrap",
    "& svg": { width: 16, height: 16, fill: "currentColor" },
  },
  "& .overlayArrow": {
    position: "absolute",
    top: 0,
    insetInlineEnd: 0,
    height: "var(--field-height, var(--control-height,36px))",
    width: "var(--field-height, var(--control-height,36px))",
  },
  "& .customIcon": { display: "flex", alignItems: "center" },
  ...sx,
}));

const DateTimeInput: FC<DateTimeInputProps> = ({
  sx,
  id,
  className,
  pickerStartComponent,
  tooltip = "",
  helpTip,
  helpTipPlacement,
  maxDate,
  minDate,
  label = "",
  "aria-label": ariaLabel,
  disabled,
  mode = "all",
  value,
  openPickerIcon = "arrow" as "arrow" | React.ReactNode,
  required,
  displayFormat,
  noLabelMinWidth,
  onChange,
  timeFormat = "24h",
  secondsSelector = false,
  pickerSx,
}) => {
  const labels = useControlLabels();
  const visible = useModalPresence();
  const { elementRef, width } = useAvailableWidth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dateInputVal, setDateInputVal] = useState<string>(
    value?.toFormat(
      `MM/dd/yyyy${
        mode === "all" ? ` HH:mm${secondsSelector ? ":ss" : ""}` : ""
      }`,
    ) || "",
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (!visible || disabled) {
      setIsOpen(false);
      setEditMode(false);
    }
  }, [visible, disabled]);
  const open = isOpen && visible && !disabled;
  const pickerLabel =
    mode === "date" ? labels.chooseDate : labels.chooseDateTime;
  const fieldLabel = ariaLabel || label || pickerLabel;

  //Input format: mm/dd/yyyy HH:mm:ss

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    let limitChars = 16;

    if (mode === "date") {
      limitChars = 10;
    } else if (mode === "all" && secondsSelector) {
      limitChars = 19;
    }

    if (value.length < dateInputVal.length) {
      // We are deleting elements
      setDateInputVal(value);
      return;
    }

    if (isNaN(parseInt(value.slice(-1)))) {
      // Introduced character is not a number
      return;
    }

    if (value.length >= limitChars) {
      // Characters amount is limit
      setDateInputVal(value.slice(0, limitChars));
      return;
    }

    const slashLength = [2, 5];
    const colonLength = [13, 16];
    const spaceLength = [10];

    let textToAdd = value;

    if (slashLength.includes(value.length)) {
      textToAdd = `${value}/`;
    } else if (colonLength.includes(value.length)) {
      textToAdd = `${value}:`;
    } else if (spaceLength.includes(value.length)) {
      textToAdd = `${value} `;
    }

    setDateInputVal(textToAdd);
  };

  const blurDateTimeInput = () => {
    setEditMode(false);
    if (disabled) return;

    const newTime = DateTime.fromFormat(
      dateInputVal,
      `MM/dd/yyyy${
        mode === "all" ? ` HH:mm${secondsSelector ? ":ss" : ""}` : ""
      }`,
    );

    if (newTime.isValid) {
      onChange(newTime);
    } else {
      setDateInputVal(
        value?.toFormat(
          `MM/dd/yyyy${
            mode === "all" ? ` HH:mm${secondsSelector ? ":ss" : ""}` : ""
          }`,
        ) || "",
      );
    }
  };

  return (
    <InputContainer
      ref={elementRef}
      data-field-layout={width < 480 ? "stacked" : undefined}
      sx={sx}
      className={`inputItem ${className || ""}`}
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

      <Box id={`${id}-DateTimeInput`} className="dateTimeInputContainer">
        {pickerStartComponent && (
          <Box className="startComponent">{pickerStartComponent}</Box>
        )}
        <Box className="dateTimeControl">
          <InputBase
            disabled={disabled}
            id={id}
            aria-label={fieldLabel}
            value={
              editMode
                ? dateInputVal
                : value
                    ?.setLocale(labels.calendarLocale)
                    .toFormat(
                      displayFormat ||
                        `DDD ${
                          mode === "all"
                            ? ` ${timeFormat === "24h" ? "HH" : "hh"}:mm${
                                secondsSelector ? ":ss" : ""
                              } ${timeFormat === "12h" ? "a" : ""}`
                            : ""
                        }`,
                    ) || ""
            }
            onChange={onInputChange}
            placeholder={`MM/DD/YYYY${
              mode === "all" ? ` HH:MM${secondsSelector ? ":SS" : ""}` : ""
            }`}
            onFocus={() => {
              setDateInputVal(
                value?.toFormat(
                  `MM/dd/yyyy${mode === "all" ? ` HH:mm${secondsSelector ? ":ss" : ""}` : ""}`,
                ) || "",
              );
              setEditMode(true);
            }}
            onBlur={blurDateTimeInput}
          />
          <Box className="overlayArrow">
            <IconButton
              id={`${id}-picker`}
              type="button"
              sx={{
                width: "var(--field-height)",
                height: "var(--field-height)",
              }}
              disabled={disabled}
              aria-label={`${fieldLabel}: ${pickerLabel}`}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={open ? `timeSelector-${id}` : undefined}
              onClick={(event) => {
                setIsOpen(!open);
                setAnchorEl(event.currentTarget);
              }}
            >
              {openPickerIcon === "arrow" ? (
                <Fragment>
                  {open ? <CollapseCaret /> : <ExpandCaret />}
                </Fragment>
              ) : (
                <Box className="customIcon">{openPickerIcon}</Box>
              )}
            </IconButton>
          </Box>
        </Box>
      </Box>
      <DateTimeSelector
        id={id}
        label={`${fieldLabel}: ${pickerLabel}`}
        value={value}
        minDate={minDate}
        mode={mode}
        onChange={onChange}
        maxDate={maxDate}
        secondsSelector={secondsSelector}
        timeFormat={timeFormat}
        sx={pickerSx}
        onClose={() => {
          setIsOpen(false);
          anchorEl?.focus();
          setEditMode(false);
          setDateInputVal(
            value?.toFormat(
              `MM/dd/yyyy${
                mode === "all" ? ` HH:mm${secondsSelector ? ":ss" : ""}` : ""
              }`,
            ) || "",
          );
        }}
        anchorEl={anchorEl}
        open={open}
        usePortal={true}
      />
    </InputContainer>
  );
};

export default DateTimeInput;
