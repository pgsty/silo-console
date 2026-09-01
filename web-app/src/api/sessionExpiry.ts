// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Session expiry and post-login routing rules, shared by the generated API
// client, the legacy API client and the Object Manager WebSocket. Pure: the
// browser bindings live in ./session.ts so these rules run in Node tests.

const REDIRECT_PATH_KEY = "redirect-path";
const LOGIN_ENDPOINT_MARKER = "api/v1/login";
const AUTH_ROUTES = ["/login", "/logout", "/oauth_callback", "/sso"];

export interface RouteStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const normalizeBasePath = (basePath: string): string => {
  const path = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return path.endsWith("/") ? path : `${path}/`;
};

export const sessionExpiryTarget = (basePath: string): string =>
  `${normalizeBasePath(basePath)}login`;

// Console answers every invalid or expired session with this message on 401
// (and 403 from older servers). Other 401s are credential failures, such as a
// wrong current password on the change-password call, and must not end the
// session.
export const isInvalidSessionResponse = (
  status: number,
  message: string | undefined,
): boolean =>
  (status === 401 || status === 403) && message === "invalid session";

// Login and the OAuth callback answer 401 for bad credentials; those calls
// are never a session expiry.
export const isLoginEndpoint = (url: string): boolean =>
  url.includes(LOGIN_ENDPOINT_MARKER);

export const shouldRedirectExpiredSession = (
  pathname: string,
  basePath: string,
): boolean => pathname !== sessionExpiryTarget(basePath);

// appRoute turns a document pathname into the router-relative route, so a
// subpath deployment remembers "/buckets", not "/console/buckets".
export const appRoute = (pathname: string, basePath: string): string => {
  const base = normalizeBasePath(basePath);
  if (base === "/") {
    return pathname;
  }
  if (pathname.startsWith(base)) {
    return `/${pathname.slice(base.length)}`;
  }
  if (`${pathname}/` === base) {
    return "/";
  }
  return pathname;
};

// A route worth returning to after login: an in-app path (never a full URL,
// a protocol-relative URL or a backslash trick) that is not an auth page.
export const isReturnableRoute = (route: unknown): route is string =>
  typeof route === "string" &&
  route.startsWith("/") &&
  !route.startsWith("//") &&
  !route.includes("\\") &&
  route !== "/" &&
  !AUTH_ROUTES.some(
    (auth) =>
      route === auth ||
      route.startsWith(`${auth}/`) ||
      route.startsWith(`${auth}?`),
  );

export const rememberRoute = (route: string, storage: RouteStorage): void => {
  if (isReturnableRoute(route)) {
    storage.setItem(REDIRECT_PATH_KEY, route);
  }
};

// takeRememberedRoute returns the remembered route once and forgets it; an
// absent or invalid value yields the fallback.
export const takeRememberedRoute = (
  storage: RouteStorage,
  fallback: string,
): string => {
  const route = storage.getItem(REDIRECT_PATH_KEY);
  storage.removeItem(REDIRECT_PATH_KEY);
  return isReturnableRoute(route) ? route : fallback;
};

export const forgetRememberedRoute = (storage: RouteStorage): void => {
  storage.removeItem(REDIRECT_PATH_KEY);
};

export interface ExpiredSessionContext {
  pathname: string;
  basePath: string;
  storage: RouteStorage;
  clearSession: () => void;
  navigate: (target: string) => void;
}

// handleExpiredSession is the one invalid-session path: remember where the
// user was, clear the local session state, and load the login page, which
// takes the user through the configured login method (form or identity
// provider) and back to the remembered route. Returns false when the browser
// is already on the login page, so nothing loops.
export const handleExpiredSession = (
  context: ExpiredSessionContext,
): boolean => {
  if (!shouldRedirectExpiredSession(context.pathname, context.basePath)) {
    return false;
  }
  rememberRoute(appRoute(context.pathname, context.basePath), context.storage);
  context.clearSession();
  context.navigate(sessionExpiryTarget(context.basePath));
  return true;
};
