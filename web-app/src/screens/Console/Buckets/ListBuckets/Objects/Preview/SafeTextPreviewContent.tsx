// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useMemo, useState } from "react";
import { List, RowComponentProps, useDynamicRowHeight } from "react-window";
import styled from "styled-components";
import { PreviewSurface, PreviewToolbar } from "./previewStyles";

interface SafeTextPreviewContentProps {
  content: string;
  label: string;
  wrapLabel: string;
  isFullscreen?: boolean;
}

const TextSurface = styled(PreviewSurface)<{ $wrap: boolean }>(({ $wrap }) => ({
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  lineHeight: "20px",
  "& .textPreviewLine": {
    display: "flex",
    minHeight: 20,
    minWidth: "100%",
    width: $wrap ? "100%" : "max-content",
  },
  "& .lineNumber": {
    flex: "0 0 7ch",
    textAlign: "end",
    paddingInlineEnd: 12,
    userSelect: "none",
    color: "var(--preview-secondary)",
    background: "var(--preview-surface)",
    borderInlineEnd: "1px solid var(--preview-border)",
  },
  "& pre": {
    margin: 0,
    padding: "0 12px",
    flex: 1,
    minWidth: 0,
    font: "inherit",
    whiteSpace: $wrap ? "pre-wrap" : "pre",
    overflowWrap: $wrap ? "anywhere" : "normal",
  },
}));

const TextLine = ({
  index,
  style,
  lines,
  ariaAttributes,
}: RowComponentProps<{ lines: string[] }>) => (
  <div className="textPreviewLine" style={style} {...ariaAttributes}>
    <span className="lineNumber" aria-hidden="true">
      {index + 1}
    </span>
    {/* React text nodes only: object content is never treated as markup. */}
    <pre data-text-line>{lines[index]}</pre>
  </div>
);

const SafeTextPreviewContent = ({
  content,
  label,
  wrapLabel,
  isFullscreen = false,
}: SafeTextPreviewContentProps) => {
  const [wrap, setWrap] = useState(true);
  // Retain the original line endings in text nodes, without normalizing CRLF.
  const lines = useMemo(
    () => content.match(/[^\n]*\n|[^\n]+$/g) || [""],
    [content],
  );
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 20,
    key: `${wrap}:${content}`,
  });
  return (
    <>
      <PreviewToolbar>
        <label>
          <input
            type="checkbox"
            checked={wrap}
            onChange={(event) => setWrap(event.target.checked)}
          />
          {wrapLabel}
        </label>
      </PreviewToolbar>
      <TextSurface $wrap={wrap} $fullscreen={isFullscreen}>
        {lines.length > 1000 ? (
          <List
            key={String(wrap)}
            aria-label={label}
            data-testid="text-preview-content"
            tabIndex={0}
            rowComponent={TextLine}
            rowCount={lines.length}
            rowHeight={wrap ? rowHeight : 20}
            rowProps={{ lines }}
            style={{
              height: isFullscreen ? "calc(100vh - 260px)" : "min(60vh, 560px)",
            }}
          />
        ) : (
          <div
            aria-label={label}
            role="list"
            data-testid="text-preview-content"
            tabIndex={0}
          >
            {lines.map((line, index) => (
              <TextLine
                key={index}
                index={index}
                lines={lines}
                style={{}}
                ariaAttributes={{
                  role: "listitem",
                  "aria-posinset": index + 1,
                  "aria-setsize": lines.length,
                }}
              />
            ))}
          </div>
        )}
      </TextSurface>
    </>
  );
};

export default SafeTextPreviewContent;
