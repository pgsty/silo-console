// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  DiagnosticSocket,
  DiagnosticSocketOptions,
  openDiagnosticSocket,
} from "../../../../utils/diagnosticSocket";

// Owns at most one diagnostic socket for the component's lifetime. Opening a
// new one closes the previous one, and unmounting closes whatever is open, so
// leaving a page (route change, logout) always stops the server-side work.
export const useDiagnosticSocket = () => {
  const socketRef = useRef<DiagnosticSocket | null>(null);

  const close = useCallback((code?: number) => {
    socketRef.current?.close(code);
    socketRef.current = null;
  }, []);

  const open = useCallback(
    (options: DiagnosticSocketOptions): DiagnosticSocket => {
      close();
      const socket = openDiagnosticSocket(options);
      socketRef.current = socket;
      return socket;
    },
    [close],
  );

  useEffect(() => close, [close]);

  return useMemo(() => ({ open, close }), [open, close]);
};
