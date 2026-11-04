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

import { bucketQuotaCommands } from "common/mcli/commands";
import { FormCliEquivalent } from "common/mcli/FormCliEquivalent";
import React, { useEffect, useState } from "react";
import {
  BucketQuotaIcon,
  Button,
  FormLayout,
  InputBox,
  Switch,
  Grid,
  ProgressBar,
} from "mds";
import { getBytes, k8sScalarUnitsExcluding } from "../../../../common/utils";

import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { useT } from "i18n";
import InputUnitMenu from "../../Common/FormComponents/InputUnitMenu/InputUnitMenu";

import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { BucketQuota } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import {
  getQuotaBytes,
  isValidQuota,
} from "../ListBuckets/AddBucket/addBucketValidation";

const quotaUnits = [
  { label: "B", value: "B" },
  ...k8sScalarUnitsExcluding(["Ki"]),
];

// An editor must retain bytes; display-only rounding is unsuitable here.
const editableQuota = (bytes: number) => {
  for (const { value: unit } of [...quotaUnits].reverse()) {
    const value = bytes / Number(getBytes("1", unit, true));
    if (value < 1 && unit !== "B") continue;
    const size = Number(value.toFixed(2)).toString();
    if (Number(getBytes(size, unit, true)) === bytes) return { size, unit };
  }
  return { size: bytes.toString(), unit: "B" };
};

interface IEnableQuotaProps {
  open: boolean;
  enabled: boolean;
  cfg: BucketQuota | null;
  selectedBucket: string;
  closeModalAndRefresh: () => void;
}

const EnableQuota = ({
  open,
  enabled,
  cfg,
  selectedBucket,
  closeModalAndRefresh,
}: IEnableQuotaProps) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const [loading, setLoading] = useState<boolean>(false);
  const [quotaEnabled, setQuotaEnabled] = useState<boolean>(false);
  const [quotaSize, setQuotaSize] = useState<string>("1");
  const [quotaUnit, setQuotaUnit] = useState<string>("Ti");
  const quotaAmount = getQuotaBytes(quotaSize, quotaUnit);
  const validInput = !quotaEnabled || isValidQuota(quotaSize, quotaUnit);

  useEffect(() => {
    if (enabled) {
      setQuotaEnabled(true);
      if (cfg) {
        const quota = editableQuota(cfg.quota || 0);

        setQuotaSize(quota.size);
        setQuotaUnit(quota.unit);
      }
    }
  }, [enabled, cfg]);

  const enableBucketEncryption = () => {
    if (loading || !validInput) {
      return;
    }

    const amount = quotaEnabled ? quotaAmount : 0;
    if (quotaEnabled === enabled && (!quotaEnabled || amount === cfg?.quota)) {
      closeModalAndRefresh();
      return;
    }

    api.buckets
      .setBucketQuota(selectedBucket, {
        enabled: quotaEnabled,
        amount,
        quota_type: "hard",
      })
      .then(() => {
        setLoading(false);
        closeModalAndRefresh();
      })
      .catch((err) => {
        setLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
      title={t("Enable Bucket Quota")}
      titleIcon={<BucketQuotaIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          enableBucketEncryption();
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          <Switch
            value="bucket_quota"
            id="bucket_quota"
            name="bucket_quota"
            checked={quotaEnabled}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setQuotaEnabled(event.target.checked);
            }}
            label={t("Enabled")}
          />
          {quotaEnabled && (
            <InputBox
              id="quota_size"
              name="quota_size"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuotaSize(e.target.value);
              }}
              label={t("Quota")}
              value={quotaSize}
              required
              min="1"
              overlayObject={
                <InputUnitMenu
                  id={"quota_unit"}
                  onUnitChange={(newValue) => {
                    setQuotaUnit(newValue);
                  }}
                  unitSelected={quotaUnit}
                  unitsList={quotaUnits}
                  disabled={false}
                />
              }
              error={!validInput ? t("Please enter a valid quota") : ""}
            />
          )}
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"cancel"}
              type="button"
              variant="regular"
              disabled={loading}
              onClick={() => {
                closeModalAndRefresh();
              }}
              label={t("Cancel")}
            />

            <Button
              id={"save"}
              type="submit"
              variant="callAction"
              disabled={loading || !validInput}
              label={t("Save")}
            />
          </Grid>
          {loading && (
            <Grid item xs={12}>
              <ProgressBar />
            </Grid>
          )}
          <FormCliEquivalent
            commands={bucketQuotaCommands({
              bucket: selectedBucket,
              enabled: quotaEnabled,
              size: quotaSize ? `${quotaSize}${quotaUnit}` : undefined,
            })}
          />
        </FormLayout>
      </form>
    </ModalWrapper>
  );
};

export default EnableQuota;
