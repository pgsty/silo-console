// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  availableSlots,
  pendingTransfers,
  startUploads,
} from "../src/screens/Console/Common/ObjectManager/uploadScheduler";

// A model of the objectBrowser slice bookkeeping the monitor drives:
// newUploadInit adds to currentUploads; failObject/completeObject/
// cancelObjectInList mark the item done and remove it again.
class TransferStore {
  objects: Array<{ ID: string; type: string; done: boolean }> = [];
  currentUploads: string[] = [];

  add(id: string) {
    this.objects.push({ ID: id, type: "upload", done: false });
  }

  newUploadInit(id: string) {
    this.currentUploads = [...this.currentUploads, id];
  }

  settle(id: string) {
    const item = this.objects.find((object) => object.ID === id);
    if (item) {
      item.done = true;
    }
    this.currentUploads = this.currentUploads.filter((entry) => entry !== id);
  }

  // One monitor pass with the given limit and per-upload start behaviour.
  pass(limit: number, start: (id: string) => boolean) {
    return startUploads(
      pendingTransfers(this.objects, "upload", this.currentUploads),
      availableSlots(limit, this.currentUploads.length),
      start,
      (id) => this.newUploadInit(id),
    );
  }
}

test.describe("upload scheduler", () => {
  test("counts an upload as running only after its request is in flight", () => {
    const store = new TransferStore();
    store.add("ok");
    expect(store.pass(1, () => true)).toEqual(["ok"]);
    expect(store.currentUploads).toEqual(["ok"]);
  });

  test("a synchronous send failure takes no slot and the next upload starts", () => {
    const store = new TransferStore();
    store.add("broken");
    store.add("next");
    const started = store.pass(1, (id) => {
      if (id === "broken") {
        // uploadControl.send settles the upload synchronously and reports
        // "not in flight"; the reducer removes it before the scheduler
        // decides whether to count it.
        store.settle("broken");
        return false;
      }
      return true;
    });
    expect(started).toEqual(["next"]);
    expect(store.currentUploads).toEqual(["next"]);
    expect(store.objects.find((o) => o.ID === "broken")?.done).toBe(true);
  });

  test("an upload cancelled while queued is skipped without taking a slot", () => {
    const store = new TransferStore();
    store.add("cancelled");
    store.add("live");
    store.settle("cancelled"); // cancelTransfer -> cancelObjectInList
    expect(store.pass(1, () => true)).toEqual(["live"]);
    expect(store.currentUploads).toEqual(["live"]);
  });

  test("a control that vanished after the pass was computed takes no slot", () => {
    const store = new TransferStore();
    store.add("gone");
    expect(store.pass(1, () => false)).toEqual([]);
    expect(store.currentUploads).toEqual([]);
  });

  test("respects the limit, treats 0 as unlimited and skips running items", () => {
    const store = new TransferStore();
    ["a", "b", "c"].forEach((id) => store.add(id));
    expect(store.pass(2, () => true)).toEqual(["a", "b"]);
    expect(store.pass(2, () => true)).toEqual([]);
    store.settle("a");
    expect(store.pass(2, () => true)).toEqual(["c"]);

    const unlimited = new TransferStore();
    ["x", "y", "z"].forEach((id) => unlimited.add(id));
    expect(availableSlots(0, 0)).toBe(Number.POSITIVE_INFINITY);
    expect(unlimited.pass(0, () => true)).toEqual(["x", "y", "z"]);
  });
});
