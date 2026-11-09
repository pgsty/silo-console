// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import styled from "styled-components";
import { useT } from "i18n";
import { ObjectActionState } from "./objectActionState";
import ObjectActionTooltip from "./ObjectActionTooltip";

const ActionPanel = styled.div({
  margin: "0 0 16px",
  "& .actionTitle": {
    fontSize: 14,
    fontWeight: 550,
    display: "flex",
    alignItems: "center",
    marginBottom: 12,
  },
  "& ul": {
    listStyle: "none",
    margin: 0,
    padding: 0,
    border: 0,
    borderRadius: 8,
    overflow: "visible",
    background: "transparent",
  },
  "&& li::before": { content: "none" },
  "& li > span, & li > span > span": { width: "100%" },
  "& button": {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    minHeight: "var(--control-height, 36px)",
    borderRadius: "var(--radius-control)",
    padding: "8px",
    font: "inherit",
    textAlign: "start",
    background: "transparent",
    border: 0,
    color: "var(--muted-foreground)",
    cursor: "pointer",
  },
  "& button:disabled": {
    color: "var(--muted-foreground)",
    cursor: "not-allowed",
  },
  "& button:focus-visible": {
    outline: "2px solid var(--focus-ring)",
    outlineOffset: 2,
  },
  "& button:hover:not(:disabled)": {
    background: "var(--hover)",
    color: "var(--foreground)",
  },
  "@media (pointer: coarse)": { "& button": { minHeight: 40 } },
  "& button svg": { width: 16, height: 16, flexShrink: 0 },
});

const ObjectActions = ({
  title,
  items,
}: {
  title: React.ReactNode;
  items: {
    label: string;
    icon: React.ReactNode;
    tooltip: string;
    action: () => void;
    state: ObjectActionState;
  }[];
}) => {
  const t = useT();
  return (
    <ActionPanel>
      <div className="actionTitle">{title}</div>
      <ul aria-label={t("Actions")}>
        {items.map((item) => (
          <li key={item.label}>
            <ObjectActionTooltip
              state={item.state}
              label={item.label}
              tooltip={item.tooltip}
            >
              <button
                type="button"
                aria-label={item.label}
                disabled={item.state.disabled}
                onClick={item.action}
              >
                {item.icon}
                {item.label}
              </button>
            </ObjectActionTooltip>
          </li>
        ))}
      </ul>
    </ActionPanel>
  );
};
export default ObjectActions;
