// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, test } from "./fixtures/baseFixture";
import { minioadminFile, SERVER_ENDPOINT } from "./consts";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../src/common/SecureComponent/permissions";

test.use({ storageState: minioadminFile });

for (const scenario of [
  {
    name: "self-service permission",
    password: true,
    create: false,
    idp: false,
  },
  {
    name: "user creation permission only",
    password: false,
    create: true,
    idp: false,
  },
  {
    name: "no password permission",
    password: false,
    create: false,
    idp: false,
  },
  {
    name: "external identity provider",
    password: true,
    create: false,
    idp: true,
  },
]) {
  test(`Change Password respects ${scenario.name}`, async ({ page }) => {
    await page.route("**/api/v1/session", async (route) => {
      const response = await route.fetch();
      const session = await response.json();
      const actions: string[] = [IAM_SCOPES.ADMIN_CREATE_SERVICEACCOUNT];
      if (scenario.password) actions.push(IAM_SCOPES.ADMIN_CHANGE_MY_PASSWORD);
      if (scenario.create) actions.push(IAM_SCOPES.ADMIN_CREATE_USER);
      session.permissions = { [CONSOLE_UI_RESOURCE]: actions };
      if (scenario.idp) session.features.push("external-idp");
      await route.fulfill({ response, json: session });
    });

    await page.goto(`${SERVER_ENDPOINT}/access-keys`);
    const button = page.locator("#change-password");
    await expect(button).toBeVisible();
    if (scenario.password && !scenario.idp) {
      await expect(button).toBeEnabled();
      await button.click();
      await expect(
        page.getByLabel("Current Password", { exact: true }),
      ).toBeVisible();
    } else {
      await expect(button).toBeDisabled();
    }
  });
}
