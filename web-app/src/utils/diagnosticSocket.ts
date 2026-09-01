// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// One diagnostic WebSocket session (logs, profiling, health report). The
// session owns the socket and its heartbeat timer, delivers events only while
// it is open, and closes idempotently. Closing locally detaches every handler
// first, so a component that has unmounted is never called back, and the
// server sees the close and stops the diagnostic it was running.

export interface DiagnosticSocketLike {
  onopen: ((event: Event) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
  send(data: string): void;
  close(code?: number, reason?: string): void;
}

interface DiagnosticTimers {
  setInterval: (handler: () => void, ms: number) => unknown;
  clearInterval: (handle: unknown) => void;
}

export interface DiagnosticSocketOptions {
  url: string;
  // Sent as soon as the socket opens; every diagnostic endpoint expects one.
  openMessage?: string;
  // Re-sends openMessage every heartbeatMs while open; 0 disables it.
  heartbeatMs?: number;
  onOpen?: () => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  // The server or the network closed the socket. Never fires after close().
  onClose?: (event: CloseEvent) => void;
  connect?: (url: string) => DiagnosticSocketLike;
  timers?: DiagnosticTimers;
}

export interface DiagnosticSocket {
  // Idempotent: detaches handlers, stops the heartbeat, closes the socket.
  close(code?: number): void;
  isClosed(): boolean;
}

const browserConnect = (url: string): DiagnosticSocketLike =>
  new WebSocket(url);

const browserTimers: DiagnosticTimers = {
  setInterval: (handler, ms) => setInterval(handler, ms),
  clearInterval: (handle) => clearInterval(handle as number),
};

export const openDiagnosticSocket = (
  options: DiagnosticSocketOptions,
): DiagnosticSocket => {
  const timers = options.timers ?? browserTimers;
  const socket = (options.connect ?? browserConnect)(options.url);
  let closed = false;
  let heartbeat: unknown = null;

  const stopHeartbeat = () => {
    if (heartbeat !== null) {
      timers.clearInterval(heartbeat);
      heartbeat = null;
    }
  };

  const detach = () => {
    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;
  };

  socket.onopen = () => {
    if (closed) {
      return;
    }
    if (options.openMessage !== undefined) {
      socket.send(options.openMessage);
      if (options.heartbeatMs && options.heartbeatMs > 0) {
        const message = options.openMessage;
        heartbeat = timers.setInterval(() => {
          if (!closed) {
            socket.send(message);
          }
        }, options.heartbeatMs);
      }
    }
    options.onOpen?.();
  };

  socket.onmessage = (event) => {
    if (!closed) {
      options.onMessage?.(event);
    }
  };

  socket.onerror = (event) => {
    if (!closed) {
      options.onError?.(event);
    }
  };

  socket.onclose = (event) => {
    if (closed) {
      return;
    }
    closed = true;
    stopHeartbeat();
    detach();
    options.onClose?.(event);
  };

  return {
    close: (code = 1000) => {
      if (closed) {
        return;
      }
      closed = true;
      stopHeartbeat();
      detach();
      try {
        socket.close(code);
      } catch {
        // A socket that never connected may refuse a close code; it is
        // closed either way.
      }
    },
    isClosed: () => closed,
  };
};
