// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React, { Fragment, Suspense } from "react";
import { Button } from "mds";
import { Route, Routes } from "react-router-dom";
import { IAM_PAGES } from "../../common/SecureComponent/permissions";
import { resetSession } from "../Console/consoleSlice";
import { useAppDispatch } from "../../store";
import { resetSystem } from "../../systemSlice";
import LoadingComponent from "../../common/LoadingComponent";
import ObjectManagerButton from "../Console/Common/ObjectManager/ObjectManagerButton";
import { SiloBrand } from "../../common/SiloBrand";
import { useT } from "i18n";

const ObjectBrowser = React.lazy(
  () => import("../Console/ObjectBrowser/ObjectBrowser"),
);
const ObjectManager = React.lazy(
  () => import("../Console/Common/ObjectManager/ObjectManager"),
);

const AnonymousAccess = () => {
  const t = useT();
  const dispatch = useAppDispatch();

  return (
    <Fragment>
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(16,47,81,1) 0%, rgba(13,28,64,1) 100%)",
          height: 100,
          width: "100%",
          alignItems: "center",
          display: "flex",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div style={{ width: 200, flexShrink: 1 }}>
          <SiloBrand style={{ display: "block", width: "100%", height: 70 }} />
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ flexShrink: 1, display: "flex", flexDirection: "row" }}>
          <Button
            id={"go-to-login"}
            variant={"text"}
            onClick={() => {
              dispatch(resetSession());
              dispatch(resetSystem());
            }}
            sx={{ color: "white", textTransform: "initial" }}
          >
            {t("Login")}
          </Button>
          <ObjectManagerButton />
        </div>
      </div>

      <Suspense fallback={<LoadingComponent />}>
        <ObjectManager />
      </Suspense>
      <Routes>
        <Route
          path={`${IAM_PAGES.OBJECT_BROWSER_VIEW}/*`}
          element={
            <Suspense fallback={<LoadingComponent />}>
              <ObjectBrowser />
            </Suspense>
          }
        />
      </Routes>
    </Fragment>
  );
};
export default AnonymousAccess;
