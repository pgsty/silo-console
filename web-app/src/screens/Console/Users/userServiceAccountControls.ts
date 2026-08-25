// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import type { ItemActions } from "mds";
import { IAM_SCOPES } from "../../../common/SecureComponent/permissions";

type PermissionCheck = (scope: string) => boolean;

interface UserServiceAccountCapabilities {
  canCreate: boolean;
  canList: boolean;
  canRemove: boolean;
  canUpdate: boolean;
}

export const getUserServiceAccountCapabilities = (
  hasPermission: PermissionCheck,
): UserServiceAccountCapabilities => ({
  canCreate: hasPermission(IAM_SCOPES.ADMIN_CREATE_SERVICEACCOUNT),
  canList: hasPermission(IAM_SCOPES.ADMIN_LIST_SERVICEACCOUNTS),
  canRemove: hasPermission(IAM_SCOPES.ADMIN_REMOVE_SERVICEACCOUNT),
  canUpdate: hasPermission(IAM_SCOPES.ADMIN_UPDATE_SERVICEACCOUNT),
});

interface UserServiceAccountTableActionsOptions {
  canRemove: boolean;
  canUpdate: boolean;
  confirmDelete: (accessKey: string) => void;
  openDetails: (accessKey: string, readOnly: boolean) => void;
}

const withAccessKey = (value: unknown, action: (accessKey: string) => void) => {
  const accessKey = (value as { accessKey?: unknown } | null)?.accessKey;
  if (typeof accessKey === "string" && accessKey !== "") {
    action(accessKey);
  }
};

export const buildUserServiceAccountTableActions = ({
  canRemove,
  canUpdate,
  confirmDelete,
  openDetails,
}: UserServiceAccountTableActionsOptions): ItemActions[] => [
  {
    type: "view",
    onClick: (value: unknown) =>
      withAccessKey(value, (accessKey) => openDetails(accessKey, true)),
  },
  {
    type: "delete",
    isDisabled: () => !canRemove,
    onClick: (value: unknown) => withAccessKey(value, confirmDelete),
  },
  {
    type: "edit",
    isDisabled: () => !canUpdate,
    onClick: (value: unknown) =>
      withAccessKey(value, (accessKey) => openDetails(accessKey, false)),
  },
];
