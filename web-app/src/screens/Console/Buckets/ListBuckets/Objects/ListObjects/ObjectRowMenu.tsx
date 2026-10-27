// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  DeleteIcon,
  DownloadIcon,
  ShareIcon,
  PreviewIcon,
  LegalHoldIcon,
  RetentionIcon,
  TagsIcon,
  InspectMenuIcon,
  VersionsIcon,
  AccessRuleIcon,
} from "mds";
import {
  ContextMenu,
  ContextMenuPosition,
  ContextAction,
} from "common/ui/ContextMenu";
import { ModalPresence } from "common/ui/ModalPresence";
import { AppState, store, useAppDispatch } from "store";
import { useT } from "i18n";
import { hasPermission } from "common/SecureComponent";
import { IAM_SCOPES } from "common/SecureComponent/permissions";
import { objectActionState } from "../objectActionState";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import ObjectDetailPanel from "./ObjectDetailPanel";
const DeleteMultipleObjects = React.lazy(
  () => import("./DeleteMultipleObjects"),
);
import AddAccessRule from "../../../BucketDetails/AddAccessRule";
import { captureTaskSession } from "../../../../ObjectBrowser/transferManager";
import { invalidateMutationView } from "../../../../ObjectBrowser/objectBrowserSlice";
import { api } from "api";
import { resolveAnonymousOpen } from "../Preview/anonymousPreview";
import { BucketObjectItem } from "./types";

export function ObjectRowMenu({
  object,
  bucket,
  position,
  preview,
  onVersions,
  onPreviewReady,
  onAnonymousPreview,
  onCalculateSize,
}: {
  object: BucketObjectItem;
  bucket: string;
  position: ContextMenuPosition;
  preview?: boolean;
  onVersions: () => void;
  onPreviewReady: () => void;
  onAnonymousPreview: () => void;
  onCalculateSize?: (prefix: string) => void;
}) {
  const t = useT();
  const dispatch = useAppDispatch();
  const versioning = useSelector(
    (state: AppState) => state.objectBrowser.versionInfo,
  );
  const locking = useSelector(
    (state: AppState) => state.objectBrowser.lockingEnabled,
  );
  const rewind = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const currentSession = useRef(captureTaskSession());
  const requestedVersion = useRef(
    rewind ? object.version_id || "" : "",
  ).current;
  const anonymous = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );
  if (anonymous)
    return (
      <AnonymousObjectMenu
        object={object}
        bucket={bucket}
        position={position}
        preview={preview}
        onPreview={onAnonymousPreview}
      />
    );
  if (!object.name.endsWith("/"))
    return (
      <ObjectDetailPanel
        internalPaths={object.name}
        bucketName={bucket}
        locking={locking}
        versioningInfo={versioning}
        onClosePanel={(refresh) => {
          if (!refresh || !currentSession.current()) return;
          const view = store.getState().objectBrowser;
          const prefix = object.name.slice(0, object.name.lastIndexOf("/") + 1);
          if (
            view.selectedBucket !== bucket ||
            (view.selectedInternalPaths
              ? view.selectedInternalPaths !== object.name ||
                view.selectedVersion !== requestedVersion
              : view.simplePath !== prefix)
          )
            return;
          dispatch(
            invalidateMutationView({
              kind: "delete",
              targets: [
                {
                  bucket,
                  key: object.name,
                  versionId: requestedVersion || undefined,
                  status: "done",
                },
              ],
            }),
          );
        }}
        contextMenu={{
          ...position,
          preview,
          version: requestedVersion,
          onVersions,
          onPreviewReady,
        }}
      />
    );
  // A prefix is a grouping, never a fabricated concrete object version.
  const resource = [bucket, `${bucket}/${object.name}`];
  const items: ContextAction[] = [
    ...(onCalculateSize && !rewind
      ? [
          {
            label: t("Calculate size"),
            icon: <InspectMenuIcon />,
            action: () => onCalculateSize(object.name),
            state: { disabled: false },
          },
        ]
      : []),
    {
      label: t("Download"),
      icon: <DownloadIcon />,
      action: () => downloadObject(dispatch, bucket, object.name, object),
      state: objectActionState({
        action: "download",
        allowed: hasPermission(resource, [
          IAM_SCOPES.S3_GET_OBJECT,
          IAM_SCOPES.S3_GET_ACTIONS,
        ]),
      }),
    },
    ...[
      { label: t("Share"), icon: <ShareIcon /> },
      { label: t("Preview"), icon: <PreviewIcon /> },
      { label: t("Legal Hold"), icon: <LegalHoldIcon /> },
      { label: t("Retention"), icon: <RetentionIcon /> },
      { label: t("Tags"), icon: <TagsIcon /> },
      { label: t("Inspect"), icon: <InspectMenuIcon /> },
      { label: t("Display Object Versions"), icon: <VersionsIcon /> },
    ].map((item) => ({
      ...item,
      action: () => {},
      state: {
        disabled: true,
        reason: t("Select a file instead of a folder."),
      },
    })),
    {
      label: t("Anonymous Access"),
      icon: <AccessRuleIcon />,
      action: () => setAccessOpen(true),
      state: objectActionState({
        action: "anonymousAccess",
        isPrefix: true,
        allowed: hasPermission(bucket, [
          IAM_SCOPES.S3_GET_BUCKET_POLICY,
          IAM_SCOPES.S3_PUT_BUCKET_POLICY,
          IAM_SCOPES.S3_GET_ACTIONS,
          IAM_SCOPES.S3_PUT_ACTIONS,
        ]),
      }),
    },
    {
      label: t("Delete"),
      icon: <DeleteIcon />,
      danger: true,
      action: () => setDeleteOpen(true),
      state: objectActionState({
        action: "delete",
        allowed: hasPermission(resource, [
          IAM_SCOPES.S3_DELETE_OBJECT,
          IAM_SCOPES.S3_DELETE_ACTIONS,
        ]),
      }),
    },
  ];
  return (
    <>
      <ContextMenu {...position} label={t("Object actions")} items={items} />
      <ModalPresence open={deleteOpen}>
        {deleteOpen && (
          <Suspense fallback={null}>
            <DeleteMultipleObjects
              deleteOpen
              selectedBucket={bucket}
              selectedObjects={[object.name]}
              versioning={versioning}
              closeDeleteModalAndRefresh={() => setDeleteOpen(false)}
            />
          </Suspense>
        )}
      </ModalPresence>
      <ModalPresence open={accessOpen}>
        {accessOpen && (
          <AddAccessRule
            modalOpen
            bucket={bucket}
            prefilledRoute={`${object.name}*`}
            onClose={() => setAccessOpen(false)}
          />
        )}
      </ModalPresence>
    </>
  );
}

