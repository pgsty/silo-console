// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"encoding/xml"
	"reflect"
	"testing"
	"time"

	bucketAPI "github.com/minio/console/api/operations/bucket"
	"github.com/minio/console/models"
	"github.com/minio/minio-go/v7/pkg/lifecycle"
)

func TestLifecycleEditPreservesIndependentActions(t *testing.T) {
	date := lifecycle.ExpirationDate{Time: time.Date(2030, 1, 1, 0, 0, 0, 0, time.UTC)}
	expiry, transition := "expiry", "transition"
	for _, tc := range []struct {
		name  string
		rule  lifecycle.Rule
		body  models.UpdateBucketLifecycle
		check func(*testing.T, lifecycle.Rule)
	}{
		{"current and noncurrent expiry", lifecycle.Rule{Expiration: lifecycle.Expiration{Days: 30}, NoncurrentVersionExpiration: lifecycle.NoncurrentVersionExpiration{NoncurrentDays: 60}}, models.UpdateBucketLifecycle{Type: &expiry, ExpiryDays: 90, NoncurrentversionExpirationDays: 120}, func(t *testing.T, r lifecycle.Rule) {
			if r.Expiration.Days != 90 || r.NoncurrentVersionExpiration.NoncurrentDays != 120 {
				t.Fatalf("lost expiry action: %+v", r)
			}
		}},
		{"noncurrent preserves current", lifecycle.Rule{Expiration: lifecycle.Expiration{Days: 30}}, models.UpdateBucketLifecycle{Type: &expiry, NoncurrentversionExpirationDays: 120}, func(t *testing.T, r lifecycle.Rule) {
			if r.Expiration.Days != 30 || r.NoncurrentVersionExpiration.NoncurrentDays != 120 {
				t.Fatalf("lost current expiry: %+v", r)
			}
		}},
		{"date and transition survive expiry edit", lifecycle.Rule{Expiration: lifecycle.Expiration{Date: date}, Transition: lifecycle.Transition{Days: 10, StorageClass: "COLD"}}, models.UpdateBucketLifecycle{Type: &expiry, NoncurrentversionExpirationDays: 120}, func(t *testing.T, r lifecycle.Rule) {
			if r.Expiration.Date != date || r.Transition.StorageClass != "COLD" || r.Transition.Days != 10 {
				t.Fatalf("lost untouched actions: %+v", r)
			}
		}},
		{"both transitions preserve expiry", lifecycle.Rule{Expiration: lifecycle.Expiration{Days: 100}}, models.UpdateBucketLifecycle{Type: &transition, TransitionDays: 10, StorageClass: "cold", NoncurrentversionTransitionDays: 20, NoncurrentversionTransitionStorageClass: "archive"}, func(t *testing.T, r lifecycle.Rule) {
			if r.Expiration.Days != 100 || r.Transition.Days != 10 || r.Transition.StorageClass != "COLD" || r.NoncurrentVersionTransition.NoncurrentDays != 20 || r.NoncurrentVersionTransition.StorageClass != "ARCHIVE" {
				t.Fatalf("lost independent actions: %+v", r)
			}
		}},
		{"date transition metadata edit", lifecycle.Rule{Transition: lifecycle.Transition{Date: date, StorageClass: "COLD"}}, models.UpdateBucketLifecycle{Type: &transition, Disable: true}, func(t *testing.T, r lifecycle.Rule) {
			if r.Transition.Date != date || r.Transition.StorageClass != "COLD" || r.Status != "Disabled" {
				t.Fatalf("lost date transition: %+v", r)
			}
		}},
		{"explicit marker with noncurrent expiry", lifecycle.Rule{}, models.UpdateBucketLifecycle{Type: &expiry, ExpiredObjectDeleteMarker: true, NoncurrentversionExpirationDays: 60}, func(t *testing.T, r lifecycle.Rule) {
			if !r.Expiration.DeleteMarker || r.NoncurrentVersionExpiration.NoncurrentDays != 60 {
				t.Fatalf("lost delete marker: %+v", r)
			}
		}},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tc.rule.ID = "edit"
			tc.rule.Status = "Enabled"
			// These unexposed fields must also survive the update and serialization.
			tc.rule.AbortIncompleteMultipartUpload.DaysAfterInitiation = 7
			tc.rule.NoncurrentVersionExpiration.NewerNoncurrentVersions = 3
			cfg := &lifecycle.Configuration{Rules: []lifecycle.Rule{tc.rule, {ID: "untouched", Status: "Enabled", Expiration: lifecycle.Expiration{Days: 365}}}}
			minioGetLifecycleRulesMock = func(context.Context, string) (*lifecycle.Configuration, error) { return cfg, nil }
			var saved lifecycle.Configuration
			minioSetBucketLifecycleMock = func(_ context.Context, _ string, config *lifecycle.Configuration) error {
				b, err := xml.Marshal(config)
				if err != nil {
					return err
				}
				return xml.Unmarshal(b, &saved)
			}
			if err := editBucketLifecycle(context.Background(), minioClientMock{}, bucketAPI.UpdateBucketLifecycleParams{BucketName: "bucket", LifecycleID: "edit", Body: &tc.body}); err != nil {
				t.Fatal(err)
			}
			tc.check(t, saved.Rules[0])
			if saved.Rules[0].AbortIncompleteMultipartUpload.DaysAfterInitiation != 7 || saved.Rules[0].NoncurrentVersionExpiration.NewerNoncurrentVersions != 3 {
				t.Fatal("lost unexposed fields")
			}
			if saved.Rules[1].ID != "untouched" || saved.Rules[1].Expiration.Days != 365 {
				t.Fatal("changed another rule")
			}
		})
	}
}

