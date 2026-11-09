// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { ReactNode, useId } from "react";
import { Box } from "mds";
import styled from "styled-components";
import { localeTag, useLanguage } from "i18n";
import { typography } from "./typography";
import { statCardTone } from "./statCardTone";

const Card = styled(Box)`
  padding: var(--silo-space-20);
  border: 0;
  border-radius: var(--silo-radius-card);
  background: var(--silo-surface);
  box-shadow: var(--silo-elevation-card);
  min-width: 0;
  color: var(--silo-text);
  font-variant-numeric: tabular-nums;
`;
const Header = styled.div`
  ${typography.tableHeader}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--silo-space-8);
  color: var(--silo-text-secondary);
  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;
const Value = styled.div`
  ${typography.stat}
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--silo-space-8);
  margin-top: var(--silo-space-8);
  overflow-wrap: anywhere;
`;
const Unit = styled.span`
  ${typography.body} color: var(--silo-text-muted);
`;
const Subline = styled.div`
  ${typography.small} color: var(--silo-text-secondary);
  margin-top: var(--silo-space-8);
`;
const Track = styled.div`
  height: 6px;
  border-radius: var(--silo-radius-pill);
  background: var(--silo-border);
  overflow: hidden;
`;
const Fill = styled.div<{ $value: number; $tone: string }>`
  width: ${({ $value }) => `${$value * 100}%`};
  height: 100%;
  background: ${({ $tone }) => `var(--silo-${$tone})`};
  border-radius: inherit;
`;
const Progress = styled.div`
  margin-top: var(--silo-space-12);
  > span {
    ${typography.caption} display: block;
    text-align: right;
    color: var(--silo-text-secondary);
    margin-bottom: var(--silo-space-4);
  }
`;
const Footer = styled.div`
  ${typography.small}
  margin-top: var(--silo-space-16);
  padding-top: var(--silo-space-12);
  border-top: 1px solid var(--silo-border);
  a {
    color: var(--silo-primary);
  }
`;

export const StatCard = ({
  label,
  icon,
  value,
  unit,
  subline,
  progress,
  footer,
}: {
  label: string;
  icon?: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  subline?: ReactNode;
  progress?: {
    value: number;
    tone?: "success" | "warning" | "danger" | "info";
  };
  footer?: ReactNode;
}) => {
  const id = useId();
  const language = useLanguage();
  const amount =
    progress && Number.isFinite(progress.value)
      ? Math.max(0, Math.min(1, progress.value))
      : undefined;
  return (
    <Card useBackground>
      <Header>
        <span id={id}>{label}</span>
        {icon && <span aria-hidden="true">{icon}</span>}
      </Header>
      <Value>
        {value}
        {unit && <Unit>{unit}</Unit>}
      </Value>
      {subline && <Subline>{subline}</Subline>}
      {amount !== undefined && (
        <Progress>
          <span>
            {new Intl.NumberFormat(localeTag(language), {
              style: "percent",
              maximumFractionDigits: 1,
            }).format(amount)}
          </span>
          <Track
            role="progressbar"
            aria-labelledby={id}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={amount * 100}
          >
            <Fill
              $value={amount}
              $tone={progress?.tone || statCardTone(amount)}
            />
          </Track>
        </Progress>
      )}
      {footer && <Footer>{footer}</Footer>}
    </Card>
  );
};
