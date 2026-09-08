// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Harness page for the Object Manager middleware: the real middleware and the
// real objectBrowser reducer run in a real browser, with a scripted socket in
// place of the WebSocket global. The test drives it through window.__obHarness
// and reads store snapshots back; nothing here asserts.

import { configureStore, Middleware, Reducer } from "@reduxjs/toolkit";
import objectBrowserReducer from "../../src/screens/Console/ObjectBrowser/objectBrowserSlice";
import { objectBrowserWSMiddleware } from "../../src/websockets/objectBrowserWSMiddleware";
import type { PermissionResource } from "../../src/api/consoleApi";
import type { ObjectPageState } from "../../src/screens/Console/ObjectBrowser/objectPaging";

// Sockets belong to the store generation that opened them, so a reconnect
// timer of an earlier scenario's store cannot show up in a later scenario.
let generation = 0;

class FakeSocket {
  static all: FakeSocket[] = [];
  readonly generation = generation;
  readyState = 0;
  sent: unknown[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(public url: string) {
    FakeSocket.all.push(this);
  }

  send(payload: string) {
    if (this.readyState !== 1) {
      throw new Error("socket is not open");
    }
    this.sent.push(JSON.parse(payload));
  }

  close() {
    this.drop();
  }

  open() {
    this.readyState = 1;
    this.onopen?.();
  }

  receive(frame: unknown) {
    this.onmessage?.({ data: JSON.stringify(frame) });
  }

  drop() {
    if (this.readyState === 3) {
      return;
    }
    this.readyState = 3;
    this.onclose?.();
  }
}

window.WebSocket = FakeSocket as unknown as typeof WebSocket;

// The real objectBrowser reducer with just enough of the system and console
// state the middleware reads. The allowed resources can change after a socket
// was opened, which is what the 403 fallback must follow.
const makeStore = (allowResources: PermissionResource[]) => {
  const consoleReducer: Reducer = (
    state = { session: { allowResources } },
    action,
  ) =>
    action.type === "harness/allowResources"
      ? { session: { allowResources: action.payload } }
      : state;
  const systemReducer: Reducer = (
    state = { loggedIn: true, anonymousMode: false, language: "en" },
  ) => state;
  return configureStore({
    reducer: {
      objectBrowser: objectBrowserReducer,
      system: systemReducer,
      console: consoleReducer,
    },
    middleware: (getDefault) =>
      getDefault({ serializableCheck: false, immutableCheck: false }).concat(
        objectBrowserWSMiddleware() as Middleware,
      ),
  });
};

let store = makeStore([]);

export interface HarnessSnapshot {
  records: string[];
  objectPage: ObjectPageState;
  requestInProgress: boolean;
  simplePath: string | null;
  selectedBucket: string;
  searchObjects: string;
  selectedObjects: string[];
}

export interface HarnessSocket {
  readyState: number;
  sent: unknown[];
}

export interface HarnessApi {
  // A fresh store and socket generation for the next scenario.
  reset: (allowResources?: PermissionResource[]) => number;
  dispatch: (action: { type: string; payload?: unknown }) => HarnessSnapshot;
  state: () => HarnessSnapshot;
  sockets: () => HarnessSocket[];
  open: (index: number) => HarnessSnapshot;
  drop: (index: number) => HarnessSnapshot;
  receive: (index: number, frame: unknown) => HarnessSnapshot;
  // Fires a callback of a socket directly, whether or not it is still the
  // current one, as a browser would for a socket that was replaced.
  fire: (index: number, event: "open" | "close") => HarnessSnapshot;
  setAllowResources: (resources: PermissionResource[]) => HarnessSnapshot;
}

const snapshot = (): HarnessSnapshot => {
  const state = store.getState().objectBrowser;
  return {
    records: state.records.map((record) => record.name),
    objectPage: state.objectPage,
    requestInProgress: state.requestInProgress,
    simplePath: state.simplePath,
    selectedBucket: state.selectedBucket,
    searchObjects: state.searchObjects,
    selectedObjects: state.selectedObjects,
  };
};

const sockets = () =>
  FakeSocket.all.filter((socket) => socket.generation === generation);

const socketAt = (index: number): FakeSocket => {
  const socket = sockets()[index];
  if (!socket) {
    throw new Error(`no socket ${index} in generation ${generation}`);
  }
  return socket;
};

const harness: HarnessApi = {
  reset: (allowResources = []) => {
    generation += 1;
    store = makeStore(allowResources);
    return generation;
  },
  dispatch: (action) => {
    store.dispatch(action);
    return snapshot();
  },
  state: snapshot,
  sockets: () =>
    sockets().map((socket) => ({
      readyState: socket.readyState,
      sent: socket.sent,
    })),
  open: (index) => {
    socketAt(index).open();
    return snapshot();
  },
  drop: (index) => {
    socketAt(index).drop();
    return snapshot();
  },
  receive: (index, frame) => {
    socketAt(index).receive(frame);
    return snapshot();
  },
  fire: (index, event) => {
    const socket = socketAt(index);
    if (event === "open") {
      socket.onopen?.();
    } else {
      socket.onclose?.();
    }
    return snapshot();
  },
  setAllowResources: (resources) => {
    store.dispatch({ type: "harness/allowResources", payload: resources });
    return snapshot();
  },
};

declare global {
  interface Window {
    __obHarness: HarnessApi;
  }
}

window.__obHarness = harness;
