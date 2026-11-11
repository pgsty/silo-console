// This file is part of MinIO Console Server
// Copyright (c) 2026 Pigsty
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

export type ServiceAccountPolicyMode = "inherited" | "inline";

// The Console API uses an empty policy string to mean that the policy field
// should not be changed. This document is reserved for removing an existing
// inline restriction.
export const EMPTY_SERVICE_ACCOUNT_POLICY = '{"Statement":[]}';

export interface ServiceAccountPolicyUpdateInput {
  initialMode: ServiceAccountPolicyMode;
  mode: ServiceAccountPolicyMode;
  policyDefinition: string;
  initialPolicyDefinition: string;
}

export const policyForServiceAccountUpdate = ({
  initialMode,
  mode,
  policyDefinition,
  initialPolicyDefinition,
}: ServiceAccountPolicyUpdateInput): string => {
  if (mode === "inherited") {
    return initialMode === "inline" ? EMPTY_SERVICE_ACCOUNT_POLICY : "";
  }

  // Keep the existing inline policy untouched when the user only changes
  // metadata. An edited or newly enabled restriction is sent for validation.
  if (
    initialMode === "inline" &&
    policyDefinition === initialPolicyDefinition
  ) {
    return "";
  }
  return policyDefinition;
};
