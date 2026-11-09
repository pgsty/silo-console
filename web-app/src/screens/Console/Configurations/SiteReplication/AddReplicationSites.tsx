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

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BackLink,
  Button,
  ClustersIcon,
  HelpBox,
  PageLayout,
  Box,
  Grid,
  ProgressBar,
  breakPoints,
} from "mds";
import useApi from "../../Common/Hooks/useApi";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import {
  setErrorSnackMessage,
  setHelpName,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import { selSession } from "../../consoleSlice";
import SRSiteInputRow from "./SRSiteInputRow";
import { SiteInputRow } from "./Types";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import { i18nKey, useT } from "i18n";

type PeerSiteForm = SiteInputRow & { formId: number };

const isValidEndPoint = (ep: string) => {
  let isValidEndPointUrl = false;

  try {
    new URL(ep);
    isValidEndPointUrl = true;
  } catch (err) {
    isValidEndPointUrl = false;
  }
  if (isValidEndPointUrl) {
    return "";
  } else {
    return i18nKey("Invalid Endpoint");
  }
};

const isEmptyValue = (value: string | undefined): boolean => {
  return !value?.trim();
};

const SiteTypeHeader = ({ title, id }: { title: string; id: string }) => (
  <h3
    id={id}
    style={{
      margin: "0 0 12px",
      fontSize: "var(--fs-subtitle)",
      lineHeight: "var(--lh-subtitle)",
      fontWeight: 550,
    }}
  >
    {title}
  </h3>
);

const AddReplicationSites = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();

  const { serverEndPoint = "" } = useSelector(selSession);

  const [currentSite, setCurrentSite] = useState<SiteInputRow[]>([
    {
      endpoint: serverEndPoint,
      name: "",
      accessKey: "",
      secretKey: "",
    },
  ]);

  const nextPeerId = useRef(0);
  const [existingSites, setExistingSites] = useState<PeerSiteForm[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [validationKey, setValidationKey] = useState(0);
  const [focusTarget, setFocusTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!focusTarget) return;
    document.getElementById(focusTarget)?.focus();
    setFocusTarget(null);
  }, [focusTarget]);

  const setDefaultNewRows = () => {
    const defaultNewSites = [
      {
        endpoint: "",
        name: "",
        accessKey: "",
        secretKey: "",
        formId: nextPeerId.current++,
      },
    ];
    setExistingSites(defaultNewSites);
  };

  const [isSiteInfoLoading, invokeSiteInfoApi] = useApi(
    (res: any) => {
      const { sites: siteList, name: curSiteName } = res;
      // current site name to be the fist one.
      const foundIdx = siteList.findIndex((el: any) => el.name === curSiteName);
      if (foundIdx !== -1) {
        let curSite = siteList[foundIdx];
        curSite = {
          ...curSite,
          accessKey: "",
          secretKey: "",
          isCurrent: true,
          isSaved: true,
        };

        setCurrentSite([curSite]);
        siteList.splice(foundIdx, 1);
      }

      siteList.sort((x: any, y: any) => {
        return x.name === curSiteName ? -1 : y.name === curSiteName ? 1 : 0;
      });

      let existingSiteList = siteList.map((si: any) => {
        return {
          ...si,
          formId: nextPeerId.current++,
          accessKey: "",
          secretKey: "",
          isSaved: true,
        };
      });

      if (existingSiteList.length) {
        setExistingSites(existingSiteList);
      } else {
        setDefaultNewRows();
      }
    },
    (err: any) => {
      setDefaultNewRows();
    },
  );

  const getSites = () => {
    invokeSiteInfoApi("GET", `api/v1/admin/site-replication`);
  };

  useEffect(() => {
    getSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setHelpName("add-replication-sites"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const existingEndPointsValidity = existingSites.reduce(
    (acc: string[], cv, i) => {
      const epValue = existingSites[i].endpoint;
      const isEpValid = isValidEndPoint(epValue);

      if (isEpValid === "" && epValue !== "") {
        acc.push(isEpValid);
      }
      return acc;
    },
    [],
  );

  const isExistingCredsValidity = existingSites
    .map((site) => {
      return !isEmptyValue(site.accessKey) && !isEmptyValue(site.secretKey);
    })
    .filter(Boolean);

  const {
    accessKey: cAccessKey,
    secretKey: cSecretKey,
    endpoint: cEndpoint,
  } = currentSite[0];

  const isCurCredsValid =
    !isEmptyValue(cAccessKey) && !isEmptyValue(cSecretKey);
  const peerEndpointsValid =
    existingEndPointsValidity.length === existingSites.length;
  const peerCredsValid =
    isExistingCredsValidity.length === existingSites.length;

  const isAllFieldsValid =
    isCurCredsValid &&
    isValidEndPoint(cEndpoint) === "" &&
    peerEndpointsValid &&
    peerCredsValid;

  const [isAdding, invokeSiteAddApi] = useApi(
    (res: any) => {
      if (res.success) {
        dispatch(setSnackBarMessage(res.status));
        resetForm();
        getSites();
        navigate(IAM_PAGES.SITE_REPLICATION);
      } else {
        dispatch(
          setErrorSnackMessage({
            errorMessage: t("Error"),
            detailedError: res.status,
          }),
        );
      }
    },
    (err: any) => {
      dispatch(setErrorSnackMessage(err));
    },
  );

  const resetForm = () => {
    setShowValidation(false);
    setValidationKey((previous) => previous + 1);
    setDefaultNewRows();
    setCurrentSite((prevItems) => {
      return prevItems.map((item, ix) => ({
        ...item,
        accessKey: "",
        secretKey: "",
        name: "",
      }));
    });
  };

  const focusFirstInvalidField = () => {
    for (const [kind, sites] of [
      ["current", currentSite],
      ["peer", existingSites],
    ] as const) {
      for (let index = 0; index < sites.length; index++) {
        const site = sites[index];
        const field = isValidEndPoint(site.endpoint)
          ? "ep"
          : isEmptyValue(site.accessKey)
            ? "ac"
            : isEmptyValue(site.secretKey)
              ? "sk"
              : null;
        if (field) {
          setFocusTarget(`add-rep-${kind}-site-${field}-${index}`);
          return;
        }
      }
    }
  };

  const addSiteReplication = () => {
    const curSite: any[] = currentSite?.map((es, idx) => {
      return {
        accessKey: es.accessKey,
        secretKey: es.secretKey,
        name: es.name,
        endpoint: es.endpoint.trim(),
      };
    });

    const newOrExistingSitesToAdd = existingSites.reduce(
      (acc: any, ns, idx) => {
        if (ns.endpoint) {
          acc.push({
            accessKey: ns.accessKey,
            secretKey: ns.secretKey,
            name: ns.name || `dr-site-${idx}`,
            endpoint: ns.endpoint.trim(),
          });
        }
        return acc;
      },
      [],
    );

    const sitesToAdd = curSite.concat(newOrExistingSitesToAdd);

    invokeSiteAddApi("POST", `api/v1/admin/site-replication`, sitesToAdd);
  };

  const renderCurrentSite = () => {
    return (
      <Box
        sx={{
          marginTop: 16,
        }}
      >
        <SiteTypeHeader
          id="replication-current-heading"
          title={t("This Site")}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 12,
          }}
        >
          {currentSite.map((cs, index) => {
            const accessKeyError = isEmptyValue(cs.accessKey)
              ? t("AccessKey is required")
              : "";
            const secretKeyError = isEmptyValue(cs.secretKey)
              ? t("SecretKey is required")
              : "";
            return (
              <SRSiteInputRow
                key={`current-${index}-${validationKey}`}
                kind="current"
                showValidation={showValidation}
                validationKey={validationKey}
                rowData={cs}
                rowId={index}
                disabledFields={
                  isAdding || isSiteInfoLoading
                    ? ["name", "endpoint", "accessKey", "secretKey"]
                    : []
                }
                fieldErrors={{
                  endpoint: isValidEndPoint(cs.endpoint)
                    ? t("Invalid Endpoint")
                    : "",
                  accessKey: accessKeyError,
                  secretKey: secretKeyError,
                }}
                onFieldChange={(e, fieldName, index) => {
                  const filedValue = e.target.value;
                  setCurrentSite((prevItems) => {
                    return prevItems.map((item, ix) =>
                      ix === index
                        ? { ...item, [fieldName]: filedValue }
                        : item,
                    );
                  });
                }}
                showRowActions={false}
              />
            );
          })}
        </Box>
      </Box>
    );
  };

  const renderPeerSites = () => {
    return (
      <Box
        sx={{
          marginTop: 24,
        }}
      >
        <SiteTypeHeader
          id="replication-peers-heading"
          title={t("Peer Sites")}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 12,
          }}
        >
          {existingSites.map((ps, index) => {
            const endPointError = isValidEndPoint(ps.endpoint);

            const accessKeyError = isEmptyValue(ps.accessKey)
              ? t("AccessKey is required")
              : "";
            const secretKeyError = isEmptyValue(ps.secretKey)
              ? t("SecretKey is required")
              : "";

            return (
              <SRSiteInputRow
                key={`${ps.formId}-${validationKey}`}
                kind="peer"
                showValidation={showValidation}
                validationKey={validationKey}
                rowData={ps}
                rowId={index}
                disabledFields={
                  isAdding || isSiteInfoLoading
                    ? ["name", "endpoint", "accessKey", "secretKey"]
                    : []
                }
                fieldErrors={{
                  endpoint: endPointError ? t(endPointError) : "",
                  accessKey: accessKeyError,
                  secretKey: secretKeyError,
                }}
                onFieldChange={(e, fieldName, index) => {
                  const filedValue = e.target.value;
                  setExistingSites((prevItems) => {
                    return prevItems.map((item, ix) =>
                      ix === index
                        ? { ...item, [fieldName]: filedValue }
                        : item,
                    );
                  });
                }}
                canAdd={!isAdding && !isSiteInfoLoading}
                canRemove={
                  !isAdding && !isSiteInfoLoading && index > 0 && !ps.isSaved
                }
                onAddClick={() => {
                  const newRows = [...existingSites];
                  //add at the next index
                  newRows.splice(index + 1, 0, {
                    name: "",
                    endpoint: "",
                    accessKey: "",
                    secretKey: "",
                    formId: nextPeerId.current++,
                  });

                  setExistingSites(newRows);
                  setFocusTarget(`add-rep-peer-site-${index + 1}`);
                }}
                onRemoveClick={(index) => {
                  setExistingSites(
                    existingSites.filter((_, idx) => idx !== index),
                  );
                  setFocusTarget(`add-peer-row-${Math.max(0, index - 1)}`);
                }}
              />
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Fragment>
      <PageHeaderWrapper
        titleElement="h1"
        label={
          <BackLink
            label={t("Add Replication Site")}
            onClick={() => navigate(IAM_PAGES.SITE_REPLICATION)}
          />
        }
        help
      />
      <PageLayout>
        <Box
          withBorders
          sx={{
            display: "grid",
            padding: 24,
            gap: 24,
            minWidth: 0,
            gridTemplateColumns: "minmax(0, 1fr)",
            "& h2": {
              margin: 0,
              fontSize: "var(--fs-title)",
              lineHeight: "var(--lh-title)",
              fontWeight: 550,
            },
            [`@media (max-width: ${breakPoints.md - 0.02}px)`]: { padding: 16 },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                "& .min-icon": { width: 16, height: 16 },
              }}
            >
              <ClustersIcon />
              <h2>{t("Add Sites for Replication")}</h2>
            </Box>

            {isSiteInfoLoading || isAdding ? <ProgressBar /> : null}

            <Box
              sx={{
                color: "var(--muted-foreground)",
                fontSize: "var(--fs-body)",
                lineHeight: "var(--lh-body)",
                marginTop: 12,
                marginBottom: 16,
              }}
            >
              {t(
                "Note: AccessKey and SecretKey values for every site is required while adding or editing peer sites",
              )}
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (isAdding || isSiteInfoLoading) return;
                setShowValidation(true);
                if (!isAllFieldsValid) {
                  focusFirstInvalidField();
                  return;
                }
                return addSiteReplication();
              }}
            >
              {renderCurrentSite()}

              {renderPeerSites()}

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: 24,
                    gap: 8,
                    flexWrap: "wrap",
                    [`@media (max-width: ${breakPoints.md - 0.02}px)`]: {
                      flexDirection: "column-reverse",
                      "& button": { width: "100%" },
                    },
                  }}
                >
                  <Button
                    id={"clear"}
                    type="button"
                    variant="regular"
                    disabled={isAdding || isSiteInfoLoading}
                    onClick={resetForm}
                    label={t("Clear")}
                  />

                  <Button
                    id={"save"}
                    type="submit"
                    variant="callAction"
                    disabled={isAdding || isSiteInfoLoading}
                    label={t("Save")}
                  />
                </Box>
              </Grid>
            </form>
          </Box>

          <HelpBox
            title={""}
            iconComponent={<ClustersIcon />}
            help={
              <Fragment>
                <h2>{t("About Site Replication")}</h2>
                <Box
                  sx={{
                    fontSize: "var(--fs-body)",
                    marginTop: 12,
                    lineHeight: "var(--lh-body)",
                    overflowWrap: "anywhere",
                    "& ul": {
                      margin: "8px 0 0",
                      paddingInlineStart: 24,
                      listStyle: "disc",
                    },
                    "& ul ul": {
                      marginTop: 4,
                      listStyle: "circle",
                    },
                    "& li": {
                      margin: "4px 0",
                    },
                    "&& li::before": { content: "none" },
                  }}
                >
                  <Box>
                    {t(
                      "The following changes are replicated to all other sites",
                    )}
                  </Box>
                  <ul>
                    <li>{t("Creation and deletion of buckets and objects")}</li>
                    <li>
                      {t(
                        "Creation and deletion of all IAM users, groups, policies and their mappings to users or groups",
                      )}
                    </li>
                    <li>{t("Creation of STS credentials")}</li>
                    <li>
                      {t(
                        "Creation and deletion of service accounts (except those owned by the root user)",
                      )}
                    </li>
                    <li>
                      {t("Changes to Bucket features such as")}
                      <ul>
                        <li>{t("Bucket Policies")}</li>
                        <li>{t("Bucket Tags")}</li>
                        <li>{t("Bucket Object-Lock configurations")}</li>
                        <li>{t("Bucket Encryption configuration")}</li>
                      </ul>
                    </li>

                    <li>
                      {t(
                        "The following Bucket features will NOT be replicated",
                      )}
                      <ul>
                        <li>{t("Bucket notification configuration")}</li>
                        <li>{t("Bucket lifecycle (ILM) configuration")}</li>
                      </ul>
                    </li>
                  </ul>
                </Box>
              </Fragment>
            }
          />
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default AddReplicationSites;
