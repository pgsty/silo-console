// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

const normalizeBasePath = (basePath: string): string => {
  const path = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return path.endsWith("/") ? path : `${path}/`;
};

export const sessionExpiryTarget = (basePath: string): string =>
  `${normalizeBasePath(basePath)}login`;

export const isInvalidSessionResponse = (
  status: number,
  message: string | undefined,
): boolean =>
  (status === 401 || status === 403) && message === "invalid session";

export const shouldRedirectExpiredSession = (
  pathname: string,
  basePath: string,
): boolean => pathname !== sessionExpiryTarget(basePath);
