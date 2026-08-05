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

import React, { Fragment, useState } from "react";
import {
  Box,
  CircleIcon,
  ConfirmDeleteIcon,
  DataTable,
  IColumns,
  ItemActions,
  Tooltip,
} from "mds";
import styled from "styled-components";
import get from "lodash/get";
import { ReplicationSite } from "./SiteReplication";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import EditSiteEndPoint from "./EditSiteEndPoint";
import { interpolate, useT } from "i18n";

const EndpointRender = styled.div(({ theme }) => ({
  display: "flex",
  gap: 10,
  "& .currentIndicator": {
    "& .min-icon": {
      width: 12,
      height: 12,
      fill: get(theme, "signalColors.good", "#4CCB92"),
    },
  },
  "& .endpointName": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

const ReplicationSites = ({
  sites,
  onDeleteSite,
  onRefresh,
}: {
  sites: ReplicationSite[];
  onDeleteSite: (isAll: boolean, sites: string[]) => void;
  onRefresh: () => void;
}) => {
  const t = useT();
  const [deleteSiteKey, setIsDeleteSiteKey] = useState<string>("");
  const [editSite, setEditSite] = useState<any>(null);

  const replicationColumns: IColumns[] = [
    { label: t("Site Name"), elementKey: "name" },
    {
      label: t("Endpoint"),
      elementKey: "endpoint",
      renderFullObject: true,
      renderFunction: (siteInfo) => (
        <EndpointRender>
          {siteInfo.isCurrent ? (
            <Tooltip tooltip={t("This site/cluster")} placement="top">
              <Box className={"currentIndicator"}>
                <CircleIcon />
              </Box>
            </Tooltip>
          ) : null}
          <Tooltip tooltip={siteInfo.endpoint}>
            <Box className={"endpointName"}>{siteInfo.endpoint}</Box>
          </Tooltip>
        </EndpointRender>
      ),
    },
  ];

  const actions: ItemActions[] = [
    {
      type: "edit",
      onClick: (valueToSend) => setEditSite(valueToSend),
      tooltip: t("Edit Endpoint"),
    },
    {
      type: "delete",
      onClick: (valueToSend) => setIsDeleteSiteKey(valueToSend.name),
      tooltip: t("Delete Site"),
    },
  ];

  return (
    <Fragment>
      <DataTable
        columns={replicationColumns}
        records={sites}
        itemActions={actions}
        idField={"name"}
        customPaperHeight={"calc(100vh - 660px)"}
        sx={{ marginBottom: 20 }}
      />

      {deleteSiteKey !== "" && (
        <ConfirmDialog
          title={t("Delete Replication Site")}
          confirmText={t("Delete")}
          isOpen={deleteSiteKey !== ""}
          titleIcon={<ConfirmDeleteIcon />}
          isLoading={false}
          onConfirm={() => {
            onDeleteSite(false, [deleteSiteKey]);
          }}
          onClose={() => {
            setIsDeleteSiteKey("");
          }}
          confirmationContent={
            <Fragment>
              {interpolate(
                t(
                  "Are you sure you want to remove the replication site: {name}?",
                ),
                { name: <strong>{deleteSiteKey}</strong> },
              )}
            </Fragment>
          }
        />
      )}

      {editSite !== null && (
        <EditSiteEndPoint
          onComplete={() => {
            setEditSite(null);
            onRefresh();
          }}
          editSite={editSite}
          onClose={() => {
            setEditSite(null);
          }}
        />
      )}
    </Fragment>
  );
};

export default ReplicationSites;
