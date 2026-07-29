import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expectedDomain = "https://watersystemsbench.com";
const expectedEmail = "canghun13@naver.com";
const expectedGa = "G-7FB08YPX7C";
const errors = [];

async function walk(dir) {
  const output = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

const allFiles = await walk(root);
const publicHtml = allFiles.filter((path) => path.endsWith(`${sep}index.html`) || path === join(root, "index.html"));
if (publicHtml.length !== 51) errors.push(`Expected 51 public HTML files; found ${publicHtml.length}.`);
const categoryCounts = {
  core: publicHtml.filter((file) => !relative(root, file).includes(sep)).length + publicHtml.filter((file) => ["about", "contact", "privacy", "tools", "guides", "reference"].includes(relative(root, dirname(file)))).length,
  systems: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`systems${sep}`)).length,
  tools: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`tools${sep}`)).length,
  guides: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`guides${sep}`)).length,
  reference: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`reference${sep}`)).length
};
for (const [key, expected] of Object.entries({ core: 7, systems: 3, tools: 24, guides: 11, reference: 6 })) {
  if (categoryCounts[key] !== expected) errors.push(`Expected ${expected} ${key} pages; found ${categoryCounts[key]}.`);
}

const titles = new Map();
const descriptions = new Map();
const pageUrls = new Set();

function pagePath(file) {
  if (file === join(root, "index.html")) return "/";
  return `/${relative(root, dirname(file)).split(sep).join("/")}/`;
}

for (const file of publicHtml) {
  const html = await readFile(file, "utf8");
  const route = pagePath(file);
  const expectedCanonical = `${expectedDomain}${route}`;
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)">/i)?.[1];
  const canonicalMatches = [...html.matchAll(/<link rel="canonical" href="([^"]+)">/gi)];
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const robotsCount = (html.match(/<meta name="robots" content="index,follow">/gi) || []).length;
  const gaLoaderCount = (html.match(new RegExp(`googletagmanager\\.com/gtag/js\\?id=${expectedGa}`, "g")) || []).length;
  const gaConfigCount = (html.match(new RegExp(`gtag\\('config', '${expectedGa}'\\)`, "g")) || []).length;
  const schemaText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];

  if (!title) errors.push(`${route}: title missing.`);
  else if (titles.has(title)) errors.push(`${route}: duplicate title also used by ${titles.get(title)}.`);
  else titles.set(title, route);
  if (!description) errors.push(`${route}: meta description missing.`);
  else if (descriptions.has(description)) errors.push(`${route}: duplicate meta description also used by ${descriptions.get(description)}.`);
  else descriptions.set(description, route);
  if (canonicalMatches.length !== 1 || canonicalMatches[0]?.[1] !== expectedCanonical) errors.push(`${route}: canonical must be exactly ${expectedCanonical}.`);
  if (robotsCount !== 1) errors.push(`${route}: robots meta count is ${robotsCount}.`);
  if (h1Count !== 1) errors.push(`${route}: H1 count is ${h1Count}.`);
  if (gaLoaderCount !== 1 || gaConfigCount !== 1) errors.push(`${route}: GA4 must include one loader and one config call.`);
  if (!html.includes(`<meta property="og:url" content="${expectedCanonical}">`)) errors.push(`${route}: Open Graph URL mismatch.`);
  if (!schemaText) errors.push(`${route}: structured data missing.`);
  else {
    try {
      const schema = JSON.parse(schemaText);
      if (!JSON.stringify(schema).includes("BreadcrumbList")) errors.push(`${route}: BreadcrumbList missing.`);
    } catch (error) {
      errors.push(`${route}: invalid JSON-LD (${error.message}).`);
    }
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) errors.push(`${route}: duplicate IDs ${[...new Set(duplicates)].join(", ")}.`);
  if (/(?:href|src)="(?:|#)"/i.test(html)) errors.push(`${route}: empty or hash-only link found.`);
  pageUrls.add(expectedCanonical);
}

const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
if (sitemapUrls.size !== 51) errors.push(`Sitemap contains ${sitemapUrls.size} unique URLs, expected 51.`);
for (const url of pageUrls) if (!sitemapUrls.has(url)) errors.push(`Sitemap missing ${url}.`);
for (const url of sitemapUrls) if (!pageUrls.has(url)) errors.push(`Sitemap contains non-public URL ${url}.`);

const robots = await readFile(join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${expectedDomain}/sitemap.xml`) || !robots.includes("Allow: /")) errors.push("robots.txt is incomplete.");
const llms = await readFile(join(root, "llms.txt"), "utf8");
if (!llms.includes("https://github.com/canghun13/watersystemsbench") || !llms.includes(expectedEmail)) errors.push("llms.txt lacks repository or contact.");

const syntaxFiles = allFiles.filter((path) => [".js", ".mjs"].includes(extname(path)));
for (const file of syntaxFiles) {
  const check = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (check.status !== 0) errors.push(`${relative(root, file)}: JavaScript syntax failed: ${check.stderr.trim()}`);
}

const textFiles = allFiles.filter((path) => [".html", ".js", ".mjs", ".css", ".md", ".txt", ".xml", ".json"].includes(extname(path)));
const forbidden = [
  ["example domain", /example\.com/i],
  ["filler text", new RegExp("lorem" + " ipsum", "i")],
  ["temporary marker", /place\s*holder/i],
  ["other project brand", new RegExp(["Reliability" + "Bench", "Plastics" + "Calc", "Maker Print" + " Tools", "Print Production" + " Lab"].join("|"), "i")],
  ["absolute Windows path", /[A-Z]:\\Users\\/i]
];
for (const file of textFiles) {
  const text = await readFile(file, "utf8");
  for (const [label, pattern] of forbidden) if (pattern.test(text)) errors.push(`${relative(root, file)}: ${label} found.`);
  for (const match of text.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) if (match[0].toLowerCase() !== expectedEmail) errors.push(`${relative(root, file)}: unexpected email ${match[0]}.`);
  for (const match of text.matchAll(/\bG-[A-Z0-9]+\b/g)) if (match[0] !== expectedGa) errors.push(`${relative(root, file)}: unexpected GA ID ${match[0]}.`);
}

if (errors.length) {
  console.error(`Static QA failed with ${errors.length} issue(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Static QA passed: ${publicHtml.length} pages, unique metadata, valid JSON-LD, exact GA4, sitemap parity, clean JavaScript and repository string scan.`);
