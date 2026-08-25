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

package api

import (
	"context"
	"errors"
	"fmt"
	"testing"
	"time"

	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/assert"
)

func TestAddServiceAccount(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := AdminClientMock{}
	function := "createServiceAccount()"
	// Test-1: createServiceAccount create a service account by assigning it a policy
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	policyDefinition := "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::bucket1/*\"]}]}"
	mockResponse := madmin.Credentials{
		AccessKey: "minio",
		SecretKey: "minio123",
	}
	minioAddServiceAccountMock = func(_ context.Context, _ string, _ string, _ string, _ string, _ string, _ string, _ *time.Time, _ string) (madmin.Credentials, error) {
		return mockResponse, nil
	}
	saCreds, err := createServiceAccount(ctx, client, policyDefinition, "", "", nil, "")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(mockResponse.AccessKey, saCreds.AccessKey, fmt.Sprintf("Failed on %s:, error occurred: AccessKey differ", function))
	assert.Equal(mockResponse.SecretKey, saCreds.SecretKey, fmt.Sprintf("Failed on %s:, error occurred: SecretKey differ", function))

	// Test-2: if an error occurs on server while creating service account (valid policy), handle it
	policyDefinition = "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetBucketLocation\",\"s3:GetObject\",\"s3:ListAllMyBuckets\"],\"Resource\":[\"arn:aws:s3:::bucket1/*\"]}]}"
	mockResponse = madmin.Credentials{
		AccessKey: "minio",
		SecretKey: "minio123",
	}
	minioAddServiceAccountMock = func(_ context.Context, _ string, _ string, _ string, _ string, _ string, _ string, _ *time.Time, _ string) (madmin.Credentials, error) {
		return madmin.Credentials{}, errors.New("error")
	}
	_, err = createServiceAccount(ctx, client, policyDefinition, "", "", nil, "")
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestServiceAccountWritePathsRejectBareARNBeforeRequest(t *testing.T) {
	previousAddServiceAccountMock := minioAddServiceAccountMock
	previousUpdateServiceAccountMock := minioUpdateServiceAccountMock
	t.Cleanup(func() {
		minioAddServiceAccountMock = previousAddServiceAccountMock
		minioUpdateServiceAccountMock = previousUpdateServiceAccountMock
	})

	addCalls := 0
	updateCalls := 0
	minioAddServiceAccountMock = func(_ context.Context, _, _, _, _, _, _ string, _ *time.Time, _ string) (madmin.Credentials, error) {
		addCalls++
		return madmin.Credentials{}, nil
	}
	minioUpdateServiceAccountMock = func(_ context.Context, _ string, _ madmin.UpdateServiceAccountReq) error {
		updateCalls++
		return nil
	}

	document := `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"NotResource":["arn:aws:s3:::"]}]}`
	client := AdminClientMock{}
	createPaths := []struct {
		name string
		call func() error
	}{
		{name: "current user", call: func() error {
			_, err := createServiceAccount(t.Context(), client, document, "", "", nil, "")
			return err
		}},
		{name: "current user with credentials", call: func() error {
			_, err := createServiceAccountCreds(t.Context(), client, document, "access", "secret", "", "", nil, "")
			return err
		}},
		{name: "selected user", call: func() error {
			_, err := createAUserServiceAccount(t.Context(), client, document, "alice", "", "", nil, "")
			return err
		}},
		{name: "selected user with credentials", call: func() error {
			_, err := createAUserServiceAccountCreds(t.Context(), client, document, "alice", "access", "secret", "", "", nil, "")
			return err
		}},
	}

	for _, createPath := range createPaths {
		t.Run(createPath.name, func(t *testing.T) {
			if err := createPath.call(); !errors.Is(err, ErrInvalidPolicyDocument) {
				t.Fatalf("create service account error = %v, want ErrInvalidPolicyDocument", err)
			}
		})
	}
	if err := updateServiceAccountDetails(t.Context(), client, "access", document, nil, "", "", "", ""); !errors.Is(err, ErrInvalidPolicyDocument) {
		t.Fatalf("update service account error = %v, want ErrInvalidPolicyDocument", err)
	}

	if addCalls != 0 || updateCalls != 0 {
		t.Fatalf("invalid policies reached admin client: add=%d update=%d", addCalls, updateCalls)
	}
}

func TestServiceAccountWritePathsNormalizeOptionalPolicy(t *testing.T) {
	previousAddServiceAccountMock := minioAddServiceAccountMock
	previousUpdateServiceAccountMock := minioUpdateServiceAccountMock
	t.Cleanup(func() {
		minioAddServiceAccountMock = previousAddServiceAccountMock
		minioUpdateServiceAccountMock = previousUpdateServiceAccountMock
	})

	var addedPolicy string
	minioAddServiceAccountMock = func(_ context.Context, policy, _, _, _, _, _ string, _ *time.Time, _ string) (madmin.Credentials, error) {
		addedPolicy = policy
		return madmin.Credentials{}, nil
	}
	var updatedPolicy []byte
	minioUpdateServiceAccountMock = func(_ context.Context, _ string, request madmin.UpdateServiceAccountReq) error {
		updatedPolicy = append(updatedPolicy[:0], request.NewPolicy...)
		return nil
	}

	client := AdminClientMock{}
	if _, err := createServiceAccount(t.Context(), client, " \n\t", "", "", nil, ""); err != nil {
		t.Fatalf("create service account with empty policy: %v", err)
	}
	if addedPolicy != "" {
		t.Fatalf("empty create policy reached admin client as %q", addedPolicy)
	}

	if err := updateServiceAccountDetails(t.Context(), client, "access", " \n\t", nil, "", "", "", ""); err != nil {
		t.Fatalf("update service account with empty policy: %v", err)
	}
	if len(updatedPolicy) != 0 {
		t.Fatalf("empty update policy reached admin client as %q", updatedPolicy)
	}

	document := `{"Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"]}]}`
	if err := updateServiceAccountDetails(t.Context(), client, "access", document, nil, "", "", "", ""); err != nil {
		t.Fatalf("update service account with valid policy: %v", err)
	}
	if string(updatedPolicy) != document {
		t.Fatalf("valid update policy reached admin client as %q, want %q", updatedPolicy, document)
	}
}

func TestListServiceAccounts(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := AdminClientMock{}
	function := "getUserServiceAccounts()"

	// Test-1: getUserServiceAccounts list serviceaccounts for a user
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mockResponse := madmin.ListServiceAccountsResp{
		Accounts: []madmin.ServiceAccountInfo{
			{
				AccessKey: "accesskey1",
			}, {
				AccessKey: "accesskey2",
			},
		},
	}
	minioListServiceAccountsMock = func(_ context.Context, _ string) (madmin.ListServiceAccountsResp, error) {
		return mockResponse, nil
	}

	mockInfoResp := madmin.InfoServiceAccountResp{
		ParentUser:    "",
		AccountStatus: "",
		ImpliedPolicy: false,
		Policy:        "",
		Name:          "",
		Description:   "",
		Expiration:    nil,
	}
	minioInfoServiceAccountMock = func(_ context.Context, _ string) (madmin.InfoServiceAccountResp, error) {
		return mockInfoResp, nil
	}
	_, err := getUserServiceAccounts(ctx, client, "")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: getUserServiceAccounts returns an error, handle it properly
	minioListServiceAccountsMock = func(_ context.Context, _ string) (madmin.ListServiceAccountsResp, error) {
		return madmin.ListServiceAccountsResp{}, errors.New("error")
	}
	_, err = getUserServiceAccounts(ctx, client, "")
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestDeleteServiceAccount(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := AdminClientMock{}
	function := "deleteServiceAccount()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Test-1: deleteServiceAccount receive a service account to delete
	testServiceAccount := "accesskeytest"
	minioDeleteServiceAccountMock = func(_ context.Context, _ string) error {
		return nil
	}
	if err := deleteServiceAccount(ctx, client, testServiceAccount); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}

	// Test-2: if an invalid policy is assigned to the service account, this will raise an error
	minioDeleteServiceAccountMock = func(_ context.Context, _ string) error {
		return errors.New("error")
	}

	if err := deleteServiceAccount(ctx, client, testServiceAccount); assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}

func TestGetServiceAccountDetails(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	client := AdminClientMock{}
	function := "getServiceAccountDetails()"

	// Test-1: getServiceAccountPolicy list serviceaccounts for a user
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	mockResponse := madmin.InfoServiceAccountResp{
		Policy: `
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::*"
      ]
    }
  ]
}`,
	}

	minioInfoServiceAccountMock = func(_ context.Context, _ string) (madmin.InfoServiceAccountResp, error) {
		return mockResponse, nil
	}
	serviceAccount, err := getServiceAccountDetails(ctx, client, "")
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	assert.Equal(mockResponse.Policy, serviceAccount.Policy)

	// Test-2: getServiceAccountPolicy returns an error, handle it properly
	minioInfoServiceAccountMock = func(_ context.Context, _ string) (madmin.InfoServiceAccountResp, error) {
		return madmin.InfoServiceAccountResp{}, errors.New("error")
	}
	_, err = getServiceAccountDetails(ctx, client, "")
	if assert.Error(err) {
		assert.Equal("error", err.Error())
	}
}
