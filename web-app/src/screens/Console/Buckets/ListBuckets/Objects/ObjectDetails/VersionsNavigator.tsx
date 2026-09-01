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
  breakPoints,
  Button,
  DeleteIcon,
  DeleteNonCurrentIcon,
  Grid,
  ProgressBar,
  RefreshIcon,
  ScreenTitle,
  Select,
  SelectMultipleIcon,
  VersionsIcon,
} from "mds";
import ShareFile from "./ShareFile";

import { niceBytesInt } from "../../../../../../common/utils";
import RestoreFileVersion from "./RestoreFileVersion";

import { AppState, useAppDispatch } from "../../../../../../store";
import FileVersionItem from "./FileVersionItem";
import PreviewFileModal from "../Preview/PreviewFileModal";
import DeleteNonCurrent from "../ListObjects/DeleteNonCurrent";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import DeleteSelectedVersions from "./DeleteSelectedVersions";
import {
  selDistSet,
  setErrorSnackMessage,
} from "../../../../../../systemSlice";
import {
  setLoadingObjectInfo,
  setLoadingVersions,
  setSelectedVersion,
  setVersionsLimit,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import { List, ListRowProps } from "react-virtualized";
import TooltipWrapper from "../../../../Common/TooltipWrapper/TooltipWrapper";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import { BucketObject } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { formatText, useT } from "i18n";
import { hasPermission } from "../../../../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { isPreviewAvailable } from "../utils";
import { exactObjectVersions } from "./objectVersions";
import {
  ObjectLocation,
  ObjectTarget,
  resolveObject,
  rowTarget,
  TaggedResult,
} from "../objectIdentity";
import { isAbortError, ObjectRequestGuard } from "../requestGuard";
import { shareSubjectKey } from "./shareSubject";

interface IVersionsNavigatorProps {
  internalPaths: string;
  bucketName: string;
}

interface RowAction {
  target: ObjectTarget;
  info: BucketObject;
}

const VersionsNavigator = ({
  internalPaths,
  bucketName,
}: IVersionsNavigatorProps) => {
  const dispatch = useAppDispatch();
  const t = useT();

  const searchVersions = useSelector(
    (state: AppState) => state.objectBrowser.searchVersions,
  );
  const loadingVersions = useSelector(
    (state: AppState) => state.objectBrowser.loadingVersions,
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion,
  );

  const versionsLimit = useSelector(
    (state: AppState) => state.objectBrowser.versionsLimit,
  );

  const distributedSetup = useSelector(selDistSet);
  const objectResources = [
    bucketName,
    internalPaths,
    [bucketName, internalPaths].join("/"),
  ];
  const canGetObjectVersion = hasPermission(objectResources, [
    IAM_SCOPES.S3_GET_OBJECT_VERSION,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);
  const [shareSubject, setShareSubject] = useState<ObjectTarget | null>(null);
  const [previewItem, setPreviewItem] = useState<RowAction | null>(null);
  const [restoreItem, setRestoreItem] = useState<RowAction | null>(null);
  const [deleteNonCurrentLocation, setDeleteNonCurrentLocation] =
    useState<ObjectLocation | null>(null);
  const [deleteTargets, setDeleteTargets] = useState<ObjectTarget[] | null>(
    null,
  );
  // The versions listing this navigator resolved, tagged with the bucket and
  // key it was requested for; every row action is validated against it.
  const [listResult, setListResult] =
    useState<TaggedResult<BucketObject> | null>(null);
  const [moreVersionsThanLimit, setMoreVersionsThanLimit] =
    useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>("date");
  const [selectEnabled, setSelectEnabled] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const listGuard = useRef(new ObjectRequestGuard<ObjectLocation>());

  const location = useMemo<ObjectLocation>(
    () => ({ bucket: bucketName, key: internalPaths }),
    [bucketName, internalPaths],
  );
  const versions = useMemo(
    () => (listResult?.kind === "versions" ? listResult.items : []),
    [listResult],
  );
  // Display only: the current version of the object, if the listing has it.
  const latest = useMemo(
    () =>
      resolveObject({ ...location, version: { kind: "latest" } }, listResult),
    [location, listResult],
  );
  const isLoaded = listResult !== null;

  // calculate object name to display
  const objectNameArray: string[] = internalPaths.split("/");

  useEffect(() => {
    const guard = listGuard.current;
    return () => {
      guard.invalidate();
    };
  }, []);

  useEffect(() => {
    if (!loadingVersions && listResult === null) {
      dispatch(setLoadingVersions(true));
    }
  }, [loadingVersions, listResult, dispatch]);

  useEffect(() => {
    if (!loadingVersions || internalPaths === "") {
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
        const result = exactObjectVersions<BucketObject>(
          get(res.data, "objects", []),
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
        dispatch(setLoadingVersions(false));
      })
      .catch((err) => {
        if (isAbortError(err) || !ticket.isCurrent()) {
          return;
        }
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        dispatch(setLoadingVersions(false));
      });
  }, [
    loadingVersions,
    bucketName,
    internalPaths,
    location,
    dispatch,
    distributedSetup,
    versionsLimit,
  ]);

  // Every row action goes through the validated identity of the clicked row:
  // same bucket, same key, concrete version from the current listing.
  const targetFor = (item: BucketObject): ObjectTarget | null =>
    rowTarget(location, listResult, item);

  const closeShareModal = () => {
    setShareSubject(null);
  };

  const onShareItem = (item: BucketObject) => {
    const target = targetFor(item);
    if (target) {
      setShareSubject(target);
    }
  };

  const onPreviewItem = (item: BucketObject) => {
    const target = targetFor(item);
    if (target) {
      setPreviewItem({ target, info: item });
    }
  };

  const onRestoreItem = (item: BucketObject) => {
    const target = targetFor(item);
    if (target) {
      setRestoreItem({ target, info: item });
    }
  };

  const onDownloadItem = (item: BucketObject) => {
    if (targetFor(item)) {
      downloadObject(dispatch, bucketName, internalPaths, item);
    }
  };

  const onGlobalClick = (item: BucketObject) => {
    const target = targetFor(item);
    dispatch(setSelectedVersion(target ? target.versionId : ""));
  };

  const filteredRecords = versions.filter((version) => {
    if (version.version_id) {
      return version.version_id.includes(searchVersions);
    }
    return false;
  });

  const closeRestoreModal = (reloadObjectData: boolean) => {
    setRestoreItem(null);

    if (reloadObjectData) {
      dispatch(setLoadingVersions(true));
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeDeleteNonCurrent = (reloadAfterDelete: boolean) => {
    setDeleteNonCurrentLocation(null);

    if (reloadAfterDelete) {
      dispatch(setLoadingVersions(true));
      dispatch(setSelectedVersion(""));
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeSelectedVersions = (reloadOnComplete: boolean) => {
    setDeleteTargets(null);

    if (reloadOnComplete) {
      dispatch(setLoadingVersions(true));
      dispatch(setSelectedVersion(""));
      dispatch(setLoadingObjectInfo(true));
      setSelectedItems([]);
    }
  };

  const openDeleteSelectedVersions = () => {
    // Captured when the dialog opens: only ids that still resolve against the
    // current listing become targets; stale ids are dropped.
    const targets = selectedItems.flatMap((versionID) => {
      const row = versions.find((version) => version.version_id === versionID);
      const target = row ? targetFor(row) : null;
      return target ? [target] : [];
    });
    setDeleteTargets(targets);
  };

  const totalSpace = versions.reduce((acc: number, currValue: BucketObject) => {
    if (currValue.size) {
      return acc + currValue.size;
    }
    return acc;
  }, 0);

  filteredRecords.sort((a, b) => {
    switch (sortValue) {
      case "size":
        if (a.size && b.size) {
          if (a.size < b.size) {
            return -1;
          }
          if (a.size > b.size) {
            return 1;
          }
          return 0;
        }
        return 0;
      default:
        const dateA = new Date(a.last_modified || "").getTime();
        const dateB = new Date(b.last_modified || "").getTime();

        if (dateA < dateB) {
          return 1;
        }
        if (dateA > dateB) {
          return -1;
        }
        return 0;
    }
  });

  const onCheckVersion = (selectedVersion: string) => {
    if (selectedItems.includes(selectedVersion)) {
      const filteredItems = selectedItems.filter(
        (element) => element !== selectedVersion,
      );

      setSelectedItems(filteredItems);

      return;
    }

    const cloneState = [...selectedItems];
    cloneState.push(selectedVersion);

    setSelectedItems(cloneState);
  };

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }: ListRowProps) => {
    const versOrd = versions.length - index;
    return (
      <FileVersionItem
        style={style}
        key={key}
        fileName={internalPaths}
        versionInfo={filteredRecords[index]}
        index={versOrd}
        onDownload={onDownloadItem}
        onRestore={onRestoreItem}
        onShare={onShareItem}
        onPreview={onPreviewItem}
        canPreview={isPreviewAvailable({
          metaData: filteredRecords[index].content_type
            ? { "Content-Type": filteredRecords[index].content_type }
            : null,
          objectName: internalPaths,
          canGetObject: canGetObjectVersion,
          isDeleteMarker: !!filteredRecords[index].is_delete_marker,
          isPrefix: internalPaths.endsWith("/"),
        })}
        globalClick={onGlobalClick}
        isSelected={selectedVersion === filteredRecords[index].version_id}
        checkable={selectEnabled}
        onCheck={onCheckVersion}
        isChecked={selectedItems.includes(
          filteredRecords[index].version_id || "",
        )}
      />
    );
  };

  return (
    <Fragment>
      {shareSubject && (
        <ShareFile
          key={shareSubjectKey(shareSubject)}
          open={true}
          closeModalAndRefresh={closeShareModal}
          subject={shareSubject}
        />
      )}
      {restoreItem && (
        <RestoreFileVersion
          restoreOpen={true}
          target={restoreItem.target}
          destination={location}
          versionInfo={restoreItem.info}
          onCloseAndUpdate={closeRestoreModal}
        />
      )}
      {previewItem && (
        <PreviewFileModal
          open={true}
          bucketName={bucketName}
          actualInfo={{
            name: previewItem.target.key,
            version_id: previewItem.target.versionId,
            size: previewItem.info.size,
            content_type: previewItem.info.content_type,
            last_modified: previewItem.info.last_modified || "",
          }}
          onClosePreview={() => {
            setPreviewItem(null);
          }}
        />
      )}
      {deleteNonCurrentLocation && (
        <DeleteNonCurrent
          deleteOpen={true}
          closeDeleteModalAndRefresh={closeDeleteNonCurrent}
          location={deleteNonCurrentLocation}
        />
      )}
      {deleteTargets && (
        <DeleteSelectedVersions
          deleteOpen={true}
          targets={deleteTargets}
          closeDeleteModalAndRefresh={closeSelectedVersions}
        />
      )}
      <Grid
        container
        sx={{
          width: "100%",
          padding: 10,
          "@media (max-width: 799px)": {
            minHeight: 800,
          },
        }}
      >
        {!isLoaded && (
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        )}

        {isLoaded && (
          <Fragment>
            <Grid item xs={12}>
              <BrowserBreadcrumbs
                bucketName={bucketName}
                internalPaths={internalPaths}
                hidePathButton={true}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                position: "relative",
                "& .detailsSpacer": {
                  marginRight: 18,
                  "@media (max-width: 600px)": {
                    marginRight: 0,
                  },
                },
                [`@media (max-width: ${breakPoints.md}px)`]: {
                  "&::before": {
                    display: "none",
                  },
                },
              }}
            >
              <ScreenTitle
                icon={
                  <span
                    style={{
                      display: "block",
                      marginTop: "-10px",
                    }}
                  >
                    <VersionsIcon style={{ width: 20, height: 20 }} />
                  </span>
                }
                title={formatText(t("{object} Versions"), {
                  object:
                    objectNameArray.length > 0
                      ? objectNameArray[objectNameArray.length - 1]
                      : internalPaths,
                })}
                subTitle={
                  <Fragment>
                    <span className={"detailsSpacer"}>
                      <strong>
                        {formatText(
                          versions.length === 1
                            ? t("{count} Version")
                            : t("{count} Versions"),
                          {
                            count: `${versions.length}${
                              moreVersionsThanLimit ? "+" : ""
                            }`,
                          },
                        )}
                        &nbsp;&nbsp;&nbsp;
                      </strong>
                    </span>
                    <span className={"detailsSpacer"}>
                      <strong>
                        {niceBytesInt(totalSpace)}
                        {moreVersionsThanLimit ? "+" : ""}
                      </strong>
                    </span>
                    {moreVersionsThanLimit && (
                      <TooltipWrapper tooltip={t("Load more Versions")}>
                        <Button
                          label={t("Load more")}
                          id={"load-more-versions"}
                          onClick={() => {
                            dispatch(setVersionsLimit(versionsLimit + 10));
                            closeSelectedVersions(true);
                          }}
                          icon={<RefreshIcon />}
                          variant={"regular"}
                          style={{ marginLeft: 50 }}
                        />
                      </TooltipWrapper>
                    )}
                  </Fragment>
                }
                actions={
                  <Fragment>
                    <TooltipWrapper tooltip={t("Select Multiple Versions")}>
                      <Button
                        id={"select-multiple-versions"}
                        onClick={() => {
                          setSelectEnabled(!selectEnabled);
                        }}
                        icon={<SelectMultipleIcon />}
                        variant={selectEnabled ? "callAction" : "regular"}
                        style={{ marginRight: 8 }}
                      />
                    </TooltipWrapper>
                    {selectEnabled && (
                      <TooltipWrapper tooltip={t("Delete Selected Versions")}>
                        <Button
                          id={"delete-multiple-versions"}
                          onClick={openDeleteSelectedVersions}
                          icon={<DeleteIcon />}
                          variant={"secondary"}
                          style={{ marginRight: 8 }}
                          disabled={selectedItems.length === 0}
                        />
                      </TooltipWrapper>
                    )}
                    <TooltipWrapper tooltip={t("Delete Non Current Versions")}>
                      <Button
                        id={"delete-non-current"}
                        onClick={() => {
                          setDeleteNonCurrentLocation(location);
                        }}
                        icon={<DeleteNonCurrentIcon />}
                        variant={"secondary"}
                        style={{ marginRight: 15 }}
                        disabled={versions.length <= 1}
                      />
                    </TooltipWrapper>
                    <Select
                      id={"sort-by"}
                      options={[
                        { label: t("Date"), value: "date" },
                        {
                          label: t("Size"),
                          value: "size",
                        },
                      ]}
                      value={sortValue}
                      label={t("Sort by")}
                      onChange={(newValue) => {
                        setSortValue(newValue);
                      }}
                      noLabelMinWidth
                    />
                  </Fragment>
                }
                bottomBorder={false}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                flexGrow: 1,
                height: "calc(100% - 120px)",
                overflow: "auto",
                [`@media (max-width: ${breakPoints.md}px)`]: {
                  height: 600,
                },
              }}
            >
              {listResult?.kind === "versions" && latest !== null && (
                // @ts-ignore
                <List
                  style={{
                    width: "100%",
                  }}
                  containerStyle={{
                    width: "100%",
                    maxWidth: "100%",
                  }}
                  width={1}
                  height={800}
                  rowCount={filteredRecords.length}
                  rowHeight={108}
                  rowRenderer={rowRenderer}
                />
              )}
            </Grid>
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
};

export default VersionsNavigator;
