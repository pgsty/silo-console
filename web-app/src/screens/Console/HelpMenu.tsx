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

import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import get from "lodash/get";
import {
  AlertCloseIcon,
  Box,
  breakPoints,
  Button,
  DocumentationIcon,
  FileVideoIcon,
  HelpIcon,
  HelpIconFilled,
  IconButton,
  ReportIcon,
  TabItemProps,
  Tabs,
} from "mds";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../store";
import { setHelpTabName } from "../../systemSlice";
import { DocItem } from "./HelpMenu.types";
import HelpItem from "./HelpItem";
import MoreLink from "../../common/MoreLink";
import helpTopicsJSON from "../Console/helpTopics.json";

const SILO_BLOG_URL = "https://silo.pgsty.com/blog/";
const SILO_BLOG_FEED_URL = "https://silo.pgsty.com/blog/index.xml";
const SILO_BLOG_ITEM_LIMIT = 6;
const SILO_BLOG_FALLBACK: DocItem[] = [
  {
    title: "SILO Blog",
    url: SILO_BLOG_URL,
    body: "Read SILO release notes, security advisories, and project updates.",
  },
];

const rssDescriptionToText = (description: string) => {
  const parsed = new DOMParser().parseFromString(description, "text/html");
  const text = (parsed.body.textContent ?? "").replace(/\s+/g, " ").trim();

  return text.length > 280 ? `${text.slice(0, 277).trimEnd()}…` : text;
};

const parseSiloBlogFeed = (rss: string): DocItem[] => {
  const feed = new DOMParser().parseFromString(rss, "application/xml");

  if (feed.querySelector("parsererror")) {
    return [];
  }

  return Array.from(feed.querySelectorAll("channel > item"))
    .map((item): DocItem | null => {
      const title = item.querySelector("title")?.textContent?.trim();
      const link = item.querySelector("link")?.textContent?.trim();
      const description = item
        .querySelector("description")
        ?.textContent?.trim();

      if (!title || !link) {
        return null;
      }

      try {
        const url = new URL(link);
        if (url.protocol !== "https:" || url.hostname !== "silo.pgsty.com") {
          return null;
        }

        return {
          title,
          url: url.toString(),
          body: description
            ? rssDescriptionToText(description)
            : "Read this update on the SILO Blog.",
        };
      } catch {
        return null;
      }
    })
    .filter((item): item is DocItem => item !== null)
    .slice(0, SILO_BLOG_ITEM_LIMIT);
};

const HelpMenuContainer = styled.div<{ $sidebarOpen: boolean }>(
  ({ theme, $sidebarOpen }) => ({
    backgroundColor: get(theme, "bgColor", "#FFF"),
    position: "absolute",
    right: 0,
    zIndex: "10",
    border: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
    borderRadius: 4,
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px",
    width: 754,
    maxWidth: `calc(100vw - ${$sidebarOpen ? 282 : 112}px)`,
    boxSizing: "border-box",
    [`@media (max-width: ${breakPoints.sm}px)`]: {
      width: "calc(100vw - 24px)",
      maxWidth: "calc(100vw - 24px)",
    },
    "& .tabsPanels": {
      padding: "15px 0 0",
    },
    "& .helpContainer": {
      maxHeight: 400,
      overflowY: "auto",
      "& .helpItemBlock": {
        padding: 5,
        "&:hover": {
          backgroundColor: get(
            theme,
            "buttons.regular.hover.background",
            "#E6EAEB",
          ),
        },
      },
    },
  }),
);

const VideoNotice = styled.div(({ theme }) => ({
  margin: "12px 16px 0",
  padding: "10px 12px",
  border: `1px solid ${get(theme, "borderColor", "#D8E1E6")}`,
  borderRadius: 4,
  backgroundColor: get(theme, "boxBackground", "#F3F7F9"),
  color: get(theme, "fontColor", "#0D1A24"),
  fontSize: 12,
  lineHeight: 1.45,
}));

