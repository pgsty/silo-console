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

	iampolicy "github.com/pgsty/silo-pkg/v3/policy"
)

func parsePolicyForWrite(policy string) (*iampolicy.Policy, error) {
	parsed, err := iampolicy.ParseConfigStrict(strings.NewReader(policy))
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidPolicyDocument, err)
	}
	return parsed, nil
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
