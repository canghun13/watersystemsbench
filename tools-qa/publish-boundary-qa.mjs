import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import {
  developmentOnlyFiles,
  developmentOnlyRoots,
  isPublicRouteHtml,
  publicRouteRoots,
  repositoryPath,
  root,
  runtimeFragmentRoots,
  walk
} from "./public-boundary.mjs";

const errors = [];
const files = await walk();
const publicHtml = files.filter(isPublicRouteHtml);
const config = await readFile(`${root}/_config.yml`, "utf8");
const excluded = new Set([...config.matchAll(/^\s+-\s+(.+?)\s*$/gm)].map((match) => match[1]));
const requiredExcludes = new Set([...developmentOnlyRoots, ...developmentOnlyFiles]);

for (const entry of requiredExcludes) if (!excluded.has(entry)) errors.push(`_config.yml must exclude ${entry}.`);
if (publicHtml.length !== 83) errors.push(`Production inventory must contain 83 public route HTML files; found ${publicHtml.length}.`);

for (const file of publicHtml) {
  const html = await readFile(file, "utf8");
  if (/(?:href|src)=["']\/docs(?:\/|["'])/i.test(html)) errors.push(`${repositoryPath(file)} links to development-only /docs/.`);
}

for (const [name, path] of [["sitemap.xml", `${root}/sitemap.xml`], ["llms.txt", `${root}/llms.txt`]]) {
  const text = await readFile(path, "utf8");
  if (/watersystemsbench\.com\/docs\/|\]\(\/docs\//i.test(text)) errors.push(`${name} exposes /docs/.`);
}

const publicTopLevelFiles = new Set(["CNAME", "favicon.ico", "favicon.svg", "index.html", "llms.txt", "robots.txt", "sitemap.xml"]);
const simulatedArtifact = files.filter((file) => {
  const rel = repositoryPath(file);
  const [top] = rel.split("/");
  if (excluded.has(top) || excluded.has(rel) || basename(file) === "_config.yml") return false;
  return publicTopLevelFiles.has(rel) || publicRouteRoots.has(top) || runtimeFragmentRoots.has(top) || top === "assets";
});
for (const file of simulatedArtifact) {
  const rel = repositoryPath(file);
  const [top] = rel.split("/");
  if (developmentOnlyRoots.has(top) || developmentOnlyFiles.has(rel)) errors.push(`Simulated production artifact contains ${rel}.`);
}

if (errors.length) {
  console.error(`Publish-boundary QA failed with ${errors.length} issue(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Publish-boundary QA passed: 83 public pages retained; docs, tools-qa, repository planning files and Git metadata excluded from the Jekyll production artifact.`);
