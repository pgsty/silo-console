// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import React, { Fragment, useEffect, useState } from "react";
import get from "lodash/get";
import styled from "styled-components";
import { PageLayout } from "mds";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { version } from "version";
import { api } from "../../../api";
import { hasPermission } from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { SILO_COLORS, SiloBrand } from "../../../common/SiloBrand";

const SILO_SITE_URL = "https://silo.pgsty.com/";
const SILO_SOURCE_URL = "https://github.com/pgsty/silo";
const MINIO_SITE_URL = "https://min.io/";
const MINIO_SOURCE_URL = "https://github.com/minio/minio";
const AGPL_URL = "https://www.gnu.org/licenses/agpl-3.0.html";
const PIGSTY_SITE_URL = "https://pigsty.io/";

const LicenseSheet = styled.section(({ theme }) => ({
  maxWidth: 760,
  margin: "0 auto",
  color: get(theme, "fontColor", "#0D1A24"),
  fontSize: 15,
  lineHeight: 1.65,
  "& a": {
    color: get(theme, "linkColor", "#1D588C"),
    textDecoration: "none",
    borderBottom: `1px solid ${get(theme, "borderColor", "#C8D0D7")}`,
    overflowWrap: "anywhere",
    transition: "border-color 0.15s ease, color 0.15s ease",
  },
  "& a:hover": {
    borderBottomColor: get(theme, "linkColor", "#1D588C"),
  },
  '& a[target="_blank"]::after': {
    content: '"↗"',
    paddingLeft: 4,
    fontSize: "0.8em",
    opacity: 0.65,
  },
}));

const BrandLockup = styled.a(({ theme }) => ({
  width: 360,
  maxWidth: "100%",
  margin: "8px auto 0",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 20,
  borderBottom: "none !important",
  transition: "opacity 0.15s ease",
  "&:hover": {
    borderBottom: "none",
    opacity: 0.88,
  },
  "&::after": {
    display: "none !important",
  },
  "& .licenseWordmark": {
    filter:
      get(theme, "bgColor", "#FFFFFF") === "#181F2A"
        ? "brightness(1.5) saturate(0.85)"
        : "none",
  },
}));

const Tagline = styled.p(({ theme }) => ({
  margin: "16px 0 0",
  textAlign: "center",
  fontFamily: '"Chakra Petch", "Inter", sans-serif',
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: get(theme, "mutedText", "#71717A"),
  "& .acr": {
    color: SILO_COLORS.copper,
  },
}));

const Statement = styled.p({
  margin: "36px 0 0",
  fontSize: 17,
  lineHeight: 1.7,
  "& a::after": {
    display: "none !important",
  },
  "& strong": {
    fontWeight: 600,
  },
});

const LicenseRecord = styled.dl(({ theme }) => ({
  margin: "36px 0 0",
  paddingTop: 28,
  borderTop: `1px solid ${get(theme, "borderColor", "#E3E7EA")}`,
  display: "grid",
  gridTemplateColumns: "112px minmax(0, 1fr)",
  columnGap: 28,
  rowGap: 28,
  "& dt": {
    paddingTop: 4,
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: get(theme, "mutedText", "#687680"),
  },
  "& dd": {
    margin: 0,
    minWidth: 0,
  },
  "& dd > * + *": {
    marginTop: 7,
  },
  "& .chip": {
    display: "inline-block",
    padding: "3px 10px",
    border: `1px solid ${get(theme, "borderColor", "#C8D0D7")}`,
    borderRadius: 6,
    backgroundColor: get(theme, "boxBackground", "#FAFAFA"),
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    fontSize: 12,
    fontWeight: 600,
  },
  "& .line": {
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    fontSize: 13,
    lineHeight: 1.55,
  },
  "& .what": {
    paddingLeft: 7,
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
    color: get(theme, "mutedText", "#687680"),
  },
  "& .prose": {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.7,
    color: get(theme, "secondaryText", "#4D5B66"),
  },
  "& .note": {
    marginBottom: 0,
    fontSize: 12,
    lineHeight: 1.65,
    color: get(theme, "mutedText", "#687680"),
  },
  "@media (max-width: 640px)": {
    gridTemplateColumns: "1fr",
    rowGap: 8,
    "& dt:not(:first-of-type)": {
      marginTop: 20,
    },
  },
}));

