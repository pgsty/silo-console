// This file is part of MinIO Design System
// Copyright (c) 2023 MinIO, Inc.
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
  FC,
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Column,
  InfiniteLoader,
  SortDirectionType,
  Table,
} from "react-virtualized";
import styled from "styled-components";
import get from "lodash/get";
import isString from "lodash/isString";
import Checkbox from "../Checkbox/Checkbox";
import Loader from "../Loader/Loader";
import Grid from "../Grid/Grid";
import {
  DataTableProps,
  DataTableWrapperProps,
  IColumns,
  ISortConfig,
  ITableSortInfo,
} from "./DataTable.types";
import {
  calculateOptionsSize,
  elementActions,
  generateColumnsMap,
  selectWidth,
  sortRecords,
} from "./DataTable.utils";
import ViewColumnIcon from "../Icons/ViewColumnIcon";
import Box from "../Box/Box";
import Button from "../Button/Button";
import ColumnsSelector from "./ColumnsSelector";
import { priorityMediaQuery } from "./DataTable.logic";
import { useDensity } from "../../global/Density";
import { useFluidHover } from "../../global/useFluidHover";
import { FluidHoverHighlight } from "../../global/FluidHoverHighlight";
import { useTableRowHeight, useTableViewportWidth } from "./useTableLayout";

