// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { ReactNode, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { List, RowComponentProps } from "react-window";
import {
  Checkbox,
  useTableRowHeight,
  useFluidHover,
  FluidHoverHighlight,
  ArrowDropUp,
  ArrowDropDown,
} from "mds";
import styled from "styled-components";
import type { Bucket } from "../../../../api/consoleApi";
import { formatText, useT } from "i18n";
import { niceBytesInt } from "../../../../common/utils";
import { typography } from "../../../../common/ui/typography";
import { BucketQuery, BucketSort } from "./bucketList";
import { BucketUsageStatus } from "./BucketUsageStatus";
import {
  BucketAccess,
  BucketCreated,
  BucketDisplayProps,
  BucketFeature,
  BucketRowActions,
  BucketUsage,
  bucketCapabilities,
} from "./BucketListCells";

const Shell = styled.div`
  ${typography.body}
  min-width: 0;
  border-radius: var(--radius-card);
  background: var(--surface-3);
  box-shadow: var(--shadow-2);
  overflow: hidden;
  font-variant-numeric: tabular-nums;
  --bucket-select-width: 28px;
  --bucket-menu-width: 36px;
  .bucketGrid {
    display: grid;
    grid-template-columns:
      minmax(120px, 1.8fr)
      minmax(0, 0.8fr) minmax(0, 0.9fr) minmax(0, 1.1fr)
      minmax(0, 1.1fr) minmax(0, 0.8fr) minmax(0, 1.1fr)
      minmax(0, 1fr) minmax(0, 1fr) var(--bucket-menu-width);
    align-items: center;
    column-gap: 8px;
    padding: 0 12px;
    box-sizing: border-box;
    height: var(--bucket-row-height, var(--control-height));
  }
  &[data-selection="true"] .bucketGrid {
    grid-template-columns:
      var(--bucket-select-width) minmax(120px, 1.8fr)
      minmax(0, 0.8fr) minmax(0, 0.9fr) minmax(0, 1.1fr)
      minmax(0, 1.1fr) minmax(0, 0.8fr) minmax(0, 1.1fr)
      minmax(0, 1fr) minmax(0, 1fr) var(--bucket-menu-width);
  }
  .bucketCell {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bucketCell a {
    color: inherit;
    text-decoration: none;
  }
  .bucketCell a:hover {
    text-decoration: underline;
  }
  .bucketCell a:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -2px;
  }
  .bucketNumber {
    text-align: right;
  }
  @media (min-width: 1200px) {
    .bucketNumber {
      padding-right: 12px;
    }
  }
  .bucketCheck {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bucketMenu {
    overflow: visible;
    display: flex;
    justify-content: end;
  }
  .bucketRow {
    border-bottom: 1px solid var(--border);
    color: var(--muted-foreground);
    transition:
      color var(--dur-fast) ease,
      border-color var(--dur-fast) ease;
  }
  .bucketRow[data-fluid-activator] {
    cursor: pointer;
  }
  .bucketRow[data-fluid-hover],
  .bucketRow[aria-selected="true"] {
    color: var(--foreground);
  }
  .bucketRow[data-fluid-hover],
  .bucketRow[data-fluid-before] {
    border-bottom-color: transparent;
  }
  .bucketRow[aria-selected="true"] {
    background: var(--active);
  }
  .bucketRow:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -2px;
  }
  @media (max-width: 1199.98px) {
    .bucketGrid {
      grid-template-columns:
        minmax(100px, 1.6fr) minmax(0, 0.7fr) minmax(0, 0.8fr)
        minmax(0, 1fr) minmax(0, 1fr) var(--bucket-menu-width);
    }
    &[data-selection="true"] .bucketGrid {
      grid-template-columns:
        var(--bucket-select-width) minmax(100px, 1.6fr)
        minmax(0, 0.7fr) minmax(0, 0.8fr) minmax(0, 1fr) minmax(0, 1fr) var(
          --bucket-menu-width
        );
    }
    .bucketLow {
      display: none;
    }
  }
  @media (max-width: 767.98px) {
    .bucketGrid {
      grid-template-columns: minmax(0, 1fr) 76px var(--bucket-menu-width);
      padding: 0 8px;
      gap: 4px;
    }
    &[data-selection="true"] .bucketGrid {
      grid-template-columns: var(--bucket-select-width) minmax(0, 1fr) 76px var(
          --bucket-menu-width
        );
    }
    .bucketMedium {
      display: none;
    }
  }
  @media (pointer: coarse) {
    --bucket-select-width: 40px;
    --bucket-menu-width: 40px;
  }
`;
const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--surface-3);
  color: var(--foreground);
  font-weight: var(--fw-semibold);
  border-bottom: 1px solid var(--border);
  button {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    border: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    max-width: 100%;
  }
  @media (pointer: coarse) {
    button {
      min-height: 40px;
    }
  }
  button:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 1px;
  }
  button > svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }
