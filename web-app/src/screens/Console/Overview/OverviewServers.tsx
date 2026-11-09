// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { Fragment, useId, useRef, useState } from "react";
import styled from "styled-components";
import {
  Button,
  ArrowDropDown,
  ArrowRightIcon,
  DensityProvider,
  FluidHoverHighlight,
  ServersIcon,
  type,
  useFluidHover,
} from "mds";
import type { ServerProperties } from "../../../api/consoleApi";
import { EmptyState, StatusBadge, statCardTone } from "../../../common/ui";
import { niceBytes, niceDays } from "../../../common/utils";
import { formatText, useT } from "i18n";
import { driveCapacity, reportedNumber } from "./overviewModel";
import { Caption } from "./overviewStyles";

const Container = styled.div`
  position: relative;
  table {
    position: relative;
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  th,
  td {
    ${type("body", { compact: true })} text-align: start;
    padding: 8px;
    vertical-align: top;
    overflow-wrap: anywhere;
    border-bottom: 1px solid var(--border);
  }
  th {
    font-weight: 550;
    color: var(--foreground);
  }
  td {
    color: var(--muted-foreground);
  }
  th:first-child {
    width: 30%;
  }
  .server-row {
    cursor: pointer;
  }
  .server-row[data-fluid-hover="true"] td,
  .server-row:focus-within td {
    color: var(--foreground);
  }
  .server-row[data-fluid-hover="true"] td,
  .server-row[data-fluid-before="true"] td {
    border-bottom-color: transparent;
  }
  .endpoint {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .endpoint button {
    flex-shrink: 0;
  }
  .version {
    width: 20%;
  }
  @media (max-width: 1199px) {
    table {
      table-layout: auto;
    }
    .version {
      display: none;
    }
    th:first-child {
      width: 35%;
    }
  }
  @media (max-width: 767px) {
    .network,
    .uptime {
      display: none;
    }
    th,
    td {
      padding: 8px 4px;
    }
    th:first-child {
      width: 48%;
    }
  }
`;
const Details = styled.div`
  padding: 8px;
  background: var(--hover);
  border-radius: var(--radius-control);
  min-width: 0;
  ${Caption} {
    color: var(--foreground);
  }
`;
const ServerMeta = styled.dl`
  ${type("caption")}
  display: none;
  margin: 0 0 12px;
  gap: 8px;
  dt {
    color: var(--foreground);
  }
  dd {
    color: var(--foreground);
    margin: 0;
    overflow-wrap: anywhere;
  }
  @media (max-width: 1199px) {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
  }
`;
const Drives = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    display: grid;
    grid-template-columns: minmax(0, 2fr) auto minmax(0, 2fr);
    gap: 12px;
    align-items: center;
    padding: 12px 0;
  }
  li + li {
    border-top: 1px solid var(--border);
  }
  && li::before {
    content: none;
  }
  .path {
    overflow-wrap: anywhere;
    color: var(--foreground);
  }
  @media (max-width: 767px) {
    li {
      grid-template-columns: minmax(0, 1fr) auto;
    }
    .drive-usage {
      grid-column: 1 / -1;
    }
  }
`;
const Progress = styled.div<{ $ratio: number; $tone: string }>`
  height: 4px;
  margin-top: 8px;
  background: var(--border);
  border-radius: var(--radius-pill);
  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${({ $ratio }) => Math.min(1, $ratio) * 100}%;
    background: ${({ $tone }) => `var(--silo-${$tone})`};
    border-radius: inherit;
  }
