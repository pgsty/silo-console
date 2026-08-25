// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

export const retainRestartRequirement = (
  pending: boolean,
  requiredByLatestChange: boolean,
): boolean => pending || requiredByLatestChange;
