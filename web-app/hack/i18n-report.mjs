#!/usr/bin/env node
// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
import path from "node:path";
import ts from "typescript";
import {
  appRoot,
  readCatalogs,
  parts,
  dictionary,
  parse,
  sourceFiles,
  validateCatalogs,
} from "./i18n-catalogs.mjs";
const catalogs = readCatalogs();
const registry = dictionary(path.join(appRoot, "src/i18n/locales.ts"));
const errors = validateCatalogs(catalogs, registry);
const locations = new Map();
for (const file of sourceFiles().filter((file) => !file.includes("/i18n/"))) {
  const source = parse(file);
  const visit = (node) => {
    if (ts.isStringLiteralLike(node)) {
      const list = locations.get(node.text) ?? [];
      list.push(
        `${path.relative(appRoot, file)}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}`,
      );
      locations.set(node.text, list);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
const reports = Object.entries(registry)
  .filter(([, spec]) => spec.tier !== "source")
  .map(([language, spec]) => {
    const missing = parts.flatMap((part) =>
      Object.keys(catalogs.zh[part])
        .filter(
          (key) =>
            !Object.prototype.hasOwnProperty.call(
              catalogs[language]?.[part] ?? {},
              key,
            ),
        )
        .map((key) => ({
          part,
          key,
          chinese: catalogs.zh[part][key],
          locations: locations.get(key) ?? [],
        })),
    );
    const total = parts.reduce(
      (n, part) => n + Object.keys(catalogs.zh[part]).length,
      0,
    );
    return {
      language,
      tier: spec.tier,
      translated: total - missing.length,
      total,
      coverage: (((total - missing.length) * 100) / total).toFixed(2) + "%",
      missing,
    };
  });
if (process.argv.includes("--json"))
  console.log(JSON.stringify({ reports, errors }, null, 2));
else {
  for (const { language, tier, translated, total, coverage } of reports)
    console.log(
      `${language.padEnd(6)} ${tier.padEnd(10)} ${translated}/${total} ${coverage}`,
    );
  for (const error of errors) console.error(error);
  console.log(
    "Missing maintained translations fall back to English; Chinese coverage is enforced by i18n-coverage.unit.ts.",
  );
}
if (errors.length) process.exitCode = 1;
