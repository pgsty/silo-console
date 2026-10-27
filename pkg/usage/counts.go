// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

// Package usage provides metadata-only accounting shared by interactive scans
// and the durable bucket-usage worker. It never reads object contents.
package usage

import (
	"errors"
	"math"

	"github.com/minio/minio-go/v7"
)

type Counts struct {
	CurrentBytes, RetainedBytes                     uint64
	CurrentObjects, RetainedVersions, DeleteMarkers int64
}

func (counts Counts) Add(object minio.ObjectInfo, versions bool) (Counts, error) {
	if object.IsDeleteMarker {
		counts.DeleteMarkers++
		return counts, nil
	}
	if object.Size < 0 {
		return counts, errors.New("negative object size in listing")
	}
	bytes := &counts.CurrentBytes
	if versions && !object.IsLatest {
		bytes = &counts.RetainedBytes
		counts.RetainedVersions++
	} else {
		counts.CurrentObjects++
	}
	if math.MaxUint64-*bytes < uint64(object.Size) {
		return counts, errors.New("object byte total exceeds the supported range")
	}
	*bytes += uint64(object.Size)
	return counts, nil
}
