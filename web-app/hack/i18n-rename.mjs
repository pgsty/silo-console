#!/usr/bin/env node
// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { appRoot, parse, sourceFiles, placeholders } from "./i18n-catalogs.mjs";

const propertyName = (node) =>
  node && (ts.isStringLiteralLike(node) || ts.isIdentifier(node))
    ? node.text
    : undefined;
const uiArgument = (node) => {
  const call = node.parent;
  if (!ts.isCallExpression(call) || !ts.isIdentifier(call.expression))
    return false;
  const index = call.arguments.indexOf(node);
  switch (call.expression.text) {
    case "t":
    case "i18nKey":
      return index === 0;
    case "translate":
    case "translateLegend":
      return index === 1;
    case "tn":
      return index === 1 || index === 2;
    case "translatePlural":
      return index === 2 || index === 3;
    default:
      return false;
  }
};

// Plan everything before writing: a collision in one language must not leave
// earlier files half-migrated. Do not rename API values or translated values.
export function planRename(root, from, to) {
  if (!from || !to || from === to) throw Error("Specify two different keys");
  if (JSON.stringify(placeholders(from)) !== JSON.stringify(placeholders(to)))
    throw Error(
      "Placeholder changes require reviewed translations, not a key rename",
    );
  const changes = [];
  for (const file of sourceFiles(path.join(root, "src"))) {
    const source = parse(file),
      edits = [];
    const catalog = file.includes("/i18n/locales/");
    const help = file.endsWith("/screens/Console/helpTopics.json");
    const visit = (node) => {
      if (catalog && ts.isObjectLiteralExpression(node)) {
        const names = node.properties
          .filter(ts.isPropertyAssignment)
          .map((property) => propertyName(property.name));
        if (names.includes(from) && names.includes(to))
          throw Error(`Destination key already exists: ${file}`);
      }
      if (
        catalog &&
        ts.isPropertyAssignment(node) &&
        propertyName(node.name) === from
      ) {
        edits.push([node.name.getStart(source), node.name.end]);
      } else if (
        !catalog &&
        ts.isStringLiteralLike(node) &&
        node.text === from
      ) {
        const helpText =
          help &&
          ts.isPropertyAssignment(node.parent) &&
          node.parent.initializer === node &&
          ["title", "body", "header"].includes(propertyName(node.parent.name));
        if (uiArgument(node) || helpText)
          edits.push([node.getStart(source), node.end]);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    if (edits.length) {
      let text = source.text;
      for (const [start, end] of edits.sort((a, b) => b[0] - a[0]))
        text = text.slice(0, start) + JSON.stringify(to) + text.slice(end);
      changes.push({ file, text, count: edits.length });
    }
  }
  if (!changes.length) throw Error("No matching UI source key");
  return changes;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const [from, to, ...flags] = process.argv.slice(2);
  if (flags.some((flag) => flag !== "--write"))
    throw Error(
      "Usage: yarn i18n:rename 'Old English key' 'New English key' [--write]",
    );
  const changes = planRename(appRoot, from, to);
  for (const { file, text, count } of changes) {
    console.log(
      `${flags.includes("--write") ? "updated" : "would update"} ${path.relative(appRoot, file)} (${count})`,
    );
    if (flags.includes("--write")) fs.writeFileSync(file, text);
  }
}
