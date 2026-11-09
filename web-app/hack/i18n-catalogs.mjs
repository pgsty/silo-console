// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
export const appRoot = fileURLToPath(new URL("..", import.meta.url));
export const parts = ["chrome", "help", "screens"];
export function parse(file) {
  return ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
}
// Read literal catalog data without executing translator-supplied TypeScript.
export function dictionary(file) {
  const source = parse(file);
  const data = (node) => {
    while (
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isParenthesizedExpression(node)
    )
      node = node.expression;
    if (ts.isStringLiteralLike(node)) return node.text;
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isObjectLiteralExpression(node)) {
      const entries = node.properties.map((p) => {
        if (
          !ts.isPropertyAssignment(p) ||
          !p.name ||
          !(ts.isStringLiteralLike(p.name) || ts.isIdentifier(p.name))
        )
          throw Error(`Non-literal catalog property in ${file}`);
        return [p.name.text, data(p.initializer)];
      });
      if (new Set(entries.map(([k]) => k)).size !== entries.length)
        throw Error(`Duplicate key in ${file}`);
      return Object.fromEntries(entries);
    }
    throw Error(`Non-literal catalog value in ${file}`);
  };
  let result;
  for (const statement of source.statements)
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations)
        if (declaration.initializer) result = data(declaration.initializer);
      if (result) return result;
    }
  throw Error(`Missing dictionary in ${file}`);
}
export function readCatalogs(root = appRoot) {
  const directory = path.join(root, "src/i18n/locales");
  return Object.fromEntries(
    fs
      .readdirSync(directory, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => [
        d.name,
        Object.fromEntries(
          parts.map((part) => [
            part,
            dictionary(path.join(directory, d.name, `${part}.ts`)),
          ]),
        ),
      ]),
  );
}
export function sourceFiles(directory = path.join(appRoot, "src")) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((d) => {
      const file = path.join(directory, d.name);
      return d.isDirectory()
        ? sourceFiles(file)
        : /\.(?:[jt]sx?|json)$/.test(file)
          ? [file]
          : [];
    })
    .sort();
}
export const placeholders = (text) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
export function validateCatalogs(catalogs, registry) {
  const errors = [];
  const expected = Object.entries(registry)
    .filter(([, spec]) => spec.tier !== "source")
    .map(([lang]) => lang)
    .sort();
  if (JSON.stringify(Object.keys(catalogs).sort()) !== JSON.stringify(expected))
    errors.push("Registry and catalog directories do not match");
  for (const [language, spec] of Object.entries(registry)) {
    try {
      if (Intl.getCanonicalLocales(spec.tag).length !== 1) throw Error();
    } catch {
      errors.push(`${language}: invalid locale tag`);
    }
    if (!["ltr", "rtl"].includes(spec.dir))
      errors.push(`${language}: invalid direction`);
    if (spec.tier === "source") continue;
    for (const part of parts) {
      const reference = catalogs.zh[part];
      const dictionary = catalogs[language]?.[part] ?? {};
      for (const [key, value] of Object.entries(dictionary)) {
        const location = `${language}/${part}: ${key}`;
        if (!Object.prototype.hasOwnProperty.call(reference, key))
          errors.push(`${location}: unknown key or wrong partition`);
        const forms =
          typeof value === "string" ? [value] : Object.values(value);
        if (
          !forms.length ||
          forms.some(
            (text) =>
              typeof text !== "string" ||
              (!text.trim() && reference[key]?.trim?.()),
          )
        )
          errors.push(`${location}: empty or invalid translation`);
        for (const text of forms)
          if (
            typeof text === "string" &&
            JSON.stringify(placeholders(text)) !==
              JSON.stringify(placeholders(key))
          )
            errors.push(`${location}: placeholder mismatch`);
        if (typeof value !== "string") {
          const categories = new Intl.PluralRules(spec.tag).resolvedOptions()
            .pluralCategories;
          for (const form of categories)
            if (!value[form])
              errors.push(`${location}: missing plural form ${form}`);
          for (const form of Object.keys(value))
            if (!["zero", "one", "two", "few", "many", "other"].includes(form))
              errors.push(`${location}: invalid plural form ${form}`);
        }
      }
    }
  }
  return errors;
}
