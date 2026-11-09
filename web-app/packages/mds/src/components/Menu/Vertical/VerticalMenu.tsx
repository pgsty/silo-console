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

import React, { FC, Fragment, useRef } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { MenuConstructProps, MenuProps } from "../Menu.types";
import { lightColors } from "../../../global/themes";
import Box from "../../Box/Box";
import CollapseMenuIcon from "../../Icons/CollapseMenuIcon";
import MenuItem from "./MenuItem";
import MenuSectionHeader from "./MenuSectionHeader";
import LogoutIcon from "../../Icons/LogoutIcon";
import Tooltip from "../../Tooltip/Tooltip";
import MenuDivider from "../Common/MenuDivider";
import { ConsoleCIcon } from "../../Icons";
import { useFluidHover } from "../../../global/useFluidHover";
import { FluidHoverHighlight } from "../../../global/FluidHoverHighlight";
import { focusMenuKey } from "../../../global/listPopup";

const VerticalMenuDrawer = styled.div<MenuConstructProps>(({ theme, sx }) => {
  return {
    width: 240,
    maxWidth: 240,
    minWidth: 240,
    height: "100vh",
    overflow: "auto",
    position: "relative",
    background: get(
      theme,
      "menu.vertical.background",
      lightColors.menuBackground,
    ),
    borderInlineEnd: "1px solid var(--border)",
    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",
    },
    "& .menuContainer": {
      height: "inherit",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      "& .collapseButton": {
        position: "absolute",
        insetInlineEnd: 11,
        top: 10,
        "& > svg": {
          width: 12,
          height: 12,
          fill: get(
            theme,
            "menu.vertical.menuCollapseColor",
            lightColors.menuCollapseColor,
          ),
          color: get(
            theme,
            "menu.vertical.menuCollapseColor",
            lightColors.menuCollapseColor,
          ),
        },
      },
    },
    "& .menuLogoContainer": {
      display: "block",
      position: "relative",
      margin: "24px 16px 16px",
      paddingBottom: 20,
      borderBottom: `${get(
        theme,
        "menu.vertical.sectionDividerColor",
        lightColors.menuColorDivider,
      )} 1px solid`,
    },
    "& .collapsedMenuHeader": {
      display: "none",
    },
    "& .menuItems": {
      position: "relative",
      isolation: "isolate",
      "& > [data-fluid-highlight]": { zIndex: -1 },
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      padding: "0 8px 12px",
    },
    "& .menuHeaderContainer": {
      position: "relative",
      display: "block",
      flexShrink: 0,
      width: "100%",
      border: 0,
      padding: 0,
      margin: 0,
      background: "transparent",
      color: "inherit",
      font: "inherit",
      textAlign: "start",
      cursor: "pointer",
      "&:focus-visible": {
        outline: "2px solid var(--focus-ring, #6B97FF)",
        outlineOffset: -2,
      },
    },
    "&.collapsed": {
      width: 80,
      minWidth: 80,
      boxSizing: "content-box",
      "& .collapseButton, & .menuLogoContainer": {
        display: "none",
      },
      "& .labelHeader": {
        display: "none",
      },
      "& .collapsedMenuHeader": {
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: 43,
        height: 43,
        minWidth: 43,
        minHeight: 43,
        border: `${get(
          theme,
          "menu.vertical.iconBorderColor",
          lightColors.menuIconBorder,
        )} 1px solid`,
        backgroundColor: get(
          theme,
          "menu.vertical.iconBGColor",
          lightColors.menuIconBG,
        ),
        borderRadius: "100%",
        margin: "25px 0",
        "&:hover": {
          borderColor: get(
            theme,
            "menu.vertical.hoverSelectedIconBorder",
            lightColors.white,
          ),
        },
        "& .collapsedIcon": {
          display: "inline-flex",
          color: get(
            theme,
            "menu.vertical.menuCollapseColor",
            lightColors.menuCollapseColor,
          ),
          "& svg": {
            width: 30,
            height: 30,
          },
        },
        "& svg": {
          width: 36,
          height: 36,
        },
      },
      "& .menuHeader": {
        marginInlineStart: 0,
        marginInlineEnd: 0,
        marginTop: 0,
      },
      "& .labelContainer": {
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
        border: 0,
      },
      "& .subItemsBox": {
        padding: 0,
      },
      "& .option": {
        display: "flex",
        padding: 0,
        justifyContent: "center",
      },
      "& [hidden]": {
        display: "none",
      },
      "& .menuItemButton": {
        padding: 0,
        display: "flex",
        justifyContent: "center",
        position: "relative",
      },
      "& .menuHeaderContainer": {
        display: "flex",
        justifyContent: "center",
      },
      "& .statusArrow": {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translateX(50%) translateY(20%)",
      },
    },
    // The opt-in brand slots support the new rail; legacy logos retain 80px.
    "&.collapsed.customLogo": {
      width: "var(--sidebar-rail-width, 72px)",
      minWidth: "var(--sidebar-rail-width, 72px)",
    },
    "&.stableBrand": {
      "--brand-mark-size": "28px",
      "--brand-inset": "16px",
      boxSizing: "border-box",
      overflowX: "hidden",
      background: "var(--surface-2)",
      transition:
        "width var(--dur-slow, 240ms) var(--ease-moderate, ease), min-width var(--dur-slow, 240ms) var(--ease-moderate, ease)",
      "& .brandHeader": {
        position: "relative",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        boxSizing: "border-box",
        width: "100%",
        height: 64,
        minHeight: 40,
        padding: "0 var(--brand-inset)",
        gap: 12,
        border: 0,
        margin: 0,
        background: "transparent",
        color: "var(--foreground)",
        font: "inherit",
        textAlign: "start",
        cursor: "pointer",
        transition: "background var(--dur-fast, 80ms) var(--ease-fast, ease)",
        "&:hover": { background: "var(--hover)" },
        "&:active": { background: "var(--active)" },
        "&:focus-visible": {
          outline: "2px solid var(--focus-ring)",
          outlineOffset: -4,
        },
      },
      "& .brandMark": {
        display: "flex",
        alignItems: "center",
        flex: "0 0 var(--brand-mark-size)",
        width: "var(--brand-mark-size)",
        height: "var(--brand-mark-size)",
        transform: "translateX(0)",
        transition:
          "transform var(--dur-slow, 240ms) var(--ease-moderate, ease)",
        "& > img, & > svg": { width: "100%", height: "100%" },
      },
      "& .brandWordmark": {
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        height: 20,
        opacity: 1,
        transform: "translateX(0)",
        transition:
          "opacity var(--dur-moderate, 160ms) var(--ease-fast, ease), transform var(--dur-slow, 240ms) var(--ease-moderate, ease)",
        "& > img, & > svg": { height: "100%", width: "auto" },
      },
      "&.collapsed .brandMark": {
        transform:
          "translateX(calc((var(--sidebar-rail-width, 72px) - var(--brand-mark-size)) / 2 - var(--brand-inset)))",
      },
      "&.collapsed .brandWordmark": {
        opacity: 0,
        transform: "translateX(-8px)",
        pointerEvents: "none",
      },
      "& .menuItemButton": {
        padding: "0 var(--control-padding, 12px)",
        justifyContent: "flex-start",
      },
      "& .option": { justifyContent: "flex-start" },
      "& .iconContainer": {
        transition:
          "transform var(--dur-slow, 240ms) var(--ease-moderate, ease)",
      },
      "&.collapsed .iconContainer": {
        transform:
          "translateX(calc((var(--sidebar-rail-width, 72px) - 16px) / 2 - 8px - var(--control-padding, 12px)))",
      },
      "& .menuFooter": {
        marginTop: "auto",
        display: "flex",
        flexDirection: "column",
        "& > span": { display: "block", width: "100%" },
        paddingTop: 12,
        borderTop: "1px solid var(--border)",
        "& .menuItemButton": { color: "var(--muted-foreground)" },
        "& .menuItemButton:hover, & .menuItemButton:focus-visible": {
          color: "var(--foreground)",
          background: "var(--hover)",
        },
        "& .labelContainer": {
          fontSize: "var(--fs-caption, 12px)",
          lineHeight: "var(--lh-caption, 16px)",
        },
      },
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
        "& .brandMark, & .brandWordmark, & .iconContainer": {
          transition: "none",
        },
      },
    },
    ...sx,
  };
});

