// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

/**
 * Translation workflow (run from web-app):
 *   yarn exec playwright test --project=unit e2e/i18n-coverage.unit.ts --reporter=line
 *
 * Add English literals to t(), translate(language, key), translateLegend(language,
 * key), or a useT()/useLegendT() binding. Wrap literals translated later in
 * i18nKey() at their definition (menus, tabs, columns, component props, metadata).
 * The marker preserves the original value and literal type; it never translates.
 * JSON keys are expanded from the explicit paths in indirectKeys.ts at test time.
 * Add Chinese copy to locales/zh/screens.ts (shell chrome: chrome.ts); untranslatable.ts is
 * only for exact brand/protocol names. Never change English copy to satisfy this
 * test. Runtime values such as object names and RSS titles are not static keys.
 *
 * Missing keys fail with sorted, deduplicated source file:line locations. The
 * orphan check searches ALL JS/TS/JSX/TSX/JSON string literals under src, including
 * tests and generated code, but excludes src/i18n so dictionaries/baselines
 * cannot count themselves as uses. It deliberately does not infer data flow.
 * Review new orphans and remove obsolete translations; shrink orphanBaseline.ts
 * when cleaning up old entries. Do not regenerate baselines to silence failures.
 * Conflicting values follow runtime precedence chrome > screens > help; the
 * duplicate baseline records exact values, so changed hidden copy fails too.
 */

import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { indirectKeySources } from "../src/i18n/indirectKeys";
import { i18nKey } from "../src/i18n/lang";
import { duplicateBaseline, orphanBaseline } from "../src/i18n/orphanBaseline";
import { untranslatable } from "../src/i18n/untranslatable";
import zh from "../src/i18n/locales/zh/chrome";
import zhHelp from "../src/i18n/locales/zh/help";
import zhScreens from "../src/i18n/locales/zh/screens";

type KeyUse = { key: string; location: string };
type Translator = { argument: number; legend?: boolean; plural?: boolean };
type Dictionary = { name: string; values: Record<string, string> };

const sourceRoot = fileURLToPath(new URL("../src", import.meta.url));
const dictionaries: Dictionary[] = [
  { name: "zhHelp", values: zhHelp },
  { name: "zhScreens", values: zhScreens },
  { name: "zh", values: zh },
];
const mergedZh = { ...zhHelp, ...zhScreens, ...zh };

const sourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return sourceFiles(entryPath);
      }
      return /\.([jt]sx?|json)$/.test(entry.name) ? [entryPath] : [];
    })
    .sort();

const collectsKeys = (file: string): boolean =>
  /\.tsx?$/.test(file) &&
  !file.startsWith("i18n/") &&
  file !== "api/consoleApi.ts" &&
  !/(^|\/)(__tests__|__mocks__|tests)(\/|$)|\.(test|spec|unit)\.tsx?$/.test(
    file,
  );

const parseSource = (file: string, source: string): ts.SourceFile =>
  ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".json")
      ? ts.ScriptKind.JSON
      : /\.[jt]sx$/.test(file)
        ? ts.ScriptKind.TSX
        : ts.ScriptKind.TS,
  );

const keyUse = (source: ts.SourceFile, node: ts.StringLiteralLike): KeyUse => ({
  key: node.text,
  location: `src/${source.fileName}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}`,
});

// An explicit set of i18n entry points, including local import aliases and hook
// bindings. Do not guess that arbitrary properties named "label" are translated.
const collectSource = (source: ts.SourceFile) => {
  const keys: KeyUse[] = [];
  const literals = new Set<string>();
  const calls = new Map<string, Translator>([
    ["t", { argument: 0 }],
    ["translate", { argument: 1 }],
    ["translateLegend", { argument: 1, legend: true }],
    ["i18nKey", { argument: 0 }],
    ["tn", { argument: 1, plural: true }],
    ["translatePlural", { argument: 2, plural: true }],
  ]);
  const hooks = new Map<string, Translator>([
    ["useT", { argument: 0 }],
    ["useTN", { argument: 1, plural: true }],
    ["useLegendT", { argument: 0, legend: true }],
  ]);

  for (const statement of source.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      /(^|\/)i18n(?:\/(?:lang|index))?$/.test(statement.moduleSpecifier.text)
    ) {
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const binding of bindings.elements) {
          const original = (binding.propertyName ?? binding.name).text;
          const translator = calls.get(original);
          const hook = hooks.get(original);
          if (translator) calls.set(binding.name.text, translator);
          if (hook) hooks.set(binding.name.text, hook);
        }
      }
    }
  }

  const findBindings = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      ts.isIdentifier(node.initializer.expression)
    ) {
      const hook = hooks.get(node.initializer.expression.text);
      if (hook) calls.set(node.name.text, hook);
    }
    ts.forEachChild(node, findBindings);
  };
  findBindings(source);

  const visit = (node: ts.Node) => {
    if (ts.isStringLiteralLike(node)) literals.add(node.text);
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const translator = calls.get(node.expression.text);
      const argument = translator && node.arguments[translator.argument];
      if (argument && ts.isStringLiteralLike(argument)) {
        const use = keyUse(source, argument);
        // Match translateLegend's static prefix before a [server:drive] suffix.
        if (translator?.legend) {
          use.key = /^(.*?)( \[[^\]]*\])$/.exec(use.key)?.[1] ?? use.key;
        }
        keys.push(use);
        const other =
          translator?.plural && node.arguments[translator.argument + 1];
        if (other && ts.isStringLiteralLike(other))
          keys.push(keyUse(source, other));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { keys, literals };
};

