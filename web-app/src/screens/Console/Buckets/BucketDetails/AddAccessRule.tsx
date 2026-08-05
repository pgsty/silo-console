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

import React, { useEffect, useState, Fragment } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import {
  AddAccessRuleIcon,
  Button,
  FormLayout,
  Grid,
  InputBox,
  Select,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { useT } from "i18n";

interface IAddAccessRule {
  modalOpen: boolean;
  onClose: () => any;
  bucket: string;
  prefilledRoute?: string;
}

const AddAccessRule = ({
  modalOpen,
  onClose,
  bucket,
  prefilledRoute,
}: IAddAccessRule) => {
  const dispatch = useAppDispatch();
  const t = useT();

  const [prefix, setPrefix] = useState("");
  const [selectedAccess, setSelectedAccess] = useState<any>("readonly");

  useEffect(() => {
    if (prefilledRoute) {
      setPrefix(prefilledRoute);
    }
  }, [prefilledRoute]);

  const accessOptions = [
    { label: t("readonly"), value: "readonly" },
    { label: t("writeonly"), value: "writeonly" },
    { label: t("readwrite"), value: "readwrite" },
  ];

  const resetForm = () => {
    setPrefix("");
    setSelectedAccess("readonly");
  };

  const createProcess = () => {
    api.bucket
      .setAccessRuleWithBucket(bucket, {
        prefix: prefix,
        access: selectedAccess,
      })
      .then((res: any) => {
        dispatch(setSnackBarMessage(t("Access Rule added successfully")));
        onClose();
      })
      .catch((res) => {
        dispatch(setErrorSnackMessage(errorToHandler(res.error)));
        onClose();
      });
  };

  return (
    <ModalWrapper
      modalOpen={modalOpen}
      title={t("Add Anonymous Access Rule")}
      onClose={onClose}
      titleIcon={<AddAccessRuleIcon />}
    >
      <FormLayout withBorders={false} containerPadding={false}>
        <InputBox
          value={prefix}
          label={t("Prefix")}
          id={"prefix"}
          name={"prefix"}
          placeholder={t("Enter Prefix")}
          onChange={(e) => {
            setPrefix(e.target.value);
          }}
          tooltip={t(
            "Enter '/' to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk '*' as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy.",
          )}
        />
        <Select
          id="access"
          name="Access"
          onChange={(value) => {
            setSelectedAccess(value);
          }}
          label={t("Access")}
          value={selectedAccess}
          options={accessOptions}
          disabled={false}
          helpTip={
            <Fragment>
              {t(
                "Select the desired level of access available to unauthenticated Users",
              )}
            </Fragment>
          }
          helpTipPlacement="right"
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
            id={"add-access-save"}
            type="submit"
            variant="callAction"
            disabled={prefix.trim() === ""}
            onClick={createProcess}
            label={t("Save")}
          />
        </Grid>
      </FormLayout>
    </ModalWrapper>
  );
};

export default AddAccessRule;
