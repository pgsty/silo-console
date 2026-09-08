// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
	"time"

	"github.com/minio/mc/cmd"
)

type objectsListOpts struct {
	BucketName string
	Prefix     string
	Date       time.Time
	// PageSize and ContinuationToken bound one "objects" page; see
	// listObjectPage. Rewind listings ignore them.
	PageSize          int
	ContinuationToken string
}

type ObjectsRequest struct {
	Mode       string `json:"mode,omitempty"`
	BucketName string `json:"bucket_name"`
	Prefix     string `json:"prefix"`
	Date       string `json:"date"`
	RequestID  int64  `json:"request_id"`
	// PageSize is the number of entries one objects page may hold; 0 selects
	// objectPageDefaultSize. ContinuationToken is the opaque token that came
	// with the previous page's request_end frame, empty for the first page.
	PageSize          int    `json:"page_size,omitempty"`
	ContinuationToken string `json:"continuation_token,omitempty"`
}

type WSResponse struct {
	RequestID  int64            `json:"request_id,omitempty"`
	Error      *CodedAPIError   `json:"error,omitempty"`
	RequestEnd bool             `json:"request_end,omitempty"`
	Prefix     string           `json:"prefix,omitempty"`
	BucketName string           `json:"bucketName,omitempty"`
	Data       []ObjectResponse `json:"data,omitempty"`
	// NextContinuationToken accompanies the request_end frame of an objects
	// page and names the page that follows; it is empty once the listing has
	// reached the end of the prefix.
	NextContinuationToken string `json:"next_continuation_token,omitempty"`
	// Truncated accompanies the request_end frame of a rewind listing that
	// was stopped by the row cap or the time budget, so the client can label
	// the result as incomplete.
	Truncated bool `json:"truncated,omitempty"`
}

type ObjectResponse struct {
	Name         string `json:"name,omitempty"`
	LastModified string `json:"last_modified,omitempty"`
	Size         int64  `json:"size"`
	VersionID    string `json:"version_id,omitempty"`
	DeleteMarker bool   `json:"delete_flag,omitempty"`
	IsLatest     bool   `json:"is_latest,omitempty"`
}

func getObjectsOptionsFromReq(request ObjectsRequest) (*objectsListOpts, error) {
	pOptions := objectsListOpts{
		BucketName:        request.BucketName,
		Prefix:            request.Prefix,
		PageSize:          request.PageSize,
		ContinuationToken: request.ContinuationToken,
	}
	if pOptions.PageSize <= 0 {
		pOptions.PageSize = objectPageDefaultSize
	}

	if request.Mode == "rewind" {
		parsedDate, errDate := time.Parse(time.RFC3339, request.Date)

		if errDate != nil {
			return nil, errDate
		}

		pOptions.Date = parsedDate
	}

	return &pOptions, nil
}

func startRewindListing(ctx context.Context, client MCClient, objOpts *objectsListOpts) <-chan *cmd.ClientContent {
	lsRewind := client.list(ctx, cmd.ListOptions{TimeRef: objOpts.Date, WithDeleteMarkers: true})

	return lsRewind
}
