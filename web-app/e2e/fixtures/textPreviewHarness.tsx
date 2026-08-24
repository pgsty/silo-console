// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import { createRoot } from "react-dom/client";
import SafeTextPreviewContent from "../../src/screens/Console/Buckets/ListBuckets/Objects/Preview/SafeTextPreviewContent";

const payload = [
  '<script>window.__textPreviewExecuted = true; alert("script")</script>',
  '<img src="https://text-preview.invalid/image" onerror="window.__textPreviewExecuted = true">',
  '<iframe src="https://text-preview.invalid/frame"></iframe>',
  '<svg onload="window.__textPreviewExecuted = true"><image href="https://text-preview.invalid/svg" /></svg>',
  '<object data="https://text-preview.invalid/object"></object>',
  '<embed src="https://text-preview.invalid/embed">',
  '<?xml-stylesheet href="https://text-preview.invalid/style.xsl" type="text/xsl"?>',
  '<!DOCTYPE root [<!ENTITY ext SYSTEM "https://text-preview.invalid/entity">]>',
  '<root><![CDATA[<script>alert("cdata")</script>]]>&ext;</root>',
].join("\n");

Object.assign(window, {
  __textPreviewExecuted: false,
  __textPreviewPayload: payload,
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing test root");
}

createRoot(root).render(
  <SafeTextPreviewContent content={payload} label="Text preview content" />,
);
