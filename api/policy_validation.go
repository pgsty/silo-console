// Copyright (c) 2026 PGSTY
//
// This file is part of the Silo object storage console.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"fmt"
	"strings"

	iampolicy "github.com/minio/pkg/v3/policy"
)

// Keep this list aligned with policy.AdminActionsWithResource. It is local so
// Console remains source-compatible with upstream minio/pkg versions from
// before that exported set and AdminAction.HasResource were introduced.
var adminActionsWithResourceForWrite = [...]iampolicy.AdminAction{
	iampolicy.SetBucketQuotaAdminAction,
	iampolicy.GetBucketQuotaAdminAction,
	iampolicy.SetBucketTargetAction,
	iampolicy.GetBucketTargetAction,
	iampolicy.ReplicationDiff,
	iampolicy.ImportBucketMetadataAction,
	iampolicy.ExportBucketMetadataAction,
	iampolicy.HealAdminAction,
	iampolicy.InventoryControlAction,
}

func parsePolicyForWrite(policy string) (*iampolicy.Policy, error) {
	parsed, err := iampolicy.ParseConfig(strings.NewReader(policy))
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidPolicyDocument, err)
	}
	for _, statement := range parsed.Statements {
		if err := validateResourcesForWrite(statement.Resources); err != nil {
			return nil, err
		}
		if err := validateResourcesForWrite(statement.NotResources); err != nil {
			return nil, err
		}
		if err := validateAdminStatementForWrite(statement); err != nil {
			return nil, err
		}
	}
	return parsed, nil
}

func validateResourcesForWrite(resources iampolicy.ResourceSet) error {
	for resource := range resources {
		if resource.Type == iampolicy.ResourceARNAll && resource.Pattern != iampolicy.ResourceARNAll.String() {
			if _, ok := iampolicy.ARNPrefixToType[resource.Pattern]; ok {
				return fmt.Errorf("%w: invalid resource '%s' - an ARN prefix with no resource after it does not name a resource; specify a resource, or use '%s*' to mean every resource under that prefix", ErrInvalidPolicyDocument, resource.Pattern, resource.Pattern)
			}
		}
	}
	return nil
}

// validateAdminStatementForWrite preserves the additional admin-policy checks
// applied by silo-pkg's strict creation path without importing fork-only APIs.
// ParseConfig has already validated the common policy and action rules.
func validateAdminStatementForWrite(statement iampolicy.Statement) error {
	if !statementHasAdminAction(statement) {
		return nil
	}
	if len(statement.Resources) > 0 && len(statement.NotResources) > 0 {
		return fmt.Errorf("%w: Resource and NotResource cannot be specified in the same admin statement", ErrInvalidPolicyDocument)
	}
	if !statementHasResourceScopedAdminAction(statement) {
		return nil
	}
	if err := statement.Resources.ValidateS3(); err != nil {
		return fmt.Errorf("%w: %v", ErrInvalidPolicyDocument, err)
	}
	if err := statement.NotResources.ValidateS3(); err != nil {
		return fmt.Errorf("%w: %v", ErrInvalidPolicyDocument, err)
	}
	return nil
}

func statementHasAdminAction(statement iampolicy.Statement) bool {
	for action := range statement.Actions {
		if iampolicy.AdminAction(action).IsValid() {
			return true
		}
	}
	return false
}

func statementHasResourceScopedAdminAction(statement iampolicy.Statement) bool {
	for action := range statement.Actions {
		adminAction := iampolicy.AdminAction(action)
		for _, resourceAction := range adminActionsWithResourceForWrite {
			if adminAction.Match(resourceAction) {
				return true
			}
		}
	}
	return false
}

func parseNamedPolicyForWrite(policy string) (*iampolicy.Policy, error) {
	parsed, err := parsePolicyForWrite(policy)
	if err != nil {
		return nil, err
	}
	if parsed.IsEmpty() {
		return nil, fmt.Errorf("%w: empty policies are not allowed", ErrInvalidPolicyDocument)
	}
	if parsed.Version == "" {
		return nil, fmt.Errorf("%w: policy version cannot be empty", ErrInvalidPolicyDocument)
	}
	return parsed, nil
}

func normalizeOptionalPolicyForWrite(policy string) (string, error) {
	if strings.TrimSpace(policy) == "" {
		return "", nil
	}
	_, err := parsePolicyForWrite(policy)
	if err != nil {
		return "", err
	}
	return policy, nil
}
