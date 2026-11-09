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

import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { fieldChrome, fieldLayout } from "../../global/controlStyles";
import { useModalPresence } from "../../global/ModalState";
import { AutocompleteProps } from "./Autocomplete.types";
import { InputContainerProps } from "../InputBox/InputBox.types";
import FieldHelp from "../InputLabel/FieldHelp";
import InputLabel from "../InputLabel/InputLabel";
import Box from "../Box/Box";
import CollapseCaret from "../Icons/CollapseCaret";
import ExpandCaret from "../Icons/ExpandCaret";
import DropdownSelector from "../DropdownSelector/DropdownSelector";

const AutocompleteBase = styled.input`
  ${fieldChrome}
  padding-inline-end: 36px;
  &.withIcon {
    padding-inline-start: 36px;
  }
`;
const InputContainer = styled.div<InputContainerProps>(({ sx }) => ({
  ...fieldLayout,
  position: "relative",
  "& .AutocompleteContainer": {
    width: "100%",
    flexGrow: 1,
    position: "relative",
    minWidth: 0,
  },
  "& .overlayArrow": {
    display: "flex",
    position: "absolute",
    top: "calc(var(--field-height, var(--control-height, 36px)) / 2)",
    transform: "translateY(-50%)",
    insetInlineEnd: 12,
    pointerEvents: "none",
    "& svg": {
      width: "var(--icon-size,16px)",
      height: "var(--icon-size,16px)",
      fill: "currentColor",
    },
  },
  "& .iconOption": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    insetInlineStart: 12,
    height: "var(--field-height, var(--control-height,36px))",
    pointerEvents: "none",
    "& svg": {
      width: "var(--icon-size,16px)",
      height: "var(--icon-size,16px)",
    },
  },
  "& .errorText": {
    marginTop: 4,
    color: "var(--destructive-text)",
    fontSize: "var(--fs-caption)",
    lineHeight: "var(--lh-caption)",
  },
  ...sx,
}));

const Autocomplete: FC<AutocompleteProps> = ({
  id,
  label = "",
  required,
  className,
  tooltip = "",
  noLabelMinWidth = false,
  value = "",
  sx,
  options,
  onChange,
  disabled = false,
  name,
  placeholder = "",
  helpTip,
  helpTipPlacement,
  displayDropArrow = true,
  error,
}) => {
  const visible = useModalPresence();
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const selectedLabel = selected?.label || "";
  const [searchBoxVal, setSearchBoxVal] = useState(selectedLabel);
  const [filterVal, setFilterVal] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
  const open = isOpen && visible && !disabled;
  useEffect(() => {
    setSearchBoxVal(selectedLabel);
    setFilterVal("");
  }, [value, selectedLabel]);
  useEffect(() => {
    if (!visible || disabled) setIsOpen(false);
  }, [visible, disabled]);
  const filteredOptions = options.filter((item) =>
    item.label.toLowerCase().includes(filterVal.toLowerCase()),
  );
  const optionIcon = selected?.indicator || selected?.icon;
  const close = () => {
    setIsOpen(false);
    setFilterVal("");
    setSearchBoxVal(selectedLabel);
  };
  return (
    <InputContainer
      error={!!error}
      sx={sx}
      className={`inputItem ${className || ""}`}
    >
      {label !== "" && (
        <InputLabel
          htmlFor={id}
          noMinWidth={noLabelMinWidth}
          className="inputLabel"
          helpTip={helpTip}
          helpTipPlacement={helpTipPlacement}
        >
          {label}
          {required ? "*" : ""}
          {tooltip !== "" && <FieldHelp text={tooltip} />}
        </InputLabel>
      )}
      <Box id={`${id}-Autocomplete`} className="AutocompleteContainer">
        {optionIcon && <Box className="iconOption">{optionIcon}</Box>}
        <AutocompleteBase
          ref={setAnchorEl}
          disabled={disabled}
          id={id}
          name={name}
          role="combobox"
          aria-label={label || placeholder || selectedLabel}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? `${id}-options-Autocomplete` : undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete="off"
          value={searchBoxVal}
          onClick={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (
              !open &&
              !event.nativeEvent.isComposing &&
              (event.key === "ArrowDown" || event.key === "ArrowUp")
            ) {
              event.preventDefault();
              setIsOpen(true);
            }
          }}
          onChange={(event) => {
            setSearchBoxVal(event.target.value);
            setFilterVal(event.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className={optionIcon ? "withIcon" : ""}
        />
        {displayDropArrow && (
          <Box className="overlayArrow" aria-hidden="true">
            {open ? <CollapseCaret /> : <ExpandCaret />}
          </Box>
        )}
        {error && (
          <div id={`${id}-error`} className="errorText">
            {error}
          </div>
        )}
        <DropdownSelector
          id={`${id}-options-Autocomplete`}
          ariaLabel={label || placeholder || selectedLabel}
          autoFocus={false}
          options={filteredOptions}
          selectedOption={value}
          onSelect={(newValue, extraValue, optionLabel) => {
            setSearchBoxVal(optionLabel || "");
            setFilterVal("");
            onChange(newValue, extraValue);
          }}
          hideTriggerAction={close}
          open={open}
          anchorEl={anchorEl}
          useAnchorWidth
        />
      </Box>
    </InputContainer>
  );
};
export default Autocomplete;
