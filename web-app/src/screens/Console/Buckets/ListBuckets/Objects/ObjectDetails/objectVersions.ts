// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { isVersionedMode } from "../../../../../../utils/validationFunctions";

interface ObjectVersionLike {
  name?: string;
  version_id?: string;
}

export const exactObjectVersions = <T extends ObjectVersionLike>(
  versions: T[],
  objectName: string,
): T[] => versions.filter((version) => version.name === objectName);

interface VersionDisplayEligibility {
  currentVersionID?: string;
  distributedSetup: boolean;
  exactVersionCount: number;
  versioningStatus?: string;
}

export const canDisplayObjectVersions = ({
  currentVersionID,
  distributedSetup,
  exactVersionCount,
  versioningStatus,
}: VersionDisplayEligibility): boolean =>
  distributedSetup &&
  !!currentVersionID &&
  (isVersionedMode(versioningStatus) || exactVersionCount > 1);
