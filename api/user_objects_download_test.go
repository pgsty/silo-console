// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/klauspost/compress/zip"
	"github.com/minio/console/models"
	"github.com/minio/minio-go/v7"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type downloadObjectStub struct {
	reader     *bytes.Reader
	stat       minio.ObjectInfo
	statErr    error
	seekErr    error
	seekOffset int64
}

func newDownloadObjectStub(contents string, size int64) *downloadObjectStub {
	return &downloadObjectStub{
		reader: bytes.NewReader([]byte(contents)),
		stat: minio.ObjectInfo{
			Size:         size,
			ContentType:  "text/plain",
			LastModified: time.Date(2026, time.August, 24, 0, 0, 0, 0, time.UTC),
		},
	}
}

func (o *downloadObjectStub) Read(p []byte) (int, error) {
	return o.reader.Read(p)
}

func (o *downloadObjectStub) Seek(offset int64, whence int) (int64, error) {
	o.seekOffset = offset
	if o.seekErr != nil {
		return 0, o.seekErr
	}
	return o.reader.Seek(offset, whence)
}

func (o *downloadObjectStub) Stat() (minio.ObjectInfo, error) {
	return o.stat, o.statErr
}

type headerOrderRecorder struct {
	*httptest.ResponseRecorder
	contentLengthAtWriteHeader string
}

func (r *headerOrderRecorder) WriteHeader(statusCode int) {
	r.contentLengthAtWriteHeader = r.Header().Get("Content-Length")
	r.ResponseRecorder.WriteHeader(statusCode)
}

func TestWriteDownloadObjectResponseRangeHandling(t *testing.T) {
	tests := []struct {
		name             string
		contents         string
		size             int64
		rangeHeader      string
		wantStatus       int
		wantBody         string
		wantLength       string
		wantContentRange string
		wantSeekOffset   int64
	}{
		{
			name:           "empty object ignores range",
			size:           0,
			rangeHeader:    "not-a-valid-range",
			wantStatus:     http.StatusOK,
			wantLength:     "0",
			wantSeekOffset: 0,
		},
		{
			name:             "valid range",
			contents:         "abcdef",
			size:             6,
			rangeHeader:      "bytes=1-3",
			wantStatus:       http.StatusPartialContent,
			wantBody:         "bcd",
			wantLength:       "3",
			wantContentRange: "bytes 1-3/6",
			wantSeekOffset:   1,
		},
		{
			name:             "malformed range",
			contents:         "abcdef",
			size:             6,
			rangeHeader:      "bytes=wat",
			wantStatus:       http.StatusRequestedRangeNotSatisfiable,
			wantContentRange: "bytes */6",
		},
		{
			name:             "unsatisfiable range",
			contents:         "abcdef",
			size:             6,
			rangeHeader:      "bytes=6-",
			wantStatus:       http.StatusRequestedRangeNotSatisfiable,
			wantContentRange: "bytes */6",
		},
		{
			name:             "zero-length suffix range",
			contents:         "abcdef",
			size:             6,
			rangeHeader:      "bytes=-0",
			wantStatus:       http.StatusRequestedRangeNotSatisfiable,
			wantContentRange: "bytes */6",
		},
		{
			name:             "signed range is malformed",
			contents:         "abcdef",
			size:             6,
			rangeHeader:      "bytes=+1-2",
			wantStatus:       http.StatusRequestedRangeNotSatisfiable,
			wantContentRange: "bytes */6",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			object := newDownloadObjectStub(tt.contents, tt.size)
			req := httptest.NewRequest(http.MethodGet, "/download", nil)
			req.Header.Set("Range", tt.rangeHeader)
			rw := &headerOrderRecorder{ResponseRecorder: httptest.NewRecorder()}

			writeDownloadObjectResponse(context.Background(), rw, req, object, "file.txt", "", "", true)

			result := rw.Result()
			require.NoError(t, result.Body.Close())
			assert.Equal(t, tt.wantStatus, result.StatusCode)
			assert.Equal(t, tt.wantContentRange, result.Header.Get("Content-Range"))
			assert.Equal(t, tt.wantSeekOffset, object.seekOffset)
			if tt.wantStatus < http.StatusBadRequest {
				assert.Equal(t, tt.wantLength, result.Header.Get("Content-Length"))
				assert.Equal(t, tt.wantBody, rw.Body.String())
			}
			if tt.wantStatus == http.StatusPartialContent {
				assert.Equal(t, tt.wantLength, rw.contentLengthAtWriteHeader)
			}
		})
	}
}

