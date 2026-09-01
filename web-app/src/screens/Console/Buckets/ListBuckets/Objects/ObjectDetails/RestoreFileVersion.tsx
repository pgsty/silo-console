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

import React, { Fragment, useState } from "react";
import { Box, RecoverIcon } from "mds";
import { BucketObject } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";
import { restoreLocalObjectList } from "../../../../ObjectBrowser/objectBrowserSlice";
import { interpolate, useT } from "i18n";
import { ObjectLocation, ObjectTarget, sameLocation } from "../objectIdentity";

interface IRestoreFileVersion {
  restoreOpen: boolean;
  // The version to restore, validated against the current versions listing.
  target: ObjectTarget;
  // Where it is restored to: always the same bucket and key.
  destination: ObjectLocation;
  versionInfo: BucketObject;
  onCloseAndUpdate: (refresh: boolean) => void;
}

const RestoreFileVersion = ({
  target,
  destination,
  versionInfo,
  restoreOpen,
  onCloseAndUpdate,
}: IRestoreFileVersion) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const [restoreLoading, setRestoreLoading] = useState<boolean>(false);

  // Restore copies a version of an object over that same object.
  const canRestore = sameLocation(target, destination);

  const restoreVersion = () => {
    if (!canRestore) {
      return;
    }
    setRestoreLoading(true);

    api.buckets
      .putObjectRestore(destination.bucket, {
        prefix: destination.key,
        version_id: target.versionId,
      })
      .then(() => {
        setRestoreLoading(false);
        onCloseAndUpdate(true);
        dispatch(
          restoreLocalObjectList({
            prefix: destination.key,
            objectInfo: versionInfo,
          }),
        );
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        setRestoreLoading(false);
      });
  };

  return (
    <ConfirmDialog
      title={t("Restore File Version")}
      confirmText={t("Restore")}
      isOpen={restoreOpen}
      isLoading={restoreLoading}
      titleIcon={<RecoverIcon />}
      onConfirm={restoreVersion}
      confirmButtonProps={{
        variant: "secondary",
        disabled: restoreLoading || !canRestore,
      }}
      onClose={() => {
        onCloseAndUpdate(false);
      }}
      confirmationContent={
        <Box id="alert-dialog-description">
          {interpolate(
            t(
              "Are you sure you want to restore {object} with Version ID: {version}?",
            ),
            {
              object: (
                <Fragment>
                  <br />
                  <b>{destination.key}</b>
                  <br />
                </Fragment>
              ),
              version: (
                <Fragment>
                  <br />
                  <b>{target.versionId}</b>
                </Fragment>
              ),
            },
          )}
        </Box>
      }
    />
  );
};

export default RestoreFileVersion;
