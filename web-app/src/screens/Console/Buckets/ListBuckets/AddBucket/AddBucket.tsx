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
import styled from "styled-components";
import get from "lodash/get";

import { useNavigate } from "react-router-dom";
import {
  BackLink,
  Box,
  BucketsIcon,
  Button,
  FormLayout,
  Grid,
  HelpBox,
  InfoIcon,
  InputBox,
  PageLayout,
  RadioGroup,
  Switch,
  SectionTitle,
  ProgressBar,
} from "mds";
import { k8sScalarUnitsExcluding } from "../../../../../common/utils";
import { AppState, useAppDispatch } from "../../../../../store";
import { useSelector } from "react-redux";
import {
  selDistSet,
  selSiteRep,
  setErrorSnackMessage,
  setHelpName,
} from "../../../../../systemSlice";
import InputUnitMenu from "../../../Common/FormComponents/InputUnitMenu/InputUnitMenu";
import TooltipWrapper from "../../../Common/TooltipWrapper/TooltipWrapper";
import {
  resetForm,
  setEnableObjectLocking,
  setExcludedPrefixes,
  setExcludeFolders,
  setIsDirty,
  setName,
  setQuota,
  setQuotaSize,
  setQuotaUnit,
  setRetention,
  setRetentionMode,
  setRetentionUnit,
  setRetentionValidity,
  setVersioning,
} from "./addBucketsSlice";
import { addBucketAsync } from "./addBucketThunks";
import AddBucketName from "./AddBucketName";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../../common/SecureComponent";
import BucketNamingRules from "./BucketNamingRules";
import PageHeaderWrapper from "../../../Common/PageHeaderWrapper/PageHeaderWrapper";
import { api } from "../../../../../api";
import { ObjectRetentionMode } from "../../../../../api/consoleApi";
import { errorToHandler } from "../../../../../api/errors";
import HelpMenu from "../../../HelpMenu";
import CSVMultiSelector from "../../../Common/FormComponents/CSVMultiSelector/CSVMultiSelector";
import { interpolate, useLocalizedLink, useT } from "i18n";

const ErrorBox = styled.div(({ theme }) => ({
  color: get(theme, "signalColors.danger", "#C51B3F"),
  border: `1px solid ${get(theme, "signalColors.danger", "#C51B3F")}`,
  padding: 8,
  borderRadius: 3,
}));

