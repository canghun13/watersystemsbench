// Fresh dated release evidence; never relabel/overwrite historical browser reports.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { installPlaywrightAnalyticsBlock, isAnalyticsUrl } from "./analytics-blocker.mjs";
import { rainHub, rainTools, rainGuides, rainReferences } from "./rainfall-records-content.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = fileURLToPath(new URL("..", import.meta.url));
const base = process.env.WSB_QA_BASE || "http://127.0.0.1:4207";
const output = process.env.WSB_QA_REPORT || join(root, "tools-qa/weekly-growth-2026-10-30-local-results.json");
const images = process.env.WSB_QA_IMAGES;
const widths = [390, 768, 1024, 1280, 1440];
const newPaths = [rainHub, ...rainTools, ...rainGuides, ...rainReferences].map(x => x[0]);
const fullPaths = [...(await readFile(join(root, "sitemap.xml"), "utf8")).matchAll(/<loc>https:\/\/watersystemsbench.com([^<]+)<\/loc>/g)].map(x => x[1]);
assert.equal(fullPaths.length, 112);
const full = process.env.WSB_QA_FULL !== "0";
const matrix = process.env.WSB_QA_INTERACTIONS_ONLY !== "1";
const paths = full ? fullPaths : [...newPaths, "/", "/tools/", "/systems/wells-storage-rainwater/", "/reference/greywater-source-use-screening/", "/guides/well-borehole-tube-well-terminology/", "/tools/pressure-tank-sizing-calculator/", "/tools/groundwater-stabilization-log-analyzer/", "/tools/water-duplicate-rpd-batch-checker/"];
const local = ["127.0.0.1", "localhost"].includes(new URL(base).hostname);
const report = { date: "2026-10-30", base, scope: full ? "Full112-page local render/default/unit regression plus new-tool and protected interactions" : "15-page new-cluster/protected render matrix plus interactions", widths, renders: 0, defaults: 0, resets: 0, unitSwitches: 0, tables: 0, geometry: [], interactions: [], screenshots: [], consoleErrors: [], pageErrors: [], requestFailures: [], internalHttpFailures: [], analytics: { intercepted: 0, completed: 0 }, complete: false };
if (!matrix) report.scope = "Development interactions-only supplement; no render-matrix claim";
const digest = value => createHash("sha256").update(value.replace(/\r\n/g, "\n")).digest("hex");
async function assetFiles(dir = "assets") {
  const entries = await readdir(join(root, dir), { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? assetFiles(`${dir}/${e.name}`) : /\.(?:js|css)$/.test(e.name) ? [`${dir}/${e.name}`] : []))).flat();
}
const sourceFiles = [...fullPaths.map(path => path === "/" ? "index.html" : path.slice(1) + "index.html"), ...await assetFiles(), "partials/header.html", "partials/footer.html", "sitemap.xml", "robots.txt", "llms.txt", "tools-qa/generate-site.mjs", "tools-qa/rainfall-records-content.mjs", "tools-qa/rainfall-records-browser-qa.mjs"];
report.sourceHashes = Object.fromEntries(await Promise.all(sourceFiles.map(async path => [path, digest(await readFile(join(root, path), "utf8"))])));
if (local) await fetch(base + "/__qa__/analytics-reset", { method: "POST" });
if (images) await mkdir(images, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
report.browser = browser.version();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block", acceptDownloads: true });
await installPlaywrightAnalyticsBlock(context, report.analytics);
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
await context.addInitScript(() => { window.__printCalls = 0; window.print = () => window.__printCalls++; });
const page = await context.newPage();
page.on("console", m => { if (m.type() === "error" && !/ERR_BLOCKED_BY_CLIENT/.test(m.text())) report.consoleErrors.push(m.text()); });
page.on("pageerror", e => report.pageErrors.push(e.message));
page.on("requestfailed", r => { if (!isAnalyticsUrl(r.url())) report.requestFailures.push({ url: r.url(), error: r.failure()?.errorText }); });
page.on("response", r => { if (r.status() >= 400 && new URL(r.url()).origin === new URL(base).origin) report.internalHttpFailures.push({ url: r.url(), status: r.status() }); });
const field = name => page.locator(`[id="${name}"]`);
const fill = (name, value) => field(name).fill(String(value));
const text = () => page.locator(".result-report").innerText();
async function open(path, width) {
  await page.setViewportSize({ width, height: 900 });
  const response = await page.goto(base + path, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, path);
  await page.locator(".site-header").waitFor(); await page.locator(".site-footer").waitFor();
}
async function submit() {
  await page.locator('[data-tool-form] button[type="submit"]').click();
  await page.locator(".result-report").waitFor({ state: "visible" });
  assert.equal(await page.locator("[data-form-error]").innerText(), "");
  assert.ok(!/\b(?:NaN|Infinity)\b/.test(await text()), "finite visible report");
}
async function reset() {
  await page.locator('[data-tool-form] button[type="reset"]').click();
  await page.waitForFunction(() => document.querySelector(".result-report").hidden);
  assert.equal(await page.locator("[data-form-error]").innerText(), "");
  assert.equal(await page.locator("[data-result-action]:enabled").count(), 0);
}
async function stale() {
  assert.ok(await page.locator(".result-report").isHidden());
  assert.equal(await page.locator("[data-result-action]:enabled").count(), 0);
  assert.equal(await page.locator("[data-tool-form]").getAttribute("data-last-result"), "");
}
async function invalidRecords(bad) {
  const previous = await field("records").inputValue();
  await fill("records", bad); await stale();
  await page.locator('[data-tool-form] button[type="submit"]').click();
  assert.ok((await page.locator("[data-form-error]").innerText()).length > 0);
  await page.emulateMedia({ media: "print" }); assert.ok(await page.locator(".tool-layout").isHidden(), "invalid state has no printable report"); await page.emulateMedia({ media: "screen" });
  await stale(); await fill("records", previous); await submit();
}
async function geometry(path, width, state) {
  const g = await page.evaluate(() => {
    const visible = e => !!e.getClientRects().length && getComputedStyle(e).visibility !== "hidden";
    const box = e => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, right: b.right, bottom: b.bottom, width: b.width, height: b.height }; };
    const badControls = [...document.querySelectorAll("main h1, main input, main select, main textarea, main button, main legend, .tool-layout, .instrument-panel, .result-panel")].filter(visible).filter(e => { const b = box(e); return b.x < -1 || b.right > innerWidth + 1; }).map(e => ({ tag: e.tagName, id: e.id, box: box(e) }));
    const unlabeled = [...document.querySelectorAll("main input,main select,main textarea")].filter(visible).filter(e => e.type !== "hidden" && !e.labels?.length && !e.getAttribute("aria-label")).map(e => e.id);
    const tables = [...document.querySelectorAll("main table")].filter(visible).map(t => {
      const wrapper = t.closest(".table-scroll") || (["auto", "scroll"].includes(getComputedStyle(t).overflowX) ? t : null);
      const last = t.querySelector("thead tr:last-child > :last-child") || t.querySelector("tr:last-child > :last-child");
      if (!wrapper) { const b = box(t), l = last ? box(last) : b, side = document.querySelector(".sidebar"), sb = side && box(side); return { width: t.scrollWidth, owner: innerWidth, accessible: l.right <= innerWidth + 1, within: b.x >= -1 && b.right <= innerWidth + 1 && !(sb && sb.x > b.x && b.right > sb.x + 1), overflow: "visible" }; }
      const old = wrapper.scrollLeft; wrapper.scrollLeft = wrapper.scrollWidth;
      const b = box(wrapper), l = last ? box(last) : b;
      const item = { width: t.scrollWidth, owner: wrapper.clientWidth, accessible: l.right <= b.right + 2 && l.right > b.x, within: b.x >= -1 && b.right <= innerWidth + 1, overflow: getComputedStyle(wrapper).overflowX };
      wrapper.scrollLeft = old; return item;
    });
    return { doc: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth, h1s: document.querySelectorAll("h1").length, h1: box(document.querySelector("h1")), header: box(document.querySelector(".site-header")), badControls, unlabeled, tables, broken: [...document.images].filter(e => !e.complete || !e.naturalWidth).map(e => e.src) };
  });
  assert.equal(g.h1s, 1, path); assert.ok(g.doc <= g.viewport + 1, `${path} ${width} document overflow`);
  assert.deepEqual(g.badControls, [], `${path} ${width} ${state} controls`); assert.deepEqual(g.unlabeled, [], path); assert.deepEqual(g.broken, [], `${path} images`);
  if (state === "initial") assert.ok(g.h1.y >= g.header.bottom - 1, `${path} initial header overlap`);
  for (const t of g.tables) { assert.ok(t.accessible && t.within, `${path} ${width} table clipping`); if (t.width > t.owner + 1) assert.ok(["auto", "scroll"].includes(t.overflow)); report.tables++; }
  report.geometry.push({ path, width, state, ...g });
}
async function capture(name, selector = null, fullPage = false) {
  if (!images) return;
  if (selector) await page.locator(selector).evaluate(e => window.scrollTo({ top: Math.max(0, e.getBoundingClientRect().top + scrollY - 90), behavior: "instant" }));
  else await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: join(images, name + ".png"), fullPage });
  report.screenshots.push(name + ".png");
}
async function download(index = 0) {
  const event = page.waitForEvent("download");
  await page.locator(`[data-rain-export="${index}"]`).click();
  return readFile(await (await event).path(), "utf8");
}
function inInches(csv) { return csv.split("\n").map((line, i) => i === 0 ? line : line.split(",").map((v, j) => j === 0 || v === "" || v === "NA" ? v : String(Number(v) / 25.4)).join(",")).join("\n"); }
const upload = (name, csv) => page.locator(`[data-rain-file="${name}"]`).setInputFiles({ name: "rainfall-qa.csv", mimeType: "text/csv", buffer: Buffer.from(csv) });
async function loaded() { await page.waitForFunction(() => !document.querySelector('[data-tool-form] button[type="submit"]').disabled); }

