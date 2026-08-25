// This file is part of MinIO Console Server
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

import React, { Fragment, useState } from "react";
import { IConfigurationSys, IElementValue } from "../../Configurations/types";
import {
  Button,
  ConsoleIcon,
  DataTable,
  Grid,
  TierOfflineIcon,
  TierOnlineIcon,
} from "mds";
import AddEndpointModal from "./AddEndpointModal";
import DeleteWebhookEndpoint from "./DeleteWebhookEndpoint";
import EditWebhookEndpoint from "./EditWebhookEndpoint";
import { Configuration } from "api/consoleApi";
import { useT } from "i18n";

interface WebhookSettingsProps {
  WebhookSettingslist: Configuration[];
  setResetConfigurationOpen: () => void;
  type: string;
}

const WebhookSettings = ({
  setResetConfigurationOpen,
  WebhookSettingslist,
  type,
}: WebhookSettingsProps) => {
  const t = useT();
  const [newEndpointOpen, setNewEndpointOpen] = useState<boolean>(false);
  const [deleteWebhookOpen, setDeleteWebhookOpen] = useState<boolean>(false);
  const [editWebhookOpen, setEditWebhookOpen] = useState<boolean>(false);
  const [selectedARN, setSelectedARN] = useState<string>("");
  const [selectedEndpoint, setSelectedEndpoint] =
    useState<IConfigurationSys | null>(null);

  const renderEndpoint = (item: IElementValue[]) => {
    const endpointFilter = item.find((itm) => itm.key === "endpoint");

    if (endpointFilter) {
      if (endpointFilter.env_override) {
        return endpointFilter.env_override.value;
      }

      return endpointFilter.value;
    }

    return "";
  };

  const renderWebhookStatus = (item: IElementValue[]) => {
    const EnableFilter = item.find((itm) => itm.key === "enable");

    if (EnableFilter?.env_override) {
      const overrideEnabled =
        !EnableFilter?.env_override.value ||
        EnableFilter?.env_override.value === "on" ||
        !EnableFilter?.env_override.value
          ? "Enabled"
          : "Disabled";
      return (
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "start",
            fontSize: "8px",
          }}
        >
          <ConsoleIcon style={{ fill: "#052F51", width: "14px" }} />
          {overrideEnabled ? t("Enabled") : t("Disabled")}
        </Grid>
      );
    }

    // If enable is not set, then enabled by default
    if (!EnableFilter || EnableFilter.value === "on" || !EnableFilter.value) {
      return (
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "start",
            fontSize: "8px",
          }}
        >
          <TierOnlineIcon style={{ fill: "#4CCB92", width: 14, height: 14 }} />
          {t("Enabled")}
        </Grid>
      );
    }

    return (
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "start",
          fontSize: "8px",
        }}
      >
        <TierOfflineIcon style={{ fill: "#C83B51", width: 14, height: 14 }} />
        {t("Disabled")}
      </Grid>
    );
  };

  const onCloseDelete = () => {
    setDeleteWebhookOpen(false);
    setSelectedARN("");
  };

  const onCloseEditWebhook = () => {
    setEditWebhookOpen(false);
    setSelectedEndpoint(null);
  };

  const actions = [
    {
      type: "view",
      onClick: (item: IConfigurationSys) => {
        if (item.name) {
          setEditWebhookOpen(true);
          setSelectedEndpoint(item);
        }
      },
    },
    {
      type: "delete",
      onClick: (item: IConfigurationSys) => {
        if (item.name) {
          setDeleteWebhookOpen(true);
          setSelectedARN(item.name);
        }
      },
      isDisabled: (item: string) => {
        const wHook = WebhookSettingslist.find(
          (element) => element.name === item,
        );

        if (wHook) {
          const hasOverride = wHook.key_values?.filter(
            (itm) => !!itm.env_override,
          );

          // Has override values, we cannot delete.
          if (hasOverride && hasOverride.length > 0) {
            return true;
          }

          return false;
        }
        return false;
      },
    },
  ];
  return (
    <Grid container>
      {newEndpointOpen && (
        <AddEndpointModal
          open={newEndpointOpen}
          type={type}
          onCloseEndpoint={() => {
            setNewEndpointOpen(false);
          }}
        />
      )}
      {deleteWebhookOpen && (
        <DeleteWebhookEndpoint
          modalOpen={deleteWebhookOpen}
          onClose={onCloseDelete}
          selectedARN={selectedARN}
          type={type}
        />
      )}
      {editWebhookOpen && selectedEndpoint && (
        <EditWebhookEndpoint
          open={editWebhookOpen}
          type={type}
          endpointInfo={selectedEndpoint}
          onCloseEndpoint={onCloseEditWebhook}
        />
      )}
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          id={"newWebhook"}
          variant="callAction"
          onClick={() => {
            setNewEndpointOpen(true);
          }}
        >
          {t("New Endpoint")}
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ padding: "0 10px 10px" }}>
        <Fragment>
          <h3>{t("Currently Configured Endpoints")}</h3>
          <DataTable
            columns={[
              {
                label: t("Status"),
                elementKey: "key_values",
                renderFunction: renderWebhookStatus,
                width: 50,
              },
              { label: t("Name"), elementKey: "name" },
              {
                label: t("Endpoint"),
                elementKey: "key_values",
                renderFunction: renderEndpoint,
              },
            ]}
            itemActions={actions}
            idField="name"
            isLoading={false}
            records={WebhookSettingslist}
            entityName={t("endpoints")}
            customEmptyMessage={t("There are no endpoints yet.")}
            customPaperHeight={"calc(100vh - 750px)"}
          />
        </Fragment>
      </Grid>
    </Grid>
  );
};
export default WebhookSettings;
