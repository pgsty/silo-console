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

import React from "react";
import { HelpBox, Box, Grid, breakPoints } from "mds";
import { interpolate, useLocalizedLink, useT } from "i18n";

interface IDistributedOnly {
  iconComponent: any;
  entity: string;
}

const DistributedOnly = ({ iconComponent, entity }: IDistributedOnly) => {
  const t = useT();
  const localizedLink = useLocalizedLink();

  return (
    <Grid container>
      <Grid item xs={12}>
        <HelpBox
          title={t("{entity} not available").replace("{entity}", t(entity))}
          iconComponent={iconComponent}
          help={
            <Box
              sx={{
                fontSize: "14px",
                [`@media (max-width: ${breakPoints.sm}px)`]: {
                  display: "flex",
                  flexFlow: "column",
                },
              }}
            >
              <span>
                {t("This feature is not available for a single-disk setup.")}
                &nbsp;
              </span>
              <span>
                {interpolate(
                  t("Please deploy a server in {mode} to use this feature."),
                  {
                    mode: (
                      <a
                        href={localizedLink(
                          "https://silo.pgsty.com/operations/deployments/baremetal-deploy-minio-on-redhat-linux/#create-the-minio-environment-file",
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        {t("Distributed Mode")}
                      </a>
                    ),
                  },
                )}
              </span>
            </Box>
          }
        />
      </Grid>
    </Grid>
  );
};

export default DistributedOnly;
