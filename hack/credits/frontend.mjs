#!/usr/bin/env node
// Emit the "Frontend runtime" credits section: every package in the production
// dependency closure of web-app/package.json as installed under
// web-app/node_modules (the code Vite bundles into web-app/build), plus the
// font families listed in web-app/licenses/fonts.json. The output is stable
// (sorted, normalized) so `go run ./hack/credits check --frontend` can compare
// it byte for byte. Fails when a package has no legal file and no declared
// license, or when a listed font text is missing.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const webApp = join(repo, "web-app");
const nodeModules = join(webApp, "node_modules");

const SEPARATOR = "=".repeat(64);
const FILE_SEPARATOR = "-".repeat(64);
const STEMS = ["LICENSE", "LICENCE", "COPYING", "UNLICENSE", "NOTICE"];
const SOURCE_EXTENSIONS = new Set([
  "go", "py", "js", "mjs", "cjs", "ts", "tsx", "jsx", "sh", "rs", "c", "h", "cpp", "cc", "java", "rb", "php", "pl",
  "yaml", "yml", "json", "toml", "xml", "html", "css", "proto", "s",
]);

const fail = (message) => {
  process.stderr.write(`frontend credits: ${message}\n`);
  process.exit(1);
};

const isLegalFileName = (name) => {
  const upper = name.toUpperCase();
  for (const stem of STEMS) {
    if (!upper.startsWith(stem)) continue;
    const rest = name.slice(stem.length);
    if (rest === "") return true;
    const match = /^[.-]([A-Za-z0-9]+)$/.exec(rest);
    return match !== null && !SOURCE_EXTENSIONS.has(match[1].toLowerCase());
  }
  return false;
};

const normalize = (text) =>
  text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n+$/, "");

// Resolve a dependency the way Node does with a node_modules linker: nearest
// node_modules of the dependent, then its ancestors, ending at web-app.
const resolvePackage = (name, fromDir) => {
  let dir = fromDir;
  for (;;) {
    const candidate = join(dir, "node_modules", name);
    if (existsSync(join(candidate, "package.json"))) return candidate;
    if (dir === webApp) break;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  const hoisted = join(nodeModules, name);
  if (existsSync(join(hoisted, "package.json"))) return hoisted;
  return null;
};

const readJSON = (path) => JSON.parse(readFileSync(path, "utf8"));

const root = readJSON(join(webApp, "package.json"));
const closure = new Map(); // key: name@version -> { name, version, dir, license }
const queue = Object.keys(root.dependencies ?? {}).map((name) => ({ name, from: webApp }));
const seenDirs = new Set();

while (queue.length > 0) {
  const { name, from } = queue.shift();
  const dir = resolvePackage(name, from);
  if (dir === null) fail(`cannot resolve ${name} from ${from}`);
  const real = resolve(dir);
  if (seenDirs.has(real)) continue;
  seenDirs.add(real);
  const manifest = readJSON(join(real, "package.json"));
  const license =
    typeof manifest.license === "string"
      ? manifest.license
      : manifest.license?.type ??
        (Array.isArray(manifest.licenses) ? manifest.licenses.map((l) => l.type ?? l).join(" OR ") : "");
  closure.set(`${manifest.name}@${manifest.version}`, { name: manifest.name, version: manifest.version, dir: real, license });
  for (const dep of Object.keys(manifest.dependencies ?? {})) queue.push({ name: dep, from: real });
  // optionalDependencies that are installed also ship; missing ones are skipped
  for (const dep of Object.keys(manifest.optionalDependencies ?? {})) {
    if (resolvePackage(dep, real) !== null) queue.push({ name: dep, from: real });
  }
}

let out = "";
const keys = [...closure.keys()].sort();
for (const key of keys) {
  const pkg = closure.get(key);
  const files = readdirSync(pkg.dir)
    .filter((entry) => isLegalFileName(entry) && statSync(join(pkg.dir, entry)).isFile())
    .sort();
  if (files.length === 0 && !pkg.license) fail(`${key}: no legal file and no declared license`);
  out += `${pkg.name}@${pkg.version}${pkg.license ? ` (${pkg.license})` : ""}\nhttps://www.npmjs.com/package/${pkg.name}\n${FILE_SEPARATOR}\n`;
  if (files.length === 0) {
    out += `License: ${pkg.license} (declared in package.json; the package ships no license file)\n`;
  }
  files.forEach((file, index) => {
    if (files.length > 1) out += `${index > 0 ? "\n" : ""}-- ${file} --\n`;
    out += normalize(readFileSync(join(pkg.dir, file), "utf8")) + "\n";
  });
  out += `${SEPARATOR}\n\n`;
}

const fonts = readJSON(join(webApp, "licenses", "fonts.json")).fonts;
for (const font of fonts) {
  const textPath = join(webApp, font.text_file);
  if (!existsSync(textPath)) fail(`font ${font.family}: ${font.text_file} is missing`);
  out += `Font: ${font.family} (${font.license})\n${font.source}\nbundled files: ${font.files}\n${FILE_SEPARATOR}\n`;
  out += normalize(readFileSync(textPath, "utf8")) + `\n${SEPARATOR}\n\n`;
}

process.stdout.write(out);
