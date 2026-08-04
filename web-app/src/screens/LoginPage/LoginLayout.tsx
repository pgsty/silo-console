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
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontFamily: displayFont,
    fontWeight: 500,
    fontSize: 12,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: SILO_COLORS.sky,
  },
  "& .eyebrow .bits": {
    display: "flex",
    gap: 5,
    flexShrink: 0,
  },
  "& .eyebrow .bits span": {
    display: "block",
    width: 8,
    height: 8,
    backgroundColor: SILO_COLORS.steel,
  },
  "& .eyebrow .bits .bitParity": {
    backgroundColor: "transparent",
    border: `1px solid ${SILO_COLORS.copper}`,
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
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 520,
  minHeight: "100vh",
  backgroundColor: get(theme, "login.formBG", "#fff"),
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
  "& .logoBand": {
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
    fontSize: 14,
    color: get(theme, "login.footerElements", "#2781B0"),
    "& a": {
      color: get(theme, "login.footerElements", "#2781B0"),
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
}));

interface LoginLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const LoginLayout = ({ children, footer }: LoginLayoutProps) => {
  return (
    <LoginShell>
      <BrandPanel>
        <WaveMeshCanvas />
        <BrandContent>
          <div className="eyebrow">
            <span className="bits" aria-hidden="true">
              <span />
              <span />
              <span className="bitParity" />
            </span>
            Open-Source S3/MinIO-Compatible Object Storage
          </div>
          <h1>
            Keep the <span className="accentSky">S3 Interface</span>
            <br />
            Own the <span className="accentCopper">Object Store</span>
          </h1>
          <p className="descriptor">
            Community maintained{" "}
            <a
              href="https://github.com/minio/minio"
              target="_blank"
              rel="noopener"
            >
              MinIO
            </a>
            , forked by{" "}
            <a href="https://pigsty.io" target="_blank" rel="noopener">
              Pigsty
            </a>{" "}
            ·{" "}
            <a
              href="https://silo.pgsty.com/about/license/"
              target="_blank"
              rel="noopener"
            >
              AGPLv3
            </a>
          </p>
          <p className="intro">
            A high-performance object store that runs on any infrastructure —
            public cloud, private cloud, or bare metal. It powers data lakes,
            AI/ML, and fast backup &amp; recovery, with erasure coding,
            encryption, and replication built in.
          </p>
          <div className="spacer" />
          <p className="legal">
            <span>
              MinIO® is a registered trademark of{" "}
              <a href="https://min.io" target="_blank" rel="noopener">
                MinIO, Inc.
              </a>
            </span>
            <span>
              SILO is an independent community project, not affiliated with or
              endorsed by MinIO, Inc.
            </span>
          </p>
        </BrandContent>
      </BrandPanel>
      <FormPanel>
        <div className="logoBand">
          <div className="logoLockup">
            <SiloBrand variant="emblem" className="emblem" />
            <SiloBrand variant="wordmark" className="wordmark" />
          </div>
          <span className="consoleTag">Object Storage Console</span>
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
