// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
import { test, expect } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { planRename } from "../hack/i18n-rename.mjs";

const put = (root: string, file: string, value: string) => {
  const target = join(root, "src", file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, value);
  return target;
};

test("key migration handles unquoted catalog keys without changing API data or translations", ({}, info) => {
  const root = info.outputPath("rename");
  const source = put(
    root,
    "view.ts",
    't("Login"); i18nKey("Login"); const apiValue = "Login";',
  );
  const dictionary = put(
    root,
    "i18n/locales/fr/chrome.ts",
    'export default { Login: "Login" };',
  );
  put(
    root,
    "screens/Console/helpTopics.json",
    '{"docs":{"header":"Login","url":"Login"}}',
  );
  const changes = planRename(root, "Login", "Sign in");
  expect(changes.find((c) => c.file === dictionary)?.text).toContain(
    '"Sign in": "Login"',
  );
  expect(changes.find((c) => c.file === source)?.text).toBe(
    't("Sign in"); i18nKey("Sign in"); const apiValue = "Login";',
  );
  expect(
    changes.find((c) => c.file.endsWith("helpTopics.json"))?.text,
  ).toContain('"header":"Sign in","url":"Login"');
  expect(readFileSync(dictionary, "utf8")).toBe(
    'export default { Login: "Login" };',
  );
});

test("a later catalog collision rejects the entire plan, including identifier keys", ({}, info) => {
  const root = info.outputPath("collision");
  const first = put(
    root,
    "i18n/locales/fr/chrome.ts",
    'export default { Login: "Connexion" };',
  );
  put(
    root,
    "i18n/locales/zh/chrome.ts",
    'export default { Login: "登录", Logout: "退出" };',
  );
  expect(() => planRename(root, "Login", "Logout")).toThrow(
    "Destination key already exists",
  );
  expect(readFileSync(first, "utf8")).toBe(
    'export default { Login: "Connexion" };',
  );
});

test("placeholder-changing migrations require translation review", ({}, info) => {
  expect(() =>
    planRename(info.outputPath("none"), "Delete {name}", "Delete {path}"),
  ).toThrow("Placeholder changes");
});
