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

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { loadLanguage } from "./i18n/lang";
import systemReducer, { languageCatalogLoaded } from "./systemSlice";
import loginReducer from "./screens/LoginPage/loginSlice";
import traceReducer from "./screens/Console/Trace/traceSlice";
import logReducer from "./screens/Console/Logs/logsSlice";
import healthInfoReducer from "./screens/Console/HealthInfo/healthInfoSlice";
import watchReducer from "./screens/Console/Watch/watchSlice";
import consoleReducer from "./screens/Console/consoleSlice";
import addBucketsReducer from "./screens/Console/Buckets/ListBuckets/AddBucket/addBucketsSlice";
import bucketDetailsReducer from "./screens/Console/Buckets/BucketDetails/bucketDetailsSlice";
import objectBrowserReducer from "./screens/Console/ObjectBrowser/objectBrowserSlice";
import dashboardReducer from "./screens/Console/Dashboard/dashboardSlice";
import createUserReducer from "./screens/Console/Users/AddUsersSlice";
import destinationSlice from "./screens/Console/EventDestinations/destinationsSlice";
import { objectBrowserWSMiddleware } from "./websockets/objectBrowserWSMiddleware";
import { taskMiddleware } from "./screens/Console/Common/ObjectManager/taskMiddleware";

var objectsWS: WebSocket;

const rootReducer = combineReducers({
  system: systemReducer,
  login: loginReducer,
  trace: traceReducer,
  logs: logReducer,
  watch: watchReducer,
  console: consoleReducer,
  addBucket: addBucketsReducer,
  bucketDetails: bucketDetailsReducer,
  objectBrowser: objectBrowserReducer,
  healthInfo: healthInfoReducer,
  dashboard: dashboardReducer,
  createUser: createUserReducer,
  destination: destinationSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      taskMiddleware,
      objectBrowserWSMiddleware(objectsWS),
    ),
});

const LANGUAGE_WAIT_MS = 1500;

const syncLanguageCatalog = () =>
  loadLanguage(store.getState().system.language).then(
    (changed) => {
      if (changed) {
        store.dispatch(languageCatalogLoaded());
      }
    },
    () => undefined,
  );

// First paint waits briefly to avoid an English flash, but a stalled download
// must not hold back login or the Console: the late catalogue re-renders them.
export const syncLanguageCatalogBriefly = () =>
  Promise.race([
    syncLanguageCatalog(),
    new Promise((resolve) => setTimeout(resolve, LANGUAGE_WAIT_MS)),
  ]);

let syncedLanguage = store.getState().system.language;
store.subscribe(() => {
  const { language } = store.getState().system;
  if (language !== syncedLanguage) {
    syncedLanguage = language;
    void syncLanguageCatalog();
  }
});

if (process.env.NODE_ENV !== "production" && import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      store.replaceReducer(newModule.rootReducer);
    }
  });
}

export type AppState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