const VerticalMenu: FC<MenuProps> = ({
  applicationLogo,
  logo,
  brandMark,
  collapsedLogo,
  options,
  displayGroupTitles,
  signOutAction,
  signOutLabel = "Sign Out",
  collapseLabel = "Collapse menu",
  expandLabel = "Expand menu",
  mobileLabel = "Menu",
  callPathAction,
  isOpen,
  collapseAction,
  currentPath,
  endComponent,
  middleComponent,
  sx,
}) => {
  let currTitle = "";
  const list = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(list, {
    gapClick: { maxDistance: 16 },
    frozen: () =>
      !!list.current?.querySelector('[aria-haspopup][aria-expanded="true"]'),
  });

  return (
    <VerticalMenuDrawer
      role="navigation"
      aria-label={mobileLabel}
      sx={sx}
      className={`menuBox ${!isOpen ? "collapsed" : ""} ${logo !== undefined || collapsedLogo !== undefined || brandMark !== undefined ? "customLogo" : ""} ${brandMark !== undefined ? "stableBrand" : ""}`}
    >
      <Box className={"menuContainer"}>
        {brandMark !== undefined ? (
          <button
            className="brandHeader"
            type="button"
            aria-label={isOpen ? collapseLabel : expandLabel}
            aria-expanded={isOpen}
            onClick={collapseAction}
          >
            <span className="brandMark" aria-hidden="true">
              {brandMark}
            </span>
            <span className="brandWordmark" aria-hidden={!isOpen}>
              {logo}
            </span>
          </button>
        ) : (
          <button
            className={"menuHeaderContainer"}
            type="button"
            onClick={collapseAction}
            aria-label={isOpen ? collapseLabel : expandLabel}
            aria-expanded={isOpen}
          >
            <span className={"collapseButton"}>
              <CollapseMenuIcon />
            </span>
            <span className={"menuLogoContainer"}>{logo}</span>
            <span className={"collapsedMenuHeader"}>
              <Tooltip tooltip={expandLabel} placement={"right"}>
                <span className={"collapsedIcon"}>
                  {collapsedLogo !== undefined ? (
                    collapsedLogo
                  ) : (
                    <ConsoleCIcon />
                  )}
                </span>
              </Tooltip>
            </span>
          </button>
        )}
        <div
          ref={list}
          className={"menuItems"}
          onKeyDown={(event) => focusMenuKey(event, list.current)}
        >
          <FluidHoverHighlight hover={hover} selected />
          <FluidHoverHighlight hover={hover} />
          {middleComponent}
          {options &&
            options.map((option) => {
              let extraItem = null;

              if (displayGroupTitles && option.group) {
                if (currTitle !== option.group) {
                  currTitle = option.group;

                  extraItem = <MenuSectionHeader label={option.group} />;
                }
              }

              const onClickAction = (path: string) => {
                if (option.onClick) {
                  option.onClick(path);
                  return;
                }

                callPathAction(path);
              };

              return (
                <Fragment
                  key={`menu-section-${option.group || "common"}-${
                    option.id || option.name
                  }`}
                >
                  {extraItem}
                  <MenuItem
                    onClick={onClickAction}
                    icon={option.icon}
                    name={option.name}
                    group={option.group}
                    id={option.id}
                    path={option.path}
                    currentPath={currentPath}
                    badge={option.badge}
                    children={option.children}
                    inlineChildren={option.inlineChildren}
                    visibleTooltip={!isOpen}
                    selected={option.selected}
                  />
                </Fragment>
              );
            })}
          {signOutAction && (
            <Box className="menuFooter" sx={{ marginTop: "auto" }}>
              {endComponent}
              {brandMark === undefined && <MenuDivider />}
              <MenuItem
                id="sign-out"
                group={"common"}
                name={signOutLabel}
                icon={<LogoutIcon />}
                onClick={signOutAction}
                visibleTooltip={!isOpen}
              />
            </Box>
          )}
        </div>
      </Box>
    </VerticalMenuDrawer>
  );
};

export default VerticalMenu;
