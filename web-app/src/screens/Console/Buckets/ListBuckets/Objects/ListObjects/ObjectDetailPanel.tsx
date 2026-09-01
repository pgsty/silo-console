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

import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import get from "lodash/get";
import { useSelector } from "react-redux";
import {
  ActionsList,
  Box,
  Button,
  DeleteIcon,
  DownloadIcon,
  Grid,
  InspectMenuIcon,
  LegalHoldIcon,
  Loader,
  MetadataIcon,
  ObjectInfoIcon,
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
import { isPreviewAvailable } from "../utils";
import {
  niceBytes,
  niceBytesInt,
  niceDaysInt,
} from "../../../../../../common/utils";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
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
import TooltipWrapper from "../../../../Common/TooltipWrapper/TooltipWrapper";
import { formatText, useT } from "i18n";
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
  internalPaths: string;
  bucketName: string;
  versioningInfo: BucketVersioningResponse;
  locking: boolean | undefined;
  onClosePanel: (hardRefresh: boolean) => void;
}

const ObjectDetailPanel = ({
  internalPaths,
  bucketName,
  versioningInfo,
  locking,
  onClosePanel,
}: IObjectDetailPanelProps) => {
  const dispatch = useAppDispatch();
  const t = useT();

  const distributedSetup = useSelector(selDistSet);
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode,
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion,
  );
  const loadingObjectInfo = useSelector(
    (state: AppState) => state.objectBrowser.loadingObjectInfo,
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
    () => ({ ...location, version: versionSelectorFromRedux(selectedVersion) }),
    [location, selectedVersion],
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
        dispatch(setLoadingObjectInfo(false));
      })
      .catch((err) => {
        if (isAbortError(err) || !ticket.isCurrent()) {
          return;
        }
        console.error("Error loading object details", err.error);
        dispatch(setLoadingObjectInfo(false));
      });
  }, [
    loadingObjectInfo,
    bucketName,
    internalPaths,
    location,
    dispatch,
    distributedSetup,
    versionsLimit,
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
      dispatch(setLoadingObjectInfo(true));
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

    if (closeAndReload && !explicitVersion) {
      onClosePanel(true);
    } else {
      dispatch(setLoadingVersions(true));
      dispatch(setSelectedVersion(""));
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeAddTagModal = (reloadObjectData: boolean) => {
    setTagModalOpen(false);
    if (reloadObjectData) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeInspectModal = (reloadObjectData: boolean) => {
    setInspectModalOpen(false);
    if (reloadObjectData) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeLegalholdModal = (reload: boolean) => {
    setLegalholdOpen(false);
    if (reload) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const loaderForContainer = (
    <div style={{ textAlign: "center", marginTop: 35 }}>
      <Loader />
    </div>
  );

  // Until the requested object resolves against a listing for this bucket and
  // key, nothing of a previous object is shown and no action is offered.
  if (!validated) {
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
  const previewPermissionScopes = explicitVersion
    ? [IAM_SCOPES.S3_GET_OBJECT_VERSION, IAM_SCOPES.S3_GET_ACTIONS]
    : [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS];
  const canReadPreviewObject = !explicitVersion
    ? canGetObject
    : hasPermission(objectResources, previewPermissionScopes);
  const canDelete = hasPermission(
    [bucketName, currentItem, [bucketName, target.key].join("/")],
    [IAM_SCOPES.S3_DELETE_OBJECT, IAM_SCOPES.S3_DELETE_ACTIONS],
  );
  const versionsAvailable = canDisplayObjectVersions({
    currentVersionID: actualInfo.version_id,
    distributedSetup,
    exactVersionCount: versions.length,
    versioningStatus: versioningInfo.status,
  });

  const previewAvailable = isPreviewAvailable({
    metaData,
    objectName: currentItem,
    canGetObject: canReadPreviewObject,
    isDeleteMarker: !!actualInfo.is_delete_marker,
    isPrefix: target.key.endsWith("/"),
  });

  const multiActionButtons = [
    {
      action: () => {
        downloadObject(dispatch, bucketName, target.key, actualInfo);
      },
      label: t("Download"),
      disabled: !!actualInfo.is_delete_marker || !canGetObject,
      icon: <DownloadIcon />,
      tooltip: canGetObject
        ? t("Download this Object")
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
            t("download this object"),
          ),
    },
    {
      action: () => {
        shareObject();
      },
      label: t("Share"),
      disabled: !!actualInfo.is_delete_marker || !canGetObject,
      icon: <ShareIcon />,
      tooltip: canGetObject
        ? t("Share this File")
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
            t("share this object"),
          ),
    },
    {
      action: () => {
        setPreviewOpen(true);
      },
      label: t("Preview"),
      disabled: !previewAvailable,
      icon: <PreviewIcon />,
      tooltip: previewAvailable
        ? t("Preview this File")
        : !canReadPreviewObject
          ? permissionTooltipHelper(
              previewPermissionScopes,
              t("preview this object"),
            )
          : t("Preview unavailable"),
    },
    {
      action: () => {
        setLegalholdOpen(true);
      },
      label: t("Legal Hold"),
      disabled:
        !locking ||
        !distributedSetup ||
        !!actualInfo.is_delete_marker ||
        !canSetLegalHold ||
        explicitVersion,
      icon: <LegalHoldIcon />,
      tooltip: canSetLegalHold
        ? locking
          ? t("Change Legal Hold rules for this File")
          : t(
              "Object Locking must be enabled on this bucket in order to set Legal Hold",
            )
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_PUT_OBJECT_LEGAL_HOLD, IAM_SCOPES.S3_PUT_ACTIONS],
            t("change legal hold settings for this object"),
          ),
    },
    {
      action: openRetentionModal,
      label: t("Retention"),
      disabled:
        !distributedSetup ||
        !!actualInfo.is_delete_marker ||
        !canChangeRetention ||
        explicitVersion ||
        !locking,
      icon: <RetentionIcon />,
      tooltip: canChangeRetention
        ? locking
          ? t("Change Retention rules for this File")
          : t(
              "Object Locking must be enabled on this bucket in order to set Retention Rules",
            )
        : permissionTooltipHelper(
            [
              IAM_SCOPES.S3_GET_OBJECT_RETENTION,
              IAM_SCOPES.S3_PUT_OBJECT_RETENTION,
              IAM_SCOPES.S3_GET_ACTIONS,
              IAM_SCOPES.S3_PUT_ACTIONS,
            ],
            t("change Retention Rules for this object"),
          ),
    },
    {
      action: () => {
        setTagModalOpen(true);
      },
      label: t("Tags"),
      disabled: !!actualInfo.is_delete_marker || explicitVersion || !canSetTags,
      icon: <TagsIcon />,
      tooltip: canSetTags
        ? t("Change Tags for this File")
        : permissionTooltipHelper(
            [
              IAM_SCOPES.S3_PUT_OBJECT_TAGGING,
              IAM_SCOPES.S3_GET_OBJECT_TAGGING,
              IAM_SCOPES.S3_GET_ACTIONS,
              IAM_SCOPES.S3_PUT_ACTIONS,
            ],
            t("set Tags on this object"),
          ),
    },
    {
      action: () => {
        setInspectModalOpen(true);
      },
      label: t("Inspect"),
      disabled:
        !distributedSetup ||
        !!actualInfo.is_delete_marker ||
        explicitVersion ||
        !canInspect,
      icon: <InspectMenuIcon />,
      tooltip: canInspect
        ? t("Inspect this file")
        : permissionTooltipHelper(
            [IAM_SCOPES.ADMIN_INSPECT_DATA],
            t("inspect this file"),
          ),
    },
    {
      action: () => {
        dispatch(
          setVersionsModeEnabled({
            status: !versionsMode,
            objectName: objectName,
          }),
        );
      },
      label: versionsMode
        ? t("Hide Object Versions")
        : t("Display Object Versions"),
      icon: <VersionsIcon />,
      disabled: !versionsAvailable || !canChangeVersioning,
      tooltip: canChangeVersioning
        ? versionsAvailable
          ? t("Display Versions for this file")
          : t("No object versions are available")
        : permissionTooltipHelper(
            [
              IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
              IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
              IAM_SCOPES.S3_GET_OBJECT_VERSION,
              IAM_SCOPES.S3_GET_ACTIONS,
              IAM_SCOPES.S3_PUT_ACTIONS,
            ],
            t("display all versions of this object"),
          ),
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
      {shareFileModalOpen && (
        <ShareFile
          key={shareSubjectKey(target)}
          open={shareFileModalOpen}
          closeModalAndRefresh={closeShareModal}
          subject={target}
        />
      )}
      {retentionModalOpen && (
        <SetRetention
          open={retentionModalOpen}
          closeModalAndRefresh={closeRetentionModal}
          target={target}
          objectInfo={actualInfo}
        />
      )}
      {deleteOpen && (
        <DeleteObject
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          selectedObject={target.key}
          closeDeleteModalAndRefresh={closeDeleteModal}
          versioningInfo={distributedSetup ? versioningInfo : undefined}
          selectedVersion={deleteVersion}
        />
      )}
      {legalholdOpen && (
        <SetLegalHoldModal
          open={legalholdOpen}
          closeModalAndRefresh={closeLegalholdModal}
          target={target}
          actualInfo={actualInfo}
        />
      )}
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
      {tagModalOpen && (
        <TagsModal
          modalOpen={tagModalOpen}
          target={target}
          actualInfo={actualInfo}
          onCloseAndUpdate={closeAddTagModal}
        />
      )}
      {inspectModalOpen && (
        <InspectObject
          inspectOpen={inspectModalOpen}
          volumeName={bucketName}
          inspectPath={target.key}
          closeInspectModalAndRefresh={closeInspectModal}
        />
      )}
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

      {loadingObjectInfo ? (
        <Fragment>{loaderForContainer}</Fragment>
      ) : (
        <Box
          sx={{
            "& .ObjectDetailsTitle": {
              display: "flex",
              alignItems: "center",
              "& .min-icon": {
                width: 26,
                height: 26,
                minWidth: 26,
                minHeight: 26,
              },
            },
            "& .objectNameContainer": {
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              alignItems: "center",
              marginLeft: 10,
            },
            "& .capitalizeFirst": {
              textTransform: "capitalize",
            },
            "& .detailContainer": {
              padding: "0 22px",
              marginBottom: 10,
              fontSize: 14,
            },
          }}
        >
          <ActionsList
            title={
              <div className={"ObjectDetailsTitle"}>
                {displayFileIconName(objectName || "", true)}
                <span className={"objectNameContainer"}>{objectName}</span>
              </div>
            }
            items={multiActionButtons}
          />
          <TooltipWrapper
            tooltip={
              canDelete
                ? ""
                : permissionTooltipHelper(
                    [IAM_SCOPES.S3_DELETE_OBJECT, IAM_SCOPES.S3_DELETE_ACTIONS],
                    t("delete this object"),
                  )
            }
          >
            <Grid
              item
              xs={12}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              <SecureComponent
                resource={[
                  bucketName,
                  currentItem,
                  [bucketName, target.key].join("/"),
                ]}
                scopes={[
                  IAM_SCOPES.S3_DELETE_OBJECT,
                  IAM_SCOPES.S3_DELETE_ACTIONS,
                ]}
                errorProps={{ disabled: true }}
              >
                <Button
                  id={"delete-element-click"}
                  icon={<DeleteIcon />}
                  iconLocation={"start"}
                  fullWidth
                  variant={"secondary"}
                  onClick={() => {
                    setDeleteOpen(true);
                  }}
                  disabled={!explicitVersion && actualInfo.is_delete_marker}
                  sx={{
                    width: "calc(100% - 44px)",
                    margin: "8px 0",
                  }}
                  label={explicitVersion ? t("Delete version") : t("Delete")}
                />
              </SecureComponent>
            </Grid>
          </TooltipWrapper>
          <SimpleHeader icon={<ObjectInfoIcon />} label={t("Object Info")} />
          <Box className={"detailContainer"}>
            <strong>{t("Name:")}</strong>
            <br />
            <div style={{ overflowWrap: "break-word" }}>{objectName}</div>
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
              {formatText(
                versions.length === 1
                  ? t("{count} version, {size}")
                  : t("{count} versions, {size}"),
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
              <SimpleHeader label={t("Metadata")} icon={<MetadataIcon />} />
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
