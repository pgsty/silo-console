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
import styled from "styled-components";
import { PageLayout, type } from "mds";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { version } from "version";
import { api } from "../../../api";
import { hasPermission } from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { SiloBrand } from "../../../common/SiloBrand";
import { i18nKey, interpolate, useLocalizedLink, useT } from "i18n";
import {
  LEGAL_DOCUMENT_PATHS,
  REPOSITORY_URL,
  sourceReference,
} from "../../../common/sourceReference";

const SILO_SITE_URL = "https://silo.pgsty.com/";
const SILO_SOURCE_URL = "https://github.com/pgsty/silo";
const MINIO_SITE_URL = "https://min.io/";
const MINIO_SOURCE_URL = "https://github.com/minio/minio";
const AGPL_URL = "https://www.gnu.org/licenses/agpl-3.0.html";

const LicenseSheet = styled.section`
  ${type("body")}
  max-width: 760px;
  margin: 0 auto;
  color: var(--foreground);
  & a {
    color: var(--foreground);
    text-decoration: underline;
    text-decoration-color: var(--border);
    text-underline-offset: 4px;
    overflow-wrap: anywhere;
  }
  & a:hover {
    text-decoration-color: currentColor;
  }
  & a:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 4px;
    border-radius: 4px;
  }
  & a[target="_blank"]::after {
    content: "↗";
    padding-inline-start: 4px;
    color: var(--muted-foreground);
    font-size: var(--fs-micro);
  }
`;

const BrandLockup = styled.a`
  width: 360px;
  max-width: 100%;
  margin: 8px auto 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-decoration: none !important;
  &::after {
    display: none !important;
  }
  :root[data-theme="dark"] & .licenseWordmark {
    filter: brightness(1.5) saturate(0.85);
  }
`;

const Tagline = styled.p`
  ${type("caption")}
  margin: 16px 0 0;
  text-align: center;
  color: var(--muted-foreground);
  & .acr {
    color: var(--foreground);
    font-weight: 550;
  }
`;

const Statement = styled.p`
  ${type("subtitle", { weight: "normal" })}
  margin: 32px 0 0;
  & a::after {
    display: none !important;
  }
  & strong {
    font-weight: 550;
  }
`;

const LicenseRecord = styled.dl`
  margin: 32px 0 0;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  column-gap: 24px;
  row-gap: 24px;
  & dt {
    ${type("body", { weight: "semibold" })}
    padding-top: 4px;
    color: var(--muted-foreground);
  }
  & dd {
    margin: 0;
    min-width: 0;
  }
  & dd > * + * {
    margin-top: 8px;
  }
  & .chip {
    ${type("caption", { weight: "semibold" })}
    display: inline-block;
    max-width: 100%;
    box-sizing: border-box;
    padding: 4px 8px;
    border-radius: var(--radius-control);
    background: var(--muted);
    font-family: var(--font-mono);
    overflow-wrap: anywhere;
  }
  & .line {
    ${type("body")}
    font-family: var(--font-mono);
  }
  & .what {
    ${type("caption")}
    padding-inline-start: 8px;
    color: var(--muted-foreground);
  }
  & .prose {
    ${type("body")}
    margin: 0;
  }
  & .note {
    ${type("caption")}
    margin-bottom: 0;
    color: var(--muted-foreground);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    row-gap: 8px;
    & dt:not(:first-of-type) {
      margin-top: 16px;
    }
  }
`;

