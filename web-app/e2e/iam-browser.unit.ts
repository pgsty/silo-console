// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { fileURLToPath } from "node:url";
import {
  Browser,
  BrowserContext,
  Page,
  Route,
  chromium,
  expect,
  test,
} from "@playwright/test";
import { build } from "vite";
import { browserExecutable } from "./fixtures/browserExecutable";
import type { LdapEntities, Policy } from "../src/api/consoleApi";
import AxeBuilder from "@axe-core/playwright";

test.describe.configure({ mode: "serial" });
let browser: Browser;
let context: BrowserContext;
let page: Page;
let script: string;
let styles: string;
let policies: Policy[];
let writes: { method: string; path: string; data: unknown }[];
let held: Map<string, Route>;
let hold: Set<string>;
let failCounts: boolean;
let failKeys: boolean;
let failedGroups: Set<string>;
let ldapResults: LdapEntities;
let ldapQueries: unknown[];
const definition = JSON.stringify({
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Action: ["s3:GetObject"],
      Resource: ["arn:aws:s3:::*/*"],
    },
  ],
});

test.beforeAll(async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    const result = await build({
      configFile: false,
      logLevel: "silent",
      resolve: { tsconfigPaths: true },
      define: { "process.env.NODE_ENV": '"production"' },
      build: {
        write: false,
        lib: {
          entry: fileURLToPath(
            new URL("./fixtures/iamHarness.tsx", import.meta.url),
          ),
          name: "IamHarness",
          formats: ["iife"],
        },
      },
    });
    const output = Array.isArray(result) ? result[0] : result;
    if (!("output" in output)) throw new Error("Missing IAM harness");
    const chunk = output.output.find((item) => item.type === "chunk");
    if (!chunk || chunk.type !== "chunk") throw new Error("Missing IAM script");
    script = chunk.code;
    styles = output.output
      .filter((item) => item.type === "asset" && item.fileName.endsWith(".css"))
      .map((item) => (item.type === "asset" ? String(item.source) : ""))
      .join("\n");
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
  browser = await chromium.launch({ executablePath: browserExecutable() });
});

test.beforeEach(async () => {
  policies = [
    {
      name: "readwrite",
      builtin: true,
      modified: false,
      policy: definition,
      userCount: 1,
      groupCount: 0,
    },
    {
      name: "writeonly",
      builtin: true,
      modified: true,
      policy: definition,
      userCount: 0,
      groupCount: 0,
    },
    {
      name: "demo-reader",
      builtin: false,
      modified: false,
      policy: definition,
      userCount: 3,
      groupCount: 1,
    },
    { name: "unknown", policy: definition },
  ];
  writes = [];
  held = new Map();
  hold = new Set();
  failedGroups = new Set();
  failCounts = false;
  failKeys = false;
  ldapResults = {};
  ldapQueries = [];
  context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  page = await context.newPage();
  await page.route("**/*", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (!path.startsWith("/api/v1/"))
      return route.fulfill({
        contentType: "text/html",
        body: '<base href="/"><div id="root"></div>',
      });
    if (hold.has(path)) {
      held.set(path, route);
      return;
    }
    const name = decodeURIComponent(path.split("/").at(-1)!);
    if (path === "/api/v1/ldap-entities" && request.method() === "POST") {
      ldapQueries.push(request.postDataJSON());
      return route.fulfill({ json: ldapResults });
    }
    if (request.method() !== "GET") {
      const data = request.postData() ? request.postDataJSON() : null;
      writes.push({ method: request.method(), path, data });
      if (path === "/api/v1/policies") {
        const policy = policies.find((p) => p.name === data.name)!;
        policy.policy = data.policy;
        policy.modified = true;
        return route.fulfill({ json: policy });
      }
      if (path.startsWith("/api/v1/policy/")) {
        const policy = policies.find((p) => p.name === name)!;
        policy.modified = false;
        policy.policy = definition;
        return route.fulfill({ status: 204 });
      }
      return route.fulfill({ json: { status: "disabled" } });
    }
    if (path === "/api/v1/policies")
      return failCounts
        ? route.fulfill({ status: 500, json: { message: "No metadata" } })
        : route.fulfill({ json: { policies } });
    if (path.startsWith("/api/v1/policy/")) {
      const policy = policies.find((p) => p.name === name)!;
      const { userCount: _users, groupCount: _groups, ...detail } = policy;
      return route.fulfill({ json: detail });
    }
    if (path.startsWith("/api/v1/policies/"))
      return route.fulfill({ json: [] });
    if (path === "/api/v1/configs/identity_ldap")
      return route.fulfill({
        json: [
          {
            key_values: [
              { key: "enable", value: "on" },
              { key: "server_addr", value: "ldap.test:389" },
            ],
          },
        ],
      });
    if (path.endsWith("/service-accounts"))
      return failKeys
        ? route.fulfill({ status: 500, json: { message: "No keys" } })
        : route.fulfill({ json: [] });
    if (path.startsWith("/api/v1/user/"))
      return route.fulfill({
        json: {
          accessKey: name,
          policy: name === "alice" ? [" readwrite ", "readwrite", ""] : [],
          memberOf:
            name === "alice"
              ? ["alpha", "beta", "gamma", "delta"]
              : ["analysts"],
          status: "enabled",
          hasPolicy: true,
        },
      });
    if (path.startsWith("/api/v1/group/"))
      return failedGroups.has(name)
        ? route.fulfill({ status: 500, json: { message: "No group" } })
        : route.fulfill({
            json: { name, status: "enabled", policy: "readonly" },
          });
    return route.fulfill({ json: {} });
  });
});
test.afterEach(async () => {
  await context.close();
});
test.afterAll(async () => {
  await browser?.close();
});
const open = async (path: string) => {
  await page.goto(`http://t17.test${path}`);
  if (path.includes("layout=group"))
    await page.addStyleTag({ content: styles });
  await page.addScriptTag({ content: script });
};

