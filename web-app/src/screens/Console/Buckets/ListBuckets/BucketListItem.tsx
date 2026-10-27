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
import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, BucketsIcon } from "mds";
import { formatText, useT } from "i18n";
import { BucketUsageStatus } from "./BucketUsageStatus";
import { typography } from "../../../../common/ui/typography";
import {
  BucketAccess,
  BucketDisplayProps,
  BucketRowActions,
  BucketUsage,
  bucketCapabilities,
} from "./BucketListCells";

const Card = styled.div`
  ${typography.body}
  min-height: 148px;
  box-sizing: border-box;
  min-width: 0;
  padding: 8px 12px 12px;
  border-radius: var(--radius-card);
  background: var(--surface-3);
  box-shadow: var(--shadow-2);
  color: var(--muted-foreground);
  font-variant-numeric: tabular-nums;
  &[data-clickable="true"] {
    cursor: pointer;
  }
  &:hover,
  &[data-selected="true"] {
    color: var(--foreground);
    background: color-mix(in srgb, var(--hover) 100%, var(--surface-3));
  }
  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
  .cardTitle {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    height: 36px;
  }
  .cardTitle > svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  h2 {
    ${typography.section} margin: 0;
    min-width: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .cardMetrics {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 4px;
  }
  .metricLabel {
    ${typography.caption} color: var(--muted-foreground);
  }
  .metricValue {
    display: block;
    color: var(--foreground);
  }
  .cardAccess {
    ${typography.caption} text-align: right;
    align-self: end;
  }
`;

const BucketListItem = (props: BucketDisplayProps) => {
  const { bucket, onSelect, selected, obOnly } = props;
  const t = useT();
  const navigate = useNavigate();
  const permission = bucketCapabilities(bucket.name, obOnly);
  const browse = () =>
    permission.browse &&
    navigate(`/browser/${encodeURIComponent(bucket.name)}`);
  return (
    <Card
      className="bucket-card"
      role="listitem"
      aria-label={bucket.name}
      data-clickable={permission.browse}
      data-selected={onSelect ? selected : undefined}
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
      <div className="cardTitle">
        {onSelect ? (
          <span onClick={(event) => event.stopPropagation()}>
            <Checkbox
              label=""
              checked={selected}
              disabled={!permission.select}
              aria-label={formatText(t("Select {bucket}"), {
                bucket: bucket.name,
              })}
              onChange={() => onSelect(bucket.name)}
            />
          </span>
        ) : (
          <BucketsIcon aria-hidden="true" />
        )}
        <h2>
          {permission.browse ? (
            <Link
              to={`/browser/${encodeURIComponent(bucket.name)}`}
              onClick={(event) => event.stopPropagation()}
            >
              {bucket.name}
            </Link>
          ) : (
            bucket.name
          )}
        </h2>
        <BucketRowActions {...props} />
      </div>
      <BucketUsageStatus bucket={bucket.name} />
      <div className="cardMetrics">
        <div>
          <span className="metricLabel">{t("Objects")}</span>
          <span className="metricValue">
            <BucketUsage {...props} field="objects" />
          </span>
        </div>
        <div>
          <span className="metricLabel">{t("Current size")}</span>
          <span className="metricValue">
            <BucketUsage {...props} field="size" />
          </span>
        </div>
        <span className="cardAccess">
          <BucketAccess bucket={bucket} />
        </span>
      </div>
    </Card>
  );
};
export default BucketListItem;
