//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
import * as React from "react";
import { Fragment, useEffect } from "react";
import { KBarProvider, useKBar, useRegisterActions, VisualState } from "kbar";
import Console from "./Console";
import { useSelector } from "react-redux";
import CommandBar from "./CommandBar";
import { selFeatures } from "./consoleSlice";
import TrafficMonitor from "./Common/ObjectManager/TrafficMonitor";
import { AppState } from "../../store";
import AnonymousAccess from "../AnonymousAccess/AnonymousAccess";
import { registerScreenLoader, registerScreenTranslations } from "i18n/lang";
import { zhScreens } from "i18n/zhScreens";

registerScreenTranslations(zhScreens);
registerScreenLoader(() =>
  import("i18n/ptScreens").then((module) => module.ptScreens),
);

import { useNavigate } from "react-router-dom";
import { useLanguage, useT } from "i18n";
import { useRouteContext } from "../../navigation/useRouteContext";
import { routesAsKbarActions } from "./kbar-actions";
import { hasCreateBucketPermission } from "../../common/SecureComponent/createBucketPermission";
import {
  useRecentBuckets,
  RecentBucketsProvider,
} from "../../navigation/RecentBucketsProvider";

// Keep route registration with the authenticated shell. CommandBar owns the
// shared modal gate and presentation, including when mounted in isolation.
const NavigationActions = () => {
  const context = useRouteContext();
  const { recent, refresh } = useRecentBuckets();
  const navigate = useNavigate();
  const t = useT();
  const language = useLanguage();
  const canCreate = useSelector((state: AppState) =>
    hasCreateBucketPermission(state.console.session?.permissions),
  );
  const { visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }));
  useEffect(() => {
    if (visualState === VisualState.showing) refresh();
  }, [visualState, refresh]);
  useRegisterActions(
    routesAsKbarActions(recent, navigate, context, t, canCreate),
    [recent, context, language, canCreate],
  );
  return null;
};

const ConsoleKBar = () => (
  <RecentBucketsProvider>
    <ConsoleContent />
  </RecentBucketsProvider>
);

const ConsoleContent = () => {
  const features = useSelector(selFeatures);
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );

  // if we are hiding the menu also disable the k-bar so just return console
  if (features?.includes("hide-menu")) {
    return (
      <Fragment>
        <TrafficMonitor />
        <Console />
      </Fragment>
    );
  }
  // for anonymous mode, we don't load Console, only AnonymousAccess
  if (anonymousMode) {
    return (
      <Fragment>
        <TrafficMonitor />
        <AnonymousAccess />
      </Fragment>
    );
  }

  return (
    <KBarProvider
      options={{
        enableHistory: true,
        animations: {
          enterMs:
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--dur-fast",
              ),
            ) || 80,
          exitMs:
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--dur-fast-exit",
              ),
            ) || 60,
        },
      }}
    >
      <TrafficMonitor />
      <NavigationActions />
      <CommandBar />
      <Console />
    </KBarProvider>
  );
};

export default ConsoleKBar;
