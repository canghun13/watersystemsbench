import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { isPublicRouteHtml } from "./public-boundary.mjs";

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
const publicHtml = allFiles.filter(isPublicRouteHtml);
if (publicHtml.length !== 83) errors.push(`Expected 83 public HTML files; found ${publicHtml.length}.`);
const categoryCounts = {
  core: publicHtml.filter((file) => !relative(root, file).includes(sep)).length + publicHtml.filter((file) => ["about", "contact", "privacy", "tools", "guides", "reference"].includes(relative(root, dirname(file)))).length,
  systems: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`systems${sep}`)).length,
  tools: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`tools${sep}`)).length,
  guides: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`guides${sep}`)).length,
  reference: publicHtml.filter((file) => relative(root, dirname(file)).split(sep).length === 2 && relative(root, file).startsWith(`reference${sep}`)).length
};
for (const [key, expected] of Object.entries({ core: 7, systems: 6, tools: 42, guides: 18, reference: 10 })) {
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
  if (/(?:href|src)=["']\/docs(?:\/|["'])/i.test(html)) errors.push(`${route}: development-only /docs/ link found.`);
  pageUrls.add(expectedCanonical);
}

const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
if (sitemapUrls.size !== 83) errors.push(`Sitemap contains ${sitemapUrls.size} unique URLs, expected 83.`);
for (const url of pageUrls) if (!sitemapUrls.has(url)) errors.push(`Sitemap missing ${url}.`);
for (const url of sitemapUrls) if (!pageUrls.has(url)) errors.push(`Sitemap contains non-public URL ${url}.`);

const robots = await readFile(join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${expectedDomain}/sitemap.xml`) || !robots.includes("Allow: /")) errors.push("robots.txt is incomplete.");
const llms = await readFile(join(root, "llms.txt"), "utf8");
if (!llms.includes("https://github.com/canghun13/watersystemsbench") || !llms.includes(expectedEmail)) errors.push("llms.txt lacks repository or contact.");
if (!llms.includes("/systems/water-treatment-quality/") || !llms.includes("Chemical dose and CT tools use user-supplied targets")) errors.push("llms.txt lacks treatment workflow or safety boundary.");
if (!llms.includes("/systems/greywater-reuse/") || !llms.includes("Greywater tools never approve a source")) errors.push("llms.txt lacks greywater workflow or safety boundary.");
if (!llms.includes("/systems/vehicle-wash-water-reclaim/") || !llms.includes("Vehicle-wash tools never select treatment")) errors.push("llms.txt lacks vehicle-wash workflow or safety boundary.");
if (/watersystemsbench\.com\/docs\//i.test(llms)) errors.push("llms.txt must not expose development-only /docs/ URLs.");

const home = await readFile(join(root, "index.html"), "utf8");
const userManagedBadgeBlock = `<div class="page-shell" style="padding:30px 0;text-align:center;">
    <a href="https://kittylaunch.com/p/water-systems-bench" target="_blank" rel="noopener" style="display:inline-block;margin:0 2px;">
      <img src="https://kittylaunch.com/api/public/badges/launch_badge.svg?theme=light&name=Water%20Systems%20Bench" alt="Water Systems Bench on KittyLaunch" data-kittylaunch-badge="1" style="margin:0 2px;height:36px;" />
    </a>
    <a href="https://sellwithboost.com" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 2px;">
    \t<img src="https://sellwithboost.com/badge/listing.svg" alt="Listed on Sell With boost" style="height: 36px; width: auto;" />
    </a>
    <a href="https://twelve.tools" target="_blank" style="display:inline-block;margin:0 2px;">
      <img src="https://twelve.tools/badge0-white.svg" alt="Featured on Twelve Tools" height="36px">
    </a>
    <a href="https://findly.tools/watersystemsbench?utm_source=watersystemsbench" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 2px;">
      <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on Findly.tools" height="36px" />
    </a>
    <a href="https://boostdomainrating.com/item/watersystemsbench.com?utm_source=badge" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 2px;">
    \t<img src="https://boostdomainrating.com/api/badge/watersystemsbench.com" alt="Water Systems Bench - Domain Rating" style="height: 36px; width: auto;"/>
    </a>
  </div>`;
if (!home.includes(userManagedBadgeBlock)) errors.push("Homepage user-managed directory badge block changed or is missing.");
for (const file of publicHtml.filter((file) => file !== join(root, "index.html"))) {
  if ((await readFile(file, "utf8")).includes("data-kittylaunch-badge")) {
    errors.push("KittyLaunch badge must not be copied to other pages.");
    break;
  }
}

const toolsHub = await readFile(join(root, "tools", "index.html"), "utf8");
for (const marker of [
  'href="/assets/css/tool-finder.css"',
  'src="/assets/js/tool-finder.js"',
  "data-tool-finder",
  "data-tool-search",
  'placeholder="Search pressure, reclaim, cost..."',
  "data-tool-system",
  "data-tool-type",
  'data-tool-count role="status" aria-live="polite"',
  "data-tool-empty hidden"
]) {
  if (!toolsHub.includes(marker)) errors.push(`/tools/: finder contract is missing ${marker}.`);
}
if ((toolsHub.match(/data-tool-card(?:\s|>)/g) || []).length !== 42) errors.push("/tools/: finder must contain exactly 42 tool cards.");
if ((toolsHub.match(/data-system="(?:pumps|wells|irrigation|treatment|greywater|vehicle-wash)"/g) || []).length !== 42) errors.push("/tools/: every tool card must have one known system filter value.");
if ((toolsHub.match(/data-type="(?:calculator|planner|checker|comparator|estimator|troubleshooter|analyzer|simulator|selector)"/g) || []).length !== 42) errors.push("/tools/: every tool card must have one known tool-type filter value.");

const availableFlowTest = await readFile(join(root, "tools", "available-water-flow-test-calculator", "index.html"), "utf8");
for (const marker of [
  "Run a reliable bucket flow test",
  "Use a water meter difference",
  "Interpret the measured flow",
  "Bucket / container fill test",
  "Water meter volume difference",
  "use the same volume for every repeat trial",
  "less than about 10 seconds",
  "not an automatic design allowance"
]) {
  if (!availableFlowTest.includes(marker)) errors.push(`/tools/available-water-flow-test-calculator/: measurement workflow is missing ${marker}.`);
}
if (!availableFlowTest.includes('<link rel="canonical" href="https://watersystemsbench.com/tools/available-water-flow-test-calculator/">') || !availableFlowTest.includes("<h1>Available Water Flow Test Calculator</h1>")) {
  errors.push("/tools/available-water-flow-test-calculator/: canonical URL and established H1 must remain unchanged.");
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

const greywaterToolRoutes = [
  "/tools/greywater-supply-calculator/",
  "/tools/greywater-irrigation-demand-planner/",
  "/tools/laundry-to-landscape-zone-planner/",
  "/tools/greywater-surge-basin-checker/",
  "/tools/greywater-reuse-savings-calculator/"
];
for (const route of greywaterToolRoutes) {
  const html = await readFile(join(root, route.slice(1), "index.html"), "utf8");
  if (!html.includes('data-tool-form="greywater-')) errors.push(`${route}: greywater form missing.`);
  if (!html.includes('aria-live="polite"')) errors.push(`${route}: aria-live result missing.`);
  if (!html.includes("<h2>Sources</h2>") || !html.includes("source-list")) errors.push(`${route}: authoritative sources missing.`);
  if (!html.includes("Safety and review boundary") || !/non-potable|wastewater|cross-connection|local/i.test(html)) errors.push(`${route}: greywater safety boundary missing.`);
}

const vehicleWashToolRoutes = [
  "/tools/vehicle-wash-water-use-audit-calculator/",
  "/tools/wash-water-reclaim-balance-planner/",
  "/tools/reclaim-buffer-tank-simulator/",
  "/tools/spot-free-rinse-ro-production-planner/",
  "/tools/vehicle-wash-reclaim-savings-calculator/"
];
for (const route of vehicleWashToolRoutes) {
  const html = await readFile(join(root, route.slice(1), "index.html"), "utf8");
  if (!html.includes('data-tool-form="vehicle-wash-')) errors.push(`${route}: vehicle-wash form missing.`);
  if (!html.includes('aria-live="polite"')) errors.push(`${route}: aria-live result missing.`);
  if (!html.includes("<h2>Sources</h2>") || !html.includes("source-list")) errors.push(`${route}: authoritative sources missing.`);
  if (!html.includes("Safety and review boundary") || !/wastewater|discharge|cross-connection|treatment/i.test(html)) errors.push(`${route}: vehicle-wash safety boundary missing.`);
}

const vehicleWashStreamMap = await readFile(join(root, "reference", "vehicle-wash-water-stream-map", "index.html"), "utf8");
if (!vehicleWashStreamMap.includes('<div class="table-scroll" role="region" aria-label="Vehicle wash water stream map" tabindex="0" style="--table-min-width: 760px;"><table>')) {
  errors.push("/reference/vehicle-wash-water-stream-map/: stream map must use its labelled, keyboard-focusable responsive table wrapper.");
}

const greywaterScreening = await readFile(join(root, "reference", "greywater-source-use-screening", "index.html"), "utf8");
for (const [label, minWidth] of [["Source screening", "760px"], ["End-use screening", "700px"]]) {
  const wrapper = `<div class="table-scroll" role="region" aria-label="${label} table" tabindex="0" style="--table-min-width: ${minWidth};"><table>`;
  if (!greywaterScreening.includes(wrapper)) errors.push(`/reference/greywater-source-use-screening/: ${label} must use its labelled, keyboard-focusable responsive table wrapper.`);
}
const contentCss = await readFile(join(root, "assets", "css", "content.css"), "utf8");
if (!contentCss.includes(".table-scroll { width: 100%; max-width: 100%;") || !contentCss.includes("overflow-x: auto") || !contentCss.includes(".table-scroll > table { width: 100%; min-width: var(--table-min-width, 680px);")) {
  errors.push("Responsive table wrapper CSS must retain an internal horizontal scroll area and a readable minimum table width.");
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
  ["temporary marker", new RegExp("\\b(?:placeholder (?:page|content|copy)|replace" + " me)\\b", "i")],
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
