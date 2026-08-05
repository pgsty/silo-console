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

import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  CheckCircleIcon,
  FormLayout,
  Grid,
  InputBox,
  RadioGroup,
  ReadBox,
  Select,
  Switch,
  Tooltip,
  WarnIcon,
  Wizard,
} from "mds";
import get from "lodash/get";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import { ITiersDropDown } from "../types";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { api } from "api";
import { MultiLifecycleResult } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import { useT } from "i18n";

interface IBulkReplicationModal {
  open: boolean;
  closeModalAndRefresh: (clearSelection: boolean) => any;
  buckets: string[];
}

const AddBulkReplicationModal = ({
  open,
  closeModalAndRefresh,
  buckets,
}: IBulkReplicationModal) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [loadingTiers, setLoadingTiers] = useState<boolean>(true);
  const [tiersList, setTiersList] = useState<ITiersDropDown[]>([]);
  const [prefix, setPrefix] = useState("");
  const [tags, setTags] = useState<string>("");
  const [storageClass, setStorageClass] = useState("");
  const [NCTransitionSC, setNCTransitionSC] = useState("");
  const [expiredObjectDM, setExpiredObjectDM] = useState<boolean>(false);
  const [expiredAllVersionsDM, setExpiredAllVersionsDM] =
    useState<boolean>(false);
  const [NCExpirationDays, setNCExpirationDays] = useState<string>("0");
  const [NCTransitionDays, setNCTransitionDays] = useState<string>("0");
  const [ilmType, setIlmType] = useState<"expiry" | "transition">("expiry");
  const [expiryDays, setExpiryDays] = useState<string>("0");
  const [transitionDays, setTransitionDays] = useState<string>("0");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [results, setResults] = useState<MultiLifecycleResult | null>(null);

  useEffect(() => {
    if (loadingTiers) {
      api.admin
        .tiersListNames()
        .then((res) => {
          const tiersList: string[] | null = get(res.data, "items", []);

          if (tiersList !== null && tiersList.length >= 1) {
            const objList = tiersList.map((tierName: string) => {
              return { label: tierName, value: tierName };
            });

            setTiersList(objList);
            if (objList.length > 0) {
              setStorageClass(objList[0].value);
            }
          }
          setLoadingTiers(false);
        })
        .catch((err) => {
          setLoadingTiers(false);
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [dispatch, loadingTiers]);

  useEffect(() => {
    let valid = true;

    if (ilmType !== "expiry") {
      if (storageClass === "") {
        valid = false;
      }
    }
    setIsFormValid(valid);
  }, [ilmType, expiryDays, transitionDays, storageClass]);

  const LogoToShow = ({ errString }: { errString: string }) => {
    switch (errString) {
      case "":
        return (
          <Box
            sx={{
              paddingTop: 5,
              color: "#42C91A",
            }}
          >
            <CheckCircleIcon />
          </Box>
        );
      case "n/a":
        return null;
      default:
        if (errString) {
          return (
            <Box
              sx={{
                paddingTop: 5,
                color: "#C72C48",
              }}
            >
              <Tooltip tooltip={errString} placement="top">
                <WarnIcon />
              </Tooltip>
            </Box>
          );
        }
    }
    return null;
  };

  const createLifecycleRules = (to: any) => {
    let rules = {};

    if (ilmType === "expiry") {
      let expiry = {
        expiry_days: parseInt(expiryDays),
      };

      rules = {
        ...expiry,
        noncurrentversion_expiration_days: parseInt(NCExpirationDays),
      };
    } else {
      let transition = {
        transition_days: parseInt(transitionDays),
      };

      rules = {
        ...transition,
        noncurrentversion_transition_days: parseInt(NCTransitionDays),
        noncurrentversion_transition_storage_class: NCTransitionSC,
        storage_class: storageClass,
      };
    }

    const lifecycleInsert = {
      buckets,
      type: ilmType,
      prefix,
      tags,
      expired_object_delete_marker: expiredObjectDM,
      expired_object_delete_all: expiredAllVersionsDM,
      ...rules,
    };

    api.buckets
      .addMultiBucketLifecycle(lifecycleInsert)
      .then((res) => {
        setAddLoading(false);
        setResults(res.data);
        to("++");
      })
      .catch((err) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title={t("Set Lifecycle to multiple buckets")}
    >
      <Wizard
        loadingStep={addLoading || loadingTiers}
        wizardSteps={[
          {
            label: t("Lifecycle Configuration"),
            componentRender: (
              <Fragment>
                <FormLayout withBorders={false} containerPadding={false}>
                  <Grid item xs={12}>
                    <ReadBox
                      label={t("Local Buckets to replicate")}
                      sx={{ maxWidth: "440px", width: "100%" }}
                    >
                      {buckets.join(", ")}
                    </ReadBox>
                  </Grid>
                  <h4>{t("Remote Endpoint Configuration")}</h4>
                  <fieldset className={"inputItem"}>
                    <legend>{t("Lifecycle Configuration")}</legend>
                    <RadioGroup
                      currentValue={ilmType}
                      id="quota_type"
                      name="quota_type"
                      label={t("ILM Rule")}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        setIlmType(e.target.value as "expiry" | "transition");
                      }}
                      selectorOptions={[
                        { value: "expiry", label: t("Expiry") },
                        { value: "transition", label: t("Transition") },
                      ]}
                    />
                    {ilmType === "expiry" ? (
                      <Fragment>
                        <InputBox
                          type="number"
                          id="expiry_days"
                          name="expiry_days"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setExpiryDays(e.target.value);
                          }}
                          label={t("Expiry Days")}
                          value={expiryDays}
                          min="0"
                        />
                        <InputBox
                          type="number"
                          id="noncurrentversion_expiration_days"
                          name="noncurrentversion_expiration_days"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setNCExpirationDays(e.target.value);
                          }}
                          label={t("Non-current Expiration Days")}
                          value={NCExpirationDays}
                          min="0"
                        />
                      </Fragment>
                    ) : (
                      <Fragment>
                        <InputBox
                          type="number"
                          id="transition_days"
                          name="transition_days"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setTransitionDays(e.target.value);
                          }}
                          label={t("Transition Days")}
                          value={transitionDays}
                          min="0"
                        />
                        <InputBox
                          type="number"
                          id="noncurrentversion_transition_days"
                          name="noncurrentversion_transition_days"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setNCTransitionDays(e.target.value);
                          }}
                          label={t("Non-current Transition Days")}
                          value={NCTransitionDays}
                          min="0"
                        />
                        <InputBox
                          id="noncurrentversion_t_SC"
                          name="noncurrentversion_t_SC"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setNCTransitionSC(e.target.value);
                          }}
                          placeholder={t(
                            "Set Non-current Version Transition Storage Class",
                          )}
                          label={t(
                            "Non-current Version Transition Storage Class",
                          )}
                          value={NCTransitionSC}
                        />
                        <Select
                          label={t("Storage Class")}
                          id="storage_class"
                          name="storage_class"
                          value={storageClass}
                          onChange={(value) => {
                            setStorageClass(value);
                          }}
                          options={tiersList}
                        />
                      </Fragment>
                    )}
                  </fieldset>
                  <fieldset className={"inputItem"}>
                    <legend>{t("File Configuration")}</legend>
                    <InputBox
                      id="prefix"
                      name="prefix"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPrefix(e.target.value);
                      }}
                      label={t("Prefix")}
                      value={prefix}
                    />
                    <QueryMultiSelector
                      name="tags"
                      label={t("Tags")}
                      elements={tags}
                      onChange={(vl: string) => {
                        setTags(vl);
                      }}
                      keyPlaceholder={t("Tag Key")}
                      valuePlaceholder={t("Tag Value")}
                      withBorder
                    />
                    <Switch
                      value="expired_delete_marker"
                      id="expired_delete_marker"
                      name="expired_delete_marker"
                      checked={expiredObjectDM}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setExpiredObjectDM(event.target.checked);
                      }}
                      label={t("Expired Object Delete Marker")}
                    />
                    <Switch
                      value="expired_delete_all"
                      id="expired_delete_all"
                      name="expired_delete_all"
                      checked={expiredAllVersionsDM}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setExpiredAllVersionsDM(event.target.checked);
                      }}
                      label={t("Expired All Versions")}
                    />
                  </fieldset>
                </FormLayout>
              </Fragment>
            ),
            buttons: [
              {
                type: "custom",
                label: t("Create Rules"),
                enabled: !loadingTiers && !addLoading && isFormValid,
                action: createLifecycleRules,
              },
            ],
          },
          {
            label: t("Results"),
            componentRender: (
              <Fragment>
                <h3>{t("Multi Bucket lifecycle Assignments Results")}</h3>
                <Grid container>
                  <Grid item xs={12}>
                    <h4>{t("Buckets Results")}</h4>
                    {results?.results?.map((resultItem) => {
                      return (
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "45px auto",
                            alignItems: "center",
                            justifyContent: "stretch",
                          }}
                        >
                          {LogoToShow({ errString: resultItem.error || "" })}
                          <span>{resultItem.bucketName}</span>
                        </Box>
                      );
                    })}
                  </Grid>
                </Grid>
              </Fragment>
            ),
            buttons: [
              {
                type: "custom",
                label: t("Done"),
                enabled: !addLoading,
                action: () => closeModalAndRefresh(true),
              },
            ],
          },
        ]}
        forModal
      />
    </ModalWrapper>
  );
};

export default AddBulkReplicationModal;
