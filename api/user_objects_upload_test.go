// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	objectApi "github.com/minio/console/api/operations/object"
	"github.com/minio/minio-go/v7"
)

func TestUploadFilesRejectsMalformedMultipartWithoutPanic(t *testing.T) {
	var uploaded []string
	minioPutObjectMock = func(_ context.Context, bucket, object string, reader io.Reader, size int64, _ minio.PutObjectOptions) (minio.UploadInfo, error) {
		data, err := io.ReadAll(reader)
		if err != nil {
			return minio.UploadInfo{}, err
		}
		uploaded = append(uploaded, bucket+"/"+object+"="+string(data))
		return minio.UploadInfo{Size: size}, nil
	}
	t.Cleanup(func() { minioPutObjectMock = nil })

	params := func(body string) objectApi.PostBucketsBucketNameObjectsUploadParams {
		r := httptest.NewRequest(http.MethodPost, "/api/v1/buckets/b/objects/upload", strings.NewReader(body))
		r.Header.Set("Content-Type", "multipart/form-data; boundary=X")
		prefix := "/dir/a.txt"
		return objectApi.PostBucketsBucketNameObjectsUploadParams{HTTPRequest: r, BucketName: "b", Prefix: &prefix}
	}
	const part = "--X\r\nContent-Disposition: form-data; name=\"5\"; filename=\"a.txt\"\r\n\r\nhello\r\n"

	if err := uploadFiles(context.Background(), minioClientMock{}, params(part+"--X--\r\n")); err != nil {
		t.Fatalf("valid upload: %v", err)
	}
	if len(uploaded) != 1 || uploaded[0] != "b/dir/a.txt=hello" {
		t.Fatalf("valid upload stored %q", uploaded)
	}

	for name, body := range map[string]string{
		// Each of these used to return a nil part and panic.
		"malformed part header":    "--X\r\nnot a header line\r\n\r\nhello\r\n--X--\r\n",
		"truncated after boundary": part + "--X",
		"empty body":               "",
		"no boundary":              "garbage",
	} {
		t.Run(name, func(t *testing.T) {
			uploaded = nil
			if err := uploadFiles(context.Background(), minioClientMock{}, params(body)); err == nil {
				t.Fatalf("expected an error, stored %q", uploaded)
			}
		})
	}
}
