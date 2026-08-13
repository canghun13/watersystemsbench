import { readdir } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const publicRouteRoots = new Set(["about", "contact", "privacy", "tools", "guides", "reference", "systems"]);
export const runtimeFragmentRoots = new Set(["partials"]);
export const developmentOnlyRoots = new Set(["docs", "tools-qa", ".agents", ".git", ".github", "node_modules"]);
export const developmentOnlyFiles = new Set([".gitignore", "README.md", "handover.md", "package.json", "package-lock.json"]);

export async function walk(dir = root) {
  const output = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

export function repositoryPath(path) {
  return relative(root, path).split(sep).join("/");
}

export function isPublicRouteHtml(path) {
  const rel = repositoryPath(path);
  if (rel === "index.html") return true;
  const [top] = rel.split("/");
  return publicRouteRoots.has(top) && rel.endsWith("/index.html");
}

export function isRuntimeFragmentHtml(path) {
  const [top] = repositoryPath(path).split("/");
  return runtimeFragmentRoots.has(top) && path.endsWith(".html");
}
