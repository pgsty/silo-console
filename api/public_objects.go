// This file is part of MinIO Console Server
// Copyright (c) 2024 MinIO, Inc.
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
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/api/operations/public"
	"github.com/minio/minio-go/v7/pkg/s3utils"
)

func registerPublicObjectsHandlers(api *operations.ConsoleAPI) {
	api.PublicDownloadSharedObjectHandler = public.DownloadSharedObjectHandlerFunc(func(params public.DownloadSharedObjectParams) middleware.Responder {
		resp, err := getDownloadPublicObjectResponse(params)
		if err != nil {
			return public.NewDownloadSharedObjectDefault(err.Code).WithPayload(err.APIError)
		}
		return resp
	})
}

func getDownloadPublicObjectResponse(params public.DownloadSharedObjectParams) (middleware.Responder, *CodedAPIError) {
	ctx := params.HTTPRequest.Context()

	inputURLDecoded, err := decodeMinIOStringURL(params.URL)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	if inputURLDecoded == nil {
		return nil, ErrorWithContext(ctx, ErrDefault, fmt.Errorf("decoded url is null"))
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, *inputURLDecoded, nil)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// S3 authenticates signed URLs and applies anonymous policies to public
	// objects. Only this download client forbids redirects; other clients keep
	// their existing behavior.
	clnt := GetMinIOHTTPClient(getClientIP(params.HTTPRequest))
	clnt.CheckRedirect = func(_ *http.Request, _ []*http.Request) error {
		return http.ErrUseLastResponse
	}
	resp, err := clnt.Do(req)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	return middleware.ResponderFunc(func(rw http.ResponseWriter, _ runtime.Producer) {
		defer resp.Body.Close()

		if resp.StatusCode >= 300 && resp.StatusCode < 400 {
			http.Error(rw, "Shared object download redirects are not supported", http.StatusBadGateway)
			return
		}
		if resp.StatusCode != http.StatusOK {
			http.Error(rw, resp.Status, resp.StatusCode)
			return
		}

		urlObj, err := url.Parse(*inputURLDecoded)
		if err != nil {
			http.Error(rw, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Add the filename
		_, objectName := url2BucketAndObject(urlObj)
		escapedName := url.PathEscape(objectName)
		rw.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", escapedName))

		_, err = io.Copy(rw, resp.Body)
		if err != nil {
			http.Error(rw, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}), nil
}

// decodeMinIOStringURL accepts object GETs at the configured S3 origin. It
// validates without rewriting the original URL: path and query encoding are
// part of a presigned request, and object keys are not filesystem paths.
func decodeMinIOStringURL(inputURL string) (*string, error) {
	decodedURL, err := base64.RawURLEncoding.DecodeString(inputURL)
	if err != nil {
		return nil, err
	}

	parsedURL, err := url.Parse(string(decodedURL))
	if err != nil {
		return nil, err
	}
	if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
		return nil, fmt.Errorf("unexpected scheme found %s", parsedURL.Scheme)
	}
	endpoint, err := url.Parse(getMinIOServer())
	if err != nil {
		return nil, err
	}
	if parsedURL.User != nil || parsedURL.Fragment != "" || parsedURL.Opaque != "" ||
		parsedURL.Host == "" || parsedURL.Scheme != endpoint.Scheme ||
		!strings.EqualFold(parsedURL.Hostname(), endpoint.Hostname()) ||
		shareURLPort(parsedURL) != shareURLPort(endpoint) {
		return nil, ErrForbidden
	}

	bucket, object := url2BucketAndObject(parsedURL)
	if !strings.HasPrefix(parsedURL.Path, "/") || bucket == "minio" ||
		strings.HasPrefix(bucket, ".minio.sys") || object == "" ||
		s3utils.CheckValidBucketNameStrict(bucket) != nil {
		return nil, ErrForbidden
	}
	// Match SILO's rejection of dot components, including encoded components
	// and its treatment of backslashes/whitespace. Never clean or double-decode.
	for segment := range strings.FieldsFuncSeq(parsedURL.Path, func(r rune) bool { return r == '/' || r == '\\' }) {
		if segment = strings.TrimSpace(segment); segment == "." || segment == ".." {
			return nil, ErrForbidden
		}
	}
	query, err := url.ParseQuery(parsedURL.RawQuery)
	if err != nil {
		return nil, ErrForbidden
	}
	// These keys select other GET operations in SILO's object router. Keep in
	// sync when adding object APIs; unknown non-routing parameters still pass.
	for key := range query {
		switch key {
		case "acl", "tagging", "retention", "legal-hold", "attributes", "uploadId", "lambdaArn", "torrent":
			return nil, ErrForbidden
		}
	}
	return swag.String(string(decodedURL)), nil
}

func shareURLPort(u *url.URL) string {
	if port := u.Port(); port != "" {
		return port
	}
	if u.Scheme == "https" {
		return "443"
	}
	return "80"
}

func url2BucketAndObject(u *url.URL) (bucketName, objectName string) {
	tokens := splitStr(u.Path, "/", 3)
	return tokens[1], tokens[2]
}

// splitStr splits a string into n parts, empty strings are added
// if we are not able to reach n elements
func splitStr(path, sep string, n int) []string {
	splits := strings.SplitN(path, sep, n)
	// Add empty strings if we found elements less than nr
	for i := n - len(splits); i > 0; i-- {
		splits = append(splits, "")
	}
	return splits
}
