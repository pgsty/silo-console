// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

export const getStoredSidebarOpen = (
  read = () => localStorage.getItem("sidebarOpen"),
): boolean => {
  try {
    const value: unknown = JSON.parse(read() || "null");
    if (
      value &&
      typeof value === "object" &&
      "open" in value &&
      typeof value.open === "boolean"
    ) {
      return value.open;
    }
  } catch {
    // A corrupt preference or unavailable storage must not prevent startup.
  }
  return true;
};
