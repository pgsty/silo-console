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
import { useNavigate } from "react-router-dom";
import {
  ActionLink,
  AddIcon,
  Box,
  Button,
  ClustersIcon,
  ConfirmDeleteIcon,
  Grid,
  HelpBox,
  Loader,
  PageLayout,
  RecoverIcon,
  SectionTitle,
  TrashIcon,
} from "mds";
import { ErrorResponseHandler } from "../../../../common/types";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import {
  setErrorSnackMessage,
  setHelpName,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import useApi from "../../Common/Hooks/useApi";
import ReplicationSites from "./ReplicationSites";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";
import { interpolate, useLocalizedLink, useT } from "i18n";

export type ReplicationSite = {
  deploymentID: string;
  endpoint: string;
  name: string;
  isCurrent?: boolean;
};

const SiteReplication = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const localize = useLocalizedLink();

  const [sites, setSites] = useState([]);

  const [deleteAll, setIsDeleteAll] = useState(false);
  const [isSiteInfoLoading, invokeSiteInfoApi] = useApi(
    (res: any) => {
      const { sites: siteList, name: curSiteName } = res;
      // current site name to be the fist one.
      const foundIdx = siteList.findIndex((el: any) => el.name === curSiteName);
      if (foundIdx !== -1) {
        let curSite = siteList[foundIdx];
        curSite = {
          ...curSite,
          isCurrent: true,
        };
        siteList.splice(foundIdx, 1, curSite);
      }

      siteList.sort((x: any, y: any) => {
        return x.name === curSiteName ? -1 : y.name === curSiteName ? 1 : 0;
      });
      setSites(siteList);
    },
    (err: any) => {
      setSites([]);
    },
  );

  const getSites = () => {
    invokeSiteInfoApi("GET", `api/v1/admin/site-replication`);
  };

  const [isRemoving, invokeSiteRemoveApi] = useApi(
    (res: any) => {
      setIsDeleteAll(false);
      dispatch(setSnackBarMessage(t("Successfully deleted.")));
      getSites();
    },
    (err: ErrorResponseHandler) => {
      dispatch(setErrorSnackMessage(err));
    },
  );

  const removeSites = (isAll: boolean = false, delSites: string[] = []) => {
    invokeSiteRemoveApi("DELETE", `api/v1/admin/site-replication`, {
      all: isAll,
      sites: delSites,
    });
  };

  useEffect(() => {
    getSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasSites = sites?.length;

  useEffect(() => {
    dispatch(setHelpName("site-replication"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper label={"Site Replication"} actions={<HelpMenu />} />
      <PageLayout>
        <SectionTitle
          separator={!!hasSites}
          sx={{ marginBottom: 15 }}
          actions={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              {hasSites ? (
                <Fragment>
                  <TooltipWrapper tooltip={t("Delete All")}>
                    <Button
                      id={"delete-all"}
                      label={t("Delete All")}
                      variant="secondary"
                      disabled={isRemoving}
                      icon={<TrashIcon />}
                      onClick={() => {
                        setIsDeleteAll(true);
                      }}
                    />
                  </TooltipWrapper>
                  <TooltipWrapper tooltip={t("Replication Status")}>
                    <Button
                      id={"replication-status"}
                      label={t("Replication Status")}
                      variant="regular"
                      icon={<RecoverIcon />}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(IAM_PAGES.SITE_REPLICATION_STATUS);
                      }}
                    />
                  </TooltipWrapper>
                </Fragment>
              ) : null}
              <TooltipWrapper tooltip={t("Add Replication Sites")}>
                <Button
                  id={"add-replication-site"}
                  label={t("Add Sites")}
                  variant="callAction"
                  disabled={isRemoving}
                  icon={<AddIcon />}
                  onClick={() => {
                    navigate(IAM_PAGES.SITE_REPLICATION_ADD);
                  }}
                />
              </TooltipWrapper>
            </Box>
          }
        >
          {hasSites ? t("List of Replicated Sites") : ""}
        </SectionTitle>
        {hasSites ? (
          <ReplicationSites
            sites={sites}
            onDeleteSite={removeSites}
            onRefresh={getSites}
          />
        ) : null}
        {isSiteInfoLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc( 100vh - 450px )",
            }}
          >
            <Loader style={{ width: 16, height: 16 }} />
          </Box>
        ) : null}
        {!hasSites && !isSiteInfoLoading ? (
          <Grid container>
            <Grid item xs={8}>
              <HelpBox
                title={t("Site Replication")}
                iconComponent={<ClustersIcon />}
                help={
                  <Fragment>
                    {t(
                      "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas.",
                    )}
                    <br />
                    <br />
                    {interpolate(t("To get started, {link}."), {
                      link: (
                        <ActionLink
                          isLoading={false}
                          label={""}
                          onClick={() => {
                            navigate(IAM_PAGES.SITE_REPLICATION_ADD);
                          }}
                        >
                          {t("Add a Replication Site")}
                        </ActionLink>
                      ),
                    })}
                    <br />
                    {interpolate(t("You can learn more at the {link}."), {
                      link: (
                        <a
                          href={localize(
                            "https://silo.pgsty.com/operations/replication/multi-site-replication/",
                          )}
                          target="_blank"
                          rel="noopener"
                        >
                          {t("documentation")}
                        </a>
                      ),
                    })}
                  </Fragment>
                }
              />
            </Grid>
          </Grid>
        ) : null}
        {hasSites && !isSiteInfoLoading ? (
          <HelpBox
            title={t("Site Replication")}
            iconComponent={<ClustersIcon />}
            help={
              <Fragment>
                {t(
                  "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.",
                )}
                <br />
                <br />
                {t(
                  "Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.",
                )}
                <br />
                <br />
                {t(
                  "All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).",
                )}
                <br />
                <br />
                {t("All sites must be using the same external IDP(s) if any.")}
                <br />
                <br />
                {t(
                  "For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.",
                )}
                <br />
                <br />
                {interpolate(t("You can learn more at the {link}."), {
                  link: (
                    <a
                      href={localize(
                        "https://silo.pgsty.com/operations/replication/multi-site-replication/#minio-site-replication-overview",
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      {t("documentation")}
                    </a>
                  ),
                })}
              </Fragment>
            }
          />
        ) : null}

        {deleteAll ? (
          <ConfirmDialog
            title={t("Delete All")}
            confirmText={t("Delete")}
            isOpen={true}
            titleIcon={<ConfirmDeleteIcon />}
            isLoading={false}
            onConfirm={() => {
              const siteNames = sites.map((s: any) => s.name);
              removeSites(true, siteNames);
            }}
            onClose={() => {
              setIsDeleteAll(false);
            }}
            confirmationContent={
              <Fragment>
                {t(
                  "Are you sure you want to remove all the replication sites?.",
                )}
              </Fragment>
            }
          />
        ) : null}
      </PageLayout>
    </Fragment>
  );
};

export default SiteReplication;