func TestWriteDownloadObjectResponsePreservesStatStatus(t *testing.T) {
	object := newDownloadObjectStub("", 0)
	object.statErr = minio.ErrorResponse{
		Code:       "NoSuchKey",
		Message:    "object does not exist",
		StatusCode: http.StatusNotFound,
	}
	rw := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/download", nil)

	writeDownloadObjectResponse(context.Background(), rw, req, object, "missing.txt", "", "", false)

	assert.Equal(t, http.StatusNotFound, rw.Code)
}

type zipObjectStub struct {
	reader  io.Reader
	stat    minio.ObjectInfo
	statErr error
	closed  bool
}

func (o *zipObjectStub) Read(p []byte) (int, error) {
	return o.reader.Read(p)
}

func (o *zipObjectStub) Close() error {
	o.closed = true
	return nil
}

func (o *zipObjectStub) Stat() (minio.ObjectInfo, error) {
	return o.stat, o.statErr
}

type errorReader struct {
	err error
}

func (r errorReader) Read(_ []byte) (int, error) {
	return 0, r.err
}

func TestWriteZipEntriesStopsAfterSecondObjectFailure(t *testing.T) {
	copyErr := errors.New("second object read failed")
	objects := map[string]*zipObjectStub{
		"first":  {reader: bytes.NewBufferString("first contents")},
		"second": {reader: io.MultiReader(bytes.NewBufferString("partial"), errorReader{err: copyErr})},
		"third":  {reader: bytes.NewBufferString("must not be fetched")},
	}
	entries := []zipObjectEntry{
		{objectName: "first", archiveName: "first.txt"},
		{objectName: "second", archiveName: "second.txt"},
		{objectName: "third", archiveName: "third.txt"},
	}
	var fetched []string
	getObject := func(name string) (zipSourceObject, error) {
		fetched = append(fetched, name)
		return objects[name], nil
	}
	var destination bytes.Buffer
	zipw := zip.NewWriter(&destination)

	err := writeZipEntries(context.Background(), zipw, entries, getObject)

	require.ErrorIs(t, err, copyErr)
	assert.Equal(t, []string{"first", "second"}, fetched)
	assert.True(t, objects["first"].closed)
	assert.True(t, objects["second"].closed)
	assert.False(t, objects["third"].closed)
}

func TestWriteZipEntriesStopsOnStatFailure(t *testing.T) {
	statErr := errors.New("stat failed")
	first := &zipObjectStub{reader: bytes.NewReader(nil), statErr: statErr}
	entries := []zipObjectEntry{
		{objectName: "first", archiveName: "first.txt", stat: true},
		{objectName: "second", archiveName: "second.txt", stat: true},
	}
	var fetched []string
	getObject := func(name string) (zipSourceObject, error) {
		fetched = append(fetched, name)
		return first, nil
	}
	zipw := zip.NewWriter(io.Discard)

	err := writeZipEntries(context.Background(), zipw, entries, getObject)

	require.ErrorIs(t, err, statErr)
	assert.Equal(t, []string{"first"}, fetched)
	assert.True(t, first.closed)
}

