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

import { useMobile } from "common/ui/useMediaQuery";
import { ModalPresence } from "common/ui/ModalPresence";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import get from "lodash/get";
import {
  AccessRuleIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  DeleteIcon,
  DownloadIcon,
  Grid,
  HistoryIcon,
  PageLayout,
  PreviewIcon,
  RefreshIcon,
  UploadIcon,
  ShareIcon,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import { previewObjectType } from "../utils";
import { objectActionState } from "../objectActionState";
import ObjectActions from "../ObjectActions";
import ObjectActionTooltip from "../ObjectActionTooltip";
import { AppState, store, useAppDispatch } from "../../../../../../store";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../../../common/SecureComponent";
import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../../../systemSlice";
import { isVersionedMode } from "../../../../../../utils/validationFunctions";
import {
  extractFileExtn,
  getPolicyAllowedFileExtensions,
  getSessionGrantsWildCard,
} from "../../UploadPermissionUtils";
import {
  makeid,
  removeTrace,
  storeUploadControl,
  captureTaskSession,
} from "../../../../ObjectBrowser/transferManager";
import { useTaskSession } from "../../../../Common/ObjectManager/useTaskSession";
import { attachUploadRequestHandlers, uploadControl } from "../uploadRequest";
import {
  cancelObjectInList,
  completeObject,
  failObject,
  openList,
  resetMessages,
  resetRewind,
  setAnonymousAccessOpen,
  setDownloadRenameModal,
  setLoadingVersions,
  setNewObject,
  setObjectDetailsView,
  setPreviewOpen,
  setReloadObjectsList,
  setRetentionConfig,
  setSelectedObjects,
  setSelectedObjectView,
  setSelectedPreview,
  setShareFileModalOpen,
  setShowDeletedObjects,
  setVersionsModeEnabled,
  updateProgress,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import {
  downloadSelected,
  openAnonymousAccess,
  openPreview,
  openShare,
} from "../../../../ObjectBrowser/objectBrowserThunks";
import withSuspense from "../../../../Common/Components/withSuspense";
import UploadFilesButton from "../../UploadFilesButton";
import DetailsListPanel from "./DetailsListPanel";
import ObjectDetailPanel from "./ObjectDetailPanel";
import VersionsNavigator from "../ObjectDetails/VersionsNavigator";
import ShareFile from "../ObjectDetails/ShareFile";
import PreviewFileModal from "../Preview/PreviewFileModal";
import RenameLongFileName from "../../../../ObjectBrowser/RenameLongFilename";
import { ContextAction } from "common/ui/ContextMenu";
import ListObjectsTable from "./ListObjectsTable";
import FilterObjectsSB from "../../../../ObjectBrowser/FilterObjectsSB";
import {
  identityKey,
  RequestedObject,
  routeObjectIdentity,
} from "../objectIdentity";
import { shareSubjectKey } from "../ObjectDetails/shareSubject";
import { BucketObjectItem } from "./types";
import AddAccessRule from "../../../BucketDetails/AddAccessRule";
import { sanitizeFilePath } from "./utils";
import { shouldRecommendMultipartUpload } from "./uploadAdvisory";
import { useT } from "i18n";
import { useRecentBuckets } from "../../../../../../navigation/RecentBucketsProvider";
import BucketPageHeader from "../../../BucketPageHeader";
import OBHeader from "../../../../ObjectBrowser/OBHeader";

const DeleteMultipleObjects = withSuspense(
  React.lazy(() => import("./DeleteMultipleObjects")),
);
const RewindEnable = withSuspense(React.lazy(() => import("./RewindEnable")));

const baseDnDStyle = {
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "transparent",
  outline: "none",
};

const activeDnDStyle = {
  borderStyle: "dashed",
  backgroundColor: "transparent",
  borderColor: "#2196f3",
};

const acceptDnDStyle = {
  borderStyle: "dashed",
  backgroundColor: "transparent",
  borderColor: "#00e676",
};

const ListObjects = () => {
  const mobile = useMobile();
  const [usageRefresh, setUsageRefresh] = useState<{
    bucket: string;
    prefix: string;
    id: number;
  }>();
  const [selectionSheetOpen, setSelectionSheetOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const t = useT();
  const { refresh: refreshBucketMetadata } = useRecentBuckets();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled,
  );
  const bucketToRewind = useSelector(
    (state: AppState) => state.objectBrowser.rewind.bucketToRewind,
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode,
  );
  const showDeleted = useSelector(
    (state: AppState) => state.objectBrowser.showDeleted,
  );
  const detailsOpen = useSelector(
    (state: AppState) => state.objectBrowser.objectDetailsOpen,
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths,
  );
  const requestInProgress = useSelector(
    (state: AppState) => state.objectBrowser.requestInProgress,
  );
  const simplePath = useSelector(
    (state: AppState) => state.objectBrowser.simplePath,
  );
  const versioningConfig = useSelector(
    (state: AppState) => state.objectBrowser.versionInfo,
  );
  const lockingEnabled = useSelector(
    (state: AppState) => state.objectBrowser.lockingEnabled,
  );
  const downloadRenameModal = useSelector(
    (state: AppState) => state.objectBrowser.downloadRenameModal,
  );
  const selectedPreview = useSelector(
    (state: AppState) => state.objectBrowser.selectedPreview,
  );
  const shareFileModalOpen = useSelector(
    (state: AppState) => state.objectBrowser.shareFileModalOpen,
  );
  const previewOpen = useSelector(
    (state: AppState) => state.objectBrowser.previewOpen,
  );
  const selectedBucket = useSelector(
    (state: AppState) => state.objectBrowser.selectedBucket,
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );
  const anonymousAccessOpen = useSelector(
    (state: AppState) => state.objectBrowser.anonymousAccessOpen,
  );

  const records = useSelector(
    (state: AppState) => state.objectBrowser?.records || [],
  );

  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
  const [rewindSelect, setRewindSelect] = useState<boolean>(false);
  const metadataGeneration = useRef(0);
  const [metadataState, setMetadataState] = useState<{
    identity: string;
    data: Record<string, unknown> | null;
  }>({ identity: "", data: null });

  const isVersioningApplied = isVersionedMode(versioningConfig?.status);

  const bucketName = params.bucketName || "";
  // The route is the source of truth for the object the panels show; the redux
  // mirror (selectedInternalPaths) is written by an effect and lags behind it.
  const routeIdentity = routeObjectIdentity(location.pathname, bucketName);
  const internalPaths = routeIdentity.key;
  const detailsIdentityMatches =
    selectedInternalPaths !== null &&
    selectedInternalPaths === routeIdentity.key;
  const detailsIdentityKey = identityKey([bucketName, routeIdentity.key]);
  // Dialogs opened from the object list capture the complete identity of the
  // selected object when they open, bucket included, and are discarded when the
  // route leaves that bucket.
  const [shareCapture, setShareCapture] = useState<{
    bucket: string;
    subject: RequestedObject;
  } | null>(null);
  const [previewCapture, setPreviewCapture] = useState<{
    bucket: string;
    item: BucketObjectItem;
  } | null>(null);

  useEffect(() => setSelectionSheetOpen(false), [location.key, versionsMode]);

  const currentPath = internalPaths.split("/").filter((i: string) => i !== "");

  let uploadPath = [bucketName];
  if (currentPath.length > 0) {
    uploadPath = uploadPath.concat(currentPath);
  }

  const filterInput = useRef<HTMLInputElement>(null);
  const createActionRef = useRef<ContextAction | null>(null);
  const fileUpload = useRef<HTMLInputElement>(null);
  const folderUpload = useRef<HTMLInputElement>(null);

  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {},
  );

  const putObjectPermScopes = [
    IAM_SCOPES.S3_PUT_OBJECT,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ];

  const pathAsResourceInPolicy = uploadPath.join("/");
  const allowedFileExtensions = getPolicyAllowedFileExtensions(
    sessionGrants,
    pathAsResourceInPolicy,
    putObjectPermScopes,
  );

  const sessionGrantWildCards = getSessionGrantsWildCard(
    sessionGrants,
    pathAsResourceInPolicy,
    putObjectPermScopes,
  );

  const canDownload = hasPermission(
    [pathAsResourceInPolicy, ...sessionGrantWildCards],
    [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
  );
  const canRewind = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_OBJECT,
    IAM_SCOPES.S3_GET_ACTIONS,
    IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
  ]);
  const canDelete = hasPermission(
    [pathAsResourceInPolicy, ...sessionGrantWildCards],
    [IAM_SCOPES.S3_DELETE_OBJECT, IAM_SCOPES.S3_DELETE_ACTIONS],
  );
  const canUpload =
    hasPermission(
      [pathAsResourceInPolicy, ...sessionGrantWildCards],
      putObjectPermScopes,
    ) || anonymousMode;

  const canSetAnonymousAccess = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_POLICY,
    IAM_SCOPES.S3_PUT_BUCKET_POLICY,
    IAM_SCOPES.S3_GET_ACTIONS,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
  );

  const checkForDelMarker = (): boolean => {
    let isObjDelMarker = false;
    if (selectedObjects.length === 1) {
      let matchingRec = records.find((obj) => {
        return obj.name === `${selectedObjects[0]}` && obj.delete_flag;
      });

      isObjDelMarker = !!matchingRec;
    }
    return isObjDelMarker;
  };

  const isSelObjectDelMarker = checkForDelMarker();
  const selectedObjectName =
    selectedObjects.length === 1 ? selectedObjects[0] : "";
  const metadataIdentity = `${bucketName}\u0001${selectedObjectName}`;
  const metaData =
    metadataState.identity === metadataIdentity ? metadataState.data : null;
  useEffect(() => {
    const generation = metadataGeneration.current + 1;
    metadataGeneration.current = generation;
    const controller = new AbortController();

    setMetadataState({ identity: metadataIdentity, data: null });

    if (!bucketName || !selectedObjectName || isSelObjectDelMarker) {
      return () => {
        controller.abort();
        metadataGeneration.current += 1;
      };
    }

    api.buckets
      .getObjectMetadata(
        bucketName,
        { prefix: selectedObjectName },
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
          });
        }
      })
      .catch(() => {
        if (
          !controller.signal.aborted &&
          metadataGeneration.current === generation
        ) {
          setMetadataState({ identity: metadataIdentity, data: null });
        }
      });

    return () => {
      controller.abort();
      if (metadataGeneration.current === generation) {
        metadataGeneration.current += 1;
      }
    };
  }, [
    anonymousMode,
    bucketName,
    isSelObjectDelMarker,
    metadataIdentity,
    selectedObjectName,
  ]);

  useEffect(() => {
    if (rewindEnabled) {
      if (bucketToRewind !== bucketName) {
        dispatch(resetRewind());
        return;
      }
    }
  }, [rewindEnabled, bucketToRewind, bucketName, dispatch]);

  useEffect(() => {
    if (!shareFileModalOpen || !selectedPreview) {
      setShareCapture(null);
      return;
    }
    setShareCapture(
      (current) =>
        current ?? {
          bucket: bucketName,
          subject: {
            bucket: bucketName,
            key: selectedPreview.name,
            version: selectedPreview.version_id
              ? { kind: "id", versionId: selectedPreview.version_id }
              : { kind: "latest" },
          },
        },
    );
  }, [shareFileModalOpen, selectedPreview, bucketName]);

  useEffect(() => {
    if (!previewOpen || !selectedPreview) {
      setPreviewCapture(null);
      return;
    }
    setPreviewCapture(
      (current) => current ?? { bucket: bucketName, item: selectedPreview },
    );
  }, [previewOpen, selectedPreview, bucketName]);

  useEffect(() => {
    if (shareCapture && shareCapture.bucket !== bucketName) {
      dispatch(setShareFileModalOpen(false));
      dispatch(setSelectedPreview(null));
    }
  }, [shareCapture, bucketName, dispatch]);

  useEffect(() => {
    if (previewCapture && previewCapture.bucket !== bucketName) {
      dispatch(setPreviewOpen(false));
      dispatch(setSelectedPreview(null));
    }
  }, [previewCapture, bucketName, dispatch]);

  useEffect(() => {
    if (folderUpload.current !== null) {
      folderUpload.current.setAttribute("directory", "");
      folderUpload.current.setAttribute("webkitdirectory", "");
    }
  }, [folderUpload]);

  useEffect(() => {
    if (selectedObjects.length > 0) {
      dispatch(setObjectDetailsView(true));
      return;
    }

    if (
      selectedObjects.length === 0 &&
      selectedInternalPaths === null &&
      !requestInProgress
    ) {
      dispatch(setObjectDetailsView(false));
    }
  }, [selectedObjects, selectedInternalPaths, dispatch, requestInProgress]);

  // Load retention Config

  useEffect(() => {
    if (selectedBucket !== "" && !anonymousMode) {
      api.buckets
        .getBucketRetentionConfig(selectedBucket)
        .then((res) => {
          dispatch(setRetentionConfig(res.data));
        })
        .catch(() => {
          dispatch(setRetentionConfig(null));
        });
    } else if (anonymousMode) {
      dispatch(setRetentionConfig(null));
    }
  }, [anonymousMode, selectedBucket, dispatch]);

  const closeDeleteMultipleModalAndRefresh = (refresh: boolean) => {
    setDeleteMultipleOpen(false);

    if (refresh) {
      dispatch(setSnackBarMessage(t("Objects deleted successfully.")));
      dispatch(setSelectedObjects([]));
      dispatch(setReloadObjectsList(true));
    }
  };

  const handleUploadButton = (e: any) => {
    if (
      e === null ||
      e === undefined ||
      e.target.files === null ||
      e.target.files === undefined
    ) {
      return;
    }
    e.preventDefault();
    var newFiles: File[] = [];

    for (let i = 0; i < e.target.files.length; i++) {
      newFiles.push(e.target.files[i]);
    }
    uploadObject(newFiles, "");

    e.target.value = "";
  };

  const canEnqueue = useTaskSession();
  const uploadObject = useCallback(
    (files: File[], folderPath: string): void => {
      if (!canEnqueue()) return;
      const current = captureTaskSession();
      if (shouldRecommendMultipartUpload(files)) {
        dispatch(
          setSnackBarMessage(
            t(
              "Files larger than 5 GiB use a single, non-resumable browser request. Use mcli for multipart uploads.",
            ),
          ),
        );
      }

      let pathPrefix = "";
      if (simplePath) {
        pathPrefix = simplePath.endsWith("/") ? simplePath : simplePath + "/";
      }

      const upload = (
        files: File[],
        bucketName: string,
        path: string,
        folderPath: string,
      ) => {
        let uploadPromise = (file: File) => {
          return new Promise((resolve, reject) => {
            let uploadUrl = `api/v1/buckets/${bucketName}/objects/upload`;
            const fileName = file.name;

            const blobFile = new Blob([file], { type: file.type });

            const filePath = sanitizeFilePath(get(file, "path", ""));
            const fileWebkitRelativePath = get(file, "webkitRelativePath", "");

            let relativeFolderPath = folderPath;
            const ID = makeid(8);

            // File was uploaded via drag & drop
            if (filePath !== "") {
              relativeFolderPath = filePath;
            } else if (fileWebkitRelativePath !== "") {
              // File was uploaded using upload button
              relativeFolderPath = fileWebkitRelativePath;
            }

            let prefixPath = "";

            if (path !== "" || relativeFolderPath !== "") {
              const finalFolderPath = relativeFolderPath
                .split("/")
                .slice(0, -1)
                .join("/");

              const pathClean = path.endsWith("/") ? path.slice(0, -1) : path;

              prefixPath = `${pathClean}${
                !pathClean.endsWith("/") &&
                finalFolderPath !== "" &&
                !finalFolderPath.startsWith("/")
                  ? "/"
                  : ""
              }${finalFolderPath}${
                !finalFolderPath.endsWith("/") ||
                (finalFolderPath.trim() === "" && !path.endsWith("/"))
                  ? "/"
                  : ""
              }`;
            }

            if (prefixPath !== "") {
              uploadUrl = `${uploadUrl}?prefix=${encodeURIComponent(
                prefixPath + fileName,
              )}`;
            } else {
              uploadUrl = `${uploadUrl}?prefix=${encodeURIComponent(fileName)}`;
            }

            const identity = encodeURIComponent(
              `${bucketName}-${prefixPath}-${new Date().getTime()}-${Math.random()}`,
            );

            let xhr = new XMLHttpRequest();
            xhr.open("POST", uploadUrl, true);
            if (anonymousMode) {
              xhr.setRequestHeader("X-Anonymous", "1");
            }

            const areMultipleFiles = files.length > 1;
            const errorMessage = areMultipleFiles
              ? t("An error occurred while uploading the files.")
              : t("An error occurred while uploading the file.");

            xhr.withCredentials = false;

            // Every terminal state releases the transfer-manager trace (the
            // request and its FormData/Blob) and settles this promise once.
            const lifecycle = attachUploadRequestHandlers(xhr, {
              fallbackError: errorMessage,
              malformedError: t("something went wrong"),
              networkError: t("A network error occurred."),
              statusErrors: { 413: t("Error - File size too large") },
              handlers: {
                cleanup: () => removeTrace(ID),
                complete: (status) => {
                  if (current()) dispatch(completeObject(identity));
                  resolve({ status });
                },
                fail: (message, status) => {
                  if (current())
                    dispatch(
                      failObject({ instanceID: identity, msg: message }),
                    );
                  reject({ status, message });
                },
                abort: () => {
                  if (current()) dispatch(cancelObjectInList(identity));
                  resolve({ status: 0, cancelled: true });
                },
                progress: (progress) => {
                  if (current())
                    dispatch(
                      updateProgress({ instanceID: identity, progress }),
                    );
                },
              },
            });

            try {
              if (file.size === undefined) {
                throw new Error(errorMessage);
              }
              const formData = new FormData();
              formData.append(file.size.toString(), blobFile, fileName);
              storeUploadControl(
                ID,
                uploadControl(xhr, formData, lifecycle, errorMessage),
              );
              dispatch(
                setNewObject({
                  ID,
                  bucketName,
                  done: false,
                  instanceID: identity,
                  percentage: 0,
                  prefix: `${prefixPath}${fileName}`,
                  type: "upload",
                  waitingForFile: false,
                  failed: false,
                  cancelled: false,
                  errorMessage: "",
                }),
              );
            } catch (error: any) {
              // A setup failure must not leave a trace or a pending promise.
              lifecycle.finalize(
                "error",
                error instanceof Error && error.message
                  ? error.message
                  : errorMessage,
              );
            }
          });
        };

        const uploadFilePromises: any = [];
        // open object manager
        dispatch(openList());
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          uploadFilePromises.push(uploadPromise(file));
        }
        Promise.allSettled(uploadFilePromises).then(() => {
          // Per-task completion/error notices come from the canonical store.
          // A detached old account must not refresh the next session's list.
          if (
            current() &&
            store.getState().objectBrowser.simplePath === path &&
            store.getState().objectBrowser.selectedBucket === bucketName
          ) {
            dispatch(setReloadObjectsList(true));
          }
        });
      };

      upload(files, bucketName, pathPrefix, folderPath);
    },
    [bucketName, dispatch, simplePath, anonymousMode, t, canEnqueue],
  );

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      if (!canEnqueue()) return;
      if (acceptedFiles && acceptedFiles.length > 0 && canUpload) {
        let newFolderPath: string = acceptedFiles[0].path;
        //Should we filter by allowed file extensions if any?.
        let allowedFiles = acceptedFiles;

        if (allowedFileExtensions.length > 0) {
          allowedFiles = acceptedFiles.filter((file) => {
            const fileExtn = extractFileExtn(file.name);
            return allowedFileExtensions.includes(fileExtn);
          });
        }

        if (allowedFiles.length) {
          uploadObject(allowedFiles, newFolderPath);
          console.log(
            `${allowedFiles.length} Allowed Files Processed out of ${acceptedFiles.length}.`,
            pathAsResourceInPolicy,
            ...sessionGrantWildCards,
          );

          if (allowedFiles.length !== acceptedFiles.length) {
            dispatch(
              setErrorSnackMessage({
                errorMessage: t("Upload is restricted."),
                detailedError: permissionTooltipHelper(
                  [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                  t("upload objects to this location"),
                ),
              }),
            );
          }
        } else {
          dispatch(
            setErrorSnackMessage({
              errorMessage: t("Could not process drag and drop."),
              detailedError: permissionTooltipHelper(
                [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                t("upload objects to this location"),
              ),
            }),
          );

          console.error(
            "Could not process drag and drop . upload may be restricted.",
            pathAsResourceInPolicy,
            ...sessionGrantWildCards,
          );
        }
      }
      if (!canUpload) {
        dispatch(
          setErrorSnackMessage({
            errorMessage: t("Upload not allowed"),
            detailedError: permissionTooltipHelper(
              [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
              t("upload objects to this location"),
            ),
          }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadObject],
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept } =
    useDropzone({
      noClick: true,
      onDrop,
    });

  const dndStyles = useMemo(
    () => ({
      ...baseDnDStyle,
      ...(isDragActive ? activeDnDStyle : {}),
      ...(isDragAccept ? acceptDnDStyle : {}),
    }),
    [isDragActive, isDragAccept],
  );

  const closeShareModal = () => {
    dispatch(setShareFileModalOpen(false));
    dispatch(setSelectedPreview(null));
  };

  const rewindCloseModal = () => {
    setRewindSelect(false);
  };

  const closePreviewWindow = () => {
    dispatch(setPreviewOpen(false));
    dispatch(setSelectedPreview(null));
  };

  const onClosePanel = (forceRefresh: boolean) => {
    if (detailsOpen && selectedInternalPaths !== null) {
      // We change URL to be the contained folder

      const splitURLS = internalPaths.split("/");

      // We remove the last section of the URL as it should be a file
      splitURLS.pop();

      let URLItem = "";

      if (splitURLS && splitURLS.length > 0) {
        URLItem = `${splitURLS.join("/")}/`;
      }

      navigate(
        `/browser/${encodeURIComponent(bucketName)}/${encodeURIComponent(URLItem)}`,
      );
      // Accepted route changes own detail/selection reset. A blocked departure
      // must leave the same object and sheet intact when Stay here is chosen.
      if (forceRefresh) dispatch(setReloadObjectsList(true));
      return;
    }
    dispatch(setSelectedObjectView(null));
    dispatch(setVersionsModeEnabled({ status: false }));
    dispatch(setObjectDetailsView(false));

    if (forceRefresh) {
      dispatch(setReloadObjectsList(true));
    }
  };

  const setDeletedAction = () => {
    dispatch(resetMessages());
    dispatch(setShowDeletedObjects(!showDeleted));
    onClosePanel(true);
  };

  const closeRenameModal = () => {
    dispatch(setDownloadRenameModal(null));
  };

  const closeAddAccessRule = () => {
    dispatch(setAnonymousAccessOpen(false));
  };

  const downloadToolTip =
    selectedObjects?.length <= 1
      ? t("Download Selected")
      : t(
          "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.",
        );

  const selectedContext = {
    selectionCount: selectedObjects.length,
    isDeleteMarker: isSelObjectDelMarker,
    isPrefix: selectedObjectName.endsWith("/"),
  };
  const rewindState = objectActionState({
    action: "rewind",
    allowed: canRewind,
    versioningEnabled: isVersioningApplied,
  });
  const refreshState = objectActionState({
    action: "refresh",
    allowed:
      anonymousMode ||
      hasPermission(bucketName, [
        IAM_SCOPES.S3_LIST_BUCKET,
        IAM_SCOPES.S3_ALL_LIST_BUCKET,
      ]),
    rewindEnabled: !anonymousMode && rewindEnabled,
  });
  const multiActionButtons = [
    {
      action: () => dispatch(downloadSelected(bucketName)),
      label: t("Download"),
      state: objectActionState({
        ...selectedContext,
        action: "download",
        allowed: canDownload,
      }),
      icon: <DownloadIcon />,
      tooltip: downloadToolTip,
    },
    {
      action: () => dispatch(openShare()),
      label: t("Share"),
      state: objectActionState({
        ...selectedContext,
        action: "share",
        allowed: canDownload,
      }),
      icon: <ShareIcon />,
      tooltip: t("Share Selected File"),
    },
    {
      action: () => dispatch(openPreview()),
      label: t("Preview"),
      state: objectActionState({
        ...selectedContext,
        action: "preview",
        allowed: canDownload,
        previewSupported:
          previewObjectType(metaData, selectedObjectName) !== "none",
      }),
      icon: <PreviewIcon />,
      tooltip: t("Preview Selected File"),
    },
    {
      action: () => dispatch(openAnonymousAccess()),
      label: t("Anonymous Access"),
      state: objectActionState({
        ...selectedContext,
        action: "anonymousAccess",
        allowed: canSetAnonymousAccess,
      }),
      icon: <AccessRuleIcon />,
      tooltip: t("Set Anonymous Access to this Folder"),
    },
    {
      action: () => setDeleteMultipleOpen(true),
      label: t("Delete"),
      state: objectActionState({
        action: "delete",
        selectionCount: selectedObjects.length,
        allowed: canDelete,
      }),
      icon: <DeleteIcon />,
      tooltip: t("Delete Selected Files"),
    },
  ];

  return (
    <Fragment>
      <ModalPresence
        open={Boolean(
          shareFileModalOpen &&
          shareCapture &&
          shareCapture.bucket === bucketName,
        )}
      >
        {shareFileModalOpen &&
          shareCapture &&
          shareCapture.bucket === bucketName && (
            <ShareFile
              key={shareSubjectKey(shareCapture.subject)}
              open={shareFileModalOpen}
              closeModalAndRefresh={closeShareModal}
              subject={shareCapture.subject}
            />
          )}
      </ModalPresence>
      <ModalPresence open={Boolean(deleteMultipleOpen)}>
        {deleteMultipleOpen && (
          <DeleteMultipleObjects
            deleteOpen={deleteMultipleOpen}
            selectedBucket={bucketName}
            selectedObjects={selectedObjects}
            closeDeleteModalAndRefresh={closeDeleteMultipleModalAndRefresh}
            versioning={versioningConfig}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(rewindSelect)}>
        {rewindSelect && (
          <RewindEnable
            open={rewindSelect}
            closeModalAndRefresh={rewindCloseModal}
            bucketName={bucketName}
          />
        )}
      </ModalPresence>
      <ModalPresence
        open={Boolean(
          previewOpen && previewCapture && previewCapture.bucket === bucketName,
        )}
      >
        {previewOpen &&
          previewCapture &&
          previewCapture.bucket === bucketName && (
            <PreviewFileModal
              key={identityKey([
                previewCapture.bucket,
                previewCapture.item.name,
                previewCapture.item.version_id || "",
              ])}
              open={previewOpen}
              bucketName={previewCapture.bucket}
              actualInfo={{
                name: previewCapture.item.name || "",
                last_modified: "",
                version_id: previewCapture.item.version_id || "",
                size: previewCapture.item.size,
                content_type: previewCapture.item.content_type,
              }}
              onClosePreview={closePreviewWindow}
            />
          )}
      </ModalPresence>
      <ModalPresence open={Boolean(!!downloadRenameModal)}>
        {!!downloadRenameModal && (
          <RenameLongFileName
            open={!!downloadRenameModal}
            closeModal={closeRenameModal}
            currentItem={downloadRenameModal.name.split("/")?.pop() || ""}
            bucketName={bucketName}
            internalPaths={internalPaths}
            actualInfo={{
              name: downloadRenameModal.name,
              last_modified: "",
              version_id: downloadRenameModal.version_id,
              size: downloadRenameModal.size,
            }}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(anonymousAccessOpen)}>
        {anonymousAccessOpen && (
          <AddAccessRule
            onClose={closeAddAccessRule}
            bucket={bucketName}
            modalOpen={anonymousAccessOpen}
            prefilledRoute={`${selectedObjects[0]}*`}
          />
        )}
      </ModalPresence>

      <BucketPageHeader
        bucketName={bucketName}
        anonymous={anonymousMode}
        primaryAction={
          <>
            {" "}
            <input
              type="file"
              multiple
              accept={allowedFileExtensions ? allowedFileExtensions : undefined}
              onChange={handleUploadButton}
              style={{ display: "none" }}
              ref={fileUpload}
            />
            <input
              type="file"
              multiple
              onChange={handleUploadButton}
              style={{ display: "none" }}
              ref={folderUpload}
            />
            <UploadFilesButton
              bucketName={bucketName}
              uploadPath={pathAsResourceInPolicy}
              uploadFileFunction={(closeMenu) => {
                if (fileUpload && fileUpload.current) {
                  fileUpload.current.click();
                }
                closeMenu();
              }}
              uploadFolderFunction={(closeMenu) => {
                if (folderUpload && folderUpload.current) {
                  folderUpload.current.click();
                }
                closeMenu();
              }}
            />
          </>
        }
        refreshAction={{
          id: "refresh-objects-list",
          label: t("Refresh"),
          icon: <RefreshIcon />,
          disabled: refreshState.disabled,
          disabledReason: refreshState.reason,
          onClick: () => {
            refreshBucketMetadata();
            setUsageRefresh({
              bucket: bucketName,
              prefix: simplePath || "",
              id: Date.now(),
            });
            if (versionsMode) dispatch(setLoadingVersions(true));
            else dispatch(setReloadObjectsList(true));
          },
        }}
      >
        <PageLayout variant={"full"}>
          {anonymousMode && (
            <div style={{ paddingBottom: 16 }}>
              <FilterObjectsSB inputRef={filterInput} />
            </div>
          )}
          {!anonymousMode && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <OBHeader bucketName={bucketName} inputRef={filterInput} />
              </Box>
              {!anonymousMode && (
                <ObjectActionTooltip
                  state={rewindState}
                  label={t("Rewind")}
                  tooltip={t("Rewind Bucket")}
                >
                  <Button
                    id={"rewind-objects-list"}
                    label={t("Rewind")}
                    icon={
                      <Badge color="alert" dotOnly invisible={!rewindEnabled}>
                        <HistoryIcon
                          style={{
                            minWidth: 16,
                            minHeight: 16,
                            width: 16,
                            height: 16,
                            marginTop: -3,
                          }}
                        />
                      </Badge>
                    }
                    variant={"regular"}
                    onClick={() => {
                      setRewindSelect(true);
                    }}
                    disabled={rewindState.disabled}
                  />
                </ObjectActionTooltip>
              )}
            </Box>
          )}
          {mobile && versionsMode && detailsOpen && (
            <Button
              id="version-object-details"
              label={t("Object details")}
              onClick={() => setSelectionSheetOpen(true)}
            />
          )}
          {mobile && selectedObjects.length > 0 && (
            <Button
              id="selected-object-actions"
              label={t("Selected actions")}
              onClick={() => setSelectionSheetOpen(true)}
            />
          )}
          <div
            id="object-list-wrapper"
            {...getRootProps({ style: { ...dndStyles } })}
          >
            <input {...getInputProps()} aria-label={t("Upload Files")} />
            <Box
              withBorders
              sx={{
                display: "flex",
                borderTop: 0,
                padding: 0,
                minWidth: 0,
              }}
            >
              {versionsMode ? (
                <Fragment>
                  {detailsIdentityMatches && (
                    <VersionsNavigator
                      key={detailsIdentityKey}
                      internalPaths={routeIdentity.key}
                      bucketName={bucketName}
                    />
                  )}
                </Fragment>
              ) : (
                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_LIST_BUCKET,
                    IAM_SCOPES.S3_ALL_LIST_BUCKET,
                  ]}
                  resource={bucketName}
                  errorProps={{ disabled: true }}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      width: "100%",
                      position: "relative",
                      minWidth: 0,
                      flex: 1,
                    }}
                    className={detailsOpen ? "detailsOpen" : ""}
                  >
                    {!anonymousMode && (
                      <Grid
                        item
                        xs={12}
                        sx={{
                          padding: "12px 14px 5px",
                        }}
                      >
                        <BrowserBreadcrumbs
                          createActionRef={createActionRef}
                          bucketName={bucketName}
                          internalPaths={internalPaths}
                          additionalOptions={
                            !isVersioningApplied || rewindEnabled ? null : (
                              <Checkbox
                                name={"deleted_objects"}
                                id={"showDeletedObjects"}
                                value={"deleted_on"}
                                label={t("Show deleted objects")}
                                onChange={setDeletedAction}
                                checked={showDeleted}
                                sx={{
                                  marginLeft: 5,
                                  "@media (max-width: 600px)": {
                                    marginLeft: 0,
                                    flexDirection: "row" as const,
                                  },
                                }}
                              />
                            )
                          }
                          hidePathButton={false}
                        />
                      </Grid>
                    )}
                    <ListObjectsTable
                      usageRefresh={usageRefresh}
                      filterRef={filterInput}
                      emptyActions={() => [
                        {
                          label: t("Upload"),
                          icon: <UploadIcon />,
                          action: () => fileUpload.current?.click(),
                          state: {
                            disabled: !canUpload,
                            reason: !canUpload
                              ? t("You need s3:PutObject permission.")
                              : undefined,
                          },
                        },
                        ...(createActionRef.current
                          ? [createActionRef.current]
                          : []),
                        {
                          label: t("Refresh"),
                          icon: <RefreshIcon />,
                          state: refreshState,
                          action: () => {
                            refreshBucketMetadata();
                            setUsageRefresh({
                              bucket: bucketName,
                              prefix: simplePath || "",
                              id: Date.now(),
                            });
                            dispatch(setReloadObjectsList(true));
                          },
                        },
                      ]}
                    />
                  </Grid>
                </SecureComponent>
              )}
              {!anonymousMode && (
                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_LIST_BUCKET,
                    IAM_SCOPES.S3_ALL_LIST_BUCKET,
                  ]}
                  resource={bucketName}
                  errorProps={{ disabled: true }}
                >
                  <DetailsListPanel
                    open={
                      detailsOpen &&
                      (!mobile ||
                        selectionSheetOpen ||
                        detailDialogOpen ||
                        (!versionsMode &&
                          detailsIdentityMatches &&
                          !!internalPaths &&
                          !internalPaths.endsWith("/")))
                    }
                    closePanel={() => {
                      setSelectionSheetOpen(false);
                      if (
                        detailsIdentityMatches &&
                        internalPaths &&
                        !internalPaths.endsWith("/") &&
                        !versionsMode
                      )
                        onClosePanel(false);
                      else if (!mobile) onClosePanel(false);
                    }}
                  >
                    {selectedObjects.length > 0 && (
                      <ObjectActions
                        items={multiActionButtons}
                        title={t("Selected Objects:")}
                      />
                    )}
                    {detailsIdentityMatches && (
                      <ObjectDetailPanel
                        key={detailsIdentityKey}
                        internalPaths={routeIdentity.key}
                        bucketName={bucketName}
                        onClosePanel={onClosePanel}
                        onDialogOpenChange={setDetailDialogOpen}
                        versioningInfo={versioningConfig}
                        locking={lockingEnabled}
                      />
                    )}
                  </DetailsListPanel>
                </SecureComponent>
              )}
            </Box>
          </div>
        </PageLayout>
      </BucketPageHeader>
    </Fragment>
  );
};

export default ListObjects;
