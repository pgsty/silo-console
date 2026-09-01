// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Scheduling rules of the transfer monitor, kept pure so the bookkeeping can
// be tested together with the start step.

interface ScheduledTransfer {
  ID: string;
  type: string;
  done: boolean;
}

// pendingTransfers lists the transfers of one type that are neither finished
// nor already counted as running.
export const pendingTransfers = <T extends ScheduledTransfer>(
  objects: T[],
  type: string,
  running: string[],
): T[] =>
  objects.filter(
    (object) =>
      object.type === type && !object.done && !running.includes(object.ID),
  );

// availableSlots is how many more transfers may run; a limit of 0 means
// unlimited.
export const availableSlots = (limit: number, running: number): number =>
  limit === 0 ? Number.POSITIVE_INFINITY : Math.max(0, limit - running);

// startUploads hands queued uploads to the network until the slots are used.
// A slot is counted (`onStarted`) only when `start` reports that the request
// is in flight: an upload that settled while it was queued, or whose send
// failed synchronously, has no request to account for, and counting it would
// hold its slot until the page is reloaded. Such an item is skipped and the
// next candidate gets its turn.
export const startUploads = <T extends ScheduledTransfer>(
  candidates: T[],
  slots: number,
  start: (id: string) => boolean,
  onStarted: (id: string) => void,
): string[] => {
  const started: string[] = [];
  for (const item of candidates) {
    if (started.length >= slots) {
      break;
    }
    if (start(item.ID)) {
      onStarted(item.ID);
      started.push(item.ID);
    }
  }
  return started;
};
