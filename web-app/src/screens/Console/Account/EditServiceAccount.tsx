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

import React, { useEffect, useState, Fragment } from "react";
import {
  Box,
  Button,
  ChangeAccessPolicyIcon,
  DateTimeInput,
  Grid,
  InputBox,
  Switch,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import { useAppDispatch } from "store";
import { setModalErrorSnackMessage } from "systemSlice";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { DateTime } from "luxon";
import { i18nKey, formatText, useLocalizedLink, useT } from "i18n";
import {
  policyForServiceAccountUpdate,
  ServiceAccountPolicyMode,
} from "./serviceAccountPolicy";

interface IServiceAccountPolicyProps {
  open: boolean;
  selectedAccessKey: string | null;
  closeModalAndRefresh: () => void;
  readOnly?: boolean;
}

const EditServiceAccount = ({
  open,
  selectedAccessKey,
  closeModalAndRefresh,
  readOnly = false,
}: IServiceAccountPolicyProps) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const localize = useLocalizedLink();
  const [loading, setLoading] = useState<boolean>(false);
  const [policyDefinition, setPolicyDefinition] = useState<string>("");
  const [policyMode, setPolicyMode] =
    useState<ServiceAccountPolicyMode>("inherited");
  const [initialPolicy, setInitialPolicy] = useState<{
    accessKey: string;
    mode: ServiceAccountPolicyMode;
    definition: string;
  } | null>(null);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [expiry, setExpiry] = useState<any>();
  const [status, setStatus] = useState<string | undefined>("enabled");

  useEffect(() => {
    let active = true;
    setInitialPolicy(null);
    setPolicyMode("inherited");
    setPolicyDefinition("");

    if (!open || !selectedAccessKey) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    api.serviceAccounts
      .getServiceAccount(selectedAccessKey)
      .then((res) => {
        if (!active) return;
        const saInfo = res.data;
        const initialMode: ServiceAccountPolicyMode = saInfo?.impliedPolicy
          ? "inherited"
          : "inline";
        const returnedPolicy = saInfo?.policy || "";

        setName(saInfo?.name || "");

        if (saInfo?.expiration) {
          setExpiry(DateTime.fromISO(saInfo.expiration));
        } else {
          setExpiry(undefined);
        }

        setDescription(saInfo?.description || "");
        setStatus(saInfo.accountStatus);
        setInitialPolicy({
          accessKey: selectedAccessKey,
          mode: initialMode,
          definition: initialMode === "inline" ? returnedPolicy : "",
        });
        setPolicyMode(initialMode);
        // Keep the effective parent policy available when the user enables a
        // restriction, but never use it as an implicit update payload.
        setPolicyDefinition(returnedPolicy);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(err?.error || err)));
      });

    return () => {
      active = false;
    };
  }, [dispatch, open, selectedAccessKey]);

  const loaded =
    open &&
    !!selectedAccessKey &&
    initialPolicy?.accessKey === selectedAccessKey;
  const disabled = readOnly || loading || !loaded;
  const validPolicy =
    policyMode === "inherited" ||
    (initialPolicy?.mode === "inline" &&
      policyDefinition === initialPolicy.definition) ||
    policyDefinition.trim() !== "";

  const setPolicy = (event: React.FormEvent) => {
    event.preventDefault();
    if (disabled || !validPolicy || !initialPolicy) {
      return;
    }
    setLoading(true);
    api.serviceAccounts
      .updateServiceAccount(selectedAccessKey || "", {
        // The generated API keeps policy required. An empty string is the
        // server contract for leaving the current policy unchanged.
        policy: policyForServiceAccountUpdate({
          initialMode: initialPolicy.mode,
          mode: policyMode,
          policyDefinition,
          initialPolicyDefinition: initialPolicy.definition,
        }),
        description: description,
        expiry: expiry,
        name: name,
        status: status,
      })
      .then(() => {
        closeModalAndRefresh();
      })
      .catch((res) => {
        setLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(res?.error || res)));
      });
  };

  return (
    <ModalWrapper
      title={formatText(
        t(
          readOnly
            ? i18nKey("Access Key details - {name}")
            : i18nKey("Edit details of - {name}"),
        ),
        {
          name: selectedAccessKey || "",
        },
      )}
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
      titleIcon={<ChangeAccessPolicyIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          setPolicy(e);
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Switch
              value="serviceAccountPolicy"
              id="serviceAccountPolicy"
              name="serviceAccountPolicy"
              checked={policyMode === "inline"}
              disabled={disabled}
              onChange={(event) => {
                setPolicyMode(event.target.checked ? "inline" : "inherited");
              }}
              label={t("Restrict beyond user policy")}
              description={t(
                "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies.",
              )}
            />
          </Grid>
          {(policyMode === "inline" || readOnly) && (
            <Grid item xs={12}>
              <CodeMirrorWrapper
                label={t("Access Key Policy")}
                value={policyDefinition}
                onChange={(value) => {
                  setPolicyDefinition(value);
                }}
                editorHeight={"350px"}
                readOnly={readOnly}
                disabled={disabled}
                helptip={
                  <Fragment>
                    <a
                      target="blank"
                      href={localize(
                        "https://silo.pgsty.com/administration/identity-access-management/policy-based-access-control/#policy-document-structure",
                      )}
                    >
                      {t("Guide to access policy structure")}
                    </a>
                  </Fragment>
                }
              />
            </Grid>
          )}
          <Box
            sx={{
              marginBottom: "15px",
              marginTop: "15px",
              display: "flex",
              width: "100%",
            }}
          >
            <DateTimeInput
              value={expiry}
              onChange={(e) => {
                setExpiry(e);
              }}
              id="expiryTime"
              label={t("Expiry")}
              timeFormat={"24h"}
              secondsSelector={false}
              disabled={disabled}
            />
          </Box>
          <Grid
            xs={12}
            sx={{
              marginBottom: "15px",
            }}
          >
            <InputBox
              value={name}
              size={120}
              label={t("Name")}
              id={"name"}
              name={"name"}
              type={"text"}
              disabled={disabled}
              placeholder={t("Enter a name")}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Grid>
          <Grid
            xs={12}
            sx={{
              marginBottom: "15px",
            }}
          >
            <InputBox
              size={120}
              value={description}
              label={t("Description")}
              id={"description"}
              name={"description"}
              type={"text"}
              disabled={disabled}
              placeholder={t("Enter a description")}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Grid>
          <Grid
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              fontWeight: 600,
              color: "rgb(7, 25, 62)",
              gap: 2,
              marginBottom: "15px",
            }}
          >
            <label style={{ width: "150px" }}>{t("Status")}</label>
            <Box
              sx={{
                padding: "2px",
              }}
            >
              <Switch
                style={{
                  gap: "115px",
                }}
                indicatorLabels={[t("Enabled"), t("Disabled")]}
                checked={status === "on"}
                id="saStatus"
                name="saStatus"
                label=""
                disabled={disabled}
                onChange={(e) => {
                  setStatus(e.target.checked ? "on" : "off");
                }}
                value="yes"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"cancel-sa-policy"}
              type="button"
              variant="regular"
              onClick={() => {
                closeModalAndRefresh();
              }}
              disabled={loading}
              label={t(readOnly ? i18nKey("Close") : i18nKey("Cancel"))}
            />
            {!readOnly && (
              <Button
                id={"save-sa-policy"}
                type="submit"
                variant="callAction"
                color="primary"
                disabled={disabled || !validPolicy}
                label={t("Update")}
              />
            )}
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default EditServiceAccount;
