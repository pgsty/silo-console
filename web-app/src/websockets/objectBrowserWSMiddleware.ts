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

import get from "lodash/get.js";
import { Middleware } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { wsProtocol } from "../utils/wsUtils";
import {
  commitObjectPage,
  errorInConnection,
  resetObjectListing,
  setReloadObjectsList,
  setRequestInProgress,
  setSelectedBucket,
  setSelectedObjects,
  setSimplePathHandler,
} from "../screens/Console/ObjectBrowser/objectBrowserSlice";
import {
  BucketObjectItem,
  WebsocketRequest,
  WebsocketResponse,
} from "../screens/Console/Buckets/ListBuckets/Objects/ListObjects/types";
import {
  applyListingFrame,
  ListingIdentity,
  ObjectListingRequest,
  ObjectPageRequest,
  PendingListing,
  planListingRequest,
} from "../screens/Console/ObjectBrowser/objectPaging";
import { permissionItems } from "../screens/Console/Buckets/ListBuckets/Objects/permissionItems";
import { setErrorSnackMessage } from "../systemSlice";
import { getStoredLanguage, translate } from "../i18n/lang";
import { expireSession } from "../api/session";

// WebSocket.readyState values, named here so the module reads no global at
// load time.
const SOCKET_CONNECTING = 0;
const SOCKET_OPEN = 1;

// A listing request as planned against the store: the frame to send, once a
// socket is open, and what the frame was planned from.
interface PlannedListing {
  payload: ObjectListingRequest;
  request: ObjectPageRequest;
}

