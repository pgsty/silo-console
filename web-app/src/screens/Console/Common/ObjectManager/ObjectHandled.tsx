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
import { Link } from "react-router-dom";
import { IFileItem } from "../../ObjectBrowser/types";
import {
  Button,
  type,
  CancelledIcon,
  DownloadStatIcon,
  UploadStatIcon,
  DeleteIcon,
  RecoverIcon,
  IconButton,
  AlertCloseIcon,
} from "mds";
import { cancelTransfer } from "../../ObjectBrowser/transferManager";
import styled from "styled-components";
import { useT, formatText, i18nKey } from "i18n";
import { StatusBadge } from "common/ui/StatusBadge";
import {
  activeTask,
  retrySubset,
  taskCounts,
  taskFolder,
  taskStatus,
} from "./taskModel";
import { retryFailedTask } from "./mutationTasks";

const Card = styled.article`
  ${type("body")}
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  min-width: 0;
  color: var(--foreground);
  .task-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 550;
  }
  .task-title > svg {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    color: var(--muted-foreground);
  }
  .task-title .task-name {
    flex: 1;
    overflow-wrap: anywhere;
    min-width: 0;
  }
  .task-meta {
    ${type("caption")}
    color: var(--muted-foreground);
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 4px 0;
    flex-wrap: wrap;
  }
  .task-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px 0;
    font-variant-numeric: tabular-nums;
    ${type("caption")}
  }
  progress {
    flex: 1;
    min-width: 0;
    height: 4px;
    accent-color: var(--foreground);
  }
  p {
    margin: 4px 0;
    color: var(--muted-foreground);
    ${type("caption")}
    overflow-wrap: anywhere;
  }
  .task-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 4px;
  }
  a {
    color: var(--foreground);
    ${type("caption")}
    text-underline-offset: 3px;
    overflow-wrap: anywhere;
  }
  a:focus-visible,
  summary:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 3px;
  }
  details {
    margin-top: 8px;
    ${type("caption")}
  }
  details ul {
    padding-inline-start: 20px;
  }
  details li {
    margin-top: 8px;
    overflow-wrap: anywhere;
  }
`;
const Dismiss = styled(IconButton).attrs({ size: "small" })`
  --icon-size: 14px;
  color: var(--muted-foreground);
  @media (pointer: coarse) {
    width: 40px;
    height: 40px;
  }
`;
const statuses = {
  queued: i18nKey("Queued"),
  running: i18nKey("Running"),
  done: i18nKey("Completed"),
  failed: i18nKey("Failed"),
  cancelled: i18nKey("Cancelled"),
};
const kinds = {
  upload: i18nKey("Upload"),
  download: i18nKey("Download"),
  zip: i18nKey("ZIP download"),
  delete: i18nKey("Delete"),
  restore: i18nKey("Restore"),
};
const ObjectHandled = ({
  objectToDisplay: item,
  deleteFromList,
}: {
  objectToDisplay: IFileItem;
  deleteFromList: (id: string) => void;
}) => {
  const t = useT();
  const active = activeTask(item);
  const status = taskStatus(item);
  const counts = taskCounts(item);
  const kind = item.kind ?? item.type;
  const transfer = item.type === "upload" || item.type === "download";
  const browser =
    item.browserManaged && item.done && !item.failed && !item.cancelled;
  const failures =
    item.targets?.filter(
      (target) => target.status === "failed" || target.status === "cancelled",
    ) ?? [];
  const retry = retrySubset(item.targets ?? []);
  const Icon =
    kind === "upload"
      ? UploadStatIcon
      : kind === "delete"
        ? DeleteIcon
        : kind === "restore"
          ? RecoverIcon
          : DownloadStatIcon;
  return (
    <Card data-task-id={item.instanceID} data-task-status={status}>
      <div className="task-title">
        <Icon />
        <span
          className="task-name"
          title={item.targets ? undefined : item.prefix}
        >
          {item.targets
            ? t(item.prefix)
            : item.prefix.match(/[^/]+\/*$/)?.[0] || item.prefix}
        </span>
        {!active && (
          <Dismiss
            aria-label={transfer ? t("Remove transfer") : t("Remove task")}
            onClick={() => deleteFromList(item.instanceID)}
          >
            <AlertCloseIcon />
          </Dismiss>
        )}
      </div>
      <div className="task-meta">
        <span>{t(kinds[kind])}</span>
        <StatusBadge
          tone={item.failed ? "danger" : "neutral"}
          label={browser ? t("Browser handoff") : t(statuses[status])}
        />
        {!active && !item.failed && (
          <span className="progressPercentage">{item.percentage}%</span>
        )}
      </div>
      {active && (
        <div className="task-progress">
          <progress
            aria-label={browser ? t("Browser handoff") : t("Task progress")}
            max={100}
            value={item.waitingForFile && active ? undefined : item.percentage}
          />
          {(!item.waitingForFile || !active) && (
            <span className="progressPercentage">{item.percentage}%</span>
          )}
          {item.waitingForFile && active && (
            <span>{t("Waiting for data")}</span>
          )}
        </div>
      )}
      {counts.total > 0 && (
        <p>
          {formatText(
            t(
              "{done}/{total} completed · {failed} failed · {cancelled} cancelled",
            ),
            counts,
          )}
        </p>
      )}
      {item.receivedBytes !== undefined && (
        <p>
          {formatText(t("{bytes} bytes received"), {
            bytes: item.receivedBytes.toLocaleString(),
          })}
        </p>
      )}
      {browser && (
        <p>
          <span>
            {t(
              "Track or cancel this download in your browser's download manager.",
            )}
          </span>{" "}
          <span>
            {t(
              "Handoff is complete; final download progress is unavailable here.",
            )}
          </span>
        </p>
      )}
      {item.errorMessage && (
        <p role="status">
          {transfer && item.failed
            ? `${t("Error:")} ${item.errorMessage}`
            : item.errorMessage}
        </p>
      )}
      {item.targets?.some(
        (target) => target.recursive || target.nonCurrent || target.allVersions,
      ) && (
        <p>
          {t(
            "Counts represent selected targets. Progress within a folder or version cleanup is unavailable.",
          )}
        </p>
      )}
      {item.cancelled && item.targets && (
        <p>
          {t(
            "Completed changes remain in place. In-flight requests may have reached the server; inspect before repeating them.",
          )}
        </p>
      )}
      {failures.length > 0 && (
        <details>
          <summary>
            {formatText(t("Review {count} results"), {
              count: failures.length,
            })}
          </summary>
          <ul>
            {failures.map((target, index) => (
              <li key={index}>
                <strong>{target.key}</strong>
                {target.versionId !== undefined && <> · {target.versionId}</>}
                <br />
                {t(statuses[target.status])}
                {target.error && <>: {target.error}</>}
                {target.uncertain && (
                  <p>
                    {t(
                      "Server outcome is unconfirmed. Inspect this object before another operation.",
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
      <div className="task-actions">
        <Link
          to={`/browser/${encodeURIComponent(item.bucketName)}/${encodeURIComponent(taskFolder(item))}`}
        >
          <span title={`${item.bucketName}/${taskFolder(item)}`}>
            {item.bucketName}
          </span>
          {" · "}
          {t("Open bucket/prefix")}
        </Link>
        {active ? (
          <Button
            id={`cancel-${item.ID}`}
            variant="text"
            label={t("Cancel")}
            aria-label={transfer ? t("Cancel transfer") : t("Cancel task")}
            icon={<CancelledIcon />}
            onClick={() => cancelTransfer(item.ID)}
          />
        ) : retry.length > 0 ? (
          <Button
            id={`retry-${item.ID}`}
            variant="secondary"
            label={t("Retry failed")}
            onClick={() => retryFailedTask(item.instanceID)}
          />
        ) : null}
      </div>
    </Card>
  );
};
export default ObjectHandled;
