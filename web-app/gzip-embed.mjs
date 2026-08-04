import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "fflate";

const buildDirectory = fileURLToPath(new URL("./build", import.meta.url));
const compressibleExtensions = new Set([
  ".css",
  ".ico",
  ".js",
  ".json",
  ".mjs",
  ".svg",
  ".txt",
]);

const listFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));

  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
};

for (const path of await listFiles(buildDirectory)) {
  if (!compressibleExtensions.has(extname(path))) {
    continue;
  }

  const compressed = gzipSync(await readFile(path), { level: 9, mtime: 0 });
  await writeFile(`${path}.gz`, compressed);
  await unlink(path);
}