`;

const bytes = (value: number | undefined) =>
  value === undefined ? "—" : niceBytes(`${value}`);

export default function OverviewServers({
  servers,
}: {
  servers?: ServerProperties[];
}) {
  const t = useT();
  const id = useId();
  const container = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(container, { gapClick: false });
  const [expanded, setExpanded] = useState<string[]>([]);
  const stateBadge = (state: string | undefined, online: string) => (
    <StatusBadge
      tone={!state ? "neutral" : state === online ? "success" : "danger"}
      label={
        !state ? t("Unknown") : state === online ? t("Online") : t("Offline")
      }
    />
  );
  if (!servers?.length)
    return (
      <EmptyState
        compact
        icon={<ServersIcon />}
        title={t("No servers reported")}
      />
    );
  return (
    <DensityProvider density="compact">
      <Container ref={container}>
        <FluidHoverHighlight hover={hover} />
        <table aria-label={t("Servers")}>
          <thead>
            <tr>
              <th scope="col">{t("Server")}</th>
              <th scope="col">{t("Status")}</th>
              <th scope="col">{t("Drives")}</th>
              <th scope="col" className="network">
                {t("Network")}
              </th>
              <th scope="col" className="uptime">
                {t("Uptime")}
              </th>
              <th scope="col" className="version">
                {t("Version")}
              </th>
            </tr>
          </thead>
          <tbody>
            {servers.map((server, index) => {
              const key = server.endpoint || String(index);
              const open = expanded.includes(key);
              const endpoint = server.endpoint || t("Unknown");
              const onlineDrives = server.drives?.filter(
                (drive) => drive.state === "ok",
              ).length;
              const network = server.network
                ? Object.values(server.network)
                : undefined;
              const networkText = network
                ? `${network.filter((state) => state === "online").length}/${network.length}`
                : "—";
              const uptime =
                reportedNumber(server.uptime) === undefined
                  ? "—"
                  : server.uptime === 0
                    ? t("Just started")
                    : niceDays(`${server.uptime}`);
              const toggle = () =>
                setExpanded((previous) =>
                  open
                    ? previous.filter((value) => value !== key)
                    : [...previous, key],
                );
              const rowId = `${id}-drives-${index}`;
              return (
                <Fragment key={key}>
                  <tr
                    className="server-row"
                    data-fluid-index={index}
                    onClick={toggle}
                  >
                    <td>
                      <div className="endpoint">
                        <Button
                          id={`${id}-expand-${index}`}
                          variant="ghost"
                          aria-expanded={open}
                          aria-controls={open ? rowId : undefined}
                          aria-label={formatText(
                            open
                              ? t("Hide drives for {server}")
                              : t("Show drives for {server}"),
                            { server: endpoint },
                          )}
                          icon={open ? <ArrowDropDown /> : <ArrowRightIcon />}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggle();
                          }}
                        />
                        <span>{endpoint}</span>
                      </div>
                    </td>
                    <td>{stateBadge(server.state, "online")}</td>
                    <td>
                      {onlineDrives === undefined
                        ? "—"
                        : `${onlineDrives}/${server.drives!.length}`}
                    </td>
                    <td className="network">{networkText}</td>
                    <td className="uptime">{uptime}</td>
                    <td className="version">{server.version || "—"}</td>
                  </tr>
                  {open && (
                    <tr>
                      <td colSpan={6}>
                        <Details id={rowId}>
                          <ServerMeta>
                            <dt>{t("Network")}</dt>
                            <dd>{networkText}</dd>
                            <dt>{t("Uptime")}</dt>
                            <dd>{uptime}</dd>
                            <dt>{t("Version")}</dt>
                            <dd>{server.version || "—"}</dd>
                          </ServerMeta>
                          {!server.drives?.length ? (
                            <Caption>
                              {t("No drive information available")}
                            </Caption>
                          ) : (
                            <Drives
                              aria-label={formatText(t("Drives on {server}"), {
                                server: endpoint,
                              })}
                            >
                              {server.drives.map((drive, driveIndex) => {
                                const amount = driveCapacity(drive);
                                const path =
                                  drive.drivePath ||
                                  drive.endpoint ||
                                  t("Unknown");
                                return (
                                  <li
                                    key={drive.uuid || `${path}-${driveIndex}`}
                                  >
                                    <span className="path">{path}</span>
                                    <div>
                                      {stateBadge(drive.state, "ok")}
                                      {drive.healing && (
                                        <div>
                                          <Caption>{t("Healing")}</Caption>
                                        </div>
                                      )}
                                    </div>
                                    <div className="drive-usage">
                                      <Caption>
                                        {formatText(
                                          t("{used} / {total} used"),
                                          {
                                            used: bytes(amount.used),
                                            total: bytes(amount.total),
                                          },
                                        )}
                                      </Caption>
                                      {amount.ratio !== undefined && (
                                        <Progress
                                          role="progressbar"
                                          aria-label={formatText(
                                            t("Drive usage: {drive}"),
                                            { drive: path },
                                          )}
                                          aria-valuemin={0}
                                          aria-valuemax={100}
                                          aria-valuenow={Math.min(
                                            100,
                                            amount.ratio * 100,
                                          )}
                                          $ratio={amount.ratio}
                                          $tone={statCardTone(amount.ratio)}
                                        />
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </Drives>
                          )}
                        </Details>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Container>
    </DensityProvider>
  );
}