test("actual policy tabs keep each section directly below the policy heading", async ({}, info) => {
  test.setTimeout(60_000);
  const headings: { policy: string; tab: string; tag: string }[] = [];
  for (const name of ["readwrite", "writeonly", "demo-reader"]) {
    await open(`/policies/${name}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    const refresh = page.locator("#refresh-policy");
    await expect(refresh).toHaveAccessibleName("Refresh");
    await expect(refresh).toHaveText("");
    await Promise.all([
      page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === `/api/v1/policy/${name}` &&
          response.request().method() === "GET",
      ),
      refresh.click(),
    ]);
    for (const [tab, title] of [
      ["Summary", "Policy Summary"],
      ["Users", "Users"],
      ["Groups", "Groups"],
      ["Raw Policy", "Raw Policy"],
    ]) {
      await page.getByRole("tab", { name: tab, exact: true }).click();
      const heading = page.getByRole("heading", { name: title, exact: true });
      await expect(heading).toBeVisible();
      const tag = await heading.evaluate((node) => node.tagName);
      headings.push({ policy: name, tab, tag });
      expect.soft(tag, `${name}: ${tab}`).toBe("H2");
      const axe = await new AxeBuilder({ page })
        .withRules(["heading-order"])
        .analyze();
      expect.soft(axe.violations, `${name}: ${tab}`).toEqual([]);
    }
  }
  await info.attach("actual-policy-tab-headings", {
    contentType: "application/json",
    body: JSON.stringify(headings, null, 2),
  });
  expect(writes).toEqual([]);
});

test("actual user and group tabs keep each section directly below the entity heading", async ({}, info) => {
  test.setTimeout(60_000);
  const headings: { entity: string; tab: string; tag: string }[] = [];
  for (const scenario of [
    {
      path: "/identity/users/alice",
      name: "alice",
      tabs: [
        ["Groups", "Groups"],
        ["Service Accounts", "Access Keys"],
        ["Policies", "Policies"],
      ],
    },
    {
      path: "/identity/groups/analysts",
      name: "analysts",
      tabs: [
        ["Members", "Members"],
        ["Policies", "Policies"],
      ],
    },
  ]) {
    await open(scenario.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      scenario.name,
    );
    if (scenario.name === "alice") {
      const refresh = page.locator("#refresh-user-overview");
      await expect(refresh).toHaveAccessibleName("Refresh");
      await expect(refresh).toHaveText("");
      await Promise.all([
        page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname === "/api/v1/user/alice" &&
            response.request().method() === "GET",
        ),
        refresh.click(),
      ]);
    } else {
      await expect(page.locator("#group-status")).toHaveAccessibleName(
        "Status",
      );
      await expect(page.locator("#group-status")).toBeChecked();
      await expect(page.locator("#group-status")).toBeEnabled();
    }
    for (const [tab, title] of scenario.tabs) {
      await page.getByRole("tab", { name: tab, exact: true }).click();
      const heading = page.getByRole("heading", { name: title, exact: true });
      await expect(heading).toBeVisible();
      const tag = await heading.evaluate((node) => node.tagName);
      headings.push({ entity: scenario.name, tab, tag });
      expect.soft(tag, `${scenario.name}: ${tab}`).toBe("H2");
      const axe = await new AxeBuilder({ page })
        .withRules(["heading-order", "label"])
        .analyze();
      expect.soft(axe.violations, `${scenario.name}: ${tab}`).toEqual([]);
    }
    if (scenario.name === "analysts") {
      await page.locator("#language-activator").click();
      await page.getByRole("option", { name: "简体中文", exact: true }).click();
      await expect(page.locator("#group-status")).toHaveAccessibleName("状态");
      await expect(page.locator("#group-status")).toBeChecked();
      await page.locator("#language-activator").click();
      await page.getByRole("option", { name: "English", exact: true }).click();
      await open(`${scenario.path}?access=read-only`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        scenario.name,
      );
      await expect(page.locator("#group-status")).toHaveAccessibleName(
        "Status",
      );
      // This fixture cannot read group details or change group status.
      await expect(page.locator("#group-status")).not.toBeChecked();
      await expect(page.locator("#group-status")).toBeDisabled();
    }
  }
  await info.attach("actual-entity-tab-headings", {
    contentType: "application/json",
    body: JSON.stringify(headings, null, 2),
  });
  expect(writes).toEqual([]);
});

test("actual group tabs keep usable content and separate controls at narrow available widths", async ({}, info) => {
  test.setTimeout(90_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route("**/api/v1/group/analysts", (route) => {
    if (route.request().method() !== "GET") return route.fallback();
    return route.fulfill({
      json: {
        name: "analysts",
        members: ["alice", "bob"],
        status: "enabled",
        policy: "readonly",
      },
    });
  });
  const geometry: unknown[] = [];
  const touch = await context.newCDPSession(page);
  for (const language of ["en", "zh"]) {
    const members = language === "zh" ? "成员" : "Members";
    const policies = language === "zh" ? "策略" : "Policies";
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await touch.send("Emulation.setTouchEmulationEnabled", {
        enabled: width === 390,
      });
      await open(
        `/identity/groups/analysts?layout=group&lang=${language}${width === 768 ? "&sidebar=expanded" : ""}`,
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "analysts",
      );
      const tablist = page.getByRole("tablist");
      const membersTab = tablist.getByRole("tab", {
        name: members,
        exact: true,
      });
      const policiesTab = tablist.getByRole("tab", {
        name: policies,
        exact: true,
      });
      const panel = page.getByRole("tabpanel", {
        name: members,
        exact: true,
      });
      await expect(panel.getByText("alice", { exact: true })).toBeVisible();
      const heading = panel.getByRole("heading", {
        name: members,
        exact: true,
      });
      const search = panel.locator("#search-resource");
      const action = panel.locator("#add-user-group");
      const rect = async (locator: typeof panel) =>
        locator.evaluate((node) => {
          const box = node.getBoundingClientRect();
          return {
            x: box.x,
            y: box.y,
            right: box.right,
            bottom: box.bottom,
            width: box.width,
            height: box.height,
          };
        });
      const boxes = {
        panel: await rect(panel),
        heading: await rect(heading),
        search: await rect(search),
        action: await rect(action),
      };
      geometry.push({ language, width, ...boxes });
      await info.attach(`group-members-${width}-${language}`, {
        contentType: "image/png",
        body: await page.screenshot({ fullPage: true }),
      });
      await expect
        .soft(tablist)
        .toHaveAttribute(
          "aria-orientation",
          width === 1440 ? "vertical" : "horizontal",
        );
      expect
        .soft(boxes.panel.width, `${width}: usable panel width`)
        .toBeGreaterThanOrEqual(
          width === 390 ? 280 : width === 768 ? 400 : 720,
        );
      expect
        .soft(boxes.search.width, `${width}: usable search width`)
        .toBeGreaterThanOrEqual(width === 390 ? 200 : 240);
      const separate = (a: typeof boxes.heading, b: typeof boxes.heading) =>
        a.right <= b.x + 1 ||
        b.right <= a.x + 1 ||
        a.bottom <= b.y + 1 ||
        b.bottom <= a.y + 1;
      expect.soft(separate(boxes.heading, boxes.search)).toBe(true);
      expect.soft(separate(boxes.heading, boxes.action)).toBe(true);
      expect.soft(separate(boxes.search, boxes.action)).toBe(true);
      for (const box of [boxes.heading, boxes.search, boxes.action]) {
        expect.soft(box.x).toBeGreaterThanOrEqual(boxes.panel.x - 1);
        expect.soft(box.right).toBeLessThanOrEqual(boxes.panel.right + 1);
      }
      await search.fill("alice");
      await expect(panel.getByText("alice", { exact: true })).toBeVisible();
      await expect(panel.getByText("bob", { exact: true })).toHaveCount(0);
      await search.fill("");
      await membersTab.focus();
      await membersTab.press(width === 1440 ? "ArrowDown" : "ArrowRight");
      await expect(policiesTab).toBeFocused();
      await policiesTab.press("Enter");
      await expect(policiesTab).toHaveAttribute("aria-selected", "true");
      const policyPanel = page.getByRole("tabpanel", {
        name: policies,
        exact: true,
      });
      await expect(
        policyPanel.getByText("readonly", { exact: true }),
      ).toBeVisible();
      const policyHeading = await rect(
        policyPanel.getByRole("heading", {
          level: 2,
          name: policies,
          exact: true,
        }),
      );
      const policyAction = await rect(policyPanel.locator("#set-policies"));
      expect.soft(separate(policyHeading, policyAction)).toBe(true);
      await policiesTab.press(width === 1440 ? "ArrowUp" : "ArrowLeft");
      await expect(membersTab).toBeFocused();
      await membersTab.press("Enter");
      await expect(membersTab).toHaveAttribute("aria-selected", "true");
      await expect(panel.getByText("bob", { exact: true })).toBeVisible();
      expect
        .soft(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        )
        .toBe(true);
    }
  }
  await info.attach("group-responsive-geometry", {
    contentType: "application/json",
    body: JSON.stringify(geometry, null, 2),
  });
  expect(pageErrors).toEqual([]);
  expect(writes).toEqual([]);
});

test("actual LDAP query keeps filter, empty and mapping heading hierarchy", async ({}, info) => {
  await open("/identity/ldap");
  await page.getByRole("tab", { name: "Entities", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("LDAP");
  const states: {
    state: string;
    headings: { text: string | null; tag: string }[];
  }[] = [];
  const assertHeadings = async (state: string) => {
    for (const title of ["Query Filters", "Query Results"])
      expect
        .soft(
          await page
            .getByRole("heading", { name: title, exact: true })
            .evaluate((node) => node.tagName),
        )
        .toBe("H2");
    const headings = await page
      .getByRole("heading")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({ text: node.textContent, tag: node.tagName })),
      );
    states.push({ state, headings });
    const axe = await new AxeBuilder({ page })
      .withRules(["heading-order"])
      .analyze();
    expect.soft(axe.violations, state).toEqual([]);
  };
  await assertHeadings("no query");
  await page.locator("#search-entity").click();
  await expect(
    page.getByRole("heading", { name: "No Results Available", exact: true }),
  ).toBeVisible();
  await assertHeadings("empty results");
  ldapResults = {
    users: [{ user: "alice", policies: ["readonly"] }],
    groups: [{ group: "analysts", policies: ["readonly"] }],
    policies: [{ policy: "readonly", users: ["alice"], groups: ["analysts"] }],
  };
  await page.locator("#search-entity").click();
  await expect(
    page.getByRole("heading", { name: "User Mappings", exact: true }),
  ).toBeVisible();
  for (const name of ["User Mappings", "Group Mappings", "Policy Mappings"])
    expect
      .soft(
        await page
          .getByRole("heading", { name, exact: true })
          .evaluate((node) => node.tagName),
      )
      .toBe("H3");
  for (const name of ["alice", "analysts", "readonly"])
    expect
      .soft(
        await page
          .getByRole("heading", { name, exact: true })
          .evaluate((node) => node.tagName),
      )
      .toBe("H4");
  await assertHeadings("populated mappings");
  await info.attach("actual-ldap-query-headings", {
    contentType: "application/json",
    body: JSON.stringify(states, null, 2),
  });
  expect(ldapQueries).toHaveLength(2);
  expect(writes).toEqual([]);
});

test("actual built-in editor requires intent, cancels without write, and saves then resets", async () => {
  await open("/policies/readwrite");
  await page.getByRole("tab", { name: "Raw Policy", exact: true }).click();
  const editor = page.locator("textarea");
  await expect(editor).toHaveAccessibleName("Raw Policy");
  await expect(editor).toHaveJSProperty("readOnly", true);
  await expect(page.locator("#save")).toBeDisabled();
  await expect(page.locator("#delete-policy")).toHaveCount(0);
  await page.locator("#override-policy").click();
  await expect(editor).toHaveJSProperty("readOnly", false);
  await editor.fill('{"Version":"2012-10-17","Statement":[]}');
  await page.locator("#cancel-policy-override").click();
  await expect(editor).toHaveJSProperty("readOnly", true);
  expect(writes).toEqual([]);
  await page.locator("#override-policy").click();
  await editor.fill(definition.replace('"Effect"', '"Sid":"T17Test","Effect"'));
  await page.locator("#save").click();
  await expect(page.locator("#delete-policy")).toHaveText("Reset to default");
  await page.locator("#delete-policy").click();
  await expect(page.getByRole("dialog")).toContainText("1 users and 0 groups");
  await page.locator("#confirm-cancel").click();
  await expect(page).toHaveURL(/policies\/readwrite$/);
  await page.locator("#delete-policy").click();
  await page.locator("#confirm-ok").click();
  await expect(page.locator("#override-policy")).toBeVisible();
  await expect(editor).toHaveJSProperty("readOnly", true);
  expect(writes.map((write) => [write.method, write.path])).toEqual([
    ["POST", "/api/v1/policies"],
    ["DELETE", "/api/v1/policy/readwrite"],
  ]);
});

test("actual policy rows expose only their correct action and confirmation counts stay honest", async () => {
  await open("/policies");
  for (const name of ["readwrite", "unknown"]) {
    await page
      .getByRole("button", { name: `Actions for ${name}`, exact: true })
      .click();
    const menu = page.getByRole("menu", {
      name: `Actions for ${name}`,
      exact: true,
    });
    await expect(menu).toBeVisible();
    await expect
      .poll(() =>
        menu.evaluate((node) => node.contains(document.activeElement)),
      )
      .toBe(true);
    await expect(
      menu.getByRole("menuitem", { name: "Delete", exact: true }),
    ).toHaveCount(0);
    await expect(
      menu.getByRole("menuitem", { name: "Reset to default", exact: true }),
    ).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  }
  await page
    .getByRole("button", { name: "Actions for demo-reader", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("3 users and 1 groups");
  await page.locator("#confirm-cancel").click();
  failCounts = true;
  await page
    .getByRole("button", { name: "Actions for writeonly", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Reset to default", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Attachment information is unavailable.",
  );
  await expect(page.getByRole("dialog")).toContainText("writeonly");
  await expect(page.getByRole("dialog")).not.toContainText("demo-reader");
  await page.locator("#confirm-cancel").click();
  expect(writes).toEqual([]);
});

test("overview is default, group requests are capped and late Alice replies cannot contaminate Bob", async () => {
  for (const name of ["alpha", "beta", "gamma", "delta"])
    hold.add(`/api/v1/group/${name}`);
  hold.add("/api/v1/user/alice/service-accounts");
  await open("/identity/users/alice");
  await expect(
    page.getByRole("tab", { name: "Overview", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect
    .poll(
      () => [...held.keys()].filter((path) => path.includes("/group/")).length,
    )
    .toBe(3);
  expect(held.has("/api/v1/group/delta")).toBe(false);
  await page.getByRole("link", { name: "Bob fixture", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Policies inherited through groups",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "readonly", exact: true }),
  ).toBeVisible();
  for (const [path, route] of held)
    await route
      .fulfill({
        json: path.includes("/group/")
          ? {
              name: path.split("/").at(-1),
              status: "enabled",
              policy: "AliceOnly",
            }
          : [{ accessKey: "AliceKey" }],
      })
      .catch(() => undefined);
  await expect(page.locator('[role="tabpanel"]:visible')).not.toContainText(
    "AliceOnly",
  );
  await expect(page.locator('[data-testid="user-key-count"]')).toHaveText("0");
  expect(held.has("/api/v1/group/delta")).toBe(false);
  expect(writes).toEqual([]);
});

test("failed group and key requests stay explicitly incomplete, and switching tabs cancels work", async () => {
  failedGroups.add("analysts");
  failKeys = true;
  await open("/identity/users/bob");
  await expect(page.locator('[data-testid="user-key-count"]')).toHaveText("—");
  await expect(
    page.getByText("Group policies could not be loaded.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("No inherited group policies", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("tab", { name: "Groups", exact: true }).click();
  await expect(
    page.getByRole("tab", { name: "Groups", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  failedGroups.clear();
  failKeys = false;
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "readonly", exact: true }),
  ).toBeVisible();
  await expect(page.locator('[data-testid="user-key-count"]')).toHaveText("0");
});

test("permission gates block overriding and resetting, and the current user's status remains protected", async () => {
  for (const name of ["readwrite", "writeonly"]) {
    await open(`/policies/${name}?access=read-only`);
    await page.getByRole("tab", { name: "Raw Policy", exact: true }).click();
    await expect(page.locator("textarea")).toHaveJSProperty("readOnly", true);
    if (name === "readwrite")
      await expect(page.locator("#override-policy")).toBeDisabled();
    else await expect(page.locator("#override-policy")).toHaveCount(0);
    await expect(page.locator("#delete-policy")).toHaveCount(0);
    await expect(page.locator("#save")).toBeDisabled();
  }
  await open("/identity/users/bob?account=bob");
  await expect(page.locator("#user-status")).toHaveAccessibleName("Status");
  await expect(page.locator("#user-status")).toBeDisabled();
  expect(writes).toEqual([]);
});

test("a changed policy classification disables the captured destructive confirmation", async () => {
  await open("/policies");
  await page
    .getByRole("button", { name: "Actions for demo-reader", exact: true })
    .click();
  policies.find((policy) => policy.name === "demo-reader")!.builtin = true;
  await page.getByRole("menuitem", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "This policy has changed or is no longer available.",
  );
  await expect(page.locator("#confirm-ok")).toBeDisabled();
  await page.locator("#confirm-cancel").click();
  await expect(page).toHaveURL(/\/policies$/);
  expect(writes).toEqual([]);
});

test("pending policy saves exclude Reset and Delete, and an open confirmation excludes form submissions", async () => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") requests.push(request.method());
  });
  for (const name of ["writeonly", "demo-reader"]) {
    await open(`/policies/${name}`);
    await page.getByRole("tab", { name: "Raw Policy", exact: true }).click();
    hold.add("/api/v1/policies");
    await page.locator("#save").click();
    await expect.poll(() => held.has("/api/v1/policies")).toBe(true);
    await expect(page.locator("#delete-policy")).toBeDisabled();
    await page
      .locator("#delete-policy")
      .evaluate((button: HTMLButtonElement) => button.click());
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(requests.filter((method) => method === "DELETE")).toHaveLength(0);
    const pending = held.get("/api/v1/policies")!;
    const policy = policies.find((item) => item.name === name)!;
    policy.policy = pending.request().postDataJSON().policy;
    await pending.fulfill({ json: policy });
    held.delete("/api/v1/policies");
    hold.delete("/api/v1/policies");
    await expect(page.locator("#delete-policy")).toBeEnabled();
    await page.locator("#delete-policy").click();
    await expect(page.locator("#confirm-ok")).toBeEnabled();
    await expect(page.locator("#save")).toBeDisabled();
    const prior = requests.length;
    await page
      .locator("form")
      .evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.locator("#confirm-cancel").click();
    await expect(page.locator("#save")).toBeEnabled();
    expect(requests).toHaveLength(prior);
  }
  expect(requests).toEqual(["POST", "POST"]);
});

test("language changes preserve an unsaved policy override without refetching, and pending errors use the current language", async () => {
  const reads: string[] = [];
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (request.method() === "GET" && path.startsWith("/api/v1/"))
      reads.push(path);
  });
  const groupPath = "/api/v1/policies/readwrite/groups";
  hold.add(groupPath);
  await open("/policies/readwrite");
  await expect.poll(() => held.has(groupPath)).toBe(true);
  await page.getByRole("tab", { name: "Raw Policy", exact: true }).click();
  await page.locator("#override-policy").click();
  const editor = page.locator("textarea");
  const draft = definition.replace(
    '"Effect"',
    '"Sid":"UnsavedT17Draft","Effect"',
  );
  await editor.fill(draft);
  const initialReads = [...reads];
  expect(initialReads).toHaveLength(3);

  await page.locator("#language-activator").click();
  await page.getByRole("option", { name: "简体中文", exact: true }).click();
  await expect(editor).toHaveAccessibleName("策略原文");
  await expect(editor).toHaveValue(draft);
  await expect(editor).toHaveJSProperty("readOnly", false);
  await expect(page.locator("#cancel-policy-override")).toBeVisible();
  await expect(page.locator("#save")).toBeEnabled();
  expect(reads).toEqual(initialReads);

  const tooltipGeometry = () =>
    page.evaluate(() => {
      const trigger = document.getElementById("language-activator")!;
      const anchor = trigger.getBoundingClientRect();
      const hit = document.elementFromPoint(
        anchor.x + anchor.width / 2,
        anchor.y + anchor.height / 2,
      );
      return {
        anchor: anchor.toJSON(),
        bubbles: Array.from(document.querySelectorAll('[role="tooltip"]')).map(
          (element) => ({
            text: element.textContent,
            rect: element.getBoundingClientRect().toJSON(),
          }),
        ),
        hit: hit?.outerHTML,
        triggerReceivesPointer: hit !== null && trigger.contains(hit),
      };
    });
  await page.locator("#language-activator").hover();
  await expect(page.getByRole("tooltip")).toHaveText("语言");
  await test.info().attach("language-before-error", {
    body: JSON.stringify(await tooltipGeometry(), null, 2),
    contentType: "application/json",
  });
  await held.get(groupPath)!.abort("failed");
  held.delete(groupPath);
  hold.delete(groupPath);
  await expect(page.getByRole("alert")).toHaveText("无法加载此策略关联的组.");
  expect(JSON.parse(await page.getByTestId("error-state").innerText())).toEqual(
    {
      message: "无法加载此策略关联的组",
      detailedErrorMsg: "",
      type: "error",
    },
  );
  expect(
    JSON.parse(await page.getByTestId("error-actions").innerText()),
  ).toContainEqual({
    plain: true,
    payload: { errorMessage: "无法加载此策略关联的组", detailedError: "" },
  });

  // The plain error output changes this mounted page's header position without
  // a viewport resize or scroll. Its existing hint must follow the actual button.
  await expect
    .poll(async () => (await tooltipGeometry()).triggerReceivesPointer)
    .toBe(true);
  await expect
    .poll(async () => {
      const geometry = await tooltipGeometry();
      return geometry.bubbles[0]?.rect.top - geometry.anchor.bottom;
    })
    .toBeGreaterThanOrEqual(7.9);
  await test.info().attach("language-after-error", {
    body: JSON.stringify(await tooltipGeometry(), null, 2),
    contentType: "application/json",
  });
  await page.locator("#language-activator").click();
  await page.getByRole("option", { name: "English", exact: true }).click();
  await expect(editor).toHaveAccessibleName("Raw Policy");
  await expect(editor).toHaveValue(draft);
  await expect(editor).toHaveJSProperty("readOnly", false);
  await expect(page.locator("#cancel-policy-override")).toBeVisible();
  await expect(page.locator("#save")).toBeEnabled();
  expect(reads).toEqual(initialReads);

  await page.route("**/api/v1/policy/readwrite", (route) =>
    route.abort("failed"),
  );
  await page.locator("#refresh-policy").click();
  await expect(
    page.getByRole("alert").filter({ hasText: /^Could not load policy\.$/ }),
  ).toBeVisible();
  expect(JSON.parse(await page.getByTestId("error-state").innerText())).toEqual(
    {
      message: "Could not load policy",
      detailedErrorMsg: "",
      type: "error",
    },
  );
  expect(
    reads.filter((path) => path === "/api/v1/policy/readwrite"),
  ).toHaveLength(2);
  expect(writes).toEqual([]);
});

for (const failure of ["api", "network"] as const) {
  test(`Reset succeeds but policy GET ${failure} failure hides stale content and Refresh restores the default without another write`, async () => {
    const marker = "T17OldDefinition";
    const modified = policies.find((policy) => policy.name === "writeonly")!;
    modified.policy = definition.replace(
      '"Effect"',
      `"Sid":"${marker}","Effect"`,
    );
    await open("/policies/writeonly");
    await page.getByRole("tab", { name: "Raw Policy", exact: true }).click();
    await expect(page.locator("textarea")).toHaveValue(new RegExp(marker));
    const endpoint = "**/api/v1/policy/writeonly";
    await page.route(endpoint, (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      return failure === "api"
        ? route.fulfill({
            status: 500,
            json: {
              message: "Policy lookup failed",
              detailedMessage: "The canned policy does not exist.",
            },
          })
        : route.abort("failed");
    });
    await page.locator("#delete-policy").click();
    await page.locator("#confirm-ok").click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(
      page.getByRole("alert").filter({
        hasText:
          failure === "api"
            ? "The canned policy does not exist."
            : /^Could not load policy\.$/,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Could not load policy. Refresh to try again.", {
        exact: true,
      }),
    ).toBeVisible();
    const message =
      failure === "api" ? "Policy lookup failed" : "Could not load policy";
    const detail = failure === "api" ? "The canned policy does not exist." : "";
    expect(
      JSON.parse(await page.getByTestId("error-state").innerText()),
    ).toEqual({
      message,
      detailedErrorMsg: detail,
      type: "error",
    });
    expect(
      JSON.parse(await page.getByTestId("error-actions").innerText()),
    ).toContainEqual({
      plain: true,
      payload: { errorMessage: message, detailedError: detail },
    });
    await expect(page.locator("textarea")).toHaveCount(0);
    await expect(page.getByRole("tab")).toHaveCount(0);
    await expect(page.getByText(marker, { exact: false })).toHaveCount(0);
    for (const id of ["save", "override-policy", "delete-policy"])
      await expect(page.locator(`#${id}`)).toHaveCount(0);
    await expect(page.getByText("Built-in", { exact: true })).toHaveCount(0);
    await expect(page.locator("#refresh-policy")).toBeEnabled();
    await page.unroute(endpoint);
    await page.locator("#refresh-policy").click();
    await expect(page.locator("textarea")).toHaveJSProperty("readOnly", true);
    await expect(page.locator("textarea")).toHaveValue(
      JSON.stringify(JSON.parse(definition), null, 4),
    );
    await expect(page.locator("#override-policy")).toBeVisible();
    await expect(page.locator("#save")).toBeDisabled();
    await expect(page.locator("#delete-policy")).toHaveCount(0);
    await expect(page.getByText("Built-in", { exact: true })).toBeVisible();
    expect(writes).toEqual([
      { method: "DELETE", path: "/api/v1/policy/writeonly", data: null },
    ]);
  });

  for (const attachment of ["users", "groups"] as const) {
    test(`policy ${attachment} GET ${failure} failure preserves API details or transport fallback in a plain page error`, async () => {
      const endpoint = `**/api/v1/policies/readwrite/${attachment}`;
      const message =
        failure === "api"
          ? "Attachment lookup failed"
          : `Could not load ${attachment} for this policy`;
      const detail =
        failure === "api"
          ? "Attachment information is temporarily unavailable."
          : "";
      await page.route(endpoint, (route) =>
        failure === "api"
          ? route.fulfill({
              status: 500,
              json: { message, detailedMessage: detail },
            })
          : route.abort("failed"),
      );
      await open("/policies/readwrite");
      await expect(page.getByRole("alert")).toHaveText(detail || `${message}.`);
      expect(
        JSON.parse(await page.getByTestId("error-state").innerText()),
      ).toEqual({
        message,
        detailedErrorMsg: detail,
        type: "error",
      });
      expect(
        JSON.parse(await page.getByTestId("error-actions").innerText()),
      ).toContainEqual({
        plain: true,
        payload: { errorMessage: message, detailedError: detail },
      });
      await page.getByRole("tab", { name: "Raw Policy", exact: true }).click();
      await expect(page.locator("textarea")).toHaveJSProperty("readOnly", true);
      await expect(page.locator("#override-policy")).toBeVisible();
      await expect(page.locator("#save")).toBeDisabled();
      expect(writes).toEqual([]);
    });
  }

  test(`user GET ${failure} failure shows a plain page error and allows retry`, async () => {
    const endpoint = "**/api/v1/user/bob";
    await page.route(endpoint, (route) =>
      failure === "api"
        ? route.fulfill({
            status: 500,
            json: {
              message: "User lookup failed",
              detailedMessage: "User directory is temporarily unavailable.",
            },
          })
        : route.abort("failed"),
    );
    await open("/identity/users/bob");
    await expect(page.getByRole("alert")).toHaveText(
      failure === "api"
        ? "User directory is temporarily unavailable."
        : "Could not load user.",
    );
    expect(
      JSON.parse(await page.getByTestId("error-state").innerText()),
    ).toEqual({
      message: failure === "api" ? "User lookup failed" : "Could not load user",
      detailedErrorMsg:
        failure === "api" ? "User directory is temporarily unavailable." : "",
      type: "error",
    });
    await page.unroute(endpoint);
    await page.locator("#retry-user").click();
    await expect(page.locator("#user-status")).toBeChecked();
    await expect(page.locator("#user-status")).toBeEnabled();
    expect(writes).toEqual([]);
  });

  test(`user status PUT ${failure} failure preserves status and shows the server detail or fallback`, async () => {
    let requestBody: unknown;
    await page.route("**/api/v1/user/bob/status", (route) => {
      requestBody = route.request().postDataJSON();
      return failure === "api"
        ? route.fulfill({
            status: 403,
            json: {
              message: "Status update denied",
              detailedMessage: "The user status could not be changed.",
            },
          })
        : route.abort("failed");
    });
    await open("/identity/users/bob");
    const control = page.locator("#user-status");
    await expect(control).toBeChecked();
    await control.click();
    await expect(page.getByRole("alert")).toHaveText(
      failure === "api"
        ? "The user status could not be changed."
        : "Could not update user status.",
    );
    await expect(control).toBeChecked();
    await expect(control).toBeEnabled();
    expect(requestBody).toEqual({ status: "disabled" });
    expect(
      JSON.parse(await page.getByTestId("error-state").innerText()),
    ).toEqual({
      message:
        failure === "api"
          ? "Status update denied"
          : "Could not update user status",
      detailedErrorMsg:
        failure === "api" ? "The user status could not be changed." : "",
      type: "error",
    });
  });
}
