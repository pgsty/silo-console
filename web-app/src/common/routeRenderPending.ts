// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";

// The data router accepts a navigation synchronously: the address bar and
// router.state already name the new location when its subscribers run. It then
// renders that location inside React.startTransition, so the committed tree, and
// everything useLocation() returns, keeps showing the previous route until that
// render finishes. On a slow CPU the transition spans several painted frames.
//
// This store mirrors the accepted location key outside the transition. A
// useSyncExternalStore update always renders synchronously, so a component can
// tell in the same task that the URL changed that it is still rendering a route
// the router has already left.

interface AcceptedLocationSource {
  state: { location: { key: string } };
  subscribe: (
    listener: (state: { location: { key: string } }) => void,
  ) => () => void;
}

let acceptedKey: string | null = null;
const listeners = new Set<() => void>();

const accept = (key: string) => {
  if (key === acceptedKey) return;
  acceptedKey = key;
  listeners.forEach((listener) => listener());
};

/** Follow the app's data router; call once where the router is created. */
export const trackAcceptedLocation = (router: AcceptedLocationSource) => {
  accept(router.state.location.key);
  return router.subscribe((state) => accept(state.location.key));
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const snapshot = () => acceptedKey;

/**
 * True while the router has accepted a location that this component's committed
 * route has not rendered yet. Content scoped to the rendered route must not be
 * actionable then: the URL already names another route.
 */
export const useRouteRenderPending = (): boolean => {
  const { key } = useLocation();
  const accepted = useSyncExternalStore(subscribe, snapshot, snapshot);
  return accepted !== null && accepted !== key;
};
