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

import {
  AzureTierIcon,
  AzureTierIconXs,
  GoogleTierIcon,
  GoogleTierIconXs,
  S3TierIcon,
  S3TierIconXs,
} from "mds";
import { SiloBrand } from "../../../../common/SiloBrand";

export const minioServiceName = "minio";
export const gcsServiceName = "gcs";
export const s3ServiceName = "s3";
export const azureServiceName = "azure";

export const tierTypes = [
  {
    serviceName: minioServiceName,
    targetTitle: "SILO",
    logo: (
      <SiloBrand
        variant="emblem"
        style={{ display: "block", width: 26, height: 26 }}
      />
    ),
    logoXs: (
      <SiloBrand
        variant="emblem"
        style={{ display: "block", width: 18, height: 18 }}
      />
    ),
  },
  {
    serviceName: gcsServiceName,
    targetTitle: "Google Cloud Storage",
    logo: <GoogleTierIcon />,
    logoXs: <GoogleTierIconXs />,
  },
  {
    serviceName: s3ServiceName,
    targetTitle: "AWS S3",
    logo: <S3TierIcon />,
    logoXs: <S3TierIconXs />,
  },
  {
    serviceName: azureServiceName,
    targetTitle: "Azure",
    logo: <AzureTierIcon />,
    logoXs: <AzureTierIconXs />,
  },
];
