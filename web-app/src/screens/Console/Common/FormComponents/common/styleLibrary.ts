// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

// This object contains variables that will be used across form components.

import { breakPoints } from "mds";
import get from "lodash/get";

export const modalBasic = {
  formScrollable: {
    maxHeight: "calc(100vh - 300px)" as const,
    overflowY: "auto" as const,
    marginBottom: 25,
  },
  clearButton: {
    fontFamily: "var(--font-sans)",
    border: "0",
    backgroundColor: "transparent",
    color: "var(--foreground)",
    fontWeight: 600,
    fontSize: 14,
    marginInlineEnd: 10,
    outline: "0",
    padding: "16px 25px 16px 25px",
    cursor: "pointer",
  },
  configureString: {
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-control, 4px)",
    padding: "24px 50px",
    overflowY: "auto" as const,
    height: 170,
    backgroundColor: "var(--surface-2)",
  },
};

export const actionsTray = {
  actionsTray: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: 8,
    minWidth: 0,
    marginBottom: "1rem",
    "@media (max-width: 767px)": {
      "& > :first-child": { width: "100%", minWidth: 0 },
      "& button": { marginInlineStart: 0 },
    },
    "& button": {
      flexGrow: 0,
      marginInlineStart: 8,
    },
  },
};

export const typesSelection = {
  iconContainer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    maxWidth: 1180,
    justifyContent: "start" as const,
    flexWrap: "wrap" as const,
    width: "100%",
  },
  logoButton: {
    height: "80px",
  },
  lambdaNotif: {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-control, 5px)",
    width: 250,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    marginBottom: 16,
    marginInlineEnd: 8,
    cursor: "pointer",
    padding: 0,
    overflow: "hidden",
    "&:hover": {
      backgroundColor: "var(--hover)",
    },
  },

  lambdaNotifIcon: {
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,

    "& img": {
      maxWidth: 46,
      maxHeight: 46,
    },
  },
  lambdaNotifTitle: {
    color: "var(--foreground)",
    fontSize: 16,
    fontFamily: "var(--font-sans)",
    paddingInlineStart: 18,
  },
};

export const widgetCommon = (_theme: unknown) => ({
  "& .singleValueContainer": {
    border: 0,
    boxShadow: "var(--shadow-2)",
    borderRadius: "var(--radius-card)",
    backgroundColor: "var(--surface-3)",
    padding: 16,
  },
  "& .widgetHeader": {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    gap: 12,
    minHeight: "var(--control-height, 36px)",
    marginBottom: 8,
    "@media (pointer: coarse)": { minHeight: 40 },
  },
  "& .titleContainer": {
    color: "var(--muted-foreground)",
    fontSize: "var(--fs-subtitle)",
    lineHeight: "var(--lh-subtitle)",
    fontWeight: 550,
    minWidth: 0,
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
    whiteSpace: "nowrap" as const,
  },
  "& .widgetActions": {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 4,
    flexShrink: 0,
    "& .actionSlot": {
      width: "var(--control-height, 36px)",
      height: "var(--control-height, 36px)",
      "@media (pointer: coarse)": { minWidth: 40, minHeight: 40 },
    },
  },
  "& .contentContainer": {
    justifyContent: "center" as const,
    alignItems: "center" as const,
    display: "flex" as const,
    width: "100%",
    height: 200,
  },
  "& .singleLegendContainer": {
    display: "flex",
    alignItems: "center",
    padding: "4px 0",
    maxWidth: "100%",
    minWidth: 0,
    flexShrink: 0,
  },
  "& .colorContainer": {
    width: 8,
    height: 8,
    minWidth: 8,
    borderRadius: 2,
    marginInlineEnd: 8,
  },
  "& .legendLabel": {
    fontSize: "var(--fs-caption)",
    lineHeight: "var(--lh-caption)",
    color: "var(--muted-foreground)",
    whiteSpace: "nowrap" as const,
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
  },
  "& .emptyStateContainer": {
    flex: 1,
    minHeight: 200,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 8,
    backgroundColor: "var(--surface-2)",
    color: "var(--muted-foreground)",
    fontSize: "var(--fs-body)",
    lineHeight: "var(--lh-body)",
  },
  "& .zoomChartCont": {
    position: "relative" as const,
    height: 340,
    width: "100%",
  },
});

export const tooltipCommon = {
  customTooltip: {
    backgroundColor: "var(--foreground)",
    border: 0,
    color: "var(--surface-1)",
    boxShadow: "var(--shadow-3)",
    borderRadius: "var(--radius-control)",
    padding: "8px 12px",
    maxHeight: 300,
    overflowY: "auto" as const,
  },
  labelContainer: {
    display: "flex" as const,
    alignItems: "center" as const,
  },
  labelColor: {
    width: 6,
    height: 6,
    display: "block" as const,
    borderRadius: "100%",
    marginInlineEnd: 8,
  },
  itemValue: {
    fontSize: "var(--fs-caption)",
    lineHeight: "var(--lh-caption)",
    color: "inherit",
  },
  valueContainer: {
    fontWeight: 550,
  },
  timeStampTitle: {
    fontSize: "var(--fs-caption)",
    color: "inherit",
    textAlign: "center" as const,
    marginBottom: 8,
  },
};

export const formFieldStyles: any = {
  formFieldRow: {
    marginBottom: ".8rem",
    "& .MuiInputLabel-root": {
      fontWeight: "normal",
    },
  },
};

export const modalStyleUtils: any = {
  modalButtonBar: {
    "@media (max-width: 575px)": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: 8,
      "& > button, & > span > button": { width: "100%", margin: 0 },
    },
    marginTop: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalFormScrollable: {
    maxHeight: "calc(100vh - 300px)",
    overflowY: "auto",
    paddingTop: 10,
  },
};

export const twoColCssGridLayoutConfig = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gridAutoFlow: "row",
  gap: 10,
  [`@media (max-width: ${breakPoints.sm}px)`]: {
    gridTemplateColumns: "1fr",
    gridAutoFlow: "dense",
  },
};
