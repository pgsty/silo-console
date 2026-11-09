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
import get from "lodash/get";
import { useModalPresence } from "../../global/ModalState";
import { fieldChrome, fieldLayout } from "../../global/controlStyles";
import { SelectProps } from "./Select.types";
import { InputContainerProps } from "../InputBox/InputBox.types";
import FieldHelp from "../InputLabel/FieldHelp";
import InputLabel from "../InputLabel/InputLabel";
import Box from "../Box/Box";
import CollapseCaret from "../Icons/CollapseCaret";
import ExpandCaret from "../Icons/ExpandCaret";
import DropdownSelector from "../DropdownSelector/DropdownSelector";

const SelectBase = styled.button`
  ${fieldChrome}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  text-align: start;
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  svg {
    width: var(--icon-size, 16px);
    height: var(--icon-size, 16px);
    flex-shrink: 0;
    fill: currentColor;
  }
  .indicatorContainer {
    display: flex;
    align-items: center;
  }
`;

const InputContainer = styled.div<InputContainerProps>(({ theme, sx }) => ({
  ...fieldLayout,
  position: "relative",

  "& .selectContainer": {
    display: "flex",
    width: "100%",
    gap: 8,
    alignItems: "center",
    flexGrow: 1,
    position: "relative",
    minWidth: 0,
  },
  "& .overlayArrow": {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    marginTop: "2px",
    insetInlineEnd: "5px",
    "& svg": {
      width: 26,
      height: 26,
      fill: get(theme, "inputBox.color", "#07193E"),
      color: get(theme, "inputBox.color", "#07193E"),
    },
  },
  ...sx,
}));

const Select: FC<SelectProps> = ({
  id,
  label = "",
  "aria-label": ariaLabel,
  required,
  className,
  tooltip = "",
  noLabelMinWidth = false,
  value = "",
  sx,
  options,
  onChange,
  disabled = false,
  fixedLabel = "",
  name,
  placeholder = "",
  helpTip,
  helpTipPlacement,
  error,
}) => {
  const visible = useModalPresence();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  useEffect(() => {
    if (!visible || disabled) setIsOpen(false);
  }, [visible, disabled]);
  const open = isOpen && visible && !disabled;
  const selectedLabel = options.find((option) => option.value === value);
  const fieldLabel = ariaLabel || label;
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;

  if (!selectedLabel && fixedLabel === "" && placeholder === "") {
    console.warn("The selected value is not included in Options List");
  }

  return (
    <InputContainer
      error={!!error}
      sx={sx}
      className={`inputItem ${className || ""}`}
    >
      {label !== "" && (
        <InputLabel
          htmlFor={`${id}-select`}
          noMinWidth={noLabelMinWidth}
          className={"inputLabel"}
          helpTip={helpTip}
          helpTipPlacement={helpTipPlacement}
        >
          <span id={ariaLabel ? undefined : labelId}>{label}</span>
          {required ? "*" : ""}
          {tooltip !== "" && <FieldHelp text={tooltip} />}
        </InputLabel>
      )}
      {ariaLabel && (
        <span id={labelId} hidden>
          {ariaLabel}
        </span>
      )}

      <Box
        className="selectContainer"
        sx={{ flexDirection: "column", alignItems: "stretch" }}
      >
        <SelectBase
          id={`${id}-select`}
          type="button"
          disabled={disabled}
          // Reference the rendered value so JSX labels, fixed labels and
          // placeholders stay in the name as the visible content changes.
          aria-labelledby={fieldLabel ? `${labelId} ${valueId}` : valueId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? `${id}-options-selector` : undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onClick={(event) => {
            event.currentTarget.focus();
            setAnchorEl(event.currentTarget);
            setIsOpen(!open);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setAnchorEl(event.currentTarget);
              setIsOpen(true);
            }
          }}
        >
          <Box
            sx={{ display: "flex", columnGap: 8, width: "calc(100% - 16px)" }}
          >
            {selectedLabel?.icon && (
              <Box className={"indicatorContainer"}>{selectedLabel?.icon}</Box>
            )}
            <Box
              id={valueId}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {fixedLabel && fixedLabel !== "" ? (
                fixedLabel
              ) : (
                <Fragment>
                  {selectedLabel?.label || (
                    <span className="selectPlaceholder">
                      {placeholder !== "" ? placeholder : ""}
                    </span>
                  )}
                </Fragment>
              )}
            </Box>
            {selectedLabel?.indicator && (
              <Box className={"indicatorContainer"}>
                {selectedLabel?.indicator}
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", width: 16 }}>
            {open ? <CollapseCaret /> : <ExpandCaret />}
          </Box>
        </SelectBase>
        {error && (
          <span
            id={`${id}-error`}
            style={{
              color: "var(--destructive-text)",
              fontSize: "var(--fs-caption)",
              lineHeight: "var(--lh-caption)",
            }}
          >
            {error}
          </span>
        )}
        <input type={"hidden"} id={id} name={name} value={value} />
      </Box>
      <DropdownSelector
        id={`${id}-options-selector`}
        options={options}
        selectedOption={value}
        onSelect={(nValue, extraValue) => onChange(nValue, extraValue)}
        hideTriggerAction={() => {
          setIsOpen(false);
        }}
        ariaLabel={
          fieldLabel ? undefined : fixedLabel || placeholder || undefined
        }
        ariaLabelledBy={
          fieldLabel ? labelId : fixedLabel || placeholder ? undefined : valueId
        }
        open={open}
        anchorEl={anchorEl}
        useAnchorWidth
      />
    </InputContainer>
  );
};

export default Select;
