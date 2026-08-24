// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { legacyPreviewObjectType, previewObjectType } from "./previewType";

interface AnonymousPreviewObject {
  content_type?: string;
  name?: string;
}

interface ResolveAnonymousPreviewOptions {
  object: AnonymousPreviewObject;
  loadMetadata: () => Promise<Record<string, unknown>>;
  isCurrent: () => boolean;
}

type AnonymousOpenDecision = "download" | "preview" | "stale";

export const resolveAnonymousOpen = async ({
  object,
  loadMetadata,
  isCurrent,
}: ResolveAnonymousPreviewOptions): Promise<AnonymousOpenDecision> => {
  const objectName = object.name || "";
  let metadata: Record<string, unknown> | null = object.content_type
    ? { "Content-Type": object.content_type }
    : null;

  if (legacyPreviewObjectType(metadata, objectName) !== "none") {
    return "download";
  }

  if (!object.content_type) {
    try {
      metadata = await loadMetadata();
    } catch {
      return isCurrent() ? "download" : "stale";
    }

    if (!isCurrent()) {
      return "stale";
    }
  }

  return previewObjectType(metadata, objectName) === "text"
    ? "preview"
    : "download";
};