const DataTableWrapper = styled(Box)<DataTableWrapperProps>(
  ({ theme, customPaperHeight, disabled, noBackground, sx, rowHeight }) => ({
    display: "flex",
    minWidth: 0,
    overflow: "auto",
    flexDirection: "column",
    padding: "0 16px 8px",
    boxShadow: "var(--shadow-2, none)",
    border: 0,
    borderRadius: "var(--radius-card, 12px)",
    minHeight: 200,
    overflowY: "scroll",
    position: "relative",
    height: customPaperHeight || "calc(100vh - 205px)",
    backgroundColor: disabled
      ? get(theme, "dataTable.disabledBG", "transparent")
      : get(theme, "boxBackground", "#fff"),
    "&.noBackground": {
      backgroundColor: "transparent",
      border: 0,
      boxShadow: "none",
    },
    "&[role=group] [role=row]:focus-visible": {
      outline: "2px solid var(--focus-ring)",
      outlineOffset: -2,
    },
    "& .selectionHeaderLabel": {
      position: "absolute",
      width: 1,
      height: 1,
      overflow: "hidden",
      clipPath: "inset(50%)",
    },
    "& .loadingBox": {
      padding: "100px 0",
    },
    "& .overlayColumnSelection": {
      position: "absolute",
      insetInlineEnd: 0,
      top: 0,
      "& .popoverContent": {
        maxHeight: 250,
        overflowY: "auto",
        padding: "0 10px 10px",
        "& .shownColumnsLabel": {
          color: get(theme, "mainGrey", "#000"),
          fontSize: 12,
          padding: 10,
          borderBottom: `${get(
            theme,
            "dataTable.border",
            "#E2E2E2",
          )} 1px solid`,
          width: "100%",
        },
      },
    },
    "& .fluidTable": {
      position: "relative",
      height: "100%",
      minHeight: 0,
      flex: 1,
      overflow: "hidden",
      isolation: "isolate",
    },
    "& .fluidTableHover": {
      position: "absolute",
      inset: "var(--table-header-height, 36px) 0 0",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: -1,
    },
    "& .rowLine": {
      boxSizing: "border-box",
      borderBottom: `${get(theme, "dataTable.border", "#E2E2E2")} 1px solid`,
      height: rowHeight,
      fontSize: "var(--fs-body, 13px)",
      lineHeight: "var(--lh-body, 20px)",
      color: "var(--muted-foreground)",
      "&:focus": {
        outline: "initial",
      },
      transition:
        "border-color var(--dur-fast, 80ms) ease, color var(--dur-fast, 80ms) ease",
      "&.canClick": { cursor: "pointer" },
      "&.canSelectText": { userSelect: "text" },
      "&[data-fluid-hover], &[aria-selected=true]": {
        color: "var(--foreground)",
      },
      "&[data-fluid-hover], &[data-fluid-before]": {
        borderBottomColor: "transparent",
      },
      "&[aria-selected=true]": { background: "var(--active)" },
      "&:focus-visible": {
        outline: "2px solid var(--focus-ring)",
        outlineOffset: -2,
      },
      "& .selected": { color: "inherit", fontWeight: 400 },
    },
    "& .headerItem": {
      userSelect: "none",
      fontWeight: "var(--fw-semibold, 550)",
      fontSize: "var(--fs-body, 13px)",
      color: "var(--foreground)",
      fontStyle: "initial",
      display: "flex",
      alignItems: "center",
      outline: "none",
    },
    "& .sortHeader": {
      display: "flex",
      alignItems: "center",
      width: "100%",
      padding: 0,
      border: 0,
      background: "transparent",
      color: "inherit",
      font: "inherit",
      textAlign: "inherit",
      "& .sortLabel": {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    "& button.sortHeader": {
      cursor: "pointer",
      "@media (pointer: coarse)": { minHeight: 40 },
      "&:focus-visible": {
        outline: "2px solid var(--focus-ring, #6B97FF)",
        outlineOffset: -2,
      },
    },
    [priorityMediaQuery("medium")!]: {
      padding: "0 8px 8px",
      "& .mds-priority-medium": { display: "none" },
    },
    [priorityMediaQuery("low")!]: {
      "& .mds-priority-low": { display: "none" },
    },
    "& .ReactVirtualized__Table__row": {
      width: "100% !important",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    "& [data-fluid-first] .ReactVirtualized__Table__headerRow": {
      borderBottomColor: "transparent",
    },
    "& .ReactVirtualized__Table__headerRow": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      fontWeight: "var(--fw-semibold, 550)",
      fontSize: "var(--fs-body, 13px)",
      color: "var(--foreground)",
      borderColor: get(theme, "dataTable.border", "#39393980"),
      textTransform: "initial",
      transition: "border-color var(--dur-fast, 80ms) ease",
    },
    "& .ReactVirtualized__Table__headerTruncatedText": {
      display: "inline-block",
      maxWidth: "100%",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
    "& .ReactVirtualized__Table__headerColumn": {
      marginInlineEnd: 10,
      minWidth: 0,
      "&:first-of-type": {
        marginInlineStart: 10,
      },
      "& svg": {
        width: 12,
        height: 12,
        marginInlineStart: 4,
        flexShrink: 0,
      },
    },
    "& .ReactVirtualized__Table__rowColumn": {
      marginInlineEnd: 10,
      minWidth: 0,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      "&:first-of-type": {
        marginInlineStart: 10,
      },
    },
    "& .ReactVirtualized__Table__sortableHeaderColumn": {
      cursor: "pointer",
    },
    "&.responsiveColumns .ReactVirtualized__Table__headerColumn, &.responsiveColumns .ReactVirtualized__Table__rowColumn":
      {
        margin: 0,
        padding: "0 8px",
        boxSizing: "border-box",
      },
    "&.responsiveColumns .mds-selection, &.responsiveColumns .mds-row-actions":
      {
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
      },
    "& .ReactVirtualized__Table__sortableHeaderIconContainer": {
      display: "flex",
      alignItems: "center",
    },
    "& .ReactVirtualized__Table__sortableHeaderIcon": {
      flex: "0 0 24px",
      height: "1em",
      width: "1em",
      fill: "currentColor",
    },
    "& .optionsAlignment": {
      display: "flex",
      gap: 5,
      "& .min-icon": {
        width: 16,
        height: 16,
      },
    },
    "& .text-center": {
      textAlign: "center",
      "& .sortHeader": {
        justifyContent: "center",
      },
    },
    "& .text-right": {
      textAlign: "end",
      "& .sortHeader": {
        justifyContent: "flex-end",
      },
    },
    "& .progress-enabled": {
      display: "inline-flex",
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      width: 30,
      height: 30,
    },
    ...sx,
  }),
);

const TableRowPredefStyles: any = {
  deleted: {
    color: "#00000080",
    backgroundColor: "#f1f0f040",
    "&.selected": {
      color: "#b2b2b270",
    },
  },
};

// Measure the stable .fluidTable parent, whose layout does not depend on the
// virtual grid. Functional updates retain the latest size even when a hidden
// or zero-width frame and its restoration arrive before React commits either.
const TableSizer = ({
  children,
}: {
  children: (size: { width: number; height: number }) => React.ReactNode;
}) => {
  const element = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const parent = element.current?.parentElement;
    if (!parent) return;
    const measure = () => {
      const style = getComputedStyle(parent);
      const next = {
        width:
          parent.offsetWidth -
          (parseInt(style.paddingLeft, 10) || 0) -
          (parseInt(style.paddingRight, 10) || 0),
        height:
          parent.offsetHeight -
          (parseInt(style.paddingTop, 10) || 0) -
          (parseInt(style.paddingBottom, 10) || 0),
      };
      setSize((current) =>
        current.width === next.width && current.height === next.height
          ? current
          : next,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={element} style={{ width: 0, height: 0, overflow: "visible" }}>
      {children(size)}
    </div>
  );
};

// Main function to render the Table Wrapper
const DataTable: FC<DataTableProps> = ({
  interaction,
  itemActions,
  columns,
  onSelect,
  records,
  isLoading,
  loadingMessage = <h3>Loading...</h3>,
  loadingState,
  entityName,
  selectedItems,
  idField,
  customEmptyMessage = "",
  emptyState,
  customPaperHeight = "",
  noBackground = false,
  columnsSelector = false,
  textSelectable = false,
  columnsShown = [],
  onColumnChange = (column: string) => {},
  infiniteScrollConfig,
  autoScrollToBottom = false,
  disabled = false,
  onSelectAll,
  rowStyle,
  parentClassName = "",
  sx,
  rowHeight: requestedRowHeight,
  selectAllLabel = "Select all",
  selectionLabel,
  sortEnabled = false,
  sortCallBack,
  sortConfig,
  onSortChange,
}) => {
  const { controlHeight } = useDensity();
  const rowHeight = useTableRowHeight(requestedRowHeight);
  const headerHeight = useTableRowHeight(controlHeight);
  const viewportWidth = useTableViewportWidth();
  const tableBody = useRef<HTMLDivElement>(null);
  const rows = useRef(new Map<string, HTMLDivElement>());
  const rowRefs = useRef(
    new Map<string, (node: HTMLDivElement | null) => void>(),
  );
  const interactionRef = useRef(interaction);
  interactionRef.current = interaction;
  const [mountedActive, setMountedActive] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(-1);
  const activeIndex = records.findIndex(
    (row) => String(row[idField || ""]) === interaction?.activeId,
  );
  const focusRow = () => {
    const current = interactionRef.current;
    const row = current?.activeId ? rows.current.get(current.activeId) : null;
    (row || current?.listRef.current)?.focus({ preventScroll: true });
  };
  const rowRef = (identity: string) => {
    if (!rowRefs.current.has(identity)) {
      rowRefs.current.set(identity, (node) => {
        const old = rows.current.get(identity);
        const wasFocused = old === document.activeElement;
        if (node) rows.current.set(identity, node);
        else rows.current.delete(identity);
        const current = interactionRef.current;
        setMountedActive(
          Boolean(current?.activeId && rows.current.has(current.activeId)),
        );
        if (!node)
          requestAnimationFrame(() => {
            // A ref detach can be a rerender; only recover an actually removed row.
            if (old && !old.isConnected) {
              interactionRef.current?.onRowRemoved?.(identity, old);
              if (
                wasFocused &&
                (document.activeElement === document.body ||
                  !document.activeElement)
              )
                interactionRef.current?.listRef.current?.focus({
                  preventScroll: true,
                });
            }
          });
      });
    }
    return rowRefs.current.get(identity);
  };
  const focusRequest = interaction?.focusRequest;
  useEffect(() => {
    const identities = new Set(
      records.map((row) => String(row[idField || ""])),
    );
    for (const identity of rowRefs.current.keys()) {
      if (!identities.has(identity)) rowRefs.current.delete(identity);
    }
  }, [records, idField]);
  useLayoutEffect(() => {
    setMountedActive(
      Boolean(interaction?.activeId && rows.current.has(interaction.activeId)),
    );
  }, [interaction?.activeId]);
  useLayoutEffect(() => {
    if (!focusRequest) return;
    setScrollIndex(activeIndex);
    // Recovery belongs to this keyboard request only. A later Tab, pointer
    // action or focus transfer supersedes it, even if focus then leaves the DOM.
    const release = () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", cancel, true);
      document.removeEventListener("focusin", cancel, true);
    };
    const cancel = () => {
      cancelAnimationFrame(frame);
      release();
      setScrollIndex(-1);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") cancel();
    };
    const frame = requestAnimationFrame(() => {
      release();
      focusRow();
      setScrollIndex(-1);
    });
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", cancel, true);
    document.addEventListener("focusin", cancel, true);
    return () => {
      cancelAnimationFrame(frame);
      release();
    };
  }, [focusRequest]);
  const hover = useFluidHover(tableBody, {
    gapClick: false,
    disabled: autoScrollToBottom,
  });
  const [columnSelectorOpen, setColumnSelectorOpen] = useState<boolean>(false);
  const [currentSortColumn, setCurrentSortColumn] = useState<
    string | undefined
  >(undefined);
  const [currentSortDirection, setCurrentSortDirection] =
    useState<SortDirectionType>("ASC");

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const rowIDField = idField || "";

  const findView = itemActions
    ? itemActions.find((el) => el.type === "view")
    : null;

  const manualSortEnabled =
    sortEnabled &&
    typeof sortEnabled === "object" &&
    !Array.isArray(sortEnabled);

  // The new controlled API takes precedence over legacy sortEnabled. Both
  // manual APIs leave record ordering with the caller (including server sorts).
  const sortColumns: boolean | string[] | ISortConfig = sortConfig
    ? {
        currentSort: sortConfig.field,
        currentDirection: sortConfig.direction,
        onSortClick: ({ sortBy, sortDirection }) =>
          onSortChange?.(sortBy, sortDirection),
      }
    : sortEnabled;
  const noDataMessage =
    emptyState !== undefined
      ? emptyState
      : customEmptyMessage !== ""
        ? customEmptyMessage
        : `There are no ${entityName || "items"} yet.`;

  const clickAction = (rowItem: any) => {
    if (findView) {
      const valueClick =
        findView.sendOnlyId && idField ? rowItem[rowIDField] : rowItem;

      let disabled = false;

      if (!!findView.isDisabled) {
        if (typeof findView.isDisabled === "boolean") {
          disabled = findView.isDisabled;
        } else {
          disabled = findView.isDisabled(rowItem);
        }
      }

      if (findView.onClick && !disabled) {
        findView.onClick(valueClick);
      }
    }
  };

  const openColumnsSelector = (event: { currentTarget: any }) => {
    setColumnSelectorOpen(!columnSelectorOpen);
    setAnchorEl(event.currentTarget);
  };

  const closeColumnSelector = () => {
    setColumnSelectorOpen(false);
    setAnchorEl(null);
  };

  const columnsSelection = (columns: IColumns[]) => {
    return (
      <Box
        sx={{ margin: "10px 0 0", display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          id={"columns-selector"}
          variant={"regular"}
          icon={<ViewColumnIcon />}
          iconLocation={"end"}
          onClick={openColumnsSelector}
        >
          Columns
        </Button>
        <ColumnsSelector
          open={columnSelectorOpen}
          closeTriggerAction={closeColumnSelector}
          onSelect={(label) => onColumnChange(label)}
          columns={columns}
          selectedOptionIDs={columnsShown}
          anchorEl={anchorEl}
        />
      </Box>
    );
  };

  let tableSort: ((val: ITableSortInfo) => any) | undefined = undefined;
  let tableSortBy: string | undefined = undefined;
  let tableSortDirection: SortDirectionType | undefined = undefined;

  const onSortClick = (sort: ITableSortInfo) => {
    const newSortDirection = get(sort, "sortDirection", "DESC");
    setCurrentSortColumn(sort.sortBy);
    setCurrentSortDirection(newSortDirection);

    if (sortCallBack) {
      sortCallBack(sort);
    }
    onSortChange?.(sort.sortBy, newSortDirection);
  };

  if (sortEnabled) {
    if (manualSortEnabled) {
      tableSort = sortEnabled.onSortClick;
      tableSortBy = sortEnabled.currentSort;
      tableSortDirection = sortEnabled.currentDirection;
    } else {
      tableSort = onSortClick;
      tableSortBy = currentSortColumn;
      tableSortDirection = currentSortDirection;
    }
  }

  if (
    sortConfig &&
    typeof sortColumns === "object" &&
    !Array.isArray(sortColumns)
  ) {
    tableSort = sortColumns.onSortClick;
    tableSortBy = sortConfig.field;
    tableSortDirection = sortConfig.direction;
  }

  let sortedRecords = records;

  if (!sortConfig && sortEnabled && currentSortColumn && !manualSortEnabled) {
    sortedRecords = sortRecords(
      records,
      currentSortColumn,
      currentSortDirection,
    );
  }

  return (
    <Grid item xs={12} className={parentClassName}>
      <DataTableWrapper
        elementRef={interaction?.listRef}
        role={interaction ? "group" : undefined}
        aria-label={interaction ? entityName : undefined}
        tabIndex={
          interaction
            ? mountedActive && records.length && !isLoading
              ? -1
              : 0
            : undefined
        }
        onContextMenu={
          interaction
            ? (event) => interaction.onContextMenu(event, null)
            : undefined
        }
        onKeyDown={
          interaction
            ? (event) =>
                interaction.onKeyDown(
                  event,
                  activeIndex,
                  Math.max(
                    1,
                    Math.floor(
                      ((tableBody.current?.clientHeight || rowHeight * 8) -
                        headerHeight) /
                        rowHeight,
                    ),
                  ),
                )
            : undefined
        }
        aria-busy={isLoading || undefined}
        useBackground={!noBackground}
        className={`${noBackground ? "noBackground" : ""} ${columns.some((column) => column.priority) ? "responsiveColumns" : ""}`}
        style={
          {
            "--table-header-height": `${headerHeight}px`,
          } as React.CSSProperties
        }
        customPaperHeight={customPaperHeight}
        sx={sx}
        rowHeight={rowHeight}
      >
        {isLoading && loadingState !== undefined
          ? loadingState
          : isLoading && (
              <Grid container className={"loadingBox"}>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  {loadingMessage}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Loader />
                </Grid>
              </Grid>
            )}

        {columnsSelector && !isLoading && sortedRecords.length > 0 && (
          <Fragment>{columnsSelection(columns)}</Fragment>
        )}
        {sortedRecords && !isLoading && sortedRecords.length > 0 ? (
          <div ref={tableBody} className="fluidTable">
            <div className="fluidTableHover">
              <FluidHoverHighlight
                hover={hover}
                style={{ top: -headerHeight }}
              />
            </div>
            {/* @ts-ignore */}
            <InfiniteLoader
              isRowLoaded={({ index }) => !!sortedRecords[index]}
              loadMoreRows={
                infiniteScrollConfig
                  ? infiniteScrollConfig.loadMoreRecords
                  : () => new Promise(() => true)
              }
              rowCount={
                infiniteScrollConfig
                  ? infiniteScrollConfig.recordsCount
                  : sortedRecords.length
              }
            >
              {({ onRowsRendered, registerChild }) => (
                <TableSizer>
                  {({ width, height }) => {
                    const optionsWidth = calculateOptionsSize(
                      width,
                      itemActions
                        ? itemActions.filter((el) => el.type !== "view").length
                        : 0,
                    );
                    const hasSelect: boolean = !!(onSelect && selectedItems);
                    const hasOptions: boolean = !!(
                      (itemActions && itemActions.length > 1) ||
                      (itemActions &&
                        itemActions.length === 1 &&
                        itemActions[0].type !== "view")
                    );
                    return (
                      // @ts-ignore
                      <Table
                        style={{ width }}
                        tabIndex={interaction ? -1 : undefined}
                        ref={registerChild}
                        disableHeader={false}
                        headerClassName={"headerItem"}
                        headerHeight={headerHeight}
                        containerRole="presentation"
                        aria-label={entityName}
                        height={height}
                        noRowsRenderer={() => (
                          <Fragment>{noDataMessage}</Fragment>
                        )}
                        overscanRowCount={10}
                        rowHeight={rowHeight}
                        width={width}
                        rowCount={sortedRecords.length}
                        rowGetter={({ index }) => sortedRecords[index]}
                        rowRenderer={({
                          key,
                          index,
                          columns: cells,
                          rowData,
                          style,
                          className,
                        }) => {
                          const identity = isString(rowData)
                            ? rowData
                            : String(rowData[rowIDField] ?? index);
                          const canClick =
                            !!findView &&
                            !(typeof findView.isDisabled === "function"
                              ? findView.isDisabled(rowData)
                              : findView.isDisabled);
                          return (
                            <div
                              key={key}
                              ref={interaction ? rowRef(identity) : undefined}
                              role="row"
                              aria-rowindex={index + 2}
                              aria-label={
                                interaction
                                  ? interaction.rowLabel(rowData)
                                  : identity
                              }
                              aria-selected={selectedItems?.includes(identity)}
                              data-fluid-index={
                                !autoScrollToBottom &&
                                !(
                                  itemActions?.length &&
                                  itemActions.every(
                                    (action) => action.type === "delete",
                                  )
                                )
                                  ? index
                                  : undefined
                              }
                              data-fluid-key={identity}
                              data-fluid-activator={
                                canClick ? "true" : undefined
                              }
                              tabIndex={
                                interaction
                                  ? interaction.activeId === identity
                                    ? 0
                                    : -1
                                  : canClick
                                    ? 0
                                    : undefined
                              }
                              onFocus={
                                interaction
                                  ? (event) => {
                                      if (event.target === event.currentTarget)
                                        interaction.onActiveChange(identity);
                                    }
                                  : undefined
                              }
                              className={className}
                              style={style}
                              onPointerDown={interaction?.onPointerDown}
                              onClick={(event) =>
                                interaction
                                  ? interaction.onClick(event, rowData, false)
                                  : clickAction(rowData)
                              }
                              onContextMenu={
                                interaction
                                  ? (event) => {
                                      event.stopPropagation();
                                      interaction.onContextMenu(event, rowData);
                                    }
                                  : undefined
                              }
                              onKeyDown={(event) => {
                                if (interaction) return;
                                if (
                                  event.target === event.currentTarget &&
                                  (event.key === "Enter" || event.key === " ")
                                ) {
                                  event.preventDefault();
                                  clickAction(rowData);
                                }
                              }}
                            >
                              {cells}
                            </div>
                          );
                        }}
                        rowClassName={(r) =>
                          `rowLine ${findView ? "canClick" : ""} ${
                            !findView && textSelectable ? "canSelectText" : ""
                          } ${rowStyle ? rowStyle(r) : ""}`
                        }
                        onRowsRendered={onRowsRendered}
                        sort={tableSort}
                        sortBy={tableSortBy}
                        sortDirection={tableSortDirection}
                        scrollToIndex={
                          autoScrollToBottom
                            ? sortedRecords.length - 1
                            : interaction
                              ? scrollIndex
                              : -1
                        }
                        rowStyle={(r) => {
                          if (rowStyle) {
                            const returnElement = rowStyle(r);

                            if (typeof returnElement === "string") {
                              return get(
                                TableRowPredefStyles,
                                returnElement,
                                {},
                              );
                            }

                            return returnElement;
                          }

                          return {};
                        }}
                      >
                        {hasSelect && (
                          // @ts-ignore
                          <Column
                            headerRenderer={() => (
                              <Fragment>
                                {onSelectAll ? (
                                  <div className={"checkAllWrapper"}>
                                    <span className="selectionHeaderLabel">
                                      {selectAllLabel}
                                    </span>
                                    <Checkbox
                                      label={""}
                                      aria-label={selectAllLabel}
                                      tabIndex={interaction ? -1 : undefined}
                                      onChange={onSelectAll}
                                      value="all"
                                      id={"selectAll"}
                                      name={"selectAll"}
                                      checked={sortedRecords.every((record) =>
                                        selectedItems?.includes(
                                          isString(record)
                                            ? record
                                            : String(record[rowIDField]),
                                        ),
                                      )}
                                    />
                                  </div>
                                ) : (
                                  <Fragment>Select</Fragment>
                                )}
                              </Fragment>
                            )}
                            dataKey={`select-${rowIDField}`}
                            className="mds-selection"
                            headerClassName="mds-selection"
                            width={selectWidth}
                            flexShrink={0}
                            disableSort
                            cellRenderer={({ rowData }) => {
                              const isSelected = selectedItems
                                ? selectedItems.includes(
                                    isString(rowData)
                                      ? rowData
                                      : `${rowData[rowIDField]}`,
                                  )
                                : false;

                              return (
                                <Checkbox
                                  value={
                                    isString(rowData)
                                      ? rowData
                                      : `${rowData[rowIDField]}`
                                  }
                                  aria-label={
                                    selectionLabel
                                      ? selectionLabel(
                                          isString(rowData)
                                            ? rowData
                                            : String(rowData[rowIDField]),
                                        )
                                      : String(
                                          isString(rowData)
                                            ? rowData
                                            : rowData[rowIDField],
                                        )
                                  }
                                  color="primary"
                                  className="TableCheckbox"
                                  checked={isSelected}
                                  tabIndex={interaction ? -1 : undefined}
                                  onChange={interaction ? () => {} : onSelect}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (interaction)
                                      interaction.onClick(e, rowData, true);
                                  }}
                                />
                              );
                            }}
                          />
                        )}
                        {generateColumnsMap(
                          columns,
                          width,
                          optionsWidth,
                          hasSelect,
                          hasOptions,
                          selectedItems || [],
                          rowIDField,
                          columnsSelector,
                          columnsShown,
                          sortColumns,
                          tableSortBy || "",
                          tableSortDirection,
                          tableSort,
                          viewportWidth,
                        )}
                        {hasOptions && (
                          // @ts-ignore
                          <Column
                            dataKey={"column-options"}
                            width={optionsWidth}
                            headerClassName="optionsAlignment"
                            className="optionsAlignment"
                            cellRenderer={({ rowData }) => {
                              const isSelected = selectedItems
                                ? selectedItems.includes(
                                    isString(rowData)
                                      ? rowData
                                      : `${rowData[rowIDField]}`,
                                  )
                                : false;
                              return elementActions(
                                itemActions || [],
                                rowData,
                                isSelected,
                                rowIDField,
                              );
                            }}
                          />
                        )}
                      </Table>
                    );
                  }}
                </TableSizer>
              )}
            </InfiniteLoader>
          </div>
        ) : (
          <Fragment>
            {!isLoading && <div id={"empty-results"}>{noDataMessage}</div>}
          </Fragment>
        )}
      </DataTableWrapper>
    </Grid>
  );
};

export default DataTable;
