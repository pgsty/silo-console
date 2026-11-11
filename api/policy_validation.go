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
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	iampolicy "github.com/pgsty/silo-pkg/v3/policy"
)

func parsePolicyForWrite(policy string) (*iampolicy.Policy, error) {
	trimmed := strings.TrimSpace(policy)
	if len(trimmed) == 0 || trimmed[0] != '{' || !json.Valid([]byte(trimmed)) {
		return nil, fmt.Errorf("%w: policy input must be a JSON object", ErrInvalidPolicyDocument)
	}

	// Bypass Policy.UnmarshalJSON so unknown fields on Policy or Statement are
	// rejected instead of turning a misspelled document into an empty reset.
	type policyDocument iampolicy.Policy
	var document policyDocument
	decoder := json.NewDecoder(strings.NewReader(trimmed))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&document); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidPolicyDocument, err)
	}
	var extra any
	if err := decoder.Decode(&extra); err != io.EOF {
		return nil, fmt.Errorf("%w: unexpected trailing tokens in policy document", ErrInvalidPolicyDocument)
	}

	parsed, err := iampolicy.ParseConfigStrict(strings.NewReader(trimmed))
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidPolicyDocument, err)
	}
	return parsed, nil
}

func validatePrincipalRawJSON(raw json.RawMessage) error {
	trimmed := bytes.TrimSpace(raw)
	if len(trimmed) == 0 || trimmed[0] != '{' {
		return nil
	}
	type strictPrincipal struct {
		AWS json.RawMessage `json:"AWS"`
	}
	var p strictPrincipal
	decoder := json.NewDecoder(bytes.NewReader(trimmed))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&p); err != nil {
		return err
	}
	var extra any
	if err := decoder.Decode(&extra); err != io.EOF {
		return fmt.Errorf("unexpected trailing tokens in principal")
	}
	if len(bytes.TrimSpace(p.AWS)) == 0 {
		return fmt.Errorf("invalid principal")
	}
	return nil
}

func validateBucketPolicyForWrite(policy string, bucketName string) error {
	trimmed := strings.TrimSpace(policy)
	if len(trimmed) == 0 || trimmed[0] != '{' || !json.Valid([]byte(trimmed)) {
		return fmt.Errorf("%w: bucket policy document must be a JSON object", ErrInvalidPolicyDocument)
	}

	type bucketPolicyDocument iampolicy.BucketPolicy
	var document bucketPolicyDocument
	decoder := json.NewDecoder(strings.NewReader(trimmed))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&document); err != nil {
		return fmt.Errorf("%w: %v", ErrInvalidPolicyDocument, err)
	}
	var extra any
	if err := decoder.Decode(&extra); err != io.EOF {
		return fmt.Errorf("%w: unexpected trailing tokens in bucket policy document", ErrInvalidPolicyDocument)
	}

	var rawPrincipals struct {
		Statement []struct {
			Principal json.RawMessage `json:"Principal"`
		} `json:"Statement"`
	}
	if err := json.Unmarshal([]byte(trimmed), &rawPrincipals); err == nil {
		for _, stmt := range rawPrincipals.Statement {
			if err := validatePrincipalRawJSON(stmt.Principal); err != nil {
				return fmt.Errorf("%w: %v", ErrInvalidPolicyDocument, err)
			}
		}
	}

	if _, err := iampolicy.ParseBucketPolicyConfig(strings.NewReader(trimmed), bucketName); err != nil {
		return fmt.Errorf("%w: %v", ErrInvalidPolicyDocument, err)
	}
	return nil
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