function AnonymousObjectMenu({
  object,
  bucket,
  position,
  preview,
  onPreview,
}: {
  object: BucketObjectItem;
  bucket: string;
  position: ContextMenuPosition;
  preview?: boolean;
  onPreview: () => void;
}) {
  const t = useT();
  const dispatch = useAppDispatch();
  const [canPreview, setCanPreview] = useState(false);
  useEffect(() => {
    if (object.name.endsWith("/")) return;
    const controller = new AbortController();
    const current = captureTaskSession();
    void resolveAnonymousOpen({
      object,
      isCurrent: () => current() && !controller.signal.aborted,
      loadMetadata: async () =>
        (
          await api.buckets.getObjectMetadata(
            bucket,
            {
              prefix: object.name,
              ...(object.version_id ? { versionID: object.version_id } : {}),
            },
            { signal: controller.signal, headers: { "X-Anonymous": "1" } },
          )
        ).data.objectMetadata || {},
    }).then((decision) => {
      if (!current() || controller.signal.aborted) return;
      setCanPreview(decision === "preview");
      if (preview && decision === "preview") onPreview();
    });
    return () => controller.abort();
  }, [object, bucket]);
  return (
    <ContextMenu
      {...position}
      label={t("Object actions")}
      items={[
        {
          label: t("Download"),
          icon: <DownloadIcon />,
          action: () => downloadObject(dispatch, bucket, object.name, object),
          state: { disabled: false },
        },
        {
          label: t("Preview"),
          icon: <PreviewIcon />,
          action: onPreview,
          state: {
            disabled: !canPreview,
            reason: !canPreview
              ? t("Preview is not available for this file type.")
              : undefined,
          },
        },
      ]}
    />
  );
}
