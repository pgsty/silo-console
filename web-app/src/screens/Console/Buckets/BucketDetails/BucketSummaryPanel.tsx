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

import get from "lodash/get";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { api } from "api";
import {
  BucketEncryptionInfo,
  BucketQuota,
  BucketVersioningResponse,
  GetBucketRetentionConfig,
} from "api/consoleApi";
import { errorToHandler } from "api/errors";
import {
  Box,
  DisabledIcon,
  EnabledIcon,
  Grid,
  SectionTitle,
  ValuePair,
} from "mds";
import { twoColCssGridLayoutConfig } from "../../Common/FormComponents/common/styleLibrary";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import {
  selDistSet,
  setErrorSnackMessage,
  setHelpName,
} from "../../../../systemSlice";
import {
  selBucketDetailsInfo,
  selBucketDetailsLoading,
  setBucketDetailsLoad,
} from "./bucketDetailsSlice";
import { useAppDispatch } from "../../../../store";
import VersioningInfo from "../VersioningInfo";
import withSuspense from "../../Common/Components/withSuspense";
import LabelWithIcon from "./SummaryItems/LabelWithIcon";
import EditablePropertyItem from "./SummaryItems/EditablePropertyItem";
import ReportedUsage from "./SummaryItems/ReportedUsage";
import BucketQuotaSize from "./SummaryItems/BucketQuotaSize";
import { interpolate, useLocalizedLink, useT } from "i18n";

const SetAccessPolicy = withSuspense(
  React.lazy(() => import("./SetAccessPolicy")),
);
const SetRetentionConfig = withSuspense(
  React.lazy(() => import("./SetRetentionConfig")),
);
const EnableBucketEncryption = withSuspense(
  React.lazy(() => import("./EnableBucketEncryption")),
);
const EnableVersioningModal = withSuspense(
  React.lazy(() => import("./EnableVersioningModal")),
);
const BucketTags = withSuspense(
  React.lazy(() => import("./SummaryItems/BucketTags")),
);
const EnableQuota = withSuspense(React.lazy(() => import("./EnableQuota")));

