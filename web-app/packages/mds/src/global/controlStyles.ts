// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { css, CSSObject } from "styled-components";
import { type } from "./typography";

const stackedField: CSSObject = {
  flexDirection: "column",
  gap: 8,
  "& > .inputLabel": {
    minHeight: "auto",
    marginInlineEnd: 0,
    marginBottom: 0,
    alignSelf: "stretch",
  },
};

// Keep the label column aligned on desktop without taking space from phone fields.
export const fieldLayout: CSSObject = {
  "--field-height": "var(--control-height,36px)",
  display: "flex",
  alignItems: "flex-start",
  flexGrow: 1,
  width: "100%",
  minWidth: 0,
  "& > .inputLabel": {
    minHeight: "var(--field-height)",
    marginBottom: 0,
    flexShrink: 0,
  },
  "& .inputLabel .min-icon": {
    width: 13,
    height: 13,
    flexShrink: 0,
  },
  "& [id$='-error']": {
    overflowWrap: "anywhere",
  },
  "@media (pointer: coarse)": {
    "--field-height": "max(40px, var(--control-height,36px))",
  },
  "@media (max-width: 767.98px)": stackedField,
  '&[data-field-layout="stacked"]': stackedField,
  '[data-field-layout="stacked"] &': stackedField,
};

// Owned by the controls: applies equally in the app and body portals.
export const fieldChrome = css`
  ${type("body")}
  box-sizing: border-box;
  height: var(--field-height, var(--control-height, 36px));
  width: 100%;
  min-width: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--foreground);
  box-shadow: inset 0 0 0 1px var(--input);
  outline: none;
  padding: 0 var(--control-padding, 12px);
  font-variant-numeric: tabular-nums;
  &::placeholder,
  & .selectPlaceholder {
    color: var(--muted-foreground);
    opacity: 1;
  }
  &:hover:not(:disabled) {
    box-shadow: inset 0 0 0 1px var(--muted-foreground);
  }
  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 1px;
  }
  &[aria-invalid="true"] {
    box-shadow: inset 0 0 0 1px var(--destructive);
  }
  &:disabled {
    background: var(--muted);
    color: var(--foreground);
    cursor: not-allowed;
  }
  &:disabled::placeholder {
    color: var(--foreground);
  }
  &:disabled .selectPlaceholder {
    color: var(--foreground);
  }
  @media (pointer: coarse) {
    font-size: 16px;
  }
`;
