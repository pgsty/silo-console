import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Accordion,
  AccountsMenuIcon,
  AddIcon,
  MenuItem,
  MenuSectionHeader,
  MultipleBucketsIcon,
  ObjectBrowserIcon,
} from "mds";
import get from "lodash/get";
import { useTheme } from "styled-components";
import { AppState, useAppDispatch } from "../../../store";
import { useLocation, useNavigate } from "react-router-dom";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import BucketsListing from "./Listing/BucketsListing";
import { setAddBucketOpen } from "../Buckets/ListBuckets/AddBucket/addBucketsSlice";
import { useT } from "i18n";

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { pathname = "" } = useLocation();
  const t = useT();

  const sidebarOpen = useSelector(
    (state: AppState) => state.system.sidebarOpen,
  );

  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <>
      <MenuSectionHeader label={t("User")} />
      <MenuItem
        name={t("Create Bucket")}
        icon={<AddIcon />}
        onClick={() => dispatch(setAddBucketOpen(true))}
        visibleTooltip={!sidebarOpen}
        id="menu-create-bucket"
      />
      <MenuItem
        group="User"
        name={t("Object Browser")}
        id="object-browser"
        path={IAM_PAGES.OBJECT_BROWSER_VIEW}
        icon={<ObjectBrowserIcon />}
        currentPath={pathname}
        onClick={(path) => {
          navigate(path);
        }}
      />
      <MenuItem
        group="User"
        id="nav-accesskeys"
        path={IAM_PAGES.ACCOUNT}
        name={t("Access Keys")}
        icon={<AccountsMenuIcon />}
        currentPath={pathname}
        onClick={(path) => {
          navigate(path);
        }}
      />
      <Accordion
        title={
          <MenuItem
            name={t("Buckets")}
            icon={<MultipleBucketsIcon />}
            visibleTooltip={!sidebarOpen}
            id="menu-bucket-list-button"
          />
        }
        id="menu-bucket-list"
        expanded={expanded}
        onTitleClick={() => setExpanded(!expanded)}
        sx={{
          border: "0px",
          padding: "0px",
          ".accordionTitle": {
            position: "relative",
            padding: "unset",
            backgroundColor: "unset !important",
            width: sidebarOpen ? "100%" : "80px",
            "& .menuItemButton": {
              width: sidebarOpen ? "100%" : undefined,
            },
            "svg.min-icon:nth-child(2)": {
              backgroundColor: get(
                theme,
                "menu.vertical.iconBGColor",
                "#14243C",
              ),
              color: get(theme, "menu.vertical.textColor", "#A9B6C9"),
              width: "15px",
              height: "15px",
              minWidth: "15px",
              minHeight: "15px",
              borderRadius: "4px",
              transition: "transform 0.15s ease",
              pointerEvents: "none",
              marginRight: sidebarOpen ? 0 : "25px",
              position: sidebarOpen ? "absolute" : "relative",
              right: sidebarOpen ? "22px" : "unset",
              left: sidebarOpen ? "unset" : "-50%",
              top: sidebarOpen ? "50%" : "7px",
              transform: sidebarOpen
                ? "translateY(-50%)"
                : "translateX(50%) translateY(20%)",
            },
            "span:nth-child(1) > button:nth-child(1)": {
              width: sidebarOpen ? undefined : "80px",
            },
          },
          ".accordionContent": {
            borderTop: expanded
              ? `1px solid ${get(
                  theme,
                  "menu.vertical.sectionDividerColor",
                  "#1C2C44",
                )}`
              : "0px",
          },
        }}
      >
        <BucketsListing />
      </Accordion>
    </>
  );
};

export default UserMenu;
