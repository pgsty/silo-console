// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { formatText } from "../src/i18n/lang";

test.describe("formatText", () => {
  test("keeps replacement metacharacters and braces literal", () => {
    const special = "$& $' $` $1 $$ {other}";

    expect(formatText("Value: {value}", { value: special })).toBe(
      `Value: ${special}`,
    );
  });

  test("formats repeated and multiple placeholders in one pass", () => {
    expect(
      formatText("{first}/{second}/{first}", {
        first: "A",
        second: "{first} $&",
      }),
    ).toBe("A/{first} $&/A");
  });

  test("leaves unknown and inherited placeholders literal", () => {
    expect(
      formatText("{known} {unknown} {constructor}", { known: "yes" }),
    ).toBe("yes {unknown} {constructor}");
    expect(formatText("{constructor}", { constructor: "owned" })).toBe("owned");
  });
});

const sourceRoot = fileURLToPath(new URL("../src", import.meta.url));

const sourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(entryPath);
    }
    return /\.tsx?$/.test(entry.name) ? [entryPath] : [];
  });

const containsTranslationCall = (node: ts.Node): boolean => {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    (node.expression.text === "t" || node.expression.text === "translate")
  ) {
    return true;
  }

  let found = false;
  ts.forEachChild(node, (child) => {
    if (!found && containsTranslationCall(child)) {
      found = true;
    }
  });
  return found;
};

const rawTranslatedPlaceholderReplacements = (
  sourcePath: string,
  source: string,
): string[] => {
  const violations: string[] = [];
  const sourceFile = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    sourcePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "replace" &&
      node.arguments.length >= 2
    ) {
      const [pattern, replacement] = node.arguments;
      const replacesPlaceholder =
        ts.isStringLiteralLike(pattern) && /^\{\w+\}$/.test(pattern.text);
      const usesCallback =
        ts.isArrowFunction(replacement) || ts.isFunctionExpression(replacement);

      if (
        replacesPlaceholder &&
        !usesCallback &&
        containsTranslationCall(node.expression.expression)
      ) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile),
        );
        violations.push(`${sourcePath}:${line + 1}`);
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return violations;
};

test("source guard catches multiline raw replacements but allows callbacks", () => {
  const unsafe = `t("Hello {name}").replace(
    "{name}",
    displayName,
  );`;
  const safe = `t("Hello {name}").replace(
    "{name}",
    () => displayName,
  );`;

  expect(rawTranslatedPlaceholderReplacements("fixture.tsx", unsafe)).toEqual([
    "fixture.tsx:1",
  ]);
  expect(rawTranslatedPlaceholderReplacements("fixture.tsx", safe)).toEqual([]);
});

test("translated placeholders never use raw String.replace values", () => {
  const violations = sourceFiles(sourceRoot).flatMap((sourcePath) =>
    rawTranslatedPlaceholderReplacements(
      path.relative(sourceRoot, sourcePath),
      readFileSync(sourcePath, "utf8"),
    ),
  );

  expect(violations).toEqual([]);
});
