// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import styled from "styled-components";
import get from "lodash/get";

// Use the shared token variables when available; the current SILO theme is
// the fallback for branches that have not yet merged the token primitives.
export const PreviewSurface = styled.div<{ $fullscreen?: boolean }>(
  ({ theme, $fullscreen }) => ({
    "--preview-surface": `var(--silo-surface, ${get(theme, "boxBackground", "#FAFAFA")})`,
    "--preview-border": `var(--silo-border, ${get(theme, "borderColor", "#E4E4E7")})`,
    "--preview-secondary": `var(--silo-textSecondary, ${get(theme, "secondaryText", "#52525B")})`,
    "--preview-primary": `var(--silo-primary, ${get(theme, "linkColor", "#1D588C")})`,
    color: `var(--silo-text, ${get(theme, "fontColor", "#18181B")})`,
    border: "1px solid var(--preview-border)",
    borderRadius: 8,
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    minHeight: 180,
    maxHeight: $fullscreen ? "calc(100vh - 260px)" : "min(60vh, 560px)",
    overflow: "auto",
    textAlign: "start",
    fontSize: 14,
    lineHeight: "20px",
    fontVariantNumeric: "tabular-nums",
    "&:focus-visible, & :focus-visible": {
      outline: "2px solid var(--preview-primary)",
      outlineOffset: 2,
    },
    "& table": {
      borderCollapse: "separate",
      borderSpacing: 0,
      minWidth: "100%",
    },
    "& th, & td": {
      borderBottom: "1px solid var(--preview-border)",
      borderInlineEnd: "1px solid var(--preview-border)",
      padding: "8px 12px",
      verticalAlign: "top",
      whiteSpace: "pre-wrap",
    },
    "& th": {
      background: "var(--preview-surface)",
      color: "var(--preview-secondary)",
      fontSize: 13,
      fontWeight: 600,
    },
    "& thead th": { position: "sticky", top: 0, zIndex: 1 },
  }),
);

export const PreviewToolbar = styled.div(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
  marginBottom: 12,
  textAlign: "start",
  "& button[aria-pressed='true']": {
    background: "var(--silo-primarySoft, rgba(127, 184, 232, 0.14))",
    color: `var(--silo-primary, ${get(theme, "linkColor", "#1D588C")})`,
    borderColor: `var(--silo-primary, ${get(theme, "linkColor", "#1D588C")})`,
    fontWeight: 600,
  },
  "& label": {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
  },
  "& :focus-visible": {
    outline: `2px solid var(--silo-primary, ${get(theme, "linkColor", "#1D588C")})`,
    outlineOffset: 2,
  },
}));

export const PreviewNotice = styled.div(({ theme }) => ({
  padding: "8px 12px",
  marginBottom: 12,
  borderRadius: 4,
  border: `1px solid var(--silo-border, ${get(theme, "borderColor", "#E4E4E7")})`,
  background: `var(--silo-surface, ${get(theme, "boxBackground", "#FAFAFA")})`,
  color: "inherit",
  fontSize: 13,
  textAlign: "start",
}));