`;
const Body = styled.div`
  position: relative;
  isolation: isolate;
  min-height: 0;
  [data-fluid-highlight] {
    z-index: -1;
  }
`;
interface Column {
  id: string;
  label: string;
  priority?: "Medium" | "Low";
  number?: boolean;
  sort?: BucketSort;
  render: (props: BucketDisplayProps) => ReactNode;
}
interface RowData {
  records: Bucket[];
  columns: Column[];
  selected: string[];
  common: Omit<BucketDisplayProps, "bucket" | "selected">;
}
function BucketRow({
  index,
  style,
  records,
  columns,
  selected,
  common,
}: RowComponentProps<RowData>) {
  const bucket = records[index];
  // react-window recycles indices. The keyed business row prevents an open menu
  // or checkbox generation from following a different bucket after a sort.
  return (
    <IdentityRow
      key={bucket.name}
      index={index}
      style={style}
      columns={columns}
      {...common}
      bucket={bucket}
      selected={selected.includes(bucket.name)}
    />
  );
}
function IdentityRow({
  index,
  style,
  columns,
  ...props
}: BucketDisplayProps & {
  index: number;
  style?: React.CSSProperties;
  columns: Column[];
}) {
  const navigate = useNavigate();
  const { bucket, selected, onSelect, obOnly } = props;
  const t = useT();
  const permission = bucketCapabilities(bucket.name, obOnly);
  const browse = () =>
    permission.browse &&
    navigate(`/browser/${encodeURIComponent(bucket.name)}`);
  return (
    <div
      role="row"
      aria-rowindex={index + 2}
      aria-label={bucket.name}
      aria-selected={onSelect ? selected : undefined}
      style={style}
      className="bucketGrid bucketRow"
      data-fluid-index={permission.browse ? index : undefined}
      data-fluid-key={bucket.name}
      data-fluid-activator={permission.browse ? "true" : undefined}
      tabIndex={permission.browse ? 0 : undefined}
      onClick={browse}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          ["Enter", " "].includes(event.key)
        ) {
          event.preventDefault();
          browse();
        }
      }}
    >
      {onSelect && (
        <div
          role="cell"
          className="bucketCheck"
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox
            label=""
            aria-label={formatText(t("Select {bucket}"), {
              bucket: bucket.name,
            })}
            checked={selected}
            disabled={!permission.select}
            onChange={() => onSelect(bucket.name)}
          />
        </div>
      )}
      {columns.map((column) => (
        <div
          key={column.id}
          role="cell"
          className={`bucketCell bucket${column.priority || "High"} ${column.number ? "bucketNumber" : ""} ${column.id === "actions" ? "bucketMenu" : ""}`}
        >
          {column.render(props)}
        </div>
      ))}
    </div>
  );
}
export default function BucketsTable({
  records,
  query,
  onSort,
  selected,
  onSelectAll,
  ...common
}: RowData["common"] & {
  records: Bucket[];
  query: BucketQuery;
  onSort: (field: BucketSort) => void;
  selected: string[];
  onSelectAll: () => void;
}) {
  const t = useT();
  const rowHeight = useTableRowHeight();
  const body = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(body, { gapClick: false });
  const columns: Column[] = [
    {
      id: "name",
      label: t("Name"),
      sort: "name",
      render: ({ bucket, obOnly }) => (
        <div>
          {bucketCapabilities(bucket.name, obOnly).browse ? (
            <Link
              to={`/browser/${encodeURIComponent(bucket.name)}`}
              onClick={(event) => event.stopPropagation()}
            >
              {bucket.name}
            </Link>
          ) : (
            bucket.name
          )}
          <BucketUsageStatus bucket={bucket.name} />
        </div>
      ),
    },
    {
      id: "objects",
      label: t("Objects"),
      priority: "Medium",
      number: true,
      sort: "objects",
      render: (props) => <BucketUsage {...props} field="objects" />,
    },
    {
      id: "size",
      label: t("Current size"),
      number: true,
      sort: "size",
      render: (props) => <BucketUsage {...props} field="size" />,
    },
    {
      id: "versioning",
      label: t("Versioning"),
      priority: "Medium",
      render: ({ bucket }) => (
        <BucketFeature
          enabled={bucket.details ? !!bucket.details.versioning : undefined}
          suspended={bucket.details?.versioningSuspended}
        />
      ),
    },
    {
      id: "locking",
      label: t("Object lock"),
      priority: "Low",
      render: ({ bucket }) => (
        <BucketFeature
          enabled={bucket.details ? !!bucket.details.locking : undefined}
        />
      ),
    },
    {
      id: "quota",
      label: t("Quota"),
      priority: "Low",
      number: true,
      render: ({ bucket }) =>
        (bucket.details?.quota?.quota || 0) > 0
          ? niceBytesInt(bucket.details!.quota!.quota!)
          : "—",
    },
    {
      id: "replication",
      label: t("Replication"),
      priority: "Low",
      render: ({ bucket }) => (
        <BucketFeature
          enabled={bucket.details ? !!bucket.details.replication : undefined}
        />
      ),
    },
    {
      id: "access",
      label: t("Access"),
      priority: "Medium",
      render: ({ bucket }) => <BucketAccess bucket={bucket} />,
    },
    {
      id: "created",
      label: t("Created"),
      priority: "Low",
      sort: "created",
      render: ({ bucket }) => <BucketCreated at={bucket.creation_date} />,
    },
    {
      id: "actions",
      label: t("Actions"),
      render: (props) => <BucketRowActions {...props} />,
    },
  ];
  const selectable = records.filter(
    (bucket) => bucketCapabilities(bucket.name, common.obOnly).select,
  );
  const rows = { records, columns, selected, common };
  return (
    <Shell
      role="table"
      aria-label={t("Buckets")}
      aria-rowcount={records.length + 1}
      aria-colcount={columns.length + (common.onSelect ? 1 : 0)}
      data-selection={Boolean(common.onSelect)}
      style={
        {
          "--bucket-row-height": `${Math.max(rowHeight, 64)}px`,
        } as React.CSSProperties
      }
    >
      <Header role="row" className="bucketGrid" aria-rowindex={1}>
        {common.onSelect && (
          <div role="columnheader" className="bucketCheck">
            <Checkbox
              label=""
              aria-label={t("Select all visible buckets")}
              checked={
                selectable.length > 0 &&
                selectable.every((bucket) => selected.includes(bucket.name))
              }
              disabled={!selectable.length}
              onChange={onSelectAll}
            />
          </div>
        )}
        {columns.map((column) => (
          <div
            key={column.id}
            role="columnheader"
            className={`bucketCell bucket${column.priority || "High"} ${column.number ? "bucketNumber" : ""}`}
            aria-sort={
              column.sort
                ? query.sort === column.sort
                  ? query.dir === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
                : undefined
            }
          >
            {column.sort ? (
              <button
                type="button"
                aria-label={column.label}
                onClick={() => onSort(column.sort!)}
              >
                {column.label}
                {query.sort === column.sort &&
                  (query.dir === "asc" ? <ArrowDropUp /> : <ArrowDropDown />)}
              </button>
            ) : column.id === "actions" ? (
              <span
                className="selectionHeaderLabel"
                style={{
                  position: "absolute",
                  clipPath: "inset(50%)",
                  width: 1,
                  height: 1,
                }}
              >
                {column.label}
              </span>
            ) : (
              column.label
            )}
          </div>
        ))}
      </Header>
      <Body ref={body}>
        <FluidHoverHighlight hover={hover} />
        {records.length > 100 ? (
          <List
            role="rowgroup"
            aria-label={t("Bucket rows")}
            rowCount={records.length}
            rowHeight={Math.max(rowHeight, 64)}
            rowComponent={BucketRow}
            rowProps={rows}
            overscanCount={6}
            style={{ height: "min(65vh, 720px)", minHeight: rowHeight * 4 }}
          />
        ) : (
          <div
            role="rowgroup"
            style={{ maxHeight: "min(65vh, 720px)", overflowY: "auto" }}
          >
            {records.map((bucket, index) => (
              <IdentityRow
                key={bucket.name}
                {...common}
                columns={columns}
                bucket={bucket}
                index={index}
                selected={selected.includes(bucket.name)}
              />
            ))}
          </div>
        )}
      </Body>
    </Shell>
  );
}
