// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { Fragment, useEffect, useRef, useState } from "react";
import { ProgressBar, Grid, Box, InformativeMessage } from "mds";
import get from "lodash/get";
import { AllowedPreviews, previewObjectType } from "../utils";
import { api } from "../../../../../../api";
import PreviewPDF from "./PreviewPDF";
import PreviewText from "./PreviewText";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import { AppState, useAppDispatch } from "../../../../../../store";
import { BucketObject } from "../../../../../../api/consoleApi";
import { useT } from "i18n";
import { useSelector } from "react-redux";

interface IPreviewFileProps {
  bucketName: string;
  actualInfo: BucketObject;
  isFullscreen?: boolean;
}

const PreviewFile = ({
  bucketName,
  actualInfo,
  isFullscreen = false,
}: IPreviewFileProps) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );

  const [loading, setLoading] = useState<boolean>(true);
  const objectName = actualInfo?.name || "";
  const versionID = actualInfo.version_id || undefined;
  const metadataIdentity = `${bucketName}\u0001${objectName}\u0001${
    versionID || ""
  }`;
  const metadataGeneration = useRef(0);
  const fallbackMetadata = actualInfo.content_type
    ? { "Content-Type": actualInfo.content_type }
    : {};
  const [metadataState, setMetadataState] = useState<{
    identity: string;
    data: Record<string, unknown>;
    loaded: boolean;
  }>({ identity: metadataIdentity, data: fallbackMetadata, loaded: false });

  useEffect(() => {
    const controller = new AbortController();
    const generation = metadataGeneration.current + 1;
    metadataGeneration.current = generation;

    setLoading(true);
    setMetadataState({
      identity: metadataIdentity,
      data: fallbackMetadata,
      loaded: false,
    });

    if (!bucketName || !objectName) {
      setMetadataState({
        identity: metadataIdentity,
        data: fallbackMetadata,
        loaded: true,
      });
      return () => {
        controller.abort();
        metadataGeneration.current += 1;
      };
    }

    api.buckets
      .getObjectMetadata(
        bucketName,
        {
          prefix: objectName,
          ...(versionID ? { versionID } : {}),
        },
        {
          headers: anonymousMode ? { "X-Anonymous": "1" } : undefined,
          signal: controller.signal,
        },
      )
      .then((res) => {
        if (
          !controller.signal.aborted &&
          metadataGeneration.current === generation
        ) {
          setMetadataState({
            identity: metadataIdentity,
            data: get(res.data, "objectMetadata", {}),
            loaded: true,
          });
        }
      })
      .catch(() => {
        if (
          !controller.signal.aborted &&
          metadataGeneration.current === generation
        ) {
          setMetadataState({
            identity: metadataIdentity,
            data: fallbackMetadata,
            loaded: true,
          });
        }
      });

    return () => {
      controller.abort();
      if (metadataGeneration.current === generation) {
        metadataGeneration.current += 1;
      }
    };
  }, [
    actualInfo.content_type,
    anonymousMode,
    bucketName,
    metadataIdentity,
    objectName,
    versionID,
  ]);

  const metaData =
    metadataState.identity === metadataIdentity
      ? metadataState.data
      : fallbackMetadata;
  const isMetaDataLoaded =
    metadataState.identity === metadataIdentity && metadataState.loaded;

  let path = "";

  if (actualInfo) {
    let basename = document.baseURI.replace(window.location.origin, "");
    path = `${window.location.origin}${basename}api/v1/buckets/${encodeURIComponent(bucketName)}/objects/download?preview=true&prefix=${encodeURIComponent(actualInfo.name || "")}`;
    if (actualInfo.version_id) {
      path = path.concat(`&version_id=${actualInfo.version_id}`);
    }
  }

  let objectType: AllowedPreviews = previewObjectType(metaData, objectName);

  const previewLoaded = () => {
    setLoading(false);
  };

  return (
    <Fragment>
      {objectType !== "none" && objectType !== "text" && loading && (
        <Grid item xs={12}>
          <ProgressBar />
        </Grid>
      )}
      {isMetaDataLoaded ? (
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          {objectType === "video" && (
            <video
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "calc(100vw - 100px)",
                maxHeight: "calc(100vh - 200px)",
              }}
              autoPlay={true}
              controls={true}
              muted={false}
              playsInline={true}
              onPlay={previewLoaded}
            >
              <source src={path} type="video/mp4" />
            </video>
          )}
          {objectType === "audio" && (
            <audio
              style={{
                width: "100%",
                height: "auto",
              }}
              autoPlay={true}
              controls={true}
              muted={false}
              playsInline={true}
              onPlay={previewLoaded}
            >
              <source src={path} type="audio/mpeg" />
            </audio>
          )}
          {objectType === "image" && (
            <img
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "100vw",
                maxHeight: "100vh",
              }}
              src={path}
              alt={t("preview")}
              onLoad={previewLoaded}
            />
          )}
          {objectType === "pdf" && (
            <Fragment>
              <PreviewPDF
                path={path}
                onLoad={previewLoaded}
                loading={loading}
                downloadFile={() => {
                  downloadObject(dispatch, bucketName, objectName, actualInfo);
                }}
              />
            </Fragment>
          )}
          {objectType === "text" && (
            <PreviewText
              key={metadataIdentity}
              actualInfo={actualInfo}
              bucketName={bucketName}
              isFullscreen={isFullscreen}
            />
          )}
          {objectType === "none" && (
            <div>
              <InformativeMessage
                message={t(
                  "File couldn't be previewed using file extension or mime type. Please try Download instead",
                )}
                title={t("Preview unavailable")}
                sx={{ margin: "15px 0" }}
              />
            </div>
          )}
        </Box>
      ) : null}
    </Fragment>
  );
};
export default PreviewFile;