func TestZipDownloadResponderRejectsPartialServerArchive(t *testing.T) {
	resp, pw := io.Pipe()
	go func() {
		_, err := pw.Write(bytes.Repeat([]byte("x"), 8*1024))
		if err != nil {
			return
		}
		_ = pw.CloseWithError(&zipStreamError{err: errors.New("archive build failed")})
	}()
	rw := httptest.NewRecorder()
	responder := zipDownloadResponder(context.Background(), resp, "archive.zip")

	defer func() {
		recovered := recover()
		require.NotNil(t, recovered)
		err, ok := recovered.(error)
		require.True(t, ok)
		assert.ErrorIs(t, err, http.ErrAbortHandler)
	}()
	responder.WriteResponse(rw, nil)
}

func TestZipDownloadResponderReturns500BeforeBody(t *testing.T) {
	resp, pw := io.Pipe()
	require.NoError(t, pw.CloseWithError(&zipStreamError{err: errors.New("archive build failed")}))
	rw := httptest.NewRecorder()

	zipDownloadResponder(context.Background(), resp, "archive.zip").WriteResponse(rw, nil)

	assert.Equal(t, http.StatusInternalServerError, rw.Code)
	assert.Empty(t, rw.Header().Get("Content-Disposition"))
	assert.Equal(t, "text/plain; charset=utf-8", rw.Header().Get("Content-Type"))
}

func TestZipDownloadResponderIgnoresCanceledRequest(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	resp, pw := io.Pipe()
	require.NoError(t, pw.CloseWithError(&zipStreamError{err: context.Canceled}))
	rw := httptest.NewRecorder()

	zipDownloadResponder(ctx, resp, "archive.zip").WriteResponse(rw, nil)

	assert.Equal(t, http.StatusOK, rw.Code)
}

func TestNewZipStreamBuildsValidArchive(t *testing.T) {
	object := &zipObjectStub{
		reader: bytes.NewBufferString("complete contents"),
		stat: minio.ObjectInfo{
			LastModified: time.Date(2026, time.August, 24, 0, 0, 0, 0, time.UTC),
		},
	}
	resp := newZipStream(func(zipw *zip.Writer) error {
		entry := zipObjectEntry{objectName: "object", archiveName: "object.txt", stat: true}
		return writeZipEntries(context.Background(), zipw, []zipObjectEntry{entry}, func(_ string) (zipSourceObject, error) {
			return object, nil
		})
	})

	archive, err := io.ReadAll(resp)
	require.NoError(t, err)
	require.NoError(t, resp.Close())
	reader, err := zip.NewReader(bytes.NewReader(archive), int64(len(archive)))
	require.NoError(t, err)
	require.Len(t, reader.File, 1)
	file, err := reader.File[0].Open()
	require.NoError(t, err)
	contents, err := io.ReadAll(file)
	require.NoError(t, err)
	require.NoError(t, file.Close())
	assert.Equal(t, "complete contents", string(contents))
}

func TestZeroObjectSizesAreSerialized(t *testing.T) {
	bucketObjectJSON, err := json.Marshal(&models.BucketObject{})
	require.NoError(t, err)
	assert.JSONEq(t, `{"size": 0}`, string(bucketObjectJSON))

	webSocketObjectJSON, err := json.Marshal(&ObjectResponse{})
	require.NoError(t, err)
	assert.JSONEq(t, `{"size": 0}`, string(webSocketObjectJSON))
}

func TestEmbeddedSpecsMarkBucketObjectSizeAsNonOmitEmpty(t *testing.T) {
	for name, document := range map[string]json.RawMessage{
		"swagger":      SwaggerJSON,
		"flat swagger": FlatSwaggerJSON,
	} {
		t.Run(name, func(t *testing.T) {
			var spec map[string]any
			require.NoError(t, json.Unmarshal(document, &spec))
			definitions, ok := spec["definitions"].(map[string]any)
			require.True(t, ok)
			bucketObject, ok := definitions["bucketObject"].(map[string]any)
			require.True(t, ok)
			properties, ok := bucketObject["properties"].(map[string]any)
			require.True(t, ok)
			size, ok := properties["size"].(map[string]any)
			require.True(t, ok)
			xOmitEmpty, exists := size["x-omitempty"]
			require.True(t, exists)
			assert.Equal(t, false, xOmitEmpty)
		})
	}
}
