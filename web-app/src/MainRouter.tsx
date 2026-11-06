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

import React, { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  useLocation,
  useRouteError,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import LoadingComponent from "./common/LoadingComponent";
import Login from "./screens/LoginPage/Login";
import { baseUrl } from "./history";
import { isValidPathname } from "./utils/routePath";
import NotFoundPage from "./screens/NotFoundPage";
import { ShortcutHelpHost } from "./common/ui/ShortcutHelp";
import TaskDepartureGuard from "./screens/Console/Common/ObjectManager/TaskDepartureGuard";
import { trackAcceptedLocation } from "./common/routeRenderPending";
import { syncLanguageCatalogBriefly } from "./store";

const AppConsole = React.lazy(async () => {
  const module = await import("./screens/Console/ConsoleKBar");
  await syncLanguageCatalogBriefly();
  return module;
});
const Logout = React.lazy(() => import("./screens/LogoutPage/LogoutPage"));
const LoginCallback = React.lazy(
  () => import("./screens/LoginPage/LoginCallback"),
);
const SSOLogin = React.lazy(() => import("./screens/LoginPage/SSOLogin"));

const ValidRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  return isValidPathname(location.pathname) ? (
    <>{children}</>
  ) : (
    <NotFoundPage />
  );
};

const AppRoutes = () => {
  return (
    <>
      <TaskDepartureGuard />
      <ShortcutHelpHost />
      <ValidRoute>
        <Routes>
          <Route
            path="/oauth_callback"
            element={
              <Suspense fallback={<LoadingComponent />}>
                <LoginCallback />
              </Suspense>
            }
          />
          <Route
            path="/logout"
            element={
              <Suspense fallback={<LoadingComponent />}>
                <Logout />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<LoadingComponent />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/sso"
            element={
              <Suspense fallback={<LoadingComponent />}>
                <SSOLogin />
              </Suspense>
            }
          />
          <Route
            path={"/*"}
            element={
              <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute Component={AppConsole} />
              </Suspense>
            }
          />
        </Routes>
      </ValidRoute>
    </>
  );
};

// A single public data-router host keeps the existing descendant route tree
// and its lazy boundaries intact, while supporting navigation blockers.
const RethrowRouteError = (): never => {
  throw useRouteError();
};
const router = createBrowserRouter(
  [{ path: "*", element: <AppRoutes />, errorElement: <RethrowRouteError /> }],
  {
    basename: baseUrl,
  },
);
// Subscribed before RouterProvider, so the accepted location is published
// before React starts rendering it in a transition.
trackAcceptedLocation(router);

const MainRouter = () => <RouterProvider router={router} />;

export default MainRouter;
