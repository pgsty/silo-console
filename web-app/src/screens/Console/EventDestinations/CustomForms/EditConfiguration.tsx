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

import { ModalPresence } from "common/ui/ModalPresence";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, Loader } from "mds";
import { useSelector } from "react-redux";
import { api } from "api";
import { Configuration } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import {
  fieldsConfigurations,
  overrideFields,
  removeEmptyFields,
} from "../../Configurations/utils";
import {
  IConfigurationElement,
  IElementValue,
  KVField,
} from "../../Configurations/types";
import {
  configurationIsLoading,
  recordServerRestartRequirement,
  setErrorSnackMessage,
  setHelpName,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../store";
import WebhookSettings from "../WebhookSettings/WebhookSettings";
import ConfTargetGeneric from "../ConfTargetGeneric";
import ResetConfigurationModal from "./ResetConfigurationModal";
import { useT } from "i18n";

interface IAddNotificationEndpointProps {
  selectedConfiguration: IConfigurationElement;
  className?: string;
}

const EditConfiguration = ({
  selectedConfiguration,
  className = "",
}: IAddNotificationEndpointProps) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const configId = selectedConfiguration.configuration_id;

  //Local States
  const [valuesObj, setValueObj] = useState<IElementValue[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [configSubsysList, setConfigSubsysList] = useState<Configuration[]>([]);
  const [resetConfigurationOpen, setResetConfigurationOpen] =
    useState<boolean>(false);
  const storedValues = configSubsysList[0]?.key_values;
  const fields = useMemo(() => {
    const definitions: KVField[] = fieldsConfigurations[configId];
    if (configId !== "api") return definitions;
    return definitions.filter((field) =>
      storedValues?.some((entry) => entry.key === field.name),
    );
  }, [configId, storedValues]);
  const configValues = useMemo(
    () =>
      fields.map((field) => {
        const entry = storedValues?.find((kv) => kv.key === field.name);
        const value = entry?.value || "";
        return {
          key: field.name,
          value: field.customValueProcess
            ? field.customValueProcess(value)
            : value,
          env_override: entry?.env_override,
        };
      }),
    [fields, storedValues],
  );
  const valuesToSave = removeEmptyFields(valuesObj).filter(
    (field) =>
      configId !== "api" ||
      configValues.some(
        (original) =>
          original.key === field.key &&
          !original.env_override &&
          original.value !== field.value,
      ),
  );

  const loadingConfig = useSelector(
    (state: AppState) => state.system.loadingConfigurations,
  );

  useEffect(() => {
    dispatch(configurationIsLoading(true));
  }, [configId, dispatch]);

  useEffect(() => {
    if (!loadingConfig) return;
    let active = true;
    api.configs
      .configInfo(configId)
      .then((res) => {
        if (!active) return;
        setConfigSubsysList(res.data);
        dispatch(configurationIsLoading(false));
      })
      .catch((err) => {
        if (!active) return;
        dispatch(configurationIsLoading(false));
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
      });
    return () => {
      active = false;
    };
  }, [loadingConfig, configId, dispatch]);

  //Fetch Actions
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (saving || (configId === "api" && !valuesToSave.length)) return;
    setSaving(true);
    api.configs
      .setConfig(configId, { key_values: valuesToSave })
      .then((res) => {
        dispatch(recordServerRestartRequirement(res.data.restart === true));
        dispatch(configurationIsLoading(true));
        if (!res.data.restart) {
          dispatch(setSnackBarMessage(t("Configuration saved successfully")));
        }
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
      })
      .finally(() => setSaving(false));
  };

  const continueReset = (restart: boolean) => {
    setResetConfigurationOpen(false);
    dispatch(recordServerRestartRequirement(restart));
    dispatch(configurationIsLoading(true));
  };

  const resetConfigurationMOpen = () => {
    setResetConfigurationOpen(true);
  };

  return (
    <Fragment>
      <div
        onMouseMove={() => {
          dispatch(
            setHelpName(
              `settings_${selectedConfiguration.configuration_label}`,
            ),
          );
        }}
      >
        <ModalPresence open={Boolean(resetConfigurationOpen)}>
          {resetConfigurationOpen && (
            <ResetConfigurationModal
              configurationName={selectedConfiguration.configuration_id}
              onClose={() => setResetConfigurationOpen(false)}
              onReset={continueReset}
              resetOpen={resetConfigurationOpen}
            />
          )}
        </ModalPresence>
        {loadingConfig ? (
          <Grid item xs={12} sx={{ textAlign: "center", paddingTop: 16 }}>
            <Loader />
          </Grid>
        ) : (
          <Box
            sx={{
              padding: 0,
              height: "100%",
            }}
          >
            {selectedConfiguration.configuration_id === "logger_webhook" ||
            selectedConfiguration.configuration_id === "audit_webhook" ? (
              <WebhookSettings
                WebhookSettingslist={configSubsysList}
                setResetConfigurationOpen={resetConfigurationMOpen}
                type={selectedConfiguration.configuration_id}
              />
            ) : (
              <Fragment>
                <form
                  noValidate
                  onSubmit={submitForm}
                  className={className}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexFlow: "column",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 12,
                    }}
                  >
                    <ConfTargetGeneric
                      fields={fields}
                      onChange={setValueObj}
                      defaultVals={configValues}
                      overrideEnv={overrideFields(configValues)}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      paddingTop: 16,
                      textAlign: "end" as const,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      type={"button"}
                      id={"restore-defaults"}
                      variant="danger"
                      onClick={resetConfigurationMOpen}
                      label={t("Restore Defaults")}
                    />
                    &nbsp; &nbsp;
                    <Button
                      id={"save"}
                      type="submit"
                      variant="callAction"
                      disabled={
                        saving || (configId === "api" && !valuesToSave.length)
                      }
                      label={t("Save")}
                    />
                  </Grid>
                </form>
              </Fragment>
            )}
          </Box>
        )}
      </div>
    </Fragment>
  );
};

export default EditConfiguration;
