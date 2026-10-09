// Non-executing production checks: no analytics scripts or source links are run.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
const root = fileURLToPath(new URL("..", import.meta.url));
const domain = "https://watersystemsbench.com";
const hash = text => createHash("sha256").update(text.replace(/\r\n/g, "\n")).digest("hex");
const date = process.env.WSB_QA_DATE || "2026-10-09";
const results = { date, checkedAt: new Date().toISOString(), requests: [], analyticsExecuted: 0 };
async function get(path, options = {}) {
  const url = path.startsWith("http") ? path : `${domain}${path}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(20000), ...options });
  const text = await response.text();
  results.requests.push({ url, status: response.status, finalUrl: response.url, sha256: hash(text), xRobots: response.headers.get("x-robots-tag") });
  return { response, text };
}
try {
  const redirect = await get("http://watersystemsbench.com/", { redirect: "manual" });
  assert.equal(redirect.response.status, 301); assert.equal(redirect.response.headers.get("location"), `${domain}/`);
  for (const path of ["/", "/tools/", "/guides/reduce-metal-finishing-rinse-water/",
    "/tools/rinse-conductivity-log-analyzer/", "/tools/countercurrent-rinse-flow-planner/",
    "/tools/groundwater-stabilization-log-analyzer/"]) {
    const { response, text } = await get(path); assert.equal(response.status, 200);
    const local = await readFile(join(root, path === "/" ? "index.html" : `${path.slice(1)}index.html`), "utf8");
    assert.equal(hash(text), hash(local), `${path} production/local parity`);
    assert.ok(text.includes(`<link rel="canonical" href="${domain}${path}">`));
    assert.ok(text.includes('content="index,follow"')); assert.ok(!/noindex/i.test(response.headers.get("x-robots-tag") || ""));
    assert.equal((text.match(/gtag\('config', 'G-7FB08YPX7C'\)/g) || []).length, 1);
    if (path === "/guides/reduce-metal-finishing-rinse-water/") for (const marker of ["Understand the conductivity control loop", "duration, not cumulative clock time", "1,640 m³/year", '"dateModified":"2026-10-09"']) assert.ok(text.includes(marker), marker);
    if (path === "/") for (const badge of ["kittylaunch", "sellwithboost", "twelve.tools", "findly", "boostdomainrating"]) assert.ok(text.toLowerCase().includes(badge), badge);
  }
  const finder = await get("/assets/js/tool-finder.js"); assert.equal(finder.response.status, 200);
  assert.ok(finder.text.includes("requestAnimationFrame(update)")); assert.ok(!finder.text.includes("queueMicrotask(update)"));
  assert.equal(hash(finder.text), hash(await readFile(join(root, "assets/js/tool-finder.js"), "utf8")));
  const sitemap = await get("/sitemap.xml"); assert.equal(sitemap.response.status, 200);
  assert.equal((sitemap.text.match(/<loc>/g) || []).length, 98); assert.ok(!sitemap.text.includes("/docs/"));
  assert.equal(hash(sitemap.text), hash(await readFile(join(root, "sitemap.xml"), "utf8")));
  assert.ok(sitemap.text.includes("<loc>https://watersystemsbench.com/guides/reduce-metal-finishing-rinse-water/</loc><lastmod>2026-10-09</lastmod>"));
  const robots = await get("/robots.txt"); assert.equal(robots.response.status, 200); assert.ok(robots.text.includes("Allow: /")); assert.ok(robots.text.includes(`${domain}/sitemap.xml`));
  for (const path of ["/docs/", "/docs/weekly-growth-review-2026-10-01", "/docs/weekly-growth-review-2026-10-01.html", "/docs/weekly-growth-review-2026-10-01.md", "/docs/page-inventory.html", "/docs/information-architecture.html", "/docs/project-plan.html", "/docs/metal-finishing-rinse-water-expansion.html", "/handover.html", "/tools-qa/weekly-growth-qa.mjs"]) assert.equal((await get(path)).response.status, 404, path);
  for (const extension of ["", ".html", ".md"]) assert.equal((await get(`/docs/weekly-growth-review-${date}${extension}`)).response.status, 404);
  const bot = await get("/tools/", { headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" } });
  assert.equal(bot.response.status, 200); assert.equal(hash(bot.text), hash(await readFile(join(root, "tools/index.html"), "utf8")));
  const guideBot = await get("/guides/reduce-metal-finishing-rinse-water/", { headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" } });
  assert.equal(guideBot.response.status, 200); assert.equal(hash(guideBot.text), hash(await readFile(join(root, "guides/reduce-metal-finishing-rinse-water/index.html"), "utf8")));
  results.result = "passed";
} catch (error) { results.result = "failed"; results.failure = error.stack; process.exitCode = 1; }
await writeFile(process.env.WSB_QA_REPORT || join(root, "tools-qa/weekly-growth-live-results.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
