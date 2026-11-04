// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useLayoutEffect, useRef } from "react";

// Object-scoped content belongs to the route that rendered it. While the router
// has accepted another location that has not rendered yet (see
// useRouteRenderPending), the content stays mounted, so its state survives, but
// it is hidden and inert in the same commit, before the browser can paint a
// frame that shows it as actionable for a route the URL no longer names.
const RouteBoundContent = ({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) => {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (root.current) root.current.inert = pending;
  }, [pending]);
  return (
    <div
      ref={root}
      aria-busy={pending || undefined}
      style={{
        display: "contents",
        visibility: pending ? "hidden" : undefined,
      }}
    >
      {children}
    </div>
  );
};

export default RouteBoundContent;
