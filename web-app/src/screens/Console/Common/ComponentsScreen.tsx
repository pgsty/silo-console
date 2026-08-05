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

import React, { Fragment, useEffect, useState } from "react";
import { Button, ConfirmDeleteIcon, PageLayout, SectionTitle, Grid } from "mds";
import ConfirmDialog from "./ModalWrapper/ConfirmDialog";
import PageHeaderWrapper from "./PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import { setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { interpolate, useT } from "i18n";

const ComponentsScreen = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const t = useT();

  useEffect(() => {
    dispatch(setHelpName("components"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper label={"Components"} actions={<HelpMenu />} />

      <PageLayout>
        <Grid container>
          <Grid item xs={12}>
            <SectionTitle>{t("Confirm Dialogs")}</SectionTitle>
          </Grid>
          <Grid item xs={12}>
            <p>{t("Used to confirm a non-idempotent action.")}</p>
          </Grid>
          <Grid item xs={12}>
            <Button
              id={"open-dialog-test"}
              type="button"
              variant={"regular"}
              onClick={() => {
                setDialogOpen(true);
              }}
              label={t("Open Dialog")}
            />
            <ConfirmDialog
              title={t("Delete Bucket")}
              confirmText={t("Delete")}
              isOpen={dialogOpen}
              titleIcon={<ConfirmDeleteIcon />}
              isLoading={false}
              onConfirm={() => {
                setDialogOpen(false);
              }}
              onClose={() => {
                setDialogOpen(false);
              }}
              confirmationContent={
                <Fragment>
                  {interpolate(
                    t("Are you sure you want to delete bucket {bucket}?"),
                    { bucket: <b>bucket</b> },
                  )}
                  <br />
                  {t("A bucket can only be deleted if it's empty.")}
                </Fragment>
              }
            />
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default ComponentsScreen;
