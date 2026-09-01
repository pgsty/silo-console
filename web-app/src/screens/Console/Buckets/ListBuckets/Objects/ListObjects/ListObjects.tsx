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
  ActionsList,
  Badge,
  Box,
  BucketsIcon,
  Button,
  Checkbox,
  DeleteIcon,
  DownloadIcon,
  Grid,
  HistoryIcon,
  PageLayout,
  PreviewIcon,
  RefreshIcon,
  ScreenTitle,
  ShareIcon,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { BucketQuota } from "api/consoleApi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { DateTime } from "luxon";
import { niceBytesInt } from "../../../../../../common/utils";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import { isPreviewAvailable } from "../utils";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { AppState, useAppDispatch } from "../../../../../../store";
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
  storeCallForObjectWithID,
  storeFormDataWithID,
} from "../../../../ObjectBrowser/transferManager";
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
  selBucketDetailsInfo,
  selBucketDetailsLoading,
  setBucketDetailsLoad,
  setBucketInfo,
} from "../../../BucketDetails/bucketDetailsSlice";
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
import TooltipWrapper from "../../../../Common/TooltipWrapper/TooltipWrapper";
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
  const dispatch = useAppDispatch();
  const t = useT();
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

  const loadingBucket = useSelector(selBucketDetailsLoading);
  const bucketInfo = useSelector(selBucketDetailsInfo);

  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
  const [rewindSelect, setRewindSelect] = useState<boolean>(false);
  const [iniLoad, setIniLoad] = useState<boolean>(false);
  const [canShareFile, setCanShareFile] = useState<boolean>(false);
  const [quota, setQuota] = useState<BucketQuota | null>(null);
  const metadataGeneration = useRef(0);
  const [metadataState, setMetadataState] = useState<{
    identity: string;
    data: Record<string, unknown> | null;
  }>({ identity: "", data: null });

  const isVersioningApplied = isVersionedMode(versioningConfig.status);

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

  const currentPath = internalPaths.split("/").filter((i: string) => i !== "");

  let uploadPath = [bucketName];
  if (currentPath.length > 0) {
    uploadPath = uploadPath.concat(currentPath);
  }

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
  const canPreviewFile =
    selectedObjects.length === 1 &&
    isPreviewAvailable({
      metaData,
      objectName: selectedObjectName,
      canGetObject: canDownload,
      isDeleteMarker: isSelObjectDelMarker,
      isPrefix: selectedObjectName.endsWith("/"),
    });

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
    if (selectedObjects.length === 1) {
      const objectName = selectedObjects[0];
      const isPrefix = objectName.endsWith("/");

      if (canDownload && !isPrefix) {
        setCanShareFile(true);
      } else {
        setCanShareFile(false);
      }
    } else {
      setCanShareFile(false);
    }
  }, [selectedObjects, canDownload]);

  useEffect(() => {
    if (!quota && !anonymousMode) {
      api.buckets
        .getBucketQuota(bucketName)
        .then((res) => {
          let quotaVals = null;

          if (res.data.quota) {
            quotaVals = res.data;
          }

          setQuota(quotaVals);
        })
        .catch((err) => {
          console.error(
            "Error Getting Quota Status: ",
            err.error.detailedMessage,
          );
          setQuota(null);
        });
    }
  }, [quota, bucketName, anonymousMode]);

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

  useEffect(() => {
    if (!iniLoad) {
      dispatch(setBucketDetailsLoad(true));
      setIniLoad(true);
    }
  }, [iniLoad, dispatch, setIniLoad]);

  // bucket info
  useEffect(() => {
    if ((requestInProgress || loadingBucket) && !anonymousMode) {
      api.buckets
        .bucketInfo(bucketName)
        .then((res) => {
          dispatch(setBucketDetailsLoad(false));
          dispatch(setBucketInfo(res.data));
        })
        .catch((err) => {
          dispatch(setBucketDetailsLoad(false));
          dispatch(setErrorSnackMessage(errorToHandler(err)));
        });
    }
  }, [bucketName, loadingBucket, dispatch, anonymousMode, requestInProgress]);

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

  const uploadObject = useCallback(
    (files: File[], folderPath: string): void => {
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
            // xhr.setRequestHeader("X-Anonymous", "1");

            const areMultipleFiles = files.length > 1;
            let errorMessage = areMultipleFiles
              ? t("An error occurred while uploading the files.")
              : t("An error occurred while uploading the file.");

            const errorMessages: any = {
              413: t("Error - File size too large"),
            };

            xhr.withCredentials = false;
            xhr.onload = function () {
              // resolve promise only when HTTP code is ok
              if (xhr.status >= 200 && xhr.status < 300) {
                dispatch(completeObject(identity));
                resolve({ status: xhr.status });

                removeTrace(ID);
              } else {
                // reject promise if there was a server error
                if (errorMessages[xhr.status]) {
                  errorMessage = errorMessages[xhr.status];
                } else if (xhr.response) {
                  try {
                    const err = JSON.parse(xhr.response);
                    errorMessage = err.detailedMessage;
                  } catch (e) {
                    errorMessage = t("something went wrong");
                  }
                }

                dispatch(
                  failObject({
                    instanceID: identity,
                    msg: errorMessage,
                  }),
                );
                reject({ status: xhr.status, message: errorMessage });

                removeTrace(ID);
              }
            };

            xhr.upload.addEventListener("error", () => {
              reject(errorMessage);
              dispatch(
                failObject({
                  instanceID: identity,
                  msg: "A network error occurred.",
                }),
              );
              return;
            });

            xhr.upload.addEventListener("progress", (event) => {
              const progress = Math.floor((event.loaded * 100) / event.total);

              dispatch(
                updateProgress({
                  instanceID: identity,
                  progress: progress,
                }),
              );
            });

            xhr.onerror = () => {
              reject(errorMessage);
              dispatch(
                failObject({
                  instanceID: identity,
                  msg: "A network error occurred.",
                }),
              );
              return;
            };
            xhr.onloadend = () => {
              if (files.length === 0) {
                dispatch(setReloadObjectsList(true));
              }
            };
            xhr.onabort = () => {
              dispatch(cancelObjectInList(identity));
            };

            const formData = new FormData();
            if (file.size !== undefined) {
              formData.append(file.size.toString(), blobFile, fileName);
              storeCallForObjectWithID(ID, xhr);
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
              storeFormDataWithID(ID, formData);
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
        Promise.allSettled(uploadFilePromises).then((results: Array<any>) => {
          const errors = results.filter(
            (result) => result.status === "rejected",
          );
          if (errors.length > 0) {
            const totalFiles = uploadFilePromises.length;
            const successUploadedFiles =
              uploadFilePromises.length - errors.length;
            const err: ErrorResponseHandler = {
              errorMessage: t("There were some errors during file upload"),
              detailedError: t("Uploaded files {done}/{total}")
                .replace("{done}", () => String(successUploadedFiles))
                .replace("{total}", () => String(totalFiles)),
            };
            dispatch(setErrorSnackMessage(err));
          }
          // We force objects list reload after all promises were handled
          dispatch(setReloadObjectsList(true));
        });
      };

      upload(files, bucketName, pathPrefix, folderPath);
    },
    [bucketName, dispatch, simplePath, anonymousMode, t],
  );

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
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
    dispatch(setSelectedObjectView(null));
    dispatch(setVersionsModeEnabled({ status: false }));
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
    }

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

  let createdTime = DateTime.now();

  if (bucketInfo?.creation_date) {
    createdTime = DateTime.fromISO(bucketInfo.creation_date) as DateTime<true>;
  }

  const downloadToolTip =
    selectedObjects?.length <= 1
      ? t("Download Selected")
      : t(
          "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.",
        );

  const multiActionButtons = [
    {
      action: () => {
        dispatch(downloadSelected(bucketName));
      },
      label: t("Download"),
      disabled: !canDownload || isSelObjectDelMarker,
      icon: <DownloadIcon />,
      tooltip: canDownload
        ? downloadToolTip
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
            t("download objects from this bucket"),
          ),
    },
    {
      action: () => {
        dispatch(openShare());
      },
      label: t("Share"),
      disabled:
        selectedObjects.length !== 1 || !canShareFile || isSelObjectDelMarker,
      icon: <ShareIcon />,
      tooltip: canShareFile
        ? t("Share Selected File")
        : t("Sharing unavailable"),
    },
    {
      action: () => {
        dispatch(openPreview());
      },
      label: t("Preview"),
      disabled:
        selectedObjects.length !== 1 || !canPreviewFile || isSelObjectDelMarker,
      icon: <PreviewIcon />,
      tooltip: canPreviewFile
        ? t("Preview Selected File")
        : t("Preview unavailable"),
    },
    {
      action: () => {
        dispatch(openAnonymousAccess());
      },
      label: t("Anonymous Access"),
      disabled:
        selectedObjects.length !== 1 ||
        !selectedObjects[0].endsWith("/") ||
        !canSetAnonymousAccess,
      icon: <AccessRuleIcon />,
      tooltip:
        selectedObjects.length === 1 && selectedObjects[0].endsWith("/")
          ? t("Set Anonymous Access to this Folder")
          : t("Anonymous Access unavailable"),
    },
    {
      action: () => {
        setDeleteMultipleOpen(true);
      },
      label: t("Delete"),
      icon: <DeleteIcon />,
      disabled: !canDelete || selectedObjects.length === 0,
      tooltip: canDelete
        ? t("Delete Selected Files")
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_DELETE_OBJECT, IAM_SCOPES.S3_DELETE_ACTIONS],
            t("delete objects in this bucket"),
          ),
    },
  ];

  return (
    <Fragment>
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
      {deleteMultipleOpen && (
        <DeleteMultipleObjects
          deleteOpen={deleteMultipleOpen}
          selectedBucket={bucketName}
          selectedObjects={selectedObjects}
          closeDeleteModalAndRefresh={closeDeleteMultipleModalAndRefresh}
          versioning={versioningConfig}
        />
      )}
      {rewindSelect && (
        <RewindEnable
          open={rewindSelect}
          closeModalAndRefresh={rewindCloseModal}
          bucketName={bucketName}
        />
      )}
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
      {anonymousAccessOpen && (
        <AddAccessRule
          onClose={closeAddAccessRule}
          bucket={bucketName}
          modalOpen={anonymousAccessOpen}
          prefilledRoute={`${selectedObjects[0]}*`}
        />
      )}

      <PageLayout variant={"full"}>
        {anonymousMode && (
          <div style={{ paddingBottom: 16 }}>
            <FilterObjectsSB />
          </div>
        )}
        <Box withBorders sx={{ padding: "0 5px" }}>
          <ScreenTitle
            icon={
              <span>
                <BucketsIcon style={{ width: 30 }} />
              </span>
            }
            title={bucketName}
            subTitle={
              !anonymousMode ? (
                <Box
                  sx={{
                    "& .detailsSpacer": {
                      marginRight: 18,
                      "@media (max-width: 600px)": {
                        marginRight: 0,
                      },
                    },
                  }}
                >
                  <span className={"detailsSpacer"}>
                    {t("Created on:")}&nbsp;
                    <strong>
                      {bucketInfo?.creation_date
                        ? createdTime.toFormat("yyyy-MM-dd HH:mm:ss (ZZZZ)")
                        : ""}
                    </strong>
                  </span>
                  <span className={"detailsSpacer"}>
                    {t("Access:")}&nbsp;&nbsp;
                    <strong>{bucketInfo?.access || ""}</strong>
                  </span>
                  {bucketInfo && (
                    <Fragment>
                      <span className={"detailsSpacer"}>
                        {bucketInfo.size && (
                          <Fragment>{niceBytesInt(bucketInfo.size)}</Fragment>
                        )}
                        {bucketInfo.size && quota && (
                          <Fragment>
                            {" "}
                            / {niceBytesInt(quota.quota || 0)}
                          </Fragment>
                        )}
                        {bucketInfo.size && bucketInfo.objects ? " - " : ""}
                        {bucketInfo.objects && (
                          <Fragment>
                            {(bucketInfo.objects === 1
                              ? t("{count} Object")
                              : t("{count} Objects")
                            ).replace("{count}", () =>
                              String(bucketInfo.objects),
                            )}
                          </Fragment>
                        )}
                      </span>
                    </Fragment>
                  )}
                </Box>
              ) : null
            }
            actions={
              <Fragment>
                {!anonymousMode && (
                  <TooltipWrapper
                    tooltip={
                      canRewind
                        ? t("Rewind Bucket")
                        : permissionTooltipHelper(
                            [
                              IAM_SCOPES.S3_GET_OBJECT,
                              IAM_SCOPES.S3_GET_ACTIONS,
                              IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
                            ],
                            t("apply rewind in this bucket"),
                          )
                    }
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
                      disabled={!isVersioningApplied || !canRewind}
                    />
                  </TooltipWrapper>
                )}
                <TooltipWrapper tooltip={t("Reload List")}>
                  <Button
                    id={"refresh-objects-list"}
                    label={t("Refresh")}
                    icon={<RefreshIcon />}
                    variant={"regular"}
                    onClick={() => {
                      if (versionsMode) {
                        dispatch(setLoadingVersions(true));
                      } else {
                        dispatch(resetMessages());
                        dispatch(setReloadObjectsList(true));
                      }
                    }}
                    disabled={
                      anonymousMode
                        ? false
                        : !hasPermission(bucketName, [
                            IAM_SCOPES.S3_LIST_BUCKET,
                            IAM_SCOPES.S3_ALL_LIST_BUCKET,
                          ]) || rewindEnabled
                    }
                  />
                </TooltipWrapper>
                <input
                  type="file"
                  multiple
                  accept={
                    allowedFileExtensions ? allowedFileExtensions : undefined
                  }
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
              </Fragment>
            }
            bottomBorder={false}
          />
        </Box>
        <div
          id="object-list-wrapper"
          {...getRootProps({ style: { ...dndStyles } })}
        >
          <input {...getInputProps()} />
          <Box
            withBorders
            sx={{
              display: "flex",
              borderTop: 0,
              padding: 0,
              "& .hideListOnSmall": {
                "@media (max-width: 799px)": {
                  display: "none",
                },
              },
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
                    "&.detailsOpen": {
                      "@media (max-width: 799px)": {
                        display: "none",
                      },
                    },
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
                  <ListObjectsTable />
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
                  open={detailsOpen}
                  closePanel={() => {
                    onClosePanel(false);
                  }}
                  className={`${versionsMode ? "hideListOnSmall" : ""}`}
                >
                  {selectedObjects.length > 0 && (
                    <ActionsList
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
    </Fragment>
  );
};

export default ListObjects;
