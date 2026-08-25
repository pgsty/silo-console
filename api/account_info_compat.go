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
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

const (
	accountInfoAdminPath              = "/minio/admin/v3/accountinfo"
	accountInfoCompatibilityBodyLimit = 64 << 20
)

// accountInfoCompatibilityTransport keeps minio-go v7.3 clients compatible
// with AccountInfo responses emitted by servers built with earlier releases.
// Those servers serialized tags.Tags as its internal XML-shaped structure;
// v7.3 expects the field to be a flat map and otherwise rejects the response.
type accountInfoCompatibilityTransport struct {
	transport http.RoundTripper
	bodyLimit int64
}

func (t *accountInfoCompatibilityTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	resp, err := t.transport.RoundTrip(req)
	if err != nil || resp == nil || resp.Body == nil || resp.StatusCode != http.StatusOK || req.URL.Path != accountInfoAdminPath {
		return resp, err
	}

	bodyLimit := t.bodyLimit
	if bodyLimit <= 0 {
		bodyLimit = accountInfoCompatibilityBodyLimit
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, bodyLimit+1))
	if err != nil {
		_ = resp.Body.Close()
		return nil, err
	}
	if int64(len(body)) > bodyLimit {
		// Fail open without buffering the rest of an unexpectedly large body;
		// madmin will consume the original bytes and report its normal result.
		resp.Body = &replayReadCloser{
			Reader: io.MultiReader(bytes.NewReader(body), resp.Body),
			Closer: resp.Body,
		}
		return resp, nil
	}
	_ = resp.Body.Close()

	normalized, changed := normalizeLegacyAccountInfoTags(body)
	if !changed {
		normalized = body
	}
	resp.Body = io.NopCloser(bytes.NewReader(normalized))
	if changed {
		resp.ContentLength = int64(len(normalized))
		resp.Header.Del("Content-Length")
		resp.TransferEncoding = nil
	}
	return resp, nil
}

type replayReadCloser struct {
	io.Reader
	io.Closer
}

// normalizeLegacyAccountInfoTags replaces only the pre-v7.3 XML-shaped tags
// value. Its TagSet encoded as an empty object because its fields were private,
// so converting it to an empty flat map preserves the information available on
// that legacy wire format while allowing the v7.3 decoder to proceed.
func normalizeLegacyAccountInfoTags(body []byte) ([]byte, bool) {
	var account map[string]json.RawMessage
	if err := json.Unmarshal(body, &account); err != nil {
		return body, false
	}

	bucketsKey := "Buckets"
	rawBuckets, ok := account[bucketsKey]
	if !ok {
		bucketsKey = "buckets"
		rawBuckets, ok = account[bucketsKey]
	}
	if !ok {
		return body, false
	}

	var buckets []json.RawMessage
	if err := json.Unmarshal(rawBuckets, &buckets); err != nil {
		return body, false
	}

	changed := false
	for i, rawBucket := range buckets {
		var bucket map[string]json.RawMessage
		if err := json.Unmarshal(rawBucket, &bucket); err != nil {
			return body, false
		}

		rawDetails, ok := bucket["details"]
		if !ok || bytes.Equal(rawDetails, []byte("null")) {
			continue
		}

		var details map[string]json.RawMessage
		if err := json.Unmarshal(rawDetails, &details); err != nil {
			return body, false
		}
		rawTags, ok := details["tags"]
		if !ok || !isLegacyAccountInfoTags(rawTags) {
			continue
		}

		details["tags"] = json.RawMessage(`{}`)
		encodedDetails, err := json.Marshal(details)
		if err != nil {
			return body, false
		}
		bucket["details"] = encodedDetails
		encodedBucket, err := json.Marshal(bucket)
		if err != nil {
			return body, false
		}
		buckets[i] = encodedBucket
		changed = true
	}

	if !changed {
		return body, false
	}
	encodedBuckets, err := json.Marshal(buckets)
	if err != nil {
		return body, false
	}
	account[bucketsKey] = encodedBuckets
	normalized, err := json.Marshal(account)
	if err != nil {
		return body, false
	}
	return normalized, true
}

func isLegacyAccountInfoTags(rawTags json.RawMessage) bool {
	var tagsObject map[string]json.RawMessage
	if err := json.Unmarshal(rawTags, &tagsObject); err != nil {
		return false
	}

	rawXMLName, hasXMLName := tagsObject["XMLName"]
	rawTagSet, hasTagSet := tagsObject["TagSet"]
	if !hasXMLName || !hasTagSet {
		return false
	}

	var xmlName map[string]json.RawMessage
	var tagSet map[string]json.RawMessage
	return json.Unmarshal(rawXMLName, &xmlName) == nil && json.Unmarshal(rawTagSet, &tagSet) == nil
}
