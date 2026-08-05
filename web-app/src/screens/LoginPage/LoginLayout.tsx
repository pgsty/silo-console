// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import { SILO_COLORS, SiloBrand } from "../../common/SiloBrand";
import WaveMeshCanvas from "./WaveMeshCanvas";
import HelpMenu from "../Console/HelpMenu";
import DarkModeActivator from "../Console/Common/DarkModeActivator/DarkModeActivator";
import LanguageActivator from "../Console/Common/LanguageActivator/LanguageActivator";
import { interpolate, useLocalizedLink, useT } from "i18n";

// Chakra Petch (the wordmark typeface) is registered app-wide in index.css.
const displayFont =
  '"Chakra Petch", "Inter", -apple-system, "Segoe UI", sans-serif';

const LoginShell = styled.div({
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
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    zIndex: 1,
    background: "linear-gradient(to top, rgba(4, 10, 22, 0.85), transparent)",
  },
  "@media (max-width: 991px)": {
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
  "& .eyebrow": {
    fontFamily: displayFont,
    fontWeight: 500,
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
    maxWidth: "64ch",
  },
  "& .spacer": {
    flexGrow: 1,
  },
  "& .legal": {
    margin: 0,
    fontSize: 11,
    lineHeight: 1.7,
    color: SILO_COLORS.faint,
    maxWidth: "70ch",
    "& span": {
      display: "block",
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
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
  "& .headerActions": {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 2,
    // Quiet ghost icon buttons: no chrome, low contrast until hovered.
    // Direct children only — the help panel (a nested div) has its own buttons.
    "& > button": {
      border: "none",
      background: "transparent",
      boxShadow: "none",
      padding: 0,
      height: 28,
      width: 28,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: get(theme, "mutedText", "#9CA3AF"),
      opacity: 0.6,
      transition: "opacity 0.15s ease, color 0.15s ease",
      "& svg": {
        width: 15,
        height: 15,
        fill: "currentcolor",
        color: "currentcolor",
      },
      "&:hover": {
        border: "none",
        background: "transparent",
        color: get(theme, "fontColor", "#3F3F46"),
        opacity: 1,
      },
    },
    // The help panel is absolutely positioned; anchor it below the buttons
    // and keep it inside the viewport (there is no sidebar on this page).
    "& > div": {
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
    height: 215,
    flexShrink: 0,
    boxShadow: "0 3px 10px 2px #00000010",
  },
  "& .logoLockup": {
    display: "flex",
    alignItems: "center",
    gap: 18,
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
    fontWeight: 500,
    fontSize: 11,
    letterSpacing: "0.42em",
    paddingLeft: "0.42em",
    textTransform: "uppercase",
    color: get(theme, "fontColor", "#000"),
    opacity: 0.55,
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
    padding: "35px 0",
    fontSize: 11,
    color: get(theme, "login.footerElements", "#2781B0"),
    "& a": {
      fontFamily: displayFont,
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: "0.24em",
      textTransform: "uppercase",
      color: get(theme, "login.footerElements", "#2781B0"),
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
      opacity: 0.4,
    },
  },
}));

interface LoginLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const LoginLayout = ({ children, footer }: LoginLayoutProps) => {
  const t = useT();
  const localize = useLocalizedLink();

  return (
    <LoginShell>
      <BrandPanel>
        <WaveMeshCanvas />
        <BrandContent>
          <div className="eyebrow">
            {t("Open-Source S3/MinIO-Compatible Object Storage")}
          </div>
          <h1>
            {interpolate(t("Keep the {s3}"), {
              s3: <span className="accentSky">{t("S3 Interface")}</span>,
            })}
            <br />
            {interpolate(t("Own the {store}"), {
              store: <span className="accentCopper">{t("Object Store")}</span>,
            })}
          </h1>
          <p className="descriptor">
            {interpolate(
              t("Community maintained {minio}, forked by {pigsty} · {agpl}"),
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
                pigsty: (
                  <a
                    href={localize("https://pigsty.io")}
                    target="_blank"
                    rel="noopener"
                  >
                    Pigsty
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
            {t(
              "A high-performance object store that runs on any infrastructure — public cloud, private cloud, or bare metal. It powers data lakes, AI/ML, and fast backup & recovery, with erasure coding, encryption, and replication built in.",
            )}
          </p>
          <div className="spacer" />
          <p className="legal">
            <span>
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
            <span>
              {interpolate(
                t(
                  "SILO is maintained by {pigsty}, without MinIO affiliation, endorsement, or sponsorship.",
                ),
                {
                  pigsty: (
                    <a
                      href={localize("https://pigsty.io")}
                      target="_blank"
                      rel="noopener"
                    >
                      PIGSTY
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
          <span className="consoleTag">{t("Object Storage Console")}</span>
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
