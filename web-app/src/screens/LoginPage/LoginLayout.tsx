// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { SILO_COLORS, SiloBrand } from "../../common/SiloBrand";
import WaveMeshCanvas from "./WaveMeshCanvas";
import HelpMenu from "../Console/HelpMenu";
import DarkModeActivator from "../Console/Common/DarkModeActivator/DarkModeActivator";
import LanguageActivator from "../Console/Common/LanguageActivator/LanguageActivator";
import { interpolate, useLanguage, useLocalizedLink, useT } from "i18n";
import { useMobile } from "common/ui/useMediaQuery";

// Chakra Petch (the wordmark typeface) is registered app-wide in index.css.
const displayFont =
  '"Chakra Petch", "Inter", -apple-system, "Segoe UI", sans-serif';

const LoginShell = styled.main({
  display: "flex",
  alignItems: "stretch",
  minHeight: "100vh",
});

const BrandPanel = styled.aside({
  position: "relative",
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  display: "flex",
  backgroundColor: SILO_COLORS.night,
  backgroundImage:
    "radial-gradient(ellipse 110% 80% at 0% 0%, rgba(29, 88, 140, 0.28), transparent 62%)",
  // Grounds the trademark lines against the wave mesh.
  "&::after": {
    content: '""',
    position: "absolute",
    insetInlineStart: 0,
    insetInlineEnd: 0,
    bottom: 0,
    height: 150,
    zIndex: 1,
    background: "linear-gradient(to top, rgba(4, 10, 22, 0.85), transparent)",
  },
  "@media (max-width: 767.98px)": {
    display: "none",
  },
});

const BrandContent = styled.div({
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "clamp(40px, 6vw, 88px)",
  paddingBottom: 36,
  "@media (min-width: 768px) and (max-width: 991px)": {
    padding: "40px 24px 24px",
    "& h1": { fontSize: 26 },
  },
  "& .eyebrow": {
    fontFamily: displayFont,
    fontWeight: 550,
    fontSize: 12,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: SILO_COLORS.sky,
  },
  "& h1": {
    margin: "26px 0 0",
    fontFamily: displayFont,
    fontWeight: 700,
    fontSize: "clamp(26px, 2.9vw, 54px)",
    lineHeight: 1.16,
    letterSpacing: "0.01em",
    color: SILO_COLORS.text,
    whiteSpace: "nowrap",
  },
  "& .heroLine": { display: "block", width: "max-content" },
  "& .heroLine + .heroLine": {
    fontSize: "calc(1em * var(--hero-line-scale, 1))",
  },
  "& h1 .accentSky": {
    color: SILO_COLORS.sky,
  },
  "& h1 .accentCopper": {
    color: SILO_COLORS.copper,
  },
  "& .descriptor": {
    margin: "24px 0 0",
    fontSize: 15,
    lineHeight: 1.6,
    color: SILO_COLORS.muted,
    maxWidth: "60ch",
    "& a": {
      color: SILO_COLORS.sky,
      textDecoration: "none",
      borderBottom: "1px solid rgba(127, 184, 232, 0.35)",
      transition: "border-color 0.15s ease",
      "&:hover": {
        borderBottomColor: SILO_COLORS.sky,
      },
    },
  },
  "& .intro": {
    margin: "18px 0 0",
    fontSize: 14,
    lineHeight: 1.7,
    color: SILO_COLORS.muted,
    opacity: 0.85,
    maxWidth: "100%",
    textWrap: "pretty",
    "& .introSentence + .introSentence::before": { content: '" "' },
    "@media (min-width: 1280px)": {
      "& .introSentence": { display: "block", textWrap: "balance" },
      "& .introSentence + .introSentence::before": { content: "none" },
    },
  },
  "& .spacer": {
    flexGrow: 1,
  },
  "& .legal": {
    margin: 0,
    fontSize: 11,
    lineHeight: 1.7,
    color: SILO_COLORS.muted,
    maxWidth: "100%",
    width: "fit-content",
    textWrap: "pretty",
    "& .legalLine": { display: "block" },
    "@media (min-width: 1340px)": {
      "& .legalLine": { textAlign: "justify", textAlignLast: "justify" },
    },
    "& a": {
      color: "inherit",
      textDecoration: "underline",
      textUnderlineOffset: 2,
      "&:hover": {
        color: SILO_COLORS.muted,
      },
    },
  },
});

