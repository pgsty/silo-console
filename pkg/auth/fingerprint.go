// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
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

package auth

import (
	"crypto/sha256"
	"encoding/hex"
)

// SessionFingerprintPrefix marks a session identifier that is a fingerprint
// rather than a credential.
const SessionFingerprintPrefix = "s-"

// SessionFingerprint derives the identifier Console logs for a session from
// the STS session token. It is stable for the lifetime of the session, so
// audit and error records of one session still correlate, and it is not
// reversible, so a log never carries the token itself. An empty token yields
// an empty fingerprint.
func SessionFingerprint(stsSessionToken string) string {
	if stsSessionToken == "" {
		return ""
	}
	sum := sha256.Sum256([]byte(stsSessionToken))
	return SessionFingerprintPrefix + hex.EncodeToString(sum[:16])
}
