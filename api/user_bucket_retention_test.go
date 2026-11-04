// Copyright (c) 2026 PGSTY
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

package api

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"testing"

	"github.com/minio/console/models"
	"github.com/minio/minio-go/v7"
	"github.com/stretchr/testify/require"
)

func TestBucketRetentionValidityBounds(t *testing.T) {
	for _, tc := range []struct {
		mode     models.ObjectRetentionMode
		unit     models.ObjectRetentionUnit
		wantMode minio.RetentionMode
		wantUnit minio.ValidityUnit
	}{
		{models.ObjectRetentionModeCompliance, models.ObjectRetentionUnitDays, minio.Compliance, minio.Days},
		{models.ObjectRetentionModeGovernance, models.ObjectRetentionUnitYears, minio.Governance, minio.Years},
	} {
		for _, value := range []int32{math.MinInt32, -1, 0, 1, 30, 100, 36500, math.MaxInt32} {
			t.Run(fmt.Sprintf("%s/%d", tc.unit, value), func(t *testing.T) {
				previous := minioSetObjectLockConfigMock
				t.Cleanup(func() { minioSetObjectLockConfigMock = previous })
				calls := 0
				minioSetObjectLockConfigMock = func(_ context.Context, bucket string, mode *minio.RetentionMode, validity *uint, unit *minio.ValidityUnit) error {
					calls++
					require.Equal(t, "retention-bucket", bucket)
					require.Equal(t, tc.wantMode, *mode)
					require.Equal(t, tc.wantUnit, *unit)
					require.Equal(t, uint(value), *validity)
					return nil
				}
				err := setBucketRetentionConfig(context.Background(), minioClientMock{}, "retention-bucket", tc.mode, tc.unit, &value)
				if value <= 0 {
					require.ErrorIs(t, err, ErrBadRequest)
					require.Zero(t, calls, "invalid validity must not reach the server")
					require.Equal(t, http.StatusBadRequest, ErrorWithContext(context.Background(), err).Code)
				} else {
					require.NoError(t, err)
					require.Equal(t, 1, calls, "positive int32 values retain server-side policy validation")
				}
			})
		}
	}
}
