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

import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { MenuItemProps } from "../Menu.types";
import Box from "../../Box/Box";
import CircleIcon from "../../Icons/CircleIcon";
import CollapseCaret from "../../Icons/CollapseCaret";
import ExpandCaret from "../../Icons/ExpandCaret";
import Tooltip from "../../Tooltip/Tooltip";
import { lightColors } from "../../../global/themes";

const commonStyle = (theme: any) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "transparent",
  cursor: "pointer",
  border: "none",
  width: "100%",
  height: "var(--control-height, 36px)",
  "@media (pointer: coarse)": { minHeight: 40 },
  padding: "0 var(--control-padding, 12px)",
  borderRadius: "var(--radius-control, 8px)",
  fontWeight: "var(--fw-normal, 400)",
  textAlign: "start" as const,
  color: get(theme, "menu.vertical.textColor", lightColors.menuCommonColor),
  position: "relative" as const,
  zIndex: 1,
  "&.selected": {
    fontWeight: "var(--fw-semibold, 550)",
    boxShadow: get(theme, "menu.vertical.activeIndicatorColor")
      ? `inset 3px 0 0 ${get(theme, "menu.vertical.activeIndicatorColor")}`
      : undefined,
  },
  "&.selected, &[data-fluid-hover]": { color: "var(--foreground)" },
  "&:focus-visible": {
    outline: "2px solid var(--focus-ring)",
    outlineOffset: -2,
  },
  "& .iconContainer": { border: 0, backgroundColor: "transparent" },
});

const MenuItemContainer = styled.div(({ theme }) => ({
  display: "flex",
  minWidth: 0,
  width: "100%",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  userSelect: "none",
  cursor: "pointer",
  "& > div:not(.subItemsBox), & > span": {
    width: "100%",
  },
  "& > .subItemsBox": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    paddingInlineStart: 20,
    width: "100%",
  },
  "& .statusArrow": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: get(
      theme,
      "menu.vertical.dropArrowBackground",
      lightColors.menuDropArrowBackground,
    ),
    width: 15,
    height: 15,
    minWidth: 15,
    minHeight: 15,
    borderRadius: 2,
  },
}));

const MenuItemButton = styled.button(({ theme }) => ({
  ...commonStyle(theme),
  "& .subOption": {
    padding: 0,
  },
}));

const AnchorItem = styled.a(({ theme }) => ({
  ...commonStyle(theme),
  textDecoration: "none",
}));

const OptionElement = styled.span(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "var(--gap, 8px)",
  minWidth: 0,
  maxWidth: "100%",
  flex: "1 1 auto",
  "& .iconContainer": {
    position: "relative",
    borderRadius: 0,
    width: 16,
    height: 16,
    minWidth: 16,
    minHeight: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg:not(.badgeIcon)": {
      width: "var(--icon-size, 16px)",
      height: "var(--icon-size, 16px)",
    },
    "& svg.badgeIcon": {
      width: 8,
      height: 8,
      fill: get(theme, "menu.vertical.notificationColor", lightColors.mainRed),
      position: "absolute",
      top: 4,
      insetInlineEnd: 3,
    },
  },
  "& .labelContainer": {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--fs-body, 13px)",
    lineHeight: "var(--lh-body, 20px)",
    display: "grid",
    minWidth: 0,
    flex: 1,
    "& > span": {
      gridArea: "1 / 1",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    "& .labelMeasure": {
      visibility: "hidden",
      fontWeight: "var(--fw-semibold, 550)",
    },
  },
}));

const MenuOptionElement = ({
  icon,
  name,
  badge,
}: {
  icon: React.ReactNode;
  name: React.ReactNode;
  badge: boolean;
}) => (
  <OptionElement className={"option"}>
    <span className={"iconContainer"}>
      {icon}
      {badge && <CircleIcon className={"badgeIcon"} />}
    </span>
    <span className={"labelContainer"}>
      <span className="labelMeasure" aria-hidden="true">
        {name}
      </span>
      <span>{name}</span>
    </span>
  </OptionElement>
);