const License = () => {
  const consoleVersion = version.startsWith("v") ? version : `v${version}`;

  // Server release comes from the same admin-info API the dashboard uses.
  // Accounts without admin:ServerInfo never issue the request and simply
  // keep the row hidden.
  const [serverVersion, setServerVersion] = useState<string>("");

  const canViewServerInfo = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_SERVER_INFO,
  ]);

  useEffect(() => {
    if (!canViewServerInfo) {
      return;
    }
    api.admin
      .adminInfo({ defaultOnly: false })
      .then((res) => {
        const versions = Array.from(
          new Set(
            (res.data?.servers || [])
              .map((server) => server.version)
              .filter(Boolean),
          ),
        );
        setServerVersion(versions.join(" · "));
      })
      .catch(() => {});
  }, [canViewServerInfo]);

  return (
    <Fragment>
      <PageHeaderWrapper label={"License"} />
      <PageLayout
        sx={{
          "@media (max-width: 640px)": {
            padding: "24px 20px",
          },
        }}
      >
        <LicenseSheet>
          <BrandLockup
            href={SILO_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit the SILO website"
          >
            <SiloBrand
              variant="emblem"
              alt="SILO emblem"
              style={{ display: "block", width: "25%", maxWidth: 88 }}
            />
            <SiloBrand
              className="licenseWordmark"
              style={{ display: "block", width: "60%", maxWidth: 200 }}
            />
          </BrandLockup>

          <Tagline>
            <span className="acr">S</span>3 <span className="acr">I</span>
            nterface · <span className="acr">L</span>ibre{" "}
            <span className="acr">O</span>bject Store
          </Tagline>

          <Statement>
            <a href={SILO_SITE_URL} target="_blank" rel="noopener noreferrer">
              SILO
            </a>{" "}
            is an independently maintained continuation of the{" "}
            <a href={MINIO_SITE_URL} target="_blank" rel="noopener noreferrer">
              MinIO
            </a>{" "}
            object storage project, carried forward by the{" "}
            <a href={PIGSTY_SITE_URL} target="_blank" rel="noopener noreferrer">
              Pigsty
            </a>{" "}
            community since 2026. Its{" "}
            <a href={SILO_SOURCE_URL} target="_blank" rel="noopener noreferrer">
              code
            </a>{" "}
            <strong>incorporates and modifies</strong>{" "}
            <a
              href={MINIO_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              upstream MinIO code
            </a>
            , and the complete work remains licensed under the{" "}
            <a
              href={AGPL_URL}
              target="_blank"
              rel="license noopener noreferrer"
            >
              GNU Affero General Public License, version 3
            </a>
            .
          </Statement>

          <LicenseRecord>
            <dt>Version</dt>
            <dd>
              {serverVersion !== "" && (
                <div className="line">
                  <span className="chip">{serverVersion}</span>
                  <span className="what">connected server</span>
                </div>
              )}
              <div className="line">
                <span className="chip">{consoleVersion}</span>
                <span className="what">this Console</span>
              </div>
            </dd>

            <dt>License</dt>
            <dd>
              <span className="chip">AGPL-3.0-or-later</span>
              <div className="line">
                <a
                  href={AGPL_URL}
                  target="_blank"
                  rel="license noopener noreferrer"
                >
                  GNU AGPL v3 full text
                </a>
              </div>
              <div className="line">
                <a
                  href="https://github.com/pgsty/silo-console/blob/main/LICENSE"
                  target="_blank"
                  rel="license noopener noreferrer"
                >
                  Console LICENSE
                </a>
              </div>
              <p className="note">
                Server, client and Console are all AGPLv3. SILO&apos;s
                documentation is CC BY 4.0 —{" "}
                <a
                  href="https://silo.pgsty.com/about/license/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  licensing in full
                </a>
                .
              </p>
            </dd>

            <dt>Source</dt>
            <dd>
              <div className="line">
                <a
                  href={SILO_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pgsty/silo
                </a>
                <span className="what">server</span>
              </div>
              <div className="line">
                <a
                  href="https://github.com/pgsty/mc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pgsty/mc
                </a>
                <span className="what">client</span>
              </div>
              <div className="line">
                <a
                  href="https://github.com/pgsty/silo-console"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pgsty/silo-console
                </a>
                <span className="what">this Console</span>
              </div>
              <div className="line">
                <a
                  href="https://github.com/georgmangold/console"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  georgmangold/console
                </a>
                <span className="what">Console predecessor</span>
              </div>
              <p className="note">
                Under section 13 of the AGPL, the corresponding source for this
                running version is offered to every user who interacts with it
                over a network, at no charge.
              </p>
            </dd>

            <dt>Copyright</dt>
            <dd>
              <p className="prose">
                © 2026 Ruohang Feng / PGSTY and the SILO contributors.
                <br />
                Portions © 2015–2026 MinIO, Inc.
                <br />
                Console portions © Georg Mangold and contributors.
              </p>
              <p className="note">
                Upstream copyright, authorship and license notices are retained
                in the repository&apos;s{" "}
                <a
                  href="https://github.com/pgsty/silo-console/blob/main/CREDITS"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CREDITS
                </a>{" "}
                and{" "}
                <a
                  href="https://github.com/pgsty/silo-console/blob/main/NOTICE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NOTICE
                </a>
                . See the{" "}
                <a
                  href="https://silo.pgsty.com/about/attribution/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  full attribution stack
                </a>
                .
              </p>
            </dd>

            <dt>Trademark</dt>
            <dd>
              <p className="prose">
                <a
                  href={MINIO_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MINIO®
                </a>{" "}
                is a registered trademark of MinIO, Inc.{" "}
                <a
                  href={SILO_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SILO
                </a>{" "}
                is not a MinIO, Inc. product, and is not affiliated with,
                sponsored by, or endorsed by MinIO, Inc.
              </p>
              <p className="note">
                The MinIO name is used here solely to identify the origin of the
                source code and to describe compatibility —{" "}
                <a
                  href="https://silo.pgsty.com/about/trademark/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  trademark notice
                </a>
                .
              </p>
            </dd>
          </LicenseRecord>
        </LicenseSheet>
      </PageLayout>
    </Fragment>
  );
};

export default License;
