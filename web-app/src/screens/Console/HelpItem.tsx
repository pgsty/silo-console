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
import get from "lodash/get";
import styled from "styled-components";
import { DocItem } from "./HelpMenu.types";
import MoreLink from "../../common/MoreLink";
import { useLocalizedLink, useT } from "i18n";

interface IHelpItemProps {
  item: DocItem;
}

const HelpItemContainer = styled.div({
  padding: "4px 16px 10px",
});

const HelpTitle = styled.a(({ theme }) => ({
  display: "inline-block",
  maxWidth: "100%",
  color: get(theme, "linkColor", "#2781B0"),
  font: "normal normal bold 16px/28px Inter",
  textDecoration: "none",
  whiteSpace: "pre-wrap",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const HelpDescription = styled.div({
  width: "100%",
  whiteSpace: "pre-line",
  lineHeight: "1.5em",
  height: "3em",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const HelpItem = ({ item }: IHelpItemProps) => {
  // Every help entry (helpTopics.json, RSS items, fallbacks) renders through
  // here, so translation and URL localization apply in one place. Untranslated
  // titles/bodies (e.g. live feed content) pass through unchanged.
  const t = useT();
  const localize = useLocalizedLink();

  return (
    <HelpItemContainer>
      <HelpTitle
        href={localize(item.url)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t(item.title)}
      </HelpTitle>
      <HelpDescription>{t(item.body)}</HelpDescription>
      <MoreLink
        text={t("Learn more")}
        link={localize(item.url)}
        color={"#3874A6"}
      />
    </HelpItemContainer>
  );
};

export default HelpItem;
