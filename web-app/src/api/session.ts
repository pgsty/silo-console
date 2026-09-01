// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Browser bindings of the shared session rules (see ./sessionExpiry.ts).

import { clearSession } from "../common/utils";
import {
  forgetRememberedRoute,
  handleExpiredSession,
  rememberRoute,
  takeRememberedRoute,
} from "./sessionExpiry";

const basePath = (): string => new URL(document.baseURI).pathname;

// expireSession ends the current session in the browser the same way for
// every caller: the REST clients on an invalid-session response, the Object
// Manager socket on a 401 frame. A full document load of the login page
// resets every in-memory state; the remembered route brings the user back.
export const expireSession = (): boolean =>
  handleExpiredSession({
    pathname: window.location.pathname,
    basePath: basePath(),
    storage: localStorage,
    clearSession,
    navigate: (target) => {
      document.location = target;
    },
  });

export const rememberCurrentRoute = (route: string): void =>
  rememberRoute(route, localStorage);

export const takeReturnRoute = (fallback: string): string =>
  takeRememberedRoute(localStorage, fallback);

export const forgetReturnRoute = (): void =>
  forgetRememberedRoute(localStorage);
