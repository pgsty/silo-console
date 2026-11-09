// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { gzipSync } from "fflate";
import {
  BUDGETS,
  evaluateBundle,
  initialFiles,
  readBundle,
} from "../hack/check-bundle-size.mjs";

const manifest = {
  "index.html": {
    file: "assets/index.js",
    isEntry: true,
    imports: ["shared", "duplicate"],
    dynamicImports: ["lazy"],
  },
  shared: { file: "assets/shared.js", imports: ["index.html"] },
  duplicate: { file: "assets/shared.js" },
  lazy: { file: "assets/editor-lazy.js" },
};

async function fixture(directory: string) {
  await mkdir(join(directory, "assets"), { recursive: true });
  await mkdir(join(directory, ".vite"), { recursive: true });
  await writeFile(
    join(directory, ".vite/manifest.json"),
    JSON.stringify(manifest),
  );
  await writeFile(join(directory, "assets/index.js"), "import './shared.js';");
  await writeFile(join(directory, "assets/shared.js"), "export const n = 1;");
  await writeFile(
    join(directory, "assets/editor-lazy.js"),
    "export default 2;",
  );
}

test("initial graph follows static imports, deduplicates files and handles cycles", () => {
  expect([...initialFiles(manifest)].sort()).toEqual([
    "assets/index.js",
    "assets/shared.js",
  ]);
  expect(() => initialFiles({})).toThrow("Missing index.html entry");
  expect(() => initialFiles({ "index.html": manifest["index.html"] })).toThrow(
    "Missing manifest import: shared",
  );
});

test("gzip limits are inclusive and cover lazy chunks as well as login", () => {
  const initial = new Set(["assets/languages-hash.js", "assets/index.js"]);
  const chunks = [
    { file: "assets/languages-hash.js", gzip: BUDGETS.languages },
    { file: "assets/index.js", gzip: BUDGETS.loginInitial - BUDGETS.languages },
    { file: "assets/editor-lazy.js", gzip: BUDGETS.chunk },
  ];
  expect(evaluateBundle(chunks, initial).errors).toEqual([]);
  chunks[1].gzip++;
  chunks[2].gzip++;
  const result = evaluateBundle(chunks, initial);
  expect(result.total).toBe(BUDGETS.loginInitial + 1);
  expect(result.errors).toHaveLength(2);
  expect(result.errors[0]).toContain("Login initial JS");
  expect(result.errors[1]).toContain("editor-lazy.js");
});

test("missing assets and heavy vendors in login fail even below the size limits", () => {
  for (const vendor of ["charts", "pdf", "markdown", "editor"]) {
    const file = `assets/${vendor}-hash.js`;
    expect(evaluateBundle([{ file, gzip: 1 }], new Set([file])).errors).toEqual(
      [`Lazy vendor loaded by login: ${file}`],
    );
  }
  expect(evaluateBundle([], new Set(["assets/missing.js"])).errors).toEqual([
    "Missing initial JavaScript asset: assets/missing.js",
  ]);
});

test("raw and optimized gzip-only builds have identical sorted sizes", async ({}, testInfo) => {
  const directory = testInfo.outputPath("build");
  await fixture(directory);
  const before = await readBundle(directory);
  for (const file of [
    ".vite/manifest.json",
    "assets/index.js",
    "assets/shared.js",
    "assets/editor-lazy.js",
  ]) {
    const path = join(directory, file);
    await writeFile(
      `${path}.gz`,
      gzipSync(await readFile(path), { level: 9, mtime: 0 }),
    );
    await unlink(path);
  }
  const after = await readBundle(directory);
  expect(after).toEqual(before);
  expect(after.chunks.map((chunk) => chunk.gzip)).toEqual(
    after.chunks.map((chunk) => chunk.gzip).sort((a, b) => b - a),
  );
});

test("a stale gzip cannot undercount a changed JavaScript file", async ({}, testInfo) => {
  const directory = testInfo.outputPath("build");
  await fixture(directory);
  await writeFile(
    join(directory, "assets/index.js.gz"),
    gzipSync(Buffer.from("stale"), { level: 9, mtime: 0 }),
  );
  await expect(readBundle(directory)).rejects.toThrow("Stale gzip asset");
});

test("CLI exits with failure for oversized lazy chunks and missing manifests", async ({}, testInfo) => {
  const directory = testInfo.outputPath("build");
  await fixture(directory);
  const script = resolve("hack/check-bundle-size.mjs");
  const run = () =>
    spawnSync(process.execPath, [script, directory], { encoding: "utf8" });
  expect(run().status).toBe(0);
  await writeFile(
    join(directory, "assets/editor-lazy.js"),
    randomBytes(BUDGETS.chunk + 1000),
  );
  const oversized = run();
  expect(oversized.status).toBe(1);
  expect(oversized.stderr).toContain("editor-lazy.js");
  await unlink(join(directory, ".vite/manifest.json"));
  const missing = run();
  expect(missing.status).toBe(1);
  expect(missing.stderr).toContain("Missing build file");
});