const License = () => {
  const localize = useLocalizedLink();
  const t = useT();
  const consoleVersion = version.startsWith("v") ? version : `v${version}`;
  const source = sourceReference();

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
      <PageHeaderWrapper label={i18nKey("License")} titleElement="h1" />
      <PageLayout>
        <LicenseSheet>
          <BrandLockup
            href={localize(SILO_SITE_URL)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("Visit the SILO website")}
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
            {interpolate(
              t(
                "{silo} is an independently maintained continuation of the {minio} object storage project, carried forward by the {pigsty} community since 2026. Its {code} {incorporates} {upstream}, and the complete work remains licensed under the {agpl}.",
              ),
              {
                silo: (
                  <a
                    href={localize(SILO_SITE_URL)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SILO
                  </a>
                ),
                minio: (
                  <a
                    href={MINIO_SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MinIO
                  </a>
                ),
                pigsty: (
                  <a
                    href={localize("https://pgsty.com/")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PGSTY
                  </a>
                ),
                code: (
                  <a
                    href={SILO_SOURCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("code")}
                  </a>
                ),
                incorporates: <strong>{t("incorporates and modifies")}</strong>,
                upstream: (
                  <a
                    href={MINIO_SOURCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("upstream MinIO code")}
                  </a>
                ),
                agpl: (
                  <a
                    href={AGPL_URL}
                    target="_blank"
                    rel="license noopener noreferrer"
                  >
                    {t("GNU Affero General Public License, version 3")}
                  </a>
                ),
              },
            )}
          </Statement>

          <LicenseRecord>
            <dt>{t("Version")}</dt>
            <dd>
              {serverVersion !== "" && (
                <div className="line">
                  <span className="chip">{serverVersion}</span>
                  <span className="what">{t("connected server")}</span>
                </div>
              )}
              <div className="line">
                <span className="chip">{consoleVersion}</span>
                <span className="what">{t("this Console")}</span>
              </div>
            </dd>

            <dt>{t("License")}</dt>
            <dd>
              <span className="chip">AGPL-3.0-or-later</span>
              <div className="line">
                <a
                  href={AGPL_URL}
                  target="_blank"
                  rel="license noopener noreferrer"
                >
                  {t("GNU AGPL v3 full text")}
                </a>
              </div>
              <div className="line">
                <a
                  href={LEGAL_DOCUMENT_PATHS.license}
                  target="_blank"
                  rel="license noopener noreferrer"
                >
                  {t("Console LICENSE")}
                </a>
              </div>
              <p className="note">
                {interpolate(
                  t(
                    "Server, client and Console are all AGPLv3. SILO's documentation is CC BY 4.0 — {licensing}.",
                  ),
                  {
                    licensing: (
                      <a
                        href={localize("https://silo.pgsty.com/about/license/")}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("licensing in full")}
                      </a>
                    ),
                  },
                )}
              </p>
            </dd>

            <dt>{t("Source")}</dt>
            <dd>
              <div className="line">
                <a
                  href={SILO_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pgsty/silo
                </a>
                <span className="what">{t("server")}</span>
              </div>
              <div className="line">
                <a
                  href="https://github.com/pgsty/mc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pgsty/mc
                </a>
                <span className="what">{t("client")}</span>
              </div>
              <div className="line">
                <a
                  href={source.available ? source.url : REPOSITORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pgsty/silo-console
                </a>
                <span className="what">{t("this Console")}</span>
              </div>
              <div className="line" data-testid="corresponding-source">
                {source.available ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Corresponding source for this build")}
                  </a>
                ) : (
                  <span className="what">
                    {interpolate(
                      t(
                        "The exact corresponding source is not available for this build: {reason}. See the NOTICE for how to obtain it.",
                      ),
                      { reason: source.reason },
                    )}
                  </span>
                )}
              </div>
              <div className="line">
                <a
                  href="https://github.com/georgmangold/console"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  georgmangold/console
                </a>
                <span className="what">{t("Console predecessor")}</span>
              </div>
              <p className="note">
                {t(
                  "Under section 13 of the AGPL, the corresponding source for this running version is offered to every user who interacts with it over a network, at no charge.",
                )}
              </p>
            </dd>

            <dt>{t("Copyright")}</dt>
            <dd>
              <p className="prose">
                {t("© 2026 Ruohang Feng / PGSTY and the SILO contributors.")}
                <br />
                {t("Portions © 2015–2026 MinIO, Inc.")}
                <br />
                {t("Console portions © Georg Mangold and contributors.")}
              </p>
              <p className="note">
                {interpolate(
                  t(
                    "Upstream copyright, authorship and license notices are retained in the repository's {credits} and {notice}. See the {attribution}.",
                  ),
                  {
                    credits: (
                      <a
                        href={LEGAL_DOCUMENT_PATHS.credits}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        CREDITS
                      </a>
                    ),
                    notice: (
                      <a
                        href={LEGAL_DOCUMENT_PATHS.notice}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        NOTICE
                      </a>
                    ),
                    attribution: (
                      <a
                        href={localize(
                          "https://silo.pgsty.com/about/attribution/",
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("full attribution stack")}
                      </a>
                    ),
                  },
                )}
              </p>
            </dd>

            <dt>{t("Trademark")}</dt>
            <dd>
              <p className="prose">
                {interpolate(
                  t(
                    "{minio} is a registered trademark of MinIO, Inc. {silo} is not a MinIO, Inc. product, and is not affiliated with, sponsored by, or endorsed by MinIO, Inc.",
                  ),
                  {
                    minio: (
                      <a
                        href={MINIO_SITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        MINIO®
                      </a>
                    ),
                    silo: (
                      <a
                        href={localize(SILO_SITE_URL)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        SILO
                      </a>
                    ),
                  },
                )}
              </p>
              <p className="note">
                {interpolate(
                  t(
                    "The MinIO name is used here solely to identify the origin of the source code and to describe compatibility — {notice}.",
                  ),
                  {
                    notice: (
                      <a
                        href={localize(
                          "https://silo.pgsty.com/about/trademark/",
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("trademark notice")}
                      </a>
                    ),
                  },
                )}
              </p>
            </dd>
          </LicenseRecord>
        </LicenseSheet>
      </PageLayout>
    </Fragment>
  );
};

export default License;
