import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { isPublicRouteHtml, isRuntimeFragmentHtml } from "./public-boundary.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

async function walk(dir) {
  const paths = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else paths.push(path);
  }
  return paths;
}

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

const files = await walk(root);
const publicHtml = files.filter(isPublicRouteHtml);
const runtimeFragments = files.filter(isRuntimeFragmentHtml);
const htmlFiles = [...publicHtml, ...runtimeFragments];
if (publicHtml.length !== 83) errors.push(`Expected 83 public HTML pages; found ${publicHtml.length}.`);
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(value)) {
      if (/^https?:\/\/\s*$/.test(value)) errors.push(`${relative(root, file)}: malformed external URL.`);
      continue;
    }
    const clean = value.split(/[?#]/)[0];
    if (!clean) continue;
    let target;
    if (clean.startsWith("/")) {
      target = join(root, clean.slice(1));
    } else {
      target = resolve(dirname(file), clean);
    }
    if (clean.endsWith("/")) target = join(target, "index.html");
    if (!await exists(target)) errors.push(`${relative(root, file)}: missing local target ${value}.`);
  }
}

if (errors.length) {
  console.error(`Navigation QA failed with ${errors.length} issue(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Navigation QA passed: ${publicHtml.length} public HTML pages and ${runtimeFragments.length} runtime fragments; local links and assets resolved without treating development docs as public routes.`);
