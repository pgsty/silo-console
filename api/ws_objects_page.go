// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"context"
	"errors"
	"net/http"
	"sort"
	"time"
	"unicode/utf8"

	"github.com/minio/console/models"
	"github.com/minio/console/pkg"
	"github.com/minio/minio-go/v7"
)

// Object Manager page limits. One UI page is exactly one ListObjectsV2 call
// with MaxKeys set to the page size, so the largest page is the most one S3
// response can hold; a directory is never drained.
const (
	objectPageDefaultSize = 100
	objectPageMaxSize     = 1000
	// wsMaxContinuationTokenLength bounds the opaque token a client echoes
	// back. SILO tokens encode one object key, which is at most 1024 bytes.
	wsMaxContinuationTokenLength = 4096
)

var (
	// wsObjectPageTimeout bounds one objects page, region lookup included;
	// wsRewindTimeout bounds one rewind listing.
	wsObjectPageTimeout = newWSDuration(30 * time.Second)
	wsRewindTimeout     = newWSDuration(60 * time.Second)
	// wsRewindMaxItems caps the rows one rewind listing returns. It bounds
	// what reaches the browser, not the versions the server scans to produce
	// them.
	wsRewindMaxItems = objectPageMaxSize
)

var errObjectPageTimeout = errors.New("the listing did not finish within the time limit; retry or choose a smaller page size")

// objectPageLister performs exactly one raw ListObjectsV2 call.
type objectPageLister interface {
	listPage(ctx context.Context, bucket, prefix, startAfter, continuationToken string, maxKeys int) (minio.ListBucketV2Result, error)
}

// newObjectPageLister builds the request-local S3 client that serves one
// objects page. It shares the session's credentials, transport policy, App
// Info and region, retries nothing, and is a variable so tests can substitute
// a scripted lister.
var newObjectPageLister = func(ctx context.Context, session *models.Principal, clientIP, region string) (objectPageLister, error) {
	core, err := minio.NewCore(getMinIOEndpoint(), &minio.Options{
		Creds:  getConsoleCredentialsFromSession(session),
		Secure: getMinIOEndpointIsSecure(),
		// Core.ListObjectsV2 issues its request on context.Background; the
		// transport is the only place the page context can be attached.
		Transport:  contextTransport{ctx: ctx, next: PrepareSTSClientTransport(clientIP)},
		Region:     region,
		MaxRetries: 1,
	})
	if err != nil {
		return nil, err
	}
	core.SetAppInfo("MinIO Console", pkg.Version)
	return corePageLister{core: core}, nil
}

// contextTransport runs every request on one context, so cancellation and the
// page deadline reach the connection although the SDK call carries neither.
type contextTransport struct {
	ctx  context.Context
	next http.RoundTripper
}

func (t contextTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	if err := t.ctx.Err(); err != nil {
		return nil, err
	}
	return t.next.RoundTrip(req.Clone(t.ctx))
}

type corePageLister struct{ core *minio.Core }

func (l corePageLister) listPage(ctx context.Context, bucket, prefix, startAfter, continuationToken string, maxKeys int) (minio.ListBucketV2Result, error) {
	if err := ctx.Err(); err != nil {
		return minio.ListBucketV2Result{}, err
	}
	return l.core.ListObjectsV2(bucket, prefix, startAfter, continuationToken, "/", maxKeys)
}

// validContinuationToken accepts the opaque tokens SILO and S3 issue: bounded,
// valid UTF-8, free of control characters. The token is never interpreted.
func validContinuationToken(token string) bool {
	if len(token) > wsMaxContinuationTokenLength || !utf8.ValidString(token) {
		return false
	}
	for _, r := range token {
		if r < 0x20 || r == 0x7f {
			return false
		}
	}
	return true
}

// listObjectPage serves one bounded objects page for a listing. The page
// deadline is derived first and covers the region lookup as well as the list
// call, so a lookup that stalls is reported as the same timeout as a list
// call that stalls.
func (s *wsObjectSession) listObjectPage(listing *wsListing, opts *objectsListOpts) ([]ObjectResponse, string, error) {
	ctx, cancel := context.WithTimeout(listing.ctx, wsObjectPageTimeout.get())
	defer cancel()
	page, next, err := s.fetchObjectPage(ctx, opts)
	if err != nil && listing.ctx.Err() == nil && errors.Is(ctx.Err(), context.DeadlineExceeded) {
		return nil, "", errObjectPageTimeout
	}
	return page, next, err
}

// fetchObjectPage resolves the bucket region through the session client,
// whose cache answers repeat lookups without a request, then lists the page
// through a client that lives only for this page.
func (s *wsObjectSession) fetchObjectPage(ctx context.Context, opts *objectsListOpts) ([]ObjectResponse, string, error) {
	region, err := s.client.getBucketLocation(ctx, opts.BucketName)
	if err != nil {
		return nil, "", err
	}
	lister, err := newObjectPageLister(ctx, s.session, s.clientIP, region)
	if err != nil {
		return nil, "", err
	}
	return listObjectPage(ctx, lister, opts)
}

// listObjectPage fetches the page that follows opts.ContinuationToken with a
// single ListObjectsV2 call asking for opts.PageSize keys. The response is
// returned as it came: a server that answers with fewer keys than asked for
// yields a short page rather than a second call, and the page's cursor is the
// native token of that response, never something derived from an entry name,
// so consecutive pages neither skip nor repeat entries.
func listObjectPage(ctx context.Context, lister objectPageLister, opts *objectsListOpts) ([]ObjectResponse, string, error) {
	pageSize := opts.PageSize
	switch {
	case pageSize <= 0:
		pageSize = objectPageDefaultSize
	case pageSize > objectPageMaxSize:
		pageSize = objectPageMaxSize
	}
	// The prefix lists as its own directory marker. The first page asks the
	// server to start after it; S3 ignores StartAfter once a continuation
	// token is present, so mergePageEntries filters the marker as well.
	startAfter := ""
	if opts.ContinuationToken == "" {
		startAfter = opts.Prefix
	}
	result, err := lister.listPage(ctx, opts.BucketName, opts.Prefix, startAfter, opts.ContinuationToken, pageSize)
	if err != nil {
		return nil, "", err
	}
	next := ""
	if result.IsTruncated {
		if result.NextContinuationToken == "" {
			return nil, "", errors.New("truncated listing without a continuation token")
		}
		next = result.NextContinuationToken
	}
	return mergePageEntries(result, opts.Prefix), next, nil
}

// mergePageEntries merges the objects and common prefixes of one response
// into key order and drops the prefix's own directory marker. A common prefix
// is reported the way the streaming listing reported it: a name that ends in
// the delimiter, no size, the zero modification time.
func mergePageEntries(result minio.ListBucketV2Result, prefix string) []ObjectResponse {
	entries := make([]ObjectResponse, 0, len(result.Contents)+len(result.CommonPrefixes))
	for _, object := range result.Contents {
		if object.Key == prefix {
			continue
		}
		entries = append(entries, ObjectResponse{
			Name:         object.Key,
			Size:         object.Size,
			LastModified: object.LastModified.Format(time.RFC3339),
			VersionID:    object.VersionID,
			IsLatest:     object.IsLatest,
			DeleteMarker: object.IsDeleteMarker,
		})
	}
	for _, common := range result.CommonPrefixes {
		entries = append(entries, ObjectResponse{
			Name:         common.Prefix,
			LastModified: time.Time{}.Format(time.RFC3339),
		})
	}
	sort.SliceStable(entries, func(i, j int) bool { return entries[i].Name < entries[j].Name })
	return entries
}
