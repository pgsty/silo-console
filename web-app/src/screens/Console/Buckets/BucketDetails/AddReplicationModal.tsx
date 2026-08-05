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

import React, { useEffect, useState } from "react";
import get from "lodash/get";
import {
  Box,
  BucketReplicationIcon,
  Button,
  FormLayout,
  Grid,
  InputBox,
  Select,
  Switch,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import { BucketReplicationRule } from "../types";
import { getBytes, k8sScalarUnitsExcluding } from "../../../../common/utils";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import InputUnitMenu from "../../Common/FormComponents/InputUnitMenu/InputUnitMenu";
import { useT } from "i18n";

interface IReplicationModal {
  open: boolean;
  closeModalAndRefresh: () => any;
  bucketName: string;

  setReplicationRules: BucketReplicationRule[];
}

const AddReplicationModal = ({
  open,
  closeModalAndRefresh,
  bucketName,
  setReplicationRules,
}: IReplicationModal) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [priority, setPriority] = useState<string>("1");
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [targetURL, setTargetURL] = useState<string>("");
  const [targetStorageClass, setTargetStorageClass] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [targetBucket, setTargetBucket] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [useTLS, setUseTLS] = useState<boolean>(true);
  const [repDeleteMarker, setRepDeleteMarker] = useState<boolean>(true);
  const [repDelete, setRepDelete] = useState<boolean>(true);
  const [metadataSync, setMetadataSync] = useState<boolean>(true);
  const [tags, setTags] = useState<string>("");
  const [replicationMode, setReplicationMode] = useState<"async" | "sync">(
    "async",
  );
  const [bandwidthScalar, setBandwidthScalar] = useState<string>("100");
  const [bandwidthUnit, setBandwidthUnit] = useState<string>("Gi");
  const [healthCheck, setHealthCheck] = useState<string>("60");

  useEffect(() => {
    if (setReplicationRules.length === 0) {
      setPriority("1");
      return;
    }

    const greatestValue = setReplicationRules.reduce((prevAcc, currValue) => {
      if (currValue.priority > prevAcc) {
        return currValue.priority;
      }
      return prevAcc;
    }, 0);

    const nextPriority = greatestValue + 1;
    setPriority(nextPriority.toString());
  }, [setReplicationRules]);

  const addRecord = () => {
    const replicate = [
      {
        originBucket: bucketName,
        destinationBucket: targetBucket,
      },
    ];

    const hc = parseInt(healthCheck);

    const endURL = `${useTLS ? "https://" : "http://"}${targetURL}`;

    const remoteBucketsInfo = {
      accessKey: accessKey,
      secretKey: secretKey,
      targetURL: endURL,
      region: region,
      bucketsRelation: replicate,
      syncMode: replicationMode,
      bandwidth:
        replicationMode === "async"
          ? parseInt(getBytes(bandwidthScalar, bandwidthUnit, true))
          : 0,
      healthCheckPeriod: hc,
      prefix: prefix,
      tags: tags,
      replicateDeleteMarkers: repDeleteMarker,
      replicateDeletes: repDelete,
      priority: parseInt(priority),
      storageClass: targetStorageClass,
      replicateMetadata: metadataSync,
    };

    api.bucketsReplication
      .setMultiBucketReplication(remoteBucketsInfo)
      .then((res) => {
        setAddLoading(false);

        const states = get(res.data, "replicationState", []);

        if (states.length > 0) {
          const itemVal = states[0];

          setAddLoading(false);

          if (itemVal.errorString && itemVal.errorString !== "") {
            dispatch(
              setModalErrorSnackMessage({
                errorMessage: itemVal.errorString,
                detailedError: "",
              }),
            );
            return;
          }

          closeModalAndRefresh();

          return;
        }
        dispatch(
          setModalErrorSnackMessage({
            errorMessage: t("No changes applied"),
            detailedError: "",
          }),
        );
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
        closeModalAndRefresh();
      }}
      title={t("Set Bucket Replication")}
      titleIcon={<BucketReplicationIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setAddLoading(true);
          addRecord();
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          <InputBox
            id="priority"
            name="priority"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.validity.valid) {
                setPriority(e.target.value);
              }
            }}
            label={t("Priority")}
            value={priority}
            pattern={"[0-9]*"}
          />

          <InputBox
            id="targetURL"
            name="targetURL"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTargetURL(e.target.value);
            }}
            placeholder="s3.example.com"
            label={t("Target URL")}
            value={targetURL}
          />

          <Switch
            checked={useTLS}
            id="useTLS"
            name="useTLS"
            label={t("Use TLS")}
            onChange={(e) => {
              setUseTLS(e.target.checked);
            }}
            value="yes"
          />

          <InputBox
            id="accessKey"
            name="accessKey"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAccessKey(e.target.value);
            }}
            label={t("Access Key")}
            value={accessKey}
          />

          <InputBox
            id="secretKey"
            name="secretKey"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSecretKey(e.target.value);
            }}
            label={t("Secret Key")}
            value={secretKey}
          />

          <InputBox
            id="targetBucket"
            name="targetBucket"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTargetBucket(e.target.value);
            }}
            label={t("Target Bucket")}
            value={targetBucket}
          />

          <InputBox
            id="region"
            name="region"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setRegion(e.target.value);
            }}
            label={t("Region")}
            value={region}
          />

          <Select
            id="replication_mode"
            name="replication_mode"
            onChange={(value) => {
              setReplicationMode(value as "async" | "sync");
            }}
            label={t("Replication Mode")}
            value={replicationMode}
            options={[
              { label: t("Asynchronous"), value: "async" },
              { label: t("Synchronous"), value: "sync" },
            ]}
          />

          {replicationMode === "async" && (
            <Box className={"inputItem"}>
              <InputBox
                type="number"
                id="bandwidth_scalar"
                name="bandwidth_scalar"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.validity.valid) {
                    setBandwidthScalar(e.target.value as string);
                  }
                }}
                label={t("Bandwidth")}
                value={bandwidthScalar}
                min="0"
                pattern={"[0-9]*"}
                overlayObject={
                  <InputUnitMenu
                    id={"quota_unit"}
                    onUnitChange={(newValue) => {
                      setBandwidthUnit(newValue);
                    }}
                    unitSelected={bandwidthUnit}
                    unitsList={k8sScalarUnitsExcluding(["Ki"])}
                    disabled={false}
                  />
                }
              />
            </Box>
          )}

          <InputBox
            id="healthCheck"
            name="healthCheck"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setHealthCheck(e.target.value as string);
            }}
            label={t("Health Check Duration")}
            value={healthCheck}
          />

          <InputBox
            id="storageClass"
            name="storageClass"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTargetStorageClass(e.target.value);
            }}
            placeholder={t("STANDARD_IA,REDUCED_REDUNDANCY etc")}
            label={t("Storage Class")}
            value={targetStorageClass}
          />

          <fieldset className={"inputItem"}>
            <legend>{t("Object Filters")}</legend>
            <InputBox
              id="prefix"
              name="prefix"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPrefix(e.target.value);
              }}
              placeholder={t("prefix")}
              label={t("Prefix")}
              value={prefix}
            />
            <QueryMultiSelector
              name="tags"
              label={t("Tags")}
              elements={""}
              onChange={(vl: string) => {
                setTags(vl);
              }}
              keyPlaceholder={t("Tag Key")}
              valuePlaceholder={t("Tag Value")}
              withBorder
            />
          </fieldset>
          <fieldset className={"inputItem"}>
            <legend>{t("Replication Options")}</legend>
            <Switch
              checked={metadataSync}
              id="metadatataSync"
              name="metadatataSync"
              label={t("Metadata Sync")}
              onChange={(e) => {
                setMetadataSync(e.target.checked);
              }}
              description={t("Metadata Sync")}
            />
            <Switch
              checked={repDeleteMarker}
              id="deleteMarker"
              name="deleteMarker"
              label={t("Delete Marker")}
              onChange={(e) => {
                setRepDeleteMarker(e.target.checked);
              }}
              description={t("Replicate soft deletes")}
            />
            <Switch
              checked={repDelete}
              id="repDelete"
              name="repDelete"
              label={t("Deletes")}
              onChange={(e) => {
                setRepDelete(e.target.checked);
              }}
              description={t("Replicate versioned deletes")}
            />
          </fieldset>
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"cancel"}
              type="button"
              variant="regular"
              disabled={addLoading}
              onClick={() => {
                closeModalAndRefresh();
              }}
              label={t("Cancel")}
            />
            <Button
              id={"submit"}
              type="submit"
              variant="callAction"
              color="primary"
              disabled={addLoading}
              label={t("Save")}
            />
          </Grid>
        </FormLayout>
      </form>
    </ModalWrapper>
  );
};

export default AddReplicationModal;
