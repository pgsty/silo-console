// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"errors"
	"reflect"
	"strings"
	"testing"

	"github.com/minio/mc/pkg/probe"
	"github.com/minio/minio-go/v7/pkg/replication"
)

type replicationRemovalMock struct {
	saved               *replication.Config
	deleted             bool
	targets             []string
	saveErr, cleanupErr error
}

func (m *replicationRemovalMock) setReplication(_ context.Context, cfg *replication.Config, opts replication.Options) *probe.Error {
	if opts.Op != replication.ImportOption {
		panic("must save the complete filtered configuration")
	}
	if m.saveErr != nil {
		return probe.NewError(m.saveErr)
	}
	m.saved = cfg
	return nil
}

func (m *replicationRemovalMock) deleteAllReplicationRules(context.Context) *probe.Error {
	if m.saveErr != nil {
		return probe.NewError(m.saveErr)
	}
	m.deleted = true
	return nil
}

func (m *replicationRemovalMock) removeRemoteBucket(_ context.Context, _, arn string) error {
	if m.saved == nil && !m.deleted {
		panic("target cleanup before rule removal")
	}
	m.targets = append(m.targets, arn)
	return m.cleanupErr
}

func TestReplicationRuleRemoval(t *testing.T) {
	for _, tc := range []struct {
		name                   string
		ids                    []string
		role                   string
		wantRules, wantTargets []string
		wantError              bool
	}{
		{"shared target", []string{"first"}, "", []string{"second", "third"}, nil, false},
		{"unshared target", []string{"third"}, "", []string{"first", "second"}, []string{"arn-other"}, false},
		{"multiple shared rules", []string{"first", "second"}, "", []string{"third"}, []string{"arn-shared"}, false},
		{"last selected rules", []string{"first", "second", "third"}, "", nil, nil, false},
		{"all rules", nil, "", nil, nil, false},
		{"duplicate selection", []string{"first", "first"}, "", []string{"second", "third"}, nil, false},
		{"unknown after valid", []string{"first", "missing"}, "", nil, nil, true},
		{"legacy shared role", []string{"first", "second"}, "arn:minio:replication:legacy", []string{"third"}, nil, false},
		{"legacy role last", nil, "arn:minio:replication:legacy", nil, nil, false},
	} {
		t.Run(tc.name, func(t *testing.T) {
			cfg := replication.Config{Role: tc.role, Rules: []replication.Rule{
				{ID: "first", Destination: replication.Destination{Bucket: "arn-shared"}},
				{ID: "second", Destination: replication.Destination{Bucket: "arn-shared"}},
				{ID: "third", Destination: replication.Destination{Bucket: "arn-other"}},
			}}
			m := &replicationRemovalMock{}
			err := removeReplicationRules(context.Background(), m, m, "bucket", cfg, tc.ids)
			if (err != nil) != tc.wantError {
				t.Fatalf("unexpected error: %v", err)
			}
			if cfg.Rules[0].ID != "first" || len(cfg.Rules) != 3 {
				t.Fatal("mutated source config")
			}
			if tc.wantError {
				if m.saved != nil || m.deleted || len(m.targets) > 0 {
					t.Fatal("invalid selection performed a write")
				}
				return
			}
			var got []string
			if m.saved != nil {
				for _, r := range m.saved.Rules {
					got = append(got, r.ID)
				}
				if m.saved.Role != tc.role {
					t.Fatal("changed legacy role format")
				}
			}
			if !reflect.DeepEqual(got, tc.wantRules) || !reflect.DeepEqual(m.targets, tc.wantTargets) || m.deleted != (len(tc.wantRules) == 0) {
				t.Fatalf("rules=%v targets=%v deleted=%v", got, m.targets, m.deleted)
			}
		})
	}
}

func TestReplicationRemovalFailureState(t *testing.T) {
	sentinel := errors.New("denied")
	cfg := replication.Config{Rules: []replication.Rule{{ID: "last", Destination: replication.Destination{Bucket: "arn"}}}}
	m := &replicationRemovalMock{saveErr: sentinel}
	if err := removeReplicationRules(context.Background(), m, m, "bucket", cfg, []string{"last"}); !errors.Is(err, sentinel) || m.deleted || len(m.targets) > 0 {
		t.Fatalf("failed config update touched target: %+v, %v", m, err)
	}
	m = &replicationRemovalMock{cleanupErr: sentinel}
	cfg.Rules = append(cfg.Rules, replication.Rule{ID: "keep", Destination: replication.Destination{Bucket: "another"}})
	err := removeReplicationRules(context.Background(), m, m, "bucket", cfg, []string{"last"})
	if !errors.Is(err, sentinel) || m.saved == nil || !strings.Contains(err.Error(), "rules deleted") {
		t.Fatalf("cleanup failure hides partial outcome: %+v, %v", m, err)
	}
}

func TestReplicationEmptySelectionIsNoOp(t *testing.T) {
	// An empty multi-select must never become the nil "delete all" selection.
	if err := deleteSelectedReplicationRules(context.Background(), nil, "bucket", nil); err != nil {
		t.Fatal(err)
	}
}