func TestLifecycleEditFilterRoundTrip(t *testing.T) {
	for _, rule := range []lifecycle.Rule{
		{Prefix: "logs/"},
		{RuleFilter: lifecycle.Filter{Prefix: "logs/"}},
		{RuleFilter: lifecycle.Filter{And: lifecycle.And{Prefix: "logs/", Tags: []lifecycle.Tag{{Key: "old", Value: "tag"}}}}},
		{RuleFilter: lifecycle.Filter{Tag: lifecycle.Tag{Key: "old", Value: "tag"}}},
		{RuleFilter: lifecycle.Filter{And: lifecycle.And{Prefix: "logs/", ObjectSizeGreaterThan: 10}}},
	} {
		for _, tags := range []string{"", "team=ops&env=prod"} {
			rule.ID = "edit"
			rule.Status = "Enabled"
			rule.Expiration.Days = 30
			cfg := &lifecycle.Configuration{Rules: []lifecycle.Rule{rule}}
			minioGetLifecycleRulesMock = func(context.Context, string) (*lifecycle.Configuration, error) { return cfg, nil }
			minioSetBucketLifecycleMock = func(_ context.Context, _ string, config *lifecycle.Configuration) error {
				b, err := xml.Marshal(config)
				if err != nil {
					return err
				}
				cfg = &lifecycle.Configuration{}
				return xml.Unmarshal(b, cfg)
			}
			before, err := getBucketLifecycle(context.Background(), minioClientMock{}, "bucket")
			if err != nil {
				t.Fatal(err)
			}
			if rule.Prefix != "" && before.Lifecycle[0].Prefix != "logs/" {
				t.Fatal("legacy prefix missing")
			}
			kind := "expiry"
			body := &models.UpdateBucketLifecycle{Type: &kind, Prefix: "new/", Tags: tags, ExpiryDays: 90}
			if err := editBucketLifecycle(context.Background(), minioClientMock{}, bucketAPI.UpdateBucketLifecycleParams{BucketName: "bucket", LifecycleID: "edit", Body: body}); err != nil {
				t.Fatal(err)
			}
			after, err := getBucketLifecycle(context.Background(), minioClientMock{}, "bucket")
			if err != nil {
				t.Fatal(err)
			}
			var want []*models.LifecycleTag
			if tags != "" {
				want = []*models.LifecycleTag{{Key: "team", Value: "ops"}, {Key: "env", Value: "prod"}}
			}
			if after.Lifecycle[0].Prefix != "new/" || !reflect.DeepEqual(after.Lifecycle[0].Tags, want) {
				t.Fatalf("filter changed on round trip: %+v", after.Lifecycle[0])
			}
			if cfg.Rules[0].RuleFilter.And.ObjectSizeGreaterThan != rule.RuleFilter.And.ObjectSizeGreaterThan {
				t.Fatal("size constraint lost")
			}
		}
	}
}