const collectJson = (
  source: ts.SourceFile,
  paths: readonly (readonly string[])[],
): KeyUse[] => {
  const keys: KeyUse[] = [];
  const visit = (node: ts.Node, segments: string[]) => {
    if (
      ts.isStringLiteralLike(node) &&
      paths.some(
        (pattern) =>
          pattern.length === segments.length &&
          pattern.every((part, i) => part === "*" || part === segments[i]),
      )
    ) {
      keys.push(keyUse(source, node));
    } else if (ts.isObjectLiteralExpression(node)) {
      for (const property of node.properties) {
        if (
          ts.isPropertyAssignment(property) &&
          ts.isStringLiteral(property.name)
        ) {
          visit(property.initializer, [...segments, property.name.text]);
        }
      }
    } else if (ts.isArrayLiteralExpression(node)) {
      node.elements.forEach((element, i) =>
        visit(element, [...segments, String(i)]),
      );
    } else if (ts.isExpressionStatement(node)) {
      visit(node.expression, segments);
    } else if (ts.isSourceFile(node)) {
      node.statements.forEach((statement) => visit(statement, segments));
    }
  };
  visit(source, []);
  return keys;
};

const missingKeys = (
  uses: KeyUse[],
  dictionary: Record<string, string>,
  exceptions: readonly string[],
): string[] =>
  [
    ...new Set(
      uses
        .filter(
          ({ key }) =>
            !Object.hasOwn(dictionary, key) && !exceptions.includes(key),
        )
        .map(({ key, location }) => `${location}  ${JSON.stringify(key)}`),
    ),
  ].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

const orphanKeys = (
  dictionary: Record<string, string>,
  literals: Set<string>,
) =>
  Object.keys(dictionary)
    .filter((key) => !literals.has(key))
    .sort();

const conflictingKeys = (sources: Dictionary[]) => {
  const conflicts: (typeof duplicateBaseline)[number][] = [];
  const merged = Object.assign(
    {},
    ...sources.map(({ values }) => values),
  ) as Record<string, string>;
  for (const key of Object.keys(merged).sort()) {
    const definitions = sources.filter(({ values }) =>
      Object.hasOwn(values, key),
    );
    const winner = definitions[definitions.length - 1];
    for (const hidden of definitions.slice(0, -1)) {
      if (hidden.values[key] !== winner.values[key]) {
        conflicts.push({
          key,
          winner: winner.name,
          value: winner.values[key],
          hidden: hidden.name,
          hiddenValue: hidden.values[key],
        });
      }
    }
  }
  return conflicts;
};

test("collector recognizes literal calls, aliases, hook bindings and markers", () => {
  const source = parseSource(
    "fixture.tsx",
    [
      '// t("Comment")',
      'import { translate as tr, useT as useText, useLegendT as useLegend } from "i18n";',
      "const text = useText(); const legend = useLegend();",
      't("Direct"); t(`Template`); tr("zh", "Alias"); translate("en", "Plain");',
      'text("Hook"); legend("Used Space [server]"); translateLegend("zh", "Free [drive]");',
      'const tabs = [i18nKey("Indirect")]; t(runtime); t(`Dynamic ${name}`);',
      'const label = "Ordinary literal";',
    ].join("\n"),
  );
  const { keys, literals } = collectSource(source);
  expect(keys.map(({ key }) => key)).toEqual([
    "Direct",
    "Template",
    "Alias",
    "Plain",
    "Hook",
    "Used Space",
    "Free",
    "Indirect",
  ]);
  expect(keys[0].location).toBe("src/fixture.tsx:4");
  expect(literals.has("Ordinary literal")).toBe(true);
  expect(literals.has("Comment")).toBe(false);
  expect(i18nKey("Unchanged")).toBe("Unchanged");
  expect(collectsKeys("screens/Page.tsx")).toBe(true);
  for (const excluded of [
    "i18n/zh.ts",
    "api/consoleApi.ts",
    "page.test.tsx",
    "a/__tests__/page.ts",
    "tests/page.ts",
    "utils/helper.js",
  ]) {
    expect(collectsKeys(excluded), excluded).toBe(false);
  }
});

