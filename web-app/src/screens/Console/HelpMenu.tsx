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

import React, {
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import {
  AlertCloseIcon,
  Box,
  Button,
  breakPoints,
  DocumentationIcon,
  Elevated,
  FileVideoIcon,
  HelpIcon,
  IconButton,
  Loader,
  ReportIcon,
} from "mds";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../store";
import { setHelpTabName } from "../../systemSlice";
import { DocItem } from "./HelpMenu.types";
import { openShortcutHelp } from "common/ui/ShortcutHelp";
import HelpItem from "./HelpItem";
import MoreLink from "../../common/MoreLink";
import HeaderIconButton from "./Common/PageHeaderWrapper/HeaderIconButton";
import {
  i18nKey,
  Lang,
  localizeUrl,
  useLanguage,
  useLocalizedLink,
  useT,
} from "i18n";

const ReactMarkdown = React.lazy(() => import("react-markdown"));

type HelpTopics = Record<
  string,
  Partial<Record<"docs" | "video", { header: string | null; links: DocItem[] }>>
>;

let helpTopicsPromise: Promise<HelpTopics> | undefined;

const loadHelpTopics = () =>
  (helpTopicsPromise ??= import("./helpTopics.json").then(
    (module) => module.default,
    (error: unknown) => {
      helpTopicsPromise = undefined;
      throw error;
    },
  ));

const SILO_BLOG_URL = "https://silo.pgsty.com/blog/";
const SILO_BLOG_FEED_URL = "https://silo.pgsty.com/blog/index.xml";
const SILO_BLOG_ITEM_LIMIT = 6;
const SILO_BLOG_FALLBACK: DocItem[] = [
  {
    title: i18nKey("SILO Blog"),
    url: SILO_BLOG_URL,
    body: i18nKey(
      "Read SILO release notes, security advisories, and project updates.",
    ),
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
            : i18nKey("Read this update on the SILO Blog."),
        };
      } catch {
        return null;
      }
    })
    .filter((item): item is DocItem => item !== null)
    .slice(0, SILO_BLOG_ITEM_LIMIT);
};

const HelpTabs = React.lazy(
  () => import("../../../packages/mds/src/components/Tabs/Tabs"),
);

const HelpMenuContainer = styled(Elevated).attrs({
  offset: 2,
  shadowLevel: 3,
})({
  position: "absolute",
  top: "calc(100% + 8px)",
  insetInlineEnd: "var(--page-header-inline-padding, 12px)",
  zIndex: "20",
  border: 0,
  borderRadius: "var(--radius-popover)",
  overflow: "hidden",
  width: 754,
  maxWidth: "calc(100% - 24px)",
  boxSizing: "border-box",
  "& svg [fill]:not([fill='none']):not([fill='#fff']):not([fill='#FFFFFF'])": {
    fill: "currentColor",
  },
  "& svg [fill='#fff'], & svg [fill='#FFFFFF']": {
    fill: "var(--surface-3)",
  },
  [`@media (max-width: ${breakPoints.sm}px)`]: {
    width: "calc(100vw - 24px)",
    maxWidth: "calc(100% - 24px)",
  },
  "& .optionsContainer": {
    padding: "12px 16px",
    flexWrap: "wrap",
    overflow: "visible",
    borderBottom: "1px solid var(--border)",
  },
  "& .helpToolbarActions": {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginInlineStart: "auto",
  },
  "& .tabsPanels": {
    padding: "16px 0 0",
  },
  "& .helpContainer": {
    maxHeight: "min(520px, calc(100dvh - 200px))",
    color: "var(--foreground)",
    fontSize: "var(--fs-body)",
    lineHeight: "var(--lh-body)",
    "& h2, & h3": {
      fontSize: "var(--fs-subtitle)",
      lineHeight: "var(--lh-subtitle)",
      fontWeight: 550,
    },
    "& code": { fontFamily: "var(--font-mono)", overflowWrap: "anywhere" },
    overflowY: "auto",
    "& .helpItemBlock": { padding: "0 8px 4px" },
  },
});

const VideoNotice = styled.div({
  margin: "0 16px 16px",
  padding: "12px 16px",
  borderRadius: "var(--radius-control)",
  background: "var(--muted)",
  color: "var(--foreground)",
  fontSize: "var(--fs-caption)",
  lineHeight: "var(--lh-caption)",
});

