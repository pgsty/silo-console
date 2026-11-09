// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { useOverlayPending } from "common/ui/overlayIntent";
import { ContextMenu, ContextMenuPosition } from "common/ui/ContextMenu";
import { ModalPresence } from "common/ui/ModalPresence";
import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import get from "lodash/get";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  DeleteIcon,
  DownloadIcon,
  Grid,
  InspectMenuIcon,
  LegalHoldIcon,
  Loader,
  PreviewIcon,
  RetentionIcon,
  ShareIcon,
  SimpleHeader,
  TagsIcon,
  VersionsIcon,
} from "mds";
import { api } from "api";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import { BucketObject, BucketVersioningResponse } from "api/consoleApi";
import { previewObjectType } from "../utils";
import { objectActionState } from "../objectActionState";
import ObjectActions from "../ObjectActions";
import ObjectActionTooltip from "../ObjectActionTooltip";
import { isVersionedMode } from "../../../../../../utils/validationFunctions";
import {
  niceBytes,
  niceBytesInt,
  niceDaysInt,
} from "../../../../../../common/utils";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { AppState, useAppDispatch } from "../../../../../../store";
import {
  hasPermission,
  SecureComponent,
} from "../../../../../../common/SecureComponent";
import { selDistSet } from "../../../../../../systemSlice";
import {
  setLoadingObjectInfo,
  setLoadingVersions,
  setSelectedVersion,
  setVersionsModeEnabled,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import { displayFileIconName } from "./utils";
import PreviewFileModal from "../Preview/PreviewFileModal";
import ObjectMetaData from "../ObjectDetails/ObjectMetaData";
import ShareFile from "../ObjectDetails/ShareFile";
import SetRetention from "../ObjectDetails/SetRetention";
import DeleteObject from "../ListObjects/DeleteObject";
import SetLegalHoldModal from "../ObjectDetails/SetLegalHoldModal";
import TagsModal from "../ObjectDetails/TagsModal";
import InspectObject from "./InspectObject";
import RenameLongFileName from "../../../../ObjectBrowser/RenameLongFilename";
import { formatText, useT, useTN } from "i18n";
import {
  canDisplayObjectVersions,
  exactObjectVersions,
} from "../ObjectDetails/objectVersions";
import {
  deleteRequestVersion,
  ObjectLocation,
  ObjectTarget,
  RequestedObject,
  resolveObject,
  TaggedResult,
  targetKey,
  versionSelectorFromRedux,
} from "../objectIdentity";
import { isAbortError, ObjectRequestGuard } from "../requestGuard";
import { shareSubjectKey } from "../ObjectDetails/shareSubject";

interface IObjectDetailPanelProps {
  contextMenu?: ContextMenuPosition & {
    version: string;
    preview?: boolean;
    onVersions: () => void;
    onPreviewReady: () => void;
  };
  internalPaths: string;
  bucketName: string;
  versioningInfo: BucketVersioningResponse | null;
  locking: boolean | undefined;
  onClosePanel: (hardRefresh: boolean) => void;
  onDialogOpenChange?: (open: boolean) => void;
}

const ObjectDetailPanel = ({
  contextMenu,
  internalPaths,
  bucketName,
  versioningInfo,
  locking,
  onClosePanel,
  onDialogOpenChange,
}: IObjectDetailPanelProps) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const tn = useTN();

  const distributedSetup = useSelector(selDistSet);
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode,
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion,
  );
  const globalLoading = useSelector(
    (state: AppState) => state.objectBrowser.loadingObjectInfo,
  );

  const [localLoading, setLocalLoading] = useState(Boolean(contextMenu));
  const loadingObjectInfo = contextMenu ? localLoading : globalLoading;
  const refreshObject = () =>
    contextMenu ? setLocalLoading(true) : dispatch(setLoadingObjectInfo(true));
  const finishLoading = () =>
    contextMenu
      ? setLocalLoading(false)
      : dispatch(setLoadingObjectInfo(false));

  const objectMutationRevision = useSelector(
    (state: AppState) => state.objectBrowser.objectMutationRevision,
  );

  const versionsLimit = useSelector(
    (state: AppState) => state.objectBrowser.versionsLimit,
  );

  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [retentionModalOpen, setRetentionModalOpen] = useState<boolean>(false);
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [legalholdOpen, setLegalholdOpen] = useState<boolean>(false);
  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [longFileOpen, setLongFileOpen] = useState<boolean>(false);
  const dialogOpen =
    shareFileModalOpen ||
    retentionModalOpen ||
    tagModalOpen ||
    legalholdOpen ||
    inspectModalOpen ||
    deleteOpen ||
    previewOpen ||
    longFileOpen;
  useLayoutEffect(() => {
    onDialogOpenChange?.(dialogOpen);
    return () => onDialogOpenChange?.(false);
  }, [dialogOpen, onDialogOpenChange]);
  const [moreVersionsThanLimit, setMoreVersionsThanLimit] =
    useState<boolean>(false);
  // The listing this panel resolved its object from, tagged with the bucket
  // and key it was requested for. Everything displayed derives from it.
  const [listResult, setListResult] =
    useState<TaggedResult<BucketObject> | null>(null);
  const [metadataState, setMetadataState] = useState<{
    identity: string;
    data: Record<string, unknown> | null;
  }>({ identity: "", data: null });
  // Two independent request streams, two guards: a metadata request must not
  // be cancelled by a refreshed listing and vice versa.
  const listGuard = useRef(new ObjectRequestGuard<ObjectLocation>());
  const metadataGuard = useRef(new ObjectRequestGuard<ObjectTarget>());

  const allPathData = internalPaths.split("/");
  const currentItem = allPathData.pop() || "";

  const location = useMemo<ObjectLocation>(
    () => ({ bucket: bucketName, key: internalPaths }),
    [bucketName, internalPaths],
  );
  const requested = useMemo<RequestedObject>(
    () => ({
      ...location,
      version: versionSelectorFromRedux(
        contextMenu ? contextMenu.version : selectedVersion,
      ),
    }),
    [location, selectedVersion, contextMenu?.version],
  );
  // Derived synchronously on every render: the panel never holds an object
  // that does not belong to the requested bucket, key and version.
  const validated = useMemo(
    () => resolveObject(requested, listResult),
    [requested, listResult],
  );
  const explicitVersion = requested.version.kind === "id";
  const versions = useMemo(
    () => (listResult?.kind === "versions" ? listResult.items : []),
    [listResult],
  );
  const totalVersionsSize = useMemo(
    () =>
      versions.reduce((acc: number, currValue: BucketObject): number => {
        if (currValue?.size) {
          return acc + currValue.size;
        }
        return acc;
      }, 0),
    [versions],
  );
  const metadataTarget =
    validated && !validated.info.is_delete_marker ? validated.resolved : null;
  const metadataVersionParam = validated?.info.version_id;
  const currentTargetKey = validated ? targetKey(validated.resolved) : "";
  const metaData =
    currentTargetKey !== "" && metadataState.identity === currentTargetKey
      ? metadataState.data
      : null;

  useEffect(() => {
    const list = listGuard.current;
    const metadata = metadataGuard.current;
    return () => {
      list.invalidate();
      metadata.invalidate();
    };
  }, []);

  useEffect(() => {
    if (!loadingObjectInfo || internalPaths === "") {
      return;
    }
    const ticket = listGuard.current.begin(location);
    api.buckets
      .listObjects(
        bucketName,
        {
          prefix: internalPaths,
          with_versions: distributedSetup,
          limit: versionsLimit + 1,
        },
        { signal: ticket.signal },
      )
      .then((res) => {
        if (!ticket.isCurrent()) {
          return;
        }
        const result = exactObjectVersions(
          res.data.objects || [],
          internalPaths,
        );
        setMoreVersionsThanLimit(
          distributedSetup && result.length > versionsLimit,
        );
        setListResult({
          bucket: bucketName,
          key: internalPaths,
          kind: distributedSetup ? "versions" : "current",
          items: result.slice(0, versionsLimit),
        });
        finishLoading();
      })
      .catch((err) => {
        if (isAbortError(err) || !ticket.isCurrent()) {
          return;
        }
        console.error("Error loading object details", err.error);
        finishLoading();
      });
  }, [
    loadingObjectInfo,
    bucketName,
    internalPaths,
    location,
    dispatch,
    distributedSetup,
    versionsLimit,
    objectMutationRevision,
  ]);

  useEffect(() => {
    if (!metadataTarget) {
      return;
    }
    const guard = metadataGuard.current;
    const ticket = guard.begin(metadataTarget);
    const identity = targetKey(metadataTarget);

    setMetadataState({ identity, data: null });

    api.buckets
      .getObjectMetadata(
        metadataTarget.bucket,
        {
          prefix: metadataTarget.key,
          ...(metadataVersionParam ? { versionID: metadataVersionParam } : {}),
        },
        { signal: ticket.signal },
      )
      .then((res) => {
        if (!ticket.isCurrent()) {
          return;
        }
        setMetadataState({
          identity,
          data: get(res.data, "objectMetadata", {}),
        });
      })
      .catch((err) => {
        if (isAbortError(err) || !ticket.isCurrent()) {
          return;
        }
        setMetadataState({ identity, data: null });
      });

    return () => {
      guard.invalidate();
    };
  }, [metadataTarget, metadataVersionParam]);

  const openRetentionModal = () => {
    setRetentionModalOpen(true);
  };

  const closeRetentionModal = (updateInfo: boolean) => {
    setRetentionModalOpen(false);
    if (updateInfo) {
      refreshObject();
    }
  };

  const shareObject = () => {
    setShareFileModalOpen(true);
  };

  const closeShareModal = () => {
    setShareFileModalOpen(false);
  };

  const closeFileOpen = () => {
    setLongFileOpen(false);
  };

  const closeDeleteModal = (closeAndReload: boolean) => {
    setDeleteOpen(false);

    if (contextMenu) {
      onClosePanel(closeAndReload);
      return;
    }
    if (closeAndReload && !explicitVersion) {
      onClosePanel(true);
    } else {
      dispatch(setLoadingVersions(true));
      dispatch(setSelectedVersion(""));
      refreshObject();
    }
  };

  const closeAddTagModal = (reloadObjectData: boolean) => {
    setTagModalOpen(false);
    if (reloadObjectData) {
      refreshObject();
    }
  };

  const closeInspectModal = (reloadObjectData: boolean) => {
    setInspectModalOpen(false);
    if (reloadObjectData) {
      refreshObject();
    }
  };

  const closeLegalholdModal = (reload: boolean) => {
    setLegalholdOpen(false);
    if (reload) {
      refreshObject();
    }
  };

  const loaderForContainer = (
    <div style={{ textAlign: "center", marginTop: 35 }}>
      <Loader />
    </div>
  );

  const previewState = objectActionState({
    action: "preview",
    isDeleteMarker: !!validated?.info.is_delete_marker,
    explicitVersion,
    readVersion: explicitVersion,
    isPrefix: internalPaths.endsWith("/"),
    allowed: hasPermission(
      [bucketName, currentItem, `${bucketName}/${internalPaths}`],
      explicitVersion
        ? [IAM_SCOPES.S3_GET_OBJECT_VERSION, IAM_SCOPES.S3_GET_ACTIONS]
        : [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
    ),
    previewSupported: previewObjectType(metaData, currentItem) !== "none",
  });
  const previewOverlayPending = useOverlayPending();
  const previewRequested = useRef(false);
  useEffect(() => {
    if (
      !contextMenu?.preview ||
      previewRequested.current ||
      !validated ||
      !metaData
    )
      return;
    if (previewOverlayPending) {
      contextMenu.close("dismiss");
      return;
    }
    previewRequested.current = true;
    contextMenu.onPreviewReady();
    if (!previewState.disabled) setPreviewOpen(true);
  }, [
    contextMenu?.preview,
    validated,
    metaData,
    previewState.disabled,
    previewOverlayPending,
  ]);

  // Until the requested object resolves against a listing for this bucket and
  // key, nothing of a previous object is shown and no action is offered.
  if (!validated) {
    if (contextMenu)
      return (
        <ContextMenu
          {...contextMenu}
          label={t("Object actions")}
          items={[
            {
              label: loadingObjectInfo
                ? t("Loading…")
                : t("Object details unavailable"),
              action: () => {},
              state: { disabled: true },
            },
          ]}
        />
      );
    if (loadingObjectInfo) {
      return loaderForContainer;
    }

    return null;
  }

  const actualInfo = validated.info;
  const target = validated.resolved;
  const deleteVersion = deleteRequestVersion(validated) ?? "";

  let tagKeys: string[] = [];

  if (actualInfo.tags) {
    tagKeys = Object.keys(actualInfo.tags);
  }

  const objectNameArray = target.key.split("/");
  const objectName =
    objectNameArray.length > 0
      ? objectNameArray[objectNameArray.length - 1]
      : target.key;

  const objectResources = [
    bucketName,
    currentItem,
    [bucketName, target.key].join("/"),
  ];
  const canSetLegalHold = hasPermission(bucketName, [
    IAM_SCOPES.S3_PUT_OBJECT_LEGAL_HOLD,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);
  const canSetTags = hasPermission(objectResources, [
    IAM_SCOPES.S3_PUT_OBJECT_TAGGING,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  const canChangeRetention = hasPermission(
    objectResources,
    [
      IAM_SCOPES.S3_GET_OBJECT_RETENTION,
      IAM_SCOPES.S3_PUT_OBJECT_RETENTION,
      IAM_SCOPES.S3_GET_ACTIONS,
      IAM_SCOPES.S3_PUT_ACTIONS,
    ],
    true,
  );
  const canInspect = hasPermission(objectResources, [
    IAM_SCOPES.ADMIN_INSPECT_DATA,
  ]);
  const canChangeVersioning = hasPermission(objectResources, [
    IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
    IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
    IAM_SCOPES.S3_GET_OBJECT_VERSION,
    IAM_SCOPES.S3_GET_ACTIONS,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);
  const canGetObject = hasPermission(objectResources, [
    IAM_SCOPES.S3_GET_OBJECT,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);
  const canDelete = hasPermission(
    [bucketName, currentItem, [bucketName, target.key].join("/")],
    [IAM_SCOPES.S3_DELETE_OBJECT, IAM_SCOPES.S3_DELETE_ACTIONS],
  );
  const versionsAvailable = canDisplayObjectVersions({
    currentVersionID: actualInfo.version_id,
    distributedSetup,
    exactVersionCount: versions.length,
    versioningStatus: versioningInfo?.status,
  });

  const actionContext = {
    isDeleteMarker: !!actualInfo.is_delete_marker,
    explicitVersion,
    locking: !!locking,
    distributedSetup,
  };
  const deleteState = objectActionState({
    ...actionContext,
    action: "delete",
    allowed: canDelete,
  });
  const multiActionButtons = [
    {
      action: () =>
        downloadObject(dispatch, bucketName, target.key, actualInfo),
      label: t("Download"),
      state: objectActionState({
        ...actionContext,
        action: "download",
        allowed: canGetObject,
      }),
      icon: <DownloadIcon />,
      tooltip: t("Download this Object"),
    },
    {
      action: shareObject,
      label: t("Share"),
      state: objectActionState({
        ...actionContext,
        action: "share",
        allowed: canGetObject,
      }),
      icon: <ShareIcon />,
      tooltip: t("Share this File"),
    },
    {
      action: () => setPreviewOpen(true),
      label: t("Preview"),
      state: previewState,
      icon: <PreviewIcon />,
      tooltip: t("Preview this File"),
    },
    {
      action: () => setLegalholdOpen(true),
      label: t("Legal Hold"),
      state: objectActionState({
        ...actionContext,
        action: "legalHold",
        allowed: canSetLegalHold,
      }),
      icon: <LegalHoldIcon />,
      tooltip: t("Change Legal Hold rules for this File"),
    },
    {
      action: openRetentionModal,
      label: t("Retention"),
      state: objectActionState({
        ...actionContext,
        action: "retention",
        allowed: canChangeRetention,
      }),
      icon: <RetentionIcon />,
      tooltip: t("Change Retention rules for this File"),
    },
    {
      action: () => setTagModalOpen(true),
      label: t("Tags"),
      state: objectActionState({
        ...actionContext,
        action: "tags",
        allowed: canSetTags,
      }),
      icon: <TagsIcon />,
      tooltip: t("Change Tags for this File"),
    },
    {
      action: () => setInspectModalOpen(true),
      label: t("Inspect"),
      state: objectActionState({
        ...actionContext,
        action: "inspect",
        allowed: canInspect,
      }),
      icon: <InspectMenuIcon />,
      tooltip: t("Inspect this file"),
    },
    {
      action: () =>
        contextMenu
          ? contextMenu.onVersions()
          : dispatch(
              setVersionsModeEnabled({ status: !versionsMode, objectName }),
            ),
      label:
        !contextMenu && versionsMode
          ? t("Hide Object Versions")
          : t("Display Object Versions"),
      state: objectActionState({
        action: "versions",
        allowed: canChangeVersioning,
        versionsAvailable,
        versioningEnabled: isVersionedMode(versioningInfo?.status),
      }),
      icon: <VersionsIcon />,
      tooltip: t("Display Versions for this file"),
    },
  ];

  const calculateLastModifyTime = (lastModified: string) => {
    const currentTime = new Date();
    const modifiedTime = new Date(lastModified);

    const difTime = currentTime.getTime() - modifiedTime.getTime();

    const formatTime = niceDaysInt(difTime, "ms");

    return formatTime.trim() !== ""
      ? t("{time} ago").replace("{time}", () => formatTime)
      : t("Just now");
  };

  return (
    <Fragment>
      <ModalPresence open={Boolean(shareFileModalOpen)}>
        {shareFileModalOpen && (
          <ShareFile
            key={shareSubjectKey(target)}
            open={shareFileModalOpen}
            closeModalAndRefresh={closeShareModal}
            subject={target}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(retentionModalOpen)}>
        {retentionModalOpen && (
          <SetRetention
            open={retentionModalOpen}
            closeModalAndRefresh={closeRetentionModal}
            target={target}
            objectInfo={actualInfo}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(deleteOpen)}>
        {deleteOpen && (
          <DeleteObject
            deleteOpen={deleteOpen}
            selectedBucket={bucketName}
            selectedObject={target.key}
            closeDeleteModalAndRefresh={closeDeleteModal}
            versioningInfo={
              distributedSetup ? (versioningInfo ?? undefined) : undefined
            }
            selectedVersion={deleteVersion}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(legalholdOpen)}>
        {legalholdOpen && (
          <SetLegalHoldModal
            open={legalholdOpen}
            closeModalAndRefresh={closeLegalholdModal}
            target={target}
            actualInfo={actualInfo}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(previewOpen)}>
        {previewOpen && (
          <PreviewFileModal
            open={previewOpen}
            bucketName={bucketName}
            actualInfo={actualInfo}
            onClosePreview={() => {
              setPreviewOpen(false);
            }}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(tagModalOpen)}>
        {tagModalOpen && (
          <TagsModal
            modalOpen={tagModalOpen}
            target={target}
            actualInfo={actualInfo}
            onCloseAndUpdate={closeAddTagModal}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(inspectModalOpen)}>
        {inspectModalOpen && (
          <InspectObject
            inspectOpen={inspectModalOpen}
            volumeName={bucketName}
            inspectPath={target.key}
            closeInspectModalAndRefresh={closeInspectModal}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(longFileOpen)}>
        {longFileOpen && (
          <RenameLongFileName
            open={longFileOpen}
            closeModal={closeFileOpen}
            currentItem={currentItem}
            bucketName={bucketName}
            internalPaths={target.key}
            actualInfo={actualInfo}
          />
        )}
      </ModalPresence>

      {contextMenu ? (
        <ContextMenu
          {...contextMenu}
          label={t("Object actions")}
          items={[
            ...multiActionButtons,
            {
              label: explicitVersion ? t("Delete version") : t("Delete"),
              action: () => setDeleteOpen(true),
              state: deleteState,
              icon: <DeleteIcon />,
              danger: true,
            },
          ]}
        />
      ) : loadingObjectInfo ? (
        <Fragment>{loaderForContainer}</Fragment>
      ) : (
        <Box
          sx={{
            "& .simpleHeader-container": {
              margin: "24px 0 16px",
              paddingBottom: 8,
              fontSize: "var(--fs-subtitle)",
              fontWeight: 550,
            },
            "& .ObjectDetailsTitle": {
              display: "flex",
              alignItems: "center",
              "& .min-icon": {
                width: 20,
                height: 20,
                minWidth: 20,
                minHeight: 20,
                color: "var(--muted-foreground)",
              },
            },
            "& .objectNameContainer": {
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              alignItems: "center",
              marginInlineStart: 8,
            },
            "& .capitalizeFirst": {
              textTransform: "capitalize",
            },
            "& .detailContainer": {
              padding: 0,
              marginBottom: 16,
              fontSize: "var(--fs-body)",
              lineHeight: "var(--lh-body)",
              "& strong": { color: "var(--muted-foreground)", fontWeight: 550 },
            },
          }}
        >
          <ObjectActions
            title={
              <div className={"ObjectDetailsTitle"}>
                {displayFileIconName(objectName || "", true)}
                <span className={"objectNameContainer"}>
                  <bdi dir="ltr">{objectName}</bdi>
                </span>
              </div>
            }
            items={multiActionButtons}
          />
          <Grid
            item
            xs={12}
            sx={{
              justifyContent: "center",
              display: "flex",
              padding: 0,
              "& > span": { width: "100%" },
              "& > span > span": { width: "100%" },
            }}
          >
            <ObjectActionTooltip
              state={deleteState}
              label={explicitVersion ? t("Delete version") : t("Delete")}
            >
              <Button
                id="delete-element-click"
                icon={<DeleteIcon />}
                iconLocation="start"
                fullWidth
                collapseOnSmall={false}
                variant="danger"
                onClick={() => setDeleteOpen(true)}
                disabled={deleteState.disabled}
                sx={{ margin: "8px 0" }}
                label={explicitVersion ? t("Delete version") : t("Delete")}
              />
            </ObjectActionTooltip>
          </Grid>
          <SimpleHeader label={t("Object Info")} />
          <Box className={"detailContainer"}>
            <strong>{t("Name:")}</strong>
            <br />
            <div style={{ overflowWrap: "break-word" }}>
              <bdi dir="ltr">{objectName}</bdi>
            </div>
          </Box>
          {explicitVersion && (
            <Box className={"detailContainer"}>
              <strong>{t("Version ID:")}</strong>
              <br />
              {target.versionId}
            </Box>
          )}
          <Box className={"detailContainer"}>
            <strong>{t("Size:")}</strong>
            <br />
            {niceBytes(`${actualInfo.size || "0"}`)}
          </Box>
          {versionsAvailable && !explicitVersion && (
            <Box className={"detailContainer"}>
              <strong>{t("Versions:")}</strong>
              <br />
              {tn(
                versions.length,
                "{count} version, {size}",
                "{count} versions, {size}",
                {
                  count: `${versions.length}${
                    moreVersionsThanLimit ? "+" : ""
                  }`,
                  size: `${niceBytesInt(totalVersionsSize)}${
                    moreVersionsThanLimit ? "+" : ""
                  }`,
                },
              )}
            </Box>
          )}
          {!explicitVersion && (
            <Box className={"detailContainer"}>
              <strong>{t("Last Modified:")}</strong>
              <br />
              {calculateLastModifyTime(actualInfo.last_modified || "")}
            </Box>
          )}
          <Box className={"detailContainer"}>
            <strong>{t("ETAG:")}</strong>
            <br />
            {actualInfo.etag || "N/A"}
          </Box>
          <Box className={"detailContainer"}>
            <strong>{t("Tags:")}</strong>
            <br />
            {tagKeys.length === 0
              ? "N/A"
              : tagKeys.map((tagKey: string, index: number) => {
                  return (
                    <span key={`key-vs-${index.toString()}`}>
                      {tagKey}:{get(actualInfo.tags, `${tagKey}`, "")}
                      {index < tagKeys.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
          </Box>
          <Box className={"detailContainer"}>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_GET_OBJECT_LEGAL_HOLD,
                IAM_SCOPES.S3_GET_ACTIONS,
              ]}
              resource={bucketName}
            >
              <Fragment>
                <strong>{t("Legal Hold:")}</strong>
                <br />
                {actualInfo.legal_hold_status ? t("On") : t("Off")}
              </Fragment>
            </SecureComponent>
          </Box>
          <Box className={"detailContainer"}>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_GET_OBJECT_RETENTION,
                IAM_SCOPES.S3_GET_ACTIONS,
              ]}
              resource={bucketName}
            >
              <Fragment>
                <strong>{t("Retention Policy:")}</strong>
                <br />
                <span className={"capitalizeFirst"}>
                  {actualInfo.retention_mode
                    ? actualInfo.retention_mode.toLowerCase()
                    : t("None")}
                </span>
              </Fragment>
            </SecureComponent>
          </Box>
          {!actualInfo.is_delete_marker && (
            <Fragment>
              <SimpleHeader label={t("Metadata")} />
              <Box className={"detailContainer"}>
                {metaData ? <ObjectMetaData metaData={metaData} /> : null}
              </Box>
            </Fragment>
          )}
        </Box>
      )}
    </Fragment>
  );
};

export default ObjectDetailPanel;