test("JSON manifest collects only explicit translated fields with source lines", () => {
  const source = parseSource(
    "fixture.json",
    `{
    "topic": {"docs": {"header": null, "links": [
      {"title": "A title", "body": "A body", "url": "https://example.com"}
    ]}, "blog": {"header": "Unused"}}
  }`,
  );
  const keys = collectJson(source, indirectKeySources[0].paths);
  expect(keys).toEqual([
    { key: "A title", location: "src/fixture.json:3" },
    { key: "A body", location: "src/fixture.json:3" },
  ]);
});

test("regression guards catch removed translations, removed uses and changed hidden values", () => {
  const uses = [
    { key: "Missing", location: "src/z.tsx:3" },
    { key: "Missing", location: "src/a.tsx:1" },
    { key: "Missing", location: "src/a.tsx:1" },
    { key: "SILO", location: "src/a.tsx:2" },
    { key: "constructor", location: "src/a.tsx:4" },
  ];
  expect(missingKeys(uses, {}, ["SILO"])).toEqual([
    'src/a.tsx:1  "Missing"',
    'src/a.tsx:4  "constructor"',
    'src/z.tsx:3  "Missing"',
  ]);
  expect(missingKeys(uses.slice(0, 1), { Missing: "译文" }, [])).toEqual([]);
  const dictionary = { Used: "使用中", Removed: "已移除", Status: "状态" };
  const literals = collectSource(
    parseSource("fixture.ts", 't("Used"); const apiStatus = "Status";'),
  ).literals;
  expect(orphanKeys(dictionary, literals)).toEqual(["Removed"]);
  const sources = [
    { name: "zhHelp", values: { Same: "相同", Different: "旧译文" } },
    { name: "zhScreens", values: { Same: "相同", Different: "新译文" } },
  ];
  const baseline = conflictingKeys(sources);
  expect(baseline).toEqual([
    {
      key: "Different",
      winner: "zhScreens",
      value: "新译文",
      hidden: "zhHelp",
      hiddenValue: "旧译文",
    },
  ]);
  sources[0].values.Different = "被覆盖的修改";
  expect(conflictingKeys(sources)).not.toEqual(baseline);
});

test("Chinese translations cover source keys without new orphans or hidden changes", async () => {
  const keys: KeyUse[] = [];
  const literals = new Set<string>();
  for (const file of sourceFiles(sourceRoot)) {
    const relative = path.relative(sourceRoot, file).split(path.sep).join("/");
    if (relative.startsWith("i18n/")) continue;
    const source = parseSource(relative, readFileSync(file, "utf8"));
    const collected = collectSource(source);
    collected.literals.forEach((literal) => literals.add(literal));
    if (collectsKeys(relative)) keys.push(...collected.keys);
  }
  for (const { file, paths } of indirectKeySources) {
    const source = parseSource(
      file,
      readFileSync(path.join(sourceRoot, file), "utf8"),
    );
    const indirect = collectJson(source, paths);
    expect(
      indirect.length,
      `No JSON translation keys found in ${file}`,
    ).toBeGreaterThan(0);
    keys.push(...indirect);
  }
  const missing = missingKeys(keys, mergedZh, untranslatable);
  const orphans = orphanKeys(mergedZh, literals);
  const newOrphans = orphans.filter((key) => !orphanBaseline.includes(key));
  const duplicates = conflictingKeys(dictionaries);
  const newDuplicates = duplicates.filter(
    (conflict) =>
      !duplicateBaseline.some(
        (baseline) =>
          baseline.key === conflict.key &&
          baseline.winner === conflict.winner &&
          baseline.value === conflict.value &&
          baseline.hidden === conflict.hidden &&
          baseline.hiddenValue === conflict.hiddenValue,
      ),
  );
  const summary = {
    collected: new Set(keys.map(({ key }) => key)).size,
    missing: new Set(
      keys
        .filter(
          ({ key }) =>
            !Object.hasOwn(mergedZh, key) && !untranslatable.includes(key),
        )
        .map(({ key }) => key),
    ).size,
    orphans: orphans.length,
    orphanBaseline: orphanBaseline.length,
    conflicts: duplicates.length,
  };
  console.log(`i18n coverage: ${JSON.stringify(summary)}`);
  console.log(
    `Orphans (${orphans.length}; ${newOrphans.length} new): ${JSON.stringify(orphans, null, 2)}`,
  );
  console.log(
    `Conflicting dictionary values (${duplicates.length}; ${newDuplicates.length} new): ${JSON.stringify(duplicates, null, 2)}`,
  );
  await test.info().attach("i18n-coverage.json", {
    body: JSON.stringify({ summary, missing, orphans, duplicates }, null, 2),
    contentType: "application/json",
  });
  expect
    .soft(missing, `Missing Chinese translations:\n${missing.join("\n")}`)
    .toEqual([]);
  expect
    .soft(
      newOrphans,
      `New orphaned translations (remove obsolete entries):\n${newOrphans.map((key) => JSON.stringify(key)).join("\n")}`,
    )
    .toEqual([]);
  expect
    .soft(
      newDuplicates,
      `New/changed translations hidden by dictionary precedence:\n${JSON.stringify(newDuplicates, null, 2)}`,
    )
    .toEqual([]);
});
