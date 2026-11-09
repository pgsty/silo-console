// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import { Box, Button, PrometheusErrorIcon } from "mds";
import styled from "styled-components";
import { FeatureUnavailable, type } from "../../../../common/ui";
import { useNavigate } from "react-router-dom";
import { i18nKey, useLocalizedLink, useT } from "../../../../i18n";

const ConfigSnippet = styled.pre`
  ${type("body")}
  font-family: var(--font-mono);
  padding: var(--space-12);
  margin: var(--space-8) 0 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  background: var(--muted);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const docsUrl =
  "https://silo.pgsty.com/operations/monitoring/collect-minio-metrics-using-prometheus/";

const DangerNotice = styled.section`
  padding: 16px;
  border-radius: var(--radius-card);
  background: var(--muted);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  & h2 {
    ${type("title")}
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--foreground);
    margin: 0;
  }
  & h2 svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: var(--destructive-text);
  }
  & p {
    ${type("body")}
    margin: 0;
  }
  & a {
    color: var(--foreground);
    text-underline-offset: 4px;
  }
  & a:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
`;

const PrometheusGuidance = ({
  status,
  onRetry,
}: {
  status: "not configured" | "unavailable";
  onRetry: () => void;
}) => {
  const t = useT();
  const navigate = useNavigate();
  const localize = useLocalizedLink();

  if (status === "unavailable") {
    return (
      <DangerNotice role="alert">
        <h2>
          <PrometheusErrorIcon aria-hidden="true" />
          {t("Prometheus is configured but unreachable")}
        </h2>
        <p>
          {t(
            "Check the Prometheus address, network access and authentication, then retry.",
          )}
        </p>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <a href={localize(docsUrl)} target="_blank" rel="noreferrer">
            {t("Read the documentation")}
          </a>
          <Button id="retry-prometheus" label={t("Retry")} onClick={onRetry} />
        </Box>
      </DangerNotice>
    );
  }

  return (
    <FeatureUnavailable
      title={i18nKey("Advanced metrics need Prometheus")}
      description={i18nKey(
        "Configure Prometheus to collect SILO metrics, then set the URL for your deployment and restart the corresponding service.",
      )}
      docsUrl={docsUrl}
      framed
      docsLabel={t("Read the documentation")}
      action={
        <Button
          id="feature-go-to-buckets"
          variant="callAction"
          label={t("Go to Buckets")}
          onClick={() => navigate("/browser")}
        />
      }
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 760,
          textAlign: "start",
          display: "grid",
          gap: 16,
        }}
      >
        <div>
          <strong>{t("Standalone Console")}</strong>
          <ConfigSnippet>
            <code>{"CONSOLE_PROMETHEUS_URL=http://prometheus:9090"}</code>
          </ConfigSnippet>
        </div>
        <div>
          <strong>{t("Console embedded in SILO")}</strong>
          <ConfigSnippet>
            <code>{"MINIO_PROMETHEUS_URL=http://prometheus:9090"}</code>
          </ConfigSnippet>
        </div>
        {/* Exact names: api/consts.go, api/config.go. SILO forwards embedded
            settings in cmd/common-main.go using internal/config/constants.go. */}
        <div>
          <strong>{t("Optional standalone settings")}</strong>
          <ConfigSnippet>
            <code>{`CONSOLE_PROMETHEUS_JOB_ID=minio-job
CONSOLE_PROMETHEUS_EXTRA_LABELS=''`}</code>
          </ConfigSnippet>
          <Box sx={{ marginTop: 8 }}>
            {t("Bearer token: ")}
            <code>{"CONSOLE_PROMETHEUS_AUTH_TOKEN"}</code>
          </Box>
          <Box sx={{ marginTop: 4 }}>
            {t("Or basic authentication: ")}
            <code>{"CONSOLE_PROMETHEUS_AUTH_USERNAME"}</code>
            {" / "}
            <code>{"CONSOLE_PROMETHEUS_AUTH_PASSWORD"}</code>
          </Box>
        </div>
        <Box sx={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)" }}>
          {t("Embedded settings: ")}
          <code>{"MINIO_PROMETHEUS_JOB_ID"}</code>
          {", "}
          <code>{"MINIO_PROMETHEUS_EXTRA_LABELS"}</code>
          {", "}
          <code>{"MINIO_PROMETHEUS_AUTH_TOKEN"}</code>
        </Box>
      </Box>
    </FeatureUnavailable>
  );
};

export default PrometheusGuidance;
