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
	"errors"
	"strings"
	"testing"

	iampolicy "github.com/pgsty/silo-pkg/v3/policy"
)

func TestPolicyWriteValidationRejectsBareARNs(t *testing.T) {
	document := `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::"]}]}`

	if _, err := iampolicy.ParseConfig(strings.NewReader(document)); err != nil {
		t.Fatalf("compatibility parser rejected stored policy: %v", err)
	}
	if _, err := parsePolicyForWrite(document); !errors.Is(err, ErrInvalidPolicyDocument) {
		t.Fatalf("strict write parser error = %v, want ErrInvalidPolicyDocument", err)
	}
	got := ErrorWithContext(t.Context(), func() error {
		_, err := parsePolicyForWrite(document)
		return err
	}())
	if got.Code != 400 {
		t.Fatalf("invalid policy HTTP status = %d, want 400", got.Code)
	}
	if got.APIError.DetailedMessage == "" || got.APIError.DetailedMessage == ErrInvalidPolicyDocument.Error() {
		t.Fatalf("invalid policy detail = %q, want parser guidance", got.APIError.DetailedMessage)
	}
	if strings.Contains(got.APIError.DetailedMessage, document) {
		t.Fatalf("invalid policy detail echoed the submitted document")
	}
}

func TestResourceWriteValidation(t *testing.T) {
	testCases := []struct {
		name     string
		resource string
		wantErr  bool
	}{
		{name: "bare S3 ARN", resource: "arn:aws:s3:::", wantErr: true},
		{name: "historical bare S3 ARN", resource: "*arn:aws:s3:::", wantErr: true},
		{name: "bare S3 Tables ARN", resource: "arn:aws:s3tables:::", wantErr: true},
		{name: "bare KMS ARN", resource: "arn:minio:kms:::", wantErr: true},
		{name: "all resources", resource: "*"},
		{name: "all S3 resources", resource: "arn:aws:s3:::*"},
		{name: "bucket resource", resource: "arn:aws:s3:::bucket"},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			document := `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["` + testCase.resource + `"]}]}`
			_, err := parsePolicyForWrite(document)
			if (err != nil) != testCase.wantErr {
				t.Fatalf("parsePolicyForWrite(resource %q) error = %v, wantErr %v", testCase.resource, err, testCase.wantErr)
			}
		})
	}
}

func TestPolicyWriteValidationPreservesStrictAdminRules(t *testing.T) {
	testCases := []struct {
		name     string
		document string
		wantErr  bool
	}{
		{
			name: "resource and not resource",
			document: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["admin:GetBucketQuota"],` +
				`"Resource":["arn:aws:s3:::bucket"],"NotResource":["arn:aws:s3:::other"]}]}`,
			wantErr: true,
		},
		{
			name:     "resource-scoped admin action with KMS resource",
			document: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["admin:GetBucketQuota"],"Resource":["arn:minio:kms:::key"]}]}`,
			wantErr:  true,
		},
		{
			name:     "resource-scoped wildcard admin action with KMS resource",
			document: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["admin:*"],"Resource":["arn:minio:kms:::key"]}]}`,
			wantErr:  true,
		},
		{
			name:     "resource-less admin action retains compatibility",
			document: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["admin:ServerInfo"],"Resource":["arn:minio:kms:::key"]}]}`,
		},
		{
			name:     "valid resource-scoped admin action",
			document: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["admin:GetBucketQuota"],"Resource":["arn:aws:s3:::bucket"]}]}`,
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			_, err := parsePolicyForWrite(testCase.document)
			if (err != nil) != testCase.wantErr {
				t.Fatalf("parsePolicyForWrite() error = %v, wantErr %v", err, testCase.wantErr)
			}
			if err != nil && !errors.Is(err, ErrInvalidPolicyDocument) {
				t.Fatalf("parsePolicyForWrite() error = %v, want ErrInvalidPolicyDocument", err)
			}
		})
	}
}

func TestNamedPolicyWriteValidation(t *testing.T) {
	testCases := []struct {
		name     string
		document string
		wantErr  bool
	}{
		{
			name:     "valid",
			document: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"]}]}`,
		},
		{name: "empty", document: `{"Version":"2012-10-17","Statement":[]}`, wantErr: true},
		{
			name:     "missing version",
			document: `{"Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"]}]}`,
			wantErr:  true,
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			_, err := parseNamedPolicyForWrite(testCase.document)
			if (err != nil) != testCase.wantErr {
				t.Fatalf("parseNamedPolicyForWrite() error = %v, wantErr %v", err, testCase.wantErr)
			}
		})
	}
}

