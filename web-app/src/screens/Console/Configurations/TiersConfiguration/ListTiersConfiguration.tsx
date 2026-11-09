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

import { OverflowMenu, SkeletonRows, StatusBadge } from "common/ui";
import { useMobile } from "common/ui/useMediaQuery";
import { FilteredEmptyState } from "common/ui/FilteredEmptyState";
import { ModalPresence } from "common/ui/ModalPresence";
import React, { Fragment, useEffect, useState } from "react";
import get from "lodash/get";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AddIcon,
  Box,
  Button,
  DataTable,
  Grid,
  HelpBox,
  PageLayout,
  RefreshIcon,
  IconButton,
  TiersIcon,
  TiersNotAvailableIcon,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { Tier } from "api/consoleApi";
import { actionsTray } from "../../Common/FormComponents/common/styleLibrary";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PERMISSIONS,
  IAM_ROLES,
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import { tierTypes } from "./utils";

import {
  selDistSet,
  setErrorSnackMessage,
  setHelpName,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import SearchBox from "../../Common/SearchBox";
import withSuspense from "../../Common/Components/withSuspense";
import DistributedOnly from "../../Common/DistributedOnly/DistributedOnly";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import DeleteTierConfirmModal from "./DeleteTierConfirmModal";
import { formatText, i18nKey, interpolate, useLocalizedLink, useT } from "i18n";

const UpdateTierCredentialsModal = withSuspense(
  React.lazy(() => import("./UpdateTierCredentialsModal")),
);

const ListTiersConfiguration = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const localize = useLocalizedLink();
  const mobile = useMobile();

  const distributedSetup = useSelector(selDistSet);
  const [records, setRecords] = useState<Tier[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updateCredentialsOpen, setUpdateCredentialsOpen] =
    useState<boolean>(false);

  const [deleteTierModalOpen, setDeleteTierModalOpen] =
    useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<Tier>({
    type: "unsupported",
    status: false,
  });
  const hasSetTier = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_SET_TIER,
  ]);

  useEffect(() => {
    if (isLoading) {
      if (distributedSetup) {
        const fetchRecords = () => {
          api.admin
            .tiersList()
            .then((res) => {
              setRecords(res.data.items || []);
              setIsLoading(false);
            })
            .catch((err) => {
              dispatch(setErrorSnackMessage(errorToHandler(err.error)));
              setIsLoading(false);
            });
        };
        fetchRecords();
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoading, dispatch, distributedSetup]);

  const filteredRecords = records.filter((b: Tier) => {
    if (filter.trim() === "") {
      return true;
    }
    const getItemName = get(b, `${b.type}.name`, "");
    const getItemType = get(b, `type`, "");

    return (
      getItemName.indexOf(filter.trim()) >= 0 ||
      getItemType.indexOf(filter.trim()) >= 0
    );
  });

  const addTier = () => {
    navigate(IAM_PAGES.TIERS_ADD);
  };

  const renderTierName = (item: Tier) => {
    const name = get(item, `${item.type}.name`, "");

    if (name !== null) {
      return <b>{name}</b>;
    }

    return "";
  };

  const renderTierType = (item: string) => {
    const { logoXs } =
      tierTypes.find((tierConf) => tierConf.serviceName === item) || {};
    if (item) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "& .min-icon": {
              width: "18px",
              height: "22px",
            },
          }}
        >
          {logoXs}
        </Box>
      );
    }
    return "";
  };

  const renderTierStatus = (online: boolean | undefined) => (
    <StatusBadge
      tone={
        online === true ? "success" : online === false ? "danger" : "neutral"
      }
      label={
        online === true
          ? t("Online")
          : online === false
            ? t("Offline")
            : t("Unknown")
      }
    />
  );

  const renderTierPrefix = (item: Tier) => {
    const prefix = get(item, `${item.type}.prefix`, "");

    if (prefix !== null) {
      return prefix;
    }

    return "";
  };

  const renderTierEndpoint = (item: Tier) => {
    const endpoint = get(item, `${item.type}.endpoint`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const renderTierBucket = (item: Tier) => {
    const bucket = get(item, `${item.type}.bucket`, "");

    if (bucket !== null) {
      return bucket;
    }

    return "";
  };

  const renderTierRegion = (item: Tier) => {
    const region = get(item, `${item.type}.region`, "");

    if (region !== null) {
      return region;
    }

    return "";
  };

  const renderTierUsage = (item: Tier) => {
    const endpoint = get(item, `${item.type}.usage`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const renderTierObjects = (item: Tier) => {
    const endpoint = get(item, `${item.type}.objects`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const renderTierVersions = (item: Tier) => {
    const endpoint = get(item, `${item.type}.versions`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const closeTierCredentials = () => {
    setUpdateCredentialsOpen(false);
  };
  const closeDeleteTier = () => {
    setDeleteTierModalOpen(false);
    setIsLoading(true);
  };

  useEffect(() => {
    dispatch(setHelpName("list-tiers-configuration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <ModalPresence open={Boolean(updateCredentialsOpen)}>
        {updateCredentialsOpen && (
          <UpdateTierCredentialsModal
            open={updateCredentialsOpen}
            tierData={selectedTier}
            closeModalAndRefresh={closeTierCredentials}
          />
        )}
      </ModalPresence>
      <ModalPresence open={Boolean(deleteTierModalOpen)}>
        {deleteTierModalOpen && (
          <DeleteTierConfirmModal
            open={deleteTierModalOpen}
            tierName={get(selectedTier, `${selectedTier.type}.name`, "")}
            closeModalAndRefresh={closeDeleteTier}
          />
        )}
      </ModalPresence>
      <PageHeaderWrapper titleElement="h1" label={i18nKey("Tiers")} help />

      <PageLayout>
        {!distributedSetup ? (
          <DistributedOnly
            entity={i18nKey("Tiers")}
            iconComponent={<TiersNotAvailableIcon />}
          />
        ) : (
          <Fragment>
            <Grid
              item
              xs={12}
              sx={{
                ...actionsTray.actionsTray,
                "& button": { marginInlineStart: 0 },
              }}
            >
              <SearchBox
                placeholder={t("Filter")}
                onChange={setFilter}
                value={filter}
                sx={{
                  marginInlineEnd: "auto",
                  maxWidth: mobile ? "100%" : 380,
                  width: mobile ? "100%" : undefined,
                }}
              />
              <IconButton
                id="refresh-list"
                aria-label={t("Refresh List")}
                size="medium"
                disabled={isLoading}
                onClick={() => setIsLoading(true)}
              >
                <RefreshIcon />
              </IconButton>
              <Button
                id="add-tier"
                label={t("Create Tier")}
                icon={<AddIcon />}
                variant="primary"
                collapseOnSmall={false}
                onClick={addTier}
                disabled={!hasSetTier}
                disabledReason={t(
                  "You require additional permissions in order to create a new Tier. Please ask your SILO administrator to grant you {permission} permission in order to create a Tier.",
                ).replace("{permission}", () => IAM_SCOPES.ADMIN_SET_TIER)}
              />
            </Grid>

            <Grid item xs={12}>
              <SecureComponent
                scopes={[IAM_SCOPES.ADMIN_LIST_TIERS]}
                resource={CONSOLE_UI_RESOURCE}
                errorProps={{ disabled: true }}
              >
                <DataTable
                  columns={[
                    {
                      label: t("Tier Name"),
                      priority: "high",
                      elementKey: "type",
                      renderFunction: renderTierName,
                      renderFullObject: true,
                    },
                    {
                      label: t("Status"),
                      priority: "high",
                      elementKey: "status",
                      renderFunction: renderTierStatus,
                      width: 112,
                    },
                    {
                      label: t("Type"),
                      priority: "medium",
                      elementKey: "type",
                      renderFunction: renderTierType,
                      width: 50,
                    },
                    {
                      label: t("Endpoint"),
                      priority: "low",
                      elementKey: "type",
                      renderFunction: renderTierEndpoint,
                      renderFullObject: true,
                    },
                    {
                      label: t("Bucket"),
                      priority: "low",
                      elementKey: "type",
                      renderFunction: renderTierBucket,
                      renderFullObject: true,
                    },
                    {
                      label: t("Prefix"),
                      priority: "low",
                      elementKey: "type",
                      renderFunction: renderTierPrefix,
                      renderFullObject: true,
                    },
                    {
                      label: t("Region"),
                      priority: "low",
                      elementKey: "type",
                      renderFunction: renderTierRegion,
                      renderFullObject: true,
                    },
                    {
                      label: t("Usage"),
                      priority: "medium",
                      elementKey: "type",
                      renderFunction: renderTierUsage,
                      renderFullObject: true,
                    },
                    {
                      label: t("Objects"),
                      priority: "low",
                      elementKey: "type",
                      renderFunction: renderTierObjects,
                      renderFullObject: true,
                    },
                    {
                      label: t("Versions"),
                      priority: "low",
                      elementKey: "type",
                      renderFunction: renderTierVersions,
                      renderFullObject: true,
                    },
                    {
                      label: t("Actions"),
                      priority: "high",
                      width: 48,
                      globalClass: "mds-row-actions",
                      renderFullObject: true,
                      renderFunction: (tier: Tier) => (
                        <span onClick={(event) => event.stopPropagation()}>
                          <OverflowMenu
                            label={formatText(t("Actions for {name}"), {
                              name: get(tier, `${tier.type}.name`, ""),
                            })}
                            items={[
                              {
                                label: t("Edit"),
                                disabled: !hasSetTier,
                                disabledReason: permissionTooltipHelper(
                                  [IAM_SCOPES.ADMIN_SET_TIER],
                                  i18nKey("update Tier credentials"),
                                ),
                                onClick: () => {
                                  if (hasSetTier) {
                                    setSelectedTier(tier);
                                    setUpdateCredentialsOpen(true);
                                  }
                                },
                              },
                              {
                                label: t("Delete"),
                                danger: true,
                                disabled: !hasPermission(
                                  "*",
                                  IAM_PERMISSIONS[IAM_ROLES.BUCKET_LIFECYCLE],
                                  true,
                                ),
                                disabledReason: permissionTooltipHelper(
                                  IAM_PERMISSIONS[IAM_ROLES.BUCKET_LIFECYCLE],
                                  i18nKey("delete Tiers"),
                                ),
                                onClick: () => {
                                  if (
                                    hasPermission(
                                      "*",
                                      IAM_PERMISSIONS[
                                        IAM_ROLES.BUCKET_LIFECYCLE
                                      ],
                                      true,
                                    )
                                  ) {
                                    setSelectedTier(tier);
                                    setDeleteTierModalOpen(true);
                                  }
                                },
                              },
                            ]}
                          />
                        </span>
                      ),
                    },
                  ]}
                  isLoading={isLoading}
                  records={filteredRecords}
                  entityName={t("Tiers")}
                  loadingState={<SkeletonRows rows={5} columns={5} />}
                  emptyState={
                    <FilteredEmptyState
                      headingLevel={2}
                      filtered={Boolean(filter.trim())}
                      onClear={() => setFilter("")}
                      icon={<TiersIcon />}
                      title={t("No storage tiers yet")}
                      description={t(
                        "Connect remote storage to transition objects using lifecycle rules.",
                      )}
                      action={
                        hasSetTier && (
                          <Button
                            id="empty-list-action"
                            variant="callAction"
                            label={t("Create Tier")}
                            onClick={addTier}
                          />
                        )
                      }
                    />
                  }
                  idField="service_name"
                  customPaperHeight={"400px"}
                />
              </SecureComponent>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                marginTop: "15px",
              }}
            >
              <HelpBox
                title={t("Learn more about TIERS")}
                iconComponent={<TiersIcon />}
                help={
                  <Fragment>
                    {t(
                      "Tiers are used by the SILO Object Lifecycle Management which allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.",
                    )}
                    <br />
                    <br />
                    {interpolate(t("You can learn more at the {link}."), {
                      link: (
                        <a
                          href={localize(
                            "https://silo.pgsty.com/administration/object-management/object-lifecycle-management/",
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
          </Fragment>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default ListTiersConfiguration;