const FormPanel = styled.section(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 520,
  minHeight: "100vh",
  backgroundColor: get(theme, "login.formBG", "#fff"),
  "@media (min-width: 768px) and (max-width: 991px)": {
    width: "50%",
    flexShrink: 0,
  },
  "@media (max-width: 767.98px)": {
    maxWidth: "100%",
    "& .formArea": { padding: "32px 12px 0" },
    "& .formBox": { maxWidth: 400, width: "100%" },
  },
  "& .headerActions": {
    position: "absolute",
    top: 8,
    insetInlineEnd: 8,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 4,
    // The help panel is absolutely positioned; anchor it below the buttons
    // and keep it inside the viewport (there is no sidebar on this page).
    "& > .help-menu-panel": {
      top: "calc(100% + 8px)",
      maxWidth: "min(754px, calc(100vw - 36px))",
    },
  },
  "& .logoBand": {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    height: 216,
    flexShrink: 0,
  },
  "& .logoLockup": {
    display: "flex",
    alignItems: "center",
    gap: 16,
    textDecoration: "none",
    transition: "opacity 0.15s ease",
    "&:hover": {
      opacity: 0.82,
    },
    "& .emblem": {
      display: "block",
      height: 84,
      width: "auto",
    },
    "& .wordmark": {
      display: "block",
      height: 58,
      width: "auto",
    },
  },
  "& .logoBand .consoleTag": {
    fontFamily: displayFont,
    fontWeight: 550,
    fontSize: 11,
    letterSpacing: "0.42em",
    paddingInlineStart: "0.42em",
    textTransform: "uppercase",
    color: "var(--muted-foreground)",
    margin: 0,
  },
  "& .formArea": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    padding: "40px 24px 0",
  },
  "& .formBox": {
    width: 328,
    maxWidth: "100%",
    flexGrow: 1,
  },
  "& .footer": {
    width: 328,
    maxWidth: "100%",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    borderTop: `1px solid ${get(theme, "login.footerDivider", "#F2F2F2")}`,
    padding: "32px 0",
    fontSize: 11,
    color: "var(--muted-foreground)",
    "& a": {
      fontFamily: displayFont,
      fontWeight: 550,
      fontSize: 11,
      letterSpacing: "0.24em",
      textTransform: "uppercase",
      color: "var(--muted-foreground)",
      textDecoration: "none",
      paddingBottom: 1,
      borderBottom:
        "1px solid color-mix(in srgb, currentcolor 30%, transparent)",
      transition: "border-color 0.15s ease",
      "&:hover": {
        borderBottomColor: "currentcolor",
      },
    },
    "& .separator": {
      color: "var(--muted-foreground)",
    },
  },
}));