func TestOptionalPolicyWriteValidation(t *testing.T) {
	normalized, err := normalizeOptionalPolicyForWrite("  \n")
	if err != nil {
		t.Fatalf("empty optional policy was rejected: %v", err)
	}
	if normalized != "" {
		t.Fatalf("empty optional policy normalized to %q, want empty", normalized)
	}

	document := `{"Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"]}]}`
	normalized, err = normalizeOptionalPolicyForWrite(document)
	if err != nil {
		t.Fatalf("version-compatible session policy was rejected: %v", err)
	}
	if normalized != document {
		t.Fatalf("valid optional policy was rewritten to %q", normalized)
	}
}

func TestPolicyWriteValidationRejectsUnknownFieldsAndNonObjectJSON(t *testing.T) {
	invalidDocs := []struct {
		name string
		doc  string
	}{
		{name: "json null", doc: `null`},
		{name: "whitespace json null", doc: " \n\tnull\n "},
		{name: "json array", doc: `[]`},
		{name: "trailing object", doc: `{}{}`},
		{name: "top-level Statements typo", doc: `{"Version":"2012-10-17","Statements":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"]}]}`},
		{name: "statement Conditions typo", doc: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"],"Conditions":{"IpAddress":{"aws:SourceIp":["10.0.0.0/8"]}}}]}`},
		{name: "statement NotResources typo", doc: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"NotResources":["arn:aws:s3:::secret/*"]}]}`},
	}

	for _, tc := range invalidDocs {
		t.Run(tc.name, func(t *testing.T) {
			if _, err := parsePolicyForWrite(tc.doc); !errors.Is(err, ErrInvalidPolicyDocument) {
				t.Fatalf("parsePolicyForWrite(%q) error = %v, want ErrInvalidPolicyDocument", tc.doc, err)
			}
			if _, err := normalizeOptionalPolicyForWrite(tc.doc); !errors.Is(err, ErrInvalidPolicyDocument) {
				t.Fatalf("normalizeOptionalPolicyForWrite(%q) error = %v, want ErrInvalidPolicyDocument", tc.doc, err)
			}
		})
	}

	for _, resetDoc := range []string{`{}`, `{"Statement":[]}`, `{"Version":"2012-10-17","Statement":[]}`} {
		p, err := parsePolicyForWrite(resetDoc)
		if err != nil {
			t.Fatalf("parsePolicyForWrite(%q) unexpected error: %v", resetDoc, err)
		}
		if !p.IsEmpty() {
			t.Fatalf("parsePolicyForWrite(%q) expected empty policy", resetDoc)
		}
		if _, err := parseNamedPolicyForWrite(resetDoc); !errors.Is(err, ErrInvalidPolicyDocument) {
			t.Fatalf("parseNamedPolicyForWrite(%q) error = %v, want ErrInvalidPolicyDocument", resetDoc, err)
		}
	}
}

func TestBucketPolicyWriteValidationRejectsUnknownFields(t *testing.T) {
	validBucketDoc := `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucktest1/*"]}]}`
	if err := validateBucketPolicyForWrite(validBucketDoc, "bucktest1"); err != nil {
		t.Fatalf("validateBucketPolicyForWrite(valid) unexpected error: %v", err)
	}

	invalidBucketDocs := []struct {
		name string
		doc  string
	}{
		{name: "json null", doc: `null`},
		{name: "top-level Statements typo", doc: `{"Version":"2012-10-17","Statements":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucktest1/*"]}]}`},
		{name: "statement Conditions typo", doc: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucktest1/*"],"Conditions":{"IpAddress":{"aws:SourceIp":["10.0.0.0/8"]}}}]}`},
		{name: "principal unknown key", doc: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"],"Service":["ec2.amazonaws.com"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucktest1/*"]}]}`},
		{name: "principal empty object", doc: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucktest1/*"]}]}`},
		{name: "statement unsupported NotPrincipal", doc: `{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Principal":{"AWS":["*"]},"NotPrincipal":{"AWS":["arn:aws:iam::123456789012:root"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucktest1/*"]}]}`},
	}

	for _, tc := range invalidBucketDocs {
		t.Run(tc.name, func(t *testing.T) {
			if err := validateBucketPolicyForWrite(tc.doc, "bucktest1"); !errors.Is(err, ErrInvalidPolicyDocument) {
				t.Fatalf("validateBucketPolicyForWrite(%q) error = %v, want ErrInvalidPolicyDocument", tc.doc, err)
			}
		})
	}
}
