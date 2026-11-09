// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"context"
	"testing"

	"github.com/minio/minio-go/v7"
)

// closedListing models minio-go on a canceled context: the channel closes
// without an error object.
type closedListing struct{}

func (closedListing) ListObjects(context.Context, string, minio.ListObjectsOptions) <-chan minio.ObjectInfo {
	objects := make(chan minio.ObjectInfo)
	close(objects)
	return objects
}

func TestAuthorizeBucketUsageDoesNotAuthorizeACanceledProbe(t *testing.T) {
	if err := authorizeBucketUsage(context.Background(), closedListing{}, "empty", false); err != nil {
		t.Fatalf("an empty, readable bucket must be authorized: %v", err)
	}
	canceled, cancel := context.WithCancel(context.Background())
	cancel()
	// Either select branch may win; both must refuse.
	for range 100 {
		if err := authorizeBucketUsage(canceled, closedListing{}, "bucket", true); err == nil {
			t.Fatal("a canceled probe was treated as authorized")
		}
	}
}
