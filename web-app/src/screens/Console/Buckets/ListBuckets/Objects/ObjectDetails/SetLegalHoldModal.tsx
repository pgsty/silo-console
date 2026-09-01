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
import { Box, Button, FormLayout, Grid, Switch } from "mds";
import { BucketObject, ObjectLegalHoldStatus } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { modalStyleUtils } from "../../../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { useT } from "i18n";
import { ObjectTarget } from "../objectIdentity";

interface ISetRetentionProps {
  open: boolean;
  closeModalAndRefresh: (reload: boolean) => void;
  // The validated object version the legal hold change addresses.
  target: ObjectTarget;
  // Display data (current legal hold status) for that same version.
  actualInfo: BucketObject;
}

const SetLegalHoldModal = ({
  open,
  closeModalAndRefresh,
  target,
  actualInfo,
}: ISetRetentionProps) => {
  const bucketName = target.bucket;
  const objectName = target.key;
  const dispatch = useAppDispatch();
  const t = useT();
  const [legalHoldEnabled, setLegalHoldEnabled] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const versionId = target.versionId;

  useEffect(() => {
    const status = get(actualInfo, "legal_hold_status", "OFF");
    setLegalHoldEnabled(status === "ON");
  }, [actualInfo]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    api.buckets
      .putObjectLegalHold(
        bucketName,
        {
          prefix: objectName,
          version_id: versionId || "",
        },
        {
          status: legalHoldEnabled
            ? ObjectLegalHoldStatus.Enabled
            : ObjectLegalHoldStatus.Disabled,
        },
      )
      .then(() => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((err) => {
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        setIsSaving(false);
      });
  };

  const resetForm = () => {
    setLegalHoldEnabled(false);
  };

  return (
    <ModalWrapper
      title={t("Set Legal Hold")}
      modalOpen={open}
      onClose={() => {
        resetForm();
        closeModalAndRefresh(false);
      }}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          onSubmit(e);
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          <Box className={"inputItem"}>
            <strong>{t("Object")}</strong>: {bucketName + "/" + objectName}
          </Box>
          <Switch
            value="legalhold"
            id="legalhold"
            name="legalhold"
            checked={legalHoldEnabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLegalHoldEnabled(!legalHoldEnabled);
            }}
            label={t("Legal Hold Status")}
            indicatorLabels={[t("Enabled"), t("Disabled")]}
            tooltip={t(
              "To enable this feature you need to enable versioning on the bucket before creation",
            )}
          />
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"clear"}
              type="button"
              variant="regular"
              onClick={resetForm}
              label={t("Clear")}
            />
            <Button
              id={"save"}
              type="submit"
              variant="callAction"
              disabled={isSaving}
              label={t("Save")}
            />
          </Grid>
        </FormLayout>
      </form>
    </ModalWrapper>
  );
};

export default SetLegalHoldModal;
