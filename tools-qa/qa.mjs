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
if (publicHtml.length !== 65) errors.push(`Expected 65 public HTML files; found ${publicHtml.length}.`);
const categoryCounts = {
  core: publicHtml.filter((file) => !relative(root, file).includes(sep)).length + publicHtml.filter((file) => ["about", "contact", "privacy", "tools", "guides", "reference"].includes(relative(root, dirname(file)))).length,
  systems: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`systems${sep}`)).length,
  tools: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`tools${sep}`)).length,
  guides: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`guides${sep}`)).length,
  reference: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`reference${sep}`)).length
};
for (const [key, expected] of Object.entries({ core: 7, systems: 4, tools: 32, guides: 14, reference: 8 })) {
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
  if (/coming soon/i.test(html)) errors.push(`${route}: Coming Soon content found on a public page.`);
  pageUrls.add(expectedCanonical);
}

const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
if (sitemapUrls.size !== 65) errors.push(`Sitemap contains ${sitemapUrls.size} unique URLs, expected 65.`);
for (const url of pageUrls) if (!sitemapUrls.has(url)) errors.push(`Sitemap missing ${url}.`);
for (const url of sitemapUrls) if (!pageUrls.has(url)) errors.push(`Sitemap contains non-public URL ${url}.`);

const robots = await readFile(join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${expectedDomain}/sitemap.xml`) || !robots.includes("Allow: /")) errors.push("robots.txt is incomplete.");
const llms = await readFile(join(root, "llms.txt"), "utf8");
if (!llms.includes("https://github.com/canghun13/watersystemsbench") || !llms.includes(expectedEmail)) errors.push("llms.txt lacks repository or contact.");
if (!llms.includes("/systems/water-treatment-quality/") || !llms.includes("Chemical dose and CT tools use user-supplied targets")) errors.push("llms.txt lacks treatment workflow or safety boundary.");

const home = await readFile(join(root, "index.html"), "utf8");
const kittyMarkup = '<a href="https://kittylaunch.com/p/water-systems-bench" target="_blank" rel="noopener" style="display:inline-block;">\n      <img src="https://kittylaunch.com/api/public/badges/launch_badge.svg?theme=light&name=Water%20Systems%20Bench" alt="Water Systems Bench on KittyLaunch" data-kittylaunch-badge="1" style="margin:0 2px;height:36px;" />';
if (!home.includes(kittyMarkup)) errors.push("Homepage user-managed KittyLaunch badge markup changed or is missing.");
for (const file of publicHtml.filter((file) => file !== join(root, "index.html"))) {
  if ((await readFile(file, "utf8")).includes("data-kittylaunch-badge")) {
    errors.push("KittyLaunch badge must not be copied to other pages.");
    break;
  }
}

const treatmentToolRoutes = [
  "/tools/water-softener-sizing-calculator/",
  "/tools/softener-salt-regeneration-planner/",
  "/tools/ro-recovery-reject-water-calculator/",
  "/tools/ro-production-demand-planner/",
  "/tools/media-filter-loading-rate-calculator/",
  "/tools/chlorine-dose-solution-volume-calculator/",
  "/tools/disinfection-contact-time-calculator/",
  "/tools/water-treatment-train-selector/"
];
for (const route of treatmentToolRoutes) {
  const html = await readFile(join(root, route.slice(1), "index.html"), "utf8");
  if (!html.includes('data-tool-form="treatment-')) errors.push(`${route}: treatment form missing.`);
  if (!html.includes('aria-live="polite"')) errors.push(`${route}: aria-live result missing.`);
  if (!html.includes("<h2>Sources</h2>") || !html.includes("source-list")) errors.push(`${route}: authoritative sources missing.`);
  if (!html.includes("Safety and review boundary") || !/potable|drinking-water|chemical|regulatory/i.test(html)) errors.push(`${route}: treatment safety boundary missing.`);
}

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
