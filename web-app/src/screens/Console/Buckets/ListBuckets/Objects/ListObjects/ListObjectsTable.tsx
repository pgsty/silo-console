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

import HeaderIconButton from "../../../../Common/PageHeaderWrapper/HeaderIconButton";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { listModeColumns, rewindModeColumns } from "./ListObjectsHelpers";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../../../../store";
import { selFeatures } from "../../../../consoleSlice";
import {
  setPreviewOpen,
  setSelectedObjects,
  setSelectedObjectView,
  setSelectedPreview,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import {
  ObjectSortField,
  visiblePageObjects,
} from "../../../../ObjectBrowser/objectPaging";
import ObjectPager from "../../../../ObjectBrowser/ObjectPager";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import get from "lodash/get";
import { resolveAnonymousOpen } from "../Preview/anonymousPreview";
import { PreviewRequestGeneration } from "../Preview/textPreview";
import { BucketObjectItem } from "./types";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../../../common/SecureComponent";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import { DataTable, ItemActions, useModalActive } from "mds";
import { BucketObject } from "api/consoleApi";
import { formatText, useT } from "i18n";
import { api } from "api";

import { ContextMenu, ContextAction } from "common/ui/ContextMenu";
import { openShortcutHelp } from "common/ui/ShortcutHelp";
import { useOverlayPending } from "common/ui/overlayIntent";
import { niceBytes } from "common/utils";
import { setSnackBarMessage } from "systemSlice";
import { routeObjectIdentity } from "../objectIdentity";
import { captureTaskSession } from "../../../../ObjectBrowser/transferManager";
import { ObjectRowMenu } from "./ObjectRowMenu";
import { usePrefixUsage } from "../../../../ObjectBrowser/usePrefixUsage";
import { PrefixUsagePanel } from "../../../../ObjectBrowser/PrefixUsagePanel";
import { formatUsageBytes } from "../../../../ObjectBrowser/prefixUsage";

import {
  keyAction,
  moveIndex,
  rangeSelection,
  toggleSelection,
  parentPrefix,
  objectPath,
  typingTarget,
  interactiveTarget,
} from "./objectKeyboard";

const ListObjectsTable = ({
  filterRef,
  emptyActions,
  usageRefresh,
}: {
  filterRef: React.RefObject<HTMLInputElement>;
  emptyActions: () => ContextAction[];
  usageRefresh?: { bucket: string; prefix: string; id: number };
}) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const modalActive = useModalActive();
  const overlayPending = useOverlayPending();
  const listRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState(0);
  const range = useRef<{ anchor: string; base: string[] } | null>(null);
  const pointerOrigin = useRef<string | null>(null);
  const menuInvocation = useRef(0);
  const [menu, setMenu] = useState<{
    object: BucketObjectItem | null;
    anchor: HTMLElement;
    point?: { x: number; y: number };
    open: boolean;
    preview?: boolean;
    invocation: number;
    pendingPreview: boolean;
  } | null>(null);
  const simplePath = useSelector(
    (state: AppState) => state.objectBrowser.simplePath,
  );
  const pageIndex = useSelector(
    (state: AppState) => state.objectBrowser.objectPage.pageIndex,
  );
  const managerOpen = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.managerOpen,
  );
  const blocked = modalActive || overlayPending || managerOpen;
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;
  const currentSession = useRef(captureTaskSession());

  const [sortDirection, setSortDirection] = useState<
    "ASC" | "DESC" | undefined
  >("ASC");
  const [currentSortField, setCurrentSortField] =
    useState<ObjectSortField>("name");
  const anonymousOpenGeneration = useRef(new PreviewRequestGeneration());
  const anonymousMetadataController = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      anonymousMetadataController.current?.abort();
      anonymousOpenGeneration.current.invalidate();
    },
    [],
  );

  const bucketName = params.bucketName || "";

  const detailsOpen = useSelector(
    (state: AppState) => state.objectBrowser.objectDetailsOpen,
  );

  const requestInProgress = useSelector(
    (state: AppState) => state.objectBrowser.requestInProgress,
  );

  const features = useSelector(selFeatures);
  const obOnly = !!features?.includes("object-browser-only");

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled,
  );
  const records = useSelector((state: AppState) => state.objectBrowser.records);
  const pageComplete = useSelector(
    (state: AppState) => state.objectBrowser.objectPage.complete,
  );
  const searchObjects = useSelector(
    (state: AppState) => state.objectBrowser.searchObjects,
  );
  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
  );
  const connectionError = useSelector(
    (state: AppState) => state.objectBrowser.connectionError,
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );
  const usageEnabled =
    !anonymousMode &&
    !rewindEnabled &&
    hasPermission(bucketName, [IAM_SCOPES.S3_LIST_BUCKET]);
  const usage = usePrefixUsage(bucketName, simplePath || "", usageEnabled);
  const [usageVersions, setUsageVersions] = useState(false);
  const handledRefresh = useRef<number>();
  useEffect(() => {
    if (
      !usageRefresh ||
      handledRefresh.current === usageRefresh.id ||
      usageRefresh.bucket !== bucketName ||
      usageRefresh.prefix !== (simplePath || "")
    )
      return;
    handledRefresh.current = usageRefresh.id;
    if (usageEnabled)
      void usage.start(
        simplePath || "",
        usageVersions &&
          hasPermission(bucketName, [IAM_SCOPES.S3_LIST_BUCKET_VERSIONS]),
        true,
      );
  }, [
    usageRefresh,
    bucketName,
    simplePath,
    usageEnabled,
    usageVersions,
    usage.start,
  ]);
  const folderUsage = (name: string) => {
    const frame = usage.scan?.frame;
    if (!usageEnabled || !frame) return undefined;
    const stats =
      frame.prefix === name
        ? frame.totals
        : frame.folders.find((folder) => folder.prefix === name)?.usage;
    if (!stats) return undefined;
    const complete =
      frame.status === "complete" &&
      !usage.scan?.outcome &&
      !usage.scan?.running;
    return {
      stats,
      complete,
      at: frame.updated_at,
      versions: frame.mode === "versions",
    };
  };
  const folderSize = (name: string) => {
    const value = folderUsage(name);
    return value
      ? `${value.complete ? "" : "≥ "}${formatUsageBytes(value.stats.current_bytes)}${value.complete ? "" : ` (${t("Partial")})`}`
      : t("Size unavailable");
  };

  const folderBytes = useMemo(() => {
    const frame = usageEnabled ? usage.scan?.frame : undefined;
    const values = new Map<string, string>();
    if (frame) {
      for (const folder of frame.folders)
        values.set(folder.prefix, folder.usage.current_bytes);
      if (frame.prefix) values.set(frame.prefix, frame.totals.current_bytes);
    }
    return values;
  }, [usageEnabled, usage.scan?.frame]);

  const displayListObjects = hasPermission(bucketName, [
    IAM_SCOPES.S3_LIST_BUCKET,
    IAM_SCOPES.S3_ALL_LIST_BUCKET,
  ]);

  // The filter and the sort act on the committed page in memory; neither
  // reaches the server. When the page is the whole directory they cover the
  // whole directory, otherwise this page only.
  const payload: BucketObjectItem[] = useMemo(
    () =>
      visiblePageObjects(
        records,
        searchObjects,
        currentSortField,
        sortDirection,
        folderBytes,
      ),
    [records, searchObjects, currentSortField, sortDirection, folderBytes],
  );

  const openPath = async (object: BucketObject, previewOnly = false) => {
    anonymousMetadataController.current?.abort();
    anonymousMetadataController.current = null;
    const generation = anonymousOpenGeneration.current.begin();
    const idElement = object.name || "";
    const newPath = `/browser/${encodeURIComponent(bucketName)}${
      idElement ? `/${encodeURIComponent(idElement)}` : ``
    }`;

    // for anonymous start download
    if (anonymousMode && !object.name?.endsWith("/")) {
      const controller = new AbortController();
      anonymousMetadataController.current = controller;
      const decision = await resolveAnonymousOpen({
        object,
        isCurrent: () =>
          !blockedRef.current &&
          currentSession.current() &&
          !controller.signal.aborted &&
          anonymousOpenGeneration.current.isCurrent(generation),
        loadMetadata: async () => {
          const response = await api.buckets.getObjectMetadata(
            bucketName,
            {
              prefix: idElement,
              ...(object.version_id ? { versionID: object.version_id } : {}),
            },
            {
              headers: { "X-Anonymous": "1" },
              signal: controller.signal,
            },
          );
          return get(response.data, "objectMetadata", {});
        },
      });

      if (decision === "stale") {
        return;
      }

      if (decision === "preview") {
        dispatch(setSelectedPreview(object as BucketObjectItem));
        dispatch(setPreviewOpen(true));
        return;
      }

      if (!previewOnly) downloadObject(dispatch, bucketName, idElement, object);
      return;
    }
    // BrowserHandler commits selection/details only after the Router accepts
    // navigation. A task departure cancellation must leave this view intact.
    navigate(newPath);
  };
  const tableActions: ItemActions[] = [
    {
      type: "view",
      tooltip: t("View"),
      onClick: openPath,
      sendOnlyId: false,
    },
  ];

  const ids = payload.map((item) => item.name);
  const order = JSON.stringify(ids);
  const scope = JSON.stringify([
    bucketName,
    simplePath,
    pageIndex,
    searchObjects,
  ]);
  const previousScope = useRef(scope);
  useEffect(() => {
    range.current = null;
    const sameScope = previousScope.current === scope;
    previousScope.current = scope;
    setActiveId((current) =>
      sameScope && current && ids.includes(current) ? current : ids[0] || null,
    );
    setMenu(null);
  }, [scope, order]);
  useEffect(() => {
    setMenu(null);
  }, [location.key]);
  useEffect(() => {
    if (blocked)
      setMenu((current) =>
        current && !current.pendingPreview ? { ...current, open: false } : null,
      );
  }, [blocked]);
  useEffect(() => {
    const discover = (event: KeyboardEvent) => {
      if (blocked || menu?.open || typingTarget(event.target)) return;
      const action = keyAction(event);
      if (action !== "help" && action !== "filter") return;
      event.preventDefault();
      if (action === "help") openShortcutHelp();
      else filterRef.current?.focus();
    };
    document.addEventListener("keydown", discover);
    return () => document.removeEventListener("keydown", discover);
  }, [blocked, menu?.open, filterRef]);
  const choose = (selection: string[]) => {
    dispatch(setSelectedObjects(selection));
    dispatch(setSelectedObjectView(null));
  };
  const focus = (id: string | null) => {
    setActiveId(id);
    setFocusRequest((value) => value + 1);
  };
  const extend = (id: string, origin: string) => {
    if (!range.current)
      range.current = { anchor: origin, base: [...selectedObjects] };
    choose(rangeSelection(ids, range.current.anchor, id, range.current.base));
  };
  const openMenu = (
    object: BucketObjectItem | null,
    anchor: HTMLElement,
    point?: { x: number; y: number },
    preview = false,
  ) => {
    if (blocked) return;
    if (object) setActiveId(object.name);
    setMenu({
      object,
      anchor,
      point,
      open: !preview,
      preview,
      invocation: ++menuInvocation.current,
      pendingPreview: preview,
    });
  };
  const handleKey = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number,
    pageSize: number,
  ) => {
    if (blocked) {
      if (
        !typingTarget(event.target) &&
        !interactiveTarget(event.target) &&
        keyAction(event)
      )
        event.preventDefault();
      return;
    }
    if (
      menu?.open ||
      typingTarget(event.target) ||
      interactiveTarget(event.target)
    )
      return;
    const action = keyAction({
      ...event,
      isComposing: event.nativeEvent.isComposing,
    });
    if (!action) return;
    event.preventDefault();
    event.stopPropagation();
    const item = payload[index];
    if (
      ["up", "down", "first", "last", "pageUp", "pageDown"].includes(action)
    ) {
      const next = moveIndex(index, payload.length, action, pageSize);
      if (next < 0) return;
      if (event.shiftKey && !anonymousMode)
        extend(ids[next], activeId || ids[next]);
      else range.current = null;
      focus(ids[next]);
    } else if (action === "open" && item) void openPath(item);
    else if (action === "toggle" && item && !anonymousMode) {
      range.current = null;
      choose(toggleSelection(selectedObjects, item.name));
    } else if (action === "all" && !anonymousMode) {
      range.current = null;
      choose(ids);
      dispatch(
        setSnackBarMessage(
          formatText(t("Selected {count} objects on this page."), {
            count: ids.length,
          }),
        ),
      );
    } else if (action === "parent") {
      const key = routeObjectIdentity(location.pathname, bucketName).key;
      if (key) navigate(objectPath(bucketName, parentPrefix(key)));
    } else if (action === "escape") {
      range.current = null;
      if (selectedObjects.length) choose([]);
      else {
        const key = routeObjectIdentity(location.pathname, bucketName).key;
        if (key && !key.endsWith("/"))
          navigate(objectPath(bucketName, parentPrefix(key)));
      }
      focus(activeId);
    } else if (action === "filter") filterRef.current?.focus();
    else if (action === "help") openShortcutHelp();
    else if (action === "menu")
      openMenu(
        item || null,
        event.target instanceof HTMLElement
          ? event.target
          : event.currentTarget,
      );
    else if (action === "preview" && item && !item.name.endsWith("/")) {
      openMenu(item, event.target as HTMLElement, undefined, true);
    }
  };

  // A column sort reorders the loaded page; it does not reload the listing.
  const sortChange = (sortData: any) => {
    const newSortDirection = get(sortData, "sortDirection", "DESC");
    setCurrentSortField(sortData.sortBy as ObjectSortField);
    setSortDirection(newSortDirection);
  };

  const selectAllItems = () => {
    dispatch(setSelectedObjectView(null));

    if (
      payload.length > 0 &&
      payload.every((item) => selectedObjects.includes(item.name))
    ) {
      dispatch(setSelectedObjects([]));
      return;
    }

    const elements = payload.map((item) => item.name);
    dispatch(setSelectedObjects(elements));
  };

  const selectListObjects = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selectedObjects]; // We clone the selectedBuckets array

    if (checked) {
      // If the user has checked this field we need to push this to selectedBucketsList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    dispatch(setSelectedObjects(elements));
    dispatch(setSelectedObjectView(null));

    return elements;
  };

  let errorMessage =
    !displayListObjects && !anonymousMode
      ? permissionTooltipHelper(
          [IAM_SCOPES.S3_LIST_BUCKET, IAM_SCOPES.S3_ALL_LIST_BUCKET],
          t("view Objects in this bucket"),
        )
      : !rewindEnabled
        ? t("This location is empty, please try uploading a new file")
        : t("This location is empty");

  // The page has rows, but none of them matches the filter. The pager below
  // the table stays usable, so the other pages can still be filtered.
  if (records.length > 0 && payload.length === 0) {
    errorMessage = pageComplete
      ? t("No objects match the filter")
      : t("No objects on this page match the filter");
  }

  if (connectionError) {
    errorMessage = t(
      "Objects List unavailable. Please review your WebSockets configuration and try again",
    );
  }

  // The pager takes the bottom of the space the table used to fill.
  let customPaperHeight = "calc(100vh - 336px)";

  if (obOnly) {
    customPaperHeight = "calc(100vh - 361px)";
  }

  return (
    <Fragment>
      {usageEnabled && (
        <PrefixUsagePanel
          usage={usage}
          prefix={simplePath || ""}
          versions={usageVersions}
          setVersions={setUsageVersions}
          canListVersions={hasPermission(bucketName, [
            IAM_SCOPES.S3_LIST_BUCKET_VERSIONS,
          ])}
        />
      )}
      <DataTable
        interaction={{
          activeId,
          focusRequest,
          listRef,
          onActiveChange: setActiveId,
          onRowRemoved: (_identity, element) => {
            if (menu?.open && menu.anchor === element) {
              setMenu(null);
              listRef.current?.focus({ preventScroll: true });
            }
          },
          rowLabel: (item: BucketObjectItem) =>
            `${item.name}, ${item.name.endsWith("/") ? t("Folder") : t("File")}, ${item.name.endsWith("/") ? folderSize(item.name) : niceBytes(String(item.size || 0))}`,
          onKeyDown: handleKey,
          onPointerDown: () => {
            pointerOrigin.current = activeId;
          },
          onClick: (event, item: BucketObjectItem, checkbox) => {
            const origin = pointerOrigin.current;
            pointerOrigin.current = null;
            if (blocked) return;
            if (!anonymousMode && event.shiftKey)
              extend(item.name, origin || activeId || item.name);
            else if (
              !anonymousMode &&
              (event.ctrlKey || event.metaKey || checkbox)
            ) {
              range.current = null;
              choose(toggleSelection(selectedObjects, item.name));
            } else {
              range.current = null;
              void openPath(item);
            }
            focus(item.name);
          },
          onContextMenu: (event, item: BucketObjectItem | null) => {
            if (blocked) return;
            event.preventDefault();
            openMenu(item, event.currentTarget, {
              x: event.clientX,
              y: event.clientY,
            });
          },
        }}
        itemActions={tableActions}
        columns={[
          ...(rewindEnabled ? rewindModeColumns(t) : listModeColumns(t)).map(
            (column) => {
              const adjusted =
                detailsOpen && column.priority === "medium"
                  ? { ...column, priority: "low" as const }
                  : column;
              if (rewindEnabled || column.elementKey !== "size")
                return adjusted;
              return {
                ...adjusted,
                width: 160,
                renderFunction: (item: BucketObjectItem) => {
                  if (!item.name.endsWith("/"))
                    return item.size === undefined
                      ? "-"
                      : niceBytes(String(item.size));
                  const value = folderUsage(item.name);
                  if (!value) return "-";
                  return (
                    <span
                      title={`${value.stats.current_bytes} B · ${value.stats.current_objects} ${t("Current objects")} · ${t("Calculated at")}: ${new Date(value.at).toLocaleString()}`}
                    >
                      {folderSize(item.name)}
                      {value.versions && (
                        <small
                          style={{ display: "block" }}
                          title={`${value.stats.retained_bytes} B`}
                        >
                          {t("Retained size")}:{" "}
                          {formatUsageBytes(value.stats.retained_bytes)}
                        </small>
                      )}
                    </span>
                  );
                },
              };
            },
          ),
          {
            label: t("Actions"),
            elementKey: "actions",
            priority: "high",
            width: 48,
            globalClass: "mds-row-actions",
            renderFullObject: true,
            renderFunction: (item: BucketObjectItem) => (
              <span
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <HeaderIconButton
                  tabIndex={-1}
                  aria-label={`${t("Object actions")}: ${item.name}`}
                  aria-haspopup="menu"
                  aria-expanded={Boolean(
                    menu?.open && menu.object?.name === item.name,
                  )}
                  onClick={(event) => openMenu(item, event.currentTarget)}
                >
                  <span aria-hidden="true">⋯</span>
                </HeaderIconButton>
              </span>
            ),
          },
        ]}
        isLoading={requestInProgress}
        entityName={t("Objects")}
        idField="name"
        records={payload}
        customPaperHeight={customPaperHeight}
        selectedItems={selectedObjects}
        onSelect={!anonymousMode ? selectListObjects : undefined}
        customEmptyMessage={errorMessage}
        sortEnabled={{
          currentSort: currentSortField,
          currentDirection: sortDirection,
          onSortClick: sortChange,
        }}
        onSelectAll={selectAllItems}
        selectAllLabel={t("Select all objects")}
        selectionLabel={(name) => `${t("Select")}: ${name}`}
        rowStyle={({ index }) => {
          if (payload[index]?.delete_flag) {
            return "deleted";
          }

          return "";
        }}
        sx={{
          minHeight: detailsOpen ? "100%" : "initial",
        }}
        noBackground
      />
      <ObjectPager />
      {menu &&
        (() => {
          const position = {
            ...menu,
            fallback: listRef.current,
            close: (reason: "dismiss" | "restore" | "action") => {
              setMenu((current) =>
                reason === "action" && current
                  ? { ...current, open: false }
                  : null,
              );
              if (reason === "restore") focus(activeId);
            },
          };
          return menu.object ? (
            <ObjectRowMenu
              key={menu.invocation}
              bucket={bucketName}
              object={menu.object}
              position={position}
              preview={menu.preview}
              onCalculateSize={
                usageEnabled && !usage.scan?.running
                  ? (name) =>
                      void usage.start(
                        name,
                        usageVersions &&
                          hasPermission(bucketName, [
                            IAM_SCOPES.S3_LIST_BUCKET_VERSIONS,
                          ]),
                        false,
                      )
                  : undefined
              }
              onPreviewReady={() =>
                setMenu((current) =>
                  current ? { ...current, pendingPreview: false } : null,
                )
              }
              onAnonymousPreview={() => {
                setMenu(null);
                void openPath(menu.object!, true);
              }}
              onVersions={() =>
                navigate(objectPath(bucketName, menu.object!.name), {
                  state: { objectVersions: menu.object!.name },
                })
              }
            />
          ) : (
            <ContextMenu
              {...position}
              label={t("Folder actions")}
              items={emptyActions()}
            />
          );
        })()}
    </Fragment>
  );
};
export default ListObjectsTable;
