// Copyright (c) 2026 PGSTY
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { title?: string };

function hasTitle(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) =>
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      (child.type === "title" ||
        (child.type === React.Fragment && hasTitle(child.props.children))),
  );
}

// Geometry is a separately licensed, pinned Lucide subset. Keep it below the
// SVG root so legacy host fill rules cannot turn outlines into solid shapes.
// Stroke inherits from the root, including caller attributes and CSS overrides.
export function createLucideIcon(name: string, geometry: React.ReactNode) {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ className, children, title, role, "aria-hidden": hidden, ...props }, ref) => {
      const named = Boolean(
        props["aria-label"] ||
          props["aria-labelledby"] ||
          title ||
          hasTitle(children) ||
          (role && role !== "none" && role !== "presentation"),
      );
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
          role={role ?? (named ? "img" : undefined)}
          aria-hidden={hidden ?? (named ? undefined : true)}
          data-directional={/^(LucideChevron(Left|Right)|LucideArrow(Left|Right)|LucideLog(Out|In))$/.test(name) || undefined}
          {...props}
          ref={ref}
          className={["min-icon", "lucide-icon", className].filter(Boolean).join(" ")}
        >
          {title && <title>{title}</title>}
          {children}
          <g fill="none">{geometry}</g>
        </svg>
      );
    },
  );
  Icon.displayName = name;
  return Icon;
}