const AddBucket = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const localize = useLocalizedLink();

  const validBucketCharacters = new RegExp(
    `^[a-z0-9][a-z0-9\\.\\-]{1,61}[a-z0-9]$`,
  );
  const ipAddressFormat = new RegExp(`^(\\d+\\.){3}\\d+$`);
  const bucketName = useSelector((state: AppState) => state.addBucket.name);
  const isDirty = useSelector((state: AppState) => state.addBucket.isDirty);
  const [validationResult, setValidationResult] = useState<boolean[]>([]);
  const errorList = validationResult.filter((v) => !v);
  const hasErrors = errorList.length > 0;
  const [records, setRecords] = useState<string[]>([]);
  const versioningEnabled = useSelector(
    (state: AppState) => state.addBucket.versioningEnabled,
  );
  const excludeFolders = useSelector(
    (state: AppState) => state.addBucket.excludeFolders,
  );
  const excludedPrefixes = useSelector(
    (state: AppState) => state.addBucket.excludedPrefixes,
  );
  const lockingEnabled = useSelector(
    (state: AppState) => state.addBucket.lockingEnabled,
  );
  const quotaEnabled = useSelector(
    (state: AppState) => state.addBucket.quotaEnabled,
  );
  const quotaSize = useSelector((state: AppState) => state.addBucket.quotaSize);
  const quotaUnit = useSelector((state: AppState) => state.addBucket.quotaUnit);
  const retentionEnabled = useSelector(
    (state: AppState) => state.addBucket.retentionEnabled,
  );
  const retentionMode = useSelector(
    (state: AppState) => state.addBucket.retentionMode,
  );
  const retentionUnit = useSelector(
    (state: AppState) => state.addBucket.retentionUnit,
  );
  const retentionValidity = useSelector(
    (state: AppState) => state.addBucket.retentionValidity,
  );
  const addLoading = useSelector((state: AppState) => state.addBucket.loading);
  const addError = useSelector((state: AppState) => state.addBucket.error);
  const invalidFields = useSelector(
    (state: AppState) => state.addBucket.invalidFields,
  );
  const lockingFieldDisabled = useSelector(
    (state: AppState) => state.addBucket.lockingFieldDisabled,
  );
  const distributedSetup = useSelector(selDistSet);
  const siteReplicationInfo = useSelector(selSiteRep);
  const navigateTo = useSelector(
    (state: AppState) => state.addBucket.navigateTo,
  );

  const lockingAllowed = hasPermission(
    "*",
    [
      IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
      IAM_SCOPES.S3_PUT_BUCKET_OBJECT_LOCK_CONFIGURATION,
      IAM_SCOPES.S3_PUT_ACTIONS,
    ],
    true,
  );

  const versioningAllowed = hasPermission("*", [
    IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  useEffect(() => {
    if (addError) {
      dispatch(setErrorSnackMessage(errorToHandler(addError)));
    }
  }, [addError, dispatch]);

  useEffect(() => {
    const bucketNameErrors = [
      !(isDirty && (bucketName.length < 3 || bucketName.length > 63)),
      validBucketCharacters.test(bucketName),
      !(
        bucketName.includes(".-") ||
        bucketName.includes("-.") ||
        bucketName.includes("..")
      ),
      !ipAddressFormat.test(bucketName),
      !bucketName.startsWith("xn--"),
      !bucketName.endsWith("-s3alias"),
      !records.includes(bucketName),
    ];
    setValidationResult(bucketNameErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketName, isDirty]);

  useEffect(() => {
    dispatch(setName(""));
    dispatch(setIsDirty(false));
    const fetchRecords = () => {
      api.buckets
        .listBuckets()
        .then((res) => {
          if (res.data) {
            var bucketList: string[] = [];
            if (res.data.buckets != null && res.data.buckets.length > 0) {
              res.data.buckets.forEach((bucket) => {
                bucketList.push(bucket.name);
              });
            }
            setRecords(bucketList);
          } else if (res.error) {
            dispatch(setErrorSnackMessage(errorToHandler(res.error)));
          }
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err)));
        });
    };
    fetchRecords();
  }, [dispatch]);

  const resForm = () => {
    dispatch(resetForm());
  };

  useEffect(() => {
    if (navigateTo !== "") {
      const goTo = `${navigateTo}`;
      dispatch(resetForm());
      navigate(goTo);
    }
  }, [navigateTo, navigate, dispatch]);

  useEffect(() => {
    dispatch(setHelpName("add_bucket"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <BackLink label={t("Buckets")} onClick={() => navigate("/buckets")} />
        }
        actions={<HelpMenu />}
      />
      <PageLayout>
        <FormLayout
          title={t("Create Bucket")}
          icon={<BucketsIcon />}
          helpBox={
            <HelpBox
              iconComponent={<BucketsIcon />}
              title={t("Buckets")}
              help={
                <Fragment>
                  {t(
                    "SILO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.",
                  )}
                  <br />
                  <br />
                  {interpolate(
                    t(
                      "{versioning} allows to keep multiple versions of the same object under the same key.",
                    ),
                    { versioning: <b>{t("Versioning")}</b> },
                  )}
                  <br />
                  <br />
                  {interpolate(
                    t(
                      "{objectLocking} prevents objects from being deleted. Required to support retention and legal hold. Can only be enabled at bucket creation.",
                    ),
                    { objectLocking: <b>{t("Object Locking")}</b> },
                  )}
                  <br />
                  <br />
                  {interpolate(
                    t("{quota} limits the amount of data in the bucket."),
                    { quota: <b>{t("Quota")}</b> },
                  )}
                  {lockingAllowed && (
                    <Fragment>
                      <br />
                      <br />
                      {interpolate(
                        t(
                          "{retention} imposes rules to prevent object deletion for a period of time. Versioning must be enabled in order to set bucket retention policies.",
                        ),
                        { retention: <b>{t("Retention")}</b> },
                      )}
                    </Fragment>
                  )}
                  <br />
                  <br />
                </Fragment>
              }
            />
          }
        >
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              dispatch(addBucketAsync());
            }}
          >
            <Box>
              <AddBucketName hasErrors={hasErrors} />
              <Box sx={{ margin: "10px 0" }}>
                <BucketNamingRules errorList={validationResult} />
              </Box>
              <SectionTitle separator>{t("Features")}</SectionTitle>
              <Box sx={{ marginTop: 10 }}>
                {!distributedSetup && (
                  <Fragment>
                    <ErrorBox>
                      {t(
                        "These features are unavailable in a single-disk setup.",
                      )}
                      <br />
                      {interpolate(
                        t(
                          "Please deploy a server in {distributedMode} to use these features.",
                        ),
                        {
                          distributedMode: (
                            <a
                              href={localize(
                                "https://silo.pgsty.com/operations/concepts/architecture/#distributed-minio-deployments",
                              )}
                              target="_blank"
                              rel="noopener"
                            >
                              {t("Distributed Mode")}
                            </a>
                          ),
                        },
                      )}
                    </ErrorBox>
                    <br />
                    <br />
                  </Fragment>
                )}

                {siteReplicationInfo.enabled && (
                  <Fragment>
                    <br />
                    <Box
                      withBorders
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        "& > .min-icon ": {
                          width: 20,
                          height: 20,
                          marginRight: 10,
                        },
                      }}
                    >
                      <InfoIcon />{" "}
                      {t(
                        "Versioning setting cannot be changed as cluster replication is enabled for this site.",
                      )}
                    </Box>
                    <br />
                  </Fragment>
                )}
                <Switch
                  value="versioned"
                  id="versioned"
                  name="versioned"
                  checked={versioningEnabled}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setVersioning(event.target.checked));
                  }}
                  label={t("Versioning")}
                  disabled={
                    !distributedSetup ||
                    lockingEnabled ||
                    siteReplicationInfo.enabled ||
                    !versioningAllowed
                  }
                  tooltip={
                    versioningAllowed
                      ? ""
                      : permissionTooltipHelper(
                          [
                            IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
                            IAM_SCOPES.S3_PUT_ACTIONS,
                          ],
                          t("Versioning"),
                        )
                  }
                  helpTip={
                    <Fragment>
                      {lockingEnabled && versioningEnabled && (
                        <strong>
                          {" "}
                          {t(
                            "You must disable Object Locking before Versioning can be disabled",
                          )}{" "}
                          <br />
                        </strong>
                      )}
                      {interpolate(
                        t(
                          "SILO supports keeping multiple {versions} of an object in a single bucket.",
                        ),
                        {
                          versions: (
                            <a
                              href={localize(
                                "https://silo.pgsty.com/administration/object-management/object-versioning/#bucket-versioning",
                              )}
                              target="blank"
                            >
                              {t("versions")}
                            </a>
                          ),
                        },
                      )}
                      <br />
                      {interpolate(
                        t(
                          "Versioning is required to enable {objectLocking} and {retention}.",
                        ),
                        {
                          objectLocking: (
                            <a
                              href={localize(
                                "https://silo.pgsty.com/administration/object-management/object-retention/",
                              )}
                              target="blank"
                            >
                              {t("Object Locking")}
                            </a>
                          ),
                          retention: (
                            <a
                              href={localize(
                                "https://silo.pgsty.com/administration/object-management/object-retention/#object-retention-modes",
                              )}
                              target="blank"
                            >
                              {t("Retention")}
                            </a>
                          ),
                        },
                      )}
                    </Fragment>
                  }
                  helpTipPlacement="right"
                />
                {versioningEnabled && distributedSetup && !lockingEnabled && (
                  <Fragment>
                    <Switch
                      id={"excludeFolders"}
                      label={t("Exclude Folders")}
                      checked={excludeFolders}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch(setExcludeFolders(e.target.checked));
                      }}
                      indicatorLabels={[t("Enabled"), t("Disabled")]}
                      helpTip={
                        <Fragment>
                          {interpolate(
                            t(
                              "You can choose to {excludePrefixes} from versioning if Object Locking is not enabled.",
                            ),
                            {
                              excludePrefixes: (
                                <a
                                  href={localize(
                                    "https://silo.pgsty.com/administration/object-management/object-versioning/#exclude-folders-from-versioning",
                                  )}
                                >
                                  {t("exclude folders and prefixes")}
                                </a>
                              ),
                            },
                          )}
                          <br />
                          {t(
                            "SILO requires versioning to support replication.",
                          )}
                          <br />
                          {t(
                            "Objects in excluded prefixes do not replicate to any peer site or remote site.",
                          )}
                        </Fragment>
                      }
                      helpTipPlacement="right"
                    />
                    <CSVMultiSelector
                      elements={excludedPrefixes}
                      label={t("Excluded Prefixes")}
                      name={"excludedPrefixes"}
                      onChange={(value: string | string[]) => {
                        let valCh = "";

                        if (Array.isArray(value)) {
                          valCh = value.join(",");
                        } else {
                          valCh = value;
                        }
                        dispatch(setExcludedPrefixes(valCh));
                      }}
                      withBorder={true}
                    />
                  </Fragment>
                )}
                <Switch
                  value="locking"
                  id="locking"
                  name="locking"
                  disabled={
                    lockingFieldDisabled || !distributedSetup || !lockingAllowed
                  }
                  checked={lockingEnabled}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setEnableObjectLocking(event.target.checked));
                    if (event.target.checked && !siteReplicationInfo.enabled) {
                      dispatch(setVersioning(true));
                    }
                  }}
                  label={t("Object Locking")}
                  tooltip={
                    lockingAllowed
                      ? ``
                      : permissionTooltipHelper(
                          [
                            IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
                            IAM_SCOPES.S3_PUT_BUCKET_OBJECT_LOCK_CONFIGURATION,
                            IAM_SCOPES.S3_PUT_ACTIONS,
                          ],
                          t("Locking"),
                        )
                  }
                  helpTip={
                    <Fragment>
                      {retentionEnabled && (
                        <strong>
                          {" "}
                          {t(
                            "You must disable Retention before Object Locking can be disabled",
                          )}{" "}
                          <br />
                        </strong>
                      )}
                      {interpolate(
                        t(
                          "You can only enable {objectLocking} when first creating a bucket.",
                        ),
                        {
                          objectLocking: (
                            <a
                              href={localize(
                                "https://silo.pgsty.com/administration/object-management/#object-retention",
                              )}
                              target="blank"
                            >
                              {t("Object Locking")}
                            </a>
                          ),
                        },
                      )}
                      <br />
                      <br />
                      {interpolate(
                        t(
                          "{excludeFolders} options will not be available if this option is enabled.",
                        ),
                        {
                          excludeFolders: (
                            <a
                              href={localize(
                                "https://silo.pgsty.com/administration/object-management/object-versioning/#exclude-folders-from-versioning",
                              )}
                            >
                              {t("Exclude folders and prefixes")}
                            </a>
                          ),
                        },
                      )}
                    </Fragment>
                  }
                  helpTipPlacement="right"
                />
                <Switch
                  value="bucket_quota"
                  id="bucket_quota"
                  name="bucket_quota"
                  checked={quotaEnabled}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setQuota(event.target.checked));
                  }}
                  label={t("Quota")}
                  disabled={!distributedSetup}
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
                  helpTipPlacement="right"
                />
                {quotaEnabled && distributedSetup && (
                  <Fragment>
                    <InputBox
                      type="string"
                      id="quota_size"
                      name="quota_size"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch(setQuotaSize(e.target.value));
                      }}
                      label={t("Capacity")}
                      value={quotaSize}
                      required
                      min="1"
                      overlayObject={
                        <InputUnitMenu
                          id={"quota_unit"}
                          onUnitChange={(newValue) => {
                            dispatch(setQuotaUnit(newValue));
                          }}
                          unitSelected={quotaUnit}
                          unitsList={k8sScalarUnitsExcluding(["Ki"])}
                          disabled={false}
                        />
                      }
                      error={
                        invalidFields.includes("quotaSize")
                          ? t("Please enter a valid quota")
                          : ""
                      }
                    />
                  </Fragment>
                )}
                {versioningEnabled && distributedSetup && lockingAllowed && (
                  <Switch
                    value="bucket_retention"
                    id="bucket_retention"
                    name="bucket_retention"
                    checked={retentionEnabled}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      dispatch(setRetention(event.target.checked));
                    }}
                    label={t("Retention")}
                    helpTip={
                      <Fragment>
                        {interpolate(
                          t(
                            "SILO supports setting both {bucketDefault} and per-object retention rules.",
                          ),
                          {
                            bucketDefault: (
                              <a
                                href={localize(
                                  "https://silo.pgsty.com/administration/object-management/object-retention/#configure-bucket-default-object-retention",
                                )}
                                target="blank"
                              >
                                {t("bucket-default")}
                              </a>
                            ),
                          },
                        )}
                        <br />
                        <br />{" "}
                        {t(
                          "For per-object retention settings, defer to the documentation for the PUT operation used by your preferred SDK.",
                        )}
                      </Fragment>
                    }
                    helpTipPlacement="right"
                  />
                )}
                {retentionEnabled && distributedSetup && (
                  <Fragment>
                    <RadioGroup
                      currentValue={retentionMode}
                      id="retention_mode"
                      name="retention_mode"
                      label={t("Mode")}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(
                          setRetentionMode(
                            e.target.value as ObjectRetentionMode,
                          ),
                        );
                      }}
                      selectorOptions={[
                        { value: "compliance", label: t("Compliance") },
                        { value: "governance", label: t("Governance") },
                      ]}
                      helpTip={
                        <Fragment>
                          {" "}
                          {interpolate(
                            t(
                              "{compliance} lock protects Objects from write operations by all users, including the SILO root user.",
                            ),
                            {
                              compliance: (
                                <a
                                  href={localize(
                                    "https://silo.pgsty.com/administration/object-management/object-retention/#compliance-mode",
                                  )}
                                  target="blank"
                                >
                                  {t("Compliance")}
                                </a>
                              ),
                            },
                          )}
                          <br />
                          <br />
                          {interpolate(
                            t(
                              "{governance} lock protects Objects from write operations by non-privileged users.",
                            ),
                            {
                              governance: (
                                <a
                                  href={localize(
                                    "https://silo.pgsty.com/administration/object-management/object-retention/#governance-mode",
                                  )}
                                  target="blank"
                                >
                                  {t("Governance")}
                                </a>
                              ),
                            },
                          )}
                        </Fragment>
                      }
                      helpTipPlacement="right"
                    />
                    <InputBox
                      type="number"
                      id="retention_validity"
                      name="retention_validity"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch(setRetentionValidity(e.target.valueAsNumber));
                      }}
                      label={t("Validity")}
                      value={String(retentionValidity)}
                      required
                      overlayObject={
                        <InputUnitMenu
                          id={"retention_unit"}
                          onUnitChange={(newValue) => {
                            dispatch(setRetentionUnit(newValue));
                          }}
                          unitSelected={retentionUnit}
                          unitsList={[
                            { value: "days", label: t("Days") },
                            { value: "years", label: t("Years") },
                          ]}
                          disabled={false}
                        />
                      }
                    />
                  </Fragment>
                )}
              </Box>
            </Box>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 10,
                marginTop: 15,
              }}
            >
              <Button
                id={"clear"}
                type="button"
                variant={"regular"}
                className={"clearButton"}
                onClick={resForm}
                label={t("Clear")}
              />
              <TooltipWrapper
                tooltip={
                  invalidFields.length > 0 || !isDirty || hasErrors
                    ? t("You must apply a valid name to the bucket")
                    : ""
                }
              >
                <Button
                  id={"create-bucket"}
                  type="submit"
                  variant="callAction"
                  color="primary"
                  disabled={
                    addLoading ||
                    invalidFields.length > 0 ||
                    !isDirty ||
                    hasErrors
                  }
                  label={t("Create Bucket")}
                />
              </TooltipWrapper>
            </Grid>
            {addLoading && (
              <Grid item xs={12}>
                <ProgressBar />
              </Grid>
            )}
          </form>
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};

export default AddBucket;