export const objectBrowserWSMiddleware = (
  initialSocket?: WebSocket,
): Middleware<{}, AppState> => {
  // Connection and request state belong to one middleware instance.
  let objectsWS: WebSocket | undefined = initialSocket;
  let wsInFlight: boolean = false;
  let currentRequestID: number = 0;
  // The page of the request in flight. Its rows are buffered here until the
  // request ends successfully; only then do they reach the store, together
  // with the cursor state, so an error, a cancellation or a lost socket
  // leaves the committed page untouched. Frames for any other request id are
  // stale.
  let pending: PendingListing<BucketObjectItem> | null = null;
  // The listing behind the pending request, kept so a socket that closes
  // mid-page can queue that page again.
  let sent: PlannedListing | null = null;
  // The newest listing waiting for an open socket. A later request replaces
  // it and a cancel drops it; it is sent by the socket that opens, never by a
  // timer, so a request for a directory the user has left cannot revive.
  let queued: PlannedListing | null = null;
  // The listing the store's rows and cursors belong to.
  let listingIdentity: ListingIdentity | null = null;

  const forgetRequests = () => {
    pending = null;
    sent = null;
    queued = null;
  };

  return (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const storeState = storeApi.getState();

    // sendListing sends one planned listing on the open socket as the current
    // request; every frame that follows is matched against its id.
    const sendListing = (listing: PlannedListing) => {
      if (!objectsWS || objectsWS.readyState !== SOCKET_OPEN) {
        queued = listing;
        return;
      }
      const requestId = currentRequestID + 1;
      const { payload, request } = listing;
      const frame: WebsocketRequest = {
        bucket_name: payload.bucketName,
        prefix: payload.path,
        mode: payload.rewindMode ? "rewind" : "objects",
        date: payload.date,
        request_id: requestId,
      };
      if (!payload.rewindMode) {
        frame.page_size = request.pageSize;
        if (request.token !== "") {
          frame.continuation_token = request.token;
        }
      }
      try {
        objectsWS.send(JSON.stringify(frame));
      } catch (e) {
        // The socket is going away; its close hands the listing to the next
        // socket.
        console.error(e);
        queued = listing;
        return;
      }
      currentRequestID = requestId;
      pending = { requestId, request, records: [], failed: false };
      sent = listing;
    };

    const { type } = action;
    switch (type) {
      case "socket/OBConnect": {
        const sessionInitialized = get(storeState, "system.loggedIn", false);

        // One socket at a time: nothing is opened while another is
        // connecting or open, whichever timer or request asked.
        const connecting =
          wsInFlight ||
          (objectsWS !== undefined &&
            (objectsWS.readyState === SOCKET_CONNECTING ||
              objectsWS.readyState === SOCKET_OPEN));
        if (connecting || !sessionInitialized) {
          return;
        }

        wsInFlight = true;

        const url = new URL(window.location.toString());
        const isDev = process.env.NODE_ENV === "development";
        const port = isDev ? "9090" : url.port;

        // check if we are using base path, if not this always is `/`
        const baseLocation = new URL(document.baseURI);
        const baseUrl = baseLocation.pathname;

        const wsProt = wsProtocol(url.protocol);

        const socket = new WebSocket(
          `${wsProt}://${url.hostname}:${port}${baseUrl}ws/objectManager`,
        );
        objectsWS = socket;

        // Every callback acts only while this socket is the current one; a
        // socket that has been replaced must not touch the request state.
        socket.onopen = () => {
          if (socket !== objectsWS) {
            return;
          }
          wsInFlight = false;
          if (queued !== null) {
            const listing = queued;
            queued = null;
            sendListing(listing);
          }
        };

        socket.onmessage = (message) => {
          if (socket !== objectsWS) {
            return;
          }
          const response: WebsocketResponse = JSON.parse(
            message.data.toString(),
          );
          const applied = applyListingFrame(pending, response);
          pending = applied.pending;
          if (pending === null) {
            sent = null;
          }
          const outcome = applied.outcome;

          if (outcome.kind === "stale" || outcome.kind === "buffered") {
            return;
          }
          if (outcome.kind === "committed") {
            dispatch(
              commitObjectPage({
                records: outcome.records,
                commit: outcome.commit,
              }),
            );
            return;
          }
          if (outcome.kind === "ended") {
            // The end of a failed request; the previous page stays.
            dispatch(setRequestInProgress(false));
            return;
          }

          // The request failed. Its buffered rows are never shown.
          const failed = applied.pending;
          const error = response.error;
          if (!failed || !error) {
            return;
          }
          const lang = getStoredLanguage();
          const basicErrorMessage = {
            errorMessage: translate(lang, "An error occurred"),
            detailedMessage: translate(
              lang,
              "An unknown error occurred. Please refer to Console logs to get more information.",
            ),
          };

          if (error.Code === 401) {
            // Session expired: same path as the REST clients. When there is
            // no session to end (anonymous browsing) the page is reloaded
            // so access to the bucket is evaluated afresh, as before.
            forgetRequests();
            if (!expireSession()) {
              window.location.reload();
            }
            return;
          }
          if (error.Code === 403) {
            // The permissions are read from the store as it is now, not as
            // it was when the socket was opened.
            const current = storeApi.getState();
            const allowResources = get(
              current,
              "console.session.allowResources",
              null,
            );
            const selectedBucket = get(
              current,
              "objectBrowser.selectedBucket",
              "",
            );
            const internalPathsPrefix = response.prefix;
            let pathPrefix = "";

            if (internalPathsPrefix) {
              pathPrefix = internalPathsPrefix.endsWith("/")
                ? internalPathsPrefix
                : internalPathsPrefix + "/";
            }

            const permitItems = permissionItems(
              response.bucketName || selectedBucket,
              pathPrefix,
              allowResources || [],
            );

            if (permitItems && permitItems.length > 0) {
              // The rows are synthesized from the session's permissions, not
              // listed from S3: a single page with no cursor that is never a
              // complete directory. The request_end that follows is stale.
              forgetRequests();
              dispatch(
                commitObjectPage({
                  records: permitItems,
                  commit: {
                    pageSize: failed.request.pageSize,
                    pageIndex: 0,
                    token: "",
                    nextToken: "",
                    truncated: false,
                    synthesized: true,
                  },
                }),
              );
              return;
            }
          }

          const errorMsg = error.APIError;
          dispatch(setRequestInProgress(false));
          dispatch(
            setErrorSnackMessage({
              errorMessage: errorMsg.message || basicErrorMessage.errorMessage,
              detailedError:
                errorMsg.detailedMessage || basicErrorMessage.detailedMessage,
            }),
          );
        };

        socket.onclose = () => {
          if (socket !== objectsWS) {
            return;
          }
          wsInFlight = false;
          console.warn("Websocket Disconnected. Attempting Reconnection...");

          // A page in flight will never end on this socket. It is queued
          // again and sent by the socket that comes up, while the committed
          // page stays on screen; nothing is shown as complete meanwhile.
          if (pending !== null) {
            if (queued === null) {
              queued = sent;
            }
            pending = null;
            sent = null;
          }

          // We reconnect after 3 seconds
          setTimeout(() => dispatch({ type: "socket/OBConnect" }), 3000);
        };

        socket.onerror = () => {
          if (socket !== objectsWS) {
            return;
          }
          wsInFlight = false;
          console.error(
            "Error in websocket connection. Attempting reconnection...",
          );
          // Onclose will be triggered by specification, reconnect function will be executed there to avoid duplicated requests
        };

        break;
      }

      case "socket/OBRequest": {
        const dataPayload = action.payload as ObjectListingRequest;
        const identity: ListingIdentity = {
          bucketName: dataPayload.bucketName,
          path: dataPayload.path,
          rewindMode: dataPayload.rewindMode,
          date: dataPayload.date,
        };
        const plan = planListingRequest(
          storeState.objectBrowser.objectPage,
          listingIdentity,
          identity,
          dataPayload.page,
        );
        listingIdentity = identity;
        // Whatever was sent or queued before is obsolete, connected or not.
        forgetRequests();

        // Another listing: its rows and cursors leave the screen now, before
        // any frame of the new one and whether or not a socket is open. A
        // page or a refresh of the same listing keeps the committed page
        // until the new page has arrived in full.
        if (plan.clearListing) {
          dispatch(resetObjectListing({ clearFilter: plan.clearFilter }));
        }
        dispatch(errorInConnection(false));
        dispatch(setSimplePathHandler(dataPayload.path));
        dispatch(setSelectedBucket(dataPayload.bucketName));
        dispatch(setRequestInProgress(true));
        dispatch(setReloadObjectsList(false));
        // A selection belongs to one page; every request starts a new one.
        dispatch(setSelectedObjects([]));

        const listing: PlannedListing = {
          payload: dataPayload,
          request: plan.request,
        };
        if (objectsWS && objectsWS.readyState === SOCKET_OPEN) {
          sendListing(listing);
        } else {
          // The socket that opens sends the newest queued listing; a
          // connection is started unless one is already on its way.
          queued = listing;
          dispatch({ type: "socket/OBConnect" });
        }

        break;
      }
      case "socket/OBCancelLast": {
        // Nothing of a canceled request is shown or sent, whatever still
        // arrives, and nothing is loading any more: the request that follows
        // a cancel raises the flag again itself.
        if (pending !== null || queued !== null) {
          forgetRequests();
          dispatch(setRequestInProgress(false));
        }
        // There is nothing to cancel before the first request was issued.
        if (
          currentRequestID > 0 &&
          objectsWS &&
          objectsWS.readyState === SOCKET_OPEN
        ) {
          const request: WebsocketRequest = {
            mode: "cancel",
            request_id: currentRequestID,
          };
          objectsWS.send(JSON.stringify(request));
        }
        break;
      }
      case "socket/OBDisconnect":
        forgetRequests();
        if (objectsWS) {
          objectsWS.close();
        }
        break;

      default:
        break;
    }
    return next(action);
  };
};