const BucketSummary = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const t = useT();
  const localize = useLocalizedLink();

  const loadingBucket = useSelector(selBucketDetailsLoading);
  const bucketInfo = useSelector(selBucketDetailsInfo);
  const distributedSetup = useSelector(selDistSet);

  const [encryptionCfg, setEncryptionCfg] =
    useState<BucketEncryptionInfo | null>(null);
  const [bucketSize, setBucketSize] = useState<number | "0">("0");
  const [hasObjectLocking, setHasObjectLocking] = useState<boolean | undefined>(
    false,
  );
  const [accessPolicyScreenOpen, setAccessPolicyScreenOpen] =
    useState<boolean>(false);
  const [replicationRules, setReplicationRules] = useState<boolean>(false);
  const [loadingObjectLocking, setLoadingLocking] = useState<boolean>(true);
  const [loadingSize, setLoadingSize] = useState<boolean>(true);
  const [bucketLoading, setBucketLoading] = useState<boolean>(true);
  const [loadingEncryption, setLoadingEncryption] = useState<boolean>(true);
  const [loadingVersioning, setLoadingVersioning] = useState<boolean>(true);
  const [loadingQuota, setLoadingQuota] = useState<boolean>(true);
  const [loadingReplication, setLoadingReplication] = useState<boolean>(true);
  const [loadingRetention, setLoadingRetention] = useState<boolean>(true);
  const [versioningInfo, setVersioningInfo] =
    useState<BucketVersioningResponse>();
  const [quotaEnabled, setQuotaEnabled] = useState<boolean>(false);
  const [quota, setQuota] = useState<BucketQuota | null>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(false);
  const [retentionEnabled, setRetentionEnabled] = useState<boolean>(false);
  const [retentionConfig, setRetentionConfig] =
    useState<GetBucketRetentionConfig | null>(null);
  const [retentionConfigOpen, setRetentionConfigOpen] =
    useState<boolean>(false);
  const [enableEncryptionScreenOpen, setEnableEncryptionScreenOpen] =
    useState<boolean>(false);
  const [enableQuotaScreenOpen, setEnableQuotaScreenOpen] =
    useState<boolean>(false);
  const [enableVersioningOpen, setEnableVersioningOpen] =
    useState<boolean>(false);
  useEffect(() => {
    dispatch(setHelpName("bucket_detail_summary"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bucketName = params.bucketName || "";

  let accessPolicy = "PRIVATE";
  let policyDefinition = "";

  if (bucketInfo !== null && bucketInfo.access && bucketInfo.definition) {
    accessPolicy = bucketInfo.access;
    policyDefinition = bucketInfo.definition;
  }

  const displayGetBucketObjectLockConfiguration = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);

  const displayGetBucketEncryptionConfiguration = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_ENCRYPTION_CONFIGURATION,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);

  const displayGetBucketQuota = hasPermission(bucketName, [
    IAM_SCOPES.ADMIN_GET_BUCKET_QUOTA,
  ]);

  useEffect(() => {
    if (loadingBucket) {
      setBucketLoading(true);
    } else {
      setBucketLoading(false);
    }
  }, [loadingBucket, setBucketLoading]);

  useEffect(() => {
    if (loadingEncryption) {
      if (displayGetBucketEncryptionConfiguration) {
        api.buckets
          .getBucketEncryptionInfo(bucketName)
          .then((res) => {
            if (res.data.algorithm) {
              setEncryptionEnabled(true);
              setEncryptionCfg(res.data);
            }
            setLoadingEncryption(false);
          })
          .catch((err) => {
            err = errorToHandler(err.error);
            if (
              err.errorMessage ===
              "The server side encryption configuration was not found"
            ) {
              setEncryptionEnabled(false);
              setEncryptionCfg(null);
            }
            setLoadingEncryption(false);
          });
      } else {
        setEncryptionEnabled(false);
        setEncryptionCfg(null);
        setLoadingEncryption(false);
      }
    }
  }, [loadingEncryption, bucketName, displayGetBucketEncryptionConfiguration]);

  useEffect(() => {
    if (loadingVersioning && distributedSetup) {
      api.buckets
        .getBucketVersioning(bucketName)
        .then((res) => {
          setVersioningInfo(res.data);
          setLoadingVersioning(false);
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          setLoadingVersioning(false);
        });
    }
  }, [loadingVersioning, dispatch, bucketName, distributedSetup]);

  useEffect(() => {
    if (loadingQuota && distributedSetup) {
      if (displayGetBucketQuota) {
        api.buckets
          .getBucketQuota(bucketName)
          .then((res) => {
            setQuota(res.data);
            if (res.data.quota) {
              setQuotaEnabled(true);
            } else {
              setQuotaEnabled(false);
            }
            setLoadingQuota(false);
          })
          .catch((err) => {
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
            setQuotaEnabled(false);
            setLoadingQuota(false);
          });
      } else {
        setQuotaEnabled(false);
        setLoadingQuota(false);
      }
    }
  }, [
    loadingQuota,
    setLoadingVersioning,
    dispatch,
    bucketName,
    distributedSetup,
    displayGetBucketQuota,
  ]);

  useEffect(() => {
    if (loadingVersioning && distributedSetup) {
      if (displayGetBucketObjectLockConfiguration) {
        api.buckets
          .getBucketObjectLockingStatus(bucketName)
          .then((res) => {
            setHasObjectLocking(res.data.object_locking_enabled);
            setLoadingLocking(false);
          })
          .catch((err) => {
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
            setLoadingLocking(false);
          });
      } else {
        setLoadingLocking(false);
      }
    }
  }, [
    loadingObjectLocking,
    dispatch,
    bucketName,
    loadingVersioning,
    distributedSetup,
    displayGetBucketObjectLockConfiguration,
  ]);

  useEffect(() => {
    if (loadingSize) {
      api.buckets
        .listBuckets()
        .then((res) => {
          const resBuckets = get(res.data, "buckets", []);

          const bucketInfo = resBuckets.find(
            (bucket) => bucket.name === bucketName,
          );

          const size = get(bucketInfo, "size", "0");

          setLoadingSize(false);
          setBucketSize(size);
        })
        .catch((err) => {
          setLoadingSize(false);
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [loadingSize, dispatch, bucketName]);

  useEffect(() => {
    if (loadingReplication && distributedSetup) {
      api.buckets
        .getBucketReplication(bucketName)
        .then((res) => {
          const r = res.data.rules ? res.data.rules : [];
          setReplicationRules(r.length > 0);
          setLoadingReplication(false);
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          setLoadingReplication(false);
        });
    }
  }, [loadingReplication, dispatch, bucketName, distributedSetup]);

  useEffect(() => {
    if (loadingRetention && hasObjectLocking) {
      api.buckets
        .getBucketRetentionConfig(bucketName)
        .then((res) => {
          setLoadingRetention(false);
          setRetentionEnabled(true);
          setRetentionConfig(res.data);
        })
        .catch((err) => {
          setRetentionEnabled(false);
          setLoadingRetention(false);
          setRetentionConfig(null);
        });
    }
  }, [loadingRetention, hasObjectLocking, bucketName]);

  const loadAllBucketData = () => {
    dispatch(setBucketDetailsLoad(true));
    setBucketLoading(true);
    setLoadingSize(true);
    setLoadingVersioning(true);
    setLoadingEncryption(true);
    setLoadingRetention(true);
  };

  const setBucketVersioning = () => {
    setEnableVersioningOpen(true);
  };
  const setBucketQuota = () => {
    setEnableQuotaScreenOpen(true);
  };

  const closeEnableBucketEncryption = () => {
    setEnableEncryptionScreenOpen(false);
    setLoadingEncryption(true);
  };
  const closeEnableBucketQuota = () => {
    setEnableQuotaScreenOpen(false);
    setLoadingQuota(true);
  };

  const closeSetAccessPolicy = () => {
    setAccessPolicyScreenOpen(false);
    loadAllBucketData();
  };

  const closeRetentionConfig = () => {
    setRetentionConfigOpen(false);
    loadAllBucketData();
  };

  const closeEnableVersioning = (refresh: boolean) => {
    setEnableVersioningOpen(false);
    if (refresh) {
      loadAllBucketData();
    }
  };

  let versioningStatus = versioningInfo?.status;
  let versioningText = t("Unversioned (Default)");
  if (versioningStatus === "Enabled") {
    versioningText = t("Versioned");
  } else if (versioningStatus === "Suspended") {
    versioningText = t("Suspended");
  }

  return (
    <Fragment>
      {enableEncryptionScreenOpen && (
        <EnableBucketEncryption
          open={enableEncryptionScreenOpen}
          selectedBucket={bucketName}
          encryptionEnabled={encryptionEnabled}
          encryptionCfg={encryptionCfg}
          closeModalAndRefresh={closeEnableBucketEncryption}
        />
      )}
      {enableQuotaScreenOpen && (
        <EnableQuota
          open={enableQuotaScreenOpen}
          selectedBucket={bucketName}
          enabled={quotaEnabled}
          cfg={quota}
          closeModalAndRefresh={closeEnableBucketQuota}
        />
      )}
      {accessPolicyScreenOpen && (
        <SetAccessPolicy
          bucketName={bucketName}
          open={accessPolicyScreenOpen}
          actualPolicy={accessPolicy}
          actualDefinition={policyDefinition}
          closeModalAndRefresh={closeSetAccessPolicy}
        />
      )}
      {retentionConfigOpen && (
        <SetRetentionConfig
          bucketName={bucketName}
          open={retentionConfigOpen}
          closeModalAndRefresh={closeRetentionConfig}
        />
      )}
      {enableVersioningOpen && (
        <EnableVersioningModal
          closeVersioningModalAndRefresh={closeEnableVersioning}
          modalOpen={enableVersioningOpen}
          selectedBucket={bucketName}
          versioningInfo={versioningInfo}
          objectLockingEnabled={!!hasObjectLocking}
        />
      )}

      <SectionTitle separator sx={{ marginBottom: 15 }}>
        {t("Summary")}
      </SectionTitle>
      <Grid container>
        <SecureComponent
          scopes={[IAM_SCOPES.S3_GET_BUCKET_POLICY, IAM_SCOPES.S3_GET_ACTIONS]}
          resource={bucketName}
        >
          <Grid item xs={12}>
            <Box sx={twoColCssGridLayoutConfig}>
              <Box sx={twoColCssGridLayoutConfig}>
                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_GET_BUCKET_POLICY,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]}
                  resource={bucketName}
                >
                  <EditablePropertyItem
                    iamScopes={[
                      IAM_SCOPES.S3_PUT_BUCKET_POLICY,
                      IAM_SCOPES.S3_PUT_ACTIONS,
                    ]}
                    resourceName={bucketName}
                    property={t("Access Policy:")}
                    value={t(accessPolicy.toLowerCase())}
                    onEdit={() => {
                      setAccessPolicyScreenOpen(true);
                    }}
                    isLoading={bucketLoading}
                    helpTip={
                      <Fragment>
                        {interpolate(
                          t(
                            "{private} policy limits access to credentialled accounts with appropriate permissions",
                          ),
                          { private: <strong>{t("Private")}</strong> },
                        )}
                        <br />
                        {interpolate(
                          t(
                            "{public} policy anyone will be able to upload, download and delete files from this Bucket once logged in",
                          ),
                          { public: <strong>{t("Public")}</strong> },
                        )}
                        <br />
                        {interpolate(
                          t(
                            "{custom} policy can be written to define which accounts are authorized to access this Bucket",
                          ),
                          { custom: <strong>{t("Custom")}</strong> },
                        )}
                        <br />
                        <br />
                        {interpolate(
                          t(
                            "To allow Bucket access without credentials, use the {anonymous} setting",
                          ),
                          {
                            anonymous: (
                              <a href={`/buckets/${bucketName}/admin/prefix`}>
                                {t("Anonymous")}
                              </a>
                            ),
                          },
                        )}
                      </Fragment>
                    }
                  />
                </SecureComponent>

                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_GET_BUCKET_ENCRYPTION_CONFIGURATION,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]}
                  resource={bucketName}
                >
                  <EditablePropertyItem
                    iamScopes={[
                      IAM_SCOPES.S3_PUT_BUCKET_ENCRYPTION_CONFIGURATION,
                      IAM_SCOPES.S3_PUT_ACTIONS,
                    ]}
                    resourceName={bucketName}
                    property={t("Encryption:")}
                    value={encryptionEnabled ? t("Enabled") : t("Disabled")}
                    onEdit={() => {
                      setEnableEncryptionScreenOpen(true);
                    }}
                    isLoading={loadingEncryption}
                    helpTip={
                      <Fragment>
                        {interpolate(
                          t(
                            "SILO supports enabling automatic {sseKms} and {sseS3} encryption of all objects written to a bucket using a specific External Key (EK) stored on the external KMS.",
                          ),
                          {
                            sseKms: (
                              <a
                                href={localize(
                                  "https://silo.pgsty.com/administration/server-side-encryption/server-side-encryption-sse-kms/",
                                )}
                                target="blank"
                              >
                                SSE-KMS
                              </a>
                            ),
                            sseS3: (
                              <a
                                href={localize(
                                  "https://silo.pgsty.com/administration/server-side-encryption/server-side-encryption-sse-s3/",
                                )}
                                target="blank"
                              >
                                SSE-S3
                              </a>
                            ),
                          },
                        )}
                      </Fragment>
                    }
                  />
                </SecureComponent>

                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]}
                  resource={bucketName}
                >
                  <ValuePair
                    label={t("Replication:")}
                    value={
                      <LabelWithIcon
                        icon={
                          replicationRules ? <EnabledIcon /> : <DisabledIcon />
                        }
                        label={
                          <label className={"muted"}>
                            {replicationRules ? t("Enabled") : t("Disabled")}
                          </label>
                        }
                      />
                    }
                  />
                </SecureComponent>

                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]}
                  resource={bucketName}
                >
                  <ValuePair
                    label={t("Object Locking:")}
                    value={
                      <LabelWithIcon
                        icon={
                          hasObjectLocking ? <EnabledIcon /> : <DisabledIcon />
                        }
                        label={
                          <label className={"muted"}>
                            {hasObjectLocking ? t("Enabled") : t("Disabled")}
                          </label>
                        }
                      />
                    }
                  />
                </SecureComponent>
                <Box>
                  <ValuePair
                    label={t("Tags:")}
                    value={<BucketTags bucketName={bucketName} />}
                  />
                </Box>
                <EditablePropertyItem
                  iamScopes={[IAM_SCOPES.ADMIN_SET_BUCKET_QUOTA]}
                  resourceName={bucketName}
                  property={t("Quota:")}
                  value={quotaEnabled ? t("Enabled") : t("Disabled")}
                  onEdit={setBucketQuota}
                  isLoading={loadingQuota}
                  helpTip={
                    <Fragment>
                      {interpolate(
                        t(
                          "Setting a {quota} assigns a hard limit to a bucket beyond which SILO does not allow writes.",
                        ),
                        {
                          quota: (
                            <a
                              href={localize(
                                "https://silo.pgsty.com/reference/deprecated/mc-quota-set/",
                              )}
                              target="blank"
                            >
                              {t("quota")}
                            </a>
                          ),
                        },
                      )}
                    </Fragment>
                  }
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  alignItems: "flex-start",
                }}
              >
                <ReportedUsage bucketSize={`${bucketSize}`} />
                {quotaEnabled && quota ? (
                  <BucketQuotaSize quota={quota} />
                ) : null}
              </Box>
            </Box>
          </Grid>
        </SecureComponent>

        {distributedSetup && (
          <SecureComponent
            scopes={[
              IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
              IAM_SCOPES.S3_GET_ACTIONS,
            ]}
            resource={bucketName}
          >
            <Grid item xs={12} sx={{ marginTop: 5 }}>
              <SectionTitle separator sx={{ marginBottom: 15 }}>
                {t("Versioning")}
              </SectionTitle>

              <Box sx={twoColCssGridLayoutConfig}>
                <Box sx={twoColCssGridLayoutConfig}>
                  <EditablePropertyItem
                    iamScopes={[
                      IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
                      IAM_SCOPES.S3_PUT_ACTIONS,
                    ]}
                    resourceName={bucketName}
                    property={t("Current Status:")}
                    value={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          textDecorationStyle: "initial",
                          placeItems: "flex-start",
                          justifyItems: "flex-start",
                          gap: 3,
                        }}
                      >
                        <div> {versioningText}</div>
                      </Box>
                    }
                    onEdit={setBucketVersioning}
                    isLoading={loadingVersioning}
                    disabled={hasObjectLocking}
                  />

                  {versioningInfo?.status === "Enabled" ? (
                    <VersioningInfo versioningState={versioningInfo} />
                  ) : null}
                </Box>
              </Box>
            </Grid>
          </SecureComponent>
        )}

        {hasObjectLocking && (
          <SecureComponent
            scopes={[
              IAM_SCOPES.S3_GET_OBJECT_RETENTION,
              IAM_SCOPES.S3_GET_ACTIONS,
            ]}
            resource={bucketName}
          >
            <Grid item xs={12} sx={{ marginTop: 5 }}>
              <SectionTitle separator sx={{ marginBottom: 15 }}>
                {t("Retention")}
              </SectionTitle>

              <Box sx={twoColCssGridLayoutConfig}>
                <Box sx={twoColCssGridLayoutConfig}>
                  <EditablePropertyItem
                    iamScopes={[IAM_SCOPES.ADMIN_SET_BUCKET_QUOTA]}
                    resourceName={bucketName}
                    property={t("Retention:")}
                    value={retentionEnabled ? t("Enabled") : t("Disabled")}
                    onEdit={() => {
                      setRetentionConfigOpen(true);
                    }}
                    isLoading={loadingRetention}
                    helpTip={
                      <Fragment>
                        {interpolate(
                          t(
                            "SILO {objectLocking} enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.",
                          ),
                          {
                            objectLocking: (
                              <a
                                target="blank"
                                href={localize(
                                  "https://silo.pgsty.com/administration/object-management/#object-retention",
                                )}
                              >
                                {t("Object Locking")}
                              </a>
                            ),
                          },
                        )}
                      </Fragment>
                    }
                  />

                  <ValuePair
                    label={t("Mode:")}
                    value={
                      <label
                        className={"muted"}
                        style={{ textTransform: "capitalize" }}
                      >
                        {retentionConfig && retentionConfig.mode
                          ? retentionConfig.mode
                          : "-"}
                      </label>
                    }
                  />
                  <ValuePair
                    label={t("Validity:")}
                    value={
                      <label
                        className={"muted"}
                        style={{ textTransform: "capitalize" }}
                      >
                        {retentionConfig && retentionConfig.validity}{" "}
                        {retentionConfig &&
                          (retentionConfig.validity === 1
                            ? retentionConfig.unit?.slice(0, -1)
                            : retentionConfig.unit)}
                      </label>
                    }
                  />
                </Box>
              </Box>
            </Grid>
          </SecureComponent>
        )}
      </Grid>
    </Fragment>
  );
};

export default BucketSummary;
