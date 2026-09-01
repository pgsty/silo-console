// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  DiagnosticSocketLike,
  openDiagnosticSocket,
} from "../src/utils/diagnosticSocket";
import {
  MAX_LOG_MESSAGES,
  trimToNewest,
} from "../src/screens/Console/Logs/logBuffer";

class FakeSocket implements DiagnosticSocketLike {
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  sent: string[] = [];
  closeCalls: Array<number | undefined> = [];
  throwOnClose = false;

  send(data: string) {
    this.sent.push(data);
  }

  close(code?: number) {
    this.closeCalls.push(code);
    if (this.throwOnClose) {
      throw new Error("InvalidAccessError");
    }
  }

  open() {
    this.onopen?.({} as Event);
  }

  message(data: string) {
    this.onmessage?.({ data } as MessageEvent);
  }

  error() {
    this.onerror?.({} as Event);
  }

  serverClose(code: number) {
    this.onclose?.({ code } as CloseEvent);
  }
}

class FakeTimers {
  intervals = new Map<number, { handler: () => void; ms: number }>();
  private next = 1;
  setInterval = (handler: () => void, ms: number) => {
    const id = this.next++;
    this.intervals.set(id, { handler, ms });
    return id;
  };
  clearInterval = (handle: unknown) => {
    this.intervals.delete(handle as number);
  };
  tick() {
    for (const { handler } of this.intervals.values()) {
      handler();
    }
  }
}

const setup = (
  overrides: { heartbeatMs?: number; openMessage?: string } = {},
) => {
  const socket = new FakeSocket();
  const timers = new FakeTimers();
  const events: string[] = [];
  const session = openDiagnosticSocket({
    url: "ws://console/ws/console/",
    openMessage: "openMessage" in overrides ? overrides.openMessage : "ok",
    heartbeatMs: overrides.heartbeatMs ?? 10_000,
    connect: (url) => {
      events.push(`connect:${url}`);
      return socket;
    },
    timers,
    onOpen: () => events.push("open"),
    onMessage: (event) => events.push(`message:${event.data}`),
    onError: () => events.push("error"),
    onClose: (event) => events.push(`close:${event.code}`),
  });
  return { events, session, socket, timers };
};

test.describe("diagnostic socket session", () => {
  test("sends the open message, heartbeats while open and delivers events", () => {
    const { events, socket, timers } = setup();
    socket.open();
    expect(socket.sent).toEqual(["ok"]);
    expect(timers.intervals.size).toBe(1);
    expect([...timers.intervals.values()][0].ms).toBe(10_000);
    timers.tick();
    timers.tick();
    expect(socket.sent).toEqual(["ok", "ok", "ok"]);
    socket.message("line");
    socket.error();
    expect(events).toEqual([
      "connect:ws://console/ws/console/",
      "open",
      "message:line",
      "error",
    ]);
  });

  test("a local close stops the heartbeat, closes the socket once and silences every later event", () => {
    const { events, session, socket, timers } = setup();
    socket.open();
    session.close(1000);
    session.close(1000);
    expect(session.isClosed()).toBe(true);
    expect(socket.closeCalls).toEqual([1000]);
    expect(timers.intervals.size).toBe(0);
    expect(socket.onclose).toBeNull();
    expect(socket.onmessage).toBeNull();
    // A browser still dispatches close after close(); nothing may reach the
    // (possibly unmounted) owner.
    socket.serverClose(1000);
    socket.message("late");
    timers.tick();
    expect(events).toEqual(["connect:ws://console/ws/console/", "open"]);
    expect(socket.sent).toEqual(["ok"]);
  });

  test("a server close fires onClose once and stops the heartbeat", () => {
    const { events, session, socket, timers } = setup();
    socket.open();
    socket.serverClose(1011);
    socket.serverClose(1011);
    expect(events).toEqual([
      "connect:ws://console/ws/console/",
      "open",
      "close:1011",
    ]);
    expect(timers.intervals.size).toBe(0);
    expect(session.isClosed()).toBe(true);
    session.close();
    expect(socket.closeCalls).toEqual([]);
  });

  test("closing before the socket opened prevents the open callback and the heartbeat", () => {
    const { events, session, socket, timers } = setup();
    session.close();
    socket.open();
    expect(events).toEqual(["connect:ws://console/ws/console/"]);
    expect(socket.sent).toEqual([]);
    expect(timers.intervals.size).toBe(0);
  });

  test("a socket that refuses to close is still treated as closed", () => {
    const { session, socket } = setup();
    socket.throwOnClose = true;
    expect(() => session.close()).not.toThrow();
    expect(session.isClosed()).toBe(true);
  });

  test("no heartbeat without an interval, no open message without one", () => {
    const once = setup({ heartbeatMs: 0 });
    once.socket.open();
    expect(once.socket.sent).toEqual(["ok"]);
    expect(once.timers.intervals.size).toBe(0);

    const silent = setup({ openMessage: undefined });
    silent.socket.open();
    expect(silent.socket.sent).toEqual([]);
    expect(silent.timers.intervals.size).toBe(0);
  });
});

test.describe("log buffer", () => {
  test("keeps only the newest MAX_LOG_MESSAGES entries", () => {
    const messages: string[] = [];
    for (let i = 0; i < MAX_LOG_MESSAGES + 25; i++) {
      messages.push(`line ${i}`);
      trimToNewest(messages, MAX_LOG_MESSAGES);
    }
    expect(messages).toHaveLength(MAX_LOG_MESSAGES);
    expect(messages[0]).toBe("line 25");
    expect(messages[MAX_LOG_MESSAGES - 1]).toBe(
      `line ${MAX_LOG_MESSAGES + 24}`,
    );
  });

  test("leaves short buffers and non-positive limits alone", () => {
    const short = ["a", "b"];
    expect(trimToNewest(short, 5)).toEqual(["a", "b"]);
    expect(trimToNewest(["a", "b", "c"], 0)).toEqual(["a", "b", "c"]);
  });
});
