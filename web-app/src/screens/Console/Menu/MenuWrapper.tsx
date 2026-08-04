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
import { useSelector } from "react-redux";
import {
  Box,
  DocumentationIcon,
  LicenseIcon,
  Menu,
  MenuDivider,
  MenuItem,
} from "mds";
import { AppState, useAppDispatch } from "../../../store";
import { validRoutes } from "../valid-routes";
import { menuOpen } from "../../../systemSlice";
import { selFeatures } from "../consoleSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import UserMenu from "./UserMenu";
import { SILO_EMBLEM_URL, SILO_WORDMARK_URL } from "../../../common/SiloBrand";

const MenuWrapper = () => {
  const dispatch = useAppDispatch();
  const features = useSelector(selFeatures);
  const navigate = useNavigate();
  const { pathname = "" } = useLocation();

  const sidebarOpen = useSelector(
    (state: AppState) => state.system.sidebarOpen,
  );

  const allowedMenuItems = validRoutes(features);

  return (
    <Menu
      isOpen={sidebarOpen}
      displayGroupTitles
      options={allowedMenuItems}
      applicationLogo={{
        // MDS requires one of its built-in logo enums. These SVGs are hidden
        // below and replaced with the SILO assets until MDS exposes a slot.
        applicationName: "console",
        subVariant: "AGPL",
      }}
      sx={{
        // The mds drawer animates `all` for its collapse effect, which also
        // animates height: 100vh on window resize — the bottom items chase
        // the new height for 300ms and leave a blank strip. Animate only the
        // collapse width so height tracks the viewport instantly.
        transitionProperty: "width, min-width, max-width",
        "& .menuHeaderContainer": {
          position: "relative",
        },
        "& .menuLogoContainer > svg": {
          display: "block",
          visibility: "hidden",
          width: "100%",
          height: 48,
        },
        "& .menuHeaderContainer::before": {
          content: '""',
          display: "block",
          position: "absolute",
          zIndex: 2,
          top: 21,
          left: 46,
          width: 46,
          height: 46,
          backgroundImage: `url(${SILO_EMBLEM_URL})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          pointerEvents: "none",
          transition:
            "left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease",
        },
        "& .menuHeaderContainer::after": {
          content: '""',
          display: "block",
          position: "absolute",
          zIndex: 1,
          top: 27,
          left: 106,
          width: 98,
          height: 34,
          opacity: 1,
          transform: "translateX(0)",
          backgroundImage: `url(${SILO_WORDMARK_URL})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          pointerEvents: "none",
          transition: "opacity 0.16s ease 0.3s, transform 0.16s ease 0.3s",
        },
        "& .collapsedMenuHeader .collapsedIcon > svg": {
          display: "none",
        },
        "& .collapsedMenuHeader .collapsedIcon": {
          width: 36,
          height: 36,
          visibility: "hidden",
        },
        "&.collapsed .menuHeaderContainer::before": {
          top: 29,
          left: 22,
          width: 36,
          height: 36,
        },
        "&.collapsed .menuHeaderContainer::after": {
          opacity: 0,
          transform: "translateX(-10px)",
          transition: "opacity 0.08s ease, transform 0.12s ease",
        },
      }}
      callPathAction={(path) => {
        navigate(path);
      }}
      signOutAction={() => {
        navigate("/logout");
      }}
      collapseAction={() => {
        dispatch(menuOpen(!sidebarOpen));
      }}
      currentPath={pathname}
      mobileModeAuto={false}
      endComponent={
        <Box
          sx={{
            display: "block",
            marginTop: "20px",
          }}
        >
          <MenuDivider />
          <MenuItem
            name={"Documentation"}
            icon={<DocumentationIcon />}
            path={"https://silo.pgsty.com/docs/"}
            visibleTooltip={!sidebarOpen}
            id="menu-documentation"
          />
          <MenuItem
            name={"License"}
            icon={<LicenseIcon />}
            path={IAM_PAGES.LICENSE}
            onClick={() => navigate(IAM_PAGES.LICENSE)}
            visibleTooltip={!sidebarOpen}
            id="menu-license"
          />
        </Box>
      }
      middleComponent={<UserMenu />}
    />
  );
};

export default MenuWrapper;
