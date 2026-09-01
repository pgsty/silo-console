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

import request from "superagent";
import get from "lodash/get";
import { ErrorResponseHandler } from "../types";
import {
  isInvalidSessionResponse,
  isSessionProbe,
} from "../../api/sessionExpiry";
import { expireSession } from "../../api/session";

type RequestHeaders = { [name: string]: string };

export class API {
  invoke(method: string, url: string, data?: object, headers?: RequestHeaders) {
    let targetURL = url;
    if (targetURL[0] === "/") {
      targetURL = targetURL.slice(1);
    }
    let req = request(method, targetURL);

    if (headers) {
      for (let k in headers) {
        req.set(k, headers[k]);
      }
    }

    return req
      .send(data)
      .then((res) => res.body)
      .catch((err) => {
        // An invalid session ends the session the same way for every client,
        // whatever the login method was; login and session-probe calls are
        // never an expiry, and anonymous browsing has no session to end (the
        // handler then declines and the error reaches the caller as usual).
        if (
          !isSessionProbe(targetURL) &&
          isInvalidSessionResponse(
            err.status,
            get(err, "response.body.message"),
          ) &&
          expireSession()
        ) {
          return;
        }

        return this.onError(err);
      });
  }

  onError(err: any) {
    if (err.status) {
      const errMessage = get(
        err.response,
        "body.message",
        `Error ${err.status.toString()}`,
      );

      let detailedMessage = get(err.response, "body.detailedMessage", "");

      if (errMessage === detailedMessage) {
        detailedMessage = "";
      }

      const capMessage =
        errMessage.charAt(0).toUpperCase() + errMessage.slice(1);
      const capDetailed =
        detailedMessage.charAt(0).toUpperCase() + detailedMessage.slice(1);

      const throwMessage: ErrorResponseHandler = {
        errorMessage: capMessage,
        detailedError: capDetailed,
        statusCode: err.status,
      };

      return Promise.reject(throwMessage);
    } else {
      // No HTTP status: the request never reached Console. The session is
      // ended through the shared path so the route is remembered.
      expireSession();
    }
  }
}

const api = new API();
export default api;
