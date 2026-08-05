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

import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { tierTypes } from "./utils";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import TierTypeCard from "./TierTypeCard";
import {
  BackLink,
  Box,
  breakPoints,
  FormLayout,
  HelpBox,
  PageLayout,
  TiersIcon,
} from "mds";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";
import { setHelpName } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { useLocalizedLink, useT } from "i18n";

const TierTypeSelector = () => {
  const navigate = useNavigate();
  const t = useT();
  const localize = useLocalizedLink();

  const typeSelect = (selectName: string) => {
    navigate(`${IAM_PAGES.TIERS_ADD}/${selectName}`);
  };
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("tier-type-selector"));
  }, [dispatch]);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label={t("Tier Types")}
              onClick={() => navigate(IAM_PAGES.TIERS)}
            />
          </Fragment>
        }
        actions={<HelpMenu />}
      />

      <PageLayout>
        <FormLayout
          title={t("Select Tier Type")}
          icon={<TiersIcon />}
          helpBox={
            <HelpBox
              iconComponent={<TiersIcon />}
              title={t("Tier Types")}
              help={
                <Fragment>
                  {t(
                    "SILO supports creating object transition lifecycle management rules, where SILO can automatically move an object to a remote storage “tier”.",
                  )}
                  <br />
                  <br />
                  {t("SILO supports the following Tier types:")}
                  <br />
                  <ul>
                    <li>
                      <a
                        href={localize(
                          "https://silo.pgsty.com/administration/object-management/transition-objects-to-s3/",
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        {t("SILO or other S3-compatible storage")}
                      </a>
                    </li>
                    <li>
                      <a
                        href={localize(
                          "https://silo.pgsty.com/administration/object-management/transition-objects-to-s3/",
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        Amazon S3
                      </a>
                    </li>
                    <li>
                      <a
                        href={localize(
                          "https://silo.pgsty.com/administration/object-management/transition-objects-to-gcs/",
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        Google Cloud Storage
                      </a>
                    </li>
                    <li>
                      <a
                        href={localize(
                          "https://silo.pgsty.com/administration/object-management/transition-objects-to-azure/",
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        Microsoft Azure Blob Storage
                      </a>
                    </li>
                  </ul>
                </Fragment>
              }
            />
          }
        >
          <Box
            sx={{
              margin: "15px",
              display: "grid",
              gridGap: "20px",
              gridTemplateColumns: "repeat(2, 1fr)",
              [`@media (max-width: ${breakPoints.md}px)`]: {
                gridTemplateColumns: "repeat(1, 1fr)",
              },
            }}
          >
            {tierTypes.map((tierType, index) => (
              <TierTypeCard
                key={`tierOpt-${index.toString}-${tierType.targetTitle}`}
                name={tierType.targetTitle}
                onClick={() => {
                  typeSelect(tierType.serviceName);
                }}
                icon={tierType.logo}
              />
            ))}
          </Box>
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};

export default TierTypeSelector;
