// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { ModalPresence } from "common/ui/ModalPresence";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import styled, { type CSSObject } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useMobile } from "common/ui/useMediaQuery";
import { OverflowMenu } from "common/ui/OverflowMenu";
import {
  Button,
  CopyIcon,
  IconButton,
  NewPathIcon,
  Breadcrumbs,
  breakPoints,
  Box,
} from "mds";
import { Tooltip } from "common/Tooltip";
import { hasPermission } from "../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import withSuspense from "../Common/Components/withSuspense";
import { setSnackBarMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { setVersionsModeEnabled } from "./objectBrowserSlice";
import { getSessionGrantsWildCard } from "../Buckets/ListBuckets/UploadPermissionUtils";
import { i18nKey, useT } from "i18n";

const CreatePathModal = withSuspense(
  React.lazy(
    () => import("../Buckets/ListBuckets/Objects/ListObjects/CreatePathModal"),
  ),
);

const BreadcrumbsMain = styled.div((): CSSObject => ({
  display: "flex",
  flexWrap: "nowrap" as const,
  minWidth: 0,
  columnGap: 0,
  rowGap: 15,
  "& .breadcrumbs-bar": {
    minWidth: 0,
    marginInlineEnd: 0,
    width: "auto",
    flex: "0 1 auto",
    [`@media (max-width: ${breakPoints.lg}px)`]: { flex: "1 1 240px" },
  },
  "& .additionalOptions": {
    flex: "1 0 auto",
    paddingInlineEnd: "10px",
    display: "flex",
    alignItems: "center",
    [`@media (max-width: ${breakPoints.lg}px)`]: {
      order: 1,
      flexBasis: "100%",
      marginBottom: 5,
      paddingInlineEnd: 0,
      justifyContent: "flex-start",
      "& > div": {
        fontSize: 12,
        fontWeight: "normal",
        flexDirection: "row",
        flexWrap: "nowrap",
      },
    },
  },
  "& .create-path-action": { marginInlineStart: 8 },
  "& .slashSpacingStyle": {
    margin: "0 5px",
  },
  [`@media (max-width: ${breakPoints.lg}px)`]: { flexWrap: "wrap" },
}));

interface IObjectBrowser {
  createActionRef?: React.MutableRefObject<
    import("common/ui/ContextMenu").ContextAction | null
  >;
  bucketName: string;
  internalPaths: string;
  hidePathButton?: boolean;
  additionalOptions?: React.ReactNode;
}

const BrowserBreadcrumbs = ({
  createActionRef,
  bucketName,
  internalPaths,
  hidePathButton,
  additionalOptions,
}: IObjectBrowser) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const mobile = useMobile();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled,
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode,
  );
  const versionedFile = useSelector(
    (state: AppState) => state.objectBrowser.versionedFile,
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );

  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);
  const [canCreateSubpath, setCanCreateSubpath] = useState<boolean>(false);

  const putObjectPermScopes = [
    IAM_SCOPES.S3_PUT_OBJECT,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ];

  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {},
  );

  let paths = internalPaths;

  if (internalPaths !== "") {
    paths = `/${internalPaths}`;
  }

  const splitPaths = internalPaths
    ? internalPaths.replace(/\/$/, "").split("/")
    : [];
  const lastBreadcrumbsIndex = splitPaths.length - 1;

  const pathToCheckPerms = bucketName + paths || bucketName;
  const sessionGrantWildCards = getSessionGrantsWildCard(
    sessionGrants,
    pathToCheckPerms,
    putObjectPermScopes,
  );

  useEffect(() => {
    setCanCreateSubpath(false);
    Object.keys(sessionGrants).forEach((grant) => {
      grant.includes(pathToCheckPerms) &&
        grant.includes("/*") &&
        setCanCreateSubpath(true);
    });
  }, [pathToCheckPerms, internalPaths, sessionGrants]);

  const canCreatePath =
    hasPermission(
      [pathToCheckPerms, ...sessionGrantWildCards],
      putObjectPermScopes,
    ) ||
    anonymousMode ||
    canCreateSubpath;

  useEffect(() => {
    if (!createActionRef) return;
    createActionRef.current = {
      label: t("Create new path"),
      icon: <NewPathIcon />,
      action: () => setCreateFolderOpen(true),
      state: {
        disabled: !anonymousMode && (rewindEnabled || !canCreatePath),
        reason: rewindEnabled
          ? t("Exit rewind mode to create a path.")
          : !canCreatePath
            ? t("You need s3:PutObject permission.")
            : undefined,
      },
    };
    return () => {
      createActionRef.current = null;
    };
  }, [createActionRef, t, anonymousMode, rewindEnabled, canCreatePath]);

  const hiddenCount = mobile ? Math.max(0, splitPaths.length - 2) : 0;
  const hiddenAncestors = [
    {
      label: bucketName,
      onClick: () => navigate(`/browser/${encodeURIComponent(bucketName)}/`),
    },
    ...splitPaths.slice(0, hiddenCount).map((name, index) => ({
      label: name || "/",
      onClick: () =>
        navigate(
          `/browser/${encodeURIComponent(bucketName)}/${encodeURIComponent(splitPaths.slice(0, index + 1).join("/") + "/")}`,
        ),
    })),
  ];
  const breadcrumbsMap = splitPaths.map((objectItem: string, index: number) => {
    if (index < hiddenCount) return null;
    const subSplit = `${splitPaths.slice(0, index + 1).join("/")}/`;
    const route = `/browser/${encodeURIComponent(bucketName)}/${
      subSplit ? `${encodeURIComponent(subSplit)}` : ``
    }`;

    if (index === lastBreadcrumbsIndex && objectItem === versionedFile) {
      return null;
    }

    return (
      <Fragment key={`breadcrumbs-${index.toString()}`}>
        <span className={"slashSpacingStyle"}>/</span>
        {index === lastBreadcrumbsIndex ? (
          <span
            className="breadcrumb-segment"
            title={objectItem || "/"}
            style={{ cursor: "default", whiteSpace: "pre" }}
          >
            {objectItem || "/"}
          </span>
        ) : (
          <Link
            className="breadcrumb-segment"
            title={objectItem || "/"}
            style={{
              whiteSpace: "pre",
            }}
            to={route}
            onClick={() => {
              dispatch(
                setVersionsModeEnabled({ status: false, objectName: "" }),
              );
            }}
          >
            {objectItem || "/"}
          </Link>
        )}
      </Fragment>
    );
  });

  let versionsItem: any[] = [];

  if (versionsMode) {
    versionsItem = [
      <Fragment key={`breadcrumbs-versionedItem`}>
        <span style={{ display: "contents" }}>
          <span className={"slashSpacingStyle"}>/</span>
          <span className="breadcrumb-segment" title={versionedFile}>
            {t("{file} - Versions").replace("{file}", () => versionedFile)}
          </span>
        </span>
      </Fragment>,
    ];
  }

  const listBreadcrumbs: any[] = [
    <Fragment key={`breadcrumbs-root-path`}>
      {hiddenCount > 0 ? (
        <span className="breadcrumb-parents">
          <OverflowMenu label={t("Parent paths")} items={hiddenAncestors} />
        </span>
      ) : (
        <Link
          className="breadcrumb-segment"
          title={bucketName}
          to={`/browser/${encodeURIComponent(bucketName)}`}
          onClick={() => {
            dispatch(setVersionsModeEnabled({ status: false, objectName: "" }));
          }}
        >
          <bdi dir="ltr">{bucketName}</bdi>
        </Link>
      )}
    </Fragment>,
    ...breadcrumbsMap,
    ...versionsItem,
  ];

  const closeAddFolderModal = () => {
    setCreateFolderOpen(false);
  };

  const goBackFunction = () => {
    if (versionsMode) {
      dispatch(setVersionsModeEnabled({ status: false, objectName: "" }));
    } else {
      if (splitPaths.length === 0) {
        navigate(`/browser/${encodeURIComponent(bucketName)}/`);

        return;
      }

      const prevPath = splitPaths.slice(0, -1);

      navigate(
        `/browser/${encodeURIComponent(bucketName)}${
          prevPath.length > 0
            ? `/${encodeURIComponent(`${prevPath.join("/")}/`)}`
            : ""
        }`,
      );
    }
  };

  return (
    <Fragment>
      <BreadcrumbsMain>
        <ModalPresence open={Boolean(createFolderOpen)}>
          {createFolderOpen && (
            <CreatePathModal
              modalOpen={createFolderOpen}
              bucketName={bucketName}
              folderName={internalPaths}
              onClose={closeAddFolderModal}
              limitedSubPath={
                canCreateSubpath &&
                !(
                  hasPermission(
                    [pathToCheckPerms, ...sessionGrantWildCards],
                    putObjectPermScopes,
                  ) || anonymousMode
                )
              }
            />
          )}
        </ModalPresence>
        <Breadcrumbs
          backLabel={t("Back")}
          sx={{
            whiteSpace: "pre",
            border: 0,
            background: "transparent",
            color: "var(--muted-foreground)",
            fontWeight: 400,
            fontSize: "var(--fs-body)",
            "& a": { color: "var(--foreground)" },
            minHeight: 40,
            height: "auto",
            "& .breadcrumbsList": {
              display: "flex",
              alignItems: "center",
              direction: "ltr",
              margin: 0,
              minWidth: 0,
            },
            "& .breadcrumb-segment": {
              flex: "0 1 auto",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
            "@media (max-width: 767px)": {
              "& .breadcrumb-segment": { flex: "1 1 0" },
            },
            "& .breadcrumb-parents, & .slashSpacingStyle": { flexShrink: 0 },
            "& .backButton": {
              border: 0,
              borderRadius: "var(--radius-control)",
              background: "transparent",
              width: 40,
              height: 40,
              flexShrink: 0,
              marginInlineEnd: 4,
            },
          }}
          goBackFunction={goBackFunction}
          additionalOptions={
            <Fragment>
              <CopyToClipboard text={`${bucketName}/${internalPaths}`}>
                <IconButton
                  aria-label={t("Copy path")}
                  id="copy-path"
                  onClick={() =>
                    dispatch(setSnackBarMessage(t("Path copied to clipboard")))
                  }
                >
                  <CopyIcon />
                </IconButton>
              </CopyToClipboard>
            </Fragment>
          }
        >
          <span
            title={`${bucketName}/${internalPaths}`}
            style={{ display: "contents" }}
          >
            {listBreadcrumbs}
          </span>
        </Breadcrumbs>
        <Box className="additionalOptions">{additionalOptions}</Box>
        {!hidePathButton && (
          <Tooltip
            wrapperProps={{ className: "create-path-action" }}
            tooltip={
              canCreatePath
                ? t("Choose or create a new path")
                : permissionTooltipHelper(
                    [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                    i18nKey("create a new path"),
                  )
            }
          >
            <Button
              id={"new-path"}
              onClick={() => {
                setCreateFolderOpen(true);
              }}
              disabled={anonymousMode ? false : rewindEnabled || !canCreatePath}
              icon={<NewPathIcon />}
              style={{
                whiteSpace: "nowrap",
              }}
              variant={"regular"}
              label={t("Create new path")}
            />
          </Tooltip>
        )}
      </BreadcrumbsMain>
    </Fragment>
  );
};

export default BrowserBreadcrumbs;
