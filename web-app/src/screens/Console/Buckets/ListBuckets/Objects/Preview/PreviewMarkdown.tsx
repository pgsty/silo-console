// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import { formatText, useT } from "i18n";
import { PreviewSurface } from "./previewStyles";
import {
  assertMarkdownSourceBudget,
  markdownTreeBudget,
} from "./markdownPreview";

const MarkdownSurface = styled(PreviewSurface)({
  padding: 24,
  overflowWrap: "anywhere",
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    lineHeight: 1.4,
    fontWeight: 600,
    margin: "24px 0 12px",
  },
  "& h1": { fontSize: 24 },
  "& h2": { fontSize: 20 },
  "& h3": { fontSize: 16 },
  "& > :first-child": { marginTop: 0 },
  "& p, & ul, & ol, & blockquote, & pre, & table": { margin: "0 0 16px" },
  "& li": { marginBottom: 4 },
  "&& li::before": { color: "var(--preview-secondary)" },
  "& pre, & code": {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 13,
    background: "var(--preview-surface)",
    borderRadius: 4,
  },
  "& code": { padding: "2px 4px" },
  "& pre": {
    padding: 16,
    overflow: "auto",
    border: "1px solid var(--preview-border)",
  },
  "& pre code": { padding: 0 },
  "& a": { color: "var(--preview-primary)", textDecoration: "underline" },
  "& blockquote": {
    marginInlineStart: 0,
    paddingInlineStart: 16,
    borderInlineStart: "4px solid var(--preview-border)",
    color: "var(--preview-secondary)",
  },
  "& table": {
    borderTop: "1px solid var(--preview-border)",
    borderInlineStart: "1px solid var(--preview-border)",
  },
});

const PreviewMarkdown = ({
  content,
  isFullscreen,
}: {
  content: string;
  isFullscreen: boolean;
}) => {
  const t = useT();
  assertMarkdownSourceBudget(content);
  return (
    <MarkdownSurface
      $fullscreen={isFullscreen}
      tabIndex={0}
      role="region"
      aria-label={t("Markdown preview content")}
    >
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm, markdownTreeBudget]}
        rehypePlugins={[markdownTreeBudget]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <a href={src} target="_blank" rel="noopener noreferrer">
              {formatText(t("Image: {alt}"), { alt: alt || t("Image") })}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </MarkdownSurface>
  );
};
export default PreviewMarkdown;
