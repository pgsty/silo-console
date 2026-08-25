// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
  IAM_SCOPES,
} from "../src/common/SecureComponent/permissions";
import {
  buildUserServiceAccountTableActions,
  getUserServiceAccountCapabilities,
} from "../src/screens/Console/Users/userServiceAccountControls";

test("user service account capabilities stay independent", () => {
  const cases = [
    {
      granted: IAM_SCOPES.ADMIN_CREATE_SERVICEACCOUNT,
      expected: {
        canCreate: true,
        canList: false,
        canRemove: false,
        canUpdate: false,
      },
    },
    {
      granted: IAM_SCOPES.ADMIN_LIST_SERVICEACCOUNTS,
      expected: {
        canCreate: false,
        canList: true,
        canRemove: false,
        canUpdate: false,
      },
    },
    {
      granted: IAM_SCOPES.ADMIN_REMOVE_SERVICEACCOUNT,
      expected: {
        canCreate: false,
        canList: false,
        canRemove: true,
        canUpdate: false,
      },
    },
    {
      granted: IAM_SCOPES.ADMIN_UPDATE_SERVICEACCOUNT,
      expected: {
        canCreate: false,
        canList: false,
        canRemove: false,
        canUpdate: true,
      },
    },
  ];

  for (const { granted, expected } of cases) {
    expect(
      getUserServiceAccountCapabilities((scope) => scope === granted),
    ).toEqual(expected);
  }
});

test("creating a user service account route requires only create permission", () => {
  expect(IAM_PAGES_PERMISSIONS[IAM_PAGES.USER_SA_ACCOUNT_ADD]).toEqual([
    IAM_SCOPES.ADMIN_CREATE_SERVICEACCOUNT,
  ]);
});

test("view is read-only while edit and delete use separate permissions", () => {
  const opened: Array<{ accessKey: string; readOnly: boolean }> = [];
  const deleted: string[] = [];
  const actions = buildUserServiceAccountTableActions({
    canRemove: false,
    canUpdate: false,
    confirmDelete: (accessKey) => deleted.push(accessKey),
    openDetails: (accessKey, readOnly) => opened.push({ accessKey, readOnly }),
  });
  const view = actions.find(({ type }) => type === "view");
  const edit = actions.find(({ type }) => type === "edit");
  const remove = actions.find(({ type }) => type === "delete");

  view?.onClick?.({ accessKey: "view-key" });
  edit?.onClick?.({ accessKey: "edit-key" });
  remove?.onClick?.({ accessKey: "delete-key" });

  expect(opened).toEqual([
    { accessKey: "view-key", readOnly: true },
    { accessKey: "edit-key", readOnly: false },
  ]);
  expect(deleted).toEqual(["delete-key"]);
  expect(typeof edit?.isDisabled === "function" && edit.isDisabled({})).toBe(
    true,
  );
  expect(
    typeof remove?.isDisabled === "function" && remove.isDisabled({}),
  ).toBe(true);

  const enabledActions = buildUserServiceAccountTableActions({
    canRemove: true,
    canUpdate: true,
    confirmDelete: () => undefined,
    openDetails: () => undefined,
  });
  expect(
    enabledActions
      .filter(({ type }) => type === "edit" || type === "delete")
      .every(
        ({ isDisabled }) => typeof isDisabled === "function" && !isDisabled({}),
      ),
  ).toBe(true);
});
