// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Console forwards each browser upload as one non-resumable PUT. SILO accepts
// objects larger than this, so this is an advisory threshold rather than a
// client-side rejection limit.
export const multipartUploadAdvisorySize = 5 * 1024 * 1024 * 1024;

export const shouldRecommendMultipartUpload = (
  files: ReadonlyArray<Pick<File, "size">>,
): boolean => files.some(({ size }) => size > multipartUploadAdvisorySize);
