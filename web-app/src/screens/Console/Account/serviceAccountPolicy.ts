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

export interface ServiceAccountPolicyCreateInput {
  isRestrictedByPolicy: boolean;
  policyDefinition: string;
}

export const policyForServiceAccountCreate = ({
  isRestrictedByPolicy,
  policyDefinition,
}: ServiceAccountPolicyCreateInput): string => {
  if (!isRestrictedByPolicy) {
    return "";
  }
  return policyDefinition;
};

const ALLOWED_POLICY_KEYS = new Set(["VERSION", "ID", "STATEMENT"]);

const isEmptyInlinePolicyDocument = (raw: string): boolean => {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return true;
  }
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return false;
    }
    const fields = Object.entries(parsed);
    // Uppercase also folds the long s (ſ) accepted by encoding/json.
    if (fields.some(([key]) => !ALLOWED_POLICY_KEYS.has(key.toUpperCase()))) {
      return false;
    }
    const statements = fields
      .filter(([key]) => key.toUpperCase() === "STATEMENT")
      .map(([, value]) => value);
    // JSON.parse loses duplicate-key order. With case aliases, an empty value
    // can win in Go even when it is not last in Object.entries; reject any
    // empty alternative instead of guessing which restriction will be saved.
    return (
      statements.length === 0 ||
      statements.some(
        (value) =>
          value === null || (Array.isArray(value) && value.length === 0),
      )
    );
  } catch {
    return false;
  }
};

export const isServiceAccountUpdatePolicyValid = ({
  initialMode,
  mode,
  policyDefinition,
  initialPolicyDefinition,
}: ServiceAccountPolicyUpdateInput): boolean => {
  if (mode === "inherited") {
    return true;
  }
  if (
    initialMode === "inline" &&
    policyDefinition === initialPolicyDefinition
  ) {
    return true;
  }
  return !isEmptyInlinePolicyDocument(policyDefinition);
};

export const isServiceAccountCreatePolicyValid = ({
  isRestrictedByPolicy,
  policyDefinition,
}: ServiceAccountPolicyCreateInput): boolean => {
  return (
    !isRestrictedByPolicy || !isEmptyInlinePolicyDocument(policyDefinition)
  );
};
