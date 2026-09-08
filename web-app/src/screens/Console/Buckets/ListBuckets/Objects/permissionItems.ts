// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// Synthesizes the directories a session may browse into from its allowed
// resources when the bucket itself refuses to list. This module is pure and
// free of store imports so the Object Manager middleware, which the store
// creates, and its tests can use it without loading the store.

import { PermissionResource } from "api/consoleApi";
import { BucketObjectItem } from "./ListObjects/types";

export const permissionItems = (
  bucketName: string,
  currentPath: string,
  permissionsArray: PermissionResource[],
): BucketObjectItem[] | null => {
  if (permissionsArray.length === 0) {
    return null;
  }

  // We get permissions applied to the current bucket
  const filteredPermissionsForBucket = permissionsArray.filter(
    (permissionItem) =>
      permissionItem.resource?.endsWith(`:${bucketName}`) ||
      permissionItem.resource?.includes(`:${bucketName}/`),
  );

  // No permissions for this bucket. we can throw the error message at this point
  if (filteredPermissionsForBucket.length === 0) {
    return null;
  }

  let returnElements: BucketObjectItem[] = [];

  // We split current path
  const splitCurrentPath = currentPath.split("/");

  filteredPermissionsForBucket.forEach((permissionElement) => {
    // We review paths in resource address

    // We split ARN & get the last item to check the URL
    const splitARN = permissionElement.resource?.split(":");
    const urlARN = splitARN?.pop() || "";

    // We split the paths of the URL & compare against current location to see if there are more items to include. In case current level is a wildcard or is the last one, we omit this validation

    const splitURLARN = urlARN.split("/");

    // splitURL has more items than bucket name, we can continue validating
    if (splitURLARN.length > 1) {
      splitURLARN.every((currentElementInPath, index) => {
        // It is a wildcard element. We can store the verification as value should be included (?)
        if (currentElementInPath === "*") {
          return false;
        }

        // Element is not included in the path. The user is trying to browse something else.
        if (
          splitCurrentPath[index] &&
          splitCurrentPath[index] !== currentElementInPath
        ) {
          return false;
        }

        // This element is not included by index in the current paths list. We add it so user can browse into it
        if (!splitCurrentPath[index]) {
          returnElements.push({
            name: `${currentElementInPath}/`,
            size: 0,
            last_modified: "",
            version_id: "",
          });
        }

        return true;
      });
    }

    // We review prefixes in allow resources for StringEquals variant only.
    if (
      permissionElement.conditionOperator === "StringEquals" ||
      permissionElement.conditionOperator === "StringLike"
    ) {
      permissionElement.prefixes?.forEach((prefixItem) => {
        // Prefix Item is not empty?
        if (prefixItem !== "") {
          const splitItems = prefixItem.split("/");

          let pathToRouteElements: string[] = [];

          // We verify if currentPath is contained in the path begin, if is not contained the  user has no access to this subpath
          const cleanCurrPath = currentPath.replace(/\/$/, "");

          if (!prefixItem.startsWith(cleanCurrPath) && currentPath !== "") {
            return;
          }

          // For every split element we iterate and check if we can construct a URL
          splitItems.every((splitElement, index) => {
            if (!splitElement.includes("*") && splitElement !== "") {
              if (splitElement !== splitCurrentPath[index]) {
                returnElements.push({
                  name: `${pathToRouteElements.join("/")}${
                    pathToRouteElements.length > 0 ? "/" : ""
                  }${splitElement}/`,
                  size: 0,
                  last_modified: "",
                  version_id: "",
                });
                return false;
              }
              if (splitElement !== "") {
                pathToRouteElements.push(splitElement);
              }

              return true;
            }
            return false;
          });
        }
      });
    }
  });

  // We clean duplicated name entries
  if (returnElements.length > 0) {
    let clElements: BucketObjectItem[] = [];
    let keys: string[] = [];

    returnElements.forEach((itm) => {
      if (!keys.includes(itm.name)) {
        clElements.push(itm);
        keys.push(itm.name);
      }
    });

    returnElements = clElements;
  }

  return returnElements;
};
