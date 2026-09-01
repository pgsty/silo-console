// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// The server injects the exact corresponding source of the running binary
// into index.html as <meta> tags (see api/legal.go). Reading them here lets
// the License page, the Login page and anonymous browsing offer that source
// to every remote user without an authenticated API call, as AGPL section 13
// requires. When the server could not claim an exact source, the status is
// "unavailable" and the UI says so instead of guessing.

interface SourceReference {
  available: boolean;
  url: string;
  reason: string;
  build: string;
}

type MetaReader = (name: string) => string | null;

export const REPOSITORY_URL = "https://github.com/pgsty/silo-console";

// Embedded legal documents are served next to the UI; relative paths follow
// <base href> and therefore work under a subpath deployment.
export const LEGAL_DOCUMENT_PATHS = {
  license: "legal/LICENSE",
  notice: "legal/NOTICE",
  credits: "legal/CREDITS",
} as const;

const isPublicHttpsURL = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname !== "" &&
      url.username === "" &&
      url.password === "" &&
      url.search === "" &&
      url.hash === ""
    );
  } catch {
    return false;
  }
};

// readSourceReference interprets the injected tags. A claim is accepted only
// when the status says so and the URL is a clean https URL; anything else is
// reported as unavailable with the server's reason when it gave one.
export const readSourceReference = (getMeta: MetaReader): SourceReference => {
  const status = getMeta("silo-console-source-status") ?? "";
  const url = getMeta("silo-console-source") ?? "";
  const reason = getMeta("silo-console-source-reason") ?? "";
  const build = getMeta("silo-console-build") ?? "";
  if (status === "available" && isPublicHttpsURL(url)) {
    return { available: true, url, reason: "", build };
  }
  return {
    available: false,
    url: "",
    reason:
      reason ||
      (status === ""
        ? "the server did not report its build metadata"
        : "the server could not determine an exact source"),
    build,
  };
};

const documentMetaReader: MetaReader = (name) =>
  typeof document === "undefined"
    ? null
    : (document
        .querySelector(`meta[name="${name}"]`)
        ?.getAttribute("content") ?? null);

let cached: SourceReference | null = null;

// sourceReference reads the document's tags once per page load.
export const sourceReference = (): SourceReference => {
  if (cached === null) {
    cached = readSourceReference(documentMetaReader);
  }
  return cached;
};
