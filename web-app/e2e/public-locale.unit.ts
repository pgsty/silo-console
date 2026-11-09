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
import zh from "../src/i18n/locales/zh/chrome";
import zhHelp from "../src/i18n/locales/zh/help";
import zhScreens from "../src/i18n/locales/zh/screens";
import { translate } from "../src/i18n/lang";

test("public and Console copy are available at startup", () => {
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
  expect(translate("zh", "Remote host:")).toBe(zhScreens["Remote host:"]);
  expect(translate("en", "Remote host:")).toBe("Remote host:");
  expect(translate("zh", "Unhealthy")).toBe(zh.Unhealthy);
  expect(translate("zh", "Source")).toBe("源代码");
});
