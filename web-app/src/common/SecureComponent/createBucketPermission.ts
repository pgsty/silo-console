// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import { matchWildcard } from "./resourceMatch";

// This is an entry-point capability, before a bucket name/request exists.
// Keep resource- and condition-scoped grants usable; SILO evaluates the actual
// request. Matching action wildcards also avoids hiding legitimate creators.
export const hasCreateBucketPermission = (
  permissions: Record<string, string[]> | null | undefined,
): boolean =>
  Object.values(permissions || {}).some((actions) =>
    actions.some((action) => matchWildcard(action, "s3:CreateBucket")),
  );
