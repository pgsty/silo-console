// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import * as React from "react";
import { SVGProps } from "react";

// "文/A" language toggle glyph, drawn as strokes (no <text>, so rendering is
// font-independent). fill lives on the group: mds Button and the login header
// both inject `fill` via CSS on the svg root, which would flood stroke shapes;
// an element-level attribute below the root keeps them outline-only while
// stroke follows the injected `color`. Glyphs fill the viewBox edge-to-edge so
// the icon reads as large as its neighbors at 15px.
const LanguageToggleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`min-icon`}
    fill={"none"}
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 文 — upper left: dot, bar, crossing sweeps */}
      <path d="M7.1 1.2v2.2" />
      <path d="M1.6 5.1h11" />
      <path d="M10.3 5.4c-1.1 4.1-4 7.2-8.4 9" />
      <path d="M3.9 5.4c1.1 4.1 4 7.2 8.4 9" />
      {/* A — lower right: legs and crossbar */}
      <path d="M12.6 22.8l4.55-12.4 4.55 12.4" />
      <path d="M14.35 18.1h5.6" />
    </g>
  </svg>
);

export default LanguageToggleIcon;
