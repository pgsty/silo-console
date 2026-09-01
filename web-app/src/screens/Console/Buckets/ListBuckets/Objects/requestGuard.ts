// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { PreviewRequestGeneration } from "./Preview/textPreview";

/**
 * One in-flight request. `signal` is passed to the API client so a superseded
 * request is aborted; `isCurrent()` gates every state commit so a response
 * that arrives after a newer request began cannot alter the newer state.
 */
export interface RequestTicket<I> {
  readonly identity: I;
  readonly signal: AbortSignal;
  isCurrent(): boolean;
}

/**
 * Guards one independent request stream (for example "the versions listing
 * of the object detail panel"). Beginning a request aborts the previous one
 * and makes it stale; invalidating aborts the current one. Two streams that
 * may legitimately be in flight at the same time must use two guards, or one
 * would cancel the other.
 */
export class ObjectRequestGuard<I> {
  private readonly generation = new PreviewRequestGeneration();
  private controller: AbortController | null = null;
  private identity: I | null = null;

  begin(identity: I): RequestTicket<I> {
    this.controller?.abort();
    const controller = new AbortController();
    this.controller = controller;
    this.identity = identity;
    const generation = this.generation.begin();
    return {
      identity,
      signal: controller.signal,
      isCurrent: () =>
        !controller.signal.aborted && this.generation.isCurrent(generation),
    };
  }

  invalidate(): void {
    this.controller?.abort();
    this.controller = null;
    this.identity = null;
    this.generation.invalidate();
  }

  current(): I | null {
    return this.identity;
  }
}

/** Runs `commit` only while the ticket is current; reports whether it did. */
export const commitIfCurrent = <T>(
  ticket: Pick<RequestTicket<unknown>, "isCurrent">,
  value: T,
  commit: (value: T) => void,
): boolean => {
  if (!ticket.isCurrent()) {
    return false;
  }
  commit(value);
  return true;
};

/** True for the rejection `fetch` produces when its signal is aborted. */
export const isAbortError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  (error as { name?: unknown }).name === "AbortError";
