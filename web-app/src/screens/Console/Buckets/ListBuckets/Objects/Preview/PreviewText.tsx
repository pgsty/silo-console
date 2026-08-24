// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Button, Grid, InformativeMessage, ProgressBar } from "mds";
import { useSelector } from "react-redux";
import { api } from "../../../../../../api";
import { BucketObject } from "../../../../../../api/consoleApi";
import { niceBytes } from "../../../../../../common/utils";
import { AppState, useAppDispatch } from "../../../../../../store";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import { useT } from "i18n";
import {
  loadTextPreview,
  PreviewRequestGeneration,
  requestTextPreviewObject,
  TextPreviewDownloadClient,
  TextPreviewResult,
} from "./textPreview";
import SafeTextPreviewContent from "./SafeTextPreviewContent";

interface PreviewTextProps {
  bucketName: string;
  actualInfo: BucketObject;
  isFullscreen?: boolean;
}

interface PreviewState {
  identity: string;
  result: TextPreviewResult | { status: "loading" };
}

const PreviewText = ({
  bucketName,
  actualInfo,
  isFullscreen = false,
}: PreviewTextProps) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );
  const objectName = actualInfo.name || "";
  const versionID = actualInfo.version_id || undefined;
  const knownSize = actualInfo.size;
  const identity = `${bucketName}\u0001${objectName}\u0001${versionID || ""}\u0001${
    knownSize === undefined ? "unknown" : knownSize
  }`;
  const requestGeneration = useRef(new PreviewRequestGeneration());
  const [retry, setRetry] = useState(0);
  const [knownSizeBypassIdentity, setKnownSizeBypassIdentity] = useState<
    string | null
  >(null);
  const [previewState, setPreviewState] = useState<PreviewState>({
    identity,
    result: { status: "loading" },
  });

  useEffect(() => {
    const controller = new AbortController();
    const generation = requestGeneration.current.begin();

    setPreviewState({ identity, result: { status: "loading" } });

    void loadTextPreview({
      knownSize: knownSizeBypassIdentity === identity ? undefined : knownSize,
      signal: controller.signal,
      request: () =>
        requestTextPreviewObject({
          client: api.buckets as unknown as TextPreviewDownloadClient,
          bucketName,
          objectName,
          versionID,
          anonymous: anonymousMode,
          signal: controller.signal,
        }),
    }).then((result) => {
      if (
        result.status !== "aborted" &&
        !controller.signal.aborted &&
        requestGeneration.current.isCurrent(generation)
      ) {
        setPreviewState({ identity, result });
      }
    });

    return () => {
      controller.abort();
      if (requestGeneration.current.isCurrent(generation)) {
        requestGeneration.current.invalidate();
      }
    };
  }, [
    anonymousMode,
    bucketName,
    identity,
    knownSize,
    knownSizeBypassIdentity,
    objectName,
    retry,
    versionID,
  ]);

  const downloadFile = useCallback(() => {
    downloadObject(dispatch, bucketName, objectName, actualInfo);
  }, [actualInfo, bucketName, dispatch, objectName]);

  const currentResult =
    previewState.identity === identity
      ? previewState.result
      : ({ status: "loading" } as const);

  const actionButtons = (allowRetry = false) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        marginTop: 12,
      }}
    >
      {allowRetry && (
        <Button
          id="retry-text-preview"
          onClick={() => {
            setKnownSizeBypassIdentity(identity);
            setRetry((value) => value + 1);
          }}
          variant="regular"
        >
          {t("Retry")}
        </Button>
      )}
      <Button
        id="download-text-preview"
        onClick={downloadFile}
        variant="callAction"
      >
        {t("Download File")}
      </Button>
    </Box>
  );

  if (currentResult.status === "loading") {
    return (
      <Grid aria-busy="true" aria-live="polite" item role="status" xs={12}>
        <ProgressBar />
        <Box sx={{ marginTop: 8 }}>{t("Loading text preview…")}</Box>
        {actionButtons()}
      </Grid>
    );
  }

  if (currentResult.status === "success") {
    return (
      <Fragment>
        <SafeTextPreviewContent
          content={currentResult.content}
          isFullscreen={isFullscreen}
          label={t("Text preview content")}
        />
        {actionButtons()}
      </Fragment>
    );
  }

  if (currentResult.status === "empty") {
    return (
      <InformativeMessage
        title={t("File is empty")}
        message={actionButtons()}
        sx={{ margin: "15px 0" }}
      />
    );
  }

  if (currentResult.status === "too_large") {
    const objectSize = currentResult.objectSize;
    const detail =
      objectSize === undefined
        ? t("The object is larger than the 1 MiB text preview limit.")
        : t(
            "Text previews are limited to 1 MiB (1,048,576 bytes). This object is {size} ({bytes} bytes).",
          )
            .replace("{size}", () => niceBytes(`${objectSize}`))
            .replace("{bytes}", () => objectSize.toLocaleString());

    return (
      <InformativeMessage
        title={t("Object is too large to preview")}
        message={
          <Fragment>
            {detail}
            {actionButtons(true)}
          </Fragment>
        }
        sx={{ margin: "15px 0" }}
        variant="warning"
      />
    );
  }

  if (currentResult.status === "invalid_text") {
    return (
      <InformativeMessage
        title={t("Invalid UTF-8 or binary content")}
        message={
          <Fragment>
            {t(
              "This object is not valid UTF-8 text or contains binary data. Download it to inspect the original bytes.",
            )}
            {actionButtons()}
          </Fragment>
        }
        sx={{ margin: "15px 0" }}
        variant="warning"
      />
    );
  }

  if (currentResult.status === "forbidden") {
    return (
      <InformativeMessage
        title={t("Text preview forbidden")}
        message={
          <Fragment>
            {t("You do not have permission to preview this object.")}
            {actionButtons()}
          </Fragment>
        }
        sx={{ margin: "15px 0" }}
        variant="error"
      />
    );
  }

  if (currentResult.status === "not_found") {
    return (
      <InformativeMessage
        title={t("Object not found or changed")}
        message={
          <Fragment>
            {t(
              "The object could not be found or changed while the preview was loading.",
            )}
            {actionButtons(true)}
          </Fragment>
        }
        sx={{ margin: "15px 0" }}
        variant="warning"
      />
    );
  }

  return (
    <InformativeMessage
      title={t("Text preview failed")}
      message={
        <Fragment>
          {t(
            "The text preview could not be loaded because of a network or server error.",
          )}
          {actionButtons(true)}
        </Fragment>
      }
      sx={{ margin: "15px 0" }}
      variant="error"
    />
  );
};

export default PreviewText;