interface LoginLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const LoginLayout = ({ children, footer }: LoginLayoutProps) => {
  const t = useT();
  const language = useLanguage();
  const pgstyURL = useLocalizedLink()("https://pgsty.com/");
  const firstLine = useRef<HTMLSpanElement>(null);
  const secondLine = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const first = firstLine.current;
    const second = secondLine.current;
    if (!first || !second) return;
    let active = true;
    const align = () => {
      if (!active) return;
      if (language !== "en") {
        second.style.removeProperty("--hero-line-scale");
        return;
      }
      const firstWidth = first.getBoundingClientRect().width;
      const secondWidth = second.getBoundingClientRect().width;
      if (!firstWidth || !secondWidth) return;
      const currentScale =
        parseFloat(getComputedStyle(second).fontSize) /
        parseFloat(getComputedStyle(first).fontSize);
      second.style.setProperty(
        "--hero-line-scale",
        String((firstWidth / secondWidth) * currentScale),
      );
    };
    const observer = new ResizeObserver(align);
    observer.observe(first);
    void document.fonts.ready.then(align);
    align();
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [language]);
  const localize = useLocalizedLink();
  const mobile = useMobile();
  const ConsoleTag = mobile ? "h1" : "span";
  const HeroHeading = mobile ? "div" : "h1";

  return (
    <LoginShell>
      <BrandPanel>
        <WaveMeshCanvas />
        <BrandContent>
          <div className="eyebrow">
            {t("Open-Source S3/MinIO-Compatible Object Storage")}
          </div>
          <HeroHeading>
            <span className="heroLine" ref={firstLine}>
              {interpolate(t("Keep the {s3}"), {
                s3: <span className="accentSky">{t("S3 Interface")}</span>,
              })}
            </span>
            <span className="heroLine" ref={secondLine}>
              {interpolate(t("Own the {store}"), {
                store: (
                  <span className="accentCopper">{t("Object Store")}</span>
                ),
              })}
            </span>
          </HeroHeading>
          <p className="descriptor">
            {interpolate(
              t("{minio} fork maintained by {pgsty}, {agpl} License"),
              {
                minio: (
                  <a
                    href="https://github.com/minio/minio"
                    target="_blank"
                    rel="noopener"
                  >
                    MinIO
                  </a>
                ),
                pgsty: (
                  <a href={pgstyURL} target="_blank" rel="noopener">
                    PGSTY
                  </a>
                ),
                agpl: (
                  <a
                    href={localize("https://silo.pgsty.com/about/license/")}
                    target="_blank"
                    rel="noopener"
                  >
                    AGPLv3
                  </a>
                ),
              },
            )}
          </p>
          <p className="intro">
            <span className="introSentence">
              {t(
                "A high-performance object store that runs on any infrastructure — public cloud, private cloud, or bare metal.",
              )}
            </span>
            <span className="introSentence">
              {t(
                "Erasure coding, encryption, and replication power data lakes, AI/ML, and fast backup & recovery.",
              )}
            </span>
          </p>
          <div className="spacer" />
          <p className="legal">
            <span className="legalLine">
              {interpolate(
                t(
                  "MinIO® is a registered trademark of {minioInc}; SILO incorporates {minioSource}.",
                ),
                {
                  minioInc: (
                    <a href="https://min.io" target="_blank" rel="noopener">
                      MinIO, Inc.
                    </a>
                  ),
                  minioSource: (
                    <a
                      href="https://github.com/minio/minio"
                      target="_blank"
                      rel="noopener"
                    >
                      {t("MinIO source code")}
                    </a>
                  ),
                },
              )}
            </span>
            <span className="legalLine">
              {interpolate(
                t(
                  "SILO is maintained by {pgsty}, without MinIO affiliation, endorsement, or sponsorship.",
                ),
                {
                  pgsty: (
                    <a href={pgstyURL} target="_blank" rel="noopener">
                      PGSTY
                    </a>
                  ),
                },
              )}
            </span>
          </p>
        </BrandContent>
      </BrandPanel>
      <FormPanel>
        <div className="logoBand">
          <div className="headerActions">
            <HelpMenu />
            <LanguageActivator />
            <DarkModeActivator />
          </div>
          <a
            className="logoLockup"
            href={localize("https://silo.pgsty.com")}
            target="_blank"
            rel="noopener"
            aria-label={t("SILO website")}
          >
            <SiloBrand variant="emblem" className="emblem" />
            <SiloBrand variant="wordmark" className="wordmark" />
          </a>
          <ConsoleTag className="consoleTag">
            {t("Object Storage Console")}
          </ConsoleTag>
        </div>
        <div className="formArea">
          <div className="formBox">{children}</div>
        </div>
        {footer ? <div className="footer">{footer}</div> : null}
      </FormPanel>
    </LoginShell>
  );
};

export default LoginLayout;
