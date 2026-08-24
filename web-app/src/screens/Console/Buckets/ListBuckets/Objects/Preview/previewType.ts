// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

export type AllowedPreviews =
  | "image"
  | "pdf"
  | "audio"
  | "video"
  | "text"
  | "none";

type LegacyPreview = Exclude<AllowedPreviews, "text">;

const textExtensions = new Set(["log", "txt", "json", "xml"]);
const activeDocumentExtensions = new Set(["html", "htm", "xhtml"]);
const textMimeTypes = new Set([
  "text/plain",
  "application/json",
  "application/xml",
  "text/xml",
]);

const metadataContentType = (
  metaData: Record<string, unknown> | null | undefined,
): string => ((metaData && metaData["Content-Type"]) || "").toString();

const finalExtension = (fileName: string): string => {
  const finalName = fileName.split("/").pop() || "";
  const lastDot = finalName.lastIndexOf(".");

  if (lastDot === -1 || lastDot === finalName.length - 1) {
    return "";
  }

  return finalName.slice(lastDot + 1).toLowerCase();
};

// These two legacy classifiers intentionally retain their prior matching
// rules. Text is considered only after their combined result is "none".
const legacyContentTypePreview = (contentType: string): LegacyPreview => {
  if (contentType) {
    const mimeObjectType = (contentType || "").toLowerCase();

    if (mimeObjectType.includes("image")) {
      return "image";
    }
    if (mimeObjectType.includes("pdf")) {
      return "pdf";
    }
    if (mimeObjectType.includes("audio")) {
      return "audio";
    }
    if (mimeObjectType.includes("video")) {
      return "video";
    }
  }

  return "none";
};

const legacyExtensionPreview = (fileName: string): LegacyPreview => {
  const imageExtensions = [
    "jif",
    "jfif",
    "apng",
    "avif",
    "svg",
    "webp",
    "bmp",
    "ico",
    "jpg",
    "jpe",
    "jpeg",
    "gif",
    "png",
    "heic",
  ];
  const pdfExtensions = ["pdf"];
  const audioExtensions = ["wav", "mp3", "alac", "aiff", "dsd", "pcm"];
  const videoExtensions = [
    "mp4",
    "avi",
    "mpg",
    "webm",
    "mov",
    "flv",
    "mkv",
    "wmv",
    "avchd",
    "mpeg-4",
  ];

  let fileExtension = fileName.split(".").pop();

  if (!fileExtension) {
    return "none";
  }

  fileExtension = fileExtension.toLowerCase();

  if (imageExtensions.includes(fileExtension)) {
    return "image";
  }

  if (pdfExtensions.includes(fileExtension)) {
    return "pdf";
  }

  if (audioExtensions.includes(fileExtension)) {
    return "audio";
  }

  if (videoExtensions.includes(fileExtension)) {
    return "video";
  }

  return "none";
};

export const legacyPreviewObjectType = (
  metaData: Record<string, unknown> | null | undefined,
  objectName: string,
): LegacyPreview => {
  const extensionType = legacyExtensionPreview(objectName || "");
  const contentType = legacyContentTypePreview(metadataContentType(metaData));

  let objectType: LegacyPreview = extensionType;

  if (extensionType === contentType) {
    objectType = extensionType;
  } else if (extensionType === "none" && contentType !== "none") {
    objectType = contentType;
  } else if (contentType === "none" && extensionType !== "none") {
    objectType = extensionType;
  }

  return objectType;
};

const normalizedTextContentType = (contentType: string): string =>
  contentType.split(";", 1)[0].trim().toLowerCase();

export const previewObjectType = (
  metaData: Record<string, unknown> | null | undefined,
  objectName: string,
): AllowedPreviews => {
  const legacyType = legacyPreviewObjectType(metaData, objectName);

  if (legacyType !== "none") {
    return legacyType;
  }

  const extension = finalExtension(objectName || "");

  if (activeDocumentExtensions.has(extension)) {
    return "none";
  }

  if (textExtensions.has(extension)) {
    return "text";
  }

  return textMimeTypes.has(
    normalizedTextContentType(metadataContentType(metaData)),
  )
    ? "text"
    : "none";
};

interface PreviewEligibility {
  metaData: Record<string, unknown> | null | undefined;
  objectName: string;
  canGetObject: boolean;
  isDeleteMarker?: boolean;
  isPrefix?: boolean;
}

export const isPreviewAvailable = ({
  metaData,
  objectName,
  canGetObject,
  isDeleteMarker = false,
  isPrefix = objectName.endsWith("/"),
}: PreviewEligibility): boolean =>
  canGetObject &&
  !isDeleteMarker &&
  !isPrefix &&
  previewObjectType(metaData, objectName) !== "none";
