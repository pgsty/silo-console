// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later
import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/", import.meta.url));
// Literal protocol/command tokens, product/legal names, and version notation.
// Do not add prose here: put it through useT/translate instead.
const technical = new Set([
  "SSE-KMS",
  "SSE-S3",
  "YES, PROCEED",
  "v",
  "mc share",
  "mc du --versions",
  "mc du",
  "--versions",
  "df",
  "GET",
  "PUT",
  "/s.",
  "Amazon S3",
  "Google Cloud Storage",
  "Microsoft Azure Blob Storage",
  "SILO",
  "MinIO",
  "Pigsty",
  "PIGSTY",
  "GitHub",
  "AGPLv3",
  "MinIO, Inc.",
  "MINIO®",
  "AGPL-3.0-or-later",
  "pgsty/silo",
  "pgsty/mc",
  "pgsty/silo-console",
  "georgmangold/console",
  "CREDITS",
  "NOTICE",
  "S",
  "I",
  "nterface ·",
  "L",
  "ibre",
  "O",
  "bject Store",
]);
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name))
        : [path.join(dir, entry.name)],
    );
export function uiSourceViolations(sourceRoot = root) {
  const errors = [];
  for (const file of walk(sourceRoot).filter((f) => f.endsWith(".tsx"))) {
    // Internal component/icon catalogues display API identifiers as examples.
    if (/\/(IconsScreen|ComponentsScreen)\.tsx$/.test(file)) continue;
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const report = (node, message) =>
      errors.push(
        `${path.relative(root, file)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}: ${message}`,
      );
    function visit(node) {
      if (ts.isJsxText(node)) {
        const value = node.text.trim().replace(/\s+/g, " ");
        if (
          /[a-z]/i.test(value.replace(/&\w+;/g, "")) &&
          !/^(&\w+;\s*)+$/.test(value) &&
          !technical.has(value)
        )
          report(node, `Untranslated UI text: ${value}`);
      }
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(source);
        const attributes = node.attributes.properties;
        for (const attr of attributes) {
          if (
            !ts.isJsxAttribute(attr) ||
            attr.name.getText(source) !== "aria-label" ||
            !attr.initializer
          )
            continue;
          const value = ts.isJsxExpression(attr.initializer)
            ? attr.initializer.expression
            : attr.initializer;
          if (
            value &&
            ts.isStringLiteral(value) &&
            (!value.text.trim() || !technical.has(value.text))
          )
            report(
              attr,
              "Accessible labels must be localized, not literal UI text",
            );
        }
        if (
          [
            "Button",
            "IconButton",
            "ObjectHandledCloseButton",
            "button",
          ].includes(tag)
        ) {
          const named = attributes.some(
            (attr) =>
              ts.isJsxAttribute(attr) &&
              ["aria-label", "aria-labelledby", "label"].includes(
                attr.name.getText(source),
              ),
          );
          const element = ts.isJsxOpeningElement(node) ? node.parent : node;
          const text = element.children?.some(
            (child) =>
              (ts.isJsxText(child) && child.text.trim()) ||
              (ts.isJsxExpression(child) &&
                /\bt\(/.test(child.getText(source))),
          );
          if (!named && !text)
            report(
              node,
              "Icon control requires an explicit localized accessible name",
            );
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  return errors;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = uiSourceViolations();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  }
}
