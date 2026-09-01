// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Selector, t } from "testcafe";

// A protected page renders only after the session call completed, and a
// full navigation after role activation has to download and evaluate the
// bundle, restore the role, run the session call and render. The first such
// navigation in a fixture on a shared CI runner is the slow one; interactions
// on a rendered page keep the default 30 s selector timeout.
export const PAGE_RENDER_TIMEOUT = 60000;
export const CONTROL_TIMEOUT = 30000;

// waitForPage separates "the routed page rendered" from "the control is
// usable". marker must be an element only the routed page component renders
// (a page header label, the object list wrapper), never a sidebar entry.
export const waitForPage = async (marker: Selector, page: string) => {
  await t
    .expect(marker.exists)
    .ok(`${page} did not render within ${PAGE_RENDER_TIMEOUT} ms`, {
      timeout: PAGE_RENDER_TIMEOUT,
    });
};

// expectEnabled asserts that a state-agnostic control selector exists and
// then that it is enabled. A failure in the second step after the page
// rendered points at grants or fixture state, not at load time, and the
// message says so.
export const expectEnabled = async (control: Selector, name: string) => {
  await t
    .expect(control.exists)
    .ok(`${name} is not on the rendered page`, { timeout: CONTROL_TIMEOUT })
    .expect(control.hasAttribute("disabled"))
    .notOk(
      `page rendered, but ${name} stayed disabled: permission or fixture problem`,
      { timeout: CONTROL_TIMEOUT },
    );
};

// Page markers: structurally scoped to the routed page component.
export const policiesPageHeader =
  Selector(".page-header-label").withExactText("IAM Policies");
export const objectListWrapper = Selector("#object-list-wrapper");

// State-agnostic controls, selected by id so a disabled state still matches.
export const createPolicyControl = Selector("#create-policy");
export const uploadControl = Selector("#upload-main");
