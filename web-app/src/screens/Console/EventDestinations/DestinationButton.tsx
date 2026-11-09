// This file is part of MinIO Console Server
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

import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { type } from "mds";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

interface IDestinationButton {
  destinationType: string;
  srcImage: string;
  title: string;
}

const DestinationButtonBase = styled.button({
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-card,12px)",
  width: 250,
  maxWidth: "100%",
  height: 80,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  marginBottom: 16,
  marginInlineEnd: 8,
  cursor: "pointer",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: "var(--hover)",
  },
  "&:focus-visible": {
    outline: "2px solid var(--focus-ring)",
    outlineOffset: 2,
  },
  "& .imageContainer": {
    width: 80,
    height: 80,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // The original logos retain their fixed colors on a neutral paper inset.
    backgroundColor: "#fafafa",
    "& .logoButton": {
      maxWidth: 46,
      maxHeight: 46,
    },
  },
});

const DestinationLabel = styled.span`
  ${type("title")}
  color: var(--foreground);
  padding: 0 16px;
  text-align: start;
  min-width: 0;
  overflow-wrap: anywhere;
`;

const DestinationButton = ({
  destinationType,
  srcImage,
  title,
}: IDestinationButton) => {
  const navigate = useNavigate();

  return (
    <DestinationButtonBase
      type="button"
      onClick={() => {
        navigate(`${IAM_PAGES.EVENT_DESTINATIONS_ADD}/${destinationType}`);
      }}
    >
      <span className={"imageContainer"}>
        <img src={srcImage} className={"logoButton"} alt={title} />
      </span>
      <DestinationLabel>{title}</DestinationLabel>
    </DestinationButtonBase>
  );
};

export default DestinationButton;
