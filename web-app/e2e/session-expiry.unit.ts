// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  isInvalidSessionResponse,
  sessionExpiryTarget,
  shouldRedirectExpiredSession,
} from "../src/api/sessionExpiry";

test.describe("session expiry routing", () => {
  test("builds root and subpath-aware login targets", () => {
    expect(sessionExpiryTarget("/")).toBe("/login");
    expect(sessionExpiryTarget("/console")).toBe("/console/login");
    expect(sessionExpiryTarget("/console/subpath/")).toBe(
      "/console/subpath/login",
    );
  });

  test("does not redirect when the browser is already on login", () => {
    expect(shouldRedirectExpiredSession("/login", "/")).toBe(false);
    expect(shouldRedirectExpiredSession("/console/login", "/console/")).toBe(
      false,
    );
    expect(shouldRedirectExpiredSession("/console/buckets", "/console/")).toBe(
      true,
    );
  });

  test("recognizes both canonical and legacy invalid-session statuses", () => {
    expect(isInvalidSessionResponse(401, "invalid session")).toBe(true);
    expect(isInvalidSessionResponse(403, "invalid session")).toBe(true);
    expect(isInvalidSessionResponse(401, "Access Denied")).toBe(false);
    expect(isInvalidSessionResponse(500, "invalid session")).toBe(false);
  });
});