try {
  if (matrix) for (const width of widths) {
    for (const path of paths) {
      await open(path, width); await geometry(path, width, "initial"); report.renders++;
      if (newPaths.includes(path)) await capture(`${width}-${path.split("/")[1]}-${path.split("/")[2]}-initial`, null, true);
      if (full && width === 1280 && path.startsWith("/tools/") && path !== "/tools/") {
        await submit(); report.defaults++;
        if (await page.locator("[data-unit-system]").count()) {
          await page.locator("[data-unit-system]").selectOption("US"); await submit(); report.unitSwitches++;
        }
        await reset(); report.resets++;
      }
    }
    console.log(`Render matrix: ${paths.length}/${paths.length} at ${width}px`);
  }
  assert.equal(report.renders, matrix ? paths.length * 5 : 0);
  if (matrix && full) { assert.equal(report.defaults, 59); assert.equal(report.resets, 59); }

  for (const width of widths) {
    for (const [index, [path]] of rainTools.entries()) {
      await open(path, width); await page.emulateMedia({ media: "print" }); assert.ok(await page.locator(".tool-layout").isHidden(), "uncomputed state has no printable report"); await page.emulateMedia({ media: "screen" }); await submit(); await geometry(path, width, "new-default-result");
      assert.equal(await page.locator("[data-tool-form]").evaluate(form => [...new FormData(form).entries()].length), 0, "IDs support local access without native form serialization");
      const original = await field("records").inputValue();
      const originalWeights = index === 3 ? await field("weights").inputValue() : null;
      if (index === 0) { assert.match(await page.locator(".reading-value").innerText(), /^5\s*mm/); assert.match(await text(), /Unresolved reset/); const transfer = await download(1); assert.match(transfer, /^time,rainfall\r\n/); assert.match(transfer, /03:00,NA/); assert.equal(transfer.trim().split(/\r?\n/).length, 5); }
      if (index === 1) { assert.match(await page.locator(".reading-value").innerText(), /2\s*\(2 bounded\)/); assert.match(await text(), /7 mm/); await fill("dryGapMinutes", 180); await stale(); await submit(); assert.match(await page.locator(".reading-value").innerText(), /1\s*\(0 bounded\)/); await fill("dryGapMinutes", 120); await submit(); }
      if (index === 2) { assert.match(await page.locator(".reading-value").innerText(), /\+50/); assert.equal(await page.locator("svg[aria-labelledby='rain-chart-title rain-chart-description']").count(), 1); }
      if (index === 3) { assert.match(await page.locator(".reading-value").innerText(), /2\s*\/ 3/); assert.match(await text(), /23/); assert.match(await text(), /Incomplete: no basin mean/); assert.match(await text(), /1\.5/); }
      const audit = await download(); assert.ok(audit.includes("\r\n")); assert.ok(!audit.includes("undefined"));
      await capture(`${width}-rain-tool-${index + 1}-result`, ".result-panel");
      await page.locator(".table-scroll").first().focus(); await page.keyboard.press("ArrowRight");
      await page.waitForFunction(() => document.querySelector(".table-scroll").scrollLeft > 0 || document.querySelector(".table-scroll").scrollWidth <= document.querySelector(".table-scroll").clientWidth);
      await page.locator(".table-scroll").first().evaluate(e => e.scrollLeft = e.scrollWidth);
      await geometry(path, width, "result-rightmost-column");
      await capture(`${width}-rain-tool-${index + 1}-rightmost`, ".result-panel");
      await page.locator("[data-copy-result]").click();
      await page.waitForFunction(() => document.querySelector("[data-copy-result]").textContent === "Copied");
      // Windows clipboard may canonicalize LF to CRLF; preserve every cell/line.
      const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n?/g, "\n");
      for (const marker of ["Input record", "Source depth unit: mm", path, "Full entered CSV", original]) assert.ok(copied.includes(marker), marker);
      await page.locator("[data-print-result]").click(); assert.ok(await page.evaluate(() => window.__printCalls > 0));
      await page.emulateMedia({ media: "print" });
      assert.ok(await page.locator(".instrument-panel").isHidden()); assert.ok(await page.locator(".content-layout").isHidden()); assert.ok(await page.locator(".rain-input-record").isVisible());
      assert.ok(await page.locator(".site-header").isHidden()); assert.ok(await page.locator(".site-footer").isHidden()); assert.ok(await page.locator(".result-actions").isHidden()); assert.ok(await page.locator(".rain-downloads").isHidden());
      assert.ok(await page.locator(".rain-print-inputs").isVisible()); assert.ok((await page.locator(".rain-print-inputs").innerText()).includes(original));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
      if ([390, 1280].includes(width)) await capture(`${width}-rain-tool-${index + 1}-print`, null, true);
      await page.emulateMedia({ media: "screen" });
      await invalidRecords(""); await invalidRecords(original.replace(/,([0-9.]+)(?=\n|$)/, ",NaN"));
      await field("depthUnit").selectOption("in"); await stale(); assert.equal(await field("records").inputValue(), original, "unit selector never rewrites CSV");
      await fill("records", inInches(original)); await submit();
      if (index === 0) assert.ok(Math.abs(parseFloat(await page.locator(".reading-value").innerText()) - 5 / 25.4) < 1e-8);
      if (index === 1) assert.match(await page.locator(".reading-value").innerText(), /2\s*\(2 bounded\)/);
      if (index === 2) assert.match(await page.locator(".reading-value").innerText(), /\+50/);
      if (index === 3) assert.match(await page.locator(".reading-value").innerText(), /2\s*\/ 3/);
      await reset(); assert.equal(await field("depthUnit").inputValue(), "mm"); assert.equal(await field("records").inputValue(), original);
      if (originalWeights) assert.equal(await field("weights").inputValue(), originalWeights);
      await submit();
      await upload("records", "bad,header\n1,2"); await loaded(); await stale();
      await page.locator('[type="submit"]').click(); assert.ok((await page.locator("[data-form-error]").innerText()).length > 0); await stale();
      await upload("records", original); await loaded(); await submit();
      await upload("records", original); await loaded(); await submit(); // Same filename can be read again.
      await page.locator("[data-copy-result]").hover();
      assert.deepEqual(await page.locator("[data-copy-result]").evaluate(e => ({ c: getComputedStyle(e).color, b: getComputedStyle(e).backgroundColor })), { c: "rgb(255, 255, 255)", b: "rgb(18, 62, 80)" });
      report.interactions.push({ path, width, normal: true, download: true, rightmost: true, fullClipboard: true, printHookAndMedia: true, invalidRecovery: true, stale: true, sourceUnit: true, resetRefill: true, malformedFileRecovery: true, repeatedFile: true, hover: true });
    }
    await open("/tools/", width);
    await page.locator("[data-tool-system]").selectOption("rainfall-records"); assert.equal(await page.locator("[data-tool-card]:visible").count(), 4);
    await page.locator("[data-tool-type]").selectOption("analyzer"); assert.equal(await page.locator("[data-tool-card]:visible").count(), 2);
    await page.locator("[data-tool-search]").fill("definitely-absent-qa-term"); assert.equal(await page.locator("[data-tool-card]:visible").count(), 0); assert.ok(await page.locator("[data-tool-empty]").isVisible());
    await page.locator('button[type="reset"]').click(); await page.waitForFunction(() => document.querySelectorAll("[data-tool-card]:not([hidden])").length === 59); assert.match(await page.locator("[data-tool-count]").innerText(), /59/);
    report.interactions.push({ path: "/tools/", width, rainSystem: 4, analyzer: 2, empty: true, nativeReset: 59 });
    await open("/tools/groundwater-stabilization-log-analyzer/", width);
    const positions = await page.locator(".stabilization-criteria-grid input").evaluateAll(es => es.filter(e => ["phCriterion", "temperatureCriterion", "conductivityCriterion", "doCriterion", "orpCriterion", "turbidityCriterion"].includes(e.id)).map(e => ({ x: e.getBoundingClientRect().x, y: e.getBoundingClientRect().y })));
    assert.equal(positions.length, 6);
    if (width > 900) { for (let i = 0; i < 6; i += 2) assert.ok(Math.abs(positions[i].y - positions[i + 1].y) < 2); } else assert.ok(positions.every(p => Math.abs(p.x - positions[0].x) < 2));
    await submit(); assert.match(await text(), /MET/);
    report.interactions.push({ path: "/tools/groundwater-stabilization-log-analyzer/", width, alignment: true, default: true });
    await open("/tools/pressure-tank-sizing-calculator/", width); await submit(); assert.match(await text(), /135\.5/);
    await field("compareMode").selectOption("rated"); await fill("ratedDrawdown", 50); await field("ratingBasis").selectOption("confirmed"); await submit(); assert.match(await text(), /125%/);
    await fill("ratedDrawdown", 32); assert.equal(await field("ratingBasis").inputValue(), "unverified");
    report.interactions.push({ path: "/tools/pressure-tank-sizing-calculator/", width, originalDefault: true, matchedRating: true, editRevokesConfirmation: true });
    for (const path of ["/reference/greywater-source-use-screening/", "/guides/well-borehole-tube-well-terminology/", rainReferences[0][0]]) { await open(path, width); await page.locator(".table-scroll").first().evaluate(e => e.scrollLeft = e.scrollWidth); await geometry(path, width, "protected-table-rightmost"); }
    console.log(`New-tool and protected interactions passed at ${width}px`);
  }

  // Explicit asynchronous file races and full export beyond the visible preview.
  await open(rainTools[0][0], 390); await submit();
  await page.evaluate(() => { window.__originalFileText = File.prototype.text; window.__pendingFileReads = []; File.prototype.text = function () { const file = this; return new Promise(resolve => window.__pendingFileReads.push(async () => resolve(await window.__originalFileText.call(file)))); }; });
  await upload("records", "time,counter\n2024-01-01 00:00,0\n2024-01-01 01:00,999");
  assert.ok(await page.locator('[type="submit"]').isDisabled()); await reset();
  await page.evaluate(async () => { await window.__pendingFileReads[0](); File.prototype.text = window.__originalFileText; });
  await submit(); assert.match(await page.locator(".reading-value").innerText(), /^5\s*mm/);
  await page.locator('[data-rain-file="records"]').setInputFiles({ name: "oversize.csv", mimeType: "text/csv", buffer: Buffer.alloc(5 * 1024 * 1024 + 1, 65) });
  await loaded(); await stale(); assert.match(await page.locator("[data-form-error]").innerText(), /5 MiB/);
  await reset(); await submit();
  const transferred = await download(1);
  await open(rainTools[1][0], 390); await upload("records", transferred); await loaded(); await submit(); assert.match(await text(), /5 mm/); assert.match(await page.locator(".reading-value").innerText(), /2\s*\(0 bounded\)/);
  await open(rainTools[0][0], 390); await fill("records", "time,counter\n2024-01-01 00:00,0\n2024-01-01 04:00,1\n2024-01-01 05:00,2"); await submit(); assert.match(await text(), /1 \/ 5 expected intervals/);
  const gapTransfer = await download(1); assert.match(gapTransfer, /2024-01-01 01:00,NA/);
  await open(rainTools[1][0], 390); await upload("records", gapTransfer); await loaded(); await submit(); assert.match(await text(), /coverage: 20%/);
  await open(rainTools[3][0], 390);
  await page.evaluate(() => { window.__originalFileText = File.prototype.text; window.__pendingFileReads = []; File.prototype.text = function () { const file = this; return new Promise(resolve => window.__pendingFileReads.push(async () => resolve(await window.__originalFileText.call(file)))); }; });
  await upload("weights", "station,weightPercent\nA,50\nB,50"); await upload("records", "period,A,B\nP1,10,20");
  await page.evaluate(async () => { await window.__pendingFileReads[1](); await window.__pendingFileReads[0](); File.prototype.text = window.__originalFileText; });
  await loaded(); await submit(); assert.match(await text(), /15/); assert.match(await page.locator(".reading-value").innerText(), /1\s*\/ 1/);
  await reset();
  const longCsv = "period,A,B,C\n" + Array.from({ length: 125 }, (_, i) => `P${i + 1},10,20,30`).join("\n");
  await fill("records", longCsv); await submit(); assert.equal(await page.locator(".rain-result-extra tbody tr").count(), 100);
  const all = await download(); assert.equal(all.trim().split(/\r?\n/).length, 126); assert.match(all, /P125,23,100,23,None,Complete entered network/);
  report.interactions.push({ path: "rainfall integration", pendingReadReset: true, oversizedFileClearsResult: true, counterToEventTransfer: true, initialGapTransferCoverage: "1/5=20%", concurrentNetworkFiles: true, previewLimit: 100, exportedRows: 125 });
  await open(rainTools[2][0], 390);
  const massRows = n => "period,target,reference\n" + Array.from({ length: n }, (_, i) => `P${i + 1},1,1`).join("\n");
  await fill("records", massRows(500)); await submit(); assert.equal(await page.locator("[data-rain-plotted-pairs]").getAttribute("data-rain-plotted-pairs"), "500"); assert.match(await page.locator("figcaption").innerText(), /All paired points/);
  await fill("records", massRows(501)); await submit(); assert.equal(await page.locator("[data-rain-plotted-pairs]").getAttribute("data-rain-plotted-pairs"), "500"); assert.match(await page.locator("figcaption").innerText(), /thinned/); assert.equal((await download()).trim().split(/\r?\n/).length, 502);
  report.interactions.push({ path: rainTools[2][0], width: 390, exact500NotThinned: true, largerPlot500OriginalPoints: true, full501RowsExported: true });
  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 }, serviceWorkers: "block" });
  await installPlaywrightAnalyticsBlock(noScript, report.analytics);
  const noScriptPage = await noScript.newPage();
  for (const [path] of rainTools) {
    const response = await noScriptPage.goto(base + path, { waitUntil: "networkidle" }); assert.equal(response.status(), 200);
    assert.ok(await noScriptPage.locator('[data-tool-form] button[type="submit"]').isDisabled());
    assert.ok(await noScriptPage.locator("[data-rain-noscript]").isVisible());
    await noScriptPage.locator("#records").fill("LOCAL_ONLY_QA_RECORD");
    assert.equal(await noScriptPage.locator("[data-tool-form]").evaluate(form => [...new FormData(form).entries()].length), 0);
  }
  await noScript.close();
  report.interactions.push({ path: "rainfall native fallback", scriptingDisabled: true, fourAnalyzeButtonsDisabled: true, fourNoticesVisible: true, nativeSerializedEntries: 0 });
  await open(rainHub[0], 390); await page.locator(".menu-toggle").click(); assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true"); await page.locator(".systems-menu summary").click(); assert.equal(await page.locator(".systems-menu-panel a").count(), 10);
  report.interactions.push({ path: rainHub[0], width: 390, tenSystemMobileMenu: true });
  for (const key of ["consoleErrors", "pageErrors", "requestFailures", "internalHttpFailures"]) assert.deepEqual(report[key], [], key);
  assert.equal(report.analytics.completed, 0);
  if (local) report.serverAnalytics = await (await fetch(base + "/__qa__/analytics-report.json")).json();
  else assert.ok(report.analytics.intercepted > 0, "production Analytics source was intercepted, not removed");
  for (const [path, expected] of Object.entries(report.sourceHashes)) assert.equal(digest(await readFile(join(root, path), "utf8")), expected, `${path} changed during QA; evidence would mix sources`);
  report.sourceStableThroughoutRun = true;
  report.complete = true;
} catch (error) { report.failure = error.stack; process.exitCode = 1; }
finally { await browser.close(); await writeFile(resolve(output), JSON.stringify(report, null, 2)); }
console.log(JSON.stringify({ complete: report.complete, renders: report.renders, defaults: report.defaults, units: report.unitSwitches, interactions: report.interactions.length, tables: report.tables, analytics: report.analytics, serverAnalytics: report.serverAnalytics, failure: report.failure }));
