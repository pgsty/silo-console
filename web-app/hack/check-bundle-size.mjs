#!/usr/bin/env node
// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync, gzipSync } from "fflate";

// Decimal KB, using the same gzip settings as gzip-embed.mjs.
// Ten UI languages are bundled statically. This explicitly trades ~0.57 MB
// of compressed catalogs for synchronous, offline language switching. Keep
// the aggregate language budget independent of the per-chunk budget.
export const BUDGETS = {
  loginInitial: 850_000,
  chunk: 350_000,
  languages: 630_000,
};

/** @param {Record<string, {file: string, imports?: string[], isEntry?: boolean}>} manifest */
export function initialFiles(manifest) {
  if (!manifest["index.html"]?.isEntry) {
    throw new Error("Missing index.html entry in the Vite manifest");
  }
  const visited = new Set();
  const files = new Set();
  const visit = (key) => {
    if (visited.has(key)) return;
    const chunk = manifest[key];
    if (!chunk) throw new Error(`Missing manifest import: ${key}`);
    visited.add(key);
    if (chunk.file.endsWith(".js")) files.add(chunk.file);
    for (const dependency of chunk.imports ?? []) visit(dependency);
  };
  // Login is an eager route in MainRouter: its complete request graph is
  // covered here, while dynamic imports (console, help, previews) stay out.
  visit("index.html");
  if (!files.size) throw new Error("No initial JavaScript in the manifest");
  return files;
}

async function optionalFile(path) {
  try {
    return await readFile(path);
  } catch (error) {
    if (error.code === "ENOENT") return undefined;
    throw error;
  }
}

async function asset(path) {
  const raw = await optionalFile(path);
  const compressed = await optionalFile(`${path}.gz`);
  if (!raw && !compressed) throw new Error(`Missing build file: ${path}`);
  const decoded = compressed ? Buffer.from(gunzipSync(compressed)) : raw;
  if (raw && compressed && !raw.equals(decoded)) {
    throw new Error(`Stale gzip asset: ${path}.gz`);
  }
  return {
    raw: decoded,
    gzip: compressed?.length ?? gzipSync(raw, { level: 9, mtime: 0 }).length,
  };
}

export async function readBundle(buildDirectory) {
  // optimize-embed.sh compresses the manifest too, then deletes its source.
  const { raw } = await asset(join(buildDirectory, ".vite/manifest.json"));
  const manifest = JSON.parse(raw.toString("utf8"));
  const initial = initialFiles(manifest);
  const names = new Set(
    (await readdir(join(buildDirectory, "assets")))
      .filter((name) => /\.js(?:\.gz)?$/.test(name))
      .map((name) => `assets/${name.replace(/\.gz$/, "")}`),
  );
  if (!names.size) throw new Error("No JavaScript assets found");
  const chunks = [];
  for (const file of names) {
    const { gzip } = await asset(join(buildDirectory, file));
    chunks.push({ file, gzip });
  }
  chunks.sort((a, b) => b.gzip - a.gzip || a.file.localeCompare(b.file));
  return { chunks, initial };
}

/**
 * @param {{file: string, gzip: number}[]} chunks
 * @param {Set<string>} initial
 */
export function evaluateBundle(chunks, initial, budgets = BUDGETS) {
  const errors = [];
  const byFile = new Map(chunks.map((chunk) => [chunk.file, chunk]));
  let total = 0;
  for (const file of initial) {
    const chunk = byFile.get(file);
    if (!chunk) {
      errors.push(`Missing initial JavaScript asset: ${file}`);
      continue;
    }
    total += chunk.gzip;
    if (/^(charts|pdf|markdown|editor)[-~]/.test(basename(file))) {
      errors.push(`Lazy vendor loaded by login: ${file}`);
    }
  }
  if (total > budgets.loginInitial) {
    errors.push(`Login initial JS: ${total} bytes > ${budgets.loginInitial}`);
  }
  let languageTotal = 0;
  for (const { file, gzip } of chunks) {
    if (/^languages?[-~]/.test(basename(file))) {
      languageTotal += gzip;
      if (!initial.has(file)) {
        errors.push(`Language asset is not eagerly loaded: ${file}`);
      }
    }
    if (gzip > budgets.chunk) {
      errors.push(`${file}: ${gzip} bytes > ${budgets.chunk}`);
    }
  }
  if (languageTotal > budgets.languages) {
    errors.push(
      `All language assets: ${languageTotal} bytes > ${budgets.languages}`,
    );
  }
  return { total, languageTotal, errors };
}

async function main() {
  const buildDirectory = process.argv[2]
    ? resolve(process.argv[2])
    : fileURLToPath(new URL("../build", import.meta.url));
  const { chunks, initial } = await readBundle(buildDirectory);
  const { total, languageTotal, errors } = evaluateBundle(chunks, initial);
  console.log("gzip KB  Login  JavaScript chunk (largest first)");
  for (const { file, gzip } of chunks) {
    console.log(
      `${(gzip / 1000).toFixed(2).padStart(7)}  ${initial.has(file) ? "  yes" : "     "}  ${file}`,
    );
  }
  console.log(
    `Login initial JS: ${(total / 1000).toFixed(2)} / ${BUDGETS.loginInitial / 1000} KB gzip`,
  );
  console.log(
    `All language assets: ${(languageTotal / 1000).toFixed(2)} / ${BUDGETS.languages / 1000} KB gzip; per chunk: ${BUDGETS.chunk / 1000} KB gzip`,
  );
  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exitCode = 1;
  } else {
    console.log("Bundle budgets passed.");
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
