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

import React, { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { PageHeaderConstruct, PageHeaderProps } from "./PageHeader.types";

const ParentContainer = styled.div<
  PageHeaderConstruct & HTMLAttributes<HTMLDivElement>
>(({ theme, sx }) => ({
  display: "flex",
  flexDirection: "row",
  position: "relative",
  boxSizing: "border-box",
  width: "100%",
  minHeight: 56,
  padding: "0 24px",
  "--page-header-inline-padding": "24px",
  gap: 16,
  backgroundColor: get(theme, `pageHeader.background`, "#fff"),
  insetInlineStart: 0,
  borderBottom: `1px solid ${get(theme, `pageHeader.border`, "#E5E5E5")}`,
  flexWrap: "nowrap",
  justifyContent: "space-between",
  alignItems: "center",
  "@media (max-width: 1199px)": {
    paddingInline: 16,
    "--page-header-inline-padding": "16px",
  },
  "@media (max-width: 767px)": {
    paddingInline: 12,
    "--page-header-inline-padding": "12px",
    gap: 8,
  },
  ...sx,
}));

const LabelContainer = styled.div<HTMLAttributes<HTMLDivElement>>(
  ({ theme }) => ({
    color: get(theme, `pageHeader.color`, "#000"),
    fontSize: "var(--fs-title, 16px)",
    lineHeight: "var(--lh-title, 22px)",
    fontWeight: "var(--fw-semibold, 550)",
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    flexGrow: 1,
    overflow: "hidden",
    "& > *": {
      minWidth: 0,
    },
    "& a": {
      color: get(theme, `pageHeader.color`, "#000"),
      textDecoration: "none",
    },
  }),
);

const MiddleContainer = styled.div<HTMLAttributes<HTMLDivElement>>(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexGrow: 1,
  minWidth: 0,
}));

const ActionsContainer = styled.div<HTMLAttributes<HTMLDivElement>>(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flexShrink: 0,
  gap: 4,
}));

const PageHeader: FC<PageHeaderProps> = ({
  label,
  titleElement: Title = "div",
  menuToggle,
  middleComponent,
  actions,
  sx,
}) => {
  return (
    <ParentContainer sx={sx} className={"page-header"}>
      <LabelContainer className={"page-header-label"}>
        {menuToggle && (
          <span
            className="page-header-menu-toggle"
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginInlineEnd: 8,
              flexShrink: 0,
            }}
          >
            {menuToggle}
          </span>
        )}
        <Title
          className="page-header-title"
          style={{
            margin: 0,
            font: "inherit",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Title>
      </LabelContainer>
      {middleComponent && (
        <MiddleContainer className={"page-header-middle"}>
          {middleComponent}
        </MiddleContainer>
      )}
      <ActionsContainer className={"page-header-actions"}>
        {actions}
      </ActionsContainer>
    </ParentContainer>
  );
};

export default PageHeader;
