// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import { baseUrl } from "../history";

export const SILO_EMBLEM_URL = `${baseUrl}silo.svg`;
export const SILO_WORDMARK_URL = `${baseUrl}silo-word.svg`;

// Brand palette anchored on the silo-word.svg gradient (steel blue → copper).
export const SILO_COLORS = {
  night: "#040A16",
  steel: "#1D588C",
  sky: "#7FB8E8",
  copper: "#E0A35C",
  text: "#EAF2FA",
  muted: "#8FA7C0",
  faint: "#54677F",
} as const;

type SiloBrandProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  variant?: "emblem" | "wordmark";
};

export const SiloBrand = ({
  variant = "wordmark",
  alt = "SILO",
  ...props
}: SiloBrandProps) => (
  <img
    src={variant === "emblem" ? SILO_EMBLEM_URL : SILO_WORDMARK_URL}
    alt={alt}
    {...props}
  />
);
