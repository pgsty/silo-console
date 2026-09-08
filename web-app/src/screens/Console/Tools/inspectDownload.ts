// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ErrorResponseHandler } from "../../../common/types";
import { downloadFilename } from "../Buckets/ListBuckets/Objects/downloadRequest";

export const inspectDownload = async (
  url: string,
  fallbackError: string,
  request: typeof fetch = fetch,
): Promise<{ blob: Blob; filename: string }> => {
  try {
    const response = await request(url, { method: "GET" });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw {
        errorMessage:
          typeof body?.message === "string" ? body.message : fallbackError,
        detailedError:
          typeof body?.detailedMessage === "string"
            ? body.detailedMessage
            : `HTTP ${response.status}`,
      } satisfies ErrorResponseHandler;
    }
    return {
      blob: await response.blob(),
      filename: downloadFilename(
        response.headers.get("content-disposition"),
        "inspect.zip",
      ),
    };
  } catch (error) {
    if (error && typeof error === "object" && "errorMessage" in error)
      throw error;
    throw {
      errorMessage: fallbackError,
      detailedError: error instanceof Error ? error.message : "",
    } satisfies ErrorResponseHandler;
  }
};