const HelpMenu = ({
  renderTrigger,
}: {
  renderTrigger?: (
    toggle: () => void,
    open: boolean,
    ref: React.RefObject<HTMLButtonElement>,
    hover: Pick<
      React.HTMLAttributes<HTMLButtonElement>,
      "onPointerEnter" | "onPointerLeave"
    >,
  ) => React.ReactNode;
}) => {
  const [helpTopics, setHelpTopics] = useState<HelpTopics | null>(null);

  const [helpItemsBlog, setHelpItemsBlog] =
    useState<DocItem[]>(SILO_BLOG_FALLBACK);
  const [helpMenuOpen, setHelpMenuOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();
  const interactive = useRef(false);
  const clearHoverTimer = () => clearTimeout(hoverTimer.current);
  const closeHelp = () => {
    clearHoverTimer();
    setHelpMenuOpen(false);
    interactive.current = false;
  };
  const enterHelp = () => clearHoverTimer();
  const leaveHelp = () => {
    clearHoverTimer();
    if (!interactive.current) {
      hoverTimer.current = setTimeout(() => setHelpMenuOpen(false), 220);
    }
  };
  const hoverTrigger = {
    onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => {
      clearHoverTimer();
      if (
        event.pointerType === "mouse" &&
        window.matchMedia("(hover: hover)").matches
      ) {
        hoverTimer.current = setTimeout(() => setHelpMenuOpen(true), 180);
      }
    },
    onPointerLeave: leaveHelp,
  };
  useEffect(() => () => clearTimeout(hoverTimer.current), []);
  // Feed items per language; a miss (or failed fetch) keeps the fallback so
  // the next open retries.
  const blogCache = useRef<Partial<Record<Lang, DocItem[]>>>({});
  const t = useT();
  const localize = useLocalizedLink();
  const language = useLanguage();
  const helpLoading = (
    <Box
      role="status"
      aria-label={t("Loading")}
      sx={{
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader aria-hidden="true" style={{ width: 28, height: 28 }} />
    </Box>
  );

  const systemHelpName = useSelector(
    (state: AppState) => state.system.helpName,
  );

  const helpTabName = useSelector(
    (state: AppState) => state.system.helpTabName,
  );

  const toggleHelpMenu = () => {
    clearHoverTimer();
    if (helpMenuOpen && interactive.current) {
      closeHelp();
      triggerRef.current?.focus();
    } else {
      interactive.current = true;
      setHelpMenuOpen(true);
      wrapperRef.current?.querySelector<HTMLElement>("button")?.focus();
    }
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!helpMenuOpen) return;
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !wrapperRef.current?.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
      )
        closeHelp();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      const returnFocus =
        interactive.current ||
        wrapperRef.current?.contains(document.activeElement);
      closeHelp();
      if (returnFocus) triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [helpMenuOpen]);

  // Hover previews never move focus. A click or keyboard activation enters
  // the panel, including while the lazy toolbar is still loading.
  const focusToolbar = useCallback((button: HTMLButtonElement | null) => {
    if (interactive.current) button?.focus();
  }, []);
  useEffect(() => {
    if (helpMenuOpen && interactive.current) {
      const panel = wrapperRef.current;
      (panel?.querySelector<HTMLElement>("button") ?? panel)?.focus();
    }
  }, [helpMenuOpen]);

  useEffect(() => {
    if (!helpMenuOpen || helpTopics) return;
    let active = true;
    void loadHelpTopics()
      .then((topics) => {
        if (active) setHelpTopics(topics);
      })
      .catch(() => {
        // Keep the documentation link available; reopening retries the load.
      });
    return () => {
      active = false;
    };
  }, [helpMenuOpen, helpTopics]);

  useEffect(() => {
    if (!helpMenuOpen || helpTabName !== "blog") {
      return;
    }

    const cached = blogCache.current[language];
    if (cached) {
      setHelpItemsBlog(cached);
      return;
    }
    // Nothing cached for this language yet: drop the other language's items
    // right away so a failed fetch can't leave them on screen.
    setHelpItemsBlog(SILO_BLOG_FALLBACK);

    const abortController = new AbortController();

    const loadBlogFeed = async () => {
      try {
        const response = await fetch(
          localizeUrl(SILO_BLOG_FEED_URL, language),
          {
            headers: {
              Accept:
                "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
            },
            credentials: "omit",
            signal: abortController.signal,
          },
        );

        if (!response.ok) {
          return;
        }

        const blogItems = parseSiloBlogFeed(await response.text());
        if (blogItems.length > 0) {
          blogCache.current[language] = blogItems;
          setHelpItemsBlog(blogItems);
        }
      } catch {
        // Keep the local SILO Blog fallback when the remote feed is unavailable.
      }
    };

    void loadBlogFeed();

    return () => abortController.abort();
  }, [helpMenuOpen, helpTabName, language]);

  const topic = helpTopics?.[systemHelpName];
  const docs = topic?.docs ?? helpTopics?.help?.docs;
  const headerDocs = docs?.header;
  const helpItems = docs?.links ?? [];
  const headerVideo = topic?.video?.header;
  const helpItemsVideo = topic?.video?.links.length
    ? topic.video.links
    : [
        {
          title: i18nKey("Visit MinIO Videos (upstream)"),
          url: "https://resources.min.io/l/library?contentType=video",
          body: i18nKey(
            "Explore upstream videos about object storage, replication, and administration.",
          ),
        },
      ];

  const helpContent = (
    <Box className={"helpContainer"}>
      {headerDocs && (
        <div style={{ paddingInlineStart: 16, paddingInlineEnd: 16 }}>
          <div>
            <Suspense fallback={helpLoading}>
              <ReactMarkdown components={{ h1: "h2" }}>
                {t(headerDocs)}
              </ReactMarkdown>
            </Suspense>
          </div>
          <div style={{ borderBottom: "1px solid var(--border)" }} />
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
          text={t("Visit SILO Documentation")}
          link={localize("https://silo.pgsty.com/docs/")}
          color={"var(--foreground)"}
        />
      </div>
    </Box>
  );
  const helpContentVideo = (
    <Box className={"helpContainer"}>
      <VideoNotice>
        {t(
          "SILO does not yet maintain a native video catalog. These links open upstream MinIO compatibility material.",
        )}
      </VideoNotice>
      {headerVideo && (
        <Fragment>
          <div style={{ paddingInlineStart: 16, paddingInlineEnd: 16 }}>
            <Suspense fallback={helpLoading}>
              <ReactMarkdown components={{ h1: "h2" }}>
                {t(headerVideo)}
              </ReactMarkdown>
            </Suspense>
          </div>
          <div style={{ borderBottom: "1px solid var(--border)" }} />
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
          text={t("Visit MinIO Videos (upstream)")}
          link={"https://resources.min.io/l/library?contentType=video"}
          color={"var(--foreground)"}
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
          text={t("Visit SILO Blog")}
          link={localize(SILO_BLOG_URL)}
          color={"var(--foreground)"}
        />
        <MoreLink
          text={t("RSS feed")}
          link={localize(SILO_BLOG_FEED_URL)}
          color="var(--muted-foreground)"
        />
      </div>
    </Box>
  );

  return (
    <Fragment>
      {helpMenuOpen && (
        <HelpMenuContainer
          className="help-menu-panel"
          ref={wrapperRef}
          tabIndex={-1}
          onPointerEnter={enterHelp}
          onPointerLeave={leaveHelp}
          onFocus={() => {
            interactive.current = true;
            clearHoverTimer();
          }}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(
                event.relatedTarget as Node | null,
              ) &&
              !triggerRef.current?.contains(event.relatedTarget as Node | null)
            )
              closeHelp();
          }}
        >
          <Suspense fallback={helpLoading}>
            <HelpTabs
              options={[
                {
                  tabConfig: {
                    label: t("Documentation"),
                    id: "docs",
                    icon: <DocumentationIcon />,
                  },
                  content: helpContent,
                },
                {
                  tabConfig: {
                    label: t("Video"),
                    id: "video",
                    icon: <FileVideoIcon />,
                  },
                  content: helpContentVideo,
                },
                {
                  tabConfig: {
                    label: t("Blog"),
                    id: "blog",
                    icon: <ReportIcon />,
                  },
                  content: helpContentBlog,
                },
              ]}
              currentTabOrPath={helpTabName}
              onTabClick={(item) => dispatch(setHelpTabName(item))}
              optionsEndComponent={
                <div className="helpToolbarActions">
                  <Button
                    ref={focusToolbar}
                    id="keyboard-shortcuts-help"
                    variant="ghost"
                    onClick={() => {
                      closeHelp();
                      triggerRef.current?.focus();
                      openShortcutHelp();
                    }}
                  >
                    {t("Keyboard shortcuts")}
                  </Button>
                  <IconButton
                    aria-label={t("Close help")}
                    onClick={() => {
                      closeHelp();
                      triggerRef.current?.focus();
                    }}
                    size="small"
                  >
                    <AlertCloseIcon
                      style={{ color: "var(--muted-foreground)", width: 16 }}
                    />
                  </IconButton>
                </div>
              }
              horizontalBarBackground
              horizontal
            />
          </Suspense>
        </HelpMenuContainer>
      )}
      {renderTrigger ? (
        renderTrigger(toggleHelpMenu, helpMenuOpen, triggerRef, hoverTrigger)
      ) : (
        <HeaderIconButton
          ref={triggerRef}
          {...hoverTrigger}
          aria-expanded={helpMenuOpen}
          aria-label={t("Open help")}
          id={systemHelpName ?? "help_button"}
          onClick={toggleHelpMenu}
          type="button"
        >
          <HelpIcon />
        </HeaderIconButton>
      )}
    </Fragment>
  );
};

export default HelpMenu;
