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

import React, { useState } from "react";
import { Button, EditIcon, FormLayout, Grid, InputBox, Switch } from "mds";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { useAppDispatch } from "../../../store";
import {
  downloadFileName,
  downloadObject,
  windowsDownloadNameLimit,
} from "./utils";
import type { BucketObjectItem } from "../Buckets/ListBuckets/Objects/ListObjects/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import { useT } from "i18n";

interface IRenameLongFilename {
  open: boolean;
  bucketName: string;
  object: BucketObjectItem;
  closeModal: () => void;
}

const RenameLongFileName = ({
  open,
  closeModal,
  object,
  bucketName,
}: IRenameLongFilename) => {
  const dispatch = useAppDispatch();
  const t = useT();

  const originalFileName = downloadFileName(object.name);
  const [newFileName, setNewFileName] = useState(originalFileName);
  const [acceptLongName, setAcceptLongName] = useState<boolean>(false);

  const doDownload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    downloadObject(
      dispatch,
      bucketName,
      object.name,
      object,
      acceptLongName ? null : newFileName,
    );
    closeModal();
  };

  return (
    <ModalWrapper
      title={t("Rename Download")}
      modalOpen={open}
      onClose={closeModal}
      titleIcon={<EditIcon />}
    >
      <div>
        {t("The file you are trying to download has a long name.")}
        <br />
        {t(
          "This can cause issues on Windows Systems by trimming the file name after download.",
        )}
        <br />
        <br /> {t("We recommend to rename the file download")}
      </div>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          doDownload(e);
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          <InputBox
            id="download-filename"
            name="download-filename"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewFileName(event.target.value);
            }}
            label=""
            aria-label={t("Name")}
            type={"text"}
            value={newFileName}
            error={
              newFileName.length > windowsDownloadNameLimit && !acceptLongName
                ? t("Filename should be less than 200 characters long.")
                : ""
            }
          />
          <Switch
            value="acceptLongName"
            id="acceptLongName"
            name="acceptLongName"
            checked={acceptLongName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAcceptLongName(event.target.checked);
              if (event.target.checked) {
                setNewFileName(originalFileName);
              }
            }}
            label={t("Use Original Name")}
          />
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"download-file"}
              type="submit"
              variant="callAction"
              color="primary"
              disabled={
                newFileName.length > windowsDownloadNameLimit && !acceptLongName
              }
              label={t("Download File")}
            />
          </Grid>
        </FormLayout>
      </form>
    </ModalWrapper>
  );
};

export default RenameLongFileName;
