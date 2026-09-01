// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  commitIfCurrent,
  isAbortError,
  ObjectRequestGuard,
  RequestTicket,
} from "../src/screens/Console/Buckets/ListBuckets/Objects/requestGuard";

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
}

const deferred = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
};

test.describe("object request guard", () => {
  test("beginning B aborts A and makes it stale", () => {
    const guard = new ObjectRequestGuard<string>();
    const a: RequestTicket<string> = guard.begin("A");
    expect(a.isCurrent()).toBe(true);
    const b = guard.begin("B");
    expect(a.signal.aborted).toBe(true);
    expect(a.isCurrent()).toBe(false);
    expect(b.isCurrent()).toBe(true);
    expect(guard.current()).toBe("B");
  });

  test("A resolving after B cannot commit", async () => {
    const guard = new ObjectRequestGuard<string>();
    const committed: string[] = [];
    const responseA = deferred<string>();
    const responseB = deferred<string>();

    const ticketA = guard.begin("A");
    const runA = responseA.promise.then((value) =>
      commitIfCurrent(ticketA, value, (v) => committed.push(v)),
    );
    const ticketB = guard.begin("B");
    const runB = responseB.promise.then((value) =>
      commitIfCurrent(ticketB, value, (v) => committed.push(v)),
    );

    responseB.resolve("details of B");
    await expect(runB).resolves.toBe(true);
    responseA.resolve("details of A");
    await expect(runA).resolves.toBe(false);
    expect(committed).toEqual(["details of B"]);
  });

  test("invalidate aborts the current request", () => {
    const guard = new ObjectRequestGuard<string>();
    const ticket = guard.begin("A");
    guard.invalidate();
    expect(ticket.signal.aborted).toBe(true);
    expect(ticket.isCurrent()).toBe(false);
    expect(guard.current()).toBeNull();
    const next = guard.begin("B");
    expect(next.isCurrent()).toBe(true);
  });

  test("rapid successive requests leave exactly the last one current", () => {
    const guard = new ObjectRequestGuard<number>();
    const tickets = Array.from({ length: 50 }, (_, index) =>
      guard.begin(index),
    );
    expect(tickets.filter((ticket) => ticket.isCurrent())).toHaveLength(1);
    expect(tickets[49].isCurrent()).toBe(true);
    expect(tickets.slice(0, 49).every((ticket) => ticket.signal.aborted)).toBe(
      true,
    );
  });

  test("independent guards do not cancel each other", () => {
    const listing = new ObjectRequestGuard<string>();
    const metadata = new ObjectRequestGuard<string>();
    const metadataTicket = metadata.begin("A");
    listing.begin("A");
    listing.begin("A again");
    expect(metadataTicket.isCurrent()).toBe(true);
    expect(metadataTicket.signal.aborted).toBe(false);
  });

  test("recognizes the rejection an aborted fetch produces", () => {
    expect(isAbortError(new DOMException("aborted", "AbortError"))).toBe(true);
    expect(isAbortError({ name: "AbortError" })).toBe(true);
    expect(isAbortError({ error: { message: "Access Denied." } })).toBe(false);
    expect(isAbortError(null)).toBe(false);
    expect(isAbortError("AbortError")).toBe(false);
  });
});
