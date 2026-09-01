// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  callForObjectID,
  cancelTransfer,
  removeTrace,
  startQueuedUpload,
  storeCallForObjectWithID,
  storeUploadControl,
} from "../src/screens/Console/ObjectBrowser/transferManager";

test.describe("transfer manager", () => {
  test("uploads are sent and cancelled through their control until they settle", () => {
    const events: string[] = [];
    storeUploadControl("up-1", {
      send: () => {
        events.push("send");
        return true;
      },
      cancel: () => {
        events.push("cancel");
      },
    });
    expect(startQueuedUpload("up-1")).toBe(true);
    expect(cancelTransfer("up-1")).toBe(true);
    expect(events).toEqual(["send", "cancel"]);

    // A control whose send fails reports "not in flight".
    storeUploadControl("up-2", { send: () => false, cancel: () => {} });
    expect(startQueuedUpload("up-2")).toBe(false);
    removeTrace("up-2");

    // Settling forgets the upload: a later queue turn or cancel is a no-op.
    removeTrace("up-1");
    expect(startQueuedUpload("up-1")).toBe(false);
    expect(cancelTransfer("up-1")).toBe(false);
    expect(events).toEqual(["send", "cancel"]);
  });

  test("downloads are aborted through their request", () => {
    let aborted = 0;
    storeCallForObjectWithID("down-1", { abort: () => aborted++ });
    expect(callForObjectID("down-1")).toBeDefined();
    expect(cancelTransfer("down-1")).toBe(true);
    expect(aborted).toBe(1);
    removeTrace("down-1");
    expect(callForObjectID("down-1")).toBeUndefined();
    expect(cancelTransfer("down-1")).toBe(false);
  });

  test("unknown ids are reported, not thrown", () => {
    expect(startQueuedUpload("missing")).toBe(false);
    expect(cancelTransfer("missing")).toBe(false);
  });
});
