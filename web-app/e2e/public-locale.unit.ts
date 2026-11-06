// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { zh } from "../src/i18n/zh";
import { zhHelp } from "../src/i18n/zhHelp";
import { zhScreens } from "../src/i18n/zhScreens";
import { pt } from "../src/i18n/pt";
import { ptScreens } from "../src/i18n/ptScreens";
import {
  getStoredLanguage,
  localeTag,
  loadLanguage,
  nextLanguage,
  registerScreenLoader,
  registerScreenTranslations,
  translate,
} from "../src/i18n/lang";

test("cold public/shared copy is complete before lazy Console registration", () => {
  const files = [
    ...readdirSync("src/screens/LoginPage")
      .filter((file) => /\.tsx?$/.test(file))
      .map((file) => `src/screens/LoginPage/${file}`),
    "src/screens/NotFoundPage.tsx",
    "src/common/RootErrorBoundary.tsx",
    "src/common/LoadingComponent.tsx",
    "src/StyleHandler.tsx",
    "src/screens/Console/HelpMenu.tsx",
    "src/screens/Console/HelpItem.tsx",
    "src/screens/Console/Common/DarkModeActivator/DarkModeActivator.tsx",
  ];
  const eager = { ...zhHelp, ...zh };
  const all = { ...zhHelp, ...zhScreens, ...zh };
  const missing: string[] = [];
  for (const file of files) {
    const source = ts.createSourceFile(
      file,
      readFileSync(resolve(file), "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        ["t", "i18nKey"].includes(node.expression.text)
      ) {
        const key = node.arguments[0];
        if (
          key &&
          ts.isStringLiteralLike(key) &&
          Object.hasOwn(all, key.text)
        ) {
          if (eager[key.text] !== all[key.text])
            missing.push(`${file}: ${key.text}`);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  expect(missing).toEqual([]);
  expect(translate("zh", "Source")).toBe("源代码");
  expect(translate("zh", "Notice")).toBe("声明");
  expect(translate("zh", "Unable to display this page.")).toBe(
    "无法显示此页面。",
  );
  expect(translate("zh", "On")).toBe("开启");
  expect(translate("zh", "Off")).toBe("关闭");
  // Importing the screen data alone must not register it or load it at login.
  expect(translate("zh", "Remote host:")).toBe("Remote host:");
  registerScreenTranslations(zhScreens);
  expect(translate("zh", "Remote host:")).toBe(zhScreens["Remote host:"]);
  expect(translate("en", "Remote host:")).toBe("Remote host:");
  expect(translate("zh", "Unhealthy")).toBe(zh.Unhealthy);
  expect(translate("zh", "Source")).toBe("源代码");
});

test("Portuguese loads on demand and its feature copy waits for the Console loader", async () => {
  expect(translate("pt", "Login")).toBe("Login");
  await loadLanguage("pt");
  expect(translate("pt", "Login")).toBe(pt.Login);
  expect(translate("pt", "Remote host:")).toBe("Remote host:");

  let attempts = 0;
  registerScreenLoader(async () => {
    attempts += 1;
    if (attempts === 1) throw new Error("chunk unavailable");
    return ptScreens;
  });
  await expect(loadLanguage("pt")).rejects.toThrow("chunk unavailable");
  expect(translate("pt", "Login")).toBe(pt.Login);
  expect(translate("pt", "Remote host:")).toBe("Remote host:");

  await loadLanguage("pt");
  expect(attempts).toBe(2);
  expect(translate("pt", "Remote host:")).toBe(ptScreens["Remote host:"]);
  expect(translate("pt", "Source")).toBe(pt.Source);
  expect(translate("zh", "Login")).toBe(zh.Login);
  expect(translate("en", "Login")).toBe("Login");
});

test("language cycle reaches every language and maps each to its locale", () => {
  expect(nextLanguage("en")).toBe("zh");
  expect(nextLanguage("zh")).toBe("pt");
  expect(nextLanguage("pt")).toBe("en");
  expect(localeTag("pt")).toBe("pt-BR");
  expect(localeTag("zh")).toBe("zh-CN");
  expect(localeTag("en")).toBe("en");
});

test("stored language accepts known values and otherwise stays English", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const withStored = (value: string | null) => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: () => value },
    });
    return getStoredLanguage();
  };
  try {
    expect(withStored("pt")).toBe("pt");
    expect(withStored("zh")).toBe("zh");
    expect(withStored(null)).toBe("en");
    expect(withStored("fr")).toBe("en");
    expect(withStored("constructor")).toBe("en");
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete (globalThis as { localStorage?: unknown }).localStorage;
  }
});