const MenuItem: FC<MenuItemProps> = ({
  children,
  inlineChildren = false,
  icon,
  id,
  name,
  path,
  onClick,
  badge,
  currentPath,
  visibleTooltip = false,
  isVisible = true,
  selected = false,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const activeChildPath = children?.find(
    (item) =>
      item.path &&
      (currentPath === item.path || currentPath?.startsWith(`${item.path}/`)),
  )?.path;

  useEffect(() => {
    if (activeChildPath || selected) setOpen(true);
  }, [currentPath, activeChildPath, selected]);

  if (currentPath && path) {
    if (currentPath === path || currentPath.startsWith(`${path}/`)) {
      selected = true;
    }
  }

  // If Menu has children set but not sub items, then we hide it

  if ((children && children.length === 0) || !isVisible) {
    return null;
  }

  if (inlineChildren && children?.length) {
    return (
      <MenuItemContainer>
        <MenuItem
          icon={icon}
          id={id}
          name={name}
          path={path}
          onClick={onClick}
          badge={badge}
          currentPath={currentPath}
          visibleTooltip={visibleTooltip}
          selected={selected}
        />
        <Box className="subItemsBox" id={`${id}-recent`}>
          {children.map((child) => (
            <MenuItem
              key={child.id || child.path}
              {...child}
              onClick={onClick}
              currentPath={currentPath}
            />
          ))}
        </Box>
      </MenuItemContainer>
    );
  }

  // Menu option with submenus
  if (children && children.length > 0) {
    const filterSubItems = children.filter((item) => item.isVisible !== false);

    if (filterSubItems.length === 0) {
      return null;
    }

    return (
      <MenuItemContainer>
        <Tooltip tooltip={visibleTooltip ? name : ""} placement={"right"}>
          <MenuItemButton
            id={id}
            data-fluid-index=""
            data-fluid-key={id || name}
            aria-expanded={open}
            aria-controls={`${id || name}-children`}
            aria-label={name}
            type={"button"}
            onClick={() => {
              setOpen(!open);
            }}
            className={"menuItemButton"}
          >
            <MenuOptionElement icon={icon} name={name} badge={!!badge} />
            <Box className={"statusArrow"}>
              {open ? <CollapseCaret /> : <ExpandCaret />}
            </Box>
          </MenuItemButton>
        </Tooltip>
        {open && (
          <Box id={`${id || name}-children`} className={"subItemsBox"}>
            {children.map((child) => (
              <Tooltip
                tooltip={visibleTooltip ? child.name : ""}
                placement={"right"}
                key={
                  "submenuitem-" + child.name.toLowerCase().replace(" ", "-")
                }
              >
                <MenuItem
                  onClick={onClick}
                  name={child.name}
                  badge={child.badge}
                  icon={child.icon}
                  id={child.id}
                  path={child.path}
                  group={child.group}
                  currentPath={currentPath}
                />
              </Tooltip>
            ))}
          </Box>
        )}
      </MenuItemContainer>
    );
  }

  // Path is a link, we display an anchor instead of a button, default target _blank
  if (
    path?.match(
      /^(https?:\/\/)?([\da-zа-я\.\-_]+)\.([a-zа-я\._]{2,6})([a-zа-я\d\.\-\?\/&=#%_]*)*/,
    )
  ) {
    return (
      <Tooltip tooltip={visibleTooltip ? name : ""} placement={"right"}>
        <AnchorItem
          aria-label={name}
          data-fluid-index=""
          data-fluid-key={id || path || name}
          className={"menuItemButton"}
          id={id}
          href={path}
          target={"_blank"}
          rel="noopener noreferrer"
        >
          <MenuOptionElement icon={icon} name={name} badge={!!badge} />
        </AnchorItem>
      </Tooltip>
    );
  }

  const executeOnClick = () => {
    if (onClick) {
      onClick(path || "");
    }
  };

  return (
    <Tooltip tooltip={visibleTooltip ? name : ""} placement={"right"}>
      <MenuItemButton
        aria-label={name}
        data-fluid-index={onClick ? "" : undefined}
        data-fluid-key={id || path || name}
        data-fluid-selected={selected}
        data-fluid-gap-click={id === "sign-out" ? "false" : undefined}
        aria-current={selected ? "page" : undefined}
        className={`menuItemButton ${selected ? "selected" : ""}`}
        type={"button"}
        id={id}
        onClick={executeOnClick}
      >
        <MenuOptionElement icon={icon} name={name} badge={!!badge} />
      </MenuItemButton>
    </Tooltip>
  );
};

export default MenuItem;
