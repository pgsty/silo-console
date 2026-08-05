// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { ClientFunction, Selector } from "testcafe";
import * as roles from "../utils/roles";

const menu = Selector(".menuBox");
const menuToggle = Selector(".menuBox .menuHeaderContainer");

const unnamedMenuControls = ClientFunction(() =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '.menuBox button, .menuBox a, .menuBox [role="button"]',
    ),
  )
    .filter((control) => {
      const style = window.getComputedStyle(control);
      return style.display !== "none" && style.visibility !== "hidden";
    })
    .filter((control) => {
      if (
        control.getAttribute("aria-label")?.trim() ||
        control.getAttribute("aria-labelledby")?.trim()
      ) {
        return false;
      }

      return !control.innerText.trim();
    })
    .map((control) => control.id || control.className),
);

const blurFocusedElement = ClientFunction(() => {
  (document.activeElement as HTMLElement | null)?.blur();
});

const focusedOutlineStyle = ClientFunction(
  () => window.getComputedStyle(document.activeElement!).outlineStyle,
);
const focusedElementClass = ClientFunction(
  () => (document.activeElement as HTMLElement | null)?.className,
);
const focusedElementId = ClientFunction(
  () => (document.activeElement as HTMLElement | null)?.id,
);

fixture("Sidebar accessibility")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.admin).resizeWindow(1280, 800);
    if (await menu.hasClass("collapsed")) {
      await t.click(menuToggle);
    }
  })
  .afterEach(async (t) => {
    await t.resizeWindow(1280, 800);
  });

test("navigation controls remain named when the sidebar collapses", async (t) => {
  await t
    .expect(menu.hasClass("collapsed"))
    .notOk()
    .expect(menuToggle.getAttribute("aria-label"))
    .eql("Collapse menu")
    .expect(menuToggle.getAttribute("aria-expanded"))
    .eql("true")
    .expect(unnamedMenuControls())
    .eql([]);

  await blurFocusedElement();
  await t
    .pressKey("tab")
    .expect(focusedElementClass())
    .contains("menuHeaderContainer")
    .expect(focusedOutlineStyle())
    .notEql("none")
    .pressKey("tab")
    .expect(focusedElementId())
    .eql("menu-create-bucket")
    .pressKey("shift+tab")
    .pressKey("enter")
    .expect(menu.hasClass("collapsed"))
    .ok()
    .expect(menuToggle.getAttribute("aria-label"))
    .eql("Expand menu")
    .expect(menuToggle.getAttribute("aria-expanded"))
    .eql("false")
    .expect(unnamedMenuControls())
    .eql([]);

  await t
    .pressKey("space")
    .expect(menu.hasClass("collapsed"))
    .notOk()
    .resizeWindow(390, 844)
    .expect(menu.hasClass("collapsed"))
    .ok("Sidebar should collapse at the mobile breakpoint", { timeout: 2000 })
    .expect(unnamedMenuControls())
    .eql([]);
});
