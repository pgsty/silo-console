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

// The transfer manager holds the in-flight downloads (their request objects)
// and the queued or running uploads (a control that can send or cancel them)
// by transfer id, and forgets a transfer as soon as it settles.

// UploadControl drives one upload independently of XMLHttpRequest events: a
// queued request that was never sent emits no `abort` event, so cancelling
// has to settle the upload explicitly, and a synchronous `send()` failure
// has to settle it as an error. `send` reports whether the request is now in
// flight, which is the only case the scheduler may count as running.
export interface UploadControl {
  send: () => boolean;
  cancel: () => void;
}

let objectCalls: { [key: string]: XMLHttpRequest } = {};
let uploadControls: { [key: string]: UploadControl } = {};

export const storeCallForObjectWithID = (id: string, call: any) => {
  objectCalls[id] = call;
};

export const callForObjectID = (id: string): any => {
  return objectCalls[id];
};

export const storeUploadControl = (id: string, control: UploadControl) => {
  uploadControls[id] = control;
};

// startQueuedUpload sends a queued upload and reports whether its request is
// now in flight. False means there is nothing to account for: the upload is
// no longer known (it settled, for instance cancelled, before its turn came)
// or its send failed synchronously and settled it as an error.
export const startQueuedUpload = (id: string): boolean => {
  const control = uploadControls[id];
  if (!control) {
    return false;
  }
  return control.send();
};

// cancelTransfer cancels an upload or a download in whatever state it is in.
// Uploads settle through their control; downloads abort their request, which
// settles them through their own handlers.
export const cancelTransfer = (id: string): boolean => {
  const control = uploadControls[id];
  if (control) {
    control.cancel();
    return true;
  }
  const call = objectCalls[id];
  if (call) {
    call.abort();
    return true;
  }
  return false;
};

export const removeTrace = (id: string) => {
  delete objectCalls[id];
  delete uploadControls[id];
};

export const makeid = (length: number) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