const HelpMenu = () => {
  const helpTopics = helpTopicsJSON as Record<string, any>;

  const [helpItems, setHelpItems] = useState<DocItem[]>([]);
  const [headerDocs, setHeaderDocs] = useState<string | null>(null);
  const [helpItemsVideo, setHelpItemsVideo] = useState<DocItem[]>([]);
  const [headerVideo, setHeaderVideo] = useState<string | null>(null);
  const [helpItemsBlog, setHelpItemsBlog] =
    useState<DocItem[]>(SILO_BLOG_FALLBACK);
  const [helpMenuOpen, setHelpMenuOpen] = useState<boolean>(false);
  const blogFeedLoaded = useRef(false);

  const systemHelpName = useSelector(
    (state: AppState) => state.system.helpName,
  );

  const helpTabName = useSelector(
    (state: AppState) => state.system.helpTabName,
  );

  const sidebarOpen = useSelector(
    (state: AppState) => state.system.sidebarOpen,
  );

  const toggleHelpMenu = () => {
    setHelpMenuOpen(!helpMenuOpen);
  };
  const dispatch = useAppDispatch();

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setHelpMenuOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    if (!helpMenuOpen || helpTabName !== "blog" || blogFeedLoaded.current) {
      return;
    }

    const abortController = new AbortController();

    const loadBlogFeed = async () => {
      try {
        const response = await fetch(SILO_BLOG_FEED_URL, {
          headers: {
            Accept:
              "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
          },
          credentials: "omit",
          signal: abortController.signal,
        });

        if (!response.ok) {
          return;
        }

        const blogItems = parseSiloBlogFeed(await response.text());
        if (blogItems.length > 0) {
          setHelpItemsBlog(blogItems);
        }
        blogFeedLoaded.current = true;
      } catch {
        // Keep the local SILO Blog fallback when the remote feed is unavailable.
      }
    };

    void loadBlogFeed();

    return () => abortController.abort();
  }, [helpMenuOpen, helpTabName]);

  useEffect(() => {
    let docsTotal = 0;
    const blogTotal = helpItemsBlog.length;
    let videoTotal = 0;
    if (helpTopics[systemHelpName]) {
      if (helpTopics[systemHelpName]["docs"]) {
        setHeaderDocs(helpTopics[systemHelpName]["docs"]["header"]);
        setHelpItems(helpTopics[systemHelpName]["docs"]["links"]);
        docsTotal = helpTopics[systemHelpName]["docs"]["links"].length;
      }

      if (helpTopics[systemHelpName]["video"]) {
        setHeaderVideo(helpTopics[systemHelpName]["video"]["header"]);
        setHelpItemsVideo(helpTopics[systemHelpName]["video"]["links"]);
        videoTotal = helpTopics[systemHelpName]["video"]["links"].length;
      }

      let autoSelect = "docs";
      let hadToFlip = false;
      // if no docs, eval video o blog
      if (docsTotal === 0 && headerDocs === null && helpTabName === "docs") {
        // if no blog, default video?
        if (videoTotal !== 0 || headerVideo !== null) {
          autoSelect = "video";
        } else {
          autoSelect = "blog";
        }
        hadToFlip = true;
      }
      if (videoTotal === 0 && headerVideo === null && helpTabName === "video") {
        // if no blog, default video?
        if (docsTotal !== 0 || headerDocs !== null) {
          autoSelect = "docs";
        } else {
          autoSelect = "blog";
        }
        hadToFlip = true;
      }
      if (blogTotal === 0 && helpTabName === "blog") {
        // if no blog, default video?
        if (docsTotal !== 0 || headerDocs !== null) {
          autoSelect = "docs";
        } else {
          autoSelect = "video";
        }
        hadToFlip = true;
      }
      if (hadToFlip) {
        dispatch(setHelpTabName(autoSelect));
      }
    } else {
      setHelpItems(helpTopics["help"]["docs"]["links"]);
      setHelpItemsVideo([]);
    }
  }, [
    systemHelpName,
    helpTabName,
    dispatch,
    helpTopics,
    headerDocs,
    headerVideo,
    helpItemsBlog.length,
  ]);

  const helpContent = (
    <Box className={"helpContainer"}>
      {headerDocs && (
        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div>
            <ReactMarkdown>{`${headerDocs}`}</ReactMarkdown>
          </div>
          <div style={{ borderBottom: "1px solid #dedede" }} />
        </div>
      )}
      {helpItems &&
        helpItems.map((aHelpItem, idx) => (
          <Box
            className={"helpItemBlock"}
            key={`help-item-${aHelpItem.title.toLowerCase().replace(" ", "-")}`}
          >
            <HelpItem item={aHelpItem} />
          </Box>
        ))}
      <div style={{ padding: 16 }}>
        <MoreLink
          LeadingIcon={DocumentationIcon}
          text={"Visit SILO Documentation"}
          link={"https://silo.pgsty.com/docs/"}
          color={"#007FA8"}
        />
      </div>
    </Box>
  );
  const helpContentVideo = (
    <Box className={"helpContainer"}>
      <VideoNotice>
        SILO does not yet maintain a native video catalog. These links open
        upstream MinIO compatibility material.
      </VideoNotice>
      {headerVideo && (
        <Fragment>
          <div style={{ paddingLeft: 16, paddingRight: 16 }}>
            <ReactMarkdown>{`${headerVideo}`}</ReactMarkdown>
          </div>
          <div style={{ borderBottom: "1px solid #dedede" }} />
        </Fragment>
      )}
      {helpItemsVideo &&
        helpItemsVideo.map((aHelpItem, idx) => (
          <Box
            className={"helpItemBlock"}
            key={`help-item-${aHelpItem.title.toLowerCase().replace(" ", "-")}`}
          >
            <HelpItem item={aHelpItem} />
          </Box>
        ))}
      <div style={{ padding: 16 }}>
        <MoreLink
          LeadingIcon={FileVideoIcon}
          text={"Visit MinIO Videos (upstream)"}
          link={"https://resources.min.io/l/library?contentType=video"}
          color={"#007FA8"}
        />
      </div>
    </Box>
  );
  const helpContentBlog = (
    <Box className={"helpContainer"}>
      {helpItemsBlog &&
        helpItemsBlog.map((aHelpItem, idx) => (
          <Box
            className={"helpItemBlock"}
            key={`help-item-${aHelpItem.title.toLowerCase().replace(" ", "-")}`}
          >
            <HelpItem item={aHelpItem} />
          </Box>
        ))}
      <div style={{ padding: 16 }}>
        <MoreLink
          LeadingIcon={ReportIcon}
          text={"Visit SILO Blog"}
          link={SILO_BLOG_URL}
          color={"#007FA8"}
        />
      </div>
    </Box>
  );

  const constructHMTabs = () => {
    const helpMenuElements: TabItemProps[] = [];

    if (helpItems.length !== 0) {
      helpMenuElements.push({
        tabConfig: { label: "Documentation", id: "docs" },
        content: helpContent,
      });
    }

    if (helpItemsVideo.length !== 0) {
      helpMenuElements.push({
        tabConfig: { label: "Video", id: "video" },
        content: helpContentVideo,
      });
    }

    if (helpItemsBlog.length !== 0) {
      helpMenuElements.push({
        tabConfig: { label: "Blog", id: "blog" },
        content: helpContentBlog,
      });
    }

    return helpMenuElements;
  };

  return (
    <Fragment>
      {helpMenuOpen && (
        <HelpMenuContainer ref={wrapperRef} $sidebarOpen={sidebarOpen}>
          <Tabs
            options={constructHMTabs()}
            currentTabOrPath={helpTabName}
            onTabClick={(item) => dispatch(setHelpTabName(item))}
            optionsInitialComponent={
              <Box sx={{ margin: "10px 10px 10px 15px" }}>
                <HelpIconFilled
                  style={{ color: "#3874A6", width: 16, height: 16 }}
                />
              </Box>
            }
            optionsEndComponent={
              <Box sx={{ marginRight: 15 }}>
                <IconButton
                  aria-label="Close help"
                  onClick={() => {
                    setHelpMenuOpen(false);
                  }}
                  size="small"
                >
                  <AlertCloseIcon style={{ color: "#919191", width: 12 }} />
                </IconButton>
              </Box>
            }
            horizontalBarBackground
            horizontal
          />
        </HelpMenuContainer>
      )}
      <Button
        aria-expanded={helpMenuOpen}
        aria-label="Open help"
        id={systemHelpName ?? "help_button"}
        icon={<HelpIcon />}
        onClick={toggleHelpMenu}
        type="button"
      ></Button>
    </Fragment>
  );
};

export default HelpMenu;
