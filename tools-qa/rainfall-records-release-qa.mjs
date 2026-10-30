// Non-executing source/HTTP proof; source guard remains anchored to the reviewed baseline.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { rainHub, rainTools, rainGuides, rainReferences } from "./rainfall-records-content.mjs";

const baseline = "c6bc568cf77ea8d0f5e2baf0e3fc0d80c6c85f21";
const domain = "https://watersystemsbench.com";
const newPaths = [rainHub, ...rainTools, ...rainGuides, ...rainReferences].map(x => x[0]);
const indexFiles = new Set(["index.html", "tools/index.html", "guides/index.html", "reference/index.html"]);
const normalized = text => text.replace(/\r\n/g, "\n");
const hash = text => createHash("sha256").update(normalized(text)).digest("hex");
const git = args => execFileSync("git", ["-c", "core.safecrlf=false", ...args], { encoding: "utf8" });
const file = path => path === "/" ? "index.html" : path.endsWith("/") ? path.slice(1) + "index.html" : path.slice(1);
const entries = xml => new Map([...xml.matchAll(/<url><loc>https:\/\/watersystemsbench.com([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)].map(m => [m[1], m[2]]));
const report = { date: "2026-10-30", checkedAt: new Date().toISOString(), baseline, expectedRelease: process.env.WSB_QA_SHA || null, scope: {}, checks: [], analyticsExecuted: 0, complete: false };
const output = process.env.WSB_QA_REPORT || "tools-qa/weekly-growth-2026-10-30-live-results.json";
async function get(path, options = {}) {
  const response = await fetch(path.startsWith("http") ? path : domain + path, { signal: AbortSignal.timeout(25000), ...options });
  const body = await response.text();
  report.checks.push({ path, status: response.status, sha256: hash(body), xRobots: response.headers.get("x-robots-tag") });
  return { response, body };
}
async function parity(path) {
  const r = await get(path);
  assert.equal(r.response.status, 200, path);
  assert.equal(hash(r.body), hash(await readFile(file(path), "utf8")), `${path} production/local source parity`);
  return r;
}
try {
  const oldFiles = git(["ls-tree", "-r", "--name-only", baseline]).trim().split(/\r?\n/);
  const oldHtml = oldFiles.filter(p => p === "index.html" || p.endsWith("/index.html"));
  assert.equal(oldHtml.length, 105);
  for (const path of oldHtml) {
    const previous = git(["show", `${baseline}:${path}`]);
    const current = await readFile(path, "utf8");
    if (!indexFiles.has(path)) assert.equal(hash(current), hash(previous), `${path} must remain unchanged`);
    for (const pattern of [/<title>([^<]+)<\/title>/, /<h1>([^<]+)<\/h1>/, /<link rel="canonical" href="([^"]+)"/]) assert.equal(current.match(pattern)?.[1], previous.match(pattern)?.[1], `${path} original title/H1/canonical`);
  }
  report.scope.unchangedOldPublicHtml = 101;
  report.scope.updatedOldIndexPages = [...indexFiles];
  report.scope.protected = [];
  for (const path of oldFiles.filter(p => /^assets\/.*\.(?:js|css)$/.test(p)).concat(["_config.yml", "CNAME", "robots.txt"])) {
    const current = await readFile(path, "utf8");
    assert.equal(hash(current), hash(git(["show", `${baseline}:${path}`])), `${path} changed outside new assets`);
    report.scope.protected.push({ path, sha256: hash(current) });
  }
  const badgeStart = '  <div class="page-shell" style="padding:30px 0;text-align:center;">';
  const suffix = text => { const index = text.indexOf(badgeStart); assert.ok(index >= 0); return normalized(text.slice(index)); };
  assert.equal(suffix(await readFile("index.html", "utf8")), suffix(git(["show", baseline + ":index.html"])), "exact complete homepage badge wrapper/suffix");
  report.scope.exactFiveBadgeBlock = true;
  for (const [path, indentation] of [["partials/header.html", "          "], ["partials/footer.html", "      "]]) {
    const current = normalized(await readFile(path, "utf8"));
    const insertion = `${indentation}<a href="/systems/rainfall-records-gauge-networks/">Rainfall Records &amp; Gauge Networks</a>\n`;
    assert.equal(current.split(insertion).length, 2);
    assert.equal(current.replace(insertion, ""), normalized(git(["show", `${baseline}:${path}`])), `${path} only adds one system link`);
  }
  const oldMap = entries(git(["show", baseline + ":sitemap.xml"]));
  const newMap = entries(await readFile("sitemap.xml", "utf8"));
  assert.equal(oldMap.size, 105); assert.equal(newMap.size, 112);
  assert.deepEqual([...newMap.keys()].sort(), [...oldMap.keys(), ...newPaths].sort());
  for (const [path, date] of oldMap) assert.equal(newMap.get(path), indexFiles.has(file(path)) ? "2026-10-30" : date, `${path} truthful unchanged/updated date`);
  for (const path of newPaths) assert.equal(newMap.get(path), "2026-10-30");
  report.scope.sitemap = { old: 105, current: 112, onlySevenNewRoutes: true, oldDetailDatesPreserved: true };
  if (process.argv.includes("--scope-only")) { report.complete = true; report.productionNotChecked = true; }
  else {
    const publicPaths = [...newPaths, "/", "/tools/", "/guides/", "/reference/", "/systems/wells-storage-rainwater/", "/tools/pressure-tank-sizing-calculator/", "/tools/groundwater-stabilization-log-analyzer/", "/tools/water-duplicate-rpd-batch-checker/", "/guides/reduce-metal-finishing-rinse-water/", "/guides/well-borehole-tube-well-terminology/"];
    for (const path of publicPaths) {
      const { response, body } = await parity(path);
      assert.ok(body.includes(`<link rel="canonical" href="${domain}${path}"`), path + " canonical");
      assert.ok(body.includes('name="robots" content="index,follow"'), path + " index permission");
      assert.equal((body.match(/gtag\('config', 'G-7FB08YPX7C'\)/g) || []).length, 1, path + " production GA4");
      assert.equal(response.headers.get("x-robots-tag"), null);
    }
    for (const path of ["/assets/js/tools/rainfall-records-tools.js", "/assets/css/rainfall-records.css", "/assets/js/form-utils.js", "/assets/js/tool-finder.js", "/assets/js/tools/pressure-tank-sizing.js", "/partials/header.html", "/partials/footer.html", "/robots.txt", "/sitemap.xml"]) await parity(path);
    for (const path of newPaths) {
      const normal = await get(path), bot = await get(path, { headers: { "User-Agent": "Googlebot" } });
      assert.equal(bot.response.status, 200); assert.equal(hash(normal.body), hash(bot.body), path + " normal/Googlebot parity");
    }
    const redirects = await get("http://watersystemsbench.com/", { redirect: "manual" });
    assert.equal(redirects.response.status, 301); assert.equal(redirects.response.headers.get("location"), domain + "/");
    for (const path of ["/docs/", "/docs/page-inventory.html", "/docs/information-architecture.html", "/docs/project-plan.html", "/docs/weekly-growth-review-2026-10-30.html", "/docs/weekly-growth-review-2026-10-30.md", "/docs/workflow-cluster-discovery-2026-10-30.html", "/docs/workflow-cluster-discovery-2026-10-30.md", "/docs/rainfall-records-gauge-networks-expansion.html", "/docs/rainfall-records-gauge-networks-expansion.md", "/handover.html", "/tools-qa/rainfall-records-content.mjs", "/tools-qa/rainfall-records-browser-qa.mjs", "/package.json"]) assert.equal((await get(path)).response.status, 404, path + " development boundary");
    report.complete = true;
  }
} catch (problem) { report.failure = problem.stack; process.exitCode = 1; }
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ complete: report.complete, productionNotChecked: report.productionNotChecked || false, scope: report.scope, requests: report.checks.length, analyticsExecuted: report.analyticsExecuted, failure: report.failure }));
