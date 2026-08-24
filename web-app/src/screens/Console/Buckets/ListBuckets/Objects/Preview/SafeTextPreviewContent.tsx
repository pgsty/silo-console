// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";

interface SafeTextPreviewContentProps {
  content: string;
  label: string;
  isFullscreen?: boolean;
}

const SafeTextPreviewContent = ({
  content,
  label,
  isFullscreen = false,
}: SafeTextPreviewContentProps) => (
  <pre
    aria-label={label}
    className="textPreviewContent"
    data-testid="text-preview-content"
    tabIndex={0}
    style={{
      background: "transparent",
      border: "1px solid rgba(127, 127, 127, 0.35)",
      borderRadius: 5,
      boxSizing: "border-box",
      color: "inherit",
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
      fontSize: 13,
      lineHeight: 1.5,
      margin: 0,
      maxHeight: isFullscreen ? "calc(100vh - 230px)" : "min(60vh, 560px)",
      minHeight: 180,
      overflow: "auto",
      padding: 16,
      textAlign: "left",
      userSelect: "text",
      whiteSpace: "pre",
      width: "100%",
    }}
  >
    {content}
  </pre>
);

export default SafeTextPreviewContent;
